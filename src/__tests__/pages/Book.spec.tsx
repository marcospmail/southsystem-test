import React from 'react'
import {
  render,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import MockAdapter from 'axios-mock-adapter'
import { isValid, format, parseISO } from 'date-fns'

import Book from '../../pages/Book'
import api from '../../config/api'
import bookGenerator from '../data/bookGenerator'

const apiMock = new MockAdapter(api)

const mockBookId = 'SpWvJSonZKcC'

jest.mock('react-router-dom', () => {
  return {
    useParams: () => ({
      id: mockBookId,
    }),
    useHistory: () => ({
      push: jest.fn(),
    }),
  }
})

const book = bookGenerator('1')

describe('Book Details Page', () => {
  beforeEach(() => {
    apiMock.onGet(`/volumes/${mockBookId}`).reply(200, book)
  })

  afterEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
  })

  it('should load book details', async () => {
    const mockApi = jest.spyOn(api, 'get')

    render(<Book />)

    await waitFor(() => {
      expect(mockApi).toHaveBeenCalledWith(`/volumes/${mockBookId}`)
    })
  })

  it('should show book data', async () => {
    const { getByText, getByAltText } = render(<Book />)

    await waitFor(() => {
      expect(getByText(book.volumeInfo.title)).toBeInTheDocument()
      expect(getByText(book.volumeInfo.subtitle)).toBeInTheDocument()
      expect(getByText(book.volumeInfo.description)).toBeInTheDocument()

      const bookImage = getByAltText(book.volumeInfo.title)

      expect(bookImage).toBeInTheDocument()
      expect(bookImage).toHaveAttribute(
        'src',
        book.volumeInfo.imageLinks?.medium
      )

      const authors = book.volumeInfo.authors?.join(', ')
      if (authors) expect(getByText(authors)).toBeInTheDocument()

      if (book.volumeInfo.publishedDate) {
        const date = isValid(parseISO(book.volumeInfo.publishedDate))
          ? format(parseISO(book.volumeInfo.publishedDate), 'dd/MM/yyyy')
          : book?.volumeInfo.publishedDate
        expect(getByText(date)).toBeInTheDocument()
      }
    })
  })

  it('should show a loading indicator and disappear', async () => {
    const { getByText } = render(<Book />)

    const loadingComponent = getByText('Loading...')
    expect(loadingComponent).toBeInTheDocument()
    await waitForElementToBeRemoved(loadingComponent)
  })
})
