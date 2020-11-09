import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Books from './pages/Books'
import Book from './pages/Book'
import Empty from './pages/Empty'

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Books} exact />
        <Route path="/books/:id?" component={Book} />
        <Route component={Empty} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
