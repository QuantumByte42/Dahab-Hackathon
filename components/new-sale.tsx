"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { Calculator, Save } from "lucide-react"

export function NewSale() {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    customer_name: "",
    gold_type: "",
    karat: "",
    weight_grams: "",
    price_per_gram_jod: "",
    payment_method: "",
  })

  const karatOptions = ["18", "21", "22", "24"]
  const goldTypes = [
    { en: "Ring", ar: "خاتم" },
    { en: "Necklace", ar: "سلسلة" },
    { en: "Bracelet", ar: "سوار" },
    { en: "Earrings", ar: "أقراط" },
    { en: "Pendant", ar: "دلاية" },
  ]

  const calculateTotal = () => {
    const weight = Number.parseFloat(formData.weight_grams) || 0
    const pricePerGram = Number.parseFloat(formData.price_per_gram_jod) || 0
    return (weight * pricePerGram).toFixed(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would submit to PocketBase
    console.log("Sale data:", {
      ...formData,
      total_price_jod: calculateTotal(),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calculator className="h-6 w-6" />
        <h1 className="text-3xl font-bold">{t("newSale")}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gold Item Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("goldItemDetails")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gold_type">{t("goldType")}</Label>
                <Select
                  value={formData.gold_type}
                  onValueChange={(value) => setFormData({ ...formData, gold_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`${t("goldType")}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {goldTypes.map((type, index) => (
                      <SelectItem key={index} value={isRTL ? type.ar : type.en}>
                        {isRTL ? type.ar : type.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="karat">{t("karat")}</Label>
                <Select value={formData.karat} onValueChange={(value) => setFormData({ ...formData, karat: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder={`${t("karat")}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {karatOptions.map((karat) => (
                      <SelectItem key={karat} value={karat}>
                        {karat}K
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">{t("weight")}</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  value={formData.weight_grams}
                  onChange={(e) => setFormData({ ...formData, weight_grams: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price_per_gram">{t("pricePerGram")}</Label>
                <Input
                  id="price_per_gram"
                  type="number"
                  step="0.01"
                  value={formData.price_per_gram_jod}
                  onChange={(e) => setFormData({ ...formData, price_per_gram_jod: e.target.value })}
                  placeholder="0.00"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t("totalPrice")}:</span>
                  <span className="text-2xl font-bold text-primary">
                    {calculateTotal()} {isRTL ? "د.أ" : "JOD"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer & Payment */}
          <Card>
            <CardHeader>
              <CardTitle>{t("customer")} & Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">{t("customerName")}</Label>
                <Input
                  id="customer_name"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  placeholder={t("customerName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_method">{t("paymentMethod")}</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`${t("paymentMethod")}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">{t("cash")}</SelectItem>
                    <SelectItem value="card">{t("card")}</SelectItem>
                    <SelectItem value="deferred">{t("deferred")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">
            {t("cancel")}
          </Button>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            {t("completeSale")}
          </Button>
        </div>
      </form>
    </div>
  )
}
