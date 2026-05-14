import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const TestModal = ({ isOpen, onClose, item }) => {
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closed
      setViolations(0);
      setShowWarning(false);
      return;
    }

    const handleBlur = () => {
      setViolations(v => v + 1);
      setShowWarning(true);
      
      // Hide warning toast after a few seconds
      setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    };

    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [isOpen]);

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[80vh] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Warning Toast */}
        {showWarning && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-bounce">
            <AlertTriangle size={24} />
            <span className="font-bold">Внимание! Учитель видит, если вы покидаете страницу теста.</span>
          </div>
        )}

        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{item.title}</h3>
            <p className="text-sm text-slate-500">Режим тестирования. Пожалуйста, не переключайте вкладки.</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 p-8 bg-white overflow-y-auto flex flex-col items-center justify-center">
          <div className="text-center max-w-lg">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Тестирование началось</h2>
            <p className="text-slate-600 mb-8">
              Это симуляция тестирования. Откройте новую вкладку или сверните браузер, чтобы протестировать систему Focus Tracking.
            </p>
            {violations > 0 && (
              <div className="inline-block bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold border border-red-100">
                Зафиксировано уходов со страницы: {violations}
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-colors"
          >
            Завершить тест
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestModal;
