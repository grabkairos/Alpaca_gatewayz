
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut as firebaseSignOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import type { User } from "firebase/auth";
import Link from "next/link";

interface UserNavProps {
  user: User;
}

export function UserNav({ user }: UserNavProps) {
  const { toast } = useToast();
  const router = useRouter();
  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({ title: "Signed out successfully" });
      router.push("/signin");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const getInitials = (email: string | null) => {
    if (!email) return "U";
    return email[0].toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="relative h-10 w-10 rounded-lg bg-white border-gray-200 hover:bg-white p-0">
          <div className="h-7 w-7 rounded-full bg-card flex items-center justify-center border border-gray-300">
            <span className="text-black text-lg">{getInitials(user.displayName)}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName ?? "User"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href="/settings/account">
            <DropdownMenuItem>Account</DropdownMenuItem>
          </Link>
          <Link href="/settings/credits">
            <DropdownMenuItem>Credits</DropdownMenuItem>
          </Link>
          <Link href="/settings/keys">
            <DropdownMenuItem>Keys</DropdownMenuItem>
          </Link>
          <Link href="/settings/activity">
            <DropdownMenuItem>Activity</DropdownMenuItem>
          </Link>
          <Link href="/settings">
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </Link>
          <DropdownMenuItem>Enterprise</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
