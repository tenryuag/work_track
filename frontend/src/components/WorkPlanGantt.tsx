import React, { useState, useMemo } from 'react';
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { WorkPlanTask, WorkPlanTaskRequest } from '../types';

interface WorkPlanGanttProps {
  tasks: WorkPlanTask[];
  onAddTask: (task: WorkPlanTaskRequest) => Promise<void>;
  onUpdateTask: (taskId: number, task: WorkPlanTaskRequest) => Promise<void>;
  onDeleteTask: (taskId: number) => Promise<void>;
  year: number;
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const WorkPlanGantt: React.FC<WorkPlanGanttProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  year
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<WorkPlanTask | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date(`${year}-01-01`));

  // Form state
  const [formData, setFormData] = useState<WorkPlanTaskRequest>({
    name: '',
    startDate: `${year}-01-01`,
    endDate: `${year}-01-31`,
    progress: 0,
    status: 'TODO'
  });

  const getDaysInMonth = (monthIndex: number, year: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };

  const calculateBarPosition = (task: WorkPlanTask) => {
    const start = new Date(task.startDate);
    const end = new Date(task.endDate);
    
    // Simple positioning based on day of year relative to current view
    // For MVP, let's just show the full year or current month?
    // Let's show a scrolling view of the whole year.
    
    const startDayOfYear = (Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;
    const endDayOfYear = (Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(year, 0, 0)) / 24 / 60 / 60 / 1000;
    
    return {
      left: `${(startDayOfYear / 365) * 100}%`,
      width: `${((endDayOfYear - startDayOfYear + 1) / 365) * 100}%`
    };
  };

  const handleOpenModal = (task?: WorkPlanTask) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        name: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        progress: task.progress,
        status: task.status
      });
    } else {
      setEditingTask(null);
      setFormData({
        name: '',
        startDate: `${year}-01-01`,
        endDate: `${year}-01-31`,
        progress: 0,
        status: 'TODO'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await onUpdateTask(editingTask.id, formData);
      } else {
        await onAddTask(formData);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Tasks Timeline</h3>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Task</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          {/* Timeline Header */}
          <div className="flex border-b border-gray-200 mb-4">
            <div className="w-48 flex-shrink-0 p-2 font-medium text-gray-500">Task</div>
            <div className="flex-1 flex">
              {MONTHS.map(month => (
                <div key={month} className="flex-1 text-center border-l border-gray-100 p-2 text-sm text-gray-400">
                  {month}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="space-y-4">
            {tasks.map(task => {
              const position = calculateBarPosition(task);
              return (
                <div key={task.id} className="flex items-center group">
                  <div className="w-48 flex-shrink-0 pr-4 flex items-center justify-between">
                    <span className="truncate text-sm font-medium text-gray-700" title={task.name}>{task.name}</span>
                    <div className="opacity-0 group-hover:opacity-100 flex space-x-1">
                      <button onClick={() => handleOpenModal(task)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => onDeleteTask(task.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="flex-1 relative h-8 bg-gray-50 rounded-full overflow-hidden">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                      {MONTHS.map(month => (
                        <div key={month} className="flex-1 border-l border-gray-100" />
                      ))}
                    </div>
                    
                    {/* Task Bar */}
                    <div
                      className={`absolute h-full rounded-full flex items-center justify-center text-xs text-white transition-all
                        ${task.status === 'DONE' ? 'bg-green-500' : task.status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-gray-400'}
                      `}
                      style={{
                        left: position.left,
                        width: Math.max(parseFloat(position.width), 1) + '%' // Ensure at least minimal visibility
                      }}
                      title={`${task.name}: ${task.startDate} - ${task.endDate} (${task.progress}%)`}
                    >
                      {parseFloat(position.width) > 5 && `${task.progress}%`}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-400">No tasks defined yet.</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{editingTask ? 'Edit Task' : 'New Task'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Task Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={e => setFormData({...formData, progress: parseInt(e.target.value)})}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full rounded-lg border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
