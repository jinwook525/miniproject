import React from "react";

export default function CartModal({
  isOpen,
  onClose,
  cart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
}) {
  if (!isOpen) return null;

  // 총 금액 계산
  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.AMOUNT, 0);

  // 주문하기 버튼 핸들러
  const handleOrder = async () => {
    const token = localStorage.getItem("authToken");
  
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    // 전송할 데이터 생성
    const orderData = cart.map((item) => ({
      item: item.INSECT_NM, // 곤충 이름
      quantity: item.quantity, // 수량
      price: parseFloat(item.AMOUNT), // 단가 (price로 필드명 변경)
    }));
  
    console.log("전송 데이터:", orderData);
  
    try {
      const response = await fetch("http://10.125.121.118:8080/shop/insertShop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 인증 토큰 추가
        },
        body: JSON.stringify(orderData), // orderData 배열 전송
      });
  
      if (response.ok) {
        alert("주문이 성공적으로 접수되었습니다!");
        onClose(); // 모달 닫기
      } else {
        const errorData = await response.json();
        console.error("서버 응답:", errorData);
        alert("주문에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("Order failed:", error);
      alert("서버 오류로 인해 주문에 실패했습니다.");
    }
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-xl font-bold mb-4">장바구니</h2>
        {cart.length === 0 ? (
          <div>
            <p className="text-gray-500">장바구니가 비어 있습니다.</p>
            <div className="mt-6 text-right">
              {/* 닫기 버튼 */}
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <div>
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">곤충 명</th>
                  <th className="p-2 text-center">단위</th>
                  <th className="p-2 text-center">수량</th>
                  <th className="p-2 text-right">금액</th>
                  <th className="p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.INSECT_NM} className="border-b">
                    <td className="p-2">{item.INSECT_NM}</td>
                    <td className="p-2 text-center">{item.WT || "정보 없음"}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">
                      {(item.quantity * item.AMOUNT).toLocaleString()}원
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => decreaseQuantity(item.INSECT_NM)}
                        className=" px-2 py-1 rounded border mr-2"
                      >
                        -
                      </button>
                      <button
                        onClick={() => increaseQuantity(item.INSECT_NM)}
                        className=" px-2 py-1 rounded border mr-2"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.INSECT_NM)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 총 금액 표시 */}
            <div className="mt-4 text-right">
              <h3 className="text-lg font-bold">
                총 금액: <span className="text-blue-500">{totalAmount.toLocaleString()}원</span>
              </h3>
            </div>

            {/* 주문하기 및 닫기 버튼 */}
            <div className="mt-6 text-right">
              <button
                onClick={handleOrder}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
              >
                주문하기
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
