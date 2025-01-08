import React, { useState, useEffect } from "react";
import CartModal from "./CartModal";

export default function InsectPriceMonitor() {
  const [insects, setInsects] = useState([]); // 곤충 목록
  const [quantities, setQuantities] = useState({}); // 곤충별 수량
  const [cart, setCart] = useState([]); // 장바구니 상태
  const [isCartModalOpen, setIsCartModalOpen] = useState(false); // 장바구니 모달 상태
  const serviceKey = process.env.REACT_APP_API_KEY;

  // 곤충 목록 가져오기
  const fetchInsects = async () => {
    const url = `http://apis.data.go.kr/6430000/mktPrcMntrIdtIstService/getMktPrcMntrIdtIst?serviceKey=${serviceKey}&currentPage=1&perPage=50`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setInsects(data.body || []);
      setQuantities(
        data.body.reduce((acc, insect) => {
          acc[insect.INSECT_NM] = 1; // 초기 수량은 모두 1로 설정
          return acc;
        }, {})
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 컴포넌트 로드 시 데이터 가져오기
  useEffect(() => {
    fetchInsects();
  }, []);

  // 수량 증가
  const increasePageQuantity = (insectName) => {
    setQuantities((prev) => ({
      ...prev,
      [insectName]: prev[insectName] + 1,
    }));
  };

  // 수량 감소
  const decreasePageQuantity = (insectName) => {
    setQuantities((prev) => ({
      ...prev,
      [insectName]: Math.max(1, prev[insectName] - 1), // 최소 수량은 1
    }));
  };

  // 장바구니에 항목 추가
  const addToCart = (insect) => {
    const quantity = quantities[insect.INSECT_NM];
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.INSECT_NM === insect.INSECT_NM);
      if (existingItem) {
        return prevCart.map((item) =>
          item.INSECT_NM === insect.INSECT_NM
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...insect, quantity }];
    });
    alert(`${insect.INSECT_NM}이(가) 장바구니에 추가되었습니다!`);
  };

  const toggleCartModal = () => {
    setIsCartModalOpen((prev) => !prev);
  };

  const increaseCartQuantity = (insectName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.INSECT_NM === insectName ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseCartQuantity = (insectName) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.INSECT_NM === insectName && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeFromCart = (insectName) => {
    setCart((prevCart) => prevCart.filter((item) => item.INSECT_NM !== insectName));
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      {/* 곤충 목록 */}
      <div className="w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border border-gray-300 w-1/5">곤충 명</th>
              <th className="p-2 border border-gray-300 w-1/5">단위</th>
              <th className="p-2 border border-gray-300 w-1/5">금액</th>
              <th className="p-2 border border-gray-300 w-1/5">수량</th>
              <th className="p-2 border border-gray-300 w-1/5"></th>
            </tr>
          </thead>
          <tbody>
            {insects.map((insect) => (
              <tr key={insect.INSECT_NM} className="border border-gray-300">
                <td className="p-2">{insect.INSECT_NM}</td>
                <td className="p-2">{insect.WT || "정보 없음"}</td>
                <td className="p-2">{insect.AMOUNT}원</td>
                <td className="p-2">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => decreasePageQuantity(insect.INSECT_NM)}
                      className=" px-2 py-1 rounded border "
                    >
                      -
                    </button>
                    <span>{quantities[insect.INSECT_NM]}</span>
                    <button
                      onClick={() => increasePageQuantity(insect.INSECT_NM)}
                      className="  px-2 py-1 rounded border "
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => addToCart(insect)}
                    className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                  >
                    담기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 장바구니 보기 버튼 */}
      <div className="mt-6">
        <button
          onClick={() => setIsCartModalOpen(true)}
          className="border border-black  text-black px-6 py-3 rounded "
        >
          장바구니 보기
        </button>
      </div>

      {/* 장바구니 모달 */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={toggleCartModal}
        cart={cart}
        increaseQuantity={increaseCartQuantity}
        decreaseQuantity={decreaseCartQuantity}
        removeFromCart={removeFromCart}
      />
    </div>
  );
}
