import React, { useEffect, useState } from 'react';
import BoardWrite from './BoardWrite';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {  isValid,format, parseISO } from 'date-fns';



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
            console.log('API 응답 데이터:', response.data);
    
            const defaultDate = new Date().toISOString(); // 기본 현재 날짜
            const boardList = response.data.content || [];
            const updatedBoardList = boardList.map((item) => ({
                ...item,
                createDate: item.createDate && isValid(parseISO(item.createDate))
                    ? item.createDate
                    : defaultDate, // 유효하지 않은 경우 기본값 사용
            }));
    
            console.log('업데이트된 게시글 목록:', updatedBoardList);
            setBoardData(updatedBoardList.slice().reverse()); // 역순 정렬
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
        const token = localStorage.getItem('authToken');
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }
    
        const defaultDate = new Date().toISOString();
        const postData = {
            ...newPost,
            createDate: newPost.createDate || defaultDate, // 기본값 추가
            member: {
                memberId: loginUser,
            },
        };
    
        console.log("보드 생성 요청 데이터:", postData);
    
        try {
            const resp = await axios.post(
                `http://10.125.121.118:8080/board/insertBoard`,
                postData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSelectedItem(null);
            loadBoardData();
            alert("글쓰기 성공");
            console.log("Board write 성공: ", resp.data);
        } catch (error) {
            console.error("보드데이터 글쓰기 실패", error);
            if (error.response) {
                console.error("서버 응답 데이터:", error.response.data);
            }
        }
    };
   
    

//게시글 수정 요청
const boardEdit = async (newPost) => {
    const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
        console.log("수정 요청 데이터:", newPost);
        const resp = await axios.put( // 요청 메서드 PUT으로 변경
            `http://10.125.121.118:8080/board/updateBoard`,
            newPost,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 헤더 추가
                    'Content-Type': 'application/json',
                },
            }
        );
        setSelectedItem(null);
        loadBoardData();
        alert("글이 수정되었습니다.");
        console.log("Board edit 성공: ", resp.data);
    } catch (error) {
        console.error("보드데이터 글수정 실패", error);
    }
};


//게시글 삭제 요청
const boardDel = async () => {
    const token = localStorage.getItem('authToken'); // 인증 토큰 가져오기
    if (!token) {
        alert("로그인이 필요합니다.");
        return;
    }

    if (!selectedItem || !selectedItem.seq) {
        alert("삭제할 항목이 선택되지 않았습니다.");
        return;
    }

    try {
        console.log("삭제 요청 항목:", selectedItem);

        // DELETE 요청
        const resp = await axios.get(
            `http://10.125.121.118:8080/board/deleteBoard?seq=${selectedItem.seq}`, // 식별자를 URL에 포함
            {
                headers: {
                    Authorization: `Bearer ${token}`, // 인증 헤더 추가
                },
            }
        );

        setSelectedItem(null); // 선택 항목 초기화
        loadBoardData(); // 게시글 목록 새로고침
        alert("글이 삭제되었습니다.")
        console.log("Board Del 성공:", resp.data);
    } catch (error) {
        console.error("보드데이터 삭제하기 실패:", error);
        if (error.response) {
            console.error("서버 응답 데이터:", error.response.data);
        }
    }
};


    //게시글 클릭시 실행
    const handleItemClick = (item) => {
        console.log("선택된 게시글 데이터:", item); // 디버깅용 로그 추가
        setSelectedItem(item); // 선택된 게시글 설정
        setDetailOpen(true); // 상세 보기 창 열기
        setWriteOpen(false); 
        setEditOpen(false);
        console.log("selectedItem:", selectedItem);

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
    const defaultDate = new Date().toISOString(); // 기본 현재 날짜

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
                       
                        <p className="text-md text-gray-700 mb-6">
                            <strong>작성자:</strong> {selectedItem.userid}
                        </p>
                        <p className="text-md text-gray-700 mb-6">
                            <strong>작성일:</strong>{" "}
                            {format(parseISO(selectedItem.createDate), "yyyy-MM-dd HH:mm:ss")}
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
                                   
                                    <th className="p-3 text-left text-gray-700">제목</th>
                                    <th className="p-3 text-center text-gray-700">내용</th>
                                    <th className="p-3 text-center text-gray-700">작성자</th>
                                    <th className="p-3 text-right text-gray-700">작성시간</th>
                                 
                                </tr>
                            </thead>
                            <tbody>
    {currentItems.length > 0 ? (
        currentItems.map((item) => (
            <tr
                key={item.seq}
                className="hover:bg-blue-50 transition-all cursor-pointer"
                onClick={() => handleItemClick(item)}
            >
                <td className="p-3 text-left text-gray-700">{item.title}</td>
                <td className="p-3 text-center text-gray-700">{item.content}</td>
                <td className="p-3 text-center text-gray-700">{item.member?.nickname}</td>
                <td className="p-3 text-right text-gray-700">
                    <p className="text-md text-gray-700 mb-6">
                    {item.createDate
                        ? format(parseISO(item.createDate), "yyyy-MM-dd HH:mm:ss")
                        : "날짜 없음"}

</p>

                </td>
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
