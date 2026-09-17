import { enforceScannerAccess } from "@/lib/guards";

export default async function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await enforceScannerAccess();
  return <>{children}</>;
}
