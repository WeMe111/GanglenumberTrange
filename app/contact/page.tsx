import React from "react";

// 연락처 페이지 컴포넌트
export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">연락처</h1>
      <p className="mb-4">서비스 관련 문의나 제안이 있으시면 아래 이메일로 연락해 주세요.</p>
      <div className="bg-gray-100 rounded p-4 mb-4">
        <span className="font-semibold">이메일:</span> <a href="mailto:admin@example.com" className="text-blue-600 underline">admin@example.com</a>
      </div>
      <p className="text-gray-500 text-sm">※ 빠른 답변을 위해 자세한 내용을 남겨주시면 감사하겠습니다.</p>
    </main>
  );
} 