import { useState } from 'react';
import CGPACard from '../components/CGPACard';
import { Calculator, TrendingUp, Info } from 'lucide-react';

export default function CGPATarget() {
  const [form, setForm] = useState({ current: '', target: '', remaining: '' });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const current    = parseFloat(form.current);
    const target     = parseFloat(form.target);
    const remaining  = parseInt(form.remaining);

    if (isNaN(current) || isNaN(target) || isNaN(remaining) || remaining < 1) return;

    // Assume completed semesters = 8 - remaining (max 8 semesters)
    const completed = Math.max(0, 8 - remaining);
    const totalSem  = completed + remaining;

    if (completed === 0) {
      setResult({ requiredSGPA: target, achievable: target <= 10 });
    } else {
      const required = ((target * totalSem) - (current * completed)) / remaining;
      setResult({ requiredSGPA: +required.toFixed(2), achievable: required <= 10 });
    }
  };

  const reset = () => { setForm({ current: '', target: '', remaining: '' }); setResult(null); };

  const gradePoints = [
    { grade: 'O',  gp: 10, range: '90-100' },
    { grade: 'A+', gp: 9,  range: '80-89'  },
    { grade: 'A',  gp: 8,  range: '70-79'  },
    { grade: 'B+', gp: 7,  range: '60-69'  },
    { grade: 'B',  gp: 6,  range: '50-59'  },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-slide-up">
      {/* Calculator card */}
      <div className="card space-y-6">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary-600" />
          <h2 className="font-bold text-slate-700">CGPA Target Calculator</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Current CGPA</label>
            <input
              type="number" step="0.01" min="0" max="10"
              placeholder="e.g. 8.4"
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Target CGPA</label>
            <input
              type="number" step="0.01" min="0" max="10"
              placeholder="e.g. 9.0"
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="input-field"
            />
          </div>
          <div>
            <label className="label">Remaining Semesters</label>
            <input
              type="number" min="1" max="8"
              placeholder="e.g. 3"
              value={form.remaining}
              onChange={(e) => setForm({ ...form, remaining: e.target.value })}
              className="input-field"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={calculate} className="btn-primary flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Calculate
          </button>
          <button onClick={reset} className="btn-secondary">Reset</button>
        </div>

        {/* Result */}
        {result && (
          <div className={`rounded-2xl p-6 text-center animate-fade-in ${result.achievable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.achievable ? (
              <>
                <p className="text-sm font-medium text-green-600 mb-1">Required SGPA per Semester</p>
                <p className="text-6xl font-bold text-green-700">{result.requiredSGPA}</p>
                <p className="text-sm text-green-500 mt-2">
                  Maintain this SGPA for {form.remaining} semester(s) to hit your target 🎯
                </p>
              </>
            ) : (
              <>
                <p className="text-4xl mb-2">😔</p>
                <p className="font-bold text-red-700">Target Not Achievable</p>
                <p className="text-sm text-red-500 mt-1">
                  The required SGPA would be {result.requiredSGPA}, which exceeds 10.0.
                  Try adjusting your target or adding more semesters.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* CGPA card if values entered */}
      {result && form.current && form.target && (
        <CGPACard
          currentCGPA={parseFloat(form.current)}
          targetCGPA={parseFloat(form.target)}
          remainingSemesters={parseInt(form.remaining)}
          requiredSGPA={result.requiredSGPA}
        />
      )}

      {/* Grade reference */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-700 text-sm">Grade Point Reference</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200">
                <th className="text-left py-2 text-slate-500 font-semibold">Grade</th>
                <th className="text-left py-2 text-slate-500 font-semibold">Points</th>
                <th className="text-left py-2 text-slate-500 font-semibold">Marks Range</th>
              </tr>
            </thead>
            <tbody>
              {gradePoints.map(({ grade, gp, range }) => (
                <tr key={grade} className="border-b border-surface-50 last:border-0 hover:bg-surface-50 transition-colors">
                  <td className="py-2.5 font-bold text-primary-600">{grade}</td>
                  <td className="py-2.5 font-semibold text-slate-700">{gp}</td>
                  <td className="py-2.5 text-slate-500">{range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
