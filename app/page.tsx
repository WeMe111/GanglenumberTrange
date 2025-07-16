"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Calculator, BookOpen, TrendingUp, HelpCircle, Lightbulb, FileText, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function Component() {
  const [number, setNumber] = useState("")
  const [koreanText, setKoreanText] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

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

  const handleNumberChange = (value: string) => {
    const cleanValue = value.replace(/[^\d,]/g, "")
    setNumber(cleanValue)

    const numericValue = Number.parseInt(cleanValue.replace(/,/g, ""))

    if (!isNaN(numericValue) && numericValue >= 0) {
      setKoreanText(numberToKorean(numericValue))
    } else {
      setKoreanText("")
    }
  }

  const formatNumber = (value: string) => {
    const num = value.replace(/[^\d]/g, "")
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatNumber(e.target.value)
    handleNumberChange(formatted)
  }

  const copyToClipboard = async () => {
    if (koreanText) {
      await navigator.clipboard.writeText(koreanText)
      setCopied(true)
      toast({
        title: "복사 완료",
        description: "한글 금액이 클립보드에 복사되었습니다.",
      })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const setExampleAmount = (amount: string) => {
    const formatted = formatNumber(amount)
    handleNumberChange(formatted)
  }

  const popularAmounts = [
    { amount: "50000", label: "5만원", category: "일상" },
    { amount: "100000", label: "10만원", category: "일상" },
    { amount: "500000", label: "50만원", category: "비즈니스" },
    { amount: "1000000", label: "100만원", category: "비즈니스" },
    { amount: "5000000", label: "500만원", category: "부동산" },
    { amount: "10000000", label: "1천만원", category: "부동산" },
    { amount: "50000000", label: "5천만원", category: "부동산" },
    { amount: "100000000", label: "1억원", category: "투자" },
  ]

  const businessCases = [
    {
      title: "계약서 작성",
      description: "부동산 계약서, 사업 계약서 등에서 금액을 한글로 명시할 때 사용",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "회계 업무",
      description: "세금계산서, 영수증, 장부 작성 시 정확한 한글 금액 표기",
      icon: <Calculator className="w-5 h-5" />,
    },
    {
      title: "법무 문서",
      description: "소송, 합의서, 공증 문서에서 금액 오류 방지를 위한 한글 표기",
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      title: "금융 업무",
      description: "대출 신청서, 보험 계약서, 투자 문서의 정확한 금액 표기",
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ]

  const faqData = [
    {
      question: "왜 숫자를 한글로 변환해야 하나요?",
      answer:
        "법적 문서나 중요한 계약서에서는 숫자 조작을 방지하기 위해 한글로도 금액을 명시하는 것이 일반적입니다. 또한 공식 문서에서는 한글 표기가 필수인 경우가 많습니다.",
    },
    {
      question: "최대 얼마까지 변환할 수 있나요?",
      answer:
        "이론적으로는 경(京) 단위까지 변환 가능하지만, 실용적으로는 조(兆) 단위까지 사용하는 것이 일반적입니다. 대부분의 비즈니스 상황에서는 억 단위면 충분합니다.",
    },
    {
      question: "변환 결과가 정확한가요?",
      answer:
        "네, 한국어 숫자 표기법에 따라 정확하게 변환됩니다. 모든 자릿수에서 '일'을 적절히 포함하여 표준 한글 표기법을 따릅니다.",
    },
    {
      question: "모바일에서도 사용할 수 있나요?",
      answer:
        "네, 반응형 디자인으로 제작되어 스마트폰, 태블릿, 데스크톱 모든 기기에서 최적화된 환경으로 사용하실 수 있습니다.",
    },
  ]

  const tips = [
    {
      title: "정확한 표기법",
      content: "한글 숫자 표기 시 '일'은 맨 앞자리가 아닌 이상 생략하지 않습니다. 예: 11 → 일십일",
    },
    {
      title: "법적 효력",
      content: "계약서에서 숫자와 한글을 함께 표기하면 금액 변조를 방지할 수 있어 법적 안전성이 높아집니다.",
    },
    {
      title: "비즈니스 활용",
      content: "견적서, 계약서, 영수증 등 공식 문서에서 한글 금액 표기는 전문성을 높여줍니다.",
    },
    {
      title: "검토 필수",
      content: "중요한 문서 작성 시에는 변환 결과를 반드시 검토하고, 원본 숫자와 대조해보세요.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Calculator className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                숫자 → 한글 변환기
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-4">숫자 금액을 한글로 쉽게 변환해보세요</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary">무료 사용</Badge>
              <Badge variant="secondary">정확한 변환</Badge>
              <Badge variant="secondary">비즈니스 활용</Badge>
            </div>
          </div>

          {/* Main Converter Card */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl text-gray-800">금액 변환</CardTitle>
              <CardDescription className="text-gray-600">숫자를 입력하면 자동으로 한글로 변환됩니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="number-input" className="text-sm font-medium text-gray-700">
                  숫자 입력
                </Label>
                <Input
                  id="number-input"
                  type="text"
                  placeholder="예: 1,234,567"
                  value={number}
                  onChange={handleInputChange}
                  className="text-lg h-12 border-2 focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">빠른 입력</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button variant="outline" size="sm" onClick={() => setExampleAmount("10000")} className="text-xs">
                    1만원
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setExampleAmount("100000")} className="text-xs">
                    10만원
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setExampleAmount("1000000")} className="text-xs">
                    100만원
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setExampleAmount("10000000")} className="text-xs">
                    1천만원
                  </Button>
                </div>
              </div>

              {koreanText && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">한글 변환 결과</Label>
                  <div className="relative">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                      <p className="text-xl font-semibold text-gray-800 break-all">{koreanText}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              )}

              {number && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNumber("")
                    setKoreanText("")
                  }}
                  className="w-full"
                >
                  초기화
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs defaultValue="popular" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="popular">인기 금액</TabsTrigger>
              <TabsTrigger value="business">비즈니스 활용</TabsTrigger>
              <TabsTrigger value="guide">사용 가이드</TabsTrigger>
              <TabsTrigger value="tips">유용한 팁</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="popular" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    자주 변환하는 금액들
                  </CardTitle>
                  <CardDescription>많은 사용자들이 자주 변환하는 금액들을 카테고리별로 정리했습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {popularAmounts.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-lg">{item.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{numberToKorean(Number.parseInt(item.amount))}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setExampleAmount(item.amount)}
                          className="w-full"
                        >
                          변환해보기
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    비즈니스에서의 활용법
                  </CardTitle>
                  <CardDescription>
                    다양한 비즈니스 상황에서 한글 금액 변환기를 어떻게 활용할 수 있는지 알아보세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {businessCases.map((item, index) => (
                      <div key={index} className="flex gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">{item.icon}</div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-3">💡 전문가 추천</h3>
                    <p className="text-gray-700 mb-4">
                      중요한 계약서나 공식 문서에서는 숫자와 한글을 함께 표기하는 것이 좋습니다. 이는 금액 변조를
                      방지하고 법적 분쟁 시 명확한 근거가 됩니다.
                    </p>
                    <p className="text-sm text-gray-600">예시: 금 일천만원정(₩10,000,000)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="guide" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    한국어 숫자 표기법 가이드
                  </CardTitle>
                  <CardDescription>정확한 한글 숫자 표기법을 배워보세요.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">기본 숫자</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                      <div className="p-2 bg-gray-50 rounded text-center">1 → 일</div>
                      <div className="p-2 bg-gray-50 rounded text-center">2 → 이</div>
                      <div className="p-2 bg-gray-50 rounded text-center">3 → 삼</div>
                      <div className="p-2 bg-gray-50 rounded text-center">4 → 사</div>
                      <div className="p-2 bg-gray-50 rounded text-center">5 → 오</div>
                      <div className="p-2 bg-gray-50 rounded text-center">6 → 육</div>
                      <div className="p-2 bg-gray-50 rounded text-center">7 → 칠</div>
                      <div className="p-2 bg-gray-50 rounded text-center">8 → 팔</div>
                      <div className="p-2 bg-gray-50 rounded text-center">9 → 구</div>
                      <div className="p-2 bg-gray-50 rounded text-center">0 → 영</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">단위</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                      <div className="p-2 bg-blue-50 rounded text-center">십 (10)</div>
                      <div className="p-2 bg-blue-50 rounded text-center">백 (100)</div>
                      <div className="p-2 bg-blue-50 rounded text-center">천 (1,000)</div>
                      <div className="p-2 bg-blue-50 rounded text-center">만 (10,000)</div>
                      <div className="p-2 bg-purple-50 rounded text-center">억 (100,000,000)</div>
                      <div className="p-2 bg-purple-50 rounded text-center">조 (1,000,000,000,000)</div>
                      <div className="p-2 bg-purple-50 rounded text-center">경 (10,000,000,000,000,000)</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">표기 예시</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>1,234</span>
                        <span>일천이백삼십사</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>12,345</span>
                        <span>일만이천삼백사십오</span>
                      </div>
                      <div className="flex justify-between p-2 bg-gray-50 rounded">
                        <span>123,456,789</span>
                        <span>일억이천삼백사십오만육천칠백팔십구</span>
                      </div>
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
                  <CardDescription>한글 금액 변환 시 알아두면 좋은 팁들을 정리했습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tips.map((tip, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-semibold text-lg mb-2 text-blue-600">{tip.title}</h3>
                        <p className="text-gray-600 text-sm">{tip.content}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-yellow-800">⚠️ 주의사항</h3>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 중요한 문서 작성 시에는 반드시 결과를 검토하세요</li>
                      <li>• 법적 문서에서는 전문가의 검토를 받는 것이 좋습니다</li>
                      <li>• 큰 금액의 경우 단위 실수가 없는지 확인하세요</li>
                    </ul>
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
                  <CardDescription>사용자들이 자주 묻는 질문과 답변을 정리했습니다.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {faqData.map((faq, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h3 className="font-semibold text-lg mb-2 text-gray-800">Q. {faq.question}</h3>
                        <p className="text-gray-600">{faq.answer}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2 text-blue-800">💬 더 궁금한 점이 있으신가요?</h3>
                    <p className="text-sm text-blue-700">
                      추가 문의사항이 있으시면 언제든지 연락주세요. 더 나은 서비스를 위해 지속적으로 개선하고 있습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer Info */}
          <Card className="mt-8 bg-white/60 backdrop-blur-sm border-0">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="font-semibold text-gray-800 mb-3">🚀 무료로 사용하세요!</h3>
                <p className="text-gray-600 mb-4">
                  이 도구는 완전 무료로 제공됩니다. 회원가입이나 로그인 없이 바로 사용하실 수 있습니다.
                </p>
                <div className="flex justify-center gap-4 text-sm text-gray-500">
                  <span>✓ 무제한 사용</span>
                  <span>✓ 광고 없음</span>
                  <span>✓ 개인정보 수집 없음</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
