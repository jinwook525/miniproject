import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './component/Homepage';
import Header from './component/Header';
import LoginModal from './component/Loginmodal';
import SignModal from './component/Signmodal';
import BoardModal from './component/BoardModal';
import SearchMain from './component/SearchMain';

function App() {
  return (
    <BrowserRouter>
      <>
        <Header />
        <Routes>
          <Route path="/" element={<SearchMain />} />
          {/* <Route path="/login" element={<LoginModal />} />
          <Route path="/signup" element={<SignModal />} />
          <Route path='/board' element={<BoardModal />} /> */}
        </Routes>
      </>
    </BrowserRouter>
  );
}

export default App;
