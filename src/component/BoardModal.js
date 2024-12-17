import React, { useEffect, useState } from 'react'
import BoardWrite from './BoardWrite';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { format, parseISO } from 'date-fns';

const BoardModal = ({ isOpen, onClose }) => {
	const [boardData, setBoardData] = useState([]); //게시판 전체 글데이터
	const [detailOpen, setDetailOpen] = useState(false); //게시글 상세보기창 열림/닫힘 상태
    const [writeOpen, setWriteOpen] = useState(false); // 글쓰기 페이지 열림/닫힘 상태
    const [editOpen, setEditOpen] = useState(false); //게시글 수정창 열림/닫힘 상태
    const [selectedItem, setSelectedItem] = useState(null); //선택된 게시글 저장
    const [currentPage, setCurrentPage] = useState(1); //현재 페이지
    const [searchKey, setSearchKey] =useState(null); //검색키워드 저장
    const itemLen = 10;

 

    //게시판 페이지 변수들
    const totalPages = Math.ceil(boardData.length / itemLen);
    const lastPage = currentPage * itemLen;
    const firstPage = lastPage - itemLen;
    const currentItems = boardData.slice(firstPage, lastPage);

    const pageNum = [];

    //게시판에 사용할 사용자 정보 불러들임
    const loginAuth = useSelector((state) => state.login.isAuthenticated);
    const loginUser = useSelector((state) => state.login.user);
    const loginRole = useSelector((state) => state.login.role);
    const loginToken = useSelector((state) => state.login.token);

    //처음 로딩시 게시글 렌더링 요청
	useEffect(() => {
        if (isOpen){
		loadBoardData();
        console.log("보드 새로불러옴");
        }
	},[isOpen]);
    if (!isOpen) return null;

    //전체 게시글 
	const loadBoardData = async () => {
		try {
            console.log(loginToken);
			const resp = await axios.get('http://10.125.121.217:8080/board/bring', 
            
            );
            console.log(resp.data);
			setBoardData(resp.data.slice().reverse());
		} catch (error) {
			console.error("보드데이터 불러오기 실패", error);
		}
	};

    //게시글 삭제 
    const boardDel = async () => {
        try {
            console.log(selectedItem);
			const resp = await axios.delete(`http://10.125.121.217:8080/board/delete/${selectedItem.idx}`);
            setSelectedItem(null);
            loadBoardData();
			console.log("Board Del: ", resp.data);
		} catch (error) {
			console.error("보드데이터 삭제하기 실패", error);
		}
    };

    //게시글 생성
    const boardWrite = async (newPost) => {
        try {
            console.log(newPost);
			const resp = await axios.post(`http://10.125.121.217:8080/board/write`, newPost);
			setSelectedItem(null);
            loadBoardData();
			console.log("Board write: ", resp.data);
		} catch (error) {
			console.error("보드데이터 글쓰기 실패", error);
		}
    };

    //게시글 수정 
    const boardEdit = async (newPost) => {
        try {
            console.log(newPost);
			const resp = await axios.put(`http://10.125.121.217:8080/board/update`, newPost);
			setSelectedItem(null);
            loadBoardData();
			console.log("Board edit: ", resp.data);
		} catch (error) {
			console.error("보드데이터 글수정 실패", error);
		}
    };

    //게시글 검색
    const boardSearch = async () => {
        try {
			const resp = await axios.get(`http://10.125.121.217:8080/board/find?keyword=${searchKey}`);
            setBoardData(resp.data);
			setSearchKey(null);
			console.log("Board edit: ", resp.data);
		} catch (error) {
			console.error("보드데이터 검색 실패", error);
		}
    };

    
	
    //페이지 개수 저장
    for (let i = 1; i <= totalPages; i++) {
        pageNum.push(i);
    };

    //검색버튼 클릭시 검색
    const handleSearchKeyword = () => {
        boardSearch();
    };

    //게시글 클릭시 실행
    const handleItemClick = (item) => {
        setSelectedItem(item);
        item.visit_count += 1;
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
        
        if(loginRole === 'ROLE_ADMIN') {
        }else if(selectedItem.username !== loginUser){
            alert("작성자 본인만 수정할수있습니다.");
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
        if(loginRole === 'ROLE_ADMIN') {
        }else if(selectedItem.username !== loginUser){
            alert("작성자 본인만 삭제할수있습니다.");
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
        <div className='fixed inset-0 bg-gray-800 bg-opacity-75 flex flex-col items-center justify-center z-30 font-["NanumGodic"]'>
            <div className='bg-white p-5 rounded-md shadow-lg w-3/4 relative bg-gradient-to-t from-white to-blue-50'>
            <img src='./img/Exit.png' onClick={onClose} className='absolute top-5 right-5 w-7 h-7 cursor-pointer'></img>

                {/* 글쓰기 글수정 또는 글상세보기 페이지 */}
                {writeOpen || editOpen ? (
                    <BoardWrite onSubmit={handleSubmit} onClose={writeOpen ? handleWriteClose : handleEditClose} initialData={selectedItem || {}} user={loginUser}  />
                ) : detailOpen && selectedItem ? (
                    <div className="detail-container p-6 rounded-lg bg-gray-100 shadow-md">
                        <h2 className="text-2xl font-bold text-blue-700 mb-4">{selectedItem.title}</h2>
                        <div className="flex justify-between mb-4">
                            <p className="text-sm text-gray-500">글번호: {selectedItem.idx}</p>
                            <p className="text-sm text-gray-500">조회수: {selectedItem.visit_count}</p>
                        </div>
                        <p className="text-md text-gray-700 mb-6"><strong>작성자:</strong> {selectedItem.username}</p>
                        <p className="text-md text-gray-700 mb-6"><strong>작성일:</strong> {format(parseISO(selectedItem.regidate_date), 'yyyy-MM-dd HH:mm:ss')}</p>
                        <p className="text-md text-gray-800 mb-6 whitespace-pre-wrap"><strong>내용:</strong><br/>{selectedItem.content}</p>
                        <div className='flex justify-end space-x-4'>
                            <button onClick={handleEditClick} className='px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-600'>
                                수정하기
                            </button>
                            <button onClick={handleDelete} className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'>
                                삭제하기
                            </button>
                            <button onClick={handleDetailClose} className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                                닫기
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        {/*게시글 전체 보기 페이지*/}
                        <h2 className="text-5xl my-8 text-center font-extrabold">
                            게시판</h2>
                        <div className='flex justify-between'>
                        <button onClick={handleWriteClick} className='mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'>글쓰기</button>
                            <div className='flex'>
                                <input type="text" value={searchKey} onChange={(e) => setSearchKey(e.target.value)} 
                                    className="border-2 border-gray-300 p-2 rounded-md w-full h-10"/>
                                <button onClick={handleSearchKeyword}
                                        className=" w-16 h-10 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-colors">
                                    검색
                                </button>
                            </div>
                        </div>
                        <table className='w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden my-4'>
                            <thead className='bg-gray-200'>
                                <tr>
                                    <th className='p-3 text-left text-sm font-semibold text-gray-700'>글번호</th>
                                    <th className='p-3 text-left text-sm font-semibold text-gray-700'>제목</th>
                                    <th className='p-3 text-left text-sm font-semibold text-gray-700'>작성자</th>
                                    <th className='p-3 text-left text-sm font-semibold text-gray-700'>게시한 날짜</th>
                                    <th className='p-3 text-left text-sm font-semibold text-gray-700'>조회수</th>
                                </tr>
                            </thead>
                            <tbody className='cursor-pointer'>
                                {currentItems.length > 0 ? (
                                    currentItems.map(item => (
                                        <tr key={item.idx} className='odd:bg-gray-100 even:bg-white hover:bg-blue-50 transition-colors'
                                            onClick={() => handleItemClick(item)}>
                                            <td className='p-3 text-sm text-gray-800'>{item.idx}</td>
                                            <td className='p-3 text-sm text-gray-800'>{item.title}</td>
                                            <td className='p-3 text-sm text-gray-800'>{item.nickname}</td>
                                            <td className='p-3 text-sm text-gray-800'>{format(parseISO(item.regidate_date), 'yyyy-MM-dd HH:mm:ss')}</td>
                                            <td className='p-3 text-sm text-gray-800'>{item.visit_count}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className='p-3 text-center text-sm text-gray-800'>데이터가 없습니다.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/*페이지 표시 페이지*/}
                        <div className='flex justify-center mt-4'>
                            <button className='px-4 py-2 mx-2 border rounded hover:bg-gray-200'
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}>
                                이전
                            </button>
                            {pageNum.map(num => (
                                <button key={num}
                                    className={`px-4 py-2 mx-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                                    onClick={() => setCurrentPage(num)}>
                                    {num}
                                </button>
                            ))}
                            <button className='px-4 py-2 mx-2 border rounded hover:bg-gray-200'
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}>
                                다음
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
	)
}

export default BoardModal
