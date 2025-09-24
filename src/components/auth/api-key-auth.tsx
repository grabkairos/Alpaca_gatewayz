/**
 * API Key Authentication Component
 * Maintains exact UI/UX while adding production authentication
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApiContext } from '@/contexts/ApiContext';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Key, CheckCircle, AlertCircle } from 'lucide-react';

interface ApiKeyAuthProps {
  onSuccess?: () => void;
}

export function ApiKeyAuth({ onSuccess }: ApiKeyAuthProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { setApiKey: setContextApiKey, isAuthenticated } = useApiContext();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your API key',
        variant: 'destructive',
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Set the API key in context (this will trigger validation)
      setContextApiKey(apiKey);
      
      toast({
        title: 'Authentication Successful',
        description: 'You have been signed in successfully',
      });
      
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Authentication Failed',
        description: 'Invalid API key. Please check your key and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsValidating(false);
    }
  };

  if (isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-xl">Authenticated</CardTitle>
          <CardDescription>
            You are successfully signed in with your API key
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => setContextApiKey(null)} 
            variant="outline" 
            className="w-full"
          >
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Key className="h-12 w-12 text-blue-500 mx-auto mb-4" />
        <CardTitle className="text-xl">Sign In with API Key</CardTitle>
        <CardDescription>
          Enter your Gatewayz API key to access the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="relative">
              <Input
                id="api-key"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="pr-10"
                disabled={isValidating}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
                disabled={isValidating}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your API key is stored locally and used to authenticate with the Gatewayz API.
            </AlertDescription>
          </Alert>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isValidating || !apiKey.trim()}
          >
            {isValidating ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Don't have an API key?</p>
          <Button variant="link" className="p-0 h-auto">
            Get your API key from Gatewayz
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
