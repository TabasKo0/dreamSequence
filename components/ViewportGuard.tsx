"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function ViewportGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkViewport = () => {
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        const gameLevels = ['/reality', '/level-1', '/level-2', '/level-3', '/limbo', '/victory', '/level-1-return', '/level-2-return'];
        if (gameLevels.some(level => pathname.startsWith(level))) {
          router.push('/computer-view');
        }
      }
    };

    // Check on mount and pathname change
    checkViewport();

    // Check on resize
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, [pathname, router]);

  return null;
}
