import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  Divider,
  Input
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { format, addHours, isAfter, parseISO } from 'date-fns';
import { useComputerStore } from '../../stores/computerStore';
import { useBookingStore } from '../../stores/bookingStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BookingPage: React.FC = () => {
  const { computerId } = useParams<{ computerId: string }>();
  const navigate = useNavigate();
  const { computers, fetchComputers, getComputerById } = useComputerStore();
  const { createBooking, isLoading: bookingLoading } = useBookingStore();

  const [date, setDate] = React.useState('');
  const [time, setTime] = React.useState('');
  const [duration, setDuration] = React.useState(1);
  const [error, setError] = React.useState('');
  const [price, setPrice] = React.useState(0);

  React.useEffect(() => {
    if (!computers.length) fetchComputers();
  }, [computers.length, fetchComputers]);

  const comp = getComputerById(computerId || '');
  React.useEffect(() => {
    if (comp) setPrice(comp.hourlyRate * duration);
  }, [comp, duration]);

  React.useEffect(() => {
    const now = new Date();
    now.setHours(now.getHours()+1,0,0,0);
    setDate(format(now,'yyyy-MM-dd'));
    setTime(format(now,'HH:mm'));
  }, []);

  if (!comp) return <LoadingSpinner message="Загрузка..." />;

  const handleSubmit = async () => {
    setError('');
    const start = parseISO(`${date}T${time}`);
    if (!isAfter(start, new Date())) {
      setError('Время должно быть в будущем');
      return;
    }
    const end = addHours(start, duration);
    try {
      await createBooking({ computerId: comp.id, startTime: start.toISOString(), endTime: end.toISOString() });
      navigate('/my-bookings', { state: { success: true, message: 'Успешно забронировано!' } });
    } catch (e) {
      setError('Ошибка при создании брони');
    }
  };

  return (
    <div className="page-container">
      <Button variant="flat" startContent={<Icon icon="lucide:arrow-left" />} onPress={() => navigate('/computers')}>
        Назад к списку
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader><h1 className="text-2xl font-bold">Бронирование компьютера</h1></CardHeader>
            <CardBody>
              <div className="flex gap-6">
                <img src={comp.image} alt={comp.name} className="w-1/3 h-48 object-cover rounded-medium" />
                <div>
                  <h2 className="text-xl font-semibold mb-2">{comp.name}</h2>
                  <p>Ставка: ₽{comp.hourlyRate}/ч</p>
                </div>
              </div>
              <Divider className="my-6" />
              {error && <p className="text-danger mb-4">{error}</p>}
              <Input type="date" label="Дата" value={date} onValueChange={setDate} min={format(new Date(),'yyyy-MM-dd')} />
              <Input type="time" label="Время начала" value={time} onValueChange={setTime} />
              <div className="mt-4 mb-4">
                <span>Длительность: </span>
                <Button isIconOnly variant="flat" onPress={() => setDuration(d => Math.max(1,d-1))} disabled={duration<=1}>
                  <Icon icon="lucide:minus" />
                </Button>
                <span className="mx-2">{duration} ч</span>
                <Button isIconOnly variant="flat" onPress={() => setDuration(d => Math.min(8,d+1))} disabled={duration>=8}>
                  <Icon icon="lucide:plus" />
                </Button>
              </div>
              <p className="font-medium">Итого: ₽{price.toFixed(2)}</p>
            </CardBody>
            <CardFooter>
              <Button color="primary" onPress={handleSubmit} isLoading={bookingLoading}>
                Подтвердить бронь
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
