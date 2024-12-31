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
    const loginUser = useSelector((state) => state.login.userid);
    const loginNick = useSelector((state) => state.login.nickname);
    const loginToken = useSelector((state) => state.login.token);
    
    
    const loadBoardData = async () => {
        try {
            const response = await axios.get('http://10.125.121.118:8080/board/getBoardList');
            console.log('Response Data:', response.data); // 서버 응답 데이터 확인
    
            // 게시글 데이터 추출
            const boardList = response.data.content || []; // content 배열 사용
            setBoardData(boardList.slice().reverse()); // 역순으로 정렬하여 저장
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
    
    //게시글 생성 요청
    const boardWrite = async (newPost) => {
        try {
        console.log(newPost);
        const resp = await axios.post(`http://10.125.121.118:8080/board/insertBoard`, newPost);
        setSelectedItem(null);
        loadBoardData();
        console.log("Board write: ", resp.data);
    } catch (error) {
        console.error("보드데이터 글쓰기 실패", error);
    }
};

//게시글 수정 요청
const boardEdit = async (newPost) => {
    try {
        console.log(newPost);
        const resp = await axios.put(`http://10.125.121.183:8080/board/updateBoard`, newPost);
        setSelectedItem(null);
        loadBoardData();
        console.log("Board edit: ", resp.data);
    } catch (error) {
        console.error("보드데이터 글수정 실패", error);
    }
};
//게시글 삭제 요청
const boardDel = async () => {
    try {
        console.log(selectedItem);
        const resp = await axios.delete(`http://10.125.121.118:8080/board/deleteBoard`);
        setSelectedItem(null);
        loadBoardData();
        console.log("Board Del: ", resp.data);
    } catch (error) {
        console.error("보드데이터 삭제하기 실패", error);
    }
};

    //게시글 클릭시 실행
    const handleItemClick = (item) => {
        setSelectedItem(item);

        setDetailOpen(true);
        setWriteOpen(false); 
        setEditOpen(false);
    };

    //상세페이지 닫음 실행
    const handleDetailClose = () => {
        setDetailOpen(false);
        setSelectedItem(null);
    };

    //글쓰기 버튼 클릭시 실행
    const handleWriteClick = () => {
        if (!loginAuth) {
            alert("로그인후 글쓰기가 가능합니다.");
            return;
        }
        setSelectedItem(null);
        setWriteOpen(true);  
        setDetailOpen(false); 
        setEditOpen(false);
    };

    //글쓰기창 닫기
    const handleWriteClose = () => {
        setWriteOpen(false);
    };

    //글수정 버튼 클릭시 실행
    const handleEditClick = () => {
        if (!loginAuth) {
            alert("로그인후 글수정이 가능합니다.");
            return;
        }
        
        setEditOpen(true);
        setDetailOpen(false);
    };

    //글수정창 닫기
    const handleEditClose = () => {
        setEditOpen(false);
    };

    //글삭제 버튼 클릭시 실행
    const handleDelete = () => {
        if (!loginAuth) {
            alert("로그인후 글삭제가 가능합니다.");
            return;
        }

        const confirmDelete = window.confirm("정말 이글을 삭제하시겠습니까?");
        if (!confirmDelete) return;
        boardDel();
        setDetailOpen(false);
        setSelectedItem(null);
    }

    //글수정창과 글쓰기창에서 확인버튼 클릭시 실행
    const handleSubmit = (newPost) => {
        console.log("newPost : ", newPost);
        if (editOpen){
            setEditOpen(false);
            setDetailOpen(true);
            boardEdit(newPost);
        } else {
            setWriteOpen(false); 
            setSelectedItem(newPost);
            boardWrite(newPost);
        };
        
    };
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center z-30">
            <div className="bg-white p-5 rounded-md shadow-lg w-3/4 relative bg-gradient-to-t from-white to-blue-50">
                <img
                    src="./img/Exit.png"
                    onClick={onClose}
                    className="absolute top-5 right-5 w-7 h-7 cursor-pointer"
                />
    
                {/* 글쓰기, 글수정, 상세보기 페이지 조건부 렌더링 */}
                {writeOpen || editOpen ? (
                    <BoardWrite
                        onSubmit={handleSubmit}
                        onClose={writeOpen ? handleWriteClose : handleEditClose}
                        initialData={selectedItem || {}}
                        user={loginUser}
                        nick={loginNick}
                    />
                ) : detailOpen && selectedItem ? (
                    <div className="detail-container p-6 rounded-lg bg-gray-100 shadow-md">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">
                            {selectedItem.title}
                        </h2>
                        <div className="flex justify-between mb-4">
                            <p className="text-sm text-gray-500">글번호: {selectedItem.idx}</p>
                            <p className="text-sm text-gray-500">조회수: {selectedItem.visit_count}</p>
                        </div>
                        <p className="text-md text-gray-700 mb-6">
                            <strong>작성자:</strong> {selectedItem.userid}
                        </p>
                        <p className="text-md text-gray-700 mb-6">
                            <strong>작성일:</strong>{" "}
                            {format(parseISO(selectedItem.regidate_date), "yyyy-MM-dd HH:mm:ss")}
                        </p>
                        <p className="text-md text-gray-800 mb-6 whitespace-pre-wrap">
                            <strong>내용:</strong>
                            <br />
                            {selectedItem.content}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleEditClick}
                                className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600"
                            >
                                수정하기
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                삭제하기
                            </button>
                            <button
                                onClick={handleDetailClose}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-4xl font-extrabold text-center mb-8 text-black">게시판</h2>
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
                                    onClick={() => console.log("검색")}
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
                                            onClick={() => setSelectedItem(item)}
                                        >
                                            <td className="p-3 text-gray-700">{item.idx}</td>
                                            <td className="p-3 text-gray-700">{item.title}</td>
                                            <td className="p-3 text-gray-700">{item.nickname}</td>
                                            <td className="p-3 text-gray-700">
                                                {format(parseISO(item.regidate_date), "yyyy-MM-dd")}
                                            </td>
                                            <td className="p-3 text-gray-700">{item.visit_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-gray-700 py-6">
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
                                        currentPage === index + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-200"
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
                )}
            </div>
        </div>
    );
}
export default BoardModal;
