import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

const AuthPage = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [role, setRole] = useState('teacher'); 
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'register' && password !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    if (name && password) {
      onLogin({ 
        role, 
        name, 
        password,
        subject: role === 'teacher' ? subject : '',
        mode: authMode
      });
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
          <p className="text-indigo-100 mt-2">Образовательная платформа</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${authMode === 'login' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Вход
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-4 text-sm font-bold transition-all ${authMode === 'register' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            Регистрация
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Role Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button 
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'teacher' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Учитель
            </button>
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${role === 'student' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Ученик
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {role === 'teacher' ? 'Имя учителя' : 'Имя ученика'}
            </label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              placeholder={role === 'teacher' ? "Напр. Иван Иванов" : "Напр. Иван Иванов"}
              required
            />
          </div>

          {authMode === 'register' && role === 'teacher' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Предмет</label>
              <input 
                type="text" 
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="Напр. Учитель информатики"
                required={authMode === 'register' && role === 'teacher'}
              />
            </div>
          )}

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

          {authMode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Подтвердите пароль</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
                required={authMode === 'register'}
              />
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all mt-4 transform active:scale-95"
          >
            {authMode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
          
          <button 
            type="button"
            onClick={() => {
              const demoUser = { role: 'teacher', name: 'Дархан', password: '123', subject: 'Информатика', isDemo: true };
              onLogin(demoUser);
            }}
            className="w-full py-3 text-slate-500 text-sm font-medium hover:text-indigo-600 transition-colors"
          >
            Посмотреть демо (Дархан)
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AuthPage;
