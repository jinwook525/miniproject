/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind가 적용될 파일 경로
  ],
  theme: {
    extend: {
      fontFamily: {
        cafe24: ['Cafe24ClassicType', 'serif'], // 새 폰트 추가
      },
    },
  },
  plugins: [],
};

