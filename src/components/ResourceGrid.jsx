import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ResourceCard from './ResourceCard';
import SubmissionModal from './SubmissionModal';
import TestModal from './TestModal';

const ResourceGrid = ({ materials, activeClass, searchQuery }) => {
  const [submissionItem, setSubmissionItem] = useState(null);
  const [testItem, setTestItem] = useState(null);

  const filteredMaterials = materials.filter(m => 
    m.className === activeClass && 
    m.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group materials by topic
  const groupedMaterials = filteredMaterials.reduce((acc, item) => {
    const topic = item.topic || 'Общее';
    if (!acc[topic]) acc[topic] = [];
    acc[topic].push(item);
    return acc;
  }, {});

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeClass}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-8"
        >
          {Object.entries(groupedMaterials).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ResourceCard 
                    key={item.id} 
                    item={item} 
                    onSubmitWork={() => setSubmissionItem(item)} 
                    onOpenTest={() => setTestItem(item)}
                  />
                ))}
              </div>
            </div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">Ничего не найдено</h3>
              <p className="text-slate-500">Попробуйте изменить запрос или выбрать другой класс</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <SubmissionModal 
        isOpen={!!submissionItem} 
        onClose={() => setSubmissionItem(null)} 
        item={submissionItem} 
      />
      
      <TestModal 
        isOpen={!!testItem} 
        onClose={() => setTestItem(null)} 
        item={testItem} 
      />
    </>
  );
};

export default ResourceGrid;
