import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { ordersAPI, usersAPI, customersAPI } from '../services/api';
import type { OrderRequest, OrderPriority, UserBasic, Customer } from '../types';
import { ArrowLeft, Save } from 'lucide-react';
import { getPriorityLabel } from '../utils/translationHelpers';

const NewOrder: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [operators, setOperators] = useState<UserBasic[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<OrderRequest>({
    product: '',
    description: '',
    priority: 'MEDIUM',
    assignedToId: 0,
    customerId: undefined,
    deadline: '',
  });

  useEffect(() => {
    fetchOperators();
    fetchCustomers();
  }, []);

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
    setError('');

    try {
      await ordersAPI.create(formData);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || t('createOrderFailed'));
    } finally {
      setLoading(false);
    }
  };

  const priorities: Array<{ value: OrderPriority; label: string }> = [
    { value: 'HIGH', label: getPriorityLabel('HIGH', t) },
    { value: 'MEDIUM', label: getPriorityLabel('MEDIUM', t) },
    { value: 'LOW', label: getPriorityLabel('LOW', t) },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>{t('back')}</span>
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{t('createNewOrder')}</h2>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product */}
            <div>
              <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-1">
                {t('productName')} <span className="text-red-500">*</span>
              </label>
              <input
                id="product"
                type="text"
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('productNamePlaceholder')}
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                {t('description')}
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('descriptionPlaceholder')}
              />
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                {t('priority')} <span className="text-red-500">*</span>
              </label>
              <select
                id="priority"
                required
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value as OrderPriority })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned To */}
            <div>
              <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                {t('assignedToUser')} <span className="text-red-500">*</span>
              </label>
              <select
                id="assignedTo"
                required
                value={formData.assignedToId}
                onChange={(e) =>
                  setFormData({ ...formData, assignedToId: Number(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('selectUser')}</option>
                {operators.map((operator) => (
                  <option key={operator.id} value={operator.id}>
                    {operator.name} ({operator.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Customer */}
            <div>
              <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                {t('customer')}
              </label>
              <select
                id="customer"
                value={formData.customerId || ''}
                onChange={(e) =>
                  setFormData({ ...formData, customerId: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('selectCustomer')}</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} {customer.company ? `(${customer.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
                {t('deadline')} <span className="text-red-500">*</span>
              </label>
              <input
                id="deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
{t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? t('creating') : t('create')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NewOrder;
