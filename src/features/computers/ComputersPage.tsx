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

const statusColorMap: Record<Computer['status'], NonNullable<ChipProps['color']>> = {
  available: 'success',
  booked: 'warning',
  maintenance: 'danger'
};

const statusIconMap: Record<Computer['status'], string> = {
  available: 'lucide:check-circle',
  booked: 'lucide:clock',
  maintenance: 'lucide:tool'
};

const typeIconMap: Record<Computer['type'], string> = {
  gaming: 'lucide:gamepad-2',
  premium: 'lucide:star',
  standard: 'lucide:monitor'
};

const ComputersPage: React.FC = () => {
  const { computers, isLoading, fetchComputers } = useComputerStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState<'all' | 'gaming' | 'standard' | 'premium'>('all');
  const navigate = useNavigate();

  React.useEffect(() => {
    fetchComputers();
  }, [fetchComputers]);

  const filtered = React.useMemo(() => computers.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specs.cpu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.specs.gpu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  }), [computers, searchQuery, typeFilter]);

  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Доступные компьютеры</h1>
        <p className="text-default-500">Просмотр и бронирование компьютеров для вашей сессии</p>
      </header>

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
          selectedKeys={new Set([typeFilter])}
          onSelectionChange={keys => {
            const val = Array.from(keys)[0] as 'all' | 'gaming' | 'standard' | 'premium';
            setTypeFilter(val);
          }}
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
        {filtered.map(c => (
          <Card key={c.id} className="w-full">
            <CardBody className="relative p-0">
              <img src={c.image || '/placeholder.png'} alt={c.name} className="w-full h-48 object-cover" />
              <div className="absolute top-2 right-2">
                <Chip
                  color={statusColorMap[c.status]}
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon={statusIconMap[c.status]} />}
                >
                  {statusLabels[c.status]}
                </Chip>
              </div>
            </CardBody>

            <CardBody className="p-4">
              <h3 className="text-lg font-semibold mb-2">{c.name}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Icon icon={typeIconMap[c.type]} />
                <span className="uppercase text-xs font-medium">{c.type}</span>
              </div>
              <div className="space-y-1 text-sm">
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
              <div className="text-lg font-semibold">₽{c.hourlyRate.toFixed(2)}/ч</div>
              <Button
                color="primary"
                onPress={() => navigate(`/booking/${c.id}`)}
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
