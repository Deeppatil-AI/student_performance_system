import { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  Target, 
  Save, 
  Camera,
  Edit2,
  Lock,
  ChevronRight
} from 'lucide-react';

export default function EditProfile() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    email: 'rahul.sharma@university.edu',
    id: 'AI001',
    university: 'Institute of Technology',
    branch: 'Artificial Intelligence',
    semester: '6th Semester',
    cgpaTarget: '9.0'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center shadow-orange-sm">
          <UserCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-none">Profile Settings</h1>
          <p className="text-dim mt-1 font-medium italic">Manage your account and academic information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Profile Card Summary */}
        <div className="card text-center flex flex-col items-center">
           <div className="relative group mb-6">
              <div className="w-32 h-32 rounded-full border-4 border-orange-600/20 p-1">
                 <div className="w-full h-full rounded-full bg-dark-700 flex items-center justify-center text-5xl font-black text-orange-500 overflow-hidden shadow-inner">
                    RS
                 </div>
              </div>
              <button className="absolute bottom-1 right-1 w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all border-2 border-dark-800">
                 <Camera className="w-5 h-5" />
              </button>
           </div>
           
           <h3 className="text-2xl font-black text-white">{profile.name}</h3>
           <p className="text-orange-400 font-bold uppercase text-[10px] tracking-widest mt-1">{profile.id}</p>
           
           <div className="w-full h-px bg-dark-700 my-6" />
           
           <div className="w-full space-y-4">
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-dim">Active Status</span>
                 <span className="flex items-center gap-2 text-xs font-bold text-green-500">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Online
                 </span>
              </div>
              <div className="flex justify-between items-center px-2">
                 <span className="text-[10px] font-black uppercase tracking-widest text-dim">Member Since</span>
                 <span className="text-xs font-bold text-white">Aug 2023</span>
              </div>
           </div>
        </div>

        {/* Detailed Info Form */}
        <div className="card lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Edit2 className="w-5 h-5 text-orange-400" />
                <h3 className="font-extrabold text-white text-lg lowercase tracking-tight">Personal Information</h3>
              </div>
              <button 
                onClick={() => setEditing(!editing)}
                className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${editing ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-orange-600/10 text-orange-400 border border-orange-600/20'}`}
              >
                {editing ? 'Cancel' : 'Edit Info'}
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Full Name</label>
                 <div className="relative">
                    <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <input 
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-12" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <input 
                      name="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-12" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">University</label>
                 <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <input 
                      name="university"
                      value={profile.university}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-12" 
                    />
                 </div>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Branch</label>
                 <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                    <input 
                      name="branch"
                      value={profile.branch}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-12" 
                    />
                 </div>
              </div>
           </div>

           <div className="h-px bg-dark-700 w-full" />

           <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-white text-lg lowercase tracking-tight">Security & Academic Goals</h3>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">Academic Semester</label>
                 <select 
                    name="semester"
                    value={profile.semester}
                    onChange={handleChange}
                    disabled={!editing}
                    className="input-field appearance-none cursor-pointer"
                 >
                    <option>1st Semester</option>
                    <option>2nd Semester</option>
                    <option>3rd Semester</option>
                    <option>4th Semester</option>
                    <option>5th Semester</option>
                    <option>6th Semester</option>
                    <option>7th Semester</option>
                    <option>8th Semester</option>
                 </select>
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] uppercase font-black tracking-widest text-dim px-1">CGPA Target</label>
                 <div className="relative">
                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                    <input 
                      name="cgpaTarget"
                      value={profile.cgpaTarget}
                      onChange={handleChange}
                      disabled={!editing}
                      className="input-field pl-12" 
                    />
                 </div>
              </div>
           </div>

           {editing && (
              <div className="flex justify-end gap-4 animate-slide-in">
                 <button 
                   onClick={() => setEditing(false)}
                   className="btn-secondary px-8"
                 >
                    Discard Changes
                 </button>
                 <button 
                   onClick={() => setEditing(false)}
                   className="btn-primary px-10 flex items-center gap-2"
                 >
                    <Save className="w-4 h-4" />
                    Save & Sync
                 </button>
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
