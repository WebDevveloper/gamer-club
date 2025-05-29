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
import { useComputerStore } from '../../stores/computerStore';
import type { Computer } from '../../types';
import { statusLabels } from '../../utils/statusMap';

const AdminComputers: React.FC = () => {
  const { computers, isLoading, fetchComputers } = useComputerStore();
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    fetchComputers();
  }, [fetchComputers]);

  const filtered = React.useMemo(() => {
    const q = searchQuery.toLowerCase();
    return computers.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.specs.cpu.toLowerCase().includes(q) ||
      c.specs.gpu.toLowerCase().includes(q)
    );
  }, [computers, searchQuery]);

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'available':   return 'success';
      case 'booked':      return 'warning';
      case 'maintenance': return 'danger';
      default:            return 'default';
    }
  };
  const getTypeColor = (t: string) => {
    switch (t) {
      case 'gaming':   return 'primary';
      case 'premium':  return 'secondary';
      case 'standard': return 'default';
      default:         return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-2">Управление компьютерами</h1>
      <p className="text-default-500 mb-6">Просмотр и управление станциями компьютеров</p>

      <div className="flex justify-between mb-6 gap-4">
        <Input
          placeholder="Поиск компьютеров..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="md:max-w-xs"
        />
        <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
          Добавить компьютер
        </Button>
      </div>

      <Card>
        <Table removeWrapper aria-label="Таблица компьютеров">
          <TableHeader>
            <TableColumn>Компьютер</TableColumn>
            <TableColumn>Тип</TableColumn>
            <TableColumn>Характеристики</TableColumn>
            <TableColumn>Ставка</TableColumn>
            <TableColumn>Статус</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Компьютеры не найдены">
            {filtered.map(c => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-12 h-12 object-cover rounded-medium"
                    />
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-default-400 text-xs">ID: {c.id}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip color={getTypeColor(c.type)} variant="flat" size="sm">
                    {c.type === 'gaming' ? 'Игровой' : c.type === 'premium' ? 'Премиум' : 'Стандарт'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <p>CPU: {c.specs.cpu}</p>
                    <p>GPU: {c.specs.gpu}</p>
                    <p>RAM: {c.specs.ram}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">₽{c.hourlyRate}/ч</span>
                </TableCell>
                <TableCell>
                  <Chip color={getStatusColor(c.status)} variant="flat" size="sm">
                    {statusLabels[c.status]}
                  </Chip>
                </TableCell>
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

export default AdminComputers;
