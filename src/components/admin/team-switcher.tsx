"use client"

import * as React from "react"
import { ChevronsUpDown, ShieldCheck } from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher() {
    const { isMobile } = useSidebar()
    const activeTeam = {
        name: "Anfibios y Reptiles",
        logo: ShieldCheck,
        plan: "Administrador",
    }

    // Mock list of teams, currently only one. 
    // In future this could come from props or context.
    const teams = [activeTeam];

    const MenuButtonContent = (
        <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                    {activeTeam.name}
                </span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
            </div>
            {teams.length > 1 && <ChevronsUpDown className="ml-auto" />}
        </SidebarMenuButton>
    )

    if (teams.length <= 1) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    {MenuButtonContent}
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {MenuButtonContent}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-xs text-muted-foreground">
                            Sitios
                        </DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 p-2">
                            <div className="flex size-6 items-center justify-center rounded-sm border">
                                <ShieldCheck className="size-4 shrink-0" />
                            </div>
                            Anfibios y Reptiles
                            <DropdownMenuShortcut>⌘1</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
