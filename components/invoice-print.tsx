// Invoice Print Component for PDF generation and printing
"use client"

import React, { useRef, forwardRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Printer, AlertCircle } from 'lucide-react'
import { generatePDFWithFallback } from '@/utils/pdf-fallback'

interface InvoiceItem {
  item_id: string
  item_name: string
  type: string
  weight: number
  karat: string
  selling_price: number
  making_charges: number
  quantity: number
}

interface InvoiceData {
  invoiceNumber: string
  date: string
  customerName: string
  customerPhone?: string
  items: InvoiceItem[]
  subtotal: number
  makingCharges: number
  totalAmount: number
  paymentMethod: string
}

interface InvoicePrintProps {
  invoiceData: InvoiceData
  onPrint?: () => void
  onDownloadPDF?: () => void
}

// Printable Invoice Component
const PrintableInvoice = forwardRef<HTMLDivElement, { invoiceData: InvoiceData }>(
  ({ invoiceData }, ref) => {
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto" style={{ fontFamily: 'Arial, sans-serif' }}>
        {/* Header */}
        <div className="border-b-2 border-gold-500 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">DAHAB GOLD STORE</h1>
              <p className="text-gray-600">Premium Gold Jewelry & Accessories</p>
              <p className="text-sm text-gray-500 mt-1">
                📍 Amman, Jordan | 📞 +962-XX-XXXXXXX | 📧 info@dahabgold.com
              </p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">INVOICE</h2>
              <p className="text-sm text-gray-600">
                <strong>Invoice #:</strong> {invoiceData.invoiceNumber}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong> {new Date(invoiceData.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Bill To:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-medium text-gray-800">{invoiceData.customerName}</p>
            {invoiceData.customerPhone && (
              <p className="text-gray-600">Phone: {invoiceData.customerPhone}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">Payment Method: {invoiceData.paymentMethod}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Item ID</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Description</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Type</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Weight (g)</th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold">Karat</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-semibold">Qty</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Unit Price</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Making</th>
                <th className="border border-gray-300 px-3 py-2 text-right text-sm font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-3 py-2 text-sm font-mono">{item.item_id}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.item_name}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.type}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.weight.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm">{item.karat}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-center">{item.quantity}</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-right">{item.selling_price.toFixed(2)} JOD</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-right">{item.making_charges.toFixed(2)} JOD</td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-right font-medium">
                    {((item.selling_price + item.making_charges) * item.quantity).toFixed(2)} JOD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-6">
          <div className="w-80">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">{invoiceData.subtotal.toFixed(2)} JOD</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-gray-600">Making Charges:</span>
                <span className="font-medium">{invoiceData.makingCharges.toFixed(2)} JOD</span>
              </div>
              <div className="border-t border-gray-300 mt-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-lg font-bold text-gray-800">{invoiceData.totalAmount.toFixed(2)} JOD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-4 mt-8">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">Thank you for shopping with Dahab Gold Store!</p>
            <p>For questions about this invoice, please contact us at info@dahabgold.com</p>
            <p className="mt-4 font-medium">All items are guaranteed for authenticity and quality.</p>
          </div>
        </div>

        {/* Print-only styles */}
        <style jsx>{`
          @media print {
            body { margin: 0; }
            .no-print { display: none !important; }
            .print-page-break { page-break-before: always; }
          }
        `}</style>
      </div>
    )
  }
)

PrintableInvoice.displayName = 'PrintableInvoice'

// Main Invoice Print Component
export function InvoicePrint({ invoiceData, onPrint, onDownloadPDF }: InvoicePrintProps) {
  const invoiceRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    if (invoiceRef.current) {
      const printWindow = window.open('', '_blank')
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Invoice ${invoiceData.invoiceNumber}</title>
              <meta charset="utf-8">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif; 
                  background: white;
                }
                @media print { 
                  body { margin: 0; padding: 0; } 
                  .no-print { display: none !important; }
                }
                table { border-collapse: collapse; }
                .border { border: 1px solid #d1d5db; }
                .bg-gray-50 { background-color: #f9fafb; }
                .bg-gray-100 { background-color: #f3f4f6; }
                .text-center { text-align: center; }
                .text-right { text-align: right; }
                .text-left { text-align: left; }
                .font-bold { font-weight: bold; }
                .font-semibold { font-weight: 600; }
                .font-medium { font-weight: 500; }
                .text-lg { font-size: 1.125rem; }
                .text-sm { font-size: 0.875rem; }
                .text-2xl { font-size: 1.5rem; }
                .text-3xl { font-size: 1.875rem; }
                .p-2 { padding: 0.5rem; }
                .p-3 { padding: 0.75rem; }
                .p-4 { padding: 1rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .mb-2 { margin-bottom: 0.5rem; }
                .mb-3 { margin-bottom: 0.75rem; }
                .mb-6 { margin-bottom: 1.5rem; }
                .mt-1 { margin-top: 0.25rem; }
                .mt-2 { margin-top: 0.5rem; }
                .mt-4 { margin-top: 1rem; }
                .mt-8 { margin-top: 2rem; }
                .pt-2 { padding-top: 0.5rem; }
                .pt-4 { padding-top: 1rem; }
                .pb-6 { padding-bottom: 1.5rem; }
                .w-full { width: 100%; }
                .max-w-4xl { max-width: 56rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .flex { display: flex; }
                .justify-between { justify-content: space-between; }
                .justify-end { justify-content: flex-end; }
                .items-start { align-items: flex-start; }
                .rounded-lg { border-radius: 0.5rem; }
                .border-t { border-top: 1px solid #d1d5db; }
                .border-b-2 { border-bottom: 2px solid #d97706; }
                .text-gray-500 { color: #6b7280; }
                .text-gray-600 { color: #4b5563; }
                .text-gray-800 { color: #1f2937; }
                .font-mono { font-family: ui-monospace, SFMono-Regular, "SF Mono", monospace; }
              </style>
            </head>
            <body>
              ${invoiceRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
        printWindow.close()
      }
    }
    onPrint?.()
  }

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) {
      console.error('Invoice reference not available')
      return
    }

    const success = await generatePDFWithFallback(
      invoiceRef.current, 
      `dahab-invoice-${invoiceData.invoiceNumber}`
    )

    if (success) {
      onDownloadPDF?.()
    }
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="no-print flex gap-2 justify-end mb-4">
        <Button onClick={handlePrint} variant="outline" className="gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
        <Button 
          onClick={handleDownloadPDF} 
          className="gap-2"
          title="Download as PDF"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      {/* Printable Invoice */}
      <PrintableInvoice ref={invoiceRef} invoiceData={invoiceData} />
    </div>
  )
}

export default InvoicePrint
