import React from 'react';
import { useTranslation } from 'react-i18next';

const DownloadButton = ({ lessonId }) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    window.open(`/api/pdf/${lessonId}`, '_blank');
  };

  return (
    <button onClick={handleDownload} className="pdf-download-btn">
      {t('pdf.download')} ({t('pdf.size')}: {Math.round(pdfSize / 1024)} KB)
    </button>
  );
};

export default DownloadButton;