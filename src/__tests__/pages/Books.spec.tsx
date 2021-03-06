import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { Route, Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import generateBook from '../util/bookGenerator'
import Books from '../../pages/Books'
import { IBook } from '../../types/IBook'
import api from '../../config/api'

jest.mock('react-router-dom', () => {
  const actualReactRouterDom = jest.requireActual('react-router-dom')

  return {
    ...actualReactRouterDom,
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
})

const apiMock = new MockAdapter(api)

function generateBooks(count: number) {
  return Array.from({ length: count }, (_, index) =>
    generateBook(String(index))
  )
}

const mockBooksGetApi = (totalItems: number, books: IBook[]) => {
  const volumesUri = '/volumes'
  const url = new RegExp(`${volumesUri}`)

  apiMock.onGet(url).reply(200, {
    totalItems,
    items: books,
  })
}

describe('Books Page', () => {
  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('should show books results on search', async () => {
    const { getByText, getAllByTestId, getByPlaceholderText } = render(
      <Books />
    )

    const totalItems = 100
    mockBooksGetApi(totalItems, generateBooks(10))

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      const pagesComponents = getAllByTestId('testid_page-li')

      const BOOKS_PER_PAGE = 10
      expect(pagesComponents.length).toEqual(totalItems / BOOKS_PER_PAGE)
    })
  })

  it('should call api.get with search term', async () => {
    const apiGetFunction = jest.spyOn(api, 'get')

    const { getByText, getByPlaceholderText } = render(<Books />)

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      expect(apiGetFunction).toHaveBeenCalledWith(
        expect.stringContaining('fever')
      )
    })
  })

  it('should show books returned from search filter', async () => {
    const totalItems = 100
    const booksCount = 10
    mockBooksGetApi(totalItems, generateBooks(booksCount))

    const { container, getByText, getByPlaceholderText } = render(<Books />)

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      expect(container.querySelectorAll('.book-title').length).toEqual(
        booksCount
      )
    })
  })

  it('should save data to local storage on search', async () => {
    const localStorageSetItemFunction = jest.spyOn(Storage.prototype, 'setItem')

    const books = generateBooks(10)
    mockBooksGetApi(100, books)

    const { getByText, getByPlaceholderText } = render(<Books />)

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    const searchTerm = 'fever'

    fireEvent.change(input, { target: { value: searchTerm } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      expect(localStorageSetItemFunction).toHaveBeenLastCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"totalItems":100')
      )

      expect(localStorageSetItemFunction).toHaveBeenLastCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"loading":false')
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"searchTerm":"fever"')
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"currentPage":1')
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining(`"books":${JSON.stringify(books)}`)
      )
    })
  })

  it('should restore local storage data on page load', async () => {
    const searchTerm = 'fever'
    const books = generateBooks(10)
    const totalItems = 100

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@SouthSystem:books:books':
          return JSON.stringify(books)
        case '@SouthSystem:books:searchTerm':
          return searchTerm
        case '@SouthSystem:books:totalItems':
          return JSON.stringify(totalItems)
        default:
          return null
      }
    })

    const { getAllByTestId, getByPlaceholderText } = render(<Books />)

    expect(getByPlaceholderText('Type your search here')).toHaveValue(
      searchTerm
    )

    const titleComponents = getAllByTestId('testid_book-title')

    for (let i = 0; i < titleComponents.length; i++) {
      expect(titleComponents[i]).toHaveTextContent(books[i].volumeInfo.title)
    }
  })

  it('should go to book details page after click a book', async () => {
    const books = generateBooks(9)

    const history = createMemoryHistory()

    const { container } = render(
      <Router history={history}>
        <Books />
        <Route path={`/books/:id`}>Book details page</Route>
      </Router>
    )

    mockBooksGetApi(100, books)

    const searchButtonComponent = screen.getByText('Search')
    const input = screen.getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      fireEvent.click(screen.getByText(books[0].volumeInfo.title))
    })

    await waitFor(() => {
      expect(container).toHaveTextContent(/Book details page/)
    })
  })

  it('should save onlyFavorites state in localStorage on filter click', async () => {
    const setLocalStorageItemFunction = jest.spyOn(Storage.prototype, 'setItem')

    const { getByTestId } = render(<Books />)

    const filterOnlyFavorites = getByTestId('testid_filteronlyfavorites-svg')

    fireEvent.click(filterOnlyFavorites)

    await waitFor(() => {
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"onlyFavorites":true')
      )
    })

    fireEvent.click(filterOnlyFavorites)

    await waitFor(() => {
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining('"onlyFavorites":false')
      )
    })
  })

  it('should favorite/unfavorite a book on favorite button click', async () => {
    const books = generateBooks(10)
    mockBooksGetApi(100, books)

    const { getByText, getAllByTestId, getByPlaceholderText } = render(
      <Books />
    )

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    const localStorageSetItemFunction = jest.spyOn(Storage.prototype, 'setItem')

    await waitFor(() => {
      fireEvent.click(getAllByTestId('testid_favorite-svg')[0])
    })

    await waitFor(() => {
      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.stringContaining(`"favorites":[${JSON.stringify(books[0])}]`)
      )
    })

    await waitFor(() => {
      localStorageSetItemFunction.mockClear()
      fireEvent.click(getAllByTestId('testid_favorite-svg')[0])
    })

    await waitFor(() => {
      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books',
        expect.not.stringContaining(`"favorites":[${JSON.stringify(books[0])}]`)
      )
    })
  })
})
