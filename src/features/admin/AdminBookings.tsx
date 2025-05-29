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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { format, parseISO } from 'date-fns';
import { useBookingStore } from '../../stores/bookingStore';
import type { Booking } from '../../types';
import { statusLabels } from '../../utils/statusMap';

const AdminBookings: React.FC = () => {
  const { bookings, isLoading, fetchBookings, cancelBooking } = useBookingStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filteredBookings = React.useMemo(() => {
    return bookings.filter(b => {
      const q = searchQuery.toLowerCase();
      const okSearch =
        b.userName?.toLowerCase().includes(q) ||
        b.computerName?.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const okStatus = statusFilter === 'all' || b.status === statusFilter;
      return okSearch && okStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending':   return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default:          return 'default';
    }
  };

  const handleCancel = async (id: string) => {
    try { await cancelBooking(id); }
    catch (e) { console.error(e); }
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
      <h1 className="text-2xl font-bold mb-2">Управление бронированиями</h1>
      <p className="text-default-500 mb-6">Просмотр и управление всеми бронями</p>

      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-4">
          <Input
            placeholder="Поиск бронирований..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            startContent={<Icon icon="lucide:search" className="text-default-400" />}
            className="md:max-w-xs"
          />

          <Dropdown>
            <DropdownTrigger>
              <Button variant="flat" startContent={<Icon icon="lucide:filter" />}>
                Фильтр: {statusFilter === 'all' ? 'Все' : statusLabels[statusFilter]}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Фильтр по статусу"
              selectionMode="single"
              selectedKeys={[statusFilter]}
              onSelectionChange={keys => setStatusFilter(Array.from(keys)[0] as string)}
            >
              <DropdownItem key="all">Все</DropdownItem>
              <DropdownItem key="pending">{statusLabels.pending}</DropdownItem>
              <DropdownItem key="confirmed">{statusLabels.confirmed}</DropdownItem>
              <DropdownItem key="completed">{statusLabels.completed}</DropdownItem>
              <DropdownItem key="cancelled">{statusLabels.cancelled}</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        <Button color="primary" startContent={<Icon icon="lucide:plus" />}>
          Создать бронь
        </Button>
      </div>

      <Card>
        <Table removeWrapper aria-label="Таблица бронирований">
          <TableHeader>
            <TableColumn>Пользователь</TableColumn>
            <TableColumn>Компьютер</TableColumn>
            <TableColumn>Дата и время</TableColumn>
            <TableColumn>Цена</TableColumn>
            <TableColumn>Статус</TableColumn>
            <TableColumn>Действия</TableColumn>
          </TableHeader>
          <TableBody emptyContent="Бронирований не найдено">
            {filteredBookings.map(b => (
              <TableRow key={b.id}>
                <TableCell>
                  <p className="font-medium">{b.userName}</p>
                  <p className="text-default-400 text-xs">ID: {b.userId}</p>
                </TableCell>
                <TableCell>
                  <p>{b.computerName}</p>
                  <p className="text-default-400 text-xs">ID: {b.computerId}</p>
                </TableCell>
                <TableCell>
                  <p>{format(parseISO(b.startTime), 'dd.MM.yyyy')}</p>
                  <p className="text-default-400 text-xs">
                    {format(parseISO(b.startTime), 'HH:mm')}–{format(parseISO(b.endTime), 'HH:mm')}
                  </p>
                </TableCell>
                <TableCell>
                  <span className="font-medium">₽{b.totalPrice.toFixed(2)}</span>
                </TableCell>
                <TableCell>
                  <Chip color={getStatusColor(b.status)} variant="flat" size="sm">
                    {statusLabels[b.status]}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button isIconOnly size="sm" variant="light" aria-label="Просмотр">
                      <Icon icon="lucide:eye" />
                    </Button>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button isIconOnly size="sm" variant="light" aria-label="Действия">
                          <Icon icon="lucide:more-vertical" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Действия с бронью">
                        {b.status !== 'cancelled' && b.status !== 'completed' ? (
                          <DropdownItem
                            key="cancel"
                            color="danger"
                            startContent={<Icon icon="lucide:x" />}
                            onPress={() => handleCancel(b.id)}
                          >
                            Отменить бронь
                          </DropdownItem>
                        ): null}
                      </DropdownMenu>
                    </Dropdown>
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

export default AdminBookings;
