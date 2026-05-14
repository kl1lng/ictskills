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
  const [allClasses, setAllClasses] = useState([]);
  const [allMaterials, setAllMaterials] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [classStudents, setClassStudents] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState('10Б');
  const [initialFolderId, setInitialFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch initial data from backend
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        setAllClasses(data.classes || []);
        setAllMaterials(data.materials || []);
        setSubmissions(data.submissions || []);
        setClassStudents(data.classStudents || {});
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to load data:', err);
        setIsLoading(false);
      });
  }, []);

  // Sync global state to Backend
  const syncData = (newData) => {
    fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData)
    }).catch(err => console.error('Failed to sync data:', err));
  };

  useEffect(() => {
    if (!isLoading) {
      syncData({ classes: allClasses, materials: allMaterials, submissions, classStudents });
    }
  }, [allClasses, allMaterials, submissions, classStudents, isLoading]);

  // Initial Auth & Share Check
  useEffect(() => {
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    
    // 1. Check for shared resource (path or query)
    const resourceMatch = path.match(/\/share\/resource\/(\d+)/);
    const shareId = resourceMatch ? resourceMatch[1] : params.get('share');
    if (shareId) setSharedResourceId(shareId);

    // 2. Check for join link (path or query)
    const classMatch = path.match(/\/share\/class\/(.+)/);
    const joinId = classMatch ? decodeURIComponent(classMatch[1]) : params.get('join');
    if (joinId) setPendingJoinId(joinId);

    // 3. Restore session
    const savedRole = localStorage.getItem('userRole');
    const savedName = localStorage.getItem('userName');
    const savedSubject = localStorage.getItem('userSubject');
    const savedAvatar = localStorage.getItem('userAvatar');

    if (savedName) {
      setUserRole(savedRole || 'teacher');
      setUserData({ name: savedName, subject: savedSubject || '', avatar: savedAvatar });
      setIsLoggedIn(true);
      
      const savedJoined = localStorage.getItem(`joined_classes_${savedName}`);
      if (savedJoined) setJoinedClasses(JSON.parse(savedJoined));
    }
  }, []);

  // Handle Pending Join
  useEffect(() => {
    if (isLoggedIn && userRole === 'student' && pendingJoinId) {
      const decodedClassId = decodeURIComponent(pendingJoinId);
      if (!joinedClasses.includes(decodedClassId)) {
        const newList = [...joinedClasses, decodedClassId];
        setJoinedClasses(newList);
        localStorage.setItem(`joined_classes_${userData.name}`, JSON.stringify(newList));
        
        // Update global class-students mapping
        setClassStudents(prev => {
          const current = prev[decodedClassId] || [];
          if (!current.includes(userData.name)) {
            return { ...prev, [decodedClassId]: [...current, userData.name] };
          }
          return prev;
        });

        setSelectedClass(decodedClassId);
        alert(`Вы успешно присоединились к классу ${decodedClassId}!`);
      }
      setPendingJoinId(null);
      window.history.replaceState({}, document.title, '/');
    }
  }, [isLoggedIn, userRole, pendingJoinId, joinedClasses, userData.name]);

  // Handle Shared Resource Auto-Navigation
  useEffect(() => {
    if (isLoggedIn && sharedResourceId) {
      const resource = allMaterials.find(m => String(m.id) === String(sharedResourceId));
      if (resource) {
        setSelectedClass(resource.className);
        
        // Auto-join class if student
        if (userRole === 'student' && !joinedClasses.includes(resource.className)) {
          const newList = [...joinedClasses, resource.className];
          setJoinedClasses(newList);
          localStorage.setItem(`joined_classes_${userData.name}`, JSON.stringify(newList));
          
          setClassStudents(prev => {
            const current = prev[resource.className] || [];
            if (!current.includes(userData.name)) {
              return { ...prev, [resource.className]: [...current, userData.name] };
            }
            return prev;
          });
        }

        if (resource.type === 'folder') {
          setInitialFolderId(resource.id);
        }
        setSharedResourceId(null); // Clear after navigating
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, [isLoggedIn, sharedResourceId, allMaterials, userRole, joinedClasses, userData.name]);

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

  const handleUpdateUser = (newData) => {
    setUserData(newData);
    localStorage.setItem('userName', newData.name);
    if (newData.role === 'teacher') localStorage.setItem('userSubject', newData.subject);
    if (newData.avatar) localStorage.setItem('userAvatar', newData.avatar);
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('userSubject');
    localStorage.removeItem('userAvatar');
    setUserData({ name: '', subject: '' });
    setJoinedClasses([]);
    setIsLoggedIn(false);
  };

  const resetData = () => {
    if (window.confirm('Вы уверены, что хотите сбросить все данные? Внимание: Это удалит данные для всех пользователей!')) {
      localStorage.clear();
      fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classes: [], materials: [], submissions: [], classStudents: {} })
      }).then(() => window.location.reload());
    }
  };

  // Filter content by owner
  const myClasses = allClasses.filter(c => c.ownerId === userData.name);
  const myMaterials = allMaterials.filter(m => m.ownerId === userData.name);

  // For students, show materials from classes they joined OR their own materials
  const studentMaterials = allMaterials.filter(m => 
    (joinedClasses.includes(m.className) && m.isPublic !== false) || 
    m.ownerId === userData.name
  );

  const visibleMaterials = userRole === 'student' ? studentMaterials : myMaterials;
  const visibleClasses = userRole === 'student' 
    ? joinedClasses.map(id => ({ id, name: id })) 
    : myClasses;

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  // Show Shared Resource View if requested (Public Access)
  if (sharedResourceId && !isLoggedIn) {
    const resource = allMaterials.find(m => String(m.id) === String(sharedResourceId));
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
    if (isLoading) {
      return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }
    return <AuthPage onLogin={handleLogin} />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
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
      initialFolderId={initialFolderId}
      setInitialFolderId={setInitialFolderId}
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
      setUserData={handleUpdateUser}
      onLogout={handleLogout}
      onReset={resetData}
      classStudents={classStudents}
      submissions={submissions}
      setSubmissions={setSubmissions}
    />
  );
};

export default App;
