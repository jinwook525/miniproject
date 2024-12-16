import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './component/Homepage';
import Header from './component/Header';
import LoginModal from './component/Loginmodal';
import SignModal from './component/Signmodal';

function App() {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginModal />} />
          <Route path="/signup" element={<SignModal />} />
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
