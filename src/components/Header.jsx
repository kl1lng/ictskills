import React from 'react';
import { Search, User, BookOpen, Bell, Share2, LogOut, FolderPlus, GraduationCap, Link as LinkIcon } from 'lucide-react';

const Header = ({ searchQuery, setSearchQuery, onAddClick, onAddFolderClick, viewMode, setViewMode, userData, userRole, onLogout, selectedClass }) => {
  
  const handleShare = () => {
    const link = `${window.location.origin}/share/resource/${Date.now()}`; 
    navigator.clipboard.writeText(link).catch(() => {});
    alert(`Ссылка на материал скопирована!\n${link}\nОтправьте её ученикам для быстрого просмотра.`);
  };

  const handleInviteCopy = () => {
    const link = `${window.location.origin}/share/class/${selectedClass}`;
    navigator.clipboard.writeText(link).catch(() => {});
    alert(`Инвайт-ссылка в класс скопирована!\n${link}\nОтправьте её ученикам для вступления в класс.`);
  };

  const isTeacher = userRole === 'teacher';

  return (
    <header className="min-h-[80px] py-2 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 shrink-0 gap-4">
      <div className="flex items-center gap-4 sm:gap-6 min-w-0">
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          <button 
            onClick={() => setViewMode('materials')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'materials' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Материалы
          </button>
          {isTeacher && (
            <button 
              onClick={() => setViewMode('analytics')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${viewMode === 'analytics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Успеваемость
            </button>
          )}
        </div>

        {viewMode === 'materials' && (
          <div className="relative hidden md:block max-w-[200px] lg:max-w-xs flex-1">
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

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {viewMode === 'materials' && (
          <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap">
            {isTeacher ? (
              <>
                <button onClick={handleInviteCopy} className="text-emerald-600 hover:text-emerald-700 transition-colors flex items-center gap-2 font-bold text-sm px-2 sm:px-3 py-2 bg-emerald-50 rounded-xl shrink-0" title="Инвайт">
                  <LinkIcon size={18} />
                  <span className="hidden xl:inline">Инвайт</span>
                </button>
                <button onClick={handleShare} className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2 font-medium text-sm px-2 sm:px-3 py-2 shrink-0" title="Поделиться">
                  <Share2 size={18} />
                  <span className="hidden 2xl:inline">Поделиться</span>
                </button>
                <button onClick={onAddFolderClick} className="text-slate-600 hover:text-indigo-600 px-2 sm:px-3 py-2 rounded-xl font-medium border border-slate-200 hover:border-indigo-100 transition-all flex items-center gap-2 bg-white shrink-0" title="Новая папка">
                  <FolderPlus size={18} />
                  <span className="hidden 2xl:inline">Папка</span>
                </button>
                <button onClick={onAddClick} className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 sm:px-4 py-2 rounded-xl font-medium shadow-md shadow-indigo-200 transition-all flex items-center gap-2 shrink-0">
                  <BookOpen size={18} />
                  <span className="hidden lg:inline">Добавить</span>
                </button>
              </>
            ) : (
              <div className="px-3 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold flex items-center gap-2 shrink-0">
                <GraduationCap size={18} />
                <span className="truncate max-w-[80px] lg:max-w-none">{selectedClass} Класс</span>
              </div>
            )}
          </div>
        )}

        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors shrink-0">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 border-l border-slate-100 shrink-0">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-semibold text-slate-800 truncate max-w-[100px]">{userData?.name || 'Пользователь'}</p>
            <p className="text-xs text-slate-500 truncate max-w-[100px]">{isTeacher ? (userData?.subject || 'Учитель') : 'Ученик'}</p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200 shrink-0">
            <User size={18} />
          </div>
          <button onClick={onLogout} className="p-1 sm:p-2 text-slate-400 hover:text-red-500 transition-colors" title="Выход">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
