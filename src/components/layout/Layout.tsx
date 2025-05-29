import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Avatar, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuthStore } from '../../stores/authStore';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isBordered maxWidth="full">
        <NavbarBrand>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:monitor-play" className="text-primary text-2xl" />
            <p className="font-bold text-inherit">CyberClub</p>
          </div>
        </NavbarBrand>
        
        <NavbarContent justify="end">
          {user ? (
            <>
              <NavbarItem>
                <Button 
                  as={Link} 
                  href="/computers" 
                  variant="flat" 
                  color="primary"
                  startContent={<Icon icon="lucide:monitor" />}
                >
                  Забронировать компьютер
                </Button>
              </NavbarItem>
              
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform"
                    color="primary"
                    name={user.name}
                    size="sm"
                    src={user.avatar || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <p className="font-semibold">Войти как</p>
                    <p className="font-semibold">{user.email}</p>
                  </DropdownItem>
                  <DropdownItem key="profile_page" href="/profile">
                    Профиль
                  </DropdownItem>
                  <DropdownItem key="bookings" href="/my-bookings">
                    Моя бронь
                  </DropdownItem>
                  {isAdmin ?(
                    <DropdownItem key="admin" href="/admin">
                      Панель администратора
                    </DropdownItem>
                  ): null}
                  <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                    Выйти
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          ) : (
            <>
              <NavbarItem>
                <Button as={Link} color="primary" href="/login" variant="flat">
                  Войти
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/register">
                  Зарегистрироваться
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
      
      <div className="flex flex-1">
        {isAdmin && <Sidebar />}
        
        <main className="flex-1 p-4 md:p-6">
          <div className="fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
