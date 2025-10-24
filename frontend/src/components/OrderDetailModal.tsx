import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Modal from './Modal';
import { ordersAPI } from '../services/api';
import type { Order, OrderStatus, StatusChangeRequest } from '../types';
import {
  Calendar,
  User,
  Clock,
  RefreshCw,
  Trash2,
  Settings,
  Package,
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

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: number;
  onSuccess?: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  orderId,
  onSuccess,
}) => {
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
    if (isOpen && orderId) {
      fetchOrder();
    }
  }, [isOpen, orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await ordersAPI.getById(orderId);
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
      await fetchOrder();
      if (onSuccess) onSuccess();
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
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      alert(t('deleteFailed'));
    }
  };

  const availableStatuses: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED'];

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      </Modal>
    );
  }

  if (error || !order) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error || t('orderNotFound')}
        </div>
      </Modal>
    );
  }

  const overdue = isOverdue(order.deadline) && order.status !== 'COMPLETED';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="4xl" showCloseButton={false}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{order.product}</h2>
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
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t('changeStatus')}</span>
            </button>

            {isAdmin() && (
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 dark:bg-red-500 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition"
              >
                <Trash2 className="h-4 w-4" />
                <span>{t('delete')}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('orderDetails')}</h3>

            {order.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('description')}</h4>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">{order.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('assignedTo')}</span>
                </div>
                <p className="text-gray-900 dark:text-gray-100">{order.assignedTo.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.assignedTo.email}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('createdBy')}</span>
                </div>
                <p className="text-gray-900 dark:text-gray-100">{order.createdBy.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{order.createdBy.email}</p>
              </div>

              {order.customer && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('customer')}</span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">{order.customer.name}</p>
                  {order.customer.company && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.customer.company}</p>
                  )}
                </div>
              )}

              {order.material && (
                <div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Package className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('material')}</span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100">{order.material.name}</p>
                  {order.material.unit && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{order.material.unit}</p>
                  )}
                  {order.quantity && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('quantity')}: {order.quantity}</p>
                  )}
                </div>
              )}

              <div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('deadline')}</span>
                </div>
                <p className={`font-medium ${overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-gray-100'}`}>
                  {formatDate(order.deadline)}
                  {overdue && ` (${t('overdue')})`}
                </p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('createdAt')}</span>
                </div>
                <p className="text-gray-900 dark:text-gray-100">{formatDateTime(order.createdAt)}</p>
              </div>

              {order.machine && (
                <div className="col-span-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-1">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('machine')}</span>
                  </div>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{order.machine}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status History */}
          {order.statusLogs && order.statusLogs.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('statusHistory')}</h3>
              <div className="space-y-4">
                {order.statusLogs.map((log) => (
                  <div key={log.id} className="border-l-4 border-blue-500 dark:border-blue-400 pl-4">
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {log.changedBy.name} - {formatDateTime(log.createdAt)}
                    </p>
                    {log.comment && (
                      <div className="mt-2 bg-gray-100 dark:bg-gray-800 rounded p-2">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{log.comment}</p>
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
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('orderInfo')}</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-blue-700 dark:text-blue-300">{t('orderId')}:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100 font-mono">#{order.id}</span>
              </div>
              <div>
                <span className="text-blue-700 dark:text-blue-300">{t('lastUpdated')}:</span>
                <span className="ml-2 text-blue-900 dark:text-blue-100">{formatDateTime(order.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('changeStatus')}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  {availableStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status, t)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('commentOptional')}
                </label>
                <textarea
                  rows={3}
                  value={statusChangeData.comment}
                  onChange={(e) =>
                    setStatusChangeData({ ...statusChangeData, comment: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t('commentPlaceholder')}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleStatusChange}
                disabled={updatingStatus}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 transition"
              >
                {updatingStatus ? t('updating') : t('update')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default OrderDetailModal;
