import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // useDispatch 추가
import { loginSuccess } from './LoginSlice';

const LoginModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const refId = useRef(null);
  const refPass = useRef(null);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleLoginClick = async () => {
    const data1 = {
      username: refId.current.value,
      password: refPass.current.value,
    };

    console.log("logindata : ", data1);

    try {
      const resp = await axios.post('http://10.125.121.217:8080/login', data1);

      const token = resp.data.token;
      const user = resp.data.username;
      const role = resp.data.role;

      dispatch(loginSuccess({ user, role, token }));
      localStorage.setItem("accessToken", token);
      localStorage.setItem("userId", user);
      localStorage.setItem("role", role);

      console.log("Token : ", localStorage.getItem("accessToken"));
      console.log("res : ", resp);
      onClose();
    } catch (error) {
      console.error("로그인 실패 : ", error);
      alert("로그인 실패");
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50'>
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
