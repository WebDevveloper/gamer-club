import React from 'react';
import { Card, CardBody, CardHeader, Tabs, Tab, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { apiClient } from '../../api/apiClient';
import type { AnalyticsData } from '../../types';

const AnalyticsPage: React.FC = () => {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [tab, setTab] = React.useState<'revenue' | 'bookings'>('revenue');

  React.useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.analytics.getOverview();
        setData(res.data);
      } catch {
        setError('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }
  if (error || !data) {
    return <p className="text-danger text-center py-12">{error}</p>;
  }

  const revenueData = data.dailyStats.map(s => ({ date: s.date, revenue: s.revenue }));
  const bookingsData = data.dailyStats.map(s => ({ date: s.date, bookings: s.bookings }));
  const pieData = [
    { name: 'Новые', value: data.userStats.new },
    { name: 'Повторные', value: data.userStats.returning }
  ];
  const COLORS = ['#3b953b', '#357f35'];

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-2">Аналитика и отчёты</h1>
      <p className="text-default-500 mb-6">Детализированные сведения и статистика</p>

      <Card className="mb-6">
        <CardHeader>
          <Tabs selectedKey={tab} onSelectionChange={k => setTab(k as any)} aria-label="Вкладки">
            <Tab key="revenue" title={<div className="flex gap-2"><Icon icon="lucide:dollar-sign" />Доход</div>} />
            <Tab key="bookings" title={<div className="flex gap-2"><Icon icon="lucide:calendar" />Бронирования</div>} />
          </Tabs>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            {tab === 'revenue' ? (
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={v => [`₽${v}`, 'Доход']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#3b953b" />
              </LineChart>
            ) : (
              <BarChart data={bookingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="bookings" fill="#357f35" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Распределение пользователей</h2>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent*100).toFixed(0)}%`}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={v => [v, 'Пользователи']} />
            </PieChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
