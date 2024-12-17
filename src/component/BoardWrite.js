import React, { useState } from 'react';

const BoardWrite = ({ onSubmit, onClose, initialData, user }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [content, setContent] = useState(initialData.content || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPost = {
            ...initialData,
            idx: initialData.idx || '',
            title: title,
            username: user || '',
            content: content,
            regidate_date: initialData.regidate_date || new Date().toISOString(),
            visit_count: initialData.visit_count || 0,
        };
        onSubmit(newPost);  // 부모 컴포넌트로 새 글 데이터 전달
    };

    return (
        <div className="write-container p-6 rounded-lg bg-gray-100 shadow-md font-['NanumGodic']">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">{initialData.idx ? "글 수정" : "글 작성"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">제목</label>
                    <input type="text" className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">내용</label>
                    <textarea className="mt-1 block w-full p-2 border border-gray-300 rounded-md whitespace-pre-wrap"
                        rows="5" value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div className="flex justify-between">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                        {initialData.idx ? "수정하기" : "게시하기"}
                    </button>
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BoardWrite;
