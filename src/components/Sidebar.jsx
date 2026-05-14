import React, { useState } from 'react';
import { GraduationCap, Layout, ChevronRight, Settings, Plus, X, RefreshCcw, PanelLeftClose } from 'lucide-react';

const Sidebar = ({ classes, setClasses, activeClass, setActiveClass, onReset, userRole }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const isTeacher = userRole === 'teacher';

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
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-slate-200 flex flex-col shrink-0 h-screen transition-all duration-300 relative`}>
      <div className={`p-6 border-b border-slate-100 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 shrink-0">
          <GraduationCap size={24} />
        </div>
        {!isCollapsed && <h1 className="text-xl font-bold tracking-tight text-slate-800 truncate">EduSpace</h1>}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-indigo-600 shadow-sm z-10 transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <PanelLeftClose size={14} />
        </button>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className={`flex items-center justify-between mb-4 ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}>
          {!isCollapsed && (
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              {isTeacher ? 'Мои классы' : 'Мои курсы'}
            </p>
          )}
          {isTeacher && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          )}
        </div>
        {classes.map((cls) => {
          const clsId = typeof cls === 'string' ? cls : cls.id;
          const clsName = typeof cls === 'string' ? cls : cls.name;
          
          return (
            <button
              key={clsId}
              onClick={() => setActiveClass(clsId)}
              title={isCollapsed ? `Класс ${clsName}` : ''}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 rounded-xl transition-all duration-200 ${
                activeClass === clsId 
                ? 'bg-indigo-50 text-indigo-700 font-medium' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layout size={18} className="shrink-0" />
                {!isCollapsed && <span className="truncate">Класс {clsName}</span>}
              </div>
              {activeClass === clsId && !isCollapsed && <ChevronRight size={16} className="shrink-0" />}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto space-y-1">
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors`}>
          <Settings size={18} className="shrink-0" />
          {!isCollapsed && <span>Настройки</span>}
        </button>
        <button 
          onClick={onReset}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs`}
        >
          <RefreshCcw size={14} className="shrink-0" />
          {!isCollapsed && <span className="truncate">Сброс данных</span>}
        </button>
      </div>

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
