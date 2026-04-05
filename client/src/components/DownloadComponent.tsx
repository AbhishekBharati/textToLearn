import { IconDownload } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { useState } from 'react';

export const DownloadComponent = () => {
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const isLessonPage = location.pathname.startsWith('/lessons/');

  const handleDownload = async () => {
    if (!isLessonPage) {
      alert("Please go to a lesson to download it as PDF.");
      return;
    }

    const element = document.getElementById('lesson-content');
    if (!element) {
      alert("Lesson content not found.");
      return;
    }

    try {
      setIsGenerating(true);
      
      const isDarkMode = document.documentElement.classList.contains('dark');
      
      // Temporarily adjust styles for a clean, wide capture
      const originalWidth = element.style.width;
      const originalMaxWidth = element.style.maxWidth;
      const originalOverflow = element.style.overflow;
      
      // Standardize to a desktop-like width for the capture
      element.style.width = '1200px';
      element.style.maxWidth = '1200px';
      element.style.overflow = 'visible';

      const dataUrl = await toPng(element, {
        cacheBust: true,
        backgroundColor: isDarkMode ? "#171717" : "#ffffff",
        style: {
          margin: '0',
          padding: '60px',
          borderRadius: '0',
        }
      });

      // Instantly restore original styles
      element.style.width = originalWidth;
      element.style.maxWidth = originalMaxWidth;
      element.style.overflow = originalOverflow;

      // Create a virtual image to get the true captured dimensions
      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = img.width;
      const imgHeight = img.height;
      
      const finalImgWidth = pdfWidth;
      const finalImgHeight = (imgHeight * pdfWidth) / imgWidth;

      let heightLeft = finalImgHeight;
      let position = 0;

      // Add the first page
      pdf.addImage(dataUrl, 'PNG', 0, position, finalImgWidth, finalImgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages if needed
      while (heightLeft > 0) {
        position -= pdfHeight; 
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', 0, position, finalImgWidth, finalImgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save(`lesson-${Date.now()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isGenerating}
      className={`p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${!isLessonPage ? 'opacity-30 cursor-not-allowed' : 'dark:text-white cursor-pointer'}`}
      title={isLessonPage ? "Download Lesson as PDF" : "Only available on lesson pages"}
    >
      {isGenerating ? (
        <div className="h-5 w-5 border-2 border-neutral-400 border-t-neutral-800 dark:border-t-white rounded-full animate-spin" />
      ) : (
        <IconDownload stroke={2} size={20} />
      )}
    </button>
  )
}
