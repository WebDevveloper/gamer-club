import React from 'react';
import { Card, CardBody, CardHeader, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { apiClient } from '../../api/apiClient';
import type { AnalyticsData } from '../../types';

const emptyAnalytics: AnalyticsData = {
  totalBookings: 0,
  totalRevenue: 0,
  activeUsers: 0,
  dailyStats: [],
  computerUsage: [],
  userStats: { new: 0, returning: 0 }
};

const AdminDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = React.useState<AnalyticsData>(emptyAnalytics);
  const [isLoading, setIsLoading]         = React.useState(true);
  const [error, setError]                 = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await apiClient.analytics.getOverview();
        setAnalyticsData(response.data);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить данные аналитики');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex justify-center py-12">
          <Spinner size="lg" color="primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="text-center py-12">
          <div className="mb-4 text-danger">
            <Icon icon="lucide:alert-circle" className="text-5xl" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ошибка загрузки данных</h3>
          <p className="text-default-500">{error}</p>
        </div>
      </div>
    );
  }

  // Подготовка данных для графиков
  const revenueData = analyticsData.dailyStats.map(stat => ({
    date: stat.date,
    revenue: stat.revenue
  }));
  const bookingsData = analyticsData.dailyStats.map(stat => ({
    date: stat.date,
    bookings: stat.bookings
  }));
  const computerUsageData = analyticsData.computerUsage
    .sort((a, b) => b.hoursBooked - a.hoursBooked)
    .slice(0, 5);
  const userTypeData = [
    { name: 'Новые пользователи', value: analyticsData.userStats.new },
    { name: 'Повторные пользователи', value: analyticsData.userStats.returning }
  ];
  const COLORS = ['#3b953b', '#215521', '#a3dca3', '#80cf80', '#357f35'];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Панель администратора</h1>
        <p className="text-default-500">Общая статистика работы клуба</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-primary-100 mr-4">
              <Icon icon="lucide:calendar" className="text-2xl text-primary" />
            </div>
            <div>
              <p className="text-default-500">Всего броней</p>
              <h3 className="text-2xl font-bold">{analyticsData.totalBookings}</h3>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-success-100 mr-4">
              <Icon icon="lucide:dollar-sign" className="text-2xl text-success" />
            </div>
            <div>
              <p className="text-default-500">Общая выручка</p>
              <h3 className="text-2xl font-bold">₽{analyticsData.totalRevenue.toFixed(2)}</h3>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center">
            <div className="p-3 rounded-full bg-warning-100 mr-4">
              <Icon icon="lucide:users" className="text-2xl text-warning" />
            </div>
            <div>
              <p className="text-default-500">Активные пользователи</p>
              <h3 className="text-2xl font-bold">{analyticsData.activeUsers}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Revenue & Bookings Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Динамика выручки</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={value => [`₽${value}`, 'Выручка']} />
                  <Area type="monotone" dataKey="revenue" stroke="#3b953b" fill="#3b953b" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Динамика броней</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookingsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="bookings" fill="#215521" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Top Computers & User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Топ-5 компьютеров по загрузке</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={computerUsageData}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 50, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="computerName" type="category" />
                  <Tooltip formatter={value => [`${value} ч`, 'Часы']} />
                  <Bar dataKey="hoursBooked" fill="#357f35">
                    {computerUsageData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Распределение пользователей</h2>
          </CardHeader>
          <CardBody>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                  >
                    {userTypeData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={value => [value, 'Пользователи']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;