import React from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
  Spinner,
  Input,
  Card
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { apiClient } from '../../api/apiClient';
import type { User } from '../../types';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.users.getAll();
        setUsers(res.data);
      } catch {
        setError('Ошибка загрузки пользователей');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase();
    return users.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  }, [users, query]);

  const renderRole = (role: string) => (
    <Chip color={role === 'admin' ? 'primary' : 'default'} variant="flat" size="sm">
      {role === 'admin' ? 'Администратор' : 'Пользователь'}
    </Chip>
  );

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }
  if (error) {
    return <p className="text-danger text-center py-12">{error}</p>;
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-2">Управление пользователями</h1>
      <p className="text-default-500 mb-6">Просмотр и управление аккаунтами</p>

      <div className="flex justify-between mb-6 gap-4">
        <Input
          placeholder="Поиск пользователей..."
          value={query}
          onValueChange={setQuery}
          startContent={<Icon icon="lucide:search" />}
          className="md:max-w-xs"
        />
        <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
          Добавить пользователя
        </Button>
      </div>

      <Card>
        <Table removeWrapper aria-label="Таблица пользователей">
          <TableHeader>
            <TableColumn>Имя</TableColumn>
            <TableColumn>Email</TableColumn>
            <TableColumn>Роль</TableColumn>
            <TableColumn>Дата регистрации</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Пользователи не найдены">
            {filtered.map(u => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{renderRole(u.role)}</TableCell>
                <TableCell>{new Date(u.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly size="sm" variant="light" aria-label="Редактировать">
                      <Icon icon="lucide:edit" />
                    </Button>
                    <Button isIconOnly size="sm" variant="light" aria-label="Удалить" color="danger">
                      <Icon icon="lucide:trash" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default AdminUsers;
