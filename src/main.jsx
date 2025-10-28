import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./assets/css/tailwind.css"
import { BrowserRouter, Route, Routes } from 'react-router'
import { Provider } from 'react-redux'
import store from './store/index.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
        </Routes>
      </BrowserRouter>,
    </Provider>
  </StrictMode>,
)
