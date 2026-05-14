import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ChevronRight, Folder as FolderIcon, File, X } from 'lucide-react';
import ResourceCard from './ResourceCard';
import SubmissionModal from './SubmissionModal';
import TestModal from './TestModal';

const ResourceGrid = ({ materials, setMaterials, activeClass, searchQuery, currentFolderId, setCurrentFolderId, onAddFolder }) => {
  const [submissionItem, setSubmissionItem] = useState(null);
  const [testItem, setTestItem] = useState(null);

  // Global search: if searchQuery exists, ignore currentFolderId
  const filteredMaterials = materials.filter(m => 
    m.className === activeClass && 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (searchQuery ? true : (currentFolderId ? m.folderId === currentFolderId : !m.folderId))
  );

  const folders = filteredMaterials.filter(m => m.type === 'folder');
  const files = filteredMaterials.filter(m => m.type !== 'folder');

  const handleDelete = (id) => {
    if (window.confirm('Вы уверены, что хотите удалить этот элемент?')) {
      setMaterials(materials.filter(m => m.id !== id));
    }
  };

  const getBreadcrumbs = () => {
    const path = [];
    let current = materials.find(m => m.id === currentFolderId);
    while (current) {
      path.unshift(current);
      current = materials.find(m => m.id === current.folderId);
    }
    return path;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6 text-sm font-medium text-slate-500 overflow-x-auto whitespace-nowrap pb-2">
        <button 
          onClick={() => setCurrentFolderId(null)}
          className={`hover:text-indigo-600 transition-colors shrink-0 ${!currentFolderId ? 'text-indigo-600' : ''}`}
        >
          Класс {activeClass}
        </button>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.id}>
            <ChevronRight size={14} className="text-slate-300 shrink-0" />
            <button 
              onClick={() => setCurrentFolderId(crumb.id)}
              className={`hover:text-indigo-600 transition-colors shrink-0 ${idx === breadcrumbs.length - 1 ? 'text-indigo-600 font-bold' : ''}`}
            >
              {crumb.title}
            </button>
          </React.Fragment>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeClass + (currentFolderId || 'root') + (searchQuery ? '-search' : '')}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-10"
        >
          {/* Folders Section */}
          {folders.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="text-sm">📂</span>
                Папки {searchQuery && '(результаты поиска)'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folders.map(folder => (
                  <motion.div 
                    key={folder.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all group relative"
                  >
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                      <FolderIcon size={20} fill="currentColor" fillOpacity={0.2} />
                    </div>
                    <span className="font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                      {folder.title}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(folder.id); }}
                      className="absolute top-2 right-2 p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Files Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <span className="text-sm">📄</span>
              Файлы {searchQuery && '(результаты поиска)'}
            </h3>
            {files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.map((item) => (
                  <ResourceCard 
                    key={item.id} 
                    item={item} 
                    onSubmitWork={() => setSubmissionItem(item)} 
                    onOpenTest={() => setTestItem(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                ))}
              </div>
            ) : (
              folders.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {searchQuery ? 'Ничего не найдено' : 'Пусто'}
                  </h3>
                  <p className="text-slate-500 mb-6">
                    {searchQuery ? 'Попробуйте изменить запрос' : 'В этом разделе пока нет материалов'}
                  </p>
                  {!searchQuery && (
                    <button 
                      onClick={onAddFolder}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 transition-all"
                    >
                      <FolderIcon size={18} />
                      Создать здесь
                    </button>
                  )}
                </div>
              )
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <SubmissionModal 
        isOpen={!!submissionItem} 
        onClose={() => setSubmissionItem(null)} 
        item={submissionItem} 
      />
      
      <TestModal 
        isOpen={!!testItem} 
        onClose={() => setTestItem(null)} 
        item={testItem} 
      />
    </>
  );
};

export default ResourceGrid;
