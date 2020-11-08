import React from 'react'
import Routes from './routes'
import { ToastContainer } from 'react-toastify'

import GlobalStyle from './styles/global'

const App: React.FC = () => {
  return (
    <>
      <Routes />
      <GlobalStyle />
      <ToastContainer autoClose={3000} hideProgressBar={true} />
    </>
  )
}

export default App
