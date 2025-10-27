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
    dropOrdersHere: 'ここに注文をドロップ',

    // Filters
    search: '検索',
    searchByProductDescriptionOrMachine: '製品名、説明、または機械番号で検索',
    searchByNameOrEmail: '名前またはメールアドレスで検索',
    searchByNameCompanyOrEmail: '名前、会社名、またはメールアドレスで検索',
    searchByNameOrDescription: '名前または説明で検索',
    allStatuses: 'すべてのステータス',
    allPriorities: 'すべての優先度',
    allUsers: 'すべてのユーザー',
    allCustomers: 'すべての顧客',
    allMaterials: 'すべての材料',
    allRoles: 'すべての役割',
    clearFilters: 'フィルターをクリア',
    showingResults: '{count} / {total} 件を表示',

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

    // Customers
    customers: '顧客',
    customer: '顧客',
    selectCustomer: '顧客を選択',
    newCustomer: '新規顧客',
    editCustomer: '顧客を編集',
    totalCustomers: '全顧客数',
    fetchCustomersFailed: '顧客の取得に失敗しました',
    confirmDeleteCustomer: 'この顧客を削除してもよろしいですか？',
    noCustomers: '顧客がありません',
    name: '名前',
    company: '会社名',
    phone: '電話番号',
    address: '住所',
    actions: '操作',
    saveFailed: '保存に失敗しました',

    // Materials
    materials: '材料',
    material: '材料',
    selectMaterial: '材料を選択',
    newMaterial: '新規材料',
    editMaterial: '材料を編集',
    totalMaterials: '全材料数',
    fetchMaterialsFailed: '材料の取得に失敗しました',
    confirmDeleteMaterial: 'この材料を削除してもよろしいですか？',
    noMaterials: '材料がありません',
    unit: '単位',
    unitPlaceholder: '例: kg, m, 個, L',
    stockQuantity: '在庫数量',
    quantity: '数量',
    quantityPlaceholder: '例: 10.5',

    // Users
    users: 'ユーザー',
    newUser: '新規ユーザー',
    editUser: 'ユーザーを編集',
    totalUsers: '全ユーザー数',
    fetchUsersFailed: 'ユーザーの取得に失敗しました',
    confirmDeleteUser: 'このユーザーを削除してもよろしいですか？',
    noUsers: 'ユーザーがいません',
    role: '役割',
    status: 'ステータス',
    active: 'アクティブ',
    inactive: '非アクティブ',
    passwordRequired: 'パスワードは必須です',
    passwordPlaceholder: '変更する場合のみ入力',
    passwordHint: '空欄のままにすると、パスワードは変更されません',

    // Language
    language: '言語',
    japanese: '日本語',
    english: 'English',

    // Theme
    theme: 'テーマ',
    lightMode: 'ライトモード',
    darkMode: 'ダークモード',

    // Navigation
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
    dropOrdersHere: 'Drop orders here',

    // Filters
    search: 'Search',
    searchByProductDescriptionOrMachine: 'Search by product, description, or machine',
    searchByNameOrEmail: 'Search by name or email',
    searchByNameCompanyOrEmail: 'Search by name, company, or email',
    searchByNameOrDescription: 'Search by name or description',
    allStatuses: 'All Statuses',
    allPriorities: 'All Priorities',
    allUsers: 'All Users',
    allCustomers: 'All Customers',
    allMaterials: 'All Materials',
    allRoles: 'All Roles',
    clearFilters: 'Clear Filters',
    showingResults: 'Showing {count} of {total}',

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

    // Customers
    customers: 'Customers',
    customer: 'Customer',
    selectCustomer: 'Select customer',
    newCustomer: 'New Customer',
    editCustomer: 'Edit Customer',
    totalCustomers: 'Total Customers',
    fetchCustomersFailed: 'Failed to fetch customers',
    confirmDeleteCustomer: 'Are you sure you want to delete this customer?',
    noCustomers: 'No customers available',
    name: 'Name',
    company: 'Company',
    phone: 'Phone',
    address: 'Address',
    actions: 'Actions',
    saveFailed: 'Failed to save',

    // Materials
    materials: 'Materials',
    material: 'Material',
    selectMaterial: 'Select material',
    newMaterial: 'New Material',
    editMaterial: 'Edit Material',
    totalMaterials: 'Total Materials',
    fetchMaterialsFailed: 'Failed to fetch materials',
    confirmDeleteMaterial: 'Are you sure you want to delete this material?',
    noMaterials: 'No materials available',
    unit: 'Unit',
    unitPlaceholder: 'e.g., kg, m, pcs, L',
    stockQuantity: 'Stock Quantity',
    quantity: 'Quantity',
    quantityPlaceholder: 'e.g., 10.5',

    // Users
    users: 'Users',
    newUser: 'New User',
    editUser: 'Edit User',
    totalUsers: 'Total Users',
    fetchUsersFailed: 'Failed to fetch users',
    confirmDeleteUser: 'Are you sure you want to delete this user?',
    noUsers: 'No users available',
    role: 'Role',
    status: 'Status',
    active: 'Active',
    inactive: 'Inactive',
    passwordRequired: 'Password is required',
    passwordPlaceholder: 'Leave blank to keep current password',
    passwordHint: 'Leave blank to keep current password',

    // Language
    language: 'Language',
    japanese: '日本語',
    english: 'English',

    // Theme
    theme: 'Theme',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',

    // Navigation
    home: 'Home',
  },
};

export type TranslationKey = keyof typeof translations.en;
export type Language = keyof typeof translations;
