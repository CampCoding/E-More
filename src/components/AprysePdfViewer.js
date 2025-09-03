import React from 'react';
import { RPProvider, RPDefaultLayout, RPPages, RPConfig } from '@pdf-viewer/react'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

const PDFViewer = ({ pdfUrl }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <div style={{ height: '100vh' }}>
      <RPConfig>
        <RPProvider src={pdfUrl}>
          <RPDefaultLayout style={{ height: '660px' }}>
            <RPPages />
          </RPDefaultLayout>
        </RPProvider>
      </RPConfig>
    </div>
  );
};

export default PDFViewer;
