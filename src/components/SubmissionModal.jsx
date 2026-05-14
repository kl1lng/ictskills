import React, { useState } from 'react';
import { X } from 'lucide-react';

const SubmissionModal = ({ isOpen, onClose, item }) => {
  const [studentName, setStudentName] = useState('');
  const [workUrl, setWorkUrl] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !workUrl) return;
    
    alert('Работа успешно отправлена учителю!');
    setStudentName('');
    setWorkUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800">Сдать работу</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 mb-4">
            <p className="text-sm text-slate-500 mb-1">Задание:</p>
            <p className="font-semibold text-slate-800">{item.title}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">ФИО ученика</label>
            <input 
              type="text" 
              value={studentName}
              onChange={e => setStudentName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Иванов Иван"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ссылка на работу (Google Drive/GitHub)</label>
            <input 
              type="url" 
              value={workUrl}
              onChange={e => setWorkUrl(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
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
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl shadow-md shadow-emerald-200 transition-colors"
            >
              Отправить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionModal;
