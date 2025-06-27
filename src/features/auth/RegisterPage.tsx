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

const RegisterPage: React.FC = () => {
  const [name, setName]                 = React.useState('');
  const [email, setEmail]               = React.useState('');
  const [password, setPassword]         = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [agreeTerms, setAgreeTerms]     = React.useState(false);
  const [isLoading, setIsLoading]       = React.useState(false);
  const [error, setError]               = React.useState<string | null>(null);
  const [passwordError, setPasswordError] = React.useState<string | null>(null);

  const navigate = useNavigate();
  const { register, isAuthenticated, user } = useAuthStore();

  // Если уже залогинен — редиректим
  React.useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') navigate('/admin', { replace: true });
      else navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Проверяем совпадение паролей
  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Пароли не совпадают');
    } else {
      setPasswordError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Локальная валидация
    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (!agreeTerms) {
      setError('Необходимо согласиться с условиями');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      // После успешной регистрации
      if (user?.role === 'admin') navigate('/admin');
      else navigate('/');
    } catch (err: any) {
      setError(err.message || 'Ошибка регистрации. Попробуйте ещё раз.');
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
            <h1 className="text-2xl font-bold">Создать аккаунт</h1>
            <p className="text-default-500">Присоединяйтесь к CyberClub сегодня</p>
          </CardHeader>

          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Имя"
                placeholder="Введите ваше имя"
                value={name}
                onValueChange={setName}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
              />

              <Input
                label="Email"
                placeholder="Введите ваш email"
                type="email"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
              />

              <Input
                label="Пароль"
                placeholder="Придумайте пароль"
                type="password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />

              <Input
                label="Повторите пароль"
                placeholder="Повторите пароль"
                type="password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                variant="bordered"
                isRequired
                isInvalid={!!passwordError}
                errorMessage={passwordError || undefined}
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />

              <Checkbox
                isSelected={agreeTerms}
                onValueChange={setAgreeTerms}
                isRequired
              >
                Я согласен с&nbsp;
                <Link href="#" size="sm">Политикой конфиденциальности</Link>
              </Checkbox>

              <Button
                type="submit"
                color="primary"
                className="w-full"
                isLoading={isLoading}
                isDisabled={!!passwordError}
              >
                Зарегистрироваться
              </Button>

              <div className="text-center">
                <span className="text-default-500 text-sm">
                  Уже есть аккаунт?{' '}
                  <Link as={RouterLink} to="/login" size="sm">
                    Войти
                  </Link>
                </span>
              </div>

              <Divider className="my-4" />
              
              <div className="text-center text-sm text-default-500">
                После регистрации вы автоматически войдёте в систему.
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
