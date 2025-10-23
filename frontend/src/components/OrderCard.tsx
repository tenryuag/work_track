import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import type { Order } from '../types';
import {
  formatDate,
  getPriorityLabel,
  getPriorityColor,
  isOverdue,
} from '../utils/helpers';
import { Calendar, Eye, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  onQuickEdit?: (order: Order) => void;
  onViewDetails?: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onQuickEdit, onViewDetails }) => {
  const { t } = useLanguage();
  const { isAdmin, isManager } = useAuth();
  const overdue = isOverdue(order.deadline) && order.status !== 'COMPLETED' && order.status !== 'DELIVERED';

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickEdit && (isAdmin() || isManager())) {
      onQuickEdit(order);
    }
  };

  const handleViewDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewDetails) {
      onViewDetails(order.id);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-3 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 ${
        (isAdmin() || isManager()) ? 'cursor-pointer' : ''
      } flex flex-col`}
    >
      {/* Priority Badge - Top Right */}
      <div className="flex justify-end mb-1.5">
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getPriorityColor(
            order.priority
          )}`}
        >
          {getPriorityLabel(order.priority, t)}
        </span>
      </div>

      {/* Product Name - Center */}
      <div className="flex-1 flex items-center justify-center text-center py-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base leading-snug px-1">
          {order.product}
        </h3>
      </div>

      {/* Deadline - Bottom */}
      <div>
        <div className={`flex items-center justify-center space-x-1.5 text-xs font-medium ${
          overdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
        }`}>
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(order.deadline)}</span>
          {overdue && <AlertCircle className="h-3.5 w-3.5" />}
        </div>

        {/* View Details Button */}
        <button
          onClick={handleViewDetailsClick}
          className="mt-2 w-full flex items-center justify-center space-x-1.5 px-2 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded text-xs font-medium transition"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>{t('viewDetails')}</span>
        </button>
      </div>
    </div>
  );
};

export default OrderCard;
