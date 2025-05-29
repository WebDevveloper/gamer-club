import React from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Input,
  Select,
  SelectItem,
  Spinner,
  type ChipProps
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useComputerStore } from '../../stores/computerStore';
import type { Computer } from '../../types';
import { statusLabels } from '../../utils/statusMap';

const ComputersPage: React.FC = () => {
  const { computers, isLoading, fetchComputers } = useComputerStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [type, setType] = React.useState<string>('all');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchComputers();
  }, [fetchComputers]);

  const filteredComputers = React.useMemo(() => {
    return computers.filter(computer => {
      const matchesSearch = 
        computer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        computer.specs.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        computer.specs.gpu.toLowerCase().includes(searchQuery.toLowerCase());
  
      const matchesType = type === 'all' || computer.type === type;
      return matchesSearch && matchesType;
    });
  }, [computers, searchQuery, type]);

  const handleBookComputer = (computerId: string) => {
    navigate(`/booking/${computerId}`);
  };

  const getStatusColor = (status: string): NonNullable<ChipProps['color']> => {
    switch (status) {
      case 'available':   return 'success';
      case 'booked':      return 'warning';
      case 'maintenance': return 'danger';
      default:            return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':   return 'lucide:check-circle';
      case 'booked':      return 'lucide:clock';
      case 'maintenance': return 'lucide:tool';
      default:            return 'lucide:help-circle';
    }
  };

  const getComputerTypeIcon = (type: string) => {
    switch (type) {
      case 'gaming':   return 'lucide:gamepad-2';
      case 'premium':  return 'lucide:star';
      case 'standard': return 'lucide:monitor';
      default:         return 'lucide:monitor';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Доступные компьютеры</h1>
        <p className="text-default-500">
          Просмотр и бронирование компьютеров для вашей сессии
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Поиск компьютеров..."
          value={searchQuery}
          onValueChange={setSearchQuery}
          startContent={<Icon icon="lucide:search" />}
          className="md:max-w-xs"
        />
        
        <Select
          placeholder="Фильтр по типу"
          selectedKeys={[type]}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value)}
          className="md:max-w-xs"
          startContent={<Icon icon="lucide:filter" />}
        >
          <SelectItem key="all">Все типы</SelectItem>
          <SelectItem key="gaming">Игровой</SelectItem>
          <SelectItem key="premium">Премиум</SelectItem>
          <SelectItem key="standard">Стандарт</SelectItem>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredComputers.map(c => (
          <Card key={c.id} className="w-full">
            <CardBody className="relative p-0">
              <img
                src={c.image}
                alt={c.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Chip
                  color={getStatusColor(c.status)}
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon={getStatusIcon(c.status)} />}
                >
                  {c.type === 'gaming'   ? 'Игровой'
                    : c.type === 'premium' ? 'Премиум'
                    : 'Стандарт'}
                  {statusLabels[c.status]}
                </Chip>
              </div>
            </CardBody>
            
            <CardBody className="p-4">
              <h3 className="text-lg font-semibold">{c.name}</h3>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-default-500">CPU:</span> {c.specs.cpu}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-default-500">GPU:</span> {c.specs.gpu}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-default-500">RAM:</span> {c.specs.ram}
                </div>
              </div>
            </CardBody>
            
            <CardFooter className="flex justify-between items-center p-4">
              <div className="text-lg font-semibold">
                ₽{c.hourlyRate}/ч
              </div>
              <Button
                color="primary"
                onPress={() => handleBookComputer(c.id)}
                isDisabled={c.status !== 'available'}
                startContent={<Icon icon="lucide:calendar-plus" />}
              >
                {c.status === 'available' ? 'Забронировать' : 'Недоступен'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComputersPage;
