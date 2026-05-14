import React from 'react';
import { Search, User, BookOpen, Bell, Share2, LogOut } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, onAddClick, viewMode, setViewMode, teacherData, onLogout, selectedClass }) => {
  
  const handleShare = () => {
    const link = `https://eduspace.kz/share/class-${selectedClass.toLowerCase()}`;
    navigator.clipboard.writeText(link).catch(() => {});
    alert(`Ссылка скопирована!\n${link}\nОтправьте её ученикам.`);
  };

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('materials')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'materials' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Материалы
          </button>
          <button 
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Успеваемость
          </button>
        </div>

        {viewMode === 'materials' && (
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {viewMode === 'materials' && (
          <>
            <button onClick={handleShare} className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium text-sm">
              <Share2 size={18} />
              Поделиться
            </button>
            <button onClick={onAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all flex items-center gap-2">
              <BookOpen size={18} />
              Добавить
            </button>
          </>
        )}

        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors ml-2">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{teacherData?.name || 'Иван Иванов'}</p>
            <p className="text-xs text-slate-500">{teacherData?.subject || 'Учитель'}</p>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
            <User size={20} />
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-1" title="Выход">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
