import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import OrderCard from '../components/OrderCard';
import QuickEditModal from '../components/QuickEditModal';
import NewOrderModal from '../components/NewOrderModal';
import OrderDetailModal from '../components/OrderDetailModal';
import { ordersAPI } from '../services/api';
import type { Order, OrderStatus } from '../types';
import { Plus } from 'lucide-react';
import { getStatusLabel } from '../utils/translationHelpers';
import { getColumnColor } from '../utils/helpers';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const HomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [machineModalOpen, setMachineModalOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    orderId: number;
    newStatus: OrderStatus;
  } | null>(null);
  const [quickEditOrder, setQuickEditOrder] = useState<Order | null>(null);
  const [newOrderModalOpen, setNewOrderModalOpen] = useState(false);
  const [orderDetailId, setOrderDetailId] = useState<number | null>(null);
  const { isAdmin, isManager, user } = useAuth();
  const { t } = useLanguage();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getAll();
      setOrders(response.data);
    } catch (err: any) {
      setError(t('fetchOrdersFailed'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statuses: OrderStatus[] = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'DELIVERED'];

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const canDragOrder = (order: Order): boolean => {
    if (isAdmin() || isManager()) return true;
    // Operators can only drag their own orders
    return order.assignedTo.id === user?.id;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const order = orders.find((o) => o.id === active.id);
    if (order) {
      setActiveOrder(order);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveOrder(null);

    if (!over) return;

    const orderId = active.id as number;
    const newStatus = over.id as OrderStatus;
    const order = orders.find((o) => o.id === orderId);

    if (!order || order.status === newStatus) return;

    // Check permissions
    if (!canDragOrder(order)) {
      alert(t('updateStatusFailed'));
      return;
    }

    // If moving to IN_PROGRESS, open machine modal
    if (newStatus === 'IN_PROGRESS' && order.status === 'PENDING') {
      setPendingStatusChange({ orderId, newStatus });
      setMachineModalOpen(true);
    } else {
      // Update status directly
      await updateOrderStatus(orderId, newStatus);
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus, machine?: string) => {
    try {
      await ordersAPI.updateStatus(orderId, {
        newStatus,
        comment: `Status changed via drag & drop`,
        machine,
      });
      await fetchOrders();
    } catch (err: any) {
      alert(t('updateStatusFailed'));
      console.error(err);
    }
  };

  const handleMachineSubmit = async (machine: string) => {
    if (pendingStatusChange) {
      await updateOrderStatus(
        pendingStatusChange.orderId,
        pendingStatusChange.newStatus,
        machine
      );
      setMachineModalOpen(false);
      setPendingStatusChange(null);
    }
  };

  const handleQuickEdit = (order: Order) => {
    setQuickEditOrder(order);
  };

  const handleViewDetails = (orderId: number) => {
    setOrderDetailId(orderId);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('productionOrders')}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('totalOrders', { count: orders.length })}
          </p>
        </div>

        {isAdmin() && (
          <button
            onClick={() => setNewOrderModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition shadow-sm"
          >
            <Plus className="h-5 w-5" />
            <span>{t('newOrder')}</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">{t('loading')}</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Kanban Board */}
      {!loading && !error && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                orders={getOrdersByStatus(status)}
                title={getStatusLabel(status, t)}
                onQuickEdit={handleQuickEdit}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <DragOverlay>
            {activeOrder ? (
              <div className="opacity-80 rotate-3 scale-105">
                <OrderCard order={activeOrder} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Machine Modal */}
      {machineModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {t('enterMachine')}
            </h3>
            <input
              type="text"
              placeholder={t('machineNumber')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = (e.target as HTMLInputElement).value;
                  if (value.trim()) {
                    handleMachineSubmit(value.trim());
                  }
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => {
                  setMachineModalOpen(false);
                  setPendingStatusChange(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Edit Modal */}
      {quickEditOrder && (
        <QuickEditModal
          order={quickEditOrder}
          isOpen={!!quickEditOrder}
          onClose={() => setQuickEditOrder(null)}
          onSuccess={fetchOrders}
        />
      )}

      {/* New Order Modal */}
      <NewOrderModal
        isOpen={newOrderModalOpen}
        onClose={() => setNewOrderModalOpen(false)}
        onSuccess={fetchOrders}
      />

      {/* Order Detail Modal */}
      {orderDetailId && (
        <OrderDetailModal
          isOpen={!!orderDetailId}
          onClose={() => setOrderDetailId(null)}
          orderId={orderDetailId}
          onSuccess={fetchOrders}
        />
      )}
    </Layout>
  );
};

// Kanban Column Component
interface KanbanColumnProps {
  status: OrderStatus;
  orders: Order[];
  title: string;
  onQuickEdit: (order: Order) => void;
  onViewDetails: (orderId: number) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, orders, title, onQuickEdit, onViewDetails }) => {
  const { setNodeRef } = useSortable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`${getColumnColor(status)} rounded-lg p-4 min-h-[600px] border-2 border-transparent`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${
          status === 'PENDING' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200' :
          status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' :
          status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200' :
          'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
        }`}>
          {orders.length}
        </span>
      </div>

      <SortableContext items={orders.map((o) => o.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {orders.map((order) => (
            <DraggableOrderCard key={order.id} order={order} onQuickEdit={onQuickEdit} onViewDetails={onViewDetails} />
          ))}
        </div>
      </SortableContext>

      {orders.length === 0 && (
        <div className={`text-center py-8 text-sm ${
          status === 'PENDING' ? 'text-orange-400 dark:text-orange-500' :
          status === 'IN_PROGRESS' ? 'text-blue-400 dark:text-blue-500' :
          status === 'COMPLETED' ? 'text-green-400 dark:text-green-500' :
          'text-purple-400 dark:text-purple-500'
        }`}>
          Drop orders here
        </div>
      )}
    </div>
  );
};

// Draggable Order Card Component
interface DraggableOrderCardProps {
  order: Order;
  onQuickEdit: (order: Order) => void;
  onViewDetails: (orderId: number) => void;
}

const DraggableOrderCard: React.FC<DraggableOrderCardProps> = ({ order, onQuickEdit, onViewDetails }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: order.id,
    data: {
      type: 'order',
      order,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <OrderCard order={order} onQuickEdit={onQuickEdit} onViewDetails={onViewDetails} />
    </div>
  );
};

export default HomePage;
