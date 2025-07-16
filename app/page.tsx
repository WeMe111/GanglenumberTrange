import type React from "react"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Suspense } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Copy, Check, Calculator, BookOpen, HelpCircle, Lightbulb, Users, Languages, Hash } from "lucide-react"
import { ConverterKorean } from "@/components/converter-korean"
import { ConverterRoman } from "@/components/converter-roman"
import { ConverterChinese } from "@/components/converter-chinese"

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

// 한글 숫자 변환
const numberToKorean = (num: number): string => {
  if (num === 0) return "영원"
  const units = ["", "만", "억", "조", "경"]
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]
  const tens = ["", "십", "백", "천"]
  const convertGroup = (n: number): string => {
    if (n === 0) return ""
    let result = ""
    let temp = n
    for (let i = 3; i >= 0; i--) {
      const digit = Math.floor(temp / Math.pow(10, i))
      if (digit > 0) {
        if (i > 0) {
          result += digits[digit] + tens[i]
        } else {
          result += digits[digit]
        }
      }
      temp %= Math.pow(10, i)
    }
    return result
  }
  let result = ""
  let unitIndex = 0
  while (num > 0) {
    const group = num % 10000
    if (group > 0) {
      const groupText = convertGroup(group)
      result = groupText + units[unitIndex] + result
    }
    num = Math.floor(num / 10000)
    unitIndex++
  }
  return result + "원"
}

// 로마 숫자 변환
const numberToRoman = (num: number): string => {
  if (num <= 0 || num >= 4000) return "1-3999 범위만 지원됩니다"

  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]

  let result = ""
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i]
      num -= values[i]
    }
  }
  return result
}

// 한자 숫자 변환
const numberToChinese = (num: number): string => {
  if (num === 0) return "零"

  const digits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
  const units = ["", "十", "百", "千"]
  const bigUnits = ["", "万", "億", "兆"]

  const convertGroup = (n: number): string => {
    if (n === 0) return ""

    let result = ""
    let temp = n
    let hasZero = false

    for (let i = 3; i >= 0; i--) {
      const digit = Math.floor(temp / Math.pow(10, i))
      if (digit > 0) {
        if (hasZero) result += "零"
        if (digit === 1 && i === 1 && result === "") {
          result += units[i]
        } else {
          result += digits[digit] + (i > 0 ? units[i] : "")
        }
        hasZero = false
      } else if (result !== "" && i > 0) {
        hasZero = true
      }
      temp %= Math.pow(10, i)
    }

    return result
  }

  let result = ""
  let unitIndex = 0

  while (num > 0) {
    const group = num % 10000
    if (group > 0) {
      const groupText = convertGroup(group)
      result = groupText + bigUnits[unitIndex] + result
    }
    num = Math.floor(num / 10000)
    unitIndex++
  }

  return result
}

