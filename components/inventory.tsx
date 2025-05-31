"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useLanguage } from "@/contexts/language-context"
import { Package, Plus, Search, Edit, Trash2 } from "lucide-react"

// Mock inventory data
const mockInventory = [
  {
    id: "1",
    name: "خاتم ذهب كلاسيكي",
    type: "خاتم",
    karat: 21,
    weight_grams: 5.2,
    cost_price_jod: 180.0,
    selling_price_jod: 220.0,
    quantity: 12,
  },
  {
    id: "2",
    name: "سلسلة ذهب فاخرة",
    type: "سلسلة",
    karat: 18,
    weight_grams: 8.5,
    cost_price_jod: 280.0,
    selling_price_jod: 350.0,
    quantity: 8,
  },
  {
    id: "3",
    name: "أقراط ذهب مرصعة",
    type: "أقراط",
    karat: 22,
    weight_grams: 3.8,
    cost_price_jod: 150.0,
    selling_price_jod: 190.0,
    quantity: 15,
  },
]

export function Inventory() {
  const { t, isRTL } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [inventory] = useState(mockInventory)

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6" />
          <h1 className="text-3xl font-bold">{t("inventory")}</h1>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("addNewItem")}
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`${t("search")} ${t("inventory")}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("itemName")}</TableHead>
                <TableHead>{t("goldType")}</TableHead>
                <TableHead>{t("karat")}</TableHead>
                <TableHead>{t("weight")}</TableHead>
                <TableHead>{t("costPrice")}</TableHead>
                <TableHead>{t("sellingPrice")}</TableHead>
                <TableHead>{t("quantity")}</TableHead>
                <TableHead>{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.karat}K</Badge>
                  </TableCell>
                  <TableCell>{item.weight_grams}g</TableCell>
                  <TableCell>
                    {item.cost_price_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    {item.selling_price_jod.toFixed(2)} {isRTL ? "د.أ" : "JOD"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.quantity < 5 ? "destructive" : "default"}>{item.quantity}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
