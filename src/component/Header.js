import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ onLoginClick, onSignUpClick, onBoardClick }) {
	const navigate = useNavigate();

	return (
		<div className="w-full bg-slate-500 flex flex-col items-center h-4/5">
      {/* 상단 버튼 */}
      <div className="w-full flex justify-end p-4">
        {/* 로그인 버튼 */}
        <button
  onClick={() => {
    console.log('로그인 버튼 클릭');
    onLoginClick();
  }}
  className="mr-4 cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
>
  로그인
</button>

<button className="mr-4 cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
        onClick={() => {
          console.log('회원가입 버튼 클릭');
          navigate('/signup'); // 경로 이동 추가
          onSignUpClick();
        }}
      >
        회원가입
      </button>
      </div>

			{/* 타이틀 */}
			<div className="h-2/3 flex justify-center my-4">
				<div className="text-4xl font-javanese font-extrabold text-gray-800">Bugsynergy</div>
			</div>

			{/* 메뉴 */}
			<div className="flex justify-center space-x-10 py-8">
				<button onClick={() => navigate('/')}className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
					레시피
				</button>
        <button onClick={() => navigate('/favorites')}className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
          즐겨찾기
        </button>
        <button onClick={() => navigate('/buy')}className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
          구매
        </button>
				<button  onClick={() => {
          console.log('게시판 버튼 클릭');
          navigate('/board'); // 경로 이동
          onBoardClick(); // 모달 상태 업데이트
        }
				}className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
					게시판
				</button>
			</div>
		</div>
	);
}
