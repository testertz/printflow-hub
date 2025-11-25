import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Plus, TrendingUp, Bell, User, BellDot } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Topbar } from '@/components/Topbar';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/stationary/dashboard' },
  { title: 'My Print Jobs', icon: Package, path: '/stationary/print-jobs' },
  { title: 'Inventory List', icon: Package, path: '/stationary/inventory' },
  { title: 'Add Item', icon: Plus, path: '/stationary/add-item' },
  { title: 'Stock Update', icon: TrendingUp, path: '/stationary/stock-update' },
  { title: 'Alerts', icon: Bell, path: '/stationary/alerts' },
  { title: 'Notifications', icon: BellDot, path: '/stationary/notifications' },
  { title: 'Profile', icon: User, path: '/stationary/profile' },
];

export const StationaryLayout = () => {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="px-6 py-4">
              <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                PrintHub
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Inventory Manager</p>
            </div>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton asChild isActive={location.pathname === item.path}>
                        <NavLink to={item.path}>
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <Topbar />
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex-1 p-6 bg-background"
          >
            <Outlet />
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};
