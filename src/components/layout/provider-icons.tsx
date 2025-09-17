
import { Bot } from 'lucide-react';

// A simple component to render an icon for a provider.
// In a real app, you'd have a mapping of provider names to actual icons.
export const ProviderIcon = ({ provider, ...props }: { provider: string, [key: string]: any }) => {
    // For now, we'll use a generic icon for all providers.
    // The specific icon can be determined based on the provider name.
    
    // A more scalable approach:
    // const icons: Record<string, React.ElementType> = {
    //     'OpenAI': OpenAIIcon,
    //     'Google': GoogleIcon,
    //     'Anthropic': AnthropicIcon,
    //     ...
    // };
    // const Icon = icons[provider] || Bot;
    // return <Icon {...props} />;

    return <Bot {...props} />;
};

