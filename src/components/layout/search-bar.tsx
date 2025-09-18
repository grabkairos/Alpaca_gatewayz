
"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Bot } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { topModels } from '@/lib/data';
import Link from 'next/link';


export function SearchBar() {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredModels = topModels.filter(model => model.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full max-w-sm">
                    <Input 
                        type="search" 
                        placeholder="Search Models..." 
                        className="pl-3 pr-4 h-[45px]" 
                        onFocus={() => setOpen(true)}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> */}
                    <img src="/material-symbols_search.svg" alt="Search" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" style={{ width: "24px", height: "24px" }} />
                    {/* <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground border rounded-sm px-1.5 py-0.5">/</div> */}
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-1">
                 <div className="flex flex-col">
                    <p className="text-xs font-medium text-muted-foreground px-3 py-2">Top Models</p>
                    <div className="flex flex-col">
                        {filteredModels.slice(0, 7).map(model => (
                             <Link key={model.name} href={`/models/${encodeURIComponent(model.name)}`} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent" onClick={() => setOpen(false)}>
                                <Bot className="h-5 w-5"/>
                                <span className="text-sm">{model.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
