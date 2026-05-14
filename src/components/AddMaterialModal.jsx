import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddMaterialModal = ({ isOpen, onClose, onAdd, activeClass }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [category, setCategory] = useState('Теория');
  const [url, setUrl] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !url) return;
    
    const newMaterial = {
      id: Date.now(),
      title,
      type,
      category,
      url,
      className: activeClass
    };
    onAdd(newMaterial);
    setTitle('');
    setUrl('');
    setType('pdf');
    setCategory('Теория');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Добавить материал</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Название</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Например, Конспект урока"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Тип</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="pdf">PDF</option>
                <option value="video">Видео</option>
                <option value="link">Ссылка</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Категория</label>
              <input 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                placeholder="Теория"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка (URL)</label>
            <input 
              type="url" 
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="https://..."
              required
            />
          </div>
          
          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-colors"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMaterialModal;
