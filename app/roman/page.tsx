"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RomanPage() {
  // 한글 주석: 입력값, 결과, 복사 상태 관리
  const [romanInput, setRomanInput] = useState("")
  const [romanResult, setRomanResult] = useState("")
  const [romanCopied, setRomanCopied] = useState(false)
  const { toast } = useToast()

  // 숫자를 로마 숫자로 변환하는 함수
  function numberToRoman(num: number): string {
    num = Number(num)
    if (isNaN(num) || num <= 0 || num > 3999) return "1~3999 사이의 숫자만 변환 가능합니다."
    const romanNumerals = [
      [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
      [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
      [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
    ]
    let result = ""
    for (const [value, numeral] of romanNumerals) {
      const v = value as number
      while (num >= v) {
        result += numeral
        num -= v
      }
    }
    return result
  }

  function handleRomanInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^\d]/g, "")
    setRomanInput(value)
    const num = parseInt(value, 10)
    if (!isNaN(num)) setRomanResult(numberToRoman(num))
    else setRomanResult("")
  }

  async function copyRomanResult() {
    if (romanResult && !romanResult.includes("사이의 숫자만")) {
      await navigator.clipboard.writeText(romanResult)
      setRomanCopied(true)
      toast({ title: "복사 완료", description: "로마 숫자가 복사되었습니다." })
      setTimeout(() => setRomanCopied(false), 2000)
    }
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            숫자 → 로마 숫자 변환기
          </CardTitle>
          <CardDescription>숫자를 로마 숫자로 변환합니다. (예: 2024 → MMXXIV)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="roman-input">숫자 입력 (1~3999)</Label>
          <Input id="roman-input" type="text" value={romanInput} onChange={handleRomanInput} placeholder="예: 2024" />
          {romanResult && (
            <div className="relative mt-2">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                <p className="text-xl font-semibold text-gray-800 break-all">{romanResult}</p>
              </div>
              <Button size="sm" variant="outline" onClick={copyRomanResult} className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent">
                {romanCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
} 