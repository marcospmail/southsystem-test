import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Books from './pages/Books'
import Book from './pages/Book'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Books} exact />
        <Route path="/books/:id?" component={Book} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
