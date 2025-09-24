
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
// Remove Lucide icons, we'll use PNG images instead
import Link from 'next/link';
import Image from 'next/image';
import { auth, signInWithGoogle, signInWithGithub } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  GoogleAuthProvider,
  GithubAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ApiKeyAuth } from '@/components/auth/api-key-auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [authMethod, setAuthMethod] = useState<'email' | 'api'>('email');
  const { toast } = useToast();
  const router = useRouter();

  const handleOpenResetDialog = () => {
    setResetEmail(email); // Pre-fill with current email
    setIsResetDialogOpen(true);
    setResetSuccess(false);
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      return;
    }

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
      toast({
        title: 'Reset Link Sent Successfully',
        description: `We've sent password reset instructions to ${resetEmail}. Please check your inbox and follow the link to reset your password.`,
      });
    } catch (error: any) {
      let errorMessage = error.message;
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'We couldn\'t find an account associated with this email address. Please verify the email or create a new account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address in the correct format.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'You\'ve requested too many password resets recently. Please wait 15 minutes before trying again.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Password reset service is currently unavailable. Please contact our support team for assistance.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network connection failed. Please check your internet connection and try again.';
      }
      
      toast({
        title: 'Error sending reset email',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ 
        title: 'Welcome back!', 
        description: 'You have been signed in successfully.' 
      });
      router.push('/');
    } catch (error: any) {
      let errorMessage = error.message;
      let errorTitle = 'Sign In Failed';
      
      if (error.code === 'auth/user-not-found') {
        errorTitle = 'Account Not Found';
        errorMessage = 'We couldn\'t find an account with this email address. Please verify your email or create a new account.';
      } else if (error.code === 'auth/wrong-password') {
        errorTitle = 'Authentication Failed';
        errorMessage = 'The credentials you provided are incorrect. Please check your password and try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorTitle = 'Invalid Email Format';
        errorMessage = 'Please enter a valid email address in the correct format (e.g., user@example.com).';
      } else if (error.code === 'auth/user-disabled') {
        errorTitle = 'Account Suspended';
        errorMessage = 'Your account has been temporarily suspended. Please contact our support team for assistance.';
      } else if (error.code === 'auth/too-many-requests') {
        errorTitle = 'Security Limit Reached';
        errorMessage = 'We\'ve detected multiple unsuccessful sign-in attempts. For your security, please wait a few minutes before trying again or reset your password.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorTitle = 'Service Temporarily Unavailable';
        errorMessage = 'Email authentication is currently unavailable. Please try signing in with Google or GitHub, or contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorTitle = 'Connection Issue';
        errorMessage = 'Unable to connect to our servers. Please check your internet connection and try again.';
      } else if (error.code === 'auth/invalid-credential') {
        errorTitle = 'Invalid Credentials';
        errorMessage = 'The email or password you entered is incorrect. Please verify your credentials and try again.';
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
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
    try {
      await signInWithGoogle();
      toast({ title: 'Success', description: 'Signed in with Google successfully!' });
      router.push('/');
    } catch (error: any) {
      console.error('Google Sign-in Error:', error);
      
      let errorMessage = error.message;
      
      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email;
        if (email) {
          try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            const existingMethods = signInMethods.join(', ').replace('google.com', 'Google').replace('github.com', 'GitHub');
            
            errorMessage = `An account with this email already exists using ${existingMethods}. Please sign in with that method first.`;
          } catch (fetchError) {
            errorMessage = 'An account with this email already exists with a different sign-in method.';
          }
        } else {
          errorMessage = 'An account with this email already exists with a different sign-in method.';
        }
       } else if (error.code === 'auth/operation-not-allowed') {
         errorMessage = 'Google authentication is currently unavailable. Please try email sign-in or contact support.';
       } else if (error.code === 'auth/popup-blocked') {
         errorMessage = 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.';
       } else if (error.code === 'auth/popup-closed-by-user') {
         errorMessage = 'Sign-in process was cancelled. Please try again to complete authentication.';
       } else if (error.code === 'auth/network-request-failed') {
         errorMessage = 'Network connection failed. Please check your internet connection and try again.';
       }
      
      toast({
        title: 'Error signing in with Google',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      toast({ title: 'Success', description: 'Signed in with GitHub successfully!' });
      router.push('/');
    } catch (error: any) {
      console.error('GitHub Sign-in Error:', error);
      
      let errorMessage = error.message;
      
      // Handle account exists with different credential
      if (error.code === 'auth/account-exists-with-different-credential') {
        const email = error.customData?.email || error.email || error.credential?.email;
        
        if (email) {
          try {
            const signInMethods = await fetchSignInMethodsForEmail(auth, email);
            
            if (signInMethods.length > 0) {
              const existingMethods = signInMethods
                .map(method => method.replace('google.com', 'Google').replace('github.com', 'GitHub'))
                .join(', ');
              
              errorMessage = `An account with email "${email}" already exists using ${existingMethods}. Please sign in with that method first.`;
            } else {
              // Check if there's a verifiedProvider in the error
              const verifiedProviders = error.customData?._tokenResponse?.verifiedProvider;
              
              if (verifiedProviders && verifiedProviders.length > 0) {
                const providers = verifiedProviders
                  .map((p: string) => p.replace('google.com', 'Google').replace('github.com', 'GitHub'))
                  .join(', ');
                errorMessage = `An account with email "${email}" already exists using ${providers}. Please sign in with that method first.`;
              } else {
                errorMessage = `An account with email "${email}" already exists with a different sign-in method. Please try signing in with Google first.`;
              }
            }
          } catch (fetchError) {
            errorMessage = `This email "${email}" is already registered with a different sign-in method. Please try signing in with Google first.`;
          }
        } else {
          errorMessage = 'This email is already registered with a different sign-in method. Please try signing in with Google first.';
        }
       } else if (error.code === 'auth/operation-not-allowed') {
         errorMessage = 'GitHub authentication is currently unavailable. Please try email sign-in or contact support.';
       } else if (error.code === 'auth/popup-blocked') {
         errorMessage = 'Your browser blocked the sign-in popup. Please allow popups for this site and try again.';
       } else if (error.code === 'auth/popup-closed-by-user') {
         errorMessage = 'Sign-in process was cancelled. Please try again to complete authentication.';
       } else if (error.code === 'auth/network-request-failed') {
         errorMessage = 'Network connection failed. Please check your internet connection and try again.';
       }
      
      toast({
        title: 'Error signing in with GitHub',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4" style={{ backgroundColor: '#f8f8f8', height: '-webkit-fill-available' }}>
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
            <h1 className="text-[32px] font-bold font-inter" style={{ fontWeight: 700 }}>
              {authMethod === 'email' ? 'Sign In With Email' : 'Sign In With API Key'}
            </h1>
            
            {/* Auth Method Toggle */}
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  authMethod === 'email'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Email
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('api')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  authMethod === 'api'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                API Key
              </button>
            </div>
          </div>

          {/* Conditional Auth Forms */}
          {authMethod === 'email' ? (
            <><form className="space-y-4" onSubmit={handleSignIn}>
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
                    className="pl-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" />
                  <Image
                    src="/assets/icons/mail.png"
                    alt="Email"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        onClick={handleOpenResetDialog}
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] w-[425px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                          Enter your email address and we'll send you a link to reset your password.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="min-h-[200px] flex flex-col justify-between space-y-4">
                        {resetSuccess ? (
                          <>
                            <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                              <AlertDescription className="text-green-800 dark:text-green-200">
                                <div className="space-y-2">
                                  <p className="font-medium">Reset link sent successfully!</p>
                                  <p className="text-sm">We've sent password reset instructions to <strong>{resetEmail}</strong>. Please check your inbox and follow the link to create a new password.</p>
                                  <p className="text-xs opacity-75">Don't see the email? Check your spam folder or try again in a few minutes.</p>
                                </div>
                              </AlertDescription>
                            </Alert>
                            <Button
                              onClick={() => setIsResetDialogOpen(false)}
                              className="w-full !bg-black hover:!bg-gray-800 !text-white"
                            >
                              Close
                            </Button>
                          </>
                        ) : (
                          <>
                            <form onSubmit={handlePasswordReset} className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="reset-email">Email Address</Label>
                                <Input
                                  id="reset-email"
                                  type="email"
                                  placeholder="Enter your email address"
                                  value={resetEmail}
                                  onChange={(e) => setResetEmail(e.target.value)}
                                  required />
                              </div>
                            </form>

                            <div className="flex gap-3">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsResetDialogOpen(false)}
                                className="flex-1"
                              >
                                Cancel
                              </Button>
                              <Button
                                type="submit"
                                disabled={resetLoading || !resetEmail.trim()}
                                className="flex-1 !bg-black hover:!bg-gray-800 !text-white"
                                onClick={handlePasswordReset}
                              >
                                {resetLoading ? 'Sending...' : 'Send Reset Email'}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600" />
                  <Image
                    src="/assets/icons/password.png"
                    alt="Password"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ?
                      <Image src="/assets/icons/eye-off.png" alt="Hide password" width={16} height={16} /> :
                      <Image src="/assets/icons/eye.png" alt="Show password" width={16} height={16} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full !bg-black hover:!bg-gray-800 !text-white border-none">
                Sign In
              </Button>

            </form>
               {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">Or Sign In With</span>
                </div>
              </div>
               {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={handleGithubSignIn}
                  className="w-full !bg-black hover:!bg-gray-800 !text-white border-none"
                >
                  <Image
                    src="/assets/icons/git.png"
                    alt="GitHub"
                    width={16}
                    height={16}
                    className="mr-2" />
                  GitHub
                </Button>
                <Button
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  className="w-full !bg-black hover:!bg-gray-800 !text-white border-none"
                >
                  <Image
                    src="/assets/icons/google.png"
                    alt="Google"
                    width={16}
                    height={16}
                    className="mr-2" />
                  Google
                </Button>
              </div></>
          ) : (
            <ApiKeyAuth onSuccess={() => router.push('/')} />
          )}

          {/* Sign Up Link */}
          <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
