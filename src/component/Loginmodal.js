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
      const token = resp.headers.get("Authorization"); // 토큰 선언
      console.log("resp.data:", resp.data)
      const nick = resp.data; // 응답에서 닉네임 추출

      if (token) {
        dispatch(loginSuccess({ user: data1.userid, token, nick })); // Redux 상태 업데이트
        localStorage.setItem("authToken", token); // 로컬 스토리지에 저장
        localStorage.setItem("userId", data1.userid); // 사용자 ID 저장
        localStorage.setItem("nickname", nick);
    }
    console.log("API 응답 데이터:", data1); // 전체 API 응답 출력
    console.log("data1의 userId 값:", data1.userId); // userId 확인
    console.log("token 값:", data1.token);   // token 확인
      
      dispatch(loginSuccess({ nick, token })); // Redux 업데이트
      localStorage.setItem("authToken", token); // 토큰 다시 저장 (중복 제거 가능)
      localStorage.setItem("nick", nick); // 닉네임 저장
      
      console.log("저장된 토큰:", localStorage.getItem("authToken"));
      console.log("nickname : ", localStorage.getItem("nickname"));// 닉네임
      
     
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
