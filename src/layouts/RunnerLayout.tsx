import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, PackageCheck, Truck } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Topbar } from '@/components/Topbar';
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/runner/dashboard' },
  { title: 'Pickup Tasks', icon: PackageCheck, path: '/runner/pickup' },
  { title: 'Deliver Tasks', icon: Truck, path: '/runner/deliver' },
];

export const RunnerLayout = () => {
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
              <p className="text-xs text-muted-foreground mt-1">Runner Portal</p>
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
