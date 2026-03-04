import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import MorningInterview from './pages/MorningInterview';
import DailyView from './pages/DailyView';
import CheckIn from './pages/CheckIn';
import Retrospection from './pages/Retrospection';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/morning" element={<MorningInterview />} />
          <Route path="/daily" element={<DailyView />} />
          <Route path="/checkin" element={<CheckIn />} />
          <Route path="/retro" element={<Retrospection />} />
        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
