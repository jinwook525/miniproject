import TailButton from "../UI/TailButton";
import { useEffect, useState } from "react";

export default function SearchNav({ title, c, sel, setSel }) {
  const handleClick1 = (item) => {
    setSel(item);
  };

  const tags = c.map((item) => (
    <TailButton
      key={item}
      caption={item}
      color={item === sel ? "darkblue" : "blue"} // 선택된 색상
      handleClick={() => handleClick1(item)}
    />
  ));

  useEffect(() => {
    console.log(sel);
  }, [sel]);

  return (
    <div className="w-full p-2 m-2 flex flex-col items-center">
      {/* 제목 */}
      <div className="w-full text-2xl font-bold text-center mb-4">
        곤충 {title}
      </div>

      {/* 버튼 중앙 정렬 */}
      <div className="flex flex-wrap justify-center items-center gap-2">
        {tags}
      </div>
    </div>
  );
}
