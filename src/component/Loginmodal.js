import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginModal = () => {
	const navigate = useNavigate();

	return (
		<div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
			<div className='bg-white p-5 rounded shadow-lg w-96 relative bg-gradient-to-t from-white to-blue-50'>
				<img
					src='./img/Exit.png'
					alt="닫기 버튼"
					onClick={() => navigate('/')}
					className='absolute top-4 right-4 w-7 h-7 cursor-pointer'
				/>
				<div className='mb-4 flex justify-center items-center'>
					<h2 className='text-2xl font-bold'>로그인</h2>
				</div>
				<div className='grid grid-cols-2 gap-2 mr-10 mb-4'>
					<span className='text-right pr-3 font-bold'>아이디 : </span>
					<input type='text' className='border-2 border-stone-800 rounded-lg' />
					<span className='text-right pr-3 font-bold'>비밀번호 : </span>
					<input type='password' className='border-2 border-stone-800 rounded-lg' />
				</div>
				<div className='px-16 mt-5 mb-7'>
					<button className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full mx-1'>
						로그인
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginModal;
