import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { useState, useEffect } from 'react';
import Header from './component/Header';
import LoginModal from './component/Loginmodal';
import SignModal from './component/Signmodal';
import BoardModal from './component/BoardModal';
import Recipe from './component/Recipe';
import Buy from './component/Buy';

function App() {
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false); // 게시판 모달 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

  // 현재 경로가 /login일 때 로그인 모달을 열기
  const isLoginModalOpen = window.location.pathname === '/login';

  // 로그인 모달 닫기 시 경로 변경
  const handleLoginModalClose = () => {
    navigate('/'); // 홈 경로로 리디렉션
  };

  return (
    <BrowserRouter>
      <Header
        onLoginClick={() => navigate('/login')} // /login 경로로 이동하여 로그인 모달 열기
        onSignUpClick={() => setSignModalOpen(true)}
        onBoardClick={() => setBoardModalOpen(true)}
      />
      <Routes>
        <Route path="/" element={<Recipe />} />
        <Route path="/buy" element={<Buy />} />
        <Route
          path="/signup"
          element={
            <SignModal
              isOpen={isSignModalOpen}
              onClose={() => setSignModalOpen(false)}
            />
          }
        />
        <Route
          path="/board"
          element={
            <BoardModal
              isOpen={isBoardModalOpen}
              onClose={() => setBoardModalOpen(false)}
            />
          }
        />
      </Routes>

      {/* LoginModal은 /login 경로에서만 표시 */}
      {isLoginModalOpen && (
        <LoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
      )}
    </BrowserRouter>
  );
}

export default App;
