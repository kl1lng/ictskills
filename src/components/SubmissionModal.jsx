import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SubmissionModal = ({ isOpen, onClose, item, onAdd, userData }) => {
  const [studentName, setStudentName] = useState(userData?.name || '');
  const [workUrl, setWorkUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentName || !workUrl) return;
    
    const submission = {
      id: Date.now(),
      resourceId: item.id,
      resourceTitle: item.title,
      studentName: studentName,
      workUrl: workUrl,
      submittedAt: new Date().toISOString(),
      classId: item.className,
      isLate: item.deadline ? new Date() > new Date(item.deadline) : false
    };

    onAdd(submission);
    setIsSuccess(true);
    
    // Auto-close after 2 seconds
    setTimeout(() => {
      setIsSuccess(false);
      setWorkUrl('');
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div 
              key="form"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-bold text-slate-800">Сдать работу</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 hover:bg-slate-100 rounded-lg">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <p className="text-xs text-emerald-600 font-bold uppercase mb-1">Задание:</p>
                  <p className="font-semibold text-slate-800">{item.title}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ваше ФИО</label>
                  <input 
                    type="text" 
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Иванов Иван Иванович"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ссылка на работу (Google Drive/GitHub)</label>
                  <input 
                    type="url" 
                    value={workUrl}
                    onChange={e => setWorkUrl(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="https://docs.google.com/..."
                    required
                  />
                </div>
                
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
                    className="px-8 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all transform active:scale-95"
                  >
                    Отправить
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 text-center flex flex-col items-center justify-center min-h-[300px]"
            >
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Работа сдана!</h3>
              <p className="text-slate-500">Учитель получит уведомление в ближайшее время.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default SubmissionModal;
