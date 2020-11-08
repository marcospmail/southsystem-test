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

import nothingFoundImg from '../../assets/nothing-found.svg'
import readingImg from '../../assets/reading.svg'

import {
  BooksContainer,
  Container,
  Content,
  EmptyData,
  Loading,
  MakeASearchIndicator,
  Paginator,
  SubHeader,
} from './styles'
import { toast } from 'react-toastify'

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
  const [books, setBooks] = useState<BookProps[] | undefined>()
  const [pages, setPages] = useState<number[]>([])
  const [maxPages, setMaxPages] = useState<number>()
  const [totalItems, setTotalItems] = useState<number>()
  const [currentPage, setCurrentPage] = useState<number>()
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const history = useHistory()

  useEffect(() => {
    calculateMaxPages()

    window.addEventListener('resize', calculateMaxPages)
    return () => {
      window.removeEventListener('resize', calculateMaxPages)
    }
  }, [])

  useEffect(() => {
    if (totalItems) {
      setPages(calculatePages(totalItems))
    }
  }, [maxPages])

  useEffect(() => {
    searchBooks()
  }, [currentPage])

  const handleSearchTermChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value)
    },
    []
  )

  const calculateMaxPages = useCallback(() => {
    const PAGE_DIVIDER = 80
    const MAX_PAGES = 15

    const maxPages = Math.min(window.innerWidth / PAGE_DIVIDER, MAX_PAGES)
    setMaxPages(maxPages)
  }, [])

  const calculatePages = (totalItems: number) => {
    if (!currentPage || !maxPages) return []

    const min = 1
    const total = Math.ceil(totalItems / MAX_RESULTS)
    let length = maxPages

    if (length > total) length = total

    let start = currentPage - Math.floor(length / 2)
    start = Math.max(start, min)
    start = Math.min(start, min + total - length)

    return Array.from({ length }, (el, i) => start + i)
  }

  const searchBooks = useCallback(async () => {
    if (!currentPage) return

    if (!searchTerm) {
      toast.error(`Search term can't be empty`)
      return
    }

    setLoading(true)
    const startIndex = (currentPage - 1) * 10

    try {
      const response = await api.get<BooksApiResponse>(
        `/volumes?q=${searchTerm}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`
      )

      if (response.status !== 200) {
        throw new Error()
      }
      const totalItems = response.data.totalItems
      setTotalItems(totalItems)
      setPages(calculatePages(totalItems))

      const items = totalItems === 0 ? [] : response.data.items

      setBooks(items)
      setLoading(false)
    } catch (err) {
      toast.error('Failed to load books')
      setLoading(false)
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
    [currentPage, searchBooks]
  )

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

        {loading && <Loading>Loading...</Loading>}

        {!loading && !books && (
          <MakeASearchIndicator>
            <img src={readingImg} />
            <span>Search something</span>
          </MakeASearchIndicator>
        )}

        {!loading && books && books?.length === 0 && (
          <EmptyData>
            <span>
              Nothing found. <br />
              Maybe try a different title?
            </span>
            <img src={nothingFoundImg} />
          </EmptyData>
        )}

        {!loading && books?.length != null && books?.length > 0 && (
          <>
            <BooksContainer>
              {books?.map(book => (
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
        )}
      </Content>
    </Container>
  )
}

export default Books
