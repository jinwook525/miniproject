import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import Header from './component/Header';
import LoginModal from './component/Loginmodal';
import SignModal from './component/Signmodal';
import BoardModal from './component/BoardModal';
import SearchMain from './component/SearchMain';
import Recipe from './component/Recipe';
import Buy from './component/Buy';
import Favorites from './component/Favorites';
function App() {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isSignModalOpen, setSignModalOpen] = useState(false);
  const [isBoardModalOpen, setBoardModalOpen] = useState(false); // 게시판 모달 상태 추가

  console.log('회원가입 모달 상태:', isSignModalOpen);
  console.log('게시판 모달 상태:', isBoardModalOpen); // 상태 확인 로그 추가

  return (
    <BrowserRouter>
      <Header
        onLoginClick={() => setLoginModalOpen(true)}
        onSignUpClick={() => {
          console.log('onSignUpClick 호출됨');
          setSignModalOpen(true);
        }}
        onBoardClick={() => {
          console.log('onBoardClick 호출됨');
          setBoardModalOpen(true); // 게시판 모달 열림 상태 설정
        }}
      />
      <Routes>
        
        <Route path="/" element={<Recipe />} />
        <Route
          path="/signup"
          element={
            <SignModal
              isOpen={isSignModalOpen}
              onClose={() => setSignModalOpen(false)}
            />
          }
        />
        <Route path="/buy"  element={<Buy />} />

        
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
      
      {/* LoginModal은 조건부 렌더링 */}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
        />
      )}
    </BrowserRouter>
  );
}

export default App;
