import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import { materials as initialMaterials, classes as initialClasses } from './data/mockData';

const App = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherData, setTeacherData] = useState({ name: '', subject: '' });
  
  // App state with LocalStorage persistence
  const [classesList, setClassesList] = useState(() => {
    const saved = localStorage.getItem('edu_classes');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  
  const [materials, setMaterials] = useState(() => {
    const saved = localStorage.getItem('edu_materials');
    return saved ? JSON.parse(saved) : initialMaterials;
  });

  const [selectedClass, setSelectedClass] = useState(classesList[1] || classesList[0] || '10Б');
  const [searchQuery, setSearchQuery] = useState('');

  // Initial Auth Check
  useEffect(() => {
    const savedName = localStorage.getItem('teacherName');
    const savedSubject = localStorage.getItem('teacherSubject');
    if (savedName) {
      setTeacherData({ name: savedName, subject: savedSubject || 'Учитель' });
      setIsLoggedIn(true);
    }
  }, []);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('edu_classes', JSON.stringify(classesList));
  }, [classesList]);

  useEffect(() => {
    localStorage.setItem('edu_materials', JSON.stringify(materials));
  }, [materials]);

  const handleLogin = (name, subject) => {
    localStorage.setItem('teacherName', name);
    localStorage.setItem('teacherSubject', subject);
    setTeacherData({ name, subject });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherSubject');
    setTeacherData({ name: '', subject: '' });
    setIsLoggedIn(false);
  };

  const resetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все демо-данные? Это удалит ваши классы и материалы.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      classes={classesList}
      setClasses={setClassesList}
      selectedClass={selectedClass} 
      setSelectedClass={setSelectedClass}
      materials={materials}
      setMaterials={setMaterials}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      teacherData={teacherData}
      onLogout={handleLogout}
      onReset={resetData}
    />
  );
};

export default App;
