import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && subject && password) {
      onLogin(name, subject);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        <div className="p-8 text-center bg-indigo-600">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg mx-auto mb-4">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EduSpace</h1>
          <p className="text-indigo-100 mt-2">Кабинет преподавателя</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Вход в систему</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Имя учителя</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Например, Анна Сергеевна"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Предмет</label>
            <input 
              type="text" 
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="Например, Учитель информатики"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Пароль</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md shadow-indigo-200 transition-all mt-4"
          >
            Войти в кабинет
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
