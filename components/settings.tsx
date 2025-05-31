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
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("settings")}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Gold Prices */}
        <Card>
          <CardHeader>
            <CardTitle>{t("goldPrices")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="language">{t("language")}</Label>
              <Select value={language} onValueChange={(value: "en" | "ar") => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("english")}</SelectItem>
                  <SelectItem value="ar">{t("arabic")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="gap-2">
          <Save className="h-4 w-4" />
          {t("save")}
        </Button>
      </div>
    </div>
  )
}
