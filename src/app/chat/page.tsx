
"use client"

import { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Search, 
  Pencil, 
  MessageSquare, 
  Settings, 
  Paperclip, 
  Globe, 
  Send,
  Menu,
  Bot,
  Code,
  Heart,
  BrainCircuit,
  Box,
  User,
  MoreHorizontal,
  Trash2,
  Edit
} from 'lucide-react';
import { ModelSelect, type ModelOption, allModels } from '@/components/chat/model-select';
import './chat.css';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chat } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { useChatCompletion } from '@/hooks/use-api';
import { useApiContext } from '@/contexts/ApiContext';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

type ChatSession = {
    id: string;
    title: string;
    startTime: Date;
    messages: Message[];
    userId?: string;
    createdAt: Date;
    updatedAt: Date;
};

// Mock data for chat sessions
const mockChatSessions: ChatSession[] = [

    {
        id: "chat-2",
        title: "Authentication in React",
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        userId: "user-1",
        messages: [
            {
                role: "user",
                content: "How do I implement authentication in React?"
            },
            {
                role: "assistant",
                content: "For React authentication, you can use several approaches:\n\n1. **JWT with localStorage** - Simple but less secure\n2. **OAuth providers** (Google, GitHub) - More secure\n3. **Auth0 or Firebase Auth** - Managed solutions\n4. **Custom backend with sessions** - Most control\n\nWould you like me to show you an example implementation?"
            },
            {
                role: "user",
                content: "Show me JWT implementation"
            },
            {
                role: "assistant",
                content: "Here's a basic JWT implementation:\n\n```javascript\n// Login function\nconst login = async (email, password) => {\n  const response = await fetch('/api/auth/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ email, password })\n  });\n  \n  const { token } = await response.json();\n  localStorage.setItem('token', token);\n};\n\n// Protected route component\nconst ProtectedRoute = ({ children }) => {\n  const token = localStorage.getItem('token');\n  return token ? children : <Navigate to='/login' />;\n};\n```"
            }
        ]
    },
    {
        id: "chat-3",
        title: "API Design Best Practices",
        startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        userId: "user-1",
        messages: [
            {
                role: "user",
                content: "What are the best practices for REST API design?"
            },
            {
                role: "assistant",
                content: "Here are key REST API design best practices:\n\n**1. Use HTTP methods correctly:**\n- GET: Retrieve data\n- POST: Create new resources\n- PUT: Update entire resource\n- PATCH: Partial updates\n- DELETE: Remove resources\n\n**2. Consistent URL structure:**\n- Use nouns, not verbs: `/users` not `/getUsers`\n- Use plural nouns: `/users` not `/user`\n- Hierarchical: `/users/123/posts`\n\n**3. Status codes:**\n- 200: Success\n- 201: Created\n- 400: Bad Request\n- 401: Unauthorized\n- 404: Not Found\n- 500: Server Error\n\n**4. Response format:**\n```json\n{\n  \"data\": [...],\n  \"meta\": {\n    \"total\": 100,\n    \"page\": 1,\n    \"limit\": 10\n  }\n}\n```"
            }
        ]
    },
    {
        id: "chat-4",
        title: "Database Optimization",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
        userId: "user-1",
        messages: [
            {
                role: "user",
                content: "How can I optimize my database queries?"
            },
            {
                role: "assistant",
                content: "Database optimization strategies:\n\n**1. Indexing:**\n- Add indexes on frequently queried columns\n- Use composite indexes for multi-column queries\n- Avoid over-indexing (slows writes)\n\n**2. Query optimization:**\n- Use EXPLAIN to analyze query plans\n- Avoid SELECT * (fetch only needed columns)\n- Use LIMIT for pagination\n- Optimize JOIN operations\n\n**3. Connection pooling:**\n- Reuse database connections\n- Set appropriate pool sizes\n- Monitor connection usage\n\n**4. Caching:**\n- Redis for frequently accessed data\n- Application-level caching\n- CDN for static content\n\n**5. Database design:**\n- Normalize appropriately (not over-normalize)\n- Use appropriate data types\n- Consider partitioning for large tables"
            }
        ]
    }
];

