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
    HIGH: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    LOW: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  };
  return colors[priority];
};

export const getStatusLabel = (status: OrderStatus, t?: (key: any) => string): string => {
  if (t) {
    const labels: Record<OrderStatus, string> = {
      PENDING: t('pending'),
      IN_PROGRESS: t('inProgress'),
      COMPLETED: t('completed'),
      DELIVERED: t('delivered'),
    };
    return labels[status];
  }
  // Fallback para compatibilidad
  const labels: Record<OrderStatus, string> = {
    PENDING: '保留中',
    IN_PROGRESS: '進行中',
    COMPLETED: '完了',
    DELIVERED: '配送済み',
  };
  return labels[status];
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-orange-200 text-orange-900 dark:bg-orange-800 dark:text-orange-100',
    IN_PROGRESS: 'bg-blue-200 text-blue-900 dark:bg-blue-700 dark:text-blue-100',
    COMPLETED: 'bg-green-200 text-green-900 dark:bg-green-700 dark:text-green-100',
    DELIVERED: 'bg-purple-200 text-purple-900 dark:bg-purple-700 dark:text-purple-100',
  };
  return colors[status];
};

export const getColumnColor = (status: OrderStatus): string => {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'bg-orange-50 dark:bg-orange-950/30',
    IN_PROGRESS: 'bg-blue-50 dark:bg-blue-950/30',
    COMPLETED: 'bg-green-50 dark:bg-green-950/30',
    DELIVERED: 'bg-purple-50 dark:bg-purple-950/30',
  };
  return colors[status];
};

export const isOverdue = (deadline: string): boolean => {
  return new Date(deadline) < new Date();
};
