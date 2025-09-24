
"use client";

import Link from 'next/link';

export function AppFooter() {

  return (
    <footer className="z-50 w-full h-[65px] border-t border-footer-border bg-header flex items-center">
      <div className="container flex h-14 justify-center items-center px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center gap-6 mx-auto">
          <Link href="/" className="flex items-center space-x-2">
            {/* <span className="font-bold sm:inline-block">GATEWAYZ</span> */}
            <img src="/logo_black.svg" alt="Gatewayz" style={{ width: "100%", height: "100%" }} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
