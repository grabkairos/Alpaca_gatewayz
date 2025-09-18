
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Info, ChevronDown, MoreHorizontal, Copy } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

// API Key data type
interface ApiKey {
  id: number;
  name: string;
  key: string;
  limit: string;
  usage: string;
}

// Mock data for API keys
const mockApiKeys: ApiKey[] = [
  {
    id: 1,
    name: "Test Key",
    key: "gw_live_**************",
    limit: "Unlimited",
    usage: "$0"
  }
];

// Reusable ApiKeyRow component
const ApiKeyRow = ({ apiKey }: { apiKey: ApiKey }) => {
  const handleMoreClick = () => {
    // Handle more options click
    console.log('More options clicked for API key:', apiKey.id);
  };

  const handleCopyClick = () => {
    // Handle copy to clipboard
    navigator.clipboard.writeText(apiKey.key);
    console.log('API key copied to clipboard');
  };

  return (
    <div className="px-4 py-3 hover:bg-gray-50">
      <div className="grid grid-cols-5 gap-4 items-center text-sm">
        <div className="font-medium">{apiKey.name}</div>
        <div className="font-medium flex items-center gap-2">
          {apiKey.key}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0"
            onClick={handleCopyClick}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
        <div className="font-medium">{apiKey.limit}</div>
        <div className="font-medium">{apiKey.usage}</div>

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

export default function ApiKeysPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold">API Keys</h1>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">API Keys</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-black text-white h-12 px-10">Generate API Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a Key</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-1">
                    Name <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <Input id="name" placeholder='e.g. "Chatbot Key"' />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credit-limit" className="flex items-center gap-1">
                    Credit limit (optional) <Info className="h-3 w-3 text-muted-foreground" />
                  </Label>
                  <Input id="credit-limit" placeholder="Leave blank for unlimited" />
                </div>

                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <CollapsibleTrigger className="flex justify-between items-center w-full text-sm font-medium">
                    Advanced Settings
                    <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="byok-usage" className="flex items-center gap-1">
                        Include BYOK usage in limit <Info className="h-3 w-3 text-muted-foreground" />
                      </Label>
                      <Switch id="byok-usage" />
                    </div>
                     <p className="text-xs text-muted-foreground p-2 bg-muted rounded-md">
                       If enabled, this key&apos;s limit will apply to the sum of its BYOK usage and OpenRouter usage.
                     </p>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border border-gray-200 overflow-hidden border-x-0">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
            <div className="grid grid-cols-5 gap-4 text-sm font-medium">
              <div>Name</div>
              <div>Key</div>
              <div>Limit</div>
              <div>Usage</div>
              <div></div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {mockApiKeys.map((apiKey) => (
              <ApiKeyRow key={apiKey.id} apiKey={apiKey} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
