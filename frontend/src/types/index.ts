export type UserRole = "ADMIN" | "MANAGER" | "OPERATOR";

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "DELIVERED";

export type OrderPriority = "HIGH" | "MEDIUM" | "LOW";

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

export interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRequest {
  name: string;
  email: string;
  password?: string;
  role: string;
}

// KPI System Types

export type EvaluationFrequency =
  | "DAILY"
  | "WEEKLY"
  | "BIWEEKLY"
  | "MONTHLY"
  | "QUARTERLY"
  | "SEMIANNUAL";
export type ValueType = "BOOLEAN" | "NUMERIC" | "PERCENT" | "SCORE";
export type TargetType = "MIN" | "MAX" | "RANGE" | "EQUAL";
export type AggregationMethod =
  | "LAST"
  | "AVG"
  | "SUM"
  | "COUNT_TRUE"
  | "COUNT_FALSE"
  | "PERCENT_TRUE"
  | "MANUAL_FORMULA";
export type EvaluationStatus = "DRAFT" | "SUBMITTED" | "APPROVED";

export interface Kpi {
  id: string; // UUID
  competence?: string;
  specificRoleApplication?: string;
  name: string;
  controlMeasure?: string;
  frequency: EvaluationFrequency;
  valueType: ValueType;
  targetType: TargetType;
  targetValue1?: number;
  targetValue2?: number;
  aggregationMethod: AggregationMethod;
  unit?: string;
  evidenceRequired: boolean;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KpiRequest {
  competence?: string;
  specificRoleApplication?: string;
  name: string;
  controlMeasure?: string;
  frequency: EvaluationFrequency;
  valueType: ValueType;
  targetType: TargetType;
  targetValue1?: number;
  targetValue2?: number;
  aggregationMethod: AggregationMethod;
  unit?: string;
  evidenceRequired: boolean;
  description?: string;
  active?: boolean;
}

export interface Assignment {
  id: number;
  worker: UserBasic; // Reusing UserBasic from existing types? Yes
  kpi: Kpi;
  startDate: string;
  endDate?: string;
  weight?: number;
  targetOverride?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentRequest {
  workerId: number;
  kpiId: string;
  startDate: string;
  endDate?: string;
  weight?: number;
  targetOverride?: number;
}

export interface Evidence {
  id: number;
  fileUrl?: string;
  note?: string;
  createdAt: string;
}

export interface EvidenceRequest {
  fileUrl?: string;
  note?: string;
}

export interface Evaluation {
  id: number;
  assignment?: Assignment; // EvaluationResponse has assignment
  periodStart: string;
  periodEnd: string;
  valueBoolean?: boolean;
  valueNumber?: number;
  valueText?: string;
  status: EvaluationStatus;
  createdBy: UserBasic;
  evidence?: Evidence[];
  createdAt: string;
  updatedAt: string;
}

export type EvaluationResponse = Evaluation;

export interface EvaluationRequest {
  assignmentId: number;
  periodStart: string;
  periodEnd: string;
  valueBoolean?: boolean;
  valueNumber?: number;
  valueText?: string;
  status: EvaluationStatus;
  evidence?: EvidenceRequest[];
}

export interface Period {
  startDate: string;
  endDate: string;
  label: string;
}

export interface Score {
  assignmentId: number;
  periodStart: string;
  score: number;
  normalizedScore: number;
}

export interface WorkPlan {
  id: number;
  year: number;
  user?: UserBasic; // Null if global
  description: string;
  createdAt: string;
  updatedAt: string;
  tasks?: WorkPlanTask[];
}

export interface WorkPlanRequest {
  year: number;
  userId?: number;
  description: string;
}

export interface WorkPlanTask {
  id: number;
  workPlanId: number;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string; // "TODO" | "IN_PROGRESS" | "DONE"
}

export interface WorkPlanTaskRequest {
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: string;
}
