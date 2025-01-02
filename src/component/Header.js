import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from './LoginSlice';

export default function Header({ onLoginClick, onSignUpClick, onBoardClick }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated); // 로그인 상태 확인
  const nickname = useSelector((state) => state.login.nickname); // 닉네임 가져오기

  const handleLogout = () => {
    dispatch(logoutSuccess()); // Redux 상태 업데이트
    localStorage.removeItem('authToken'); // 로컬스토리지에서 토큰 제거
    localStorage.removeItem('userId'); // 사용자 ID 제거
    localStorage.removeItem('nick'); // 닉네임 제거
    console.log('로그아웃 성공');
  };

  return (
    <div className="w-full bg-slate-500 flex flex-col items-center h-4/5">
      {/* 상단 버튼 */}
      <div className="w-full flex justify-end p-4">
        {isAuthenticated ? (
          <>
            {/* 로그인 상태 시 표시되는 로그아웃 버튼 */}
            <span className="mr-4 text-white font-bold">{nickname}환영합니다!</span>
            <button
              onClick={handleLogout}
              className="mr-4 cursor-pointer text-white hover:text-red-600 transition duration-200 font-bold text-lg"
            >
              로그아웃
            </button>
          </>
        ) : (
          <>
            {/* 비로그인 상태 시 표시되는 로그인 및 회원가입 버튼 */}
            <button
              onClick={() => {
                console.log('로그인 버튼 클릭');
                onLoginClick();
              }}
              className="mr-4 cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
            >
              로그인
            </button>
            <button
              className="mr-4 cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
              onClick={() => {
                console.log('회원가입 버튼 클릭');
                navigate('/signup'); // 경로 이동 추가
                onSignUpClick();
              }}
            >
              회원가입
            </button>
          </>
        )}
      </div>

      {/* 타이틀 */}
      <div className="h-2/3 flex justify-center my-4">
        <div className="text-4xl font-javanese font-extrabold text-gray-800">Bugsynergy</div>
      </div>

      {/* 메뉴 */}
      <div className="flex justify-center space-x-10 py-8">
        <button
          onClick={() => navigate('/')}
          className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl"
        >
          레시피
        </button>
        <button
          onClick={() => navigate('/favorites')}
          className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl"
        >
          즐겨찾기
        </button>
        <button
          onClick={() => navigate('/buy')}
          className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl"
        >
          구매
        </button>
        <button
          onClick={() => {
            console.log('게시판 버튼 클릭');
            navigate('/board'); // 경로 이동
            onBoardClick(); // 모달 상태 업데이트
          }}
          className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl"
        >
          게시판
        </button>
      </div>
    </div>
  );
}
