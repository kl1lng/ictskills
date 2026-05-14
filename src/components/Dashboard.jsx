import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import ResourceGrid from './ResourceGrid';
import AddMaterialModal from './AddMaterialModal';
import AnalyticsView from './AnalyticsView';

const Dashboard = ({ classes, setClasses, selectedClass, setSelectedClass, materials, setMaterials, searchQuery, setSearchQuery, userRole, userData, onLogout, onReset }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState('materials'); // 'materials' or 'analytics'
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

  return (
    <div className="flex flex-row h-screen font-sans text-slate-900 bg-white">
      <Sidebar 
        classes={classes} 
        setClasses={setClasses} 
        activeClass={selectedClass} 
        setActiveClass={(newClass) => { setSelectedClass(newClass); setCurrentFolderId(null); }} 
        onReset={onReset}
        userRole={userRole}
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
              {viewMode === 'materials' ? 'Учебные материалы' : 'Аналитика класса'}
            </h2>
            <p className="text-slate-500 mt-1">
              {viewMode === 'materials' 
                ? `Управление контентом для ${selectedClass} класса` 
                : `Статистика успеваемости учеников ${selectedClass} класса`}
            </p>
          </div>

          {viewMode === 'materials' ? (
            <ResourceGrid 
              materials={materials} 
              setMaterials={setMaterials}
              activeClass={selectedClass} 
              searchQuery={searchQuery} 
              currentFolderId={currentFolderId}
              setCurrentFolderId={setCurrentFolderId}
              onAddFolder={handleAddFolder}
              userRole={userRole}
            />
          ) : (
            <AnalyticsView activeClass={selectedClass} />
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
