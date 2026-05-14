import React, { useState } from 'react';
import { GraduationCap, Layout, ChevronRight, Settings, Plus, X } from 'lucide-react';

const Sidebar = ({ classes, setClasses, activeClass, setActiveClass }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');

  const handleAddClass = (e) => {
    e.preventDefault();
    if (newClassName.trim() && !classes.includes(newClassName.trim())) {
      setClasses([...classes, newClassName.trim()]);
      setActiveClass(newClassName.trim());
      setNewClassName('');
      setIsAddModalOpen(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen">
      <div className="p-6 border-b border-slate-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <GraduationCap size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800">EduSpace</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Классы</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
        {classes.map((cls) => (
          <button
            key={cls}
            onClick={() => setActiveClass(cls)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
              activeClass === cls 
              ? 'bg-indigo-50 text-indigo-700 font-medium' 
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layout size={18} />
              <span>Класс {cls}</span>
            </div>
            {activeClass === cls && <ChevronRight size={16} />}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
          <Settings size={18} />
          <span>Настройки</span>
        </button>
        <button 
          onClick={onReset}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs"
        >
          <RefreshCcw size={14} />
          <span>Сбросить демо-данные</span>
        </button>
      </div>

      {/* Add Class Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Создать класс</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddClass} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Название класса</label>
                <input 
                  type="text" 
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder="Например, 11А"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors">
                  Отмена
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-colors">
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
