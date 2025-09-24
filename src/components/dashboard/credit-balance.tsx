/**
 * Credit Balance Component
 * Displays user's credit balance and usage information
 */

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserBalance } from '@/hooks/use-api';
import { useApiContext } from '@/contexts/ApiContext';
import { CreditCard, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CreditBalance() {
  const { data: balance, loading, error, refetch } = useUserBalance();
  const { isAuthenticated } = useApiContext();

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit Balance
          </CardTitle>
          <CardDescription>Sign in to view your credit balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-muted-foreground">Please sign in to view your credits</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit Balance
          </CardTitle>
          <CardDescription>Loading your credit information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Credit Balance
          </CardTitle>
          <CardDescription>Error loading credit information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentBalance = balance?.balance || 0;
  const totalUsed = balance?.totalUsed || 0;
  const isLowBalance = currentBalance < 10;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Credit Balance
            </CardTitle>
            <CardDescription>Your current credit usage</CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="ghost" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Balance</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${isLowBalance ? 'text-red-500' : 'text-green-500'}`}>
                {currentBalance.toLocaleString()}
              </span>
              <Badge variant={isLowBalance ? 'destructive' : 'secondary'}>
                {isLowBalance ? 'Low' : 'Good'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Used</span>
            <span className="text-lg font-semibold text-muted-foreground">
              {totalUsed.toLocaleString()}
            </span>
          </div>

          {balance?.usage && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">{balance.usage.thisMonth || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Last Month</span>
                <span className="font-medium">{balance.usage.lastMonth || 0}</span>
              </div>
            </div>
          )}

          {isLowBalance && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                Your credit balance is low. Consider adding more credits to continue using the service.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
