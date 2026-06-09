import React, { useState } from 'react';
import { X, Calculator, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REGION_CALC_CONFIG: Record<string, {
  maxPoints: number;
  grades: Record<string, number>;
  comp: { score: string, point: number }[];
  otherMax: number;
  otherDetails: { label: string; score: string }[];
}> = {
  '基北區': {
    maxPoints: 108,
    grades: { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 },
    comp: [
      { score: '6', point: 1 }, { score: '5', point: 0.8 }, { score: '4', point: 0.6 },
      { score: '3', point: 0.4 }, { score: '2', point: 0.2 }, { score: '1', point: 0.1 }, { score: '0', point: 0 }
    ],
    otherMax: 72,
    otherDetails: [
      { label: '志願序', score: '上限 36 分' },
      { label: '多元學習表現', score: '上限 36 分' },
      { label: '↳ 均衡學習', score: '上限 24 分' },
      { label: '↳ 服務學習', score: '上限 12 分' }
    ]
  },
  '桃連區': {
    maxPoints: 100,
    grades: { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 },
    comp: [
      { score: '6', point: 3 }, { score: '5', point: 3 }, { score: '4', point: 3 },
      { score: '3', point: 2 }, { score: '2', point: 2 }, { score: '1', point: 1 }
    ],
    otherMax: 67,
    otherDetails: [
      { label: '適性輔導', score: '上限 32 分' },
      { label: '↳ 志願序、生涯規劃等', score: '' },
      { label: '多元學習表現', score: '上限 35 分' },
      { label: '↳ 均衡、品德、體適能等', score: '' }
    ]
  },
  '中投區': {
    maxPoints: 100,
    grades: { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 },
    comp: [],
    otherMax: 70,
    otherDetails: [
      { label: '志願序', score: '上限 30 分' },
      { label: '就近入學', score: '10 分' },
      { label: '扶助弱勢', score: '3 分' },
      { label: '多元學習', score: '上限 27 分' }
    ]
  },
  '彰化區': {
    maxPoints: 135,
    grades: { 'A++': 9, 'A+': 8, 'A': 7, 'B++': 6, 'B+': 5, 'B': 4, 'C': 3 },
    comp: [],
    otherMax: 90,
    otherDetails: [
      { label: '志願序', score: '上限 45 分' },
      { label: '就近入學', score: '7 分' },
      { label: '品德服務', score: '20 分' },
      { label: '績優表現', score: '16 分' },
      { label: '身分別', score: '2 分' }
    ]
  },
  '雲林區': {
    maxPoints: 90,
    grades: { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 5, 'B+': 4.5, 'B': 4, 'C': 2 },
    comp: [],
    otherMax: 60,
    otherDetails: [
      { label: '志願序', score: '8 分' },
      { label: '就近入學', score: '10 分' },
      { label: '出缺席/無記過', score: '最高 10 分' },
      { label: '均衡/獎勵/競賽', score: '最高 34 分' }
    ]
  },
  '高雄區': {
    maxPoints: 100,
    grades: { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 },
    comp: [],
    otherMax: 70,
    otherDetails: [
      { label: '志願序', score: '上限 30 分' },
      { label: '多元發展項目', score: '上限 40 分' },
      { label: '↳ 均衡學習', score: '上限 10 分' },
      { label: '↳ 服務學習等', score: '最高 30 分' }
    ]
  },
  '臺南區': {
    maxPoints: 108,
    grades: { 'A++': 7, 'A+': 6, 'A': 5, 'B++': 4, 'B+': 3, 'B': 2, 'C': 1 },
    comp: [
      { score: '6', point: 1 }, { score: '5', point: 0.8 }, { score: '4', point: 0.6 },
      { score: '3', point: 0.4 }, { score: '2', point: 0.2 }, { score: '1', point: 0.1 }, { score: '0', point: 0 }
    ],
    otherMax: 72,
    otherDetails: [
      { label: '志願序', score: '上限 12 分' },
      { label: '多元學習表現', score: '上限 50 分' },
      { label: '就近入學', score: '10 分' }
    ]
  }
};

export const CalculatorModal: React.FC<CalculatorModalProps> = ({ isOpen, onClose }) => {
  const [region, setRegion] = useState('基北區');
  const [calcGrades, setCalcGrades] = useState({
    mandarin: 'B', english: 'B', math: 'B', social: 'B', science: 'B'
  });
  const [calcComposition, setCalcComposition] = useState('3');
  const [otherPoints, setOtherPoints] = useState<string>('');

  if (!isOpen) return null;

  const config = REGION_CALC_CONFIG[region];
  const examPoints = Object.values(calcGrades).reduce<number>((acc, grade) => acc + (config.grades[grade as string] || 0), 0);
  
  let compPoints = 0;
  if (config.comp.length > 0) {
    const compOption = config.comp.find(c => c.score === calcComposition);
    if (compOption) compPoints = compOption.point;
  }
  
  let parsedOther = parseFloat(otherPoints);
  if (isNaN(parsedOther)) parsedOther = 0;
  if (parsedOther > config.otherMax) parsedOther = config.otherMax;
  if (parsedOther < 0) parsedOther = 0;

  const totalPoints = examPoints + compPoints + parsedOther;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 w-full max-w-lg mb-[10vh] max-h-[85vh] overflow-y-auto relative"
        >
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 p-2 rounded-full z-10 outline-none"
          >
            <X size={18} />
          </button>
          
          <div className="text-center mb-6">
            <div className="inline-flex justify-center items-center bg-amber-100 text-amber-600 p-3 rounded-2xl mb-3 shadow-inner">
              <Calculator size={28} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">各區會考積分試算</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">選取考區以利試算總分數</p>
          </div>
          
          <div className="mb-5 relative">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">選擇就學區</label>
            <div className="relative">
              <select
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value);
                  setOtherPoints(''); // Reset other points on region change
                  // If switching from region with writing to one without, just keep standard defaults.
                }}
                className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl px-4 py-3 pr-10 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              >
                {Object.keys(REGION_CALC_CONFIG).map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-100/60 mb-6">
            <div className="text-center">
              <span className="text-xs font-bold text-amber-700/70 uppercase tracking-widest mb-1 block">預估總積分</span>
              <span className="text-5xl font-black text-amber-600 drop-shadow-sm">{totalPoints % 1 !== 0 ? totalPoints.toFixed(1) : totalPoints}</span>
              <span className="text-sm font-bold text-amber-600/70 ml-1 block mt-1">/ {config.maxPoints} 分</span>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { key: 'mandarin', label: '國文' },
              { key: 'english', label: '英文' },
              { key: 'math', label: '數學' },
              { key: 'social', label: '社會' },
              { key: 'science', label: '自然' }
            ].map(subject => (
              <div key={subject.key} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-slate-700 w-1/4">{subject.label}</span>
                <div className="flex gap-1 overflow-x-auto w-3/4 justify-end no-scrollbar pb-1">
                  {Object.keys(config.grades).map(score => (
                    <button
                      key={score}
                      onClick={() => setCalcGrades(prev => ({ ...prev, [subject.key]: score }))}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${calcGrades[subject.key as keyof typeof calcGrades] === score ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-600'}`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {config.comp.length > 0 && (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                <span className="font-bold text-slate-700 w-1/4 flex-shrink-0">寫作測驗</span>
                <div className="flex gap-1 overflow-x-auto w-3/4 justify-end no-scrollbar pb-1">
                  {config.comp.map(c => (
                    <button
                      key={c.score}
                      onClick={() => setCalcComposition(c.score)}
                      className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${calcComposition === c.score ? 'bg-amber-500 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:text-amber-600'}`}
                    >
                      {c.score}級
                    </button>
                  ))}
                </div>
              </div>
            )}

            {config.otherMax > 0 && (
              <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-2">其他多元學習、志願序等積分</label>
                
                <div className="bg-white rounded-lg border border-slate-200/60 p-3 mb-3 shadow-sm">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 pb-2 border-b border-slate-100">
                    積分項目參考細項
                  </div>
                  <div className="space-y-1.5 pt-1">
                    {config.otherDetails.map((detail, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className={`text-[13px] ${detail.label.startsWith('↳') ? 'text-slate-400 pl-2' : 'text-slate-600 font-medium'}`}>
                          {detail.label}
                        </span>
                        {detail.score && (
                          <span className="text-[12px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded text-right whitespace-nowrap">
                            {detail.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    min="0"
                    max={config.otherMax}
                    value={otherPoints}
                    onChange={(e) => setOtherPoints(e.target.value)}
                    placeholder={`請自行加總填入 (0 ~ ${config.otherMax})`}
                    className="flex-grow bg-white border border-slate-200 text-slate-800 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 hover:border-amber-300 transition-colors"
                  />
                  <span className="text-xs font-bold text-slate-500 whitespace-nowrap">自行輸入 (最高 {config.otherMax} 分)</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 text-center pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              ※ 此工具僅供參考，各項積分請以各區當年度「高級中等學校免試入學簡章」公告為準。<br/>
              如果您的多元表現成績已達該區上限，請於其他積分直接輸入滿分。
            </p>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
