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
  Calendar,
} from 'lucide-react';
import {
  format,
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from 'date-fns';

type DateRange = 'today' | 'week' | 'month' | 'last3months' | 'last6months' | 'year' | 'all' | 'custom';

const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

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

  // Filter orders by date range
  const filteredOrders = React.useMemo(() => {
    console.log('=== FILTERING ORDERS ===');
    console.log('Date Range:', dateRange);
    console.log('Total orders:', orders.length);

    // Get date range bounds inside useMemo
    const now = new Date();
    let bounds = null;

    switch (dateRange) {
      case 'today':
        bounds = { start: startOfDay(now), end: endOfDay(now) };
        break;
      case 'week':
        bounds = { start: startOfWeek(now), end: endOfWeek(now) };
        break;
      case 'month':
        bounds = { start: startOfMonth(now), end: endOfMonth(now) };
        break;
      case 'last3months':
        bounds = { start: subMonths(now, 3), end: now };
        break;
      case 'last6months':
        bounds = { start: subMonths(now, 6), end: now };
        break;
      case 'year':
        bounds = { start: startOfYear(now), end: endOfYear(now) };
        break;
      case 'custom':
        if (customStartDate && customEndDate) {
          bounds = {
            start: startOfDay(new Date(customStartDate)),
            end: endOfDay(new Date(customEndDate)),
          };
        }
        break;
      case 'all':
      default:
        bounds = null;
    }

    console.log('Bounds:', bounds);

    if (!bounds) {
      console.log('No bounds, returning all orders');
      return orders;
    }

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      const isInRange = orderDate >= bounds.start && orderDate <= bounds.end;
      return isInRange;
    });

    console.log('Filtered orders:', filtered.length);
    console.log('First few orders:', orders.slice(0, 3).map(o => ({
      product: o.product,
      createdAt: o.createdAt,
      parsed: new Date(o.createdAt)
    })));

    return filtered;
  }, [orders, dateRange, customStartDate, customEndDate]);

  // KPIs (using filtered orders)
  const totalOrders = filteredOrders.length;
  const completedOrders = filteredOrders.filter((o) => o.status === 'COMPLETED').length;
  const deliveredOrders = filteredOrders.filter((o) => o.status === 'DELIVERED').length;
  const pendingOrders = filteredOrders.filter((o) => o.status === 'PENDING').length;
  const inProgressOrders = filteredOrders.filter((o) => o.status === 'IN_PROGRESS').length;

  const completionRate = totalOrders > 0 ? ((completedOrders + deliveredOrders) / totalOrders) * 100 : 0;

  // Orders by status (filter out 0 values to avoid overlapping labels)
  const ordersByStatus = [
    { name: t('pending'), value: pendingOrders, color: '#f97316' },
    { name: t('inProgress'), value: inProgressOrders, color: '#3b82f6' },
    { name: t('completed'), value: completedOrders, color: '#22c55e' },
    { name: t('delivered'), value: deliveredOrders, color: '#a855f7' },
  ].filter((status) => status.value > 0);

  // Orders by priority (filter out 0 values)
  const ordersByPriority = [
    { name: t('high'), value: filteredOrders.filter((o) => o.priority === 'HIGH').length },
    { name: t('medium'), value: filteredOrders.filter((o) => o.priority === 'MEDIUM').length },
    { name: t('low'), value: filteredOrders.filter((o) => o.priority === 'LOW').length },
  ].filter((priority) => priority.value > 0);

  // Top materials used
  const materialUsage = materials
    .map((material) => {
      const usageCount = filteredOrders.filter((o) => o.material?.id === material.id).length;
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
      const orderCount = filteredOrders.filter((o) => o.customer?.id === customer.id).length;
      return {
        name: customer.name,
        orders: orderCount,
      };
    })
    .filter((c) => c.orders > 0)
    .sort((a, b) => b.orders - a.orders)
    .slice(0, 5);

  // Orders trend (last 6 months) - filtered by date range
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const monthDate = subMonths(new Date(), 5 - i);
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const monthOrders = filteredOrders.filter((o) => {
      const createdDate = new Date(o.createdAt);
      return createdDate >= monthStart && createdDate <= monthEnd;
    });

    return {
      month: format(monthDate, 'MMM yyyy'),
      orders: monthOrders.length,
      completed: monthOrders.filter((o) => o.status === 'COMPLETED' || o.status === 'DELIVERED').length,
    };
  });

  // Top operators - filtered by date range
  const operatorStats = users
    .map((user) => {
      const assignedOrders = filteredOrders.filter((o) => o.assignedTo?.id === user.id);
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

        {/* Date Range Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('dateRange')}:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDateRange('today')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'today'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('today')}
              </button>
              <button
                onClick={() => setDateRange('week')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('thisWeek')}
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('thisMonth')}
              </button>
              <button
                onClick={() => setDateRange('last3months')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'last3months'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('last3Months')}
              </button>
              <button
                onClick={() => setDateRange('last6months')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'last6months'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('last6Months')}
              </button>
              <button
                onClick={() => setDateRange('year')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('thisYear')}
              </button>
              <button
                onClick={() => setDateRange('all')}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  dateRange === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {t('allTime')}
              </button>
            </div>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="mt-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('startDate')}
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('endDate')}
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          )}

          <button
            onClick={() => setDateRange('custom')}
            className={`mt-4 px-3 py-1.5 text-sm rounded-lg transition ${
              dateRange === 'custom'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {t('customRange')}
          </button>
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
                  {t('inSelectedRange')}
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
