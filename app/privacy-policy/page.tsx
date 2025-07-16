import React from "react";

// 개인정보처리방침 페이지 컴포넌트
export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">개인정보처리방침</h1>
      <p className="mb-4">
        본 사이트는 사용자의 개인정보를 수집하지 않으며, 입력된 데이터는 서버에 저장되지 않습니다. 변환된 결과는 오직 사용자의 브라우저에서만 처리됩니다.
      </p>
      <ul className="list-disc pl-5 space-y-2">
        <li>입력한 숫자 및 변환 결과는 저장되지 않습니다.</li>
        <li>광고 및 통계 분석을 위해 쿠키가 사용될 수 있습니다.</li>
        <li>문의사항은 연락처 페이지를 통해 접수해 주세요.</li>
      </ul>
      <p className="mt-6 text-gray-500 text-sm">※ 개인정보 보호를 최우선으로 생각합니다.</p>
    </main>
  );
} 