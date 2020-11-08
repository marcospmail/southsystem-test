import React, {
  useState,
  useCallback,
  ChangeEvent,
  useEffect,
  FormEvent,
} from 'react'
import { useHistory } from 'react-router-dom'
import { format, parseISO, isValid } from 'date-fns'

import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'

import api from '../../config/api'

import {
  BooksContainer,
  Container,
  Content,
  EmptyData,
  Paginator,
  SubHeader,
} from './styles'

export interface BookProps {
  id: string
  volumeInfo: {
    title: string
    subtitle: string
    description: string
    authors?: string[]
    publisher: string
    publishedDate?: string
    imageLinks: {
      smallThumbnail: string
      medium: string
    }
  }
}

interface BooksApiResponse {
  totalItems: number
  items?: BookProps[]
}

const MAX_RESULTS = 10

const Books: React.FC = () => {
  const [books, setBooks] = useState<BookProps[] | undefined>([])
  const [pages, setPages] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState<number>()
  const [searchTerm, setSearchTerm] = useState('')

  const history = useHistory()

  const handleSearchTermChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    []
  )

  const searchBooks = useCallback(async () => {
    if (!currentPage) return

    const startIndex = (currentPage - 1) * 10

    const response = await api.get<BooksApiResponse>(
      `/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`
    )
    if (response.status === 200) {
      setBooks(response.data.items)
      setPages(calculatePages(response.data.totalItems))
    }
  }, [searchTerm, currentPage])

  const handleSearchFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      if (currentPage === 1) {
        searchBooks()
        return
      }

      setCurrentPage(1)
    },
    [currentPage]
  )

  const calculatePages = (totalItems: number) => {
    if (!currentPage) return []

    const min = 1
    const total = Math.ceil(totalItems / MAX_RESULTS)
    let length = MAX_RESULTS

    if (length > total) length = total

    let start = currentPage - Math.floor(length / 2)
    start = Math.max(start, min)
    start = Math.min(start, min + total - length)

    return Array.from({ length }, (el, i) => start + i)
  }

  useEffect(() => {
    searchBooks()
  }, [currentPage])

  return (
    <Container>
      <Header />

      <Content>
        <header>
          <strong>Books</strong>
        </header>

        <SubHeader onSubmit={handleSearchFormSubmit}>
          <Input
            placeholder="Type your search here"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <Button primary type="submit">
            Search
          </Button>
        </SubHeader>

        {books?.length ? (
          <>
            <BooksContainer>
              {books.map(book => (
                <article
                  key={book.id}
                  onClick={() => history.push(`/books/${book.id}`)}
                >
                  {book.volumeInfo.imageLinks?.smallThumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks?.smallThumbnail}
                      alt={book.volumeInfo.title}
                    />
                  ) : (
                    <div className="image-placeholder">
                      <span>Image not available</span>
                    </div>
                  )}

                  <div className="book-details">
                    <span className="book-title"> {book.volumeInfo.title}</span>
                    <span className="book-authors">
                      <strong>Authors: </strong>
                      {book.volumeInfo.authors?.join(', ')}
                    </span>
                    <span className="book-publish">
                      <strong>Publisher: </strong>
                      {book.volumeInfo.publisher}
                    </span>
                    {book.volumeInfo.publishedDate && (
                      <span className="book-publisheddate">
                        <strong>Date: : </strong>
                        {isValid(parseISO(book.volumeInfo.publishedDate))
                          ? format(
                              parseISO(book.volumeInfo.publishedDate),
                              'dd/MM/yyyy'
                            )
                          : book.volumeInfo.publishedDate}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </BooksContainer>

            <Paginator>
              {pages.map(page => (
                <li
                  data-testid="page_test"
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={currentPage === page ? 'active' : undefined}
                >
                  {page}
                </li>
              ))}
            </Paginator>
          </>
        ) : (
          <EmptyData>
            <span>Nada encontado :(</span>
          </EmptyData>
        )}
      </Content>
    </Container>
  )
}

export default Books
