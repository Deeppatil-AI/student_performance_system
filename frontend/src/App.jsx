import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout      from './layout/MainLayout';
import Dashboard       from './pages/Dashboard';
import StudyTimer      from './pages/StudyTimer';
import TodoList        from './pages/TodoList';
import AttendanceTracker from './pages/AttendanceTracker';
import CGPATarget      from './pages/CGPATarget';
import CodingActivity  from './pages/CodingActivity';
import EditProfile     from './pages/EditProfile';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/"           element={<Dashboard />} />
          <Route path="/timer"      element={<StudyTimer />} />
          <Route path="/todo"       element={<TodoList />} />
          <Route path="/attendance" element={<AttendanceTracker />} />
          <Route path="/cgpa"       element={<CGPATarget />} />
          <Route path="/coding"     element={<CodingActivity />} />
          <Route path="/profile"    element={<EditProfile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
