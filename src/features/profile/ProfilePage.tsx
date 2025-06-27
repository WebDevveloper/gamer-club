import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Avatar,
  Divider,
  Tabs,
  Tab,
  Alert,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useAuthStore } from '../../stores/authStore';

const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  // Заполняем поля при загрузке user
  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) return null; // или спиннер

  let registeredDate = '—';
  if (user.createdAt) {
    registeredDate = new Date(user.createdAt).toLocaleDateString();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSaving(true);
    try {
      await updateProfile({ name, phone });
      setSuccess('Профиль успешно обновлён');
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || 'Ошибка при обновлении');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Профиль</h1>
        <p className="text-default-500">
          Просмотр и редактирование данных вашего аккаунта
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Левая колонка: аватар и роль */}
        <div className="md:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center p-6">
              <Avatar
                src={
                  user.avatar ||
                  `https://img.heroui.chat/image/avatar?w=200&h=200&u=${user.id}`
                }
                className="w-24 h-24 mb-4"
                isBordered
                color="primary"
              />
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-default-500 mb-2">{user.email}</p>
              <div className="flex items-center gap-1 text-sm text-default-400">
                <Icon
                  icon="lucide:shield"
                  className={user.role === 'admin' ? 'text-primary' : ''}
                />
                <span
                  className={
                    user.role === 'admin'
                      ? 'text-primary font-medium'
                      : ''
                  }
                >
                  {user.role === 'admin' ? 'Administrator' : 'User'}
                </span>
              </div>
              <Divider className="my-4 w-full" />
              <div className="text-sm text-default-500">
                <p>Зарегистрирован с: {registeredDate}</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Правая колонка: табы с формой */}
        <div className="md:col-span-2">
          <Tabs aria-label="Profile options">
            <Tab key="details" title="Информация">
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Личная информация</h3>
                  {!isEditing && (
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:edit" />}
                      onPress={() => {
                        setError('');
                        setSuccess('');
                        setIsEditing(true);
                      }}
                    >
                      Изменить
                    </Button>
                  )}
                </CardHeader>

                <CardBody className="p-6">
                  {/* Уведомления */}
                  {success && (
                    <Alert variant="solid" color="success" className="mb-4">
                      {success}
                    </Alert>
                  )}
                  {error && (
                    <Alert variant="solid" color="danger" className="mb-4">
                      {error}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Имя"
                      value={name}
                      onValueChange={setName}
                      isReadOnly={!isEditing}
                      variant={isEditing ? 'bordered' : 'flat'}
                      startContent={
                        <Icon
                          icon="lucide:user"
                          className="text-default-400"
                        />
                      }
                    />

                    <Input
                      label="Email"
                      value={user.email}
                      isReadOnly
                      variant="flat"
                      startContent={
                        <Icon
                          icon="lucide:mail"
                          className="text-default-400"
                        />
                      }
                      description="Email нельзя изменить"
                    />

                    <Input
                      label="Телефон"
                      value={phone}
                      onValueChange={setPhone}
                      isReadOnly={!isEditing}
                      variant={isEditing ? 'bordered' : 'flat'}
                      startContent={
                        <Icon
                          icon="lucide:phone"
                          className="text-default-400"
                        />
                      }
                    />

                    {isEditing && (
                      <div className="flex justify-end gap-2 mt-6">
                        <Button
                          variant="flat"
                          onPress={() => {
                            // Отмена: сброс полей к исходным
                            setName(user.name);
                            setPhone(user.phone || '');
                            setError('');
                            setSuccess('');
                            setIsEditing(false);
                          }}
                        >
                          Отмена
                        </Button>
                        <Button
                          color="primary"
                          type="submit"
                          isLoading={isSaving}
                          isDisabled={
                            isSaving ||
                            (name === user.name &&
                              phone === (user.phone || ''))
                          }
                        >
                          Сохранить
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
                <CardBody className="p-6 space-y-6">
                  <div>
                    <h4 className="text-medium font-medium mb-2">
                      Сменить пароль
                    </h4>
                    <p className="text-default-500 text-sm mb-4">
                      Обновите ваш пароль для безопасности аккаунта
                    </p>
                    <Button
                      color="primary"
                      variant="flat"
                      startContent={<Icon icon="lucide:lock" />}
                      onPress={() =>
                        // перейти на отдельную страницу или открыть модалку
                        // navigate('/change-password')
                        alert('Функция смены пароля ещё не реализована')
                      }
                    >
                      Изменить пароль
                    </Button>
                  </div>

                  <Divider />

                  <div>
                    <h4 className="text-medium font-medium mb-2">
                      Двухфакторная аутентификация
                    </h4>
                    <p className="text-default-500 text-sm mb-4">
                      Защитите аккаунт дополнительно
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