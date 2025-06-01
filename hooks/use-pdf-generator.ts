// hooks/use-pdf-generator.ts
// Custom hook for PDF generation with enhanced error handling and Turbopack compatibility

import { useCallback } from 'react'

interface PDFGeneratorOptions {
  scale?: number
  format?: 'a4' | 'letter'
  orientation?: 'portrait' | 'landscape'
  filename?: string
}

interface UsePDFGeneratorReturn {
  generatePDF: (element: HTMLElement, options?: PDFGeneratorOptions) => Promise<boolean>
  isSupported: boolean
}

export const usePDFGenerator = (): UsePDFGeneratorReturn => {
  const isSupported = typeof window !== 'undefined'

  const generatePDF = useCallback(async (
    element: HTMLElement, 
    options: PDFGeneratorOptions = {}
  ): Promise<boolean> => {
    if (!element || !isSupported) {
      console.error('PDF generation not supported or element not provided')
      return false
    }

    const {
      scale = 2,
      format = 'a4',
      orientation = 'portrait',
      filename = 'document.pdf'
    } = options

    try {
      // Enhanced dynamic import strategy for Turbopack compatibility
      let html2canvas: any, jsPDF: any

      try {
        // Method 1: Try standard dynamic import with proper error handling
        console.log('Attempting to load PDF libraries...')
        
        const importPromises = await Promise.allSettled([
          import('html2canvas').then(module => ({
            success: true,
            module: module.default || module
          })),
          import('jspdf').then(module => ({
            success: true,
            module: module.default || module
          }))
        ])

        const html2canvasResult = importPromises[0]
        const jsPDFResult = importPromises[1]

        if (html2canvasResult.status === 'fulfilled' && html2canvasResult.value.success) {
          html2canvas = html2canvasResult.value.module
        } else {
          throw new Error(`html2canvas import failed: ${html2canvasResult.status === 'rejected' ? html2canvasResult.reason : 'Unknown error'}`)
        }

        if (jsPDFResult.status === 'fulfilled' && jsPDFResult.value.success) {
          jsPDF = jsPDFResult.value.module
        } else {
          throw new Error(`jsPDF import failed: ${jsPDFResult.status === 'rejected' ? jsPDFResult.reason : 'Unknown error'}`)
        }

      } catch (importError) {
        console.warn('Dynamic import failed, trying alternative approach:', importError)
        
        // Method 2: Check if libraries are already loaded globally
        if (typeof window !== 'undefined') {
          html2canvas = (window as any).html2canvas
          jsPDF = (window as any).jspdf?.jsPDF || (window as any).jsPDF
        }

        if (!html2canvas || !jsPDF) {
          throw new Error('PDF libraries could not be loaded via any method')
        }
      }

      if (!html2canvas || !jsPDF) {
        throw new Error('PDF libraries are not available')
      }

      console.log('PDF libraries loaded successfully')

      // Generate high-quality canvas
      const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: false,
        logging: false,
        height: element.scrollHeight,
        width: element.scrollWidth,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        removeContainer: true,
        // Add these options for better Turbopack compatibility
        foreignObjectRendering: false,
        imageTimeout: 15000,
      })

      console.log('Canvas generated successfully')

      // Calculate dimensions based on format
      const formatDimensions = {
        a4: { width: 210, height: 297 },
        letter: { width: 216, height: 279 }
      }

      const { width: pageWidth, height: pageHeight } = formatDimensions[format]
      const pdf = new jsPDF(orientation, 'mm', format)

      const imgData = canvas.toDataURL('image/png', 1.0)
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      let heightLeft = imgHeight
      let position = 0

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pageHeight

      // Add additional pages if content exceeds one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST')
        heightLeft -= pageHeight
      }

      // Save with proper filename
      const finalFilename = filename.endsWith('.pdf') ? filename : `${filename}.pdf`
      pdf.save(finalFilename)

      console.log('PDF generated and downloaded successfully')
      return true

    } catch (error) {
      console.error('PDF generation failed:', error)
      
      // Enhanced error reporting
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (errorMessage.includes('chunk') || errorMessage.includes('module')) {
        console.warn('Turbopack dynamic import issue detected. This is a known limitation.')
      } else if (errorMessage.includes('timeout')) {
        console.warn('PDF library loading timed out - network might be slow')
      } else if (errorMessage.includes('import')) {
        console.warn('PDF libraries could not be loaded - check network connection')
      }
      
      return false
    }
  }, [isSupported])

  return {
    generatePDF,
    isSupported
  }
}

export default usePDFGenerator
