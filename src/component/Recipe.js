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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const apiKey = process.env.REACT_APP_NOGSARO_API_KEY;

  // 댓글 기능 관련 로직 추가
  const [comments, setComments] = useState([]); // 댓글 목록
  const [newComment, setNewComment] = useState(""); // 새로운 댓글 내용
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID
  const [editedContent, setEditedContent] = useState(""); // 수정 중인 내용

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
      await fetchComments();
      setSelectedFood(detail);
    } catch (error) {
      console.error("상세 정보 요청 중 오류 발생:", error);
    }
  };

  useEffect(() => {
    fetchFoodList();
  }, []);

  // 현재 페이지의 데이터 가져오기
  const filteredList = showFavoritesOnly
    ? foodList.filter((food) => food.isFavorite) // 즐겨찾기만 필터링
    : foodList; // 전체 데이터

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // 총 페이지 
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);


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
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return [];
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

      setFavorites(data || []);
      // foodList 상태를 동기화
      setFoodList((prevFoodList) =>
        prevFoodList.map((food) => ({
          ...food,
          isFavorite: data.some((fav) => fav.dataNo === food.dataNo),
        }))
      );

      return data; // 최신 즐겨찾기 데이터를 반환
    } catch (error) {
      console.error("즐겨찾기 데이터를 가져오는 중 오류 발생:", error);
      return [];
    }
  };




  // 즐겨찾기 토글
  const toggleFavorite = async (dataNo) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isCurrentlyFavorite = foodList.find((food) => food.dataNo === dataNo)?.isFavorite;
    console.log("즐겨찾기 토글 시작...", { dataNo, isCurrentlyFavorite });

    try {
      const url = isCurrentlyFavorite
        ? `http://10.125.121.118:8080/member/favorites/deleteFavo?dataNo=${dataNo}`
        : "http://10.125.121.118:8080/member/favorites/insertFavo";
      console.log("url주소:", url)
      const method = isCurrentlyFavorite ? "GET" : "POST";
      const body = !isCurrentlyFavorite ? JSON.stringify({ dataNo }) : undefined;

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      });

      // const responseText = await response.text();
      // console.log("서버 응답 데이터:", responseText);

      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      console.log(isCurrentlyFavorite ? "즐겨찾기 삭제 성공" : "즐겨찾기 추가 성공");

      // 상태 업데이트: foodList에서 해당 항목의 isFavorite 값을 토글
      setFoodList((prevFoodList) =>
        prevFoodList.map((food) =>
          food.dataNo === dataNo ? { ...food, isFavorite: !isCurrentlyFavorite } : food
        )
      );
    } catch (error) {
      console.error("즐겨찾기 토글 실패:", error);
    }
  };

  const toggleShowFavorites = () => {
    setShowFavoritesOnly((prev) => !prev); // 상태 토글
    setCurrentPage(1); // 페이지를 첫 페이지로 리셋
  };

  useEffect(() => {
    console.log("현재 favorites 상태:", favorites);
  }, [favorites]);

  const handleEditClick = (comment) => {
    setEditingCommentId(comment.seq); // 수정 중인 댓글 ID 설정
    setEditedContent(comment.content); // 기존 댓글 내용을 수정 입력 필드에 설정
    
  };

  const handleEditCancel = () => {
    setEditingCommentId(null); // 수정 모드 취소
    setEditedContent(""); // 수정 내용 초기화
  };

  const handleEditSave = async (commentId) => {
    try {
      await editComment(commentId, editedContent); // 댓글 수정 API 호출
      await fetchComments(); // 댓글 목록 다시 가져오기
      setEditingCommentId(null); // 수정 모드 종료
      setEditedContent(""); // 수정 내용 초기화
    } catch (error) {
      console.error("댓글 저장 실패:", error);
    }
  };
  

  // 댓글 가져오기
  const fetchComments = async (page = 0, size = 10) => {
    try {
      const response = await fetch(`http://10.125.121.118:8080/comments/getComments?page=${page}&size=${size}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      const data = await response.json();
      console.log("수정 후 서버에서 가져온 댓글 데이터:", data); // 확인 로그
      setComments(data.content || []); // 상태 업데이트
    } catch (error) {
      console.error("댓글 가져오기 실패:", error);
    }
  };



  // 댓글 추가
  const addComment = async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://10.125.121.118:8080/comments/insertComment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      // 텍스트 응답 처리
      const responseText = await response.text();
      console.log("댓글 추가 응답 (텍스트):", responseText);

      // 댓글 목록 다시 가져오기
      await fetchComments();
      setNewComment(""); // 입력 필드 초기화
    } catch (error) {
      console.error("댓글 추가 실패:", error);
    }
  };



  // 댓글 수정
  const editComment = async (commentId, newContent) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("http://10.125.121.118:8080/comments/updateComment", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seq: commentId,
          content: newContent,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      const updatedComment = await response.json();
      console.log(`수정된 댓글 데이터:`, updatedComment);

      // 상태 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.seq === updatedComment.seq ? updatedComment : comment
        )
      );
      await fetchComments();
      console.log(`댓글 ID ${commentId}가 성공적으로 수정되었습니다.`);
    } catch (error) {
      console.error("댓글 수정 실패:", error);
    }
  };




  // 댓글 삭제
  const deleteComment = async (seq) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    console.log("사용자 토큰:", token); // 디버깅용

    try {
      const response = await fetch(`http://10.125.121.118:8080/comments/deleteComment/${seq}`, {
        method: "DELETE", // DELETE 메서드로 변경
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // DELETE 요청에도 Content-Type을 명시하는 것이 좋습니다.
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      console.log(`댓글 ID ${seq}가 성공적으로 삭제되었습니다.`);

      // 댓글 삭제 후 목록 다시 가져오기
      await fetchComments();
    } catch (error) {
      console.error("댓글 삭제 실패:", error);
    }
  };




  return (
    <div className="container mx-auto p-4">
      {/* 즐겨찾기만 보기 버튼 */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleShowFavorites}
          className="px-4 py-2 text-black border border-gray-500 rounded hover:bg-gray-100 ml-auto"

        >
          {showFavoritesOnly ? "전체 보기" : "즐겨찾기만 보기"}
        </button>
      </div>

      {/* 음식 목록 */}
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
            className={`px-4 py-2 rounded-lg ${currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <Modal isOpen={!!selectedFood} onClose={() => setSelectedFood(null)}>
        {selectedFood && (
          <div>
            <h1 className="text-xl font-bold mb-4">{selectedFood.foodName}</h1>
            <img
              src={selectedFood.imageUrl}
              alt={selectedFood.foodName}
              className="w-40 h-auto mx-auto rounded-md mb-4"
            />
            <div className="overflow-y-auto max-h-96 pr-4">
              <p className="text-sm mb-4">
                <strong>요약:</strong> {removeHtmlTags(selectedFood.summary)}
              </p>
              <p className="text-sm leading-tight">
                <strong>레시피:</strong> {removeHtmlTags(selectedFood.recipe)}
              </p>

              {/* 댓글 UI */}
              <div className="mt-6">
                <h2 className="text-xl font-bold mb-4">댓글</h2>
                <ul className="space-y-4">
                  {comments.map((comment) => (
                    <li key={comment.seq} className="border-b pb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <span className="font-bold ">{comment.member.nickname}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(comment.createDate).toLocaleString()}
                          </span>

                          {/* 수정 모드 확인 */}
                          {editingCommentId === comment.seq ? (
                            <textarea
                              value={editedContent}
                              onChange={(e) => setEditedContent(e.target.value)}
                              className="w-full border rounded-md p-2 mt-2 focus:outline-none focus:ring focus:ring-blue-200"
                            />
                          ) : (
                            <p className="mt-2 text-gray-800">{comment.content}</p>
                          )}
                        </div>

                        <div className="flex space-x-2">
                          {editingCommentId === comment.seq ? (
                            <>
                              <button
                                onClick={() => handleEditSave(comment.seq)}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                저장
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEditClick(comment)}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => deleteComment(comment.seq)}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                삭제
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>



                {/* 댓글 추가 */}
                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="댓글을 입력하세요"
                      className="flex-1 border rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                    <button
                      onClick={() => addComment(selectedFood.dataNo)}
                      className=" text-black px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-400"
                    >
                      등록
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </Modal>



    </div>
  );
}
