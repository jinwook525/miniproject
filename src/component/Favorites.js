import React, { useEffect, useState } from "react";
import FoodCard from "./Foodcard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("로그인이 필요합니다. token이 없습니다.");
  }

  const fetchFavorites = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    console.log("즐겨찾기 API 호출 시작...");
  
    try {
      const response = await fetch(`http://10.125.121.118:8080/member/favorites/getFavo`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }
  
      const data = await response.json();
  
      console.log("서버에서 받은 즐겨찾기 데이터:", data);
  
      // 데이터 형식 확인
      if (!Array.isArray(data)) {
        console.error("즐겨찾기 데이터가 배열 형식이 아닙니다:", data);
        return;
      }
  
      // 중복 제거
      const uniqueFavorites = Array.from(
        new Map(data.map((item) => [item.dataNo, item])).values()
      );
  
      console.log("중복 제거 후 즐겨찾기 데이터:", uniqueFavorites);
  
      setFavorites(uniqueFavorites || []);
    } catch (error) {
      console.error("즐겨찾기 데이터를 가져오는 중 오류 발생:", error);
    }
  };
  
  useEffect(() => {
    console.log("fetchFavorites 실행");
    fetchFavorites();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {favorites.map((food) => (
          <FoodCard
            key={food.dataNo}
            food={food}
            onClick={() => console.log(`${food.foodName} 클릭`)}
          />
        ))}
      </div>
    </div>
  );
}
