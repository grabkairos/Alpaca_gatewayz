
"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MoreHorizontal } from "lucide-react";
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8 lg:min-w-[600px] xl:min-w-[1000px]">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">Account</h1>
      </div>
      
      <div className="max-w-4xl mx-auto space-y-8">

      {/* Account Details Section */}
      <div className="space-y-0">
        <h2 className="text-lg mb-6 font-bold">Account Details</h2>
        
        {/* Profile */}
        <div className="flex items-center py-4 border-y border-gray-200">
          <div className="w-1/3 text-base font-medium">Profile</div>
          <div className="w-1/3 flex items-center justify-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-card border border-gray-300">
                {getInitials(user?.displayName ?? null)}
              </AvatarFallback>
            </Avatar>
            <span className="text-base">{user?.displayName || "User"}</span>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Update Profile
            </Button>
          </div>
        </div>

        {/* Email Addresses */}
        <div className="flex items-center py-4 border-b border-gray-200">
          <div className="w-1/3 text-base font-medium">Email Addresses</div>
          <div className="w-1/3 flex flex-col items-center justify-center gap-1">
            <span className="text-base">{user?.email}</span>
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Add Email Address
            </Button>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Connected Accounts */}
        <div className="flex items-center py-4 border-b border-gray-200">
          <div className="w-1/3 text-base font-medium">Connected Accounts</div>
          <div className="w-1/3 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded text-white text-xs flex items-center justify-center font-bold">
                <img src="/ri_google-fill.svg" alt="Google" className="w-6 h-6" />
              </div>
              <span className="text-base">{user?.email}</span>
            </div>
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Connect Account
            </Button>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Password */}
        <div className="flex items-center py-4 border-b border-gray-200">
          <div className="w-1/3 text-base font-medium">Password</div>
          <div className="w-1/3 flex justify-center gap-2">
            <span className="text-base">**********</span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Reset Password
            </Button>
          </div>
        </div>
      </div>

      {/* Billing Details Section */}
      <div className="space-y-0">
        <h2 className="text-lg font-bold mb-6">Billing Details</h2>
        
        {/* Full Name */}
        <div className="flex items-center py-4 border-y border-gray-200">
          <div className="w-1/3 text-base font-medium">Full Name</div>
          <div className="w-1/3 flex justify-center">
            <span className="text-base">{user?.displayName || "Not set"}</span>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Edit Name
            </Button>
          </div>
        </div>

        {/* Billing Address */}
        <div className="flex items-center py-4 border-b border-gray-200">
          <div className="w-1/3 text-base font-medium">Billing Address</div>
          <div className="w-1/3 flex justify-center">
            <div className="text-base text-center">
              <div>Country</div>
              <div>Address Line 1</div>
              <div>Address Line 2</div>
              <div>Town or City</div>
              <div>Postal Code</div>
            </div>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Edit Address
            </Button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex items-center py-4 border-b border-gray-200">
          <div className="w-1/3 text-base font-medium">Payment Method</div>
          <div className="w-1/3 flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-5 rounded text-white text-xs flex items-center justify-center font-bold">
                <img src="/formkit_visa.svg" alt="Visa" className="w-6 h-6" />
              </div>
              <span className="text-base">**** 0000</span>
              <span className="text-xs bg-gray-100 px-1 py-1 rounded border border-gray-300">Primary</span>
            </div>
            <Button variant="link" className="text-blue-400 p-0 h-auto text-base">
              Add Payment Method
            </Button>
          </div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Account Termination Section */}
      <div className="space-y-0">
        <h2 className="text-lg font-bold mb-6">Account Termination</h2>
        
        {/* Delete Account */}
        <div className="flex items-center py-4 border-y border-gray-200">
          <div className="w-1/3 text-base font-medium">Delete Account</div>
          <div className="w-1/3"></div>
          <div className="w-1/3 flex items-center justify-end">
            <Button variant="link" className="text-red-400 p-0 h-auto text-base">
              Delete
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
