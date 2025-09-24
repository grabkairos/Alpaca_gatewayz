
"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarTrigger, SidebarGroup } from "@/components/ui/sidebar";

const navItems = [
  // { href: "/settings", label: "Settings" },
  { href: "/settings/account", label: "Account" },
  { href: "/settings/credits", label: "Credits" },
  { href: "/settings/activity", label: "Activity" },
  { href: "/settings/presets", label: "Presets" },
  { href: "/settings/keys", label: "API Keys" },
  { href: "/settings/provisioning", label: "Provisioning Keys" },
  { href: "/settings/integrations", label: "Integrations (BYOK)" },
  { href: "/settings/privacy", label: "Privacy" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="relative flex h-[calc(100vh-130px))]">
        <Sidebar
          variant="sidebar"
          collapsible="icon"
          className="hidden lg:flex"
        >
          <SidebarContent className="p-4">
            <SidebarGroup>
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                   <Link 
                    key={item.href} 
                    href={item.href} 
                    className={cn(
                      "px-3 py-2 rounded-md text-sm",
                      pathname === item.href
                        ? "font-semibold text-primary bg-sidebar-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold">Settings</h1>
            </div>
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
