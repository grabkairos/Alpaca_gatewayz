
"use client";

/**
 * Credits Page - Reusable Data Table Implementation
 * 
 * This page demonstrates how to create a reusable data table using mock data.
 * To use with real data:
 * 1. Replace mockTransactions with your actual data source (API call, props, etc.)
 * 2. Update the Transaction interface if your data structure differs
 * 3. The TransactionRow component will automatically render all transactions
 * 4. Add loading states, error handling, and pagination as needed
 */

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Info, RefreshCw, ArrowUpRight, ChevronLeft, ChevronRight, CreditCard, MoreHorizontal } from "lucide-react";
import Link from "next/link";

// Transaction data type
interface Transaction {
  id: number;
  credits: number;
  value: number;
  date: string;
  type: 'purchase' | 'refund' | 'usage';
  description?: string;
}

// Mock data for transactions
const mockTransactions: Transaction[] = [
  {
    id: 1,
    credits: 900,
    value: 900,
    date: "17/09/2025",
    type: "purchase"
  },
  {
    id: 2,
    credits: 10,
    value: 10,
    date: "17/09/2025",
    type: "purchase"
  },
  {
    id: 3,
    credits: 70,
    value: 70,
    date: "17/09/2025",
    type: "purchase"
  },
  {
    id: 4,
    credits: 20,
    value: 20,
    date: "17/09/2025",
    type: "purchase"
  }
];

// Reusable TransactionRow component
const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  const handleMoreClick = () => {
    // Handle more options click
    console.log('More options clicked for transaction:', transaction.id);
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50">
      <div className="grid grid-cols-4 gap-4 items-center text-sm">
        <div className="font-medium">{transaction.credits} Credits</div>
        <div className="font-medium">${transaction.value}</div>
        <div className="font-medium">{transaction.date}</div>
        <div className="flex justify-end">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={handleMoreClick}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function CreditsPage() {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex justify-center ">
        <h1 className="text-3xl font-bold">Credits</h1>
        {/* <Button variant="ghost" size="icon" className="text-muted-foreground">
          <RefreshCw className="h-5 w-5" />
        </Button> */}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold mr-16">Available Balance</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-16">
              <Card 
                className="w-96 h-14 text-xl md:text-2xl font-semibold bg-gray-50 border-gray-200 px-12"
              >
                <CardContent className="py-[13px] flex items-center justify-center">
                  <span className="text-xl md:text-2xl font-bold">$1000</span><span className="text-xl md:text-2xl font-bold text-muted-foreground">~$1000.07</span>
                </CardContent>
              </Card>
            </div>
            <Button className="bg-black text-white h-12 px-20">Buy Credits</Button>
          </div>
        </div>  
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl"> */}
        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Buy Credits</CardTitle>
              <div className="flex items-center gap-2 text-sm">
                <span>Use crypto</span>
                <Switch />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button size="lg" className="w-full">Add Credits</Button>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center justify-center gap-1">
              View Usage <ArrowUpRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card> */}
        
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Auto Top-Up</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              To activate auto-top-up, you'll need a payment method that supports offline charging.
            </p> */}
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" className="w-full">Add a Payment Method</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add a Payment Method</DialogTitle>
                  <DialogDescription>
                    Enter your payment details below. Your payment information is securely stored.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input id="card-name" placeholder="John Doe" value={cardName} onChange={(e) => setCardName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input id="card-number" placeholder="**** **** **** 1234" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input id="expiry-date" placeholder="MM/YY" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary">Cancel</Button>
                  <Button type="submit">Save Card</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog> */}
          {/* </CardContent>
        </Card> */}
      {/* </div> */}

      <div className="space-y-4">
        <div className="border border-gray-200 overflow-hidden border-x-0">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-4 gap-4 text-sm font-medium">
              <div>Recent Transactions</div>
              <div>Value</div>
              <div>Date</div>
              <div></div>
            </div>
          </div>
           <div className="divide-y divide-gray-200">
             {mockTransactions.map((transaction) => (
               <TransactionRow key={transaction.id} transaction={transaction} />
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
