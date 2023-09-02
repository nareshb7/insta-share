import React from "react";
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import App from "./App";
import './index.scss'

const rootEl : HTMLElement | null = document.getElementById('root')
if (rootEl) {
    const root = createRoot(rootEl)
    root.render(<BrowserRouter><App/></BrowserRouter> )
}
