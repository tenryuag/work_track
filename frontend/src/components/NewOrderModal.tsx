import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Modal from './Modal';
import { ordersAPI, usersAPI, customersAPI, materialsAPI } from '../services/api';
import type { OrderRequest, OrderPriority, UserBasic, Customer, Material } from '../types';
import { Save } from 'lucide-react';
import { getPriorityLabel } from '../utils/translationHelpers';

interface NewOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const NewOrderModal: React.FC<NewOrderModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t } = useLanguage();
  const [operators, setOperators] = useState<UserBasic[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState<OrderRequest>({
    product: '',
    description: '',
    priority: 'MEDIUM',
    assignedToId: 0,
    customerId: undefined,
    materialId: undefined,
    quantity: undefined,
    deadline: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchOperators();
      fetchCustomers();
      fetchMaterials();
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

  const fetchMaterials = async () => {
    try {
      const response = await materialsAPI.getAll();
      setMaterials(response.data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await ordersAPI.create(formData);
      // Reset form
      setFormData({
        product: '',
        description: '',
        priority: 'MEDIUM',
        assignedToId: 0,
        customerId: undefined,
        deadline: '',
      });
      onSuccess();
      onClose();
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
    <Modal isOpen={isOpen} onClose={onClose} title={t('createNewOrder')} maxWidth="2xl">
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product */}
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('productName')} <span className="text-red-500">*</span>
          </label>
          <input
            id="product"
            type="text"
            required
            value={formData.product}
            onChange={(e) => setFormData({ ...formData, product: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t('productNamePlaceholder')}
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('description')}
          </label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            placeholder={t('descriptionPlaceholder')}
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('priority')} <span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            required
            value={formData.priority}
            onChange={(e) =>
              setFormData({ ...formData, priority: e.target.value as OrderPriority })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('assignedToUser')} <span className="text-red-500">*</span>
          </label>
          <select
            id="assignedTo"
            required
            value={formData.assignedToId}
            onChange={(e) =>
              setFormData({ ...formData, assignedToId: Number(e.target.value) })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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
          <label htmlFor="customer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('customer')}
          </label>
          <select
            id="customer"
            value={formData.customerId || ''}
            onChange={(e) =>
              setFormData({ ...formData, customerId: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">{t('selectCustomer')}</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}{customer.company ? ` - ${customer.company}` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Material */}
        <div>
          <label htmlFor="material" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('material')}
          </label>
          <select
            id="material"
            value={formData.materialId || ''}
            onChange={(e) =>
              setFormData({ ...formData, materialId: e.target.value ? Number(e.target.value) : undefined })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">{t('selectMaterial')}</option>
            {materials.map((material) => (
              <option key={material.id} value={material.id}>
                {material.name}{material.unit ? ` (${material.unit})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity */}
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('quantity')}
          </label>
          <input
            id="quantity"
            type="number"
            step="0.01"
            value={formData.quantity || ''}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? parseFloat(e.target.value) : undefined })}
            placeholder={t('quantityPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Deadline */}
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('deadline')} <span className="text-red-500">*</span>
          </label>
          <input
            id="deadline"
            type="date"
            required
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
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
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? t('creating') : t('create')}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default NewOrderModal;
