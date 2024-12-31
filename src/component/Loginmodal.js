import axios from 'axios';
import React, { useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux'; // useDispatch 추가
import { loginSuccess } from './LoginSlice';

const LoginModal = ({ isOpen, onClose }) => {
  console.log('LoginModal 호출됨');
  const refId = useRef(null);
  const refPass = useRef(null);
  const dispatch = useDispatch();

  if (!isOpen) {
    console.log('LoginModal 렌더링되지 않음: isOpen이 false');
    return null;
  } else {
    console.log('LoginModal 렌더링됨: isOpen이 true');
  }
  

  const handleLoginClick = async () => {
    const data1 = {
      userid: refId.current.value,
      password: refPass.current.value,
    };

    console.log("logindata : ", data1);

    try {
      const resp = await axios.post('http://10.125.121.118:8080/login', data1);
      const token = resp.data.token; // 토큰 선언
      if (token) {
          dispatch(loginSuccess({ user: data1.userid, token })); // Redux 업데이트
          localStorage.setItem("accessToken", token); // 토큰 저장
          localStorage.setItem("userId", data1.userid); // 사용자 ID 저장
      }
      
      const user = resp.data.userid; // 응답에서 사용자 ID 추출
      const nick = resp.data.nickname; // 응답에서 닉네임 추출
      
      dispatch(loginSuccess({ user, nick, token })); // Redux 업데이트
      localStorage.setItem("accessToken", token); // 토큰 다시 저장 (중복 제거 가능)
      localStorage.setItem("userId", user); // 사용자 ID 저장
      localStorage.setItem("nick", nick); // 닉네임 저장
      
      console.log("Token : ", localStorage.getItem("accessToken")); // 저장된 토큰 확인
      console.log("res : ", resp); // 응답 전체 출력
      onClose(); // 모달 닫기
      
    } catch (error) {
      console.error("로그인 실패 : ", error);
      alert("로그인 실패");
    }
  };

  return (
    <div id="login-modal" className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
      <div className='bg-white p-5 rounded shadow-lg w-96 relative bg-gradient-to-t from-white to-blue-50'>
        <img
          src='./img/Exit.png'
          alt="닫기 버튼"
          onClick={onClose}
          className='absolute top-4 right-4 w-7 h-7 cursor-pointer'
        />
        <div className='mb-4 flex justify-center items-center'>
          <h2 className='text-2xl font-bold'>로그인</h2>
        </div>
        <div className='grid grid-cols-2 gap-2 mr-10 mb-4'>
          <span className='text-right pr-3 font-bold'>아이디 : </span>
          <input type='text' className='border-2 border-stone-800 rounded-lg' ref={refId} />
          <span className='text-right pr-3 font-bold'>비밀번호 : </span>
          <input type='password' className='border-2 border-stone-800 rounded-lg' ref={refPass} />
        </div>
        <div className='px-16 mt-5 mb-7'>
          <button
            className='bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 w-full mx-1'
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
