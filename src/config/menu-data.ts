import {
    Home,
    Users,
    Layers,
    Settings,
    ShieldCheck,
    type LucideIcon
} from 'lucide-react'

export interface NavSubItem {
    title: string
    url: string
}

export interface NavItem {
    title: string
    url: string
    icon?: LucideIcon
    items?: NavSubItem[]
    isActive?: boolean
}

export interface NavMainType {
    navMain: NavItem[]
}

export const adminMenuData: NavMainType = {
    navMain: [
        {
            title: 'Inicio',
            url: '/admin',
            icon: Home,
            isActive: true
        },
        {
            title: 'Colecciones',
            url: '/admin/collections',
            icon: Layers,
            items: [
                {
                    title: 'Todas las Colecciones',
                    url: '/admin/collections'
                },
                {
                    title: 'Añadir Nueva',
                    url: '/admin/collections/new'
                }
            ]
        },
        {
            title: 'Usuarios',
            url: '/admin/users',
            icon: Users
        },
        {
            title: 'Configuración',
            url: '/admin/settings',
            icon: Settings
        }
    ]
}
