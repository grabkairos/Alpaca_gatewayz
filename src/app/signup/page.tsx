"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { AppFooter } from '@/components/layout/app-footer';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password length
    if (password.length < 8) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 8 characters',
        variant: 'destructive',
      });
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('Attempting to create account with email:', email);
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Account created successfully!' });
      router.push('/');
    } catch (error: any) {
      console.error('Sign-up error:', error);
      let errorMessage = error.message;
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password sign-up is not enabled. Please contact support.';
      } else if (error.message.includes('400')) {
        errorMessage = 'Email/password authentication is not properly configured. Please contact support.';
      }
      
      toast({
        title: 'Error creating account',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const isPasswordValid = password.length >= 8;

  return (
    <div className=" flex flex-1 items-center justify-center p-4 h-[-webkit-fill-available]" style={{ backgroundColor: '#f8f8f8' }}>
      {/* Background Logo behind the form */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image 
          src="/assets/images/logo_black.png" 
          alt="Gatewayz Background" 
          width={750} 
          height={750} 
          className="object-contain"
        />
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4 space-y-5 w-[460px]">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-[32px] font-bold font-inter" style={{ fontWeight: 700 }}>Sign Up With Email</h1>
           </div>

          {/* Email/Password Form */}
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  placeholder="email@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
                <Image 
                  src="/assets/icons/mail.png" 
                  alt="Email" 
                  width={16} 
                  height={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
                <Image 
                  src="/assets/icons/password.png" 
                  alt="Password" 
                  width={16} 
                  height={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? 
                    <Image src="/assets/icons/eye-off.png" alt="Hide password" width={16} height={16} /> : 
                    <Image src="/assets/icons/eye.png" alt="Show password" width={16} height={16} />
                  }
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"} 
                  autoComplete="new-password" 
                  required 
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
                />
                <Image 
                  src="/assets/icons/password.png" 
                  alt="Password" 
                  width={16} 
                  height={16} 
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                />
                <button 
                  type="button" 
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? 
                    <Image src="/assets/icons/eye-off.png" alt="Hide password" width={16} height={16} /> : 
                    <Image src="/assets/icons/eye.png" alt="Show password" width={16} height={16} />
                  }
                </button>
              </div>
            </div>

            {/* Password Validation */}
            <div className="text-xs text-muted-foreground">
              Password must be at least 8 characters
            </div>

            <Button 
              type="submit" 
              className="w-full !bg-black hover:!bg-gray-800 !text-white border-none"
            >
              Sign Up
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground">
            Have an existing account?{' '}
            <Link href="/signin" className="text-primary hover:underline font-medium">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
