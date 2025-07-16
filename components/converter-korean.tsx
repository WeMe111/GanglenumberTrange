"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Props {
  initialValue?: string
}

// 숫자 → 한글 변환기 클라이언트 컴포넌트
export function ConverterKorean({ initialValue = "" }: Props) {
  // 입력값, 결과, 복사 상태 관리
  const [number, setNumber] = useState(initialValue)
  const [koreanText, setKoreanText] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // 숫자 → 한글 변환 함수
  function numberToKorean(num: number): string {
    if (num === 0) return "영원"
    const units = ["", "만", "억", "조", "경"]
    const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"]
    const tens = ["", "십", "백", "천"]
    function convertGroup(n: number): string {
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

  // 입력값 변경 핸들러
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanValue = e.target.value.replace(/[^\d,]/g, "")
    setNumber(cleanValue)
    const numericValue = Number.parseInt(cleanValue.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue >= 0) {
      setKoreanText(numberToKorean(numericValue))
    } else {
      setKoreanText("")
    }
  }

  // 복사 버튼 핸들러
  async function copyToClipboard() {
    if (koreanText) {
      await navigator.clipboard.writeText(koreanText)
      setCopied(true)
      toast({ title: "복사 완료", description: "한글 금액이 클립보드에 복사되었습니다." })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 예시 금액 버튼 핸들러
  function setExampleAmount(amount: string) {
    setNumber(amount)
    const numericValue = Number.parseInt(amount.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue >= 0) {
      setKoreanText(numberToKorean(numericValue))
    } else {
      setKoreanText("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="korean-input" className="text-sm font-medium text-gray-700">
          숫자 입력
        </Label>
        <Input
          id="korean-input"
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
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("10000")} className="text-xs">1만원</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("100000")} className="text-xs">10만원</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("1000000")} className="text-xs">100만원</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("10000000")} className="text-xs">1천만원</Button>
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
    </div>
  )
} 