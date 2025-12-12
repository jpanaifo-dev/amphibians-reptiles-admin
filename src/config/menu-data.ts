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
            title: 'Sidebar.home',
            url: '/admin',
            icon: Home,
            isActive: true
        },
        {
            title: 'Sidebar.collections',
            url: '/admin/collections',
            icon: Layers,
            items: [
                {
                    title: 'Sidebar.allCollections',
                    url: '/admin/collections'
                },
                {
                    title: 'Sidebar.newCollection',
                    url: '/admin/collections/new'
                }
            ]
        },
        {
            title: 'Sidebar.users',
            url: '/admin/users',
            icon: Users
        },
        {
            title: 'Sidebar.taxonomies',
            url: '/admin/taxonomies',
            icon: Layers, // You might want to import a different icon like 'Tag' or 'Database'
            items: [
                {
                    title: 'Sidebar.classes',
                    url: '/admin/taxonomies/classes'
                },
                {
                    title: 'Sidebar.orders',
                    url: '/admin/taxonomies/orders'
                },
                {
                    title: 'Sidebar.families',
                    url: '/admin/taxonomies/families'
                },
                {
                    title: 'Sidebar.genera',
                    url: '/admin/taxonomies/genera'
                }
            ]
        },
        {
            title: 'Sidebar.settings',
            url: '/admin/settings',
            icon: Settings
        }
    ]
}
