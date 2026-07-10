import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import { kpisAPI } from '../services/api';
import type { Kpi, KpiRequest, EvaluationFrequency, ValueType, TargetType, AggregationMethod } from '../types';
import { Plus, Edit, Trash2, X, Archive, CheckCircle } from 'lucide-react';
import { useFilters, filterHelpers } from '../hooks/useFilters';

const KpisPage: React.FC = () => {
  const { t } = useLanguage();
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingKpi, setEditingKpi] = useState<Kpi | null>(null);
  const [formData, setFormData] = useState<KpiRequest>({
    name: '',
    competence: '',
    specificRoleApplication: '',
    controlMeasure: '',
    frequency: 'MONTHLY',
    valueType: 'NUMERIC',
    targetType: 'MIN',
    targetValue1: 0,
    targetValue2: 0,
    aggregationMethod: 'AVG',
    unit: '',
    evidenceRequired: false,
    description: '',
    active: true,
  });

  // Filter configuration
  const filterKpisFn = (kpi: Kpi, filters: Record<string, any>) => {
    // Text search
    if (filters.search && !filterHelpers.textMatches(kpi.name, filters.search) && !filterHelpers.textMatches(kpi.description, filters.search)) {
      return false;
    }
    // Active filter
    if (filters.active !== '' && filters.active !== undefined && filters.active !== null) {
      const isActive = filters.active === 'true';
      if (kpi.active !== isActive) return false;
    }
    // Frequency filter
    if (filters.frequency && kpi.frequency !== filters.frequency) return false;

    return true;
  };

  const {
    filters,
    filteredItems: filteredKpis,
    isFilterPanelOpen,
    handleFilterChange,
    handleClearFilters,
    toggleFilterPanel,
  } = useFilters(kpis, filterKpisFn);

  const filterConfigs = useMemo(() => [
    {
      type: 'text' as const,
      label: t('search'),
      field: 'search',
      placeholder: t('searchByNameOrDescription'),
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
    {
        type: 'select' as const,
        label: t('frequency'),
        field: 'frequency',
        placeholder: t('filters'),
        options: [
            { value: 'DAILY', label: t('daily') },
            { value: 'WEEKLY', label: t('weekly') },
            { value: 'BIWEEKLY', label: t('biweekly') },
            { value: 'MONTHLY', label: t('monthly') },
            { value: 'QUARTERLY', label: t('quarterly') },
            { value: 'SEMIANNUAL', label: t('semiannual') },
        ]
    }
  ], [t]);

  useEffect(() => {
    fetchKpis();
  }, []);

  const fetchKpis = async () => {
    try {
      setLoading(true);
      const response = await kpisAPI.getAll();
      setKpis(response.data);
    } catch (err: any) {
      setError(t('fetchKpisFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (kpi?: Kpi) => {
    if (kpi) {
      setEditingKpi(kpi);
      setFormData({
        name: kpi.name,
        competence: kpi.competence || '',
        specificRoleApplication: kpi.specificRoleApplication || '',
        controlMeasure: kpi.controlMeasure || '',
        frequency: kpi.frequency,
        valueType: kpi.valueType,
        targetType: kpi.targetType,
        targetValue1: kpi.targetValue1 || 0,
        targetValue2: kpi.targetValue2 || 0,
        aggregationMethod: kpi.aggregationMethod,
        unit: kpi.unit || '',
        evidenceRequired: kpi.evidenceRequired,
        description: kpi.description || '',
        active: kpi.active,
      });
    } else {
      setEditingKpi(null);
      setFormData({
        name: '',
        competence: '',
        specificRoleApplication: '',
        controlMeasure: '',
        frequency: 'MONTHLY',
        valueType: 'NUMERIC',
        targetType: 'MIN',
        targetValue1: 0,
        targetValue2: 0,
        aggregationMethod: 'AVG',
        unit: '',
        evidenceRequired: false,
        description: '',
        active: true,
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingKpi(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingKpi) {
        await kpisAPI.update(editingKpi.id, formData);
      } else {
        await kpisAPI.create(formData);
      }
      await fetchKpis();
      handleCloseModal();
    } catch (err: any) {
      alert(t('saveFailed'));
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete KPI: ${name}?`)) return;
    try {
      await kpisAPI.delete(id);
      await fetchKpis();
    } catch (err: any) {
      alert(t('deleteFailed'));
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('kpis')}
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
             Total: {kpis.length}
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition"
          >
            <Plus className="h-5 w-5" />
            {t('newKpi')}
          </button>
        </div>

        {!loading && (
          <FilterPanel
            isOpen={isFilterPanelOpen}
            onToggle={toggleFilterPanel}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterConfigs={filterConfigs}
            resultsCount={filteredKpis.length}
            totalCount={kpis.length}
          />
        )}

        {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
            {error}
            </div>
        )}

        {loading ? (
             <div className="text-center py-8">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
           </div>
        ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('name')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('frequency')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('valueType')}</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('status')}</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredKpis.map((kpi) => (
                        <tr key={kpi.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                {kpi.name}
                                <div className="text-xs text-gray-500 dark:text-gray-400">{kpi.competence}</div>
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {t(kpi.frequency.toLowerCase() as any) || kpi.frequency}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {t(kpi.valueType.toLowerCase() as any) || kpi.valueType}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {kpi.active ? (
                                    <span className="flex items-center text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4 mr-1" /> {t('active')}
                                    </span>
                                ) : (
                                    <span className="flex items-center text-gray-500 dark:text-gray-400">
                                        <Archive className="h-4 w-4 mr-1" /> {t('inactive')}
                                    </span>
                                )}
                             </td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => handleOpenModal(kpi)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                                    <Edit className="h-4 w-4" />
                                </button>
                                <button onClick={() => handleDelete(kpi.id, kpi.name)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                             </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
            </div>
        )}

        {modalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {editingKpi ? t('editKpi') : t('newKpi')}
                        </h3>
                        <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('name')} *</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('competence')}</label>
                                <input type="text" value={formData.competence} onChange={e => setFormData({...formData, competence: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('frequency')}</label>
                                <select value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value as EvaluationFrequency})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUAL'].map(f => (
                                        <option key={f} value={f}>{t(f.toLowerCase() as any) || f}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('valueType')}</label>
                                <select value={formData.valueType} onChange={e => setFormData({...formData, valueType: e.target.value as ValueType})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    {['BOOLEAN', 'NUMERIC', 'PERCENT', 'SCORE'].map(v => (
                                        <option key={v} value={v}>{t(v.toLowerCase() as any) || v}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('targetType')}</label>
                                <select value={formData.targetType} onChange={e => setFormData({...formData, targetType: e.target.value as TargetType})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                     {['MIN', 'MAX', 'RANGE', 'EQUAL'].map(v => (
                                        <option key={v} value={v}>{t(v.toLowerCase() as any) || v}</option>
                                    ))}
                                </select>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('aggregationMethod')}</label>
                                <select value={formData.aggregationMethod} onChange={e => setFormData({...formData, aggregationMethod: e.target.value as AggregationMethod})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                      {['LAST', 'AVG', 'SUM', 'COUNT_TRUE', 'COUNT_FALSE', 'PERCENT_TRUE', 'MANUAL_FORMULA'].map(v => (
                                        <option key={v} value={v}>{v}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('targetValue1')}</label>
                                <input type="number" step="0.01" value={formData.targetValue1} onChange={e => setFormData({...formData, targetValue1: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('targetValue2')} (Range Max)</label>
                                <input type="number" step="0.01" value={formData.targetValue2} onChange={e => setFormData({...formData, targetValue2: parseFloat(e.target.value)})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('unit')}</label>
                                <input type="text" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                            </div>
                             <div className="flex items-center pt-6">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.evidenceRequired} onChange={e => setFormData({...formData, evidenceRequired: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('evidenceRequired')}</span>
                                </label>
                            </div>
                             <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('description')}</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" rows={3} />
                            </div>
                             <div className="col-span-2">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('active')}</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 pt-4">
                            <button type="button" onClick={handleCloseModal} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">{t('cancel')}</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">{t('save')}</button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default KpisPage;
