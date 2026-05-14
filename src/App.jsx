import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import AuthPage from './components/AuthPage';
import PublicResourceView from './components/PublicResourceView';
import { materials as initialMaterials, classes as initialClasses } from './data/mockData';

const App = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('teacher'); 
  const [userData, setUserData] = useState({ name: '', subject: '' });
  const [joinedClasses, setJoinedClasses] = useState([]);
  
  // URL parameters state
  const [sharedResourceId, setSharedResourceId] = useState(null);
  const [pendingJoinId, setPendingJoinId] = useState(null);

  // App state with isolation logic
  const [allClasses, setAllClasses] = useState(() => {
    const saved = localStorage.getItem('edu_global_classes');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [allMaterials, setAllMaterials] = useState(() => {
    const saved = localStorage.getItem('edu_global_materials');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedClass, setSelectedClass] = useState('10Б');
  const [searchQuery, setSearchQuery] = useState('');

  // Sync global state to LocalStorage
  useEffect(() => {
    localStorage.setItem('edu_global_classes', JSON.stringify(allClasses));
  }, [allClasses]);

  useEffect(() => {
    localStorage.setItem('edu_global_materials', JSON.stringify(allMaterials));
  }, [allMaterials]);

  // Initial Auth & Share Check
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    // 1. Check for shared resource (path or query)
    const resourceMatch = path.match(/\/share\/resource\/(\d+)/);
    const shareId = resourceMatch ? resourceMatch[1] : params.get('share');
    if (shareId) setSharedResourceId(parseInt(shareId));

    // 2. Check for join link (path or query)
    const classMatch = path.match(/\/share\/class\/(.+)/);
    const joinId = classMatch ? decodeURIComponent(classMatch[1]) : params.get('join');
    if (joinId) setPendingJoinId(joinId);

    // 3. Restore session
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    const savedSubject = localStorage.getItem('userSubject');

    if (savedName) {
      setUserRole(savedRole || 'teacher');
      setUserData({ name: savedName, subject: savedSubject || '' });
      setIsLoggedIn(true);
      
      const savedJoined = localStorage.getItem(`joined_classes_${savedName}`);
      if (savedJoined) setJoinedClasses(JSON.parse(savedJoined));
    }
  }, []);

  // Handle Pending Join
  useEffect(() => {
    if (isLoggedIn && userRole === 'student' && pendingJoinId) {
      if (!joinedClasses.includes(pendingJoinId)) {
        const newList = [...joinedClasses, pendingJoinId];
        setJoinedClasses(newList);
        localStorage.setItem(`joined_classes_${userData.name}`, JSON.stringify(newList));
        setSelectedClass(pendingJoinId);
        alert(`Вы успешно присоединились к классу ${pendingJoinId}!`);
      }
      setPendingJoinId(null);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [isLoggedIn, userRole, pendingJoinId, joinedClasses, userData.name]);

  const handleLogin = (data) => {
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userName', data.name);
    if (data.role === 'teacher') localStorage.setItem('userSubject', data.subject);
    
    // Load Demo Data if requested
    if (data.isDemo) {
      const demoExists = allClasses.some(c => c.ownerId === 'Дархан');
      if (!demoExists) {
        const demoClasses = initialClasses.map(c => ({ id: c, name: c, ownerId: 'Дархан' }));
        const demoMaterials = initialMaterials.map(m => ({ ...m, ownerId: 'Дархан' }));
        setAllClasses(prev => [...prev, ...demoClasses]);
        setAllMaterials(prev => [...prev, ...demoMaterials]);
      }
    }

    setUserRole(data.role);
    setUserData(data);
    setIsLoggedIn(true);
    
    const savedJoined = localStorage.getItem(`joined_classes_${data.name}`);
    if (savedJoined) setJoinedClasses(JSON.parse(savedJoined));
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userSubject');
    setUserData({ name: '', subject: '' });
    setJoinedClasses([]);
    setIsLoggedIn(false);
  };

  const resetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Filter content by owner
  const myClasses = allClasses.filter(c => c.ownerId === userData.name);
  const myMaterials = allMaterials.filter(m => m.ownerId === userData.name);

  // For students, show materials from classes they joined
  const studentMaterials = allMaterials.filter(m => 
    joinedClasses.includes(m.className) && m.isPublic !== false
  );

  const visibleMaterials = userRole === 'student' ? studentMaterials : myMaterials;
  const visibleClasses = userRole === 'student' 
    ? joinedClasses.map(id => ({ id, name: id })) 
    : myClasses;

  // Show Shared Resource View if requested (Public Access)
  if (sharedResourceId && !isLoggedIn) {
    const resource = allMaterials.find(m => m.id === sharedResourceId);
    if (resource) {
      return (
        <PublicResourceView 
          resource={resource} 
          onShowAll={() => setSharedResourceId(null)} 
        />
      );
    }
  }

  // Show Auth Page if not logged in
  if (!isLoggedIn) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <Dashboard 
      classes={visibleClasses}
      setClasses={(newClasses) => {
        // newClasses might be a function or array
        const updated = typeof newClasses === 'function' ? newClasses(myClasses) : newClasses;
        const otherUsersClasses = allClasses.filter(c => c.ownerId !== userData.name);
        // Map new class names to objects with ownerId
        const normalized = updated.map(c => typeof c === 'string' ? { id: c, name: c, ownerId: userData.name } : { ...c, ownerId: userData.name });
        setAllClasses([...otherUsersClasses, ...normalized]);
      }}
      selectedClass={selectedClass} 
      setSelectedClass={setSelectedClass}
      materials={visibleMaterials}
      setMaterials={(newMats) => {
        const updated = typeof newMats === 'function' ? newMats(myMaterials) : newMats;
        const otherUsersMaterials = allMaterials.filter(m => m.ownerId !== userData.name);
        const normalized = updated.map(m => ({ ...m, ownerId: userData.name }));
        setAllMaterials([...otherUsersMaterials, ...normalized]);
      }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      userRole={userRole}
      userData={userData}
      onLogout={handleLogout}
      onReset={resetData}
    />
  );
};

export default App;
