import React from 'react'
import { BrowserRouter, Route, Router } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from 'history'

import Books from '../../pages/Books'
import Empty from '../../pages/Empty'

describe('Empty', () => {
  it('should show empty page whe navigating to an invalid route', async () => {
    const history = createMemoryHistory()
    history.push('/')

    render(
      <BrowserRouter>
        <Router history={history}>
          <Route path="/" component={Books} exact />
          <Route component={Empty} />
        </Router>
      </BrowserRouter>
    )

    expect(screen.getByText(`You shouldn't be here`)).toBeInTheDocument()
  })
})
