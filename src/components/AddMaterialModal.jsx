import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, FileText } from 'lucide-react';

const AddMaterialModal = ({ isOpen, onClose, onAdd, activeClass }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('pdf');
  const [category, setCategory] = useState('Теория');
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      if (!title) setTitle(file.name.split('.')[0]);
      
      const ext = file.name.split('.').pop().toLowerCase();
      if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) setType('video');
      else if (ext === 'pdf') setType('pdf');
      else if (['pptx', 'ppt'].includes(ext)) setType('pptx');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let finalUrl = url;
    if (source === 'file' && selectedFile) {
      finalUrl = URL.createObjectURL(selectedFile);
    }

    if (!title || !finalUrl) return;
    
    const newMaterial = {
      id: Date.now(),
      title,
      type,
      category,
      url: finalUrl,
      className: activeClass,
      fileName: selectedFile ? selectedFile.name : null,
      isLocal: source === 'file',
      topic: 'Общее' // Default topic for new materials
    };

    onAdd(newMaterial);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setType('pdf');
    setCategory('Теория');
    setSource('url');
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-xl font-bold text-slate-800">Добавить материал</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Source Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              type="button"
              onClick={() => setSource('url')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${source === 'url' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LinkIcon size={16} />
              Ссылка
            </button>
            <button 
              type="button"
              onClick={() => setSource('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${source === 'file' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Upload size={16} />
              Файл
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Название</label>
            <input 
              type="text" 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Введите название материала..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Тип</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="pdf">📄 PDF</option>
                <option value="video">🎥 Видео</option>
                <option value="pptx">📊 PPTX</option>
                <option value="link">🔗 Ссылка</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Категория</label>
              <input 
                type="text" 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Напр. Теория"
                required
              />
            </div>
          </div>

          {source === 'url' ? (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ссылка (URL)</label>
              <input 
                type="url" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="https://..."
                required={source === 'url'}
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Выбор файла</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.pptx,.ppt,.mp4,.mov,.avi"
                />
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all">
                    <Upload size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-700">
                      {selectedFile ? selectedFile.name : 'Нажмите для загрузки'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF, PPTX, MP4 (до 50МБ)</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 text-slate-600 font-semibold hover:bg-slate-50 rounded-xl transition-all"
            >
              Отмена
            </button>
            <button 
              type="submit" 
              className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-95"
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
