import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ResourceGrid from './ResourceGrid';
import AddMaterialModal from './AddMaterialModal';
import AnalyticsView from './AnalyticsView';
import SettingsView from './SettingsView';

const Dashboard = ({ classes, setClasses, selectedClass, setSelectedClass, materials, setMaterials, searchQuery, setSearchQuery, userRole, userData, setUserData, onLogout, onReset, classStudents, submissions, setSubmissions }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('materials'); // 'materials', 'analytics', 'settings'
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const isTeacher = userRole === 'teacher';

  const handleAddFolder = () => {
    const folderName = window.prompt('Введите название новой папки:');
    if (folderName && folderName.trim()) {
      const newFolder = {
        id: Date.now(),
        title: folderName.trim(),
        type: 'folder',
        className: selectedClass,
        url: '#',
        folderId: currentFolderId,
        isPublic: true
      };
      setMaterials([...materials, newFolder]);
    }
  };

  const getTitle = () => {
    if (viewMode === 'materials') return 'Учебные материалы';
    if (viewMode === 'analytics') return 'Аналитика класса';
    if (viewMode === 'settings') return 'Настройки';
    return '';
  };

  const getDescription = () => {
    if (viewMode === 'materials') return `Управление контентом для ${selectedClass} класса`;
    if (viewMode === 'analytics') return `Статистика успеваемости учеников ${selectedClass} класса`;
    if (viewMode === 'settings') return 'Персонализация вашего профиля и аккаунта';
    return '';
  };

  return (
    <div className="flex flex-row h-screen font-sans text-slate-900 bg-white">
      <Sidebar 
        classes={classes} 
        setClasses={setClasses} 
        activeClass={selectedClass} 
        setActiveClass={(newClass) => { setSelectedClass(newClass); setViewMode('materials'); setCurrentFolderId(null); }} 
        onReset={onReset}
        userRole={userRole}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onAddClick={() => setIsModalOpen(true)} 
          onAddFolderClick={handleAddFolder}
          viewMode={viewMode}
          setViewMode={setViewMode}
          userData={userData}
          userRole={userRole}
          onLogout={onLogout}
          selectedClass={selectedClass}
        />
        
        <div className="flex-1 overflow-y-auto bg-slate-50 p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {getTitle()}
            </h2>
            <p className="text-slate-500 mt-1">
              {getDescription()}
            </p>
          </div>

          {viewMode === 'materials' && (
            <ResourceGrid 
              materials={materials} 
              setMaterials={setMaterials}
              activeClass={selectedClass} 
              searchQuery={searchQuery} 
              currentFolderId={currentFolderId}
              setCurrentFolderId={setCurrentFolderId}
              onAddFolder={handleAddFolder}
              userRole={userRole}
              submissions={submissions}
              setSubmissions={setSubmissions}
              userData={userData}
            />
          )}
          
          {viewMode === 'analytics' && (
            <AnalyticsView 
              activeClass={selectedClass} 
              materials={materials}
              submissions={submissions}
              classStudents={classStudents}
            />
          )}

          {viewMode === 'settings' && (
            <SettingsView userData={userData} onUpdate={setUserData} />
          )}
        </div>
      </main>

      <AddMaterialModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={(newMaterial) => setMaterials([...materials, { ...newMaterial, folderId: currentFolderId, isPublic: true }])} 
        activeClass={selectedClass}
      />
    </div>
  );
};

export default Dashboard;
