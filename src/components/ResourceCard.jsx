import React, { useState } from 'react';
import { FileText, Video, Link as LinkIcon, ExternalLink, Play, Eye, Presentation, Folder, Trash2, Copy, Check } from 'lucide-react';

const ResourceCard = ({ item, onSubmitWork, onOpenTest, onDelete, onOpenFolder }) => {
  const [copied, setCopied] = useState(false);

  const getIcon = (type) => {
    switch(type) {
      case 'video': return <span className="text-lg leading-none">🎥</span>;
      case 'pdf': return <span className="text-lg leading-none">📄</span>;
      case 'pptx': return <span className="text-lg leading-none">📊</span>;
      case 'link': return <span className="text-lg leading-none">🔗</span>;
      case 'folder': return <span className="text-lg leading-none">📂</span>;
      default: return <FileText size={18} />;
    }
  };

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getYoutubeThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
  };

  const renderPreview = () => {
    if (item.type === 'folder') {
      return (
        <div className="w-full h-full bg-indigo-50 flex items-center justify-center relative group-hover:bg-indigo-100 transition-colors">
          <Folder className="text-indigo-500 group-hover:scale-110 transition-transform duration-300" size={48} fill="currentColor" fillOpacity={0.1} />
        </div>
      );
    }

    const ytThumbnail = item.type === 'video' ? getYoutubeThumbnail(item.url) : null;
    
    if (ytThumbnail) {
      return (
        <div className="w-full h-full relative group/preview">
          <img src={ytThumbnail} alt={item.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/20 flex items-center justify-center">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="text-white ml-1" size={24} fill="currentColor" />
            </div>
          </div>
        </div>
      );
    }

    switch(item.type) {
      case 'video':
        return (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Play className="text-white ml-1" size={24} fill="currentColor" />
            </div>
          </div>
        );
      case 'pptx':
        return (
          <div className="w-full h-full bg-orange-50 flex items-center justify-center relative overflow-hidden">
            <div className="w-16 h-20 bg-white shadow-md border border-orange-100 rounded flex items-center justify-center z-10">
              <Presentation className="text-orange-500" size={32} />
            </div>
          </div>
        );
      case 'pdf':
        return (
          <div className="w-full h-full bg-red-50 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 flex flex-col gap-2 p-4">
              <div className="h-2 bg-red-900 rounded w-3/4"></div>
              <div className="h-2 bg-red-900 rounded w-full"></div>
              <div className="h-2 bg-red-900 rounded w-5/6"></div>
              <div className="h-2 bg-red-900 rounded w-full"></div>
              <div className="h-2 bg-red-900 rounded w-4/5"></div>
            </div>
            <div className="w-16 h-20 bg-white shadow-md border border-red-100 rounded flex items-center justify-center z-10">
              <FileText className="text-red-500" size={32} />
            </div>
          </div>
        );
      case 'link':
      default:
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9IiM2NDc0OGIiLz48L3N2Zz4=')]"></div>
            <div className="w-16 h-16 bg-white shadow-sm border border-slate-200 rounded-2xl flex items-center justify-center z-10">
              <ExternalLink className="text-slate-400" size={28} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-col h-full overflow-hidden group hover:-translate-y-1 relative">
      {/* Delete Button */}
      <button 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm text-slate-400 hover:text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm"
      >
        <Trash2 size={16} />
      </button>

      {/* Preview Area */}
      <div className="h-[140px] w-full relative shrink-0 border-b border-slate-50">
        {renderPreview()}
        {/* Hover Overlay */}
        <div 
          className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300 flex items-center justify-center cursor-pointer" 
          onClick={() => {
            if (item.type === 'folder') onOpenFolder();
            else if (item.category === 'Тесты' && onOpenTest) onOpenTest(item);
            else window.open(item.url, '_blank');
          }}
        >
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-slate-900 px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg transform scale-95 group-hover:scale-100">
            {item.type === 'folder' ? <Folder size={16} /> : item.type === 'video' ? <Play size={16} fill="currentColor" /> : <Eye size={16} />}
            {item.type === 'folder' ? 'Открыть папку' : 'Смотреть'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-lg ${
            item.type === 'video' ? 'bg-blue-50 text-blue-600' :
            item.type === 'pdf' ? 'bg-red-50 text-red-600' :
            item.type === 'pptx' ? 'bg-orange-50 text-orange-600' :
            item.type === 'folder' ? 'bg-indigo-50 text-indigo-600' :
            'bg-green-50 text-green-600'
          }`}>
            {getIcon(item.type)}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {item.type === 'folder' ? 'Папка' : item.category}
          </span>
        </div>
        
        <h3 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.title}</h3>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 flex items-center gap-1 uppercase font-medium">
            {getIcon(item.type)}
            {item.type}
          </span>
          <div className="flex items-center gap-2">
            {item.type !== 'folder' && (
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-lg transition-all ${copied ? 'text-emerald-500 bg-emerald-50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
                title="Копировать ссылку"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            )}
            
            {item.category === 'Задания' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onSubmitWork(item); }} 
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Сдать
              </button>
            )}
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                if (item.type === 'folder') onOpenFolder();
                else if (item.category === 'Тесты' && onOpenTest) onOpenTest(item);
                else window.open(item.url, '_blank'); 
              }} 
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Открыть
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default ResourceCard;
