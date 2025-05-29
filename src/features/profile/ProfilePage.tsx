import React from 'react';
import { Card, CardBody, CardHeader, Input, Button, Avatar, Divider, Tabs, Tab } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [name, setName] = React.useState(user?.name || '');
  const [email, setEmail] = React.useState(user?.email || '');
  const [phone, setPhone] = React.useState(user?.phone || '');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      await updateProfile({ name, phone });
      setSuccess('Профиль успешно обновлен');
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка при обновлении пользователя');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <p className="text-default-500">Просмотр и изменения информации об аккаунте</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center p-6">
              <Avatar
                src={user.avatar || `https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`}
                className="w-24 h-24 mb-4"
                isBordered
                color="primary"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-default-500 mb-2">{user.email}</p>
              <div className="flex items-center gap-1 text-sm text-default-400">
                <Icon icon="lucide:shield" className={user.role === 'admin' ? 'text-primary' : ''} />
                <span className={user.role === 'admin' ? 'text-primary font-medium' : ''}>
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
              <Divider className="my-4 w-full" />
              <div className="text-sm text-default-500">
                <p>Зарегистрирован с: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </CardBody>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs aria-label="Profile options">
            <Tab key="details" title="Информация об аккаунте">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Личная информация</h3>
                  {!isEditing && (
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:edit" />}
                      onPress={() => setIsEditing(true)}
                    >
                      Изменить
                    </Button>
                  )}
                </CardHeader>
                
                <CardBody>
                  {success && (
                    <div className="bg-success-50 text-success p-3 rounded-medium text-sm mb-4">
                      {success}
                    </div>
                  )}
                  
                  {error && (
                    <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm mb-4">
                      {error}
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Имя"
                      value={name}
                      onValueChange={setName}
                      isReadOnly={!isEditing}
                      variant={isEditing ? 'bordered' : 'flat'}
                      startContent={<Icon icon="lucide:user" className="text-default-400" />}
                    />
                    
                    <Input
                      label="Почта"
                      value={email}
                      isReadOnly
                      variant="flat"
                      startContent={<Icon icon="lucide:mail" className="text-default-400" />}
                      description="Email cannot be changed"
                    />
                    
                    <Input
                      label="Номер телефона"
                      value={phone}
                      onValueChange={setPhone}
                      isReadOnly={!isEditing}
                      variant={isEditing ? 'bordered' : 'flat'}
                      startContent={<Icon icon="lucide:phone" className="text-default-400" />}
                    />
                    
                    {isEditing && (
                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          variant="flat"
                          onPress={() => {
                            setIsEditing(false);
                            setName(user.name);
                            setPhone(user.phone || '');
                          }}
                        >
                          Отмена
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          isLoading={isLoading}
                        >
                          Сохранить изменения
                        </Button>
                      </div>
                    )}
                  </form>
                </CardBody>
              </Card>
            </Tab>
            <Tab key="security" title="Безопасность">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Настройки безопасности</h3>
                </CardHeader>
                <CardBody>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-medium font-medium mb-2">Сменить пароль</h4>
                      <p className="text-default-500 text-sm mb-4">
                        Обновите ваш пароль для сохранения безопасности аккаунта
                      </p>
                      <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="lucide:lock" />}
                      >
                        Изменить пароль
                      </Button>
                    </div>
                    
                    <Divider />
                    
                    <div>
                      <h4 className="text-medium font-medium mb-2">Двух-факторная аутентификация</h4>
                      <p className="text-default-500 text-sm mb-4">
                        Обезопасьте ваш аккаунт
                      </p>
                      <Button
                        color="primary"
                        variant="flat"
                        startContent={<Icon icon="lucide:shield" />}
                        isDisabled
                      >
                        Включить 2FA
                      </Button>
                      <p className="text-xs text-default-400 mt-2">
                        Будет добавлена в будущих обновлениях
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
