import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import type { Order } from '../types';
import {
  formatDate,
  getPriorityLabel,
  getPriorityColor,
  getStatusLabel,
  getStatusColor,
  isOverdue,
} from '../utils/helpers';
import { Calendar, User, AlertCircle } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const overdue = isOverdue(order.deadline) && order.status !== 'COMPLETED';

  return (
    <div
      onClick={() => navigate(`/orders/${order.id}`)}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg flex-1">{order.product}</h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
            order.priority
          )}`}
        >
          {getPriorityLabel(order.priority, t)}
        </span>
      </div>

      {/* Description */}
      {order.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{order.description}</p>
      )}

      {/* Status */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            order.status
          )}`}
        >
          {getStatusLabel(order.status, t)}
        </span>
      </div>

      {/* Footer */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>{order.assignedTo.name}</span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span className={overdue ? 'text-red-600 font-medium' : ''}>
            {formatDate(order.deadline)}
          </span>
          {overdue && <AlertCircle className="h-4 w-4 text-red-600" />}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
