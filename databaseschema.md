
# CTF Database Schema & Authentication Flow

## 1. Authentication Architecture (Allowlist)

This CTF event operates on a strict invite-only model. Users cannot freely sign up.

1. The organizers maintain a list of approved emails (synced from a Google Sheet to the `authorized_participants` table).
2. When a user attempts to sign up via Supabase Auth, a PostgreSQL trigger intercepts the request.
3. If the user's email exists in `authorized_participants`, the signup proceeds and their profile is created in the `users` table.
4. If the email is missing, the transaction is rolled back and the user is denied access.

---

## 2. Table Definitions

### `authorized_participants` (The Allowlist)

Stores the emails of users who are allowed to participate.

| Column            | Type         | Constraints      | Description                                   |
| :---------------- | :----------- | :--------------- | :-------------------------------------------- |
| `id`            | UUID         | PRIMARY KEY      | Unique identifier.                            |
| `email`         | VARCHAR(255) | UNIQUE, NOT NULL | The pre-approved email address.               |
| `is_registered` | BOOLEAN      | DEFAULT FALSE    | Flips to true once they successfully sign up. |
| `created_at`    | TIMESTAMPTZ  | DEFAULT NOW()    | When they were added to the allowlist.        |

### `ctf_settings` (Global State)

Controls global event state.

| Column                 | Type        | Constraints   | Description                         |
| :--------------------- | :---------- | :------------ | :---------------------------------- |
| `id`                 | INT         | PRIMARY KEY   | Always`1` (Singleton row).        |
| `start_time`         | TIMESTAMPTZ | NOT NULL      | Event start time.                   |
| `end_time`           | TIMESTAMPTZ | NOT NULL      | Event end time.                     |
| `submissions_locked` | BOOLEAN     | DEFAULT FALSE | Panic button to freeze submissions. |

### `teams`

Represents participating groups.

| Column         | Type         | Constraints      | Description                       |
| :------------- | :----------- | :--------------- | :-------------------------------- |
| `id`         | UUID         | PRIMARY KEY      | Unique identifier.                |
| `name`       | VARCHAR(255) | UNIQUE, NOT NULL | Team display name.                |
| `join_token` | VARCHAR(64)  | UNIQUE           | Code for players to join.         |
| `owner_id`   | UUID         | FOREIGN KEY      | References`users.id` (Captain). |
| `score`      | INT          | DEFAULT 0        | Cached score for leaderboards.    |
| `created_at` | TIMESTAMPTZ  | DEFAULT NOW()    | Timestamp of creation.            |

### `users`

Public profile data, tied 1:1 with Supabase `auth.users`.

| Column         | Type         | Constraints      | Description                                     |
| :------------- | :----------- | :--------------- | :---------------------------------------------- |
| `id`         | UUID         | PRIMARY KEY      | References`auth.users(id)` ON DELETE CASCADE. |
| `team_id`    | UUID         | FOREIGN KEY      | References`teams(id)` ON DELETE SET NULL.     |
| `username`   | VARCHAR(100) | UNIQUE, NOT NULL | Player display name.                            |
| `avatar_url` | TEXT         | NULLABLE         | Profile picture.                                |
| `role`       | VARCHAR(50)  | DEFAULT 'player' | Roles: 'player', 'admin', 'organizer'.          |
| `created_at` | TIMESTAMPTZ  | DEFAULT NOW()    | Timestamp of registration.                      |

### `challenges`

The CTF tasks.

| Column          | Type         | Constraints      | Description                               |
| :-------------- | :----------- | :--------------- | :---------------------------------------- |
| `id`          | UUID         | PRIMARY KEY      | Unique identifier.                        |
| `title`       | VARCHAR(255) | UNIQUE, NOT NULL | Challenge name.                           |
| `category`    | VARCHAR(100) | NOT NULL         | E.g., 'Web', 'Crypto', 'Pwn'.             |
| `description` | TEXT         | NULLABLE         | Markdown instructions.                    |
| `flag_hash`   | VARCHAR(255) | NOT NULL         | Hashed flag for Edge Function validation. |
| `points`      | INT          | NOT NULL         | Base point value.                         |
| `is_active`   | BOOLEAN      | DEFAULT TRUE     | Visibility toggle.                        |
| `created_at`  | TIMESTAMPTZ  | DEFAULT NOW()    | Timestamp of creation.                    |

### `transactions`

The immutable ledger of all flag submissions.

| Column             | Type        | Constraints           | Description                                       |
| :----------------- | :---------- | :-------------------- | :------------------------------------------------ |
| `id`             | UUID        | PRIMARY KEY           | Unique identifier.                                |
| `team_id`        | UUID        | FOREIGN KEY, NOT NULL | References`teams(id)` ON DELETE CASCADE.        |
| `user_id`        | UUID        | FOREIGN KEY, NOT NULL | References`users(id)` ON DELETE CASCADE.        |
| `challenge_id`   | UUID        | FOREIGN KEY, NOT NULL | References`challenges(id)` ON DELETE CASCADE.   |
| `submitted_flag` | TEXT        | NOT NULL              | The exact string the user attempted.              |
| `is_correct`     | BOOLEAN     | NOT NULL              | Result of the hash check.                         |
| `awarded_points` | INT         | DEFAULT 0             | Points calculated dynamically at submission time. |
| `created_at`     | TIMESTAMPTZ | DEFAULT NOW()         | Crucial for tie-breakers.                         |

### `updates`

Announcements from organizers.

| Column           | Type        | Constraints   | Description                                |
| :--------------- | :---------- | :------------ | :----------------------------------------- |
| `id`           | UUID        | PRIMARY KEY   | Unique identifier.                         |
| `title`        | TEXT        | NOT NULL      | Announcement title.                        |
| `content`      | TEXT        | NOT NULL      | Markdown body.                             |
| `is_important` | BOOLEAN     | DEFAULT FALSE | Highlight flag.                            |
| `created_by`   | UUID        | FOREIGN KEY   | References`users.id` ON DELETE SET NULL. |
| `created_at`   | TIMESTAMPTZ | DEFAULT NOW() | Timestamp of creation.                     |

---

## 3. Critical Database Constraints & Security

* **Circular Dependency Handling:** `teams` depends on `users` (for `owner_id`), and `users` depends on `teams` (for `team_id`). Tables must be created first, then foreign key constraints applied via `ALTER TABLE`.
* **Unique Solve Constraint:** Ensure a team only gets points once per challenge. Apply a composite unique index on `(team_id, challenge_id)` where `is_correct = TRUE` on the `transactions` table.
* **Row Level Security (RLS):**
  * All tables must have RLS enabled.
  * The `transactions` table must strictly limit `SELECT` queries so users can ONLY view rows matching their own `team_id`.
