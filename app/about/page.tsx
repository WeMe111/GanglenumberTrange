import React from "react";

// 소개 페이지 컴포넌트
export default function AboutPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      {/* 서비스 소개 */}
      <h1 className="text-2xl font-bold mb-4">서비스 소개</h1>
      <p className="mb-4">
        이 사이트는 숫자를 한글로 변환해주는 간편한 도구입니다. 엑셀에서 숫자를 한글로 바꿔야 할 때, 복잡한 함수 없이 바로 변환 결과를 얻을 수 있습니다.
      </p>
      {/* 엑셀 활용 예시 */}
      <h2 className="text-xl font-semibold mt-8 mb-2">엑셀에서 활용 예시</h2>
      <ul className="list-disc pl-5 space-y-2">
        <li>세금계산서, 견적서 등에서 금액을 한글로 표기할 때</li>
        <li>엑셀 함수로 직접 변환이 어려울 때 간편하게 복사/붙여넣기</li>
        <li>대량의 숫자를 한글로 변환해야 할 때 빠르게 처리</li>
      </ul>
      <p className="mt-6 text-gray-500 text-sm">※ 본 서비스는 무료로 제공되며, 누구나 자유롭게 사용할 수 있습니다.</p>
    </main>
  );
} 