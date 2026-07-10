import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Layout from '../components/Layout';
import { workPlansAPI, usersAPI } from '../services/api';
import type { WorkPlan, UserBasic, WorkPlanTaskRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { Save, Calendar } from 'lucide-react';
import { WorkPlanGantt } from '../components/WorkPlanGantt';

const WorkPlansPage: React.FC = () => {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [mode, setMode] = useState<'GLOBAL' | 'USER'>('GLOBAL');
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [users, setUsers] = useState<UserBasic[]>([]);
    const [workPlan, setWorkPlan] = useState<WorkPlan | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (user?.role !== 'OPERATOR') {
            fetchUsers();
        } else {
             setMode('USER');
             setSelectedUserId(user ? user.id : null);
        }
    }, [user]);

    useEffect(() => {
        if (mode === 'GLOBAL') {
             fetchGlobalPlan();
        } else {
             if (selectedUserId) {
                 fetchUserPlan();
             } else {
                 setWorkPlan(null);
                 setDescription('');
             }
        }
    }, [mode, year, selectedUserId]);

    const fetchUsers = async () => {
        try {
            const res = await usersAPI.getAllOperators(); // Or getAllBasic()
            setUsers(res.data);
            if (res.data.length > 0 && !selectedUserId && mode === 'USER') {
                setSelectedUserId(res.data[0].id);
            }
        } catch (e) { console.error(e); }
    };

    const fetchGlobalPlan = async () => {
        setLoading(true);
        try {
            const res = await workPlansAPI.getGlobal(year);
            setWorkPlan(res.data);
            setDescription(res.data ? res.data.description : '');
        } catch (e) {
            setWorkPlan(null);
            setDescription('');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPlan = async () => {
        if (!selectedUserId) return;
        setLoading(true);
        try {
            const res = await workPlansAPI.getUser(year, selectedUserId);
            setWorkPlan(res.data);
            setDescription(res.data ? res.data.description : '');
        } catch (e) {
            setWorkPlan(null);
            setDescription('');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await workPlansAPI.upsert({
                year,
                userId: mode === 'USER' ? selectedUserId! : undefined,
                description
            });
            alert(t('saved') || 'Saved successfully');
            if (mode === 'GLOBAL') fetchGlobalPlan();
            else fetchUserPlan();
        } catch (e) {
            alert(t('saveFailed'));
        } finally {
            setSaving(false);
        }
    };

    const handleAddTask = async (task: WorkPlanTaskRequest) => {
        if (!workPlan) return;
        try {
            const res = await workPlansAPI.addTask(workPlan.id, task);
            setWorkPlan(res.data);
        } catch (e) {
            console.error(e);
            alert('Failed to add task');
        }
    };

    const handleUpdateTask = async (taskId: number, task: WorkPlanTaskRequest) => {
        try {
            const res = await workPlansAPI.updateTask(taskId, task);
            if (res.data.id === workPlan?.id) {
                setWorkPlan(res.data);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId: number) => {
        try {
            const res = await workPlansAPI.deleteTask(taskId);
            if (res.data.id === workPlan?.id) {
                setWorkPlan(res.data);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to delete task');
        }
    };


    const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER';

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('workPlans')}</h1>

                {/* Controls */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Mode Switch - Only for Admin/Manager */}
                        {user?.role !== 'OPERATOR' && (
                             <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">View Mode</label>
                                <div className="flex rounded-md shadow-sm">
                                    <button 
                                        onClick={() => setMode('GLOBAL')}
                                        className={`px-4 py-2 text-sm font-medium rounded-l-md border ${mode === 'GLOBAL' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        Global Plan
                                    </button>
                                    <button 
                                        onClick={() => setMode('USER')}
                                        className={`px-4 py-2 text-sm font-medium rounded-r-md border ${mode === 'USER' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                                    >
                                        User Plan
                                    </button>
                                </div>
                             </div>
                        )}

                        {/* Year Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                            <div className="flex items-center">
                                <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                <input 
                                    type="number" 
                                    value={year} 
                                    onChange={e => setYear(parseInt(e.target.value))} 
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                />
                            </div>
                        </div>

                         {/* User Selector */}
                        {mode === 'USER' && user?.role !== 'OPERATOR' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">User</label>
                                <select 
                                    value={selectedUserId || ''} 
                                    onChange={e => setSelectedUserId(Number(e.target.value))}
                                    className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Select User</option>
                                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Plan Content */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                    {loading ? (
                         <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                        </div>
                    ) : (
                        <div>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                    {mode === 'GLOBAL' ? `Global Plan ${year}` : `User Plan: ${users.find(u => u.id === selectedUserId)?.name || 'My Plan'} (${year})`}
                                </h2>
                                {canEdit && (
                                     <button 
                                        onClick={handleSave} 
                                        disabled={saving}
                                        className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
                                     >
                                         <Save className="h-4 w-4 mr-2" />
                                         {saving ? 'Saving...' : t('save')}
                                     </button>
                                )}
                             </div>
                             
                             <textarea 
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                disabled={!canEdit}
                                rows={15}
                                className="w-full p-4 border rounded-lg bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter work plan details here..."
                             />
                        </div>
                    )}
                </div>

                {/* Gantt Chart Section */}
                {workPlan && (
                    <div className="mt-8">
                        <WorkPlanGantt 
                            tasks={workPlan.tasks || []}
                            onAddTask={handleAddTask}
                            onUpdateTask={handleUpdateTask}
                            onDeleteTask={handleDeleteTask}
                            year={year}
                        />
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default WorkPlansPage;
