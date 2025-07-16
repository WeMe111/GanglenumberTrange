import React from "react";

// 이용약관 페이지 컴포넌트
export default function TermsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">이용약관</h1>
      <ul className="list-disc pl-5 space-y-2 mb-4">
        <li>본 서비스는 누구나 무료로 사용할 수 있습니다.</li>
        <li>서비스의 결과는 참고용이며, 법적 효력을 갖지 않습니다.</li>
        <li>운영자는 서비스 제공을 위해 광고를 게재할 수 있습니다.</li>
        <li>서비스 이용 중 발생하는 문제에 대해 운영자는 책임을 지지 않습니다.</li>
      </ul>
      <p className="mt-6 text-gray-500 text-sm">※ 자세한 문의는 연락처 페이지를 이용해 주세요.</p>
    </main>
  );
} 