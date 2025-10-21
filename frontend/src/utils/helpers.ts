import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { OrderPriority, OrderStatus } from '../types';

export const formatDate = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy/MM/dd', { locale: ja });
};

export const formatDateTime = (dateString: string): string => {
  return format(new Date(dateString), 'yyyy/MM/dd HH:mm', { locale: ja });
};

export const getPriorityLabel = (priority: OrderPriority, t?: (key: any) => string): string => {
  if (t) {
    const labels: Record<OrderPriority, string> = {
      HIGH: t('high'),
      MEDIUM: t('medium'),
      LOW: t('low'),
    };
    return labels[priority];
  }
  // Fallback para compatibilidad
  const labels: Record<OrderPriority, string> = {
    HIGH: '高',
    MEDIUM: '中',
    LOW: '低',
  };
  return labels[priority];
};

export const getPriorityColor = (priority: OrderPriority): string => {
  const colors: Record<OrderPriority, string> = {
    HIGH: 'bg-red-100 text-red-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    LOW: 'bg-green-100 text-green-800',
  };
  return colors[priority];
};

export const getStatusLabel = (status: OrderStatus, t?: (key: any) => string): string => {
  if (t) {
    const labels: Record<OrderStatus, string> = {
      PENDING: t('pending'),
      IN_PROGRESS: t('inProgress'),
      COMPLETED: t('completed'),
    };
    return labels[status];
  }
  // Fallback para compatibilidad
  const labels: Record<OrderStatus, string> = {
    PENDING: '保留中',
    IN_PROGRESS: '進行中',
    COMPLETED: '完了',
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-gray-100 text-gray-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };
  return colors[status];
};

export const isOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};
