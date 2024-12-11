import React, { useEffect } from 'react'

const Layout = ({ children }) => {
    const html = document.querySelector('html');
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        if (theme) {
          html.dataset.theme = theme;
        }
      }, []);
  return (
    <div className="layout">
        <main className="main-content">
          {children}
        </main>
    </div>
  )
}

export default Layout