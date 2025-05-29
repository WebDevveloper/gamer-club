import React from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardBody, CardHeader, Tabs, Tab, Chip, Button, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { format, parseISO } from 'date-fns';
import { useBookingStore } from '../../stores/bookingStore';
import type { Booking } from '../../types';
import { statusLabels } from '../../utils/statusMap';

const MyBookingsPage: React.FC = () => {
  const loc = useLocation();
  const { bookings, fetchBookings, cancelBooking, isLoading } = useBookingStore();
  const [tab, setTab] = React.useState<'active'|'past'>('active');
  const [msg, setMsg] = React.useState(loc.state?.success ? loc.state.message : '');

  React.useEffect(() => { fetchBookings(); }, [fetchBookings]);
  React.useEffect(() => {
    if (msg) setTimeout(() => setMsg(''), 5000);
  }, [msg]);

  const now = new Date();
  const active = bookings.filter(b => parseISO(b.endTime) > now && b.status !== 'cancelled');
  const past   = bookings.filter(b => parseISO(b.endTime) <= now || b.status === 'cancelled');

  const getColor = (s: string) => {
    switch (s) {
      case 'confirmed': return 'success';
      case 'pending':   return 'warning';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      default:          return 'default';
    }
  };

  const renderCard = (b: Booking) => {
    const start = parseISO(b.startTime), end = parseISO(b.endTime);
    const isPast = end < new Date();
    return (
      <Card key={b.id} className="mb-4">
        <CardBody className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold">{b.computerName}</h3>
            <Chip color={getColor(b.status)} variant="flat" size="sm" className="mb-2">
              {statusLabels[b.status]}
            </Chip>
            <p>{format(start,'dd.MM.yyyy')}</p>
            <p>{format(start,'HH:mm')}–{format(end,'HH:mm')}</p>
            <p>₽{b.totalPrice.toFixed(2)}</p>
          </div>
          <div className="flex flex-col gap-2">
            {!isPast && b.status !== 'cancelled' && (
              <Button color="danger" variant="flat" size="sm" onPress={() => cancelBooking(b.id)}>
                Отменить
              </Button>
            )}
            <Button variant="flat" size="sm">
              Подробнее
            </Button>
          </div>
        </CardBody>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="page-container flex justify-center py-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      {msg && (
        <div className="bg-success-50 text-success p-4 rounded mb-6 flex justify-between">
          <span>{msg}</span>
          <Button isIconOnly size="sm" variant="light" onPress={() => setMsg('')}>
            <Icon icon="lucide:x" />
          </Button>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-2">Мои бронирования</h1>
      <p className="text-default-500 mb-6">Просмотр и управление вашими бронями</p>

      <Card>
        <CardHeader>
          <Tabs selectedKey={tab} onSelectionChange={k => setTab(k as any)} aria-label="Вкладки">
            <Tab key="active" title={`Активные (${active.length})`} />
            <Tab key="past"   title={`История (${past.length})`} />
          </Tabs>
        </CardHeader>
        <CardBody>
          {tab === 'active' ? active.map(renderCard) : past.map(renderCard)}
        </CardBody>
      </Card>
    </div>
  );
};

export default MyBookingsPage;
