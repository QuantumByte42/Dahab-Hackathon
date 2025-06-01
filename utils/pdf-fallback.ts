// utils/pdf-fallback.ts
// Fallback PDF generation utility with multiple approaches

export const generatePDFWithFallback = async (element: HTMLElement, filename: string): Promise<boolean> => {
  // Approach 1: Try dynamic imports (works with standard webpack)
  try {
    console.log('Attempting PDF generation with dynamic imports...')
    
    const [html2canvasModule, jsPDFModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf')
    ])

    const html2canvas = html2canvasModule.default
    const jsPDF = jsPDFModule.default

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      allowTaint: false,
      logging: false,
      height: element.scrollHeight,
      width: element.scrollWidth,
      foreignObjectRendering: false,
    })

    const imgData = canvas.toDataURL('image/png', 1.0)
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    pdf.save(`${filename}.pdf`)
    console.log('PDF generated successfully with dynamic imports')
    return true

  } catch (error) {
    console.warn('Dynamic import approach failed:', error)
  }

  // Approach 2: Try global window objects (if libraries are loaded via CDN or other means)
  try {
    console.log('Attempting PDF generation with global objects...')
    
    const html2canvas = (window as any).html2canvas
    const jsPDF = (window as any).jspdf?.jsPDF || (window as any).jsPDF

    if (html2canvas && jsPDF) {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/png', 1.0)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`${filename}.pdf`)
      console.log('PDF generated successfully with global objects')
      return true
    }
  } catch (error) {
    console.warn('Global object approach failed:', error)
  }

  // Approach 3: Show helpful error message with alternatives
  console.error('All PDF generation approaches failed')
  
  const alternatives = [
    '1. Right-click on this page and select "Print"',
    '2. In the print dialog, choose "Save as PDF"',
    '3. Or take a screenshot for your records',
    '4. Try refreshing the page and trying again'
  ].join('\n')

  alert(
    'PDF download is temporarily unavailable.\n\n' +
    'Alternative options:\n' + alternatives
  )

  return false
}

export default generatePDFWithFallback
