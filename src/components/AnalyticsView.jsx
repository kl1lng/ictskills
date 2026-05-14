import React from 'react';
import { motion } from 'framer-motion';

const AnalyticsView = ({ activeClass, materials, submissions, classStudents }) => {
  const studentsInClass = classStudents[activeClass] || [];
  const assignmentsInClass = materials.filter(m => m.className === activeClass && (m.type === 'assignment' || m.category === 'Задания'));
  
  const studentsData = studentsInClass.map((studentName, index) => {
    // Count unique assignments submitted by this student in this class
    const studentSubmissions = submissions.filter(s => s.studentName === studentName && s.classId === activeClass);
    
    // To handle multiple submissions for the same assignment, we count unique resourceIds
    const uniqueSubmittedIds = new Set(studentSubmissions.map(s => s.resourceId));
    const completedCount = uniqueSubmittedIds.size;
    const totalCount = assignmentsInClass.length;
    
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const violations = studentSubmissions.filter(s => s.isLate).length;
    
    return {
      id: index,
      name: studentName,
      progress,
      assignments: completedCount,
      totalAssignments: totalCount,
      violations
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
    >
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800">Успеваемость: {activeClass} класс</h3>
        <p className="text-sm text-slate-500">Отслеживание прогресса учеников по материалам курса</p>
      </div>
      
      <div className="overflow-x-auto">
        {studentsData.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Ученик</th>
                <th className="px-6 py-4 text-center">Сдано работ</th>
                <th className="px-6 py-4 text-center">Нарушения</th>
                <th className="px-6 py-4 w-1/3">Прогресс изучения</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsData.map((student) => (
                <tr key={student.id} className={`transition-colors ${student.violations > 2 ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50/50'}`}>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {student.name}
                    {student.violations > 2 && (
                      <span className="ml-2 text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                        Подозрение
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`py-1 px-3 rounded-full font-semibold text-xs ${
                      student.assignments === student.totalAssignments && student.totalAssignments > 0 ? 'bg-emerald-50 text-emerald-700' :
                      student.assignments > 0 ? 'bg-indigo-50 text-indigo-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {student.assignments} / {student.totalAssignments}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`py-1 px-3 rounded-full font-semibold text-xs ${
                      student.violations === 0 ? 'bg-slate-50 text-slate-500' :
                      student.violations <= 2 ? 'bg-amber-50 text-amber-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {student.violations}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${student.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full rounded-full ${
                            student.progress >= 80 ? 'bg-emerald-500' : 
                            student.progress >= 50 ? 'bg-amber-400' : 'bg-red-500'
                          }`}
                        ></motion.div>
                      </div>
                      <span className="text-sm font-semibold text-slate-600 w-12 text-right">{student.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-400 font-medium">В этом классе пока нет активных учеников</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AnalyticsView;
