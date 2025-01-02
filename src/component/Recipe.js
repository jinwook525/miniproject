import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import FoodCard from "./Foodcard";
import Modal from "./FoodModal";

export default function Recipe() {
  const [foodList, setFoodList] = useState([]); // 음식 목록
  const [selectedFood, setSelectedFood] = useState(null); // 선택된 음식 상세 정보
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 10; // 페이지당 아이템 수
  const [favorites, setFavorites] = useState([]);
  const apiKey = process.env.REACT_APP_NOGSARO_API_KEY;
  
  
  // 음식 목록 가져오기
  const fetchFoodList = async () => {
    const userId = localStorage.getItem("userId"); // 유저 ID 가져오기
    if (!userId) {
      console.error("로그인이 필요합니다.");
      return;
    }

    const url = `/service/insectFood/insectFoodList?apiKey=${apiKey}&userId=${userId}&pageNo=1&numOfRows=50`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }
      const xmlData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      const items = Array.from(xmlDoc.getElementsByTagName("item")).map((item) => ({
        dataNo: item.getElementsByTagName("dataNo")[0]?.textContent || "N/A",
        foodName: item.getElementsByTagName("foodNm")[0]?.textContent || "N/A",
        foodCategory: item.getElementsByTagName("foodGubunNm")[0]?.textContent || "N/A",
        thumbnail: item.getElementsByTagName("thumbImgUrl")[0]?.textContent || "N/A",
        isFavorite: item.getElementsByTagName("isFavorite")[0]?.textContent === "true",
      }));

      setFoodList(items);
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
    }
  };



  // 선택된 음식의 상세 정보 가져오기
  const fetchFoodDetail = async (dataNo) => {
    const url = `/service/insectFood/insectFoodView?apiKey=${apiKey}&dataNo=${dataNo}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }
      const xmlData = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "application/xml");

      const detail = {
        foodName: xmlDoc.getElementsByTagName("foodNm")[0]?.textContent || "N/A",
        category: xmlDoc.getElementsByTagName("foodGubun")[0]?.textContent || "N/A",
        summary: xmlDoc.getElementsByTagName("summaryDtl")[0]?.textContent || "N/A",
        recipe: xmlDoc.getElementsByTagName("cn")[0]?.textContent || "N/A",
        imageUrl: xmlDoc.getElementsByTagName("imgUrl")[0]?.textContent || "N/A",
      };

      setSelectedFood(detail);
    } catch (error) {
      console.error("상세 정보 요청 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  // 현재 페이지의 데이터 가져오기
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = foodList.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 수
  const totalPages = Math.ceil(foodList.length / itemsPerPage);

  // 페이지 변경 함수
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 특정 태그 제거 로직
  const removeHtmlTags = (htmlString) => {
    return parse(htmlString, {
      replace: (domNode) => {
        if (domNode.type === "tag") {
          return null;
        }
        return domNode;
      },
    });
  };

   

  const fetchFavorites = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("authToken");
  
    if (!userId || !token) {
      console.error("로그인이 필요합니다. userId 또는 토큰이 없습니다.");
      alert("로그인이 필요합니다.");
      return;
    }
  
    try {
      const response = await fetch(`http://10.125.121.118:8080/member/favorites/getFavo?userId=${userId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // 토큰 포함
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }
  
      const data = await response.json();
      setFavorites(data || []);
      console.log("즐겨찾기 목록 불러오기 성공:", data);
    } catch (error) {
      console.error("즐겨찾기 목록 불러오기 실패:", error);
    }
  };

  // 즐겨찾기 토글
  const toggleFavorite = async (dataNo) => {
   
    const token = localStorage.getItem("authToken");
  
 
    console.log("로컬 스토리지 authToken:", token); // 디버깅용 로그
  
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    const isCurrentlyFavorite = foodList.find((food) => food.dataNo === dataNo)?.isFavorite;
  
    try {
      let response;
      if (isCurrentlyFavorite) {
        response = await fetch(`http://10.125.121.118:8080/member/favorites/deleteFavo?dataNo=${dataNo}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } else {
        response = await fetch("http://10.125.121.118:8080/member/favorites/insertFavo", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dataNo }),
        });
      }
  
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }
  
      console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 성공" : "즐겨찾기 추가 성공");
  
      setFoodList((prevFoodList) =>
        prevFoodList.map((food) =>
          food.dataNo === dataNo ? { ...food, isFavorite: !food.isFavorite } : food
        )
      );
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };
  
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {currentItems.map((food) => (
          <FoodCard
            key={food.dataNo}
            food={food}
            onClick={() => fetchFoodDetail(food.dataNo)}
            toggleFavorite={toggleFavorite}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* 모달 */}
      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)}>
  {selectedFood && (
    <div>
      <h1 className="text-xl font-bold mb-4">{selectedFood.foodName}</h1>
      <img
        src={selectedFood.imageUrl}
        alt={selectedFood.foodName}
        className="w-40 h-auto mx-auto rounded-md mb-4" // 이미지 크기 조정
      />
      <p className="text-sm mb-4">
        <strong>요약:</strong> {removeHtmlTags(selectedFood.summary)}
      </p>
      <p className="text-sm leading-tight">
        <strong>레시피:</strong> {removeHtmlTags(selectedFood.recipe)}
      </p>
    </div>
  )}
</Modal>

    </div>
  );
}
