import React from 'react';
import { Card, CardBody, CardHeader, Input, Button, Link, Checkbox, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuthStore();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Demo login helpers
  const loginAsUser = async () => {
    setEmail('user@example.com');
    setPassword('password123');
    try {
      await login('user@example.com', 'password123');
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo login failed.');
    }
  };
  
  const loginAsAdmin = async () => {
    setEmail('admin@example.com');
    setPassword('password123');
    try {
      await login('admin@example.com', 'password123');
      navigate('/admin');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Demo login failed.');
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col gap-1 text-center">
            <div className="flex justify-center">
              <Icon icon="lucide:monitor-play" className="text-primary text-4xl" />
            </div>
            <h1 className="text-2xl font-bold">Добро пожаловать в CyberClub</h1>
            <p className="text-default-500">Войдите в акаунт</p>
          </CardHeader>
          
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm mb-4">
                  {error}
                </div>
              )}
              
              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onValueChange={setEmail}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:mail" className="text-default-400" />}
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />
              
              <div className="flex items-center justify-between">
                <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
                  Запомни меня
                </Checkbox>
                <Link href="#" size="sm">Забыли пароль?</Link>
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
                  Не имеете аккаунта?{' '}
                  <Link as={RouterLink} to="/register" size="sm">
                    Зарегистрироваться
                  </Link>
                </span>
              </div>
              
              <Divider className="my-4" />
              
              <div className="space-y-2">
                <p className="text-center text-sm text-default-500 mb-2">Дэмо аккаунт</p>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="flat" 
                    color="default" 
                    onPress={loginAsUser}
                    startContent={<Icon icon="lucide:user" />}
                  >
                    Дэмо пользователя
                  </Button>
                  <Button 
                    variant="flat" 
                    color="primary" 
                    onPress={loginAsAdmin}
                    startContent={<Icon icon="lucide:shield" />}
                  >
                    Дэмо админа
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
