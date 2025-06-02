"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { SettingsIcon, Save } from "lucide-react"

export function Settings() {
  const { t, language, setLanguage } = useLanguage()
  const [goldPrices, setGoldPrices] = useState({
    "18": "35.50",
    "21": "41.25",
    "22": "43.80",
    "24": "47.20",
  })
  const [taxRate, setTaxRate] = useState("16")

  const handleSave = () => {
    // Here you would save to PocketBase
    console.log("Settings saved:", { goldPrices, taxRate, language })
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-amber-25 via-white to-yellow-25 min-h-screen">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl shadow-lg">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
          {t("settings")}
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gold Prices */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">{t("goldPrices")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {Object.entries(goldPrices).map(([karat, price]) => (
              <div key={karat} className="space-y-2">
                <Label htmlFor={`karat-${karat}`}>{karat}K Gold (JOD per gram)</Label>
                <Input
                  id={`karat-${karat}`}
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) =>
                    setGoldPrices({
                      ...goldPrices,
                      [karat]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* General Settings */}
        <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold">General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="tax-rate">{t("taxRate")}</Label>
              <Input
                id="tax-rate"
                type="number"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          <Save className="h-4 w-4" />
          {t("save")}
        </Button>
      </div>
    </div>
  )
}
