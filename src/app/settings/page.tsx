
"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-10">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <SettingsSection
        title="Account"
        description="Manage your login credentials, security settings, or delete your account."
      >
        <Button variant="outline">Manage Account</Button>
      </SettingsSection>

      <SettingsSection
        title="Organization"
        description="Create and manage your organization."
      >
        <Button variant="outline">Create Organization</Button>
      </SettingsSection>

      <Separator />

      <SettingsSection
        title="Low Balance Notifications"
        description="Send me emails"
        descriptionDetail="Alert notifications will be sent to jaydigital@gmail.com"
      >
        <Switch />
      </SettingsSection>

      <Separator />

      <SettingsSection
        title="Allowed Providers"
        description="Select the providers you want to exclusively enable for your requests. Additional providers can be added on API requests via the 'only' field. Enabling Always enforce will ensure that only the providers you have explicitly allowed will be used."
      >
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Always enforce
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.064.293.006.399.287.47l.45.082.082-.38-.29-.071a.499.499 0 0 1-.288-.469l.738-3.468a.499.499 0 0 1 .469-.288zM8 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>
          </label>
          <Switch />
        </div>
         <Select>
          <SelectTrigger className="w-full mt-4">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="provider1">Provider 1</SelectItem>
            <SelectItem value="provider2">Provider 2</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">No providers are specifically allowed. All non-ignored providers are used.</p>
      </SettingsSection>

      <SettingsSection
        title="Ignored Providers"
        description="Select the providers you want to exclude from serving your requests."
      >
         <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="provider1">Provider 1</SelectItem>
            <SelectItem value="provider2">Provider 2</SelectItem>
          </SelectContent>
        </Select>
         <p className="text-xs text-muted-foreground mt-2">No providers are ignored.</p>
      </SettingsSection>
      
      <Separator />

      <SettingsSection
        title="Default Provider Sort"
        description="Choose how providers should be sorted. Individual requests may still override this setting."
      >
         <Select defaultValue="balanced">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="balanced">Default (balanced)</SelectItem>
            <SelectItem value="cost">Cost</SelectItem>
             <SelectItem value="uptime">Uptime</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-2">By default, OpenRouter balances low prices with high uptime. Learn more in the <Link href="#" className="text-primary underline">Provider Routing docs</Link>.</p>
      </SettingsSection>

      <SettingsSection
        title="Default Model"
        description="Apps will use this model by default, but they may override it if they choose to do so. This model will also be used as your default fallback model."
      >
        <p className="text-xs text-muted-foreground mb-2"><Link href="#" className="text-primary underline">Click here</Link> to browse available models and prices.</p>
         <Select defaultValue="auto-router">
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="auto-router">Auto Router</SelectItem>
            <SelectItem value="gpt-4">GPT-4</SelectItem>
          </SelectContent>
        </Select>
      </SettingsSection>
    </div>
  );
}

const SettingsSection = ({ title, description, descriptionDetail, children }: { title: string, description: string, descriptionDetail?: string, children: React.ReactNode }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="md:col-span-1">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      {descriptionDetail && <p className="text-sm text-muted-foreground mt-2">{descriptionDetail}</p>}
    </div>
    <div className="md:col-span-2">
      {children}
    </div>
  </div>
);
