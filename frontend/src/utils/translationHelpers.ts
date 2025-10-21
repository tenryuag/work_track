import type { OrderPriority, OrderStatus } from '../types';

export const getPriorityLabel = (priority: OrderPriority, t: (key: any) => string): string => {
  const labels: Record<OrderPriority, string> = {
    HIGH: t('high'),
    MEDIUM: t('medium'),
    LOW: t('low'),
  };
  return labels[priority];
};

export const getStatusLabel = (status: OrderStatus, t: (key: any) => string): string => {
  const labels: Record<OrderStatus, string> = {
    PENDING: t('pending'),
    IN_PROGRESS: t('inProgress'),
    COMPLETED: t('completed'),
  };
  return labels[status];
};
