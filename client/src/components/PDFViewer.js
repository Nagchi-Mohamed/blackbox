import { useEffect, useRef } from 'react';

export default function PDFViewer({ url }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.src = url;
    }
  }, [url]);

  return (
    <iframe
      ref={iframeRef}
      title="PDF Viewer"
      width="100%"
      height="600px"
      style={{ border: 'none' }}
    />
  );
}
