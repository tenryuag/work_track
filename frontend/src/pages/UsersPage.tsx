import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import ErrorAlert from '../components/ErrorAlert';
import { usersAPI } from '../services/api';
import type { UserDetail, UserRequest } from '../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { useFilters, filterHelpers } from '../hooks/useFilters';

const UsersPage: React.FC = () => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null);
  const [formData, setFormData] = useState<UserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'OPERATOR',
  });

  // Filter configuration
  const filterUsersFn = (user: UserDetail, filters: Record<string, any>) => {
    // Text search (name, email)
    if (
      filters.search &&
      !filterHelpers.textMatches(user.name, filters.search) &&
      !filterHelpers.textMatches(user.email, filters.search)
    ) {
      return false;
    }

    // Role filter
    if (!filterHelpers.exactMatch(user.role, filters.role)) return false;

    // Active status filter
    if (filters.active !== '' && filters.active !== undefined && filters.active !== null) {
      const isActive = filters.active === 'true';
      if (user.active !== isActive) return false;
    }

    return true;
  };

  const {
    filters,
    filteredItems: filteredUsers,
    isFilterPanelOpen,
    handleFilterChange,
    handleClearFilters,
    toggleFilterPanel,
  } = useFilters(users, filterUsersFn);

  // Filter configurations
  const filterConfigs = useMemo(() => [
    {
      type: 'text' as const,
      label: t('search'),
      field: 'search',
      placeholder: t('searchByNameOrEmail'),
    },
    {
      type: 'select' as const,
      label: t('role'),
      field: 'role',
      placeholder: t('allRoles'),
      options: [
        { value: 'ADMIN', label: t('admin') },
        { value: 'MANAGER', label: t('manager') },
        { value: 'OPERATOR', label: t('operator') },
      ],
    },
    {
      type: 'select' as const,
      label: t('status'),
      field: 'active',
      placeholder: t('allStatuses'),
      options: [
        { value: 'true', label: t('active') },
        { value: 'false', label: t('inactive') },
      ],
    },
  ], [t]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersAPI.getAll();
      setUsers(response.data);
    } catch (err: any) {
      setError(t('fetchUsersFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (user?: UserDetail) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'OPERATOR',
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'OPERATOR',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate password for new users
    if (!editingUser && !formData.password) {
      alert(t('passwordRequired'));
      return;
    }

    try {
      if (editingUser) {
        // Only send password if it was changed
        const updateData = formData.password
          ? formData
          : { name: formData.name, email: formData.email, role: formData.role };
        await usersAPI.update(editingUser.id, updateData);
      } else {
        await usersAPI.create(formData);
      }
      await fetchUsers();
      handleCloseModal();
    } catch (err: any) {
      alert(t('saveFailed'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('confirmDeleteUser'))) return;
    try {
      setDeleteError('');
      await usersAPI.delete(id);
      await fetchUsers();
    } catch (err: any) {
      // Check if error is due to foreign key constraint
      const errorMessage = err.response?.data?.message || err.message || t('deleteFailed');

      if (errorMessage.includes('foreign key') || errorMessage.includes('constraint') || errorMessage.includes('referenced')) {
        setDeleteError(t('cannotDeleteUserInUse'));
      } else {
        setDeleteError(errorMessage);
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      case 'MANAGER':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'OPERATOR':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Layout>
      {/* Error Alert */}
      {deleteError && (
        <ErrorAlert
          message={deleteError}
          onClose={() => setDeleteError('')}
        />
      )}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('users')}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {t('totalUsers')}: {users.length}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            <Plus className="h-5 w-5" />
            {t('newUser')}
          </button>
        </div>

        {/* Filter Panel */}
        {!loading && (
          <FilterPanel
            isOpen={isFilterPanelOpen}
            onToggle={toggleFilterPanel}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterConfigs={filterConfigs}
            resultsCount={filteredUsers.length}
            totalCount={users.length}
          />
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
          </div>
        ) : (
          <>
            {/* Users Table */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400">{t('noUsers')}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('name')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('email')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('role')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('status')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        {t('actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role === 'ADMIN' ? t('admin') : user.role === 'MANAGER' ? t('manager') : t('operator')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.active ? (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                              {t('active')}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300">
                              {t('inactive')}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleOpenModal(user)}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 inline-flex items-center"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {editingUser ? t('editUser') : t('newUser')}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('password')} {!editingUser && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required={!editingUser}
                    placeholder={editingUser ? t('passwordPlaceholder') : ''}
                    minLength={6}
                  />
                  {editingUser && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t('passwordHint')}
                    </p>
                  )}
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('role')} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  >
                    <option value="OPERATOR">{t('operator')}</option>
                    <option value="MANAGER">{t('manager')}</option>
                    <option value="ADMIN">{t('admin')}</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
                  >
                    {t('save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UsersPage;
