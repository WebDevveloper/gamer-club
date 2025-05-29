import React from 'react';
import { Card, CardBody, CardHeader, Input, Button, Link, Checkbox } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const RegisterPage: React.FC = () => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [agreeTerms, setAgreeTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Validate password match
  React.useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [password, confirmPassword]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreeTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(name, email, password);
      navigate('/');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
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
            <h1 className="text-2xl font-bold">Создать аккаунт</h1>
            <p className="text-default-500">Присоединитесь к CyberClub сегодня</p>
          </CardHeader>
          
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-medium text-sm mb-4">
                  {error}
                </div>
              )}
              
              <Input
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onValueChange={setName}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
              />
              
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
                placeholder="Create a password"
                type="password"
                value={password}
                onValueChange={setPassword}
                variant="bordered"
                isRequired
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                type="password"
                value={confirmPassword}
                onValueChange={setConfirmPassword}
                variant="bordered"
                isRequired
                isInvalid={!!passwordError}
                errorMessage={passwordError}
                startContent={<Icon icon="lucide:lock" className="text-default-400" />}
              />
              
              <Checkbox isSelected={agreeTerms} onValueChange={setAgreeTerms} isRequired>
                Я согласен с<Link href="#" size="sm"></Link> <Link href="#" size="sm">Политикой Безопасности</Link>
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
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
