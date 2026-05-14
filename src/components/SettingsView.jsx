import React, { useState } from 'react';
import { User, Mail, Book, Save, Upload, CheckCircle } from 'lucide-react';

const SettingsView = ({ userData, onUpdate }) => {
  const [name, setName] = useState(userData?.name || '');
  const [subject, setSubject] = useState(userData?.subject || '');
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(userData?.avatar || null);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdate({ ...userData, name, subject, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-8 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-xl font-bold text-slate-800">Настройки профиля</h3>
        <p className="text-sm text-slate-500 mt-1">Управляйте вашей личной информацией и предпочтениями</p>
      </div>

      <form onSubmit={handleSave} className="p-8 space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border-2 border-slate-200 overflow-hidden">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Upload size={20} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800">Фото профиля</h4>
            <p className="text-xs text-slate-500 mt-1">Рекомендуемый размер: 200x200px. JPG или PNG.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              Имя пользователя
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Ваше имя"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Book size={16} className="text-slate-400" />
              Предмет
            </label>
            <input 
              type="text" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Например, Информатика"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <button 
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all flex items-center gap-2"
          >
            <Save size={18} />
            Сохранить изменения
          </button>

          {saved && (
            <div className="flex items-center gap-2 text-emerald-600 font-medium animate-in fade-in slide-in-from-right-4 duration-300">
              <CheckCircle size={20} />
              Изменения сохранены!
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SettingsView;
