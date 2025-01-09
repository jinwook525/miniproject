import React from "react";

const FoodCard = ({ food, onClick, toggleFavorite }) => {
  // 카테고리에 따라 아이콘 설정
  const getCategoryIcon = (category) => {
    switch (category) {
      case "한식":
        return "🍚"; // 한식 아이콘
      case "양식":
        return "🍝"; // 양식 아이콘
      case "일식":
        return "🍣"; // 일식 아이콘
      case "중식":
        return "🥢"; // 중식 아이콘
      default:
        return "🍴"; // 기본 아이콘
    }
  };

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition flex items-center relative"
    >
      <img
        src={food.thumbnail}
        alt={food.foodName}
        className="w-32 h-32 object-cover rounded mr-4"
      />
      <div className="flex-1 w-32 h-32">
        <h2 className="text-md font-semibold mb-2">{food.foodName}</h2>
        <p className="text-gray-600 text-sm flex items-center">
          {food.foodCategory}
          <span className="ml-2">{getCategoryIcon(food.foodCategory)}</span>
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation(); // 부모 클릭 방지
          toggleFavorite(food.dataNo);
        }}
        className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-full ${
          food.isFavorite ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
        }`}
      >
        {food.isFavorite ? "★" : "☆"}
      </button>
    </div>
  );
};

export default FoodCard;
