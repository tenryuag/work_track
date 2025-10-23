export const translations = {
  ja: {
    // Common
    loading: '読み込み中...',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    create: '作成',
    update: '更新',
    back: '戻る',
    logout: 'ログアウト',
    close: '閉じる',

    // App Title
    appName: 'WorkTrack',
    appSubtitle: '生産管理システム',

    // Auth
    login: 'ログイン',
    email: 'メールアドレス',
    password: 'パスワード',
    loggingIn: 'ログイン中...',
    loginFailed: 'ログインに失敗しました',
    testAccounts: 'テストアカウント:',

    // Roles
    admin: '管理者',
    manager: 'マネージャー',
    operator: 'オペレーター',

    // Order Status
    pending: '保留中',
    inProgress: '進行中',
    completed: '完了',
    delivered: '配送済み',
    all: 'すべて',

    // Priority
    high: '高',
    medium: '中',
    low: '低',
    priority: '優先度',

    // HomePage
    productionOrders: '生産注文',
    totalOrders: '全 {count} 件の注文',
    newOrder: '新規注文',
    filters: 'フィルター',
    noOrders: '注文がありません',
    fetchOrdersFailed: '注文の取得に失敗しました',

    // Order Card
    assignedTo: '担当者',
    deadline: '期限',
    overdue: '期限超過',
    quickEdit: 'クイック編集',
    viewDetails: '詳細を表示',

    // New Order
    createNewOrder: '新規注文作成',
    productName: '製品名',
    description: '説明',
    assignedToUser: '担当者',
    selectUser: '担当者を選択',
    creating: '作成中...',
    createOrderFailed: '注文の作成に失敗しました',
    productNamePlaceholder: '製品名を入力',
    descriptionPlaceholder: '注文の詳細を入力',
    required: '必須',

    // Order Detail
    orderDetails: '注文詳細',
    editOrder: '注文を編集',
    changeStatus: 'ステータス変更',
    statusHistory: 'ステータス履歴',
    orderInfo: '注文情報',
    orderId: '注文ID',
    lastUpdated: '最終更新',
    createdBy: '作成者',
    createdAt: '作成日時',
    machine: '機械',
    machineNumber: '機械番号',
    enterMachine: '機械番号を入力',
    confirmDelete: 'この注文を削除してもよろしいですか？',
    deleteFailed: '注文の削除に失敗しました',
    fetchOrderFailed: '注文の取得に失敗しました',
    orderNotFound: '注文が見つかりませんでした',

    // Status Change
    newStatus: '新しいステータス',
    comment: 'コメント',
    commentOptional: 'コメント (任意)',
    commentPlaceholder: '変更の理由などを入力',
    updating: '更新中...',
    updateStatusFailed: 'ステータスの更新に失敗しました',

    // Language
    language: '言語',
    japanese: '日本語',
    english: 'English',

    // Theme
    theme: 'テーマ',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',

    // Customers
    customers: '顧客',
    customer: '顧客',
    customerManagement: '顧客管理',
    addCustomer: '顧客を追加',
    editCustomer: '顧客を編集',
    noCustomers: '顧客がいません',
    name: '名前',
    company: '会社',
    phone: '電話番号',
    address: '住所',
    confirmDeleteCustomer: 'この顧客を削除してもよろしいですか？',
    errorSavingCustomer: '顧客の保存に失敗しました',
    errorDeletingCustomer: '顧客の削除に失敗しました',
    selectCustomer: '顧客を選択',
    home: 'ホーム',
  },
  en: {
    // Common
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    update: 'Update',
    back: 'Back',
    logout: 'Logout',
    close: 'Close',

    // App Title
    appName: 'WorkTrack',
    appSubtitle: 'Production Management System',

    // Auth
    login: 'Login',
    email: 'Email Address',
    password: 'Password',
    loggingIn: 'Logging in...',
    loginFailed: 'Login failed',
    testAccounts: 'Test Accounts:',

    // Roles
    admin: 'Administrator',
    manager: 'Manager',
    operator: 'Operator',

    // Order Status
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    delivered: 'Delivered',
    all: 'All',

    // Priority
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    priority: 'Priority',

    // HomePage
    productionOrders: 'Production Orders',
    totalOrders: 'Total {count} orders',
    newOrder: 'New Order',
    filters: 'Filters',
    noOrders: 'No orders available',
    fetchOrdersFailed: 'Failed to fetch orders',

    // Order Card
    assignedTo: 'Assigned to',
    deadline: 'Deadline',
    overdue: 'Overdue',
    quickEdit: 'Quick Edit',
    viewDetails: 'View Details',

    // New Order
    createNewOrder: 'Create New Order',
    productName: 'Product Name',
    description: 'Description',
    assignedToUser: 'Assigned To',
    selectUser: 'Select user',
    creating: 'Creating...',
    createOrderFailed: 'Failed to create order',
    productNamePlaceholder: 'Enter product name',
    descriptionPlaceholder: 'Enter order details',
    required: 'Required',

    // Order Detail
    orderDetails: 'Order Details',
    editOrder: 'Edit Order',
    changeStatus: 'Change Status',
    statusHistory: 'Status History',
    orderInfo: 'Order Information',
    orderId: 'Order ID',
    lastUpdated: 'Last Updated',
    createdBy: 'Created By',
    createdAt: 'Created At',
    machine: 'Machine',
    machineNumber: 'Machine Number',
    enterMachine: 'Enter machine number',
    confirmDelete: 'Are you sure you want to delete this order?',
    deleteFailed: 'Failed to delete order',
    fetchOrderFailed: 'Failed to fetch order',
    orderNotFound: 'Order not found',

    // Status Change
    newStatus: 'New Status',
    comment: 'Comment',
    commentOptional: 'Comment (optional)',
    commentPlaceholder: 'Enter reason for change',
    updating: 'Updating...',
    updateStatusFailed: 'Failed to update status',

    // Language
    language: 'Language',
    japanese: '日本語',
    english: 'English',

    // Theme
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',

    // Customers
    customers: 'Customers',
    customer: 'Customer',
    customerManagement: 'Customer Management',
    addCustomer: 'Add Customer',
    editCustomer: 'Edit Customer',
    noCustomers: 'No customers available',
    name: 'Name',
    company: 'Company',
    phone: 'Phone',
    address: 'Address',
    confirmDeleteCustomer: 'Are you sure you want to delete this customer?',
    errorSavingCustomer: 'Failed to save customer',
    errorDeletingCustomer: 'Failed to delete customer',
    selectCustomer: 'Select customer',
    home: 'Home',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;
