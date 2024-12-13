# Getting Started with Create React App
[Create React App](https://github.com/facebook/create-react-app).
npx create-react-app 프로젝트명

### 실행 `npm start`

## 리액트 주요개념
1. 컴포넌트 만들기
  - 사용자 정의 태그
  - 자바스크립트 함수
    - 함수명은 반드시 대문자로 시작
    - 반드시 return 이 있어야함:하나의 요소만 반환
2. 컴포넌트 추가
  - import로 추가
  - 사용은 <컴포넌트 />
3. 컴포넌트 사용
  - {} 안에 변수명을 넣어서 사용
4. props
  + 부모 컴포넌트에서 자식 컴포넌트로 자료 전달시 사용
  + <컴포넌트명 속성명={값} />
  + props를 자식 컴포넌트에서 사용할 때 함수의 파라미터로 사용
    + export default function Recoil2(props) 
      + 변수 접근시 props.변수명 
    + export default function Recoil2({y2}) 
      + 변수 접근시 변수명 그대로 사용
5. state 변수
  + 화면의 변경을 감지하기 위한 장치
  + 선언 : [변수명, 변수를 변경하는 set함수명] = useState(초기값)
    + import {useState} from react;  

6. 이벤트 달기
  + onClick, onChange, onFocus 등의 이벤트 발생시 처리할 함수 지정   
7. useEffect
  + 사이드 이펙트 처리
  + 선언 : useEffect( ()=> {}, [])
    + import {useEffect} from react;  
    + [] 에 따라서 실행시점 결정가능
      + [] : 비었을 경우 컴포넌트 생성시
      + [state변수] : 특정 state 변수가 변경 되었을 때 
      + [] 생략 : 컴포넌트가 변경이 될때 마다
8. useRef
  + 폼요소 참조시 사용 
  + 선언 : const ref변수명 = useRef()
    + import {useRef} from react;
    + 폼요소에 ref속성으로 연결 : 
    + ex <input type='number'ref={inRef} defaultValue={2} min = {2} max={5} className="form-input" />
9. recoil로 상태변수 관리
---
[TailwindCss]
1. classname에 클래스명으로 추가
2. 크기: 
  -너비 : w-n, w-full(상위컴포넌트 너비를 모두 차지) 높이: h-n h-full(상위컴포넌트 높이를 모두 차지)
3. 박스
  + flex 박스 (flex-row 가 디폴트: 블록 요소를 가로로 배치)
    + flex-col :블록 요소를 세로로 배치
    + justify- : 기준축으로 정렬
    + items- : 기준축 반대 방향 정렬
  + grid 박스
    + grid-cols- : 칸 개수 설정
    + 반응형으로 만들고 싶을 경우: sm, md, lg 추가
    + grid-gap- : 칸 간격
  + m-: 마진 설정(바깥 여백), ml, mr, mt, mb, mx, my
  + p-: 패딩 설정(안쪽 여백) ''
  + border: 테두리
4. 배경색 : bg-
5. 글자색 : text-
6. 글자 진하게: font-bold"# miniproject" 