// API helper functions (for future backend integration)
const apiHelpers = {
    // Load chat sessions from API
    loadChatSessions: async (userId: string): Promise<ChatSession[]> => {
        // Replace with actual API call
        // const response = await fetch(`/api/chat-sessions?userId=${userId}`);
        // return response.json();
        return mockChatSessions;
    },

    // Save chat session to API
    saveChatSession: async (session: ChatSession): Promise<ChatSession> => {
        // Replace with actual API call
        // const response = await fetch('/api/chat-sessions', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(session)
        // });
        // return response.json();
        return session;
    },

    // Update chat session in API
    updateChatSession: async (sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> => {
        // Replace with actual API call
        // const response = await fetch(`/api/chat-sessions/${sessionId}`, {
        //     method: 'PATCH',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(updates)
        // });
        // return response.json();
        return { ...mockChatSessions[0], ...updates };
    },

    // Delete chat session from API
    deleteChatSession: async (sessionId: string): Promise<void> => {
        // Replace with actual API call
        // await fetch(`/api/chat-sessions/${sessionId}`, { method: 'DELETE' });
    }
};

const ModelSuggestionCard = ({ title, icon: Icon }: { title: string, icon: React.ElementType }) => (
    <Card className="hover:border-primary cursor-pointer">
        <CardContent className="p-4">
            <h3 className="text-sm font-semibold">{title}</h3>
            <div className="flex justify-end mt-4">
                <div className="flex -space-x-2">
                     <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
            </div>
        </CardContent>
    </Card>
);

const ExamplePrompt = ({ title, subtitle, onClick }: { title: string, subtitle: string, onClick?: () => void }) => (
    <Card 
        className="hover:border-primary cursor-pointer p-4 text-left bg-white transition-colors rounded-xl"
        onClick={onClick}
    >
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
    </Card>
)

const ChatSidebar = ({ sessions, activeSessionId, setActiveSessionId, createNewChat, onDeleteSession, onRenameSession }: { 
    sessions: ChatSession[], 
    activeSessionId: string | null, 
    setActiveSessionId: (id: string) => void, 
    createNewChat: () => void,
    onDeleteSession: (sessionId: string) => void,
    onRenameSession: (sessionId: string, newTitle: string) => void
}) => {
    
    const groupChatsByDate = (chatSessions: ChatSession[]) => {
        // Filter out untitled chats that haven't been started yet
        const startedChats = chatSessions.filter(session => 
            session.messages.length > 0 || session.title !== 'Untitled Chat'
        );
        
        return startedChats.reduce((groups, session) => {
            const date = session.startTime;
            let groupName = format(date, 'MMMM d, yyyy');
            if (isToday(date)) groupName = 'Today';
            else if (isYesterday(date)) groupName = 'Yesterday';

            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(session);
            return groups;

        }, {} as Record<string, ChatSession[]>);
    };

    const groupedSessions = groupChatsByDate(sessions);

    return (
    <aside className="flex flex-col gap-6 p-8 h-full">
        <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold">Chat</h2>
        </div>
        
        <Button 
            onClick={createNewChat}
            className="w-full bg-foreground text-background hover:bg-foreground/90 h-12 font-medium flex justify-between items-center gap-2 text-left"
        >
            <span>New Chat</span>
            <img src="/uil_plus.svg" alt="Plus" width={24} height={24} />
        </Button>
        
        <div className="relative">
            <Input placeholder="Search Chats" className="pl-3 rounded-lg" />
            <img src="/material-symbols_search.svg" alt="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ width: "24px", height: "24px" }} />

        </div>
        
        <ScrollArea className="flex-grow">
            {Object.keys(groupedSessions).length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Start a new chat to begin</p>
                </div>
            ) : (
                Object.entries(groupedSessions).map(([groupName, chatSessions]) => (
                    <div key={groupName}>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase my-2 px-3">{groupName}</h3>
                        <ul>
                            {chatSessions.map(session => (
                                <li key={session.id} className="group relative">
                                    <Button 
                                        variant={activeSessionId === session.id ? "secondary" : "ghost"}
                                        className="w-full justify-start items-start text-left flex flex-col h-auto py-2 rounded-lg pr-8"
                                        onClick={() => setActiveSessionId(session.id)}
                                    >
                                        <span className="font-medium truncate w-full">
                                            {session.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(session.startTime, { addSuffix: true })}
                                        </span>
                                    </Button>
                                    
                                    {/* Three dots menu - only visible on hover */}
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 hover:bg-muted/50"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48">
                                                <DropdownMenuItem 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const newTitle = prompt('Rename chat:', session.title);
                                                        if (newTitle && newTitle.trim() && newTitle !== session.title) {
                                                            onRenameSession(session.id, newTitle.trim());
                                                        }
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Rename
                                                </DropdownMenuItem>
                                                <DropdownMenuItem 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure you want to delete this chat?')) {
                                                            onDeleteSession(session.id);
                                                        }
                                                    }}
                                                    className="text-destructive focus:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </ScrollArea>
    </aside>
    )
}

const ChatMessage = ({ message, modelName }: { message: Message, modelName: string | undefined}) => {
    const isUser = message.role === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
             {/* {!isUser && <Avatar className="w-8 h-8"><AvatarFallback><Bot/></AvatarFallback></Avatar>} */}
            <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-lg p-3 ${isUser ? 'bg-primary text-primary-foreground' : 'bg-white border'}`}>
                     {!isUser && <p className="text-xs font-semibold mb-1">{modelName}</p>}
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {!isUser && (
                        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Box className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                </svg>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
             {/* {isUser && <Avatar className="w-8 h-8"><AvatarFallback><User/></AvatarFallback></Avatar>} */}
        </div>
    )
}

const ChatSkeleton = () => (
  <div className="flex items-start gap-3">
    <Avatar className="w-8 h-8"><AvatarFallback><Bot/></AvatarFallback></Avatar>
    <div className="flex flex-col gap-2 w-full max-w-md">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export default function ChatPage() {
    const [message, setMessage] = useState('');
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelOption | null>(
        allModels.find(m => m.value === 'gpt-4o mini') || null
    );
    const { toast } = useToast();
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const messageInputRef = useRef<HTMLInputElement>(null);
    
    // API integration
    const { mutate: sendChatMessage, loading: chatLoading } = useChatCompletion();
    const { isAuthenticated, userBalance } = useApiContext();

     const activeSession = useMemo(() => {
        return sessions.find(s => s.id === activeSessionId) || null;
    }, [sessions, activeSessionId]);
    
    const messages = activeSession?.messages || [];

    useEffect(() => {
        // Load sessions from API (currently using mock data)
        const loadSessions = async () => {
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Use API helper (currently returns mock data)
                const sessionsData = await apiHelpers.loadChatSessions('user-1');
                
                setSessions(sessionsData);
                
                // Check if there's already a new/empty chat, if not create one
                const hasNewChat = sessionsData.some(session => 
                    session.messages.length === 0 && 
                    session.title === 'Untitled Chat'
                );
                
                if (!hasNewChat) {
                    createNewChat();
                } else {
                    // Set the first new chat as active
                    const firstNewChat = sessionsData.find(session => 
                        session.messages.length === 0 && 
                        session.title === 'Untitled Chat'
                    );
                    if (firstNewChat) {
                        setActiveSessionId(firstNewChat.id);
                    }
                }
            } catch (error) {
                console.error('Failed to load chat sessions:', error);
                // Fallback to creating a new chat
                createNewChat();
            }
        };
        
        loadSessions();
    }, []);

    // Note: In a real app, you would save sessions to backend API here
    // useEffect(() => {
    //     // Save sessions to backend API whenever they change
    //     if(sessions.length > 0) {
    //         saveSessionsToAPI(sessions);
    //     }
    // }, [sessions]);

     useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const createNewChat = () => {
        // Check if there's already a new/empty chat session
        const existingNewChat = sessions.find(session => 
            session.messages.length === 0 && 
            session.title === 'Untitled Chat'
        );

        if (existingNewChat) {
            // If there's already a new chat, just switch to it
            setActiveSessionId(existingNewChat.id);
            return;
        }

        // Only create a new chat if there isn't one already
        const now = new Date();
        const newSession: ChatSession = {
            id: `chat-${Date.now()}`,
            title: 'Untitled Chat',
            startTime: now,
            createdAt: now,
            updatedAt: now,
            userId: 'user-1', // In real app, get from auth context
            messages: [],
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
    }

    const handleExamplePromptClick = (promptText: string) => {
        // Set the message input to the clicked prompt
        setMessage(promptText);
        // Focus on the input
        setTimeout(() => {
            messageInputRef.current?.focus();
        }, 100);
    }

    const handleDeleteSession = (sessionId: string) => {
        setSessions(prev => {
            const updatedSessions = prev.filter(session => session.id !== sessionId);
            // If the deleted session was active, switch to the first available session or create a new one
            if (activeSessionId === sessionId) {
                if (updatedSessions.length > 0) {
                    setActiveSessionId(updatedSessions[0].id);
                } else {
                    createNewChat();
                }
            }
            return updatedSessions;
        });
    }

    const handleRenameSession = (sessionId: string, newTitle: string) => {
        setSessions(prev => prev.map(session => 
            session.id === sessionId 
                ? { ...session, title: newTitle, updatedAt: new Date() }
                : session
        ));
    }

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedModel || !activeSessionId) {
            toast({
                title: "Cannot send message",
                description: !selectedModel ? "Please select a model first." : !activeSessionId ? "No active chat." : "Please enter a message.",
                variant: 'destructive'
            });
            return;
        }
        
        const isFirstMessage = messages.length === 0;

        const updatedMessages: Message[] = [...messages, { role: 'user' as const, content: message }];
        
        const updatedSessions = sessions.map(session => {
            if (session.id === activeSessionId) {
                return { 
                    ...session,
                    title: isFirstMessage ? message : session.title,
                    messages: updatedMessages,
                    updatedAt: new Date()
                };
            }
            return session;
        });
        setSessions(updatedSessions);
        
        setMessage('');
        setLoading(true);

        try {
            // Check authentication
            if (!isAuthenticated) {
                toast({
                    title: "Authentication Required",
                    description: "Please sign in with your API key to use the chat feature.",
                    variant: 'destructive'
                });
                return;
            }

            // Use real API for chat completion
            const response = await sendChatMessage({
                model: selectedModel.value,
                messages: updatedMessages,
                temperature: 0.7,
                max_tokens: 1000,
            });

            if (response) {
                const finalSessions = sessions.map(session => {
                    if (session.id === activeSessionId) {
                        return { 
                            ...session,
                            title: isFirstMessage ? message : session.title,
                            messages: [
                                ...updatedMessages,
                                {
                                    role: 'assistant' as const,
                                    content:
                                        (response &&
                                         typeof response === 'object' &&
                                         'choices' in response &&
                                         Array.isArray((response as any).choices) &&
                                         (response as any).choices[0]?.message?.content)
                                            ? (response as any).choices[0].message.content
                                            : 'No response received'
                                }
                            ],
                            updatedAt: new Date()
                        };
                    }
                    return session;
                });
                setSessions(finalSessions);
            } else {
                throw new Error('No response received');
            }
        } catch (error) {
            toast({
                title: "Error",
                description: `An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`,
                variant: 'destructive'
            });
             // Revert message update on error
             const revertedSessions = sessions.map(session => {
                if (session.id === activeSessionId) {
                    return { ...session, messages };
                }
                return session;
            });
             setSessions(revertedSessions);
        } finally {
            setLoading(false);
        }
    };
    
  return (
    <div className="h-[calc(100svh-130px)] bg-background">
        <div className="flex max-w-screen-2xl mx-auto h-[calc(100svh-130px)]">
      {/* Left Sidebar */}
        <div className="hidden lg:flex w-[320px] bg-muted/20 border-r justify-start">
          <ChatSidebar 
            sessions={sessions} 
            activeSessionId={activeSessionId} 
            setActiveSessionId={setActiveSessionId} 
            createNewChat={createNewChat}
            onDeleteSession={handleDeleteSession}
            onRenameSession={handleRenameSession}
          />
        </div>
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative px-8">
      <img 
        src="/logo_transparent.svg" 
        alt="Stats" 
        className="absolute top-8 left-1/2 transform -translate-x-1/2 w-[75vh] h-[75vh]" 
      />

       
        
        {/* Header with title and model selector */}
        <header className="relative z-10 w-[100%] flex items-center justify-between p-6 pl-24 pr-0">
          <div className="flex items-center gap-2">
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"><Menu/></Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] p-0">
                  <ChatSidebar 
                    sessions={sessions} 
                    activeSessionId={activeSessionId} 
                    setActiveSessionId={setActiveSessionId} 
                    createNewChat={createNewChat}
                    onDeleteSession={handleDeleteSession}
                    onRenameSession={handleRenameSession}
                  />
                </SheetContent>
              </Sheet>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold">{activeSession?.title || 'Untitled Chat'}</h1>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-card">
            <ModelSelect selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>
        </header>

        {/* Main content area */}
        <div className="relative z-10 w-[100%] flex-1 flex flex-col overflow-hidden h-[calc(100svh-130px)]">
          {/* Chat messages area */}
          {messages.length > 0 && (
            <div ref={chatContainerRef} className="flex-1   ml-20 flex flex-col gap-6 overflow-y-auto p-6 bg-card">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} modelName={selectedModel?.label} />
              ))}
              {loading && <ChatSkeleton />}
            </div>
          )}

          {/* Welcome screen when no messages */}
          {messages.length === 0 && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <h1 className="text-4xl font-bold mb-8">What's On Your Mind?</h1>
              
              {/* Suggested prompts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 w-full max-w-2xl">
                <ExamplePrompt 
                  title="What model is better for coding?" 
                  subtitle="Compare different AI models for programming tasks"
                  onClick={() => handleExamplePromptClick("What model is better for coding?")}
                />
                <ExamplePrompt 
                  title="How long would it take to walk to the moon?" 
                  subtitle="Calculate travel time and distance to the moon"
                  onClick={() => handleExamplePromptClick("How long would it take to walk to the moon?")}
                />
                <ExamplePrompt 
                  title="When did England last win the world cup?" 
                  subtitle="Get the latest football world cup information"
                  onClick={() => handleExamplePromptClick("When did England last win the world cup?")}
                />
                <ExamplePrompt 
                  title="Which athlete has won the most gold medals?" 
                  subtitle="Find Olympic and sports statistics"
                  onClick={() => handleExamplePromptClick("Which athlete has won the most gold medals?")}
                />
              </div>
            </div>
          )}

          {/* Message input area - fixed at bottom */}
          <div className="w-full p-6">
            <div className="w-full max-w-4xl mx-auto">
              <div className="relative">
                <div className="flex items-center gap-1 px-2 py-2 bg-white rounded-xl border">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                    <img src="/ic_outline-plus.svg" alt="Plus" width={24} height={24} />
                  </Button>
                  <Input 
                    ref={messageInputRef}
                    placeholder="Start A Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="border-0 bg-transparent focus-visible:ring-0 text-base flex-1"
                  />
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={handleSendMessage} 
                    disabled={loading || !message.trim()}
                    className="h-8 w-8"
                  >
                     <img src="/Frame 13.svg" alt="Send" width={34} height={34} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
