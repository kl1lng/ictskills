import React from 'react';
import { Download, ExternalLink, ArrowLeft, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

const PublicResourceView = ({ resource, onShowAll }) => {
  const getIcon = (type) => {
    switch(type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'pptx': return '📊';
      default: return '🔗';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden border border-slate-100"
      >
        <div className="h-64 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="text-8xl transform hover:scale-110 transition-transform duration-500">
            {getIcon(resource.type)}
          </div>
        </div>

        <div className="p-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <Eye size={14} />
            Публичный просмотр
          </div>
          
          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
            {resource.title}
          </h1>
          <p className="text-slate-500 text-lg mb-10 max-w-md mx-auto">
            Этот материал был предоставлен учителем через EduSpace. Вы можете просмотреть его или скачать.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href={resource.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-1"
            >
              <ExternalLink size={20} />
              Открыть материал
            </a>
            <button 
              onClick={onShowAll}
              className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-100 hover:border-indigo-200 text-slate-600 font-bold rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Все материалы курса
            </button>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-slate-400 text-sm">
        Создано в <span className="font-bold text-indigo-500">EduSpace</span> • 2026
      </p>
    </div>
  );
};

export default PublicResourceView;
