import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { ordersAPI } from '../services/api';
import type { Order, OrderStatus, StatusChangeRequest } from '../types';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  RefreshCw,
  Trash2,
  Settings,
} from 'lucide-react';
import {
  formatDate,
  formatDateTime,
  getPriorityColor,
  getStatusColor,
  isOverdue,
} from '../utils/helpers';
import {
  getPriorityLabel,
  getStatusLabel,
} from '../utils/translationHelpers';
import { useAuth } from '../context/AuthContext';

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusChangeData, setStatusChangeData] = useState<StatusChangeRequest>({
    newStatus: 'IN_PROGRESS',
    comment: '',
  });
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(Number(id));
      setOrder(response.data);
    } catch (err: any) {
      setError(t('fetchOrderFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!order) return;

    try {
      setUpdatingStatus(true);
      await ordersAPI.updateStatus(order.id, statusChangeData);
      setShowStatusModal(false);
      setStatusChangeData({ newStatus: 'IN_PROGRESS', comment: '' });
      fetchOrder(); // Reload order
    } catch (err: any) {
      alert(t('updateStatusFailed'));
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async () => {
    if (!order || !window.confirm(t('confirmDelete'))) return;

    try {
      await ordersAPI.delete(order.id);
      navigate('/');
    } catch (err: any) {
      alert(t('deleteFailed'));
    }
  };

  const availableStatuses: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">{t('loading')}</p>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </Layout>
    );
  }

  const overdue = isOverdue(order.deadline) && order.status !== 'COMPLETED';

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t('back')}</span>
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{order.product}</h2>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                    order.priority
                  )}`}
                >
                  {t('priority')}: {getPriorityLabel(order.priority, t)}
                </span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {getStatusLabel(order.status, t)}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowStatusModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="h-4 w-4" />
                <span>{t('changeStatus')}</span>
              </button>

              {isAdmin() && (
                <button
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{t('delete')}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('orderDetails')}</h3>

              {order.description && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{t('description')}</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{order.description}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('assignedTo')}</span>
                  </div>
                  <p className="text-gray-900">{order.assignedTo.name}</p>
                  <p className="text-sm text-gray-500">{order.assignedTo.email}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('createdBy')}</span>
                  </div>
                  <p className="text-gray-900">{order.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{order.createdBy.email}</p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('deadline')}</span>
                  </div>
                  <p className={`font-medium ${overdue ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(order.deadline)}
                    {overdue && ` (${t('overdue')})`}
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('createdAt')}</span>
                  </div>
                  <p className="text-gray-900">{formatDateTime(order.createdAt)}</p>
                </div>

                {order.machine && (
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2 text-gray-600 mb-1">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('machine')}</span>
                    </div>
                    <p className="text-gray-900 font-medium">{order.machine}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Status History */}
            {order.statusLogs && order.statusLogs.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('statusHistory')}</h3>
                <div className="space-y-4">
                  {order.statusLogs.map((log) => (
                    <div key={log.id} className="border-l-4 border-blue-500 pl-4">
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                            log.previousStatus
                          )}`}
                        >
                          {getStatusLabel(log.previousStatus, t)}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(
                            log.newStatus
                          )}`}
                        >
                          {getStatusLabel(log.newStatus, t)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {log.changedBy.name} - {formatDateTime(log.createdAt)}
                      </p>
                      {log.comment && (
                        <div className="mt-2 bg-gray-50 rounded p-2">
                          <p className="text-sm text-gray-700">{log.comment}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
              <h4 className="font-medium text-blue-900 mb-2">{t('orderInfo')}</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-blue-700">{t('orderId')}:</span>
                  <span className="ml-2 text-blue-900 font-mono">#{order.id}</span>
                </div>
                <div>
                  <span className="text-blue-700">{t('lastUpdated')}:</span>
                  <span className="ml-2 text-blue-900">{formatDateTime(order.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('changeStatus')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('newStatus')}
                </label>
                <select
                  value={statusChangeData.newStatus}
                  onChange={(e) =>
                    setStatusChangeData({
                      ...statusChangeData,
                      newStatus: e.target.value as OrderStatus,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status, t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('commentOptional')}
                </label>
                <textarea
                  rows={3}
                  value={statusChangeData.comment}
                  onChange={(e) =>
                    setStatusChangeData({ ...statusChangeData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={t('commentPlaceholder')}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
{t('cancel')}
              </button>
              <button
                onClick={handleStatusChange}
                disabled={updatingStatus}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
{updatingStatus ? t('updating') : t('update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrderDetail;
