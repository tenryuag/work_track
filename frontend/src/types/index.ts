export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR';

export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELIVERED';

export type OrderPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface UserBasic {
  id: number;
  name: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  name: string;
  role: UserRole;
}

export interface Order {
  id: number;
  product: string;
  description?: string;
  priority: OrderPriority;
  status: OrderStatus;
  assignedTo: UserBasic;
  createdBy: UserBasic;
  deadline: string;
  machine?: string;
  createdAt: string;
  updatedAt: string;
  statusLogs?: StatusLog[];
}

export interface OrderRequest {
  product: string;
  description?: string;
  priority: OrderPriority;
  assignedToId: number;
  deadline: string;
}

export interface StatusChangeRequest {
  newStatus: OrderStatus;
  comment?: string;
  machine?: string;
}

export interface StatusLog {
  id: number;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  comment?: string;
  changedBy: UserBasic;
  createdAt: string;
}
