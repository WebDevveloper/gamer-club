import React from 'react';
import { apiClient } from '../../api/apiClient';
import type { Booking } from '../../types';
import { Spinner, Button, Card, CardBody, CardFooter } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const MyBookingsPage: React.FC = () => {
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError]       = React.useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      try {
        const resp = await apiClient.bookings.getAll();
        setBookings(resp.data);
      } catch (err: any) {
        setError(err.message || 'Не удалось загрузить данные');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center mt-6">Ошибка: {error}</p>;
  }

  if (!bookings.length) {
    return <p className="text-center mt-6">У вас пока нет броней.</p>;
  }

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-4">Мои брони</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.map(b => (
          <Card key={b.id} className="w-full">
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold">{b.computerName}</h3>
              <div className="mt-2">
                <p><strong>Статус:</strong> {b.status}</p>
                <p>
                  <strong>С:</strong> {new Date(b.startTime).toLocaleString()}
                </p>
                <p>
                  <strong>По:</strong> {new Date(b.endTime).toLocaleString()}
                </p>
              </div>
            </CardBody>
            <CardFooter className="flex justify-between items-center p-4">
              <div className="text-lg font-semibold">
                ₽{Number(b.totalPrice).toFixed(2)}
              </div>
              {b.status === 'pending' && (
                <Button
                  size="sm"
                  variant="flat"
                  color="warning"
                  onPress={() => navigate(`/booking/${b.id}`)}
                  startContent={<Icon icon="lucide:edit-2" />}
                >
                  Изменить
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookingsPage;