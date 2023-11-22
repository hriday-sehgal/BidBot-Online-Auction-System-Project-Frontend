import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AuthProvider } from './components/AuthContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
const renderApp = (darkMode) => {
root.render(
  <React.StrictMode>
    <AuthProvider>
    <div className={darkMode ? 'dark-mode' : ''}>
    <App />
    </div>
    </AuthProvider>
  </React.StrictMode>
);
};

// Initially, render the app with dark mode set to false
renderApp(false);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
