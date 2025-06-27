import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
  Checkbox,
  Divider,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const TOKEN_KEY = 'token'; // или 'auth_token', как у вас в apiClient

const LoginPage: React.FC = () => {
  const [email, setEmail]           = React.useState('');
  const [password, setPassword]     = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading]   = React.useState(false);
  const [error, setError]           = React.useState<string | null>(null);

  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuthStore();

  // Если уже залогинен — редиректим
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password /*, rememberMe если надо */);

      // Если в сторе не сохраняют локально — можно использовать это:
      // if (rememberMe) localStorage.setItem(TOKEN_KEY, yourToken);
      // else sessionStorage.setItem(TOKEN_KEY, yourToken);

      // Навигация по роли из стора
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка входа. Проверьте данные.');
    } finally {
      setIsLoading(false);
    }
  };

  // Универсальный демо-вход
  const demoLogin = async (
    demoEmail: string,
    demoPass: string,
    redirectTo: string
  ) => {
    setError(null);
    setIsLoading(true);
    try {
      await login(demoEmail, demoPass);
      localStorage.setItem(TOKEN_KEY, 'token');
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message || 'Не удалось выполнить демо-вход.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 text-center">
            <Icon icon="lucide:monitor-play" className="text-primary text-4xl mx-auto" />
            <h1 className="text-2xl font-bold">Добро пожаловать в CyberClub</h1>
            <p className="text-default-500">Войдите в аккаунт</p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email"
                placeholder="Введите email"
                type="email"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
              />

              <Input
                label="Пароль"
                placeholder="Введите пароль"
                type="password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />

              <div className="flex items-center justify-between">
                <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
                  Запомнить меня
                </Checkbox>
                <Link href="#" size="sm">
                  Забыли пароль?
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
              >
                Войти
              </Button>

              <div className="text-center">
                <span className="text-default-500 text-sm">
                  Нет аккаунта?{' '}
                  <Link as={RouterLink} to="/register" size="sm">
                    Зарегистрироваться
                  </Link>
                </span>
              </div>

              <Divider className="my-4" />

              <div className="space-y-2">
                <p className="text-center text-sm text-default-500">Демо-аккаунты</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="flat"
                    color="default"
                    onPress={() => demoLogin('user@example.com', 'password123', '/')}
                    startContent={<Icon icon="lucide:user" />}
                  >
                    Пользователь
                  </Button>
                  <Button
                    variant="flat"
                    color="primary"
                    onPress={() => demoLogin('admin@example.com', 'password123', '/admin')}
                    startContent={<Icon icon="lucide:shield" />}
                  >
                    Администратор
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
