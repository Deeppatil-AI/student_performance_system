import { useState } from 'react';
import { 
  BookOpen, 
  Calendar as CalendarIcon, 
  Check, 
  X, 
  Clock, 
  User, 
  Zap,
  ChevronDown
} from 'lucide-react';

export default function AttendanceTracker() {
  const lectures = [
    { id: 1, time: '09:20 - 10:10', slot: 'Slot 1', subject: 'PSI', type: 'TH', prof: 'Prof. A.B.Patil', status: null },
    { id: 2, time: '10:10 - 11:00', slot: 'Slot 2', subject: 'AI', type: 'TH', prof: 'Prof. Tushant Tayade', status: 'present' },
    { id: 3, time: '11:50 - 12:40', slot: 'Slot 3', subject: 'PL-II', type: 'PR', prof: 'Prof. S.L.Tambe', lab: 'S1', status: 'absent' },
    { id: 4, time: '12:40 - 13:30', slot: 'Slot 4', subject: 'PL-II', type: 'PR', prof: 'Prof. S.L.Tambe', lab: 'S1', status: null },
    { id: 5, time: '13:45 - 14:35', slot: 'Slot 5', subject: 'OE', type: 'TH', prof: 'Prof. N.A. Patil', status: null },
    { id: 6, time: '14:35 - 15:25', slot: 'Slot 6', subject: 'OE', type: 'TH', prof: 'Prof. N.A. Patil', status: null },
  ];

  const [lectureList, setLectureList] = useState(lectures);

  const setStatus = (id, status) => {
    setLectureList(lectureList.map(l => l.id === id ? { ...l, status } : l));
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-orange-sm">
          <BookOpen className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">Attendance Tracker</h1>
          <p className="text-dim mt-1 font-medium italic">Mark your lecture-wise attendance and stay above the 75% threshold.</p>
        </div>
      </div>

      {/* Date Control Card */}
      <div className="card py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-5 h-5 text-orange-400" />
          <h3 className="font-bold text-white text-lg">{formattedDate}</h3>
          <div className="bg-dark-900 border border-dark-600 rounded-lg p-1 px-2 flex items-center gap-2 cursor-pointer hover:border-orange-500 transition-colors">
             <span className="text-xs text-dim">12/03/2026</span>
             <CalendarIcon className="w-3.5 h-3.5 text-dim" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="bg-orange-600/10 border border-orange-600/30 px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse shadow-glow">
              <Zap className="w-3.5 h-3.5 text-orange-400 fill-blue-400" />
              <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">Live: 00:35</span>
           </div>
        </div>
      </div>

      {/* Lectures List */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-white flex items-center gap-3 lowercase ml-2">
           <Clock className="w-5 h-5 text-orange-400" />
           Thursday's Lectures
        </h3>

        <div className="space-y-3">
          {lectureList.map((lec) => (
            <div 
              key={lec.id} 
              className={`card group hover:shadow-orange-sm transition-all border-l-4 p-4 md:p-6 ${
                lec.status === 'present' ? 'border-l-green-500' : 
                lec.status === 'absent' ? 'border-l-red-500' : 
                'border-l-transparent'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-white whitespace-nowrap">{lec.time}</span>
                    <span className="text-[9px] uppercase font-black tracking-widest text-dim mt-1 p-1 bg-dark-900 rounded border border-dark-600">
                      {lec.slot}
                    </span>
                  </div>

                  <div className="h-10 w-px bg-dark-700 hidden md:block" />

                  <div className="flex items-center gap-4 text-left">
                    <div className="min-w-[80px]">
                      <h4 className="text-xl font-black text-white tracking-tight flex items-center gap-2 leading-none">
                        {lec.subject}
                        <span className="text-[10px] bg-dark-900 border border-dark-600 px-1.5 py-0.5 rounded text-dim">
                          {lec.type}
                        </span>
                      </h4>
                      <div className="flex items-center gap-2 mt-1.5">
                        <User className="w-3.5 h-3.5 text-dim" />
                        <span className="text-xs font-semibold text-dim">{lec.prof}</span>
                        {lec.lab && (
                          <span className="text-[10px] bg-dark-900 border border-dark-600 px-1.5 py-0.5 rounded text-orange-400 font-bold">
                            {lec.lab}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <button 
                    onClick={() => setStatus(lec.id, 'present')}
                    className={`nav-link group py-2 md:py-3 cursor-pointer ${lec.status === 'present' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-dark-900 border border-dark-600 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-green-500'}`}
                  >
                    <Check className={`w-5 h-5 ${lec.status === 'present' ? 'scale-125' : ''} transition-transform`} />
                  </button>
                  <button 
                    onClick={() => setStatus(lec.id, 'absent')}
                    className={`nav-link group py-2 md:py-3 cursor-pointer ${lec.status === 'absent' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-dark-900 border border-dark-600 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-red-500'}`}
                  >
                    <X className={`w-5 h-5 ${lec.status === 'absent' ? 'scale-125' : ''} transition-transform`} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
