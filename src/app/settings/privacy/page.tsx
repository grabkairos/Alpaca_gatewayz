
"use client";

import { Switch } from "@/components/ui/switch";
import { Info } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const PrivacySettingRow = ({ title, description, children, defaultChecked = false }: { title: string, description: string, children: React.ReactNode, defaultChecked?: boolean }) => (
  <div className="flex items-start justify-between py-4">
    <div className="flex-1 pr-8">
      <h4 className="font-medium">{title}</h4>
      <p className="text-sm text-muted-foreground flex items-center gap-1">
        {description}
        <Info className="h-4 w-4" />
      </p>
    </div>
    <div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  </div>
);

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <div className="divide-y divide-border">{children}</div>
    </div>
);


export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Privacy</h1>
      
      <Section title="Paid Models">
        <PrivacySettingRow 
          title="Enable providers that may train on inputs"
          description="Control whether to enable paid providers that can anonymously use your data."
        />
        <PrivacySettingRow
          title="Enable input/output logging"
          description="Store inputs & outputs with OpenRouter and get a 1% discount on all LLMs."
        />
      </Section>
      
      <Section title="Free Models">
        <PrivacySettingRow
            title="Enable training and logging (chatroom and API)"
            description="Enable free providers that may publish your prompts"
            defaultChecked
        />
        <PrivacySettingRow
            title="Free endpoints may log, retain, or train on your prompts"
            description="You remain anonymous."
        />
      </Section>

      <div>
        <h3 className="text-xl font-semibold mb-2">Chat History</h3>
        <p className="text-sm text-muted-foreground">
            Your chat history in the <Link href="#" className="text-primary underline">Chatroom</Link> is stored locally on your device. If logging is enabled, only LLM inputs and outputs are saved.
        </p>
      </div>

       <div>
        <h3 className="text-xl font-semibold mb-2">Analytics Cookies</h3>
         <div className="flex items-center justify-between py-4">
            <p className="text-sm text-muted-foreground flex-1 pr-8">
                Enable analytics cookies to help us improve the user experience and site performance.
            </p>
            <Switch defaultChecked={true} />
        </div>
      </div>
    </div>
  );
}
