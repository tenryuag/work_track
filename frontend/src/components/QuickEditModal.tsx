import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Order, OrderStatus, UserBasic, Customer } from '../types';
import { ordersAPI, usersAPI, customersAPI } from '../services/api';
import { X } from 'lucide-react';
import { getStatusLabel } from '../utils/translationHelpers';

interface QuickEditModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickEditModal: React.FC<QuickEditModalProps> = ({ order, isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [operators, setOperators] = useState<UserBasic[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    assignedToId: order.assignedTo.id,
    deadline: order.deadline,
    description: order.description || '',
    status: order.status,
    customerId: order.customer?.id,
  });

  useEffect(() => {
    if (isOpen) {
      fetchOperators();
      fetchCustomers();
    }
  }, [isOpen]);

  const fetchOperators = async () => {
    try {
      const response = await usersAPI.getAllOperators();
      setOperators(response.data);
    } catch (err) {
      console.error('Failed to fetch operators:', err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update order basic info
      await ordersAPI.update(order.id, {
        product: order.product,
        priority: order.priority,
        assignedToId: formData.assignedToId,
        deadline: formData.deadline,
        description: formData.description,
        customerId: formData.customerId,
      });

      // If status changed, update status separately
      if (formData.status !== order.status) {
        await ordersAPI.updateStatus(order.id, {
          newStatus: formData.status,
          comment: 'Status updated via Quick Edit',
        });
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      alert(t('updateStatusFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const statuses: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('editOrder')}: {order.product}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('assignedToUser')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.assignedToId}
              onChange={(e) => setFormData({ ...formData, assignedToId: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.name} ({op.email})
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('customer')}
            </label>
            <select
              value={formData.customerId || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  customerId: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">{t('selectCustomer')}</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} {customer.company && `(${customer.company})`}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('deadline')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('description')}
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder={t('descriptionPlaceholder')}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('newStatus')} <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status, t)}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? t('updating') : t('save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickEditModal;
