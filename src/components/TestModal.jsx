import React, { useState } from 'react';
import { X, CheckCircle2, Trophy, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUESTIONS = [
  {
    id: 1,
    text: "Какой язык программирования является основным для создания интерактивности в веб-браузерах?",
    options: ["Python", "C++", "JavaScript", "Java"],
    correct: 2
  },
  {
    id: 2,
    text: "Что означает аббревиатура HTML?",
    options: [
      "HyperText Markup Language", 
      "High Tech Modern Language", 
      "Hyperlink and Text Management", 
      "Home Tool Markup Language"
    ],
    correct: 0
  },
  {
    id: 3,
    text: "Для чего используется CSS в веб-разработке?",
    options: [
      "Для управления базами данных", 
      "Для описания внешнего вида и оформления документа", 
      "Для написания серверной логики", 
      "Для компиляции кода"
    ],
    correct: 1
  }
];

const TestModal = ({ isOpen, onClose, item }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0: intro, 1: quiz, 2: results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);

  if (!isOpen || !item) return null;

  const handleStart = () => setCurrentStep(1);

  const handleAnswer = (optionIndex) => {
    const isCorrect = optionIndex === QUESTIONS[currentQuestion].correct;
    if (isCorrect) setScore(s => s + 1);
    
    setAnswers([...answers, optionIndex]);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(q => q + 1);
    } else {
      setCurrentStep(2);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCurrentQuestion(0);
    setAnswers([]);
    setScore(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
              ?
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-500">Мини-тестирование по модулю</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-lg transition-all">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">
                  📝
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Готовы начать?</h2>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                  Вам предстоит ответить на {QUESTIONS.length} вопроса для закрепления пройденного материала.
                </p>
                <button 
                  onClick={handleStart}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 mx-auto"
                >
                  Начать тест
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div 
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                    Вопрос {currentQuestion + 1} из {QUESTIONS.length}
                  </span>
                  <div className="flex gap-1">
                    {QUESTIONS.map((_, i) => (
                      <div 
                        key={i} 
                        className={`h-1.5 w-8 rounded-full transition-all ${i <= currentQuestion ? 'bg-indigo-500' : 'bg-slate-100'}`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 leading-tight">
                  {QUESTIONS[currentQuestion].text}
                </h3>

                <div className="grid gap-3 pt-4">
                  {QUESTIONS[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full text-left px-6 py-4 rounded-2xl border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-700 group-hover:text-indigo-700 transition-colors">{option}</span>
                        <div className="w-6 h-6 border-2 border-slate-200 rounded-full group-hover:border-indigo-500 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div 
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-24 h-24 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={48} />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Ваш результат</h2>
                <div className="text-5xl font-black text-indigo-600 mb-6">
                  {score} / {QUESTIONS.length}
                </div>
                <p className="text-slate-500 mb-10 max-w-xs mx-auto leading-relaxed">
                  {score === QUESTIONS.length ? 'Превосходно! Вы идеально усвоили материал.' : 'Хороший результат! Попробуйте еще раз для закрепления.'}
                </p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={handleReset}
                    className="px-6 py-3 border-2 border-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
                  >
                    Пересдать
                  </button>
                  <button 
                    onClick={onClose}
                    className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 transition-all"
                  >
                    Готово
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TestModal;
