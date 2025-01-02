import React, { useEffect, useState } from "react";
import FoodCard from "./Foodcard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const userId = localStorage.getItem("userId"); // 로컬 스토리지에서 userId 가져오기
  if (!userId) {
    console.error("로그인이 필요합니다. userId가 없습니다.");
  }
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await fetch(`http://10.125.121.118:8080/favorites?userId=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP 에러 상태: ${response.status}`);
        }
        const data = await response.json();
        setFavorites(data.favorites || []);
      } catch (error) {
        console.error("즐겨찾기 데이터를 가져오는 중 오류 발생:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <div className="container mx-auto p-4">
    
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {favorites.map((food) => (
          <FoodCard
            key={food.dataNo}
            food={food}
            onClick={() => console.log(`${food.foodName} 클릭`)} // 클릭 시 상세 페이지로 연결
          />
        ))}
      </div>
    </div>
  );
}
