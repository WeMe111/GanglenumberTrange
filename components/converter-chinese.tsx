"use client"
import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// 한자 변환기 클라이언트 컴포넌트
export function ConverterChinese() {
  // 입력값, 결과, 복사 상태 관리
  const [chineseNumber, setChineseNumber] = useState("")
  const [chineseText, setChineseText] = useState("")
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  // 숫자 → 한자 변환 함수
  function numberToChinese(num: number): string {
    if (num === 0) return "零"
    const digits = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
    const units = ["", "十", "百", "千"]
    const bigUnits = ["", "万", "億", "兆"]
    function convertGroup(n: number): string {
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

  // 입력값 변경 핸들러
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const cleanValue = e.target.value.replace(/[^\d,]/g, "")
    setChineseNumber(cleanValue)
    const numericValue = Number.parseInt(cleanValue.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue >= 0) {
      setChineseText(numberToChinese(numericValue))
    } else {
      setChineseText("")
    }
  }

  // 복사 버튼 핸들러
  async function copyToClipboard() {
    if (chineseText) {
      await navigator.clipboard.writeText(chineseText)
      setCopied(true)
      toast({ title: "복사 완료", description: "한자 변환 결과가 복사되었습니다." })
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 예시 금액 버튼 핸들러
  function setExampleAmount(amount: string) {
    setChineseNumber(amount)
    const numericValue = Number.parseInt(amount.replace(/,/g, ""))
    if (!isNaN(numericValue) && numericValue >= 0) {
      setChineseText(numberToChinese(numericValue))
    } else {
      setChineseText("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chinese-input" className="text-sm font-medium text-gray-700">
          숫자 입력
        </Label>
        <Input
          id="chinese-input"
          type="text"
          placeholder="예: 12345"
          value={chineseNumber}
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
      {chineseText && (
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">한자 변환 결과</Label>
          <div className="relative">
            <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border-2 border-green-100">
              <p className="text-2xl font-bold text-gray-800 break-all">{chineseText}</p>
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
      {chineseNumber && (
        <Button
          variant="outline"
          onClick={() => {
            setChineseNumber("")
            setChineseText("")
          }}
          className="w-full"
        >
          초기화
        </Button>
      )}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">한자 숫자</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div>1 = 一</div>
          <div>2 = 二</div>
          <div>3 = 三</div>
          <div>4 = 四</div>
          <div>5 = 五</div>
          <div>6 = 六</div>
          <div>7 = 七</div>
          <div>8 = 八</div>
          <div>9 = 九</div>
          <div>10 = 十</div>
        </div>
      </div>
    </div>
  )
} 