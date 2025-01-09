import React, { useState, useEffect } from "react";
import CartModal from "./CartModal";

export default function InsectPriceMonitor() {
  const [insects, setInsects] = useState([]); // 곤충 목록
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orders, setOrders] = useState([]);
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
          acc[insect.INSECT_NM] = 1;
          return acc;
        }, {})
      );
    } catch (err) {
      console.error("곤충 데이터를 가져오는 중 오류 발생:", err);
    }
  };

  // 주문 내역 가져오기
  const fetchOrders = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const url = `http://10.125.121.118:8080/shop/getShop`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`서버 응답 에러! 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      console.log("API 응답 데이터:", data); // API 데이터 확인

      // 데이터 포맷 변환
      const formattedOrders = data.map((item) => ({
        ORDER_ID: item.shopId, // 주문 번호
        ITEM_ID: item.item?.id || null, // item.id를 ITEM_ID로 매핑
        PRODUCT_NM: item.item?.item || "정보 없음", // 상품 이름
        QUANTITY: item.item?.quantity || 0, // 수량
        UNIT_PRICE: item.item?.price || 0, // 단가
        TOTAL_AMOUNT: item.item?.amount || 0, // 총 금액
        CREATE_DATE: new Date(item.createDate).toLocaleString(), // 생성 날짜
      }));

      console.log("Formatted Orders:", formattedOrders); // 변환된 데이터 확인
      setOrders(formattedOrders);
    } catch (err) {
      console.error("주문 내역을 가져오는 중 오류 발생:", err);
    }
  };


  // 주문 취소
  const cancelOrder = async (itemId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!itemId) {
      console.error("유효하지 않은 itemId:", itemId); // 에러 로그 출력
      alert("주문 취소에 실패했습니다. 유효하지 않은 itemId입니다.");
      return;
    }

    const url = `http://10.125.121.118:8080/shop/deleteItem/${itemId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Item 삭제 실패! 상태 코드: ${response.status}`);
      }

      alert("주문이 취소되었습니다.");
      await fetchOrders(); // 최신 데이터를 다시 가져오기
    } catch (err) {
      console.error("주문 취소 중 오류 발생:", err);
    }
  };

  const cancelOrderByShopId = async (shopId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!shopId) {
      console.error("유효하지 않은 shopId:", shopId);
      alert("주문 취소에 실패했습니다. 유효하지 않은 shopId입니다.");
      return;
    }

    const url = `http://10.125.121.118:8080/shop/deleteShop/${shopId}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Shop 삭제 실패! 상태 코드: ${response.status}`);
      }

      alert(`모든 주문이 삭제되었습니다.`);
      await fetchOrders(); // 최신 데이터를 다시 가져오기
    } catch (err) {
      console.error("일괄 주문 취소 중 오류 발생:", err);
    }
  };



  useEffect(() => {
    fetchInsects();
  }, []);

  const toggleCartModal = () => {
    setIsCartModalOpen((prev) => !prev);
  };

  const toggleOrderModal = async () => {
    if (!isOrderModalOpen) {
      await fetchOrders();
    }
    setIsOrderModalOpen((prev) => !prev);
  };
  // 수량 감소 함수
  const decreaseQuantity = (insectName) => {
    setQuantities((prev) => ({
      ...prev,
      [insectName]: Math.max(1, prev[insectName] - 1), // 최소 수량은 1
    }));
  };

  // 수량 증가 함수
  const increaseQuantity = (insectName) => {
    setQuantities((prev) => ({
      ...prev,
      [insectName]: prev[insectName] + 1,
    }));
  };

  // 장바구니에 추가하는 함수
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

    // 수량을 1로 초기화
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [insect.INSECT_NM]: 1,
    }));

    alert(`${insect.INSECT_NM}이(가) 장바구니에 추가되었습니다!`);
  };


  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">곤충 명</th>
              <th className="p-2 border">단위</th>
              <th className="p-2 border">금액</th>
              <th className="p-2 border">수량</th>
              <th className="p-2 border"></th>
            </tr>
          </thead>
          <tbody>
            {insects.map((insect) => (
              <tr key={insect.INSECT_NM}>
                <td className="p-2 border">{insect.INSECT_NM}</td>
                <td className="p-2 border">{insect.WT || "정보 없음"}</td>
                <td className="p-2 border">{insect.AMOUNT || 0}원</td>
                <td className="p-2 border">
                  <button className=" px-2 py-1 rounded border " onClick={() => decreaseQuantity(insect.INSECT_NM)}>-</button>
                  <span>{quantities[insect.INSECT_NM]}</span>
                  <button className=" px-2 py-1 rounded border " onClick={() => increaseQuantity(insect.INSECT_NM)}>+</button>
                </td>
                <td className="p-2 border">
                  <button className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600" onClick={() => addToCart(insect)}>담기</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex space-x-4"> {/* 여백 추가 */}
        <button
          onClick={toggleCartModal}
          className="border border-black text-black px-6 py-3 rounded"
        >
          장바구니 보기
        </button>
        <button
          onClick={toggleOrderModal}
          className="border border-black text-black px-6 py-3 rounded"
        >
          주문내역 보기
        </button>
      </div>

      <CartModal
        isOpen={isCartModalOpen}
        onClose={toggleCartModal}
        cart={cart}
        increaseQuantity={(insectName) =>
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.INSECT_NM === insectName
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          )
        }
        decreaseQuantity={(insectName) =>
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.INSECT_NM === insectName && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
          )
        }
        removeFromCart={(insectName) =>
          setCart((prevCart) => prevCart.filter((item) => item.INSECT_NM !== insectName))
        }
      />
      {/* 주문 내역 모달 */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6"
            style={{ width: "80%", maxHeight: "80vh", overflow: "hidden" }}
          >
            <h2 className="text-2xl font-bold mb-4">주문 내역</h2>
            {orders.length === 0 ? (
              <p>주문 내역이 없습니다.</p>
            ) : (
              <div
                className="overflow-auto"
                style={{
                  maxHeight: "600px", // 세로 크기
                  width: "100%", // 가로 크기
                }}
              >
                <table className="table-auto w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 border">주문 번호</th>
                      <th className="p-2 border">주문 날짜</th>
                      <th className="p-2 border">상품 이름</th>
                      <th className="p-2 border">수량</th>
                      <th className="p-2 border">단가</th>
                      <th className="p-2 border">총 금액</th>
                      <th className="p-2 border">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, index) => (
                      <tr key={`${order.ORDER_ID}-${order.ITEM_ID || index}`} className="border">
                        <td className="p-2 border">{order.ORDER_ID}</td>
                        <td className="p-2 border">{order.CREATE_DATE}</td>
                        <td className="p-2 border">{order.PRODUCT_NM}</td>
                        <td className="p-2 border">{order.QUANTITY}</td>
                        <td className="p-2 border">{order.UNIT_PRICE}원</td>
                        <td className="p-2 border">{order.TOTAL_AMOUNT}원</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => cancelOrder(order.ITEM_ID)}
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600"
                          >
                            개별 삭제
                          </button>
                          <button
                            onClick={() => cancelOrderByShopId(order.ORDER_ID)} // ORDER_ID가 shopId로 사용
                            className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-600 ml-2"
                          >
                            일괄 삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="mt-4 text-right">
              <button
                onClick={toggleOrderModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}


    </div>



  );
}
