import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import FilterPanel from '../components/FilterPanel';
import { assignmentsAPI, evaluationsAPI, usersAPI } from '../services/api';
import type { Assignment, EvaluationRequest, UserBasic, Period } from '../types';
import { useAuth } from '../context/AuthContext';
import { Plus, X } from 'lucide-react';
import { useFilters, filterHelpers } from '../hooks/useFilters';

const EvaluationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [workers, setWorkers] = useState<UserBasic[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [period, setPeriod] = useState<Period | null>(null);
  const [formData, setFormData] = useState<EvaluationRequest>({
    assignmentId: 0,
    periodStart: '',
    periodEnd: '',
    valueBoolean: undefined,
    valueNumber: undefined,
    valueText: undefined,
    status: 'SUBMITTED',
    evidence: [],
  });
  
  // Evidence state
  const [evidenceNote, setEvidenceNote] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // Admin/Manager view state
  const [selectedWorkerId, setSelectedWorkerId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, [user, selectedWorkerId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (user?.role === 'OPERATOR') {
          // Managers/Admins can also have assignments but usually they view others
          const res = await assignmentsAPI.getByWorker(user.id);
          setAssignments(res.data);
      } else {
          // Admin/Manager
          // If a worker is selected, fetch their assignments. 
          // If not, maybe fetch list of workers first.
          const workersRes = await usersAPI.getAllOperators();
          setWorkers(workersRes.data);
          
          if (selectedWorkerId) {
              const res = await assignmentsAPI.getByWorker(selectedWorkerId);
              setAssignments(res.data);
          } else {
              setAssignments([]); 
          }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEvaluate = async (assignment: Assignment) => {
      setSelectedAssignment(assignment);
      // Fetch current period
      try {
          const periodRes = await evaluationsAPI.getCurrentPeriod(assignment.kpi.frequency);
          setPeriod(periodRes.data);
          setFormData({
              assignmentId: assignment.id,
              periodStart: periodRes.data.startDate,
              periodEnd: periodRes.data.endDate,
              valueBoolean: undefined,
              valueNumber: undefined,
              valueText: '',
              status: 'SUBMITTED',
              evidence: [] // Reset evidence
          });
          setEvidenceNote('');
          setEvidenceUrl('');
          setModalOpen(true);
      } catch (e) {
          alert('Failed to get period');
      }
  };

  const handleAddEvidence = () => {
      if (!evidenceUrl && !evidenceNote) return;
      const newEvidence = [...(formData.evidence || [])];
      newEvidence.push({ fileUrl: evidenceUrl, note: evidenceNote });
      setFormData({...formData, evidence: newEvidence});
      setEvidenceUrl('');
      setEvidenceNote('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          await evaluationsAPI.submit(formData);
          alert(t('submittedSuccess') || 'Submitted successfully');
          setModalOpen(false);
      } catch (e) {
          alert(t('saveFailed'));
      }
  };
  
  const filterAssignmentsFn = (assignment: Assignment, filters: Record<string, any>) => {
      if (filters.search && !filterHelpers.textMatches(assignment.kpi.name, filters.search)) return false;
      return true;
  };
    
  const {
    filters,
    filteredItems: filteredAssignments,
    isFilterPanelOpen,
    handleFilterChange,
    handleClearFilters,
    toggleFilterPanel,
  } = useFilters(assignments, filterAssignmentsFn);

   const filterConfigs = useMemo(() => [
     {
        type: 'text' as const,
        label: t('search'),
        field: 'search',
        placeholder: 'Search KPI',
     }
   ], [t]);


  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('evaluations')}</h1>

        {user?.role !== 'OPERATOR' && (
            <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('selectUser')}</label>
                <select 
                    value={selectedWorkerId || ''} 
                    onChange={e => setSelectedWorkerId(Number(e.target.value))}
                    className="w-full md:w-1/3 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                    <option value="">{t('selectUser')}</option>
                    {workers.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
            </div>
        )}
        
        {!loading && user?.role === 'OPERATOR' || selectedWorkerId ? (
             <>
                <FilterPanel
                    isOpen={isFilterPanelOpen}
                    onToggle={toggleFilterPanel}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    filterConfigs={filterConfigs}
                    resultsCount={filteredAssignments.length}
                    totalCount={assignments.length}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {filteredAssignments.map(a => (
                        <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-l-4 border-blue-500">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{a.kpi.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{a.kpi.description}</p>
                            <div className="text-sm space-y-2 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">{t('frequency')}:</span>
                                    <span className="font-medium dark:text-gray-300">{a.kpi.frequency}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Target:</span>
                                    <span className="font-medium dark:text-gray-300">{a.targetOverride ?? a.kpi.targetValue1} {a.kpi.unit}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleOpenEvaluate(a)}
                                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                            >
                                {t('submit')} Evaluation
                            </button>
                        </div>
                    ))}
                    {filteredAssignments.length === 0 && (
                        <div className="col-span-full text-center text-gray-500 py-12">
                             No assignments found.
                        </div>
                    )}
                </div>
             </>
        ) : (
            user?.role !== 'OPERATOR' && !selectedWorkerId && <div className="text-gray-500">Please select a worker to view assignments.</div>
        )}

        {/* Evaluation Modal */}
        {modalOpen && selectedAssignment && (
             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                     <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                            {t('submit')} Evaluation: {selectedAssignment.kpi.name}
                        </h3>
                        <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Period Info */}
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">{t('period')}</label>
                            <div className="text-lg font-bold text-blue-900 dark:text-blue-200">
                                {period?.label} ({period?.startDate} - {period?.endDate})
                            </div>
                        </div>

                        {/* Value Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Value ({selectedAssignment.kpi.unit})
                            </label>
                            {selectedAssignment.kpi.valueType === 'BOOLEAN' ? (
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="valBool" checked={formData.valueBoolean === true} onChange={() => setFormData({...formData, valueBoolean: true})} className="text-blue-600" />
                                        <span className="dark:text-white">Yes / Pass</span>
                                    </label>
                                     <label className="flex items-center space-x-2 cursor-pointer">
                                        <input type="radio" name="valBool" checked={formData.valueBoolean === false} onChange={() => setFormData({...formData, valueBoolean: false})} className="text-blue-600" />
                                        <span className="dark:text-white">No / Fail</span>
                                    </label>
                                </div>
                            ) : (
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    value={formData.valueNumber || ''} 
                                    onChange={e => setFormData({...formData, valueNumber: parseFloat(e.target.value)})} 
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                    required 
                                />
                            )}
                        </div>
                        
                        {/* Evidence Section */}
                         <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Evidence {selectedAssignment.kpi.evidenceRequired && <span className="text-red-500">*</span>}
                            </label>
                            <div className="space-y-3">
                                <input 
                                    type="text" 
                                    placeholder="File URL / Link" 
                                    value={evidenceUrl} 
                                    onChange={e => setEvidenceUrl(e.target.value)} 
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                />
                                <input 
                                    type="text" 
                                    placeholder="Note / Description" 
                                    value={evidenceNote} 
                                    onChange={e => setEvidenceNote(e.target.value)} 
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white" 
                                />
                                <button type="button" onClick={handleAddEvidence} className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                                    <Plus className="h-4 w-4 mr-1" /> Add Evidence
                                </button>
                                
                                {/* Evidence List */}
                                {formData.evidence && formData.evidence.length > 0 && (
                                    <ul className="mt-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2">
                                        {formData.evidence.map((ev, idx) => (
                                            <li key={idx} className="flex justify-between items-center py-1">
                                                <span>{ev.note || ev.fileUrl}</span>
                                                <button type="button" onClick={() => {
                                                    const newEv = [...(formData.evidence || [])];
                                                    newEv.splice(idx, 1);
                                                    setFormData({...formData, evidence: newEv});
                                                }} className="text-red-500">
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>

                         <div className="flex justify-end space-x-3 pt-6">
                            <button type="button" onClick={() => setModalOpen(false)} className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition">{t('cancel')}</button>
                            <button type="submit" className="px-6 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition">{t('submit')}</button>
                        </div>
                    </form>
                </div>
             </div>
        )}

      </div>
    </Layout>
  );
};

export default EvaluationsPage;
