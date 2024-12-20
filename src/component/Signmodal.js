import React, { useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const refId = useRef(null);
  const refPass = useRef(null);
  const refNick = useRef(null);
	if (!isOpen) {
		console.log('SignModal 렌더링되지 않음: isOpen이 false');
		return null;
	}
	console.log('SignModal 렌더링됨: isOpen이 true');
	

  const handleSignClick = async () => {
    const data1 = {
      userid: refId.current.value,
      password: refPass.current.value,
      nickname: refNick.current.value,
    };

    console.log('logindata : ', data1);
    try {
      const response = await axios.post('http://10.125.121.217:8080/members/join', data1);

      alert('회원가입 완료');
      onClose();
    } catch (error) {
      console.error('회원가입 실패 : ', error);
      alert('회원가입 실패');
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white p-5 rounded shadow-lg w-96 relative'>
        <img
          src='./img/Exit.png'
          alt="닫기 버튼"
          onClick={() => {
						console.log('SignModal 닫기 버튼 클릭');
						onClose(); // 부모 컴포넌트의 onClose 호출
					}}
          className='absolute top-4 right-4 w-7 h-7 cursor-pointer'
        />
        <div className='mb-4 flex justify-center items-center'>
          <h2 className='text-2xl font-bold'>회원가입</h2>
        </div>
        <div className='grid grid-cols-2 gap-2 mr-10 mb-4'>
          <span className='text-right pr-3 font-bold'>아이디 : </span>
          <input ref={refId} type='text' className='border-2 border-stone-800 rounded-md' />
          <span className='text-right pr-3 font-bold'>비밀번호 : </span>
          <input ref={refPass} type='password' className='border-2 border-stone-800 rounded-md' />
          <span className='text-right pr-3 font-bold'>닉네임 : </span>
          <input ref={refNick} type='text' className='border-2 border-stone-800 rounded-md' />
        </div>
        <div className='flex flex-col justify-center items-center'>
          <button
            onClick={handleSignClick}
            className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 w-1/2 mx-1'>
            가입하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignModal;
