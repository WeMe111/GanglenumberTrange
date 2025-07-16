"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Copy, Check, Calculator } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function HanjaPage() {
  // 한글 주석: 입력값, 결과, 복사 상태 관리
  const [hanjaInput, setHanjaInput] = useState("")
  const [hanjaResult, setHanjaResult] = useState("")
  const [hanjaCopied, setHanjaCopied] = useState(false)
  const { toast } = useToast()

  // 숫자를 한자로 변환하는 함수
  function numberToHanja(num: number): string {
    if (isNaN(num) || num < 0) return "0 이상의 숫자만 변환 가능합니다."
    const digits = ["영", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
    const units = ["", "十", "百", "千", "萬", "億", "兆", "京"]
    if (num === 0) return digits[0]
    let result = ""
    let str = String(num)
    let len = str.length
    for (let i = 0; i < len; i++) {
      const digit = parseInt(str[i], 10)
      if (digit !== 0) {
        result += digits[digit] + (units[len - i - 1] || "")
      }
    }
    return result
  }

  function handleHanjaInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/[^\d]/g, "")
    setHanjaInput(value)
    const num = parseInt(value, 10)
    if (!isNaN(num)) setHanjaResult(numberToHanja(num))
    else setHanjaResult("")
  }

  async function copyHanjaResult() {
    if (hanjaResult && !hanjaResult.includes("변환 가능")) {
      await navigator.clipboard.writeText(hanjaResult)
      setHanjaCopied(true)
      toast({ title: "복사 완료", description: "한자 변환 결과가 복사되었습니다." })
      setTimeout(() => setHanjaCopied(false), 2000)
    }
  }

  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            숫자 → 한자 변환기
          </CardTitle>
          <CardDescription>숫자를 한자로 변환합니다. (예: 1234 → 一千二百三十四)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label htmlFor="hanja-input">숫자 입력</Label>
          <Input id="hanja-input" type="text" value={hanjaInput} onChange={handleHanjaInput} placeholder="예: 1234" />
          {hanjaResult && (
            <div className="relative mt-2">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-100">
                <p className="text-xl font-semibold text-gray-800 break-all">{hanjaResult}</p>
              </div>
              <Button size="sm" variant="outline" onClick={copyHanjaResult} className="absolute top-2 right-2 h-8 w-8 p-0 bg-transparent">
                {hanjaCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
} 