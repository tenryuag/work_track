import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import OrderCard from '../components/OrderCard';
import { ordersAPI } from '../services/api';
import type { Order, OrderStatus } from '../types';
import { Plus, Filter } from 'lucide-react';
import { getStatusLabel } from '../utils/translationHelpers';

const HomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedStatus === 'ALL') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === selectedStatus));
    }
  }, [selectedStatus, orders]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
      setFilteredOrders(response.data);
    } catch (err: any) {
      setError(t('fetchOrdersFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statuses: Array<{ value: OrderStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: t('all') },
    { value: 'PENDING', label: getStatusLabel('PENDING', t) },
    { value: 'IN_PROGRESS', label: getStatusLabel('IN_PROGRESS', t) },
    { value: 'COMPLETED', label: getStatusLabel('COMPLETED', t) },
  ];

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('productionOrders')}</h2>
          <p className="text-sm text-gray-600 mt-1">
            {t('totalOrders', { count: filteredOrders.length })}
          </p>
        </div>

        {isAdmin() && (
          <button
            onClick={() => navigate('/orders/new')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>{t('newOrder')}</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Filter className="h-5 w-5 text-gray-600" />
          <span className="font-medium text-gray-900">{t('filters')}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {statuses.map((status) => (
            <button
              key={status.value}
              onClick={() => setSelectedStatus(status.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedStatus === status.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.label}
              {status.value === 'ALL'
                ? ` (${orders.length})`
                : ` (${getOrdersByStatus(status.value as OrderStatus).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Orders Grid */}
      {!loading && !error && (
        <>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">{t('noOrders')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default HomePage;
