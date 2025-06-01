// PDF Test Data Generator for Dahab Gold Store
// Generates sample data for testing PDF invoice functionality

export const generateTestInvoiceData = () => {
  const now = new Date();
  const invoiceNumber = `TEST-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  return {
    id: invoiceNumber,
    invoice_number: invoiceNumber,
    customer_name: "Test Customer",
    customer_phone: "+1 (555) 123-4567",
    customer_address: "123 Test Street, Test City, TS 12345",
    transaction_type: "Sale",
    total_amount: 2750.00,
    payment_method: "Cash",
    created: now.toISOString(),
    items: [
      {
        item_id: "RING-001",
        item_name: "22K Gold Wedding Ring",
        type: "Ring",
        weight: 5.5,
        karat: "22K",
        selling_price: 450.00,
        making_charges: 50.00,
        quantity: 1,
        total: 500.00
      },
      {
        item_id: "NECK-002",
        item_name: "24K Gold Chain Necklace",
        type: "Necklace", 
        weight: 12.0,
        karat: "24K",
        selling_price: 980.00,
        making_charges: 120.00,
        quantity: 1,
        total: 1100.00
      },
      {
        item_id: "EAR-003",
        item_name: "18K Gold Diamond Earrings",
        type: "Earrings",
        weight: 3.2,
        karat: "18K",
        selling_price: 280.00,
        making_charges: 40.00,
        quantity: 2,
        total: 640.00
      },
      {
        item_id: "BRAC-004",
        item_name: "22K Gold Tennis Bracelet",
        type: "Bracelet",
        weight: 8.0,
        karat: "22K",
        selling_price: 420.00,
        making_charges: 90.00,
        quantity: 1,
        total: 510.00
      }
    ],
    notes: "Thank you for choosing Dahab Gold Store! All items come with a 1-year warranty and authenticity certificate."
  };
};

export const generateTestSaleItems = () => {
  return [
    {
      item_id: "RING-001",
      item_name: "22K Gold Wedding Ring",
      type: "Ring",
      weight: 5.5,
      karat: "22K",
      selling_price: 450.00,
      making_charges: 50.00,
      quantity: 1
    },
    {
      item_id: "NECK-002", 
      item_name: "24K Gold Chain Necklace",
      type: "Necklace",
      weight: 12.0,
      karat: "24K",
      selling_price: 980.00,
      making_charges: 120.00,
      quantity: 1
    },
    {
      item_id: "EAR-003",
      item_name: "18K Gold Diamond Earrings", 
      type: "Earrings",
      weight: 3.2,
      karat: "18K",
      selling_price: 280.00,
      making_charges: 40.00,
      quantity: 2
    },
    {
      item_id: "BRAC-004",
      item_name: "22K Gold Tennis Bracelet",
      type: "Bracelet", 
      weight: 8.0,
      karat: "22K",
      selling_price: 420.00,
      making_charges: 90.00,
      quantity: 1
    }
  ];
};

export const testPDFGeneration = async () => {
  console.log('🧪 Starting PDF Generation Test');
  
  try {
    // Import the PDF fallback utility
    const { generatePDFWithFallback } = await import('./pdf-fallback');
    
    // Find the invoice element on the page
    const invoiceElement = document.querySelector('[data-testid="invoice-print"]') || 
                          document.querySelector('.invoice-container') ||
                          document.querySelector('#invoice-print');
    
    if (!invoiceElement) {
      console.error('❌ Invoice element not found on page');
      return false;
    }
    
    console.log('✅ Invoice element found, generating PDF...');
    
    const filename = `test-invoice-${new Date().getTime()}.pdf`;
    const success = await generatePDFWithFallback(invoiceElement as HTMLElement, filename);
    
    if (success) {
      console.log('✅ PDF generated successfully!');
      alert('✅ PDF generated and downloaded successfully!');
    } else {
      console.error('❌ PDF generation failed');
      alert('❌ PDF generation failed. Check console for details.');
    }
    
    return success;
    
  } catch (error) {
    console.error('❌ PDF test failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    alert(`❌ PDF test failed: ${errorMessage}`);
    return false;
  }
};

// Auto-test function for browser console
if (typeof window !== 'undefined') {
  (window as typeof window & { dahab_pdf_test?: object }).dahab_pdf_test = {
    generateTestData: generateTestInvoiceData,
    generateTestItems: generateTestSaleItems,
    testPDF: testPDFGeneration
  };
  
  console.log('🔧 Dahab PDF Test utilities loaded:');
  console.log('   window.dahab_pdf_test.generateTestData() - Generate test invoice data');
  console.log('   window.dahab_pdf_test.generateTestItems() - Generate test sale items');
  console.log('   window.dahab_pdf_test.testPDF() - Test PDF generation');
}

const pdfTestUtils = {
  generateTestInvoiceData,
  generateTestSaleItems,
  testPDFGeneration
};

export default pdfTestUtils;
