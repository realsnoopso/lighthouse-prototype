import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import HomePage from './pages/HomePage';
import ChatFlow from './pages/ChatFlow';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatFlow />} />
        </Routes>
      </div>
      <Toaster />
    </BrowserRouter>
  );
}
