import React, { useEffect, useState } from 'react';
import BoardWrite from './BoardWrite';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

const BoardModal = ({ isOpen, onClose }) => {
    const [boardData, setBoardData] = useState([]);
    const [detailOpen, setDetailOpen] = useState(false);
    const [writeOpen, setWriteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKey, setSearchKey] = useState('');

    const itemLen = 10;
    const totalPages = Math.ceil(boardData.length / itemLen);
    const lastPage = currentPage * itemLen;
    const firstPage = lastPage - itemLen;
    const currentItems = boardData.slice(firstPage, lastPage);

    const loginAuth = useSelector((state) => state.login.isAuthenticated);

    const loadBoardData = async () => {
        try {
            const response = await axios.get('http://10.125.121.217:8080/board/bring');
            setBoardData(response.data.slice().reverse());
        } catch (error) {
            console.error('게시글 불러오기 실패:', error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadBoardData();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleWriteClick = () => {
        if (!loginAuth) {
            alert('로그인 후 글쓰기가 가능합니다.');
            return;
        }
        setWriteOpen(true);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
    <div className="relative bg-white rounded-lg shadow-lg w-3/4 p-6">
        <img
            src="./img/Exit.png"
            alt="닫기 버튼"
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 cursor-pointer z-10"
        />
        <h2 className="text-4xl font-extrabold text-center mb-8 text-black">
            게시판
        </h2>
        <div className="flex justify-between items-center mb-6">
            <button
                onClick={handleWriteClick}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                글쓰기
            </button>
            <div className="flex items-center">
                <input
                    type="text"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                    placeholder="검색어 입력"
                    className="border-2 border-gray-300 rounded-l-md p-2 h-10"
                />
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
                    onClick={() => console.log('검색')}
                >
                    검색
                </button>
            </div>
        </div>
        <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-300">
                <tr>
                    <th className="p-3 text-left text-gray-700">글번호</th>
                    <th className="p-3 text-left text-gray-700">제목</th>
                    <th className="p-3 text-left text-gray-700">작성자</th>
                    <th className="p-3 text-left text-gray-700">게시일</th>
                    <th className="p-3 text-left text-gray-700">조회수</th>
                </tr>
            </thead>
            <tbody>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <tr
                            key={item.idx}
                            className="hover:bg-blue-50 transition-all cursor-pointer"
                            onClick={() => console.log('글 클릭', item)}
                        >
                            <td className="p-3 text-gray-700">{item.idx}</td>
                            <td className="p-3 text-gray-700">{item.title}</td>
                            <td className="p-3 text-gray-700">{item.nickname}</td>
                            <td className="p-3 text-gray-700">
                                {format(parseISO(item.regidate_date), 'yyyy-MM-dd')}
                            </td>
                            <td className="p-3 text-gray-700">{item.visit_count}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td
                            colSpan="5"
                            className="text-center text-gray-700 py-6"
                        >
                            데이터가 없습니다.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        <div className="flex justify-center mt-4">
            <button
                className="px-4 py-2 border rounded hover:bg-gray-200"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
                이전
            </button>
            {[...Array(totalPages)].map((_, index) => (
                <button
                    key={index}
                    className={`px-4 py-2 mx-1 border rounded ${
                        currentPage === index + 1
                            ? 'bg-blue-600 text-white'
                            : 'hover:bg-gray-200'
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                >
                    {index + 1}
                </button>
            ))}
            <button
                className="px-4 py-2 border rounded hover:bg-gray-200"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
                다음
            </button>
        </div>
    </div>
</div>

    );
};

export default BoardModal;
