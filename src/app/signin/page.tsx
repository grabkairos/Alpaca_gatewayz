
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup 
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M21.35 11.1h-9.2v2.8h5.3c-.2 1.9-1.5 3.3-3.4 3.3-2.1 0-3.8-1.7-3.8-3.8s1.7-3.8 3.8-3.8c1.1 0 2.1.4 2.8 1.1l2.2-2.2C17.2 6.4 15.2 5 12.95 5c-3.9 0-7 3.1-7 7s3.1 7 7 7c4.1 0 6.6-2.8 6.6-6.6 0-.5 0-1-.1-1.4z"/>
  </svg>
);

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Signed in successfully!' });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      toast({ title: 'Success', description: 'Account created successfully! Please sign in.' });
    } catch (error: any) {
        toast({
            title: 'Error creating account',
            description: error.message,
            variant: 'destructive',
        });
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Success', description: 'Signed in with Google successfully!' });
      router.push('/');
    } catch (error: any) {
      toast({
        title: 'Error signing in with Google',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-black">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-100 to-white dark:from-blue-900/20 dark:to-black"
        style={{
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgb(207, 234, 250) 0%, rgb(255, 255, 255) 90%), radial-gradient(circle at 80% 70%, rgb(224, 238, 247) 0%, rgb(255, 255, 255) 90%)',
        }}
      ></div>

      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/60 dark:bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl p-8 space-y-6 border border-white/20">
            <div className="flex justify-center">
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-2 border border-white/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </div>
            </div>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sign in with email</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                Make a new doc to bring your words, data, and teams together. For free
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
                <div className="relative mt-1">
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    placeholder="name@company.com"
                    className="pl-10 bg-white/70 dark:bg-black/70 border-gray-300 dark:border-gray-700"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                 <div className="flex items-center justify-between">
                   <Label htmlFor="password"className="text-gray-700 dark:text-gray-300">Password</Label>
                   <Link href="#" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                      Forgot password?
                   </Link>
                 </div>
                <div className="relative mt-1">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    autoComplete="current-password" 
                    required 
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-white/70 dark:bg-black/70 border-gray-300 dark:border-gray-700"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-200">
                  Get Started
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white/60 dark:bg-black/60 px-2 text-gray-500 dark:text-gray-400 backdrop-blur-sm">Or sign in with</span>
              </div>
            </div>

            <div>
                <Button variant="outline" className="w-full bg-white/70 dark:bg-black/70 border-gray-300 dark:border-gray-700" onClick={handleGoogleSignIn}>
                    <GoogleIcon className="w-5 h-5 mr-2"/>
                    Sign in with Google
                </Button>
            </div>

             <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <button onClick={handleSignUp} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
