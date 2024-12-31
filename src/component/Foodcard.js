import React from "react";

const FoodCard = ({ food, onClick, toggleFavorite }) => (
  <div
    onClick={onClick}
    className="border border-gray-200 rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition relative"
  >
    <img
      src={food.thumbnail}
      alt={food.foodName}
      className="w-20 h-20 object-cover mx-auto mb-4 rounded"
    />
    <h2 className="text-center text-lg font-semibold mb-2">{food.foodName}</h2>
    <p className="text-center text-gray-600 text-sm">{food.foodCategory}</p>
    <button
      onClick={(e) => {
        e.stopPropagation(); // 부모 클릭 방지
        toggleFavorite(food.dataNo);
      }}
      className={`absolute top-2 right-2 p-2 rounded-full ${
        food.isFavorite ? "bg-yellow-400 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {food.isFavorite ? "★" : "☆"}
    </button>
  </div>
);

export default FoodCard;
