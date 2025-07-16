"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 로마 숫자 변환기 클라이언트 컴포넌트
export function ConverterRoman() {
  // 입력값, 결과, 복사 상태 관리
  const [romanNumber, setRomanNumber] = useState("")
  const [romanText, setRomanText] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // 숫자 → 로마 숫자 변환 함수
  function numberToRoman(num: number): string {
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

  // 입력값 변경 핸들러
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanValue = e.target.value.replace(/[^\d,]/g, "")
    setRomanNumber(cleanValue)
    const numericValue = Number.parseInt(cleanValue.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue > 0) {
      setRomanText(numberToRoman(numericValue))
    } else {
      setRomanText("")
    }
  }

  // 복사 버튼 핸들러
  async function copyToClipboard() {
    if (romanText) {
      await navigator.clipboard.writeText(romanText)
      setCopied(true)
      toast({ title: "복사 완료", description: "로마 숫자가 복사되었습니다." })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 예시 금액 버튼 핸들러
  function setExampleAmount(amount: string) {
    setRomanNumber(amount)
    const numericValue = Number.parseInt(amount.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue > 0) {
      setRomanText(numberToRoman(numericValue))
    } else {
      setRomanText("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="roman-input" className="text-sm font-medium text-gray-700">
          숫자 입력
        </Label>
        <Input
          id="roman-input"
          type="text"
          placeholder="예: 1994"
          value={romanNumber}
          onChange={handleInputChange}
          className="text-lg h-12 border-2 focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm font-medium text-gray-700">빠른 입력</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("1")} className="text-xs">1</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("100")} className="text-xs">100</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("500")} className="text-xs">500</Button>
          <Button variant="outline" size="sm" onClick={() => setExampleAmount("1000")} className="text-xs">1000</Button>
        </div>
      </div>
      {romanText && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">로마 숫자 변환 결과</Label>
          <div className="relative">
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border-2 border-red-100">
              <p className="text-2xl font-bold text-gray-800 break-all font-serif">{romanText}</p>
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
      {romanNumber && (
        <Button
          variant="outline"
          onClick={() => {
            setRomanNumber("")
            setRomanText("")
          }}
          className="w-full"
        >
          초기화
        </Button>
      )}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">로마 숫자 기호</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          <div>I = 1</div>
          <div>V = 5</div>
          <div>X = 10</div>
          <div>L = 50</div>
          <div>C = 100</div>
          <div>D = 500</div>
          <div>M = 1000</div>
        </div>
      </div>
    </div>
  )
} 