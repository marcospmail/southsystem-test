import React from 'react'
import { fireEvent, render, waitFor, screen } from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import generateBook from '../data/bookGenerator'

import Books, { BookProps } from '../../pages/Books'
import api from '../../config/api'
import { BrowserRouter, Route } from 'react-router-dom'

const apiMock = new MockAdapter(api)

function generateBooks(count: number) {
  return Array.from({ length: count }, (_, index) =>
    generateBook(String(index))
  )
}

const mockBooksGetApi = (totalItems: number, books: BookProps[]) => {
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
    const { container, getByText, getByPlaceholderText } = render(<Books />)

    const searchButtonComponent = getByText('Search')
    const input = getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    await waitFor(() => {
      expect(container.querySelectorAll('.book-title').length).toEqual(10)
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

    await waitFor(async () => {
      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:totalItems',
        '100'
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:currentPage',
        '1'
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:searchTerm',
        JSON.stringify(searchTerm)
      )

      expect(localStorageSetItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:books',
        JSON.stringify(books)
      )
    })
  })

  it('should restore local storage data on refresh', async () => {
    const searchTerm = 'fever'
    const books = generateBooks(10)
    const totalItems = 100

    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@SouthSystem:books:books':
          return JSON.stringify(books)
        case '@SouthSystem:books:searchTerm':
          return JSON.stringify(searchTerm)
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

    const { container } = render(
      <BrowserRouter>
        <Books />
        <Route path={`/books/:id`}>Book details page</Route>
      </BrowserRouter>
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
      expect(filterOnlyFavorites).toHaveAttribute('color', '#3f3d56')
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:onlyFavorites',
        JSON.stringify(true)
      )
    })

    fireEvent.click(filterOnlyFavorites)

    await waitFor(() => {
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:onlyFavorites',
        JSON.stringify(false)
      )
    })
  })

  it('should favorite/unfavorite a book on favorite button click', async () => {
    const books = generateBooks(10)
    mockBooksGetApi(100, books)

    const { getAllByTestId } = render(<Books />)

    const searchButtonComponent = screen.getByText('Search')
    const input = screen.getByPlaceholderText('Type your search here')

    fireEvent.change(input, { target: { value: 'fever' } })
    fireEvent.click(searchButtonComponent)

    const setLocalStorageItemFunction = jest.spyOn(Storage.prototype, 'setItem')

    await waitFor(() => {
      fireEvent.click(getAllByTestId('testid_favorite-svg')[0])
    })

    await waitFor(() => {
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:favorites',
        JSON.stringify([books[0]])
      )
    })

    fireEvent.click(getAllByTestId('testid_favorite-svg')[0])

    await waitFor(() => {
      expect(setLocalStorageItemFunction).toHaveBeenCalledWith(
        '@SouthSystem:books:favorites',
        JSON.stringify([])
      )
    })
  })
})
