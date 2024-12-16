import React from 'react';

function Homepage() {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-300">
      <div className="w-4/5 h-[100%] bg-slate-300 flex justify-center items-center gap-8">
        {/* 첫 번째 카드 */}
        <div className="w-1/3 h-[60%] relative">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('./img/insect1.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 0,
            }}
          ></div>
          {/* 텍스트 */}
          <div className="relative z-10 flex justify-center items-center w-full h-full">
            <button className="text-black text-4xl font-extrabold bg-white bg-opacity-75 px-4 py-2 rounded-lg">
              곤충 검색
            </button>
          </div>
        </div>

        {/* 두 번째 카드 */}
        <div className="w-1/3 h-[60%] relative">
          {/* 배경 이미지 */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('./img/insect3.jpg')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.5,
              zIndex: 0,
            }}
          ></div>
          {/* 텍스트 */}
          <div className="relative z-10 flex justify-center items-center w-full h-full">
            <button className="text-black text-4xl font-extrabold bg-white bg-opacity-75 px-4 py-2 rounded-lg">
              커뮤니티
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
