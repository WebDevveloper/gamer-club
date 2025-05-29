import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { label: 'Dashboard', path: '/admin', icon: 'lucide:layout-dashboard' },
    { label: 'Users', path: '/admin/users', icon: 'lucide:users' },
    { label: 'Computers', path: '/admin/computers', icon: 'lucide:monitor' },
    { label: 'Bookings', path: '/admin/bookings', icon: 'lucide:calendar' },
    { label: 'Analytics', path: '/admin/analytics', icon: 'lucide:bar-chart-2' },
  ];
  
  return (
    <aside className="w-64 bg-content1 border-r border-divider hidden md:block">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">Панель администратора</h2>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                as={Link}
                to={item.path}
                variant={isActive ? 'flat' : 'light'}
                color={isActive ? 'primary' : 'default'}
                className="w-full justify-start"
                startContent={<Icon icon={item.icon} />}
              >
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
