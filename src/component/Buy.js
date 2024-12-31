import React, { useState, useEffect } from "react";
import Modal from "./PriceModal"; // Modal 컴포넌트 임포트

export default function InsectPriceMonitor() {
  const [insects, setInsects] = useState([]); // 곤충 목록
  const [selectedInsect, setSelectedInsect] = useState(null); // 선택된 곤충 정보
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const itemsPerPage = 5; // 페이지당 아이템 수

  const serviceKey = process.env.REACT_APP_API_KEY; // 환경변수에서 API 키 가져오기

  // 곤충 목록 가져오기
  const fetchInsects = async () => {
    setLoading(true);
    setError(null);

    const url = `http://apis.data.go.kr/6430000/mktPrcMntrIdtIstService/getMktPrcMntrIdtIst?serviceKey=${serviceKey}&currentPage=1&perPage=50`; // 50개 데이터 요청

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP 에러 상태: ${response.status}`);
      }

      const data = await response.json();
      setInsects(data.body || []);
    } catch (err) {
      setError("데이터를 불러오는 중 문제가 발생했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 로드 시 곤충 데이터 가져오기
  useEffect(() => {
    fetchInsects();
  }, []);

  // 곤충 클릭 시 상세 정보 설정
  const handleInsectClick = (insect) => {
    setSelectedInsect(insect);
  };

  // 모달 닫기
  const closeModal = () => {
    setSelectedInsect(null);
  };

  // 페이지네이션 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = insects.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(insects.length / itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <p className="text-center text-blue-500">데이터를 불러오는 중...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 곤충 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {currentItems.map((insect, index) => (
          <div
            key={index}
            onClick={() => handleInsectClick(insect)}
            className="border border-gray-300 p-4 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-gray-700">{insect.INSECT_NM}</h2>
          </div>
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

      {/* 모달로 곤충 상세 정보 표시 */}
      <Modal isOpen={!!selectedInsect} onClose={closeModal}>
        {selectedInsect && (
          <div className="p-4">
            <h2 className="text-center text-xl font-bold mb-4">곤충 상세 정보</h2>
            <table className="table-auto w-full border-collapse">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-bold text-left">곤충 명</td>
                  <td className="p-2 text-left">{selectedInsect.INSECT_NM}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold text-left">형태</td>
                  <td className="p-2 text-left">{selectedInsect.STLE}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold text-left">무게</td>
                  <td className="p-2 text-left">{selectedInsect.WT}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-bold text-left">금액</td>
                  <td className="p-2 text-left">{selectedInsect.AMOUNT}원</td>
                </tr>
                <tr>
                  <td className="p-2 font-bold text-left">비교</td>
                  <td className="p-2 text-left">{selectedInsect.CMPR || "정보 없음"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
