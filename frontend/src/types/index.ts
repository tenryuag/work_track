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

export interface Customer {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerBasic {
  id: number;
  name: string;
  company?: string;
}

export interface MaterialBasic {
  id: number;
  name: string;
  unit?: string;
}

export interface CustomerRequest {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  address?: string;
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
  customer?: CustomerBasic;
  material?: MaterialBasic;
  quantity?: number;
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
  customerId?: number;
  materialId?: number;
  quantity?: number;
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

export interface Material {
  id: number;
  name: string;
  description?: string;
  unit?: string;
  stockQuantity?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialRequest {
  name: string;
  description?: string;
  unit?: string;
  stockQuantity?: number;
}
