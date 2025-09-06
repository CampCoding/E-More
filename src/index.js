import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import {
  measurePerformance,
  monitorResourceTiming,
  trackErrors
} from './utils/performanceMonitoring';
// import { setupContentProtection } from './utils/setupProtection';

// Initialize performance monitoring
measurePerformance();
monitorResourceTiming();
trackErrors();

// Initialize content protection against IDM
if (typeof window !== 'undefined') {
  // setupContentProtection();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

// Report web vitals
reportWebVitals(console.log);
