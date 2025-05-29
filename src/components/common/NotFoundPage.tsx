import React from 'react';
import { Button } from '@heroui/react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="mb-6 text-9xl font-bold text-primary">404</div>
      <h1 className="text-4xl font-bold mb-4">Страница не найдена</h1>
      <p className="text-lg text-default-500 mb-8 max-w-md">
        Страница не существует либо не найдена.
      </p>
      <Button
        as={Link}
        to="/"
        color="primary"
        size="lg"
        startContent={<Icon icon="lucide:home" />}
      >
        Домой
      </Button>
    </div>
  );
};

export default NotFoundPage;
