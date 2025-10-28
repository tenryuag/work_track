import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { ordersAPI, usersAPI, customersAPI, materialsAPI } from '../services/api';
import type { Order, UserDetail, Customer, Material } from '../types';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Package,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes, customersRes, materialsRes] = await Promise.all([
        ordersAPI.getAll(),
        usersAPI.getAll(),
        customersAPI.getAll(),
        materialsAPI.getAll(),
      ]);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
      setCustomers(customersRes.data);
      setMaterials(materialsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // KPIs
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const inProgressOrders = orders.filter((o) => o.status === 'IN_PROGRESS').length;

  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());
  const ordersThisMonth = orders.filter((o) => {
    const createdDate = new Date(o.createdAt);
    return createdDate >= currentMonthStart && createdDate <= currentMonthEnd;
  }).length;

  const completionRate = totalOrders > 0 ? ((completedOrders + deliveredOrders) / totalOrders) * 100 : 0;

  // Orders by status
  const ordersByStatus = [
    { name: t('pending'), value: pendingOrders, color: '#f97316' },
    { name: t('inProgress'), value: inProgressOrders, color: '#3b82f6' },
    { name: t('completed'), value: completedOrders, color: '#22c55e' },
    { name: t('delivered'), value: deliveredOrders, color: '#a855f7' },
  ];

  // Orders by priority
  const ordersByPriority = [
    { name: t('high'), value: orders.filter((o) => o.priority === 'HIGH').length },
    { name: t('medium'), value: orders.filter((o) => o.priority === 'MEDIUM').length },
    { name: t('low'), value: orders.filter((o) => o.priority === 'LOW').length },
  ];

  // Top materials used
  const materialUsage = materials
    .map((material) => {
      const usageCount = orders.filter((o) => o.material?.id === material.id).length;
      return {
        name: material.name,
        orders: usageCount,
      };
    })
    .filter((m) => m.orders > 0)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // Top customers
  const customerOrders = customers
    .map((customer) => {
      const orderCount = orders.filter((o) => o.customer?.id === customer.id).length;
      return {
        name: customer.name,
        orders: orderCount,
      };
    })
    .filter((c) => c.orders > 0)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // Orders trend (last 6 months)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthOrders = orders.filter((o) => {
      const createdDate = new Date(o.createdAt);
      return createdDate >= monthStart && createdDate <= monthEnd;
    });

    return {
      month: format(monthDate, 'MMM yyyy'),
      orders: monthOrders.length,
      completed: monthOrders.filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED').length,
    };
  });

  // Top operators
  const operatorStats = users
    .map((user) => {
      const assignedOrders = orders.filter((o) => o.assignedTo?.id === user.id);
      const completedCount = assignedOrders.filter(
        (o) => o.status === 'COMPLETED' || o.status === 'DELIVERED'
      ).length;
      return {
        name: user.name,
        total: assignedOrders.length,
        completed: completedCount,
        rate: assignedOrders.length > 0 ? (completedCount / assignedOrders.length) * 100 : 0,
      };
    })
    .filter((u) => u.total > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard')}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{t('dashboardSubtitle')}</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('totalOrders')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{totalOrders}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {ordersThisMonth} {t('thisMonth')}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Package className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('completedOrders')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                  {completedOrders + deliveredOrders}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {completionRate.toFixed(1)}% {t('completionRate')}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('pendingOrders')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{pendingOrders}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('awaitingProcessing')}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* In Progress Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('inProgressOrders')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{inProgressOrders}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('currentlyWorking')}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('ordersByStatus')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${((percent as number) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Orders by Priority */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('ordersByPriority')}
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersByPriority}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Materials */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('topMaterialsUsed')}
            </h3>
            {materialUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={materialUsage} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">{t('noData')}</p>
            )}
          </div>

          {/* Top Customers */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('topCustomers')}
            </h3>
            {customerOrders.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={customerOrders} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-12">{t('noData')}</p>
            )}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('ordersTrend')}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#3b82f6" name={t('totalOrders')} />
              <Line type="monotone" dataKey="completed" stroke="#22c55e" name={t('completed')} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Operators */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {t('topOperators')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('operator')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('totalOrders')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('completedOrders')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('completionRate')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {operatorStats.map((operator, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {operator.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {operator.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {operator.completed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          operator.rate >= 80
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : operator.rate >= 50
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {operator.rate.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
