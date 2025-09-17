
"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Info, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export default function ApiKeysPage() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">API Keys</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create API Key</Button>
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
      <p className="text-muted-foreground flex items-center gap-1">
        Create a new API key to access all models from OpenRouter <Info className="inline h-4 w-4" />
      </p>
    </div>
  );
}
