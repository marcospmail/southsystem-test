import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

const renderInsideBrowserRouter = (comp: JSX.Element): RenderResult => {
  return render(<BrowserRouter>{comp}</BrowserRouter>)
}

export { renderInsideBrowserRouter }
