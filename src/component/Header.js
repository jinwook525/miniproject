import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
	const navigate = useNavigate();

	return (
		<div className="w-full bg-slate-500 flex flex-col items-center h-4/5">
			{/* 상단 버튼 */}
			<div className="w-full flex justify-end p-4">
				{/* 로그인 버튼 */}
				<button
					onClick={() => navigate('/login')}
					className="mr-4 cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
				>
					로그인
				</button>
				
				{/* 회원가입 버튼 */}
				<button
					onClick={() => navigate('/signup')}
					className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-lg"
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
				<button className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
					곤충검색
				</button>
				<button className="cursor-pointer text-white hover:text-blue-600 transition duration-200 font-bold text-xl">
					커뮤니티
				</button>
			</div>
		</div>
	);
}
