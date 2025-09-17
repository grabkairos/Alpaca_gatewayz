
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Info, Pencil, ExternalLink } from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';

const providers = [
    { name: 'OpenAI', icon: 'openai.svg', docLink: 'https://platform.openai.com/account/api-keys' },
    { name: 'Google', icon: 'google.svg', docLink: 'https://makersuite.google.com/app/apikey' },
    { name: 'Anthropic', icon: 'anthropic.svg', docLink: 'https://console.anthropic.com/settings/keys' },
    { name: 'Mistral', icon: 'mistral.svg', docLink: 'https://console.mistral.ai/api-keys/' },
    { name: 'Cohere', icon: 'cohere.svg', docLink: 'https://dashboard.cohere.com/api-keys' },
    { name: 'Groq', icon: 'groq.svg', docLink: 'https://console.groq.com/keys' },
    { name: 'Perplexity', icon: 'perplexity.svg', docLink: 'https://docs.perplexity.ai/docs/getting-started' },
];

const ProviderRow = ({ provider }: { provider: typeof providers[0] }) => {
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="flex items-center justify-between py-3 border-b">
      <div className="flex items-center gap-4">
        <Image 
            src={`https://placehold.co/24x24.png`}
            alt={`${provider.name} logo`}
            width={24}
            height={24}
            className="rounded-md"
            data-ai-hint={`${provider.name} logo`}
        />
        <span className="font-medium">{provider.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Not configured</span>
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>Configure {provider.name}</DialogTitle>
                    <DialogDescription>
                        Paste your API key below to start using {provider.name} models.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-2">
                    <Label htmlFor="api-key">{provider.name} API Key</Label>
                    <Textarea 
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder={`Enter your ${provider.name} API key`}
                    />
                    <Link href={provider.docLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline flex items-center gap-1">
                        Find your API key <ExternalLink className="h-4 w-4" />
                    </Link>
                </div>
                 <DialogFooter>
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};


export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Integrations (BYOK)
          <Info className="h-4 w-4 text-muted-foreground" />
        </h1>
        <p className="text-muted-foreground">
          Use your own provider API keys to access OpenRouter.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          {providers.map(provider => (
            <ProviderRow key={provider.name} provider={provider} />
          ))}
        </CardContent>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Priority and Fallback</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
           <p>OpenRouter always prioritizes using your provider keys when available.</p>
           <p>By default, if your key encounters a rate limit or failure, OpenRouter will fall back to using shared OpenRouter credits.</p>
           <p>You can configure individual keys with "Always use this key" to prevent any fallback to OpenRouter credits. When enabled, OpenRouter will only use your key for requests to that provider.</p>
        </CardContent>
      </Card>

    </div>
  );
}