// 입력값 포맷팅
const formatNumber = (value: string) => {
  const num = value.replace(/[^\d]/g, "")
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// 복사 기능
const copyToClipboard = async (text: string, type: string) => {
  if (text) {
    await navigator.clipboard.writeText(text)
    // 서버 컴포넌트에서 클라이언트 훅을 사용할 수 없으므로, 쿼리 파라미터로 전달
    redirect(`/?copied=${true}&type=${type}`)
  }
}

// 예시 금액 설정
const setExampleAmount = (amount: string, type: string) => {
  const formatted = formatNumber(amount)
  redirect(`/?${type}=${formatted}`)
}

export default function Page({ searchParams }: Props) {
  // 쿼리 파라미터에서 입력값 추출
  const number = typeof searchParams?.number === "string" ? searchParams.number : ""
  const numericValue = Number(number.replace(/,/g, ""))
  const koreanText = !isNaN(numericValue) && numericValue >= 0 ? numberToKorean(numericValue) : ""
  const romanNumber = typeof searchParams?.romanNumber === "string" ? searchParams.romanNumber : ""
  const romanText = typeof searchParams?.romanText === "string" ? searchParams.romanText : ""
  const chineseNumber = typeof searchParams?.chineseNumber === "string" ? searchParams.chineseNumber : ""
  const chineseText = typeof searchParams?.chineseText === "string" ? searchParams.chineseText : ""
  const copied = typeof searchParams?.copied === "string" ? searchParams.copied === "true" : false

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Languages className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                종합 변환 도구
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-4">숫자, 주소를 다양한 형태로 쉽게 변환해보세요</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary">한글 변환</Badge>
              <Badge variant="secondary">로마 숫자</Badge>
              <Badge variant="secondary">한자 변환</Badge>
            </div>
          </div>

          {/* Main Converter Tabs */}
          <Tabs defaultValue="korean" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="korean" className="flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                한글 변환
              </TabsTrigger>
              <TabsTrigger value="roman" className="flex items-center gap-2">
                <Hash className="w-4 h-4" />
                로마 숫자
              </TabsTrigger>
              <TabsTrigger value="chinese" className="flex items-center gap-2">
                <Languages className="w-4 h-4" />
                한자 변환
              </TabsTrigger>
            </TabsList>

            {/* 한글 변환 */}
            <TabsContent value="korean">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-800">숫자 → 한글 변환</CardTitle>
                  <CardDescription className="text-gray-600">
                    숫자를 입력하면 자동으로 한글로 변환됩니다
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ConverterKorean />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 로마 숫자 변환 */}
            <TabsContent value="roman">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-800">숫자 → 로마 숫자 변환</CardTitle>
                  <CardDescription className="text-gray-600">숫자를 로마 숫자로 변환합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConverterRoman />
                </CardContent>
              </Card>
            </TabsContent>

            {/* 한자 변환 */}
            <TabsContent value="chinese">
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl text-gray-800">숫자 → 한자 변환</CardTitle>
                  <CardDescription className="text-gray-600">숫자를 중국식 한자 숫자로 변환합니다</CardDescription>
                </CardHeader>
                <CardContent>
                  <ConverterChinese />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Additional Content Tabs */}
          <Tabs defaultValue="guide" className="mt-8">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="guide">사용 가이드</TabsTrigger>
              <TabsTrigger value="business">비즈니스 활용</TabsTrigger>
              <TabsTrigger value="tips">유용한 팁</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="guide" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    변환 도구 사용 가이드
                  </CardTitle>
                  <CardDescription>각 변환 도구의 사용법과 특징을 알아보세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-blue-600">한글 변환</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 숫자를 한국어 표기법에 맞게 변환</li>
                        <li>• 계약서, 공문서에서 활용</li>
                        <li>• 금액 오류 방지 효과</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-red-600">로마 숫자</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 1-3999 범위 지원</li>
                        <li>• 시계, 건물 층수 표기</li>
                        <li>• 고전적이고 격식있는 표현</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-3 text-green-600">한자 변환</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 중국식 한자 숫자 표기</li>
                        <li>• 동양 문화권에서 활용</li>
                        <li>• 전통적이고 격조있는 표현</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    비즈니스 활용 사례
                  </CardTitle>
                  <CardDescription>다양한 업무 상황에서 변환 도구를 활용하는 방법</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">📋 문서 작성</h3>
                      <p className="text-gray-700 mb-3">
                        계약서, 견적서, 영수증 등 공식 문서에서 숫자와 함께 한글/로마숫자를 병기하여 전문성을 높이고
                        오류를 방지할 수 있습니다.
                      </p>
                      <div className="text-sm text-gray-600">예시: 계약금액 ₩5,000,000 (오백만원정) / V백만원</div>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">🌏 국제 업무</h3>
                      <p className="text-gray-700 mb-3">
                        해외 거래처와의 소통, 국제 배송, 비자 신청 등에서 주소 영문 변환과 로마숫자 표기를 활용할 수
                        있습니다.
                      </p>
                    </div>

                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                      <h3 className="font-semibold text-lg mb-3">🎨 디자인 & 브랜딩</h3>
                      <p className="text-gray-700 mb-3">
                        로고, 브랜드명, 제품명에 로마숫자나 한자를 활용하여 고급스럽고 독특한 느낌을 연출할 수 있습니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tips" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    유용한 팁과 주의사항
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 text-blue-600">✅ 활용 팁</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 중요 문서는 숫자와 문자 병기</li>
                        <li>• 복사 기능으로 빠른 활용</li>
                        <li>• 예시 버튼으로 쉬운 테스트</li>
                        <li>• 모바일에서도 최적화</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold text-lg mb-2 text-red-600">⚠️ 주의사항</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• 법적 문서는 전문가 검토 필요</li>
                        <li>• 주소 변환은 참고용으로만 사용</li>
                        <li>• 큰 숫자는 단위 확인 필수</li>
                        <li>• 결과 검토 후 사용 권장</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    자주 묻는 질문
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">Q. 모든 변환이 정확한가요?</h3>
                      <p className="text-gray-600">
                        네, 표준 변환 규칙에 따라 정확하게 변환됩니다. 단, 주소 영문 변환은 기본적인 변환만 제공하므로
                        정확한 영문 주소는 우체국 등 공식 서비스를 이용하세요.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">Q. 로마 숫자는 왜 3999까지만 지원하나요?</h3>
                      <p className="text-gray-600">
                        전통적인 로마 숫자 체계에서는 4000 이상을 표현하기 위해 특수한 기호를 사용하는데, 일반적으로
                        사용되지 않아 3999까지만 지원합니다.
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <h3 className="font-semibold text-lg mb-2">Q. 변환 결과를 상업적으로 사용해도 되나요?</h3>
                      <p className="text-gray-600">
                        네, 자유롭게 사용하실 수 있습니다. 단, 중요한 법적 문서나 계약서에 사용할 때는 전문가의 검토를
                        받으시기 바랍니다.
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Q. 모바일에서도 잘 작동하나요?</h3>
                      <p className="text-gray-600">
                        네, 반응형 디자인으로 제작되어 스마트폰, 태블릿에서도 최적화된 환경으로 사용하실 수 있습니다.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* --- 실무 활용 팁/칼럼/FAQ 섹션 --- */}
          <section className="mt-16">
            {/* 한글 주석: 실무 활용 팁/칼럼/FAQ 카드 섹션 */}
            <h2 className="text-2xl font-bold mb-6">실무 활용 팁 & 칼럼</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* 엑셀 자동화 칼럼 */}
              <Card>
                <CardHeader>
                  <CardTitle>엑셀에서 숫자 변환 자동화하는 방법</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 text-sm space-y-2">
                  <p>엑셀에서 숫자를 한글, 한자, 로마 숫자로 변환하려면 함수만으로는 한계가 있습니다. 이럴 때는 <b>VBA 사용자 정의 함수</b>나 외부 변환 도구를 활용하면 대량 데이터도 손쉽게 처리할 수 있습니다.</p>
                  <p>예시: <span className="font-mono bg-gray-100 px-1 rounded">=NumToKorean(A1)</span> (VBA 함수 활용)</p>
                  <p className="text-xs text-gray-500">※ 본 사이트의 변환 결과를 복사해 엑셀에 붙여넣어도 편리합니다.</p>
                </CardContent>
              </Card>
              {/* 공식 문서 숫자 표기 칼럼 */}
              <Card>
                <CardHeader>
                  <CardTitle>공식 문서에서 숫자 표기의 중요성</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 text-sm space-y-2">
                  <p>계약서, 세금계산서, 영수증 등 공식 문서에서는 숫자와 한글(또는 한자)을 함께 표기하는 것이 일반적입니다. 이는 금액 변조를 방지하고, 법적 분쟁 시 명확한 근거가 됩니다.</p>
                  <p>예시: <span className="font-mono bg-gray-100 px-1 rounded">금 일백만원정(₩1,000,000)</span></p>
                  <p className="text-xs text-gray-500">※ 숫자와 한글을 병기하면 신뢰도가 올라갑니다.</p>
                </CardContent>
              </Card>
              {/* 로마/한자 숫자 활용 칼럼 */}
              <Card>
                <CardHeader>
                  <CardTitle>로마 숫자, 한자 숫자 어디에 쓰이나?</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-700 text-sm space-y-2">
                  <p>로마 숫자는 시계, 연도 표기, 챕터(Chapter) 등에서 자주 사용됩니다. 한자 숫자는 전통 문서, 족보, 고문서, 동양권 공식 문서 등에서 활용됩니다.</p>
                  <p>예시: <span className="font-mono bg-gray-100 px-1 rounded">MMXXIV = 2024</span>, <span className="font-mono bg-gray-100 px-1 rounded">一千二百三十四 = 1234</span></p>
                  <p className="text-xs text-gray-500">※ 다양한 숫자 표기법을 알아두면 실무에 도움이 됩니다.</p>
                </CardContent>
              </Card>
            </div>
            {/* FAQ 아코디언 */}
            <h2 className="text-xl font-bold mb-4">자주 묻는 질문(FAQ)</h2>
            <div className="mb-20">
              <div className="border rounded-lg divide-y">
                {/* FAQ 1 */}
                <details className="p-4 group" open>
                  <summary className="font-semibold cursor-pointer group-hover:text-blue-600">변환 결과가 100% 정확한가요?</summary>
                  <p className="mt-2 text-gray-700 text-sm">네, 본 사이트의 변환기는 표준 숫자 표기법을 따르며, 다양한 실무 예시를 참고해 구현되었습니다. 다만, 공식 문서 제출 전에는 반드시 결과를 검토해 주세요.</p>
                </details>
                {/* FAQ 2 */}
                <details className="p-4 group">
                  <summary className="font-semibold cursor-pointer group-hover:text-blue-600">엑셀에서 자동으로 변환하려면 어떻게 하나요?</summary>
                  <p className="mt-2 text-gray-700 text-sm">VBA 사용자 정의 함수를 활용하거나, 본 사이트에서 변환 후 복사해 붙여넣으면 대량 데이터도 쉽게 처리할 수 있습니다.</p>
                </details>
                {/* FAQ 3 */}
                <details className="p-4 group">
                  <summary className="font-semibold cursor-pointer group-hover:text-blue-600">로마 숫자, 한자 숫자는 어디에 활용되나요?</summary>
                  <p className="mt-2 text-gray-700 text-sm">로마 숫자는 시계, 연도, 챕터 등에서, 한자 숫자는 전통 문서, 족보, 고문서 등에서 활용됩니다.</p>
                </details>
                {/* FAQ 4 */}
                <details className="p-4 group">
                  <summary className="font-semibold cursor-pointer group-hover:text-blue-600">모바일에서도 사용이 편리한가요?</summary>
                  <p className="mt-2 text-gray-700 text-sm">네, 반응형 디자인으로 제작되어 스마트폰, 태블릿, 데스크톱 등 모든 기기에서 최적화된 환경으로 사용하실 수 있습니다.</p>
                </details>
              </div>
            </div>
          </section>

          {/* Footer */}
          <Card className="mt-8 bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-3">🚀 종합 변환 도구를 무료로 사용하세요!</h3>
                <p className="text-gray-600 mb-4">
                  4가지 변환 기능을 모두 무료로 제공합니다. 회원가입이나 로그인 없이 바로 사용하실 수 있습니다.
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-500 flex-wrap">
                  <span>✓ 한글 숫자 변환</span>
                  <span>✓ 로마 숫자 변환</span>
                  <span>✓ 한자 숫자 변환</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
