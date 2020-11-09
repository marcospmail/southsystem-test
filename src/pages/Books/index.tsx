import React, {
  useState,
  useCallback,
  useEffect,
  FormEvent,
  useRef,
} from 'react'
import { useHistory } from 'react-router-dom'
import { format, parseISO, isValid } from 'date-fns'
import { toast } from 'react-toastify'

import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Image from '../../components/Image'
import Card from '../../components/Card'

import api from '../../config/api'

import {
  restoreFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/localStorage'

import nothingFoundImg from '../../assets/nothing-found.svg'
import readingImg from '../../assets/reading.svg'

import {
  BooksContainer,
  Container,
  Content,
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
      thumbnail: string
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
  const [loading, setLoading] = useState(false)
  const [pages, setPages] = useState<number[]>([])

  const [searchTerm, setSearchTerm] = useState(() => {
    return restoreFromLocalStorage('books:searchTerm')
  })

  const [currentPage, setCurrentPage] = useState<number>(() => {
    return restoreFromLocalStorage('books:currentPage')
  })

  const [totalItems, setTotalItems] = useState<number>(() => {
    return restoreFromLocalStorage('books:totalItems')
  })

  const [books, setBooks] = useState<BookProps[] | undefined>(() => {
    return restoreFromLocalStorage('books:books')
  })

  const searchTermInputRef = useRef<HTMLInputElement>(null)

  const history = useHistory()

  useEffect(() => {
    window.addEventListener('resize', calculatePages)
    return () => {
      window.removeEventListener('resize', calculatePages)
    }
  }, [])

  useEffect(() => {
    if (searchTermInputRef.current) {
      searchTermInputRef.current.value = searchTerm
    }
  }, [searchTermInputRef])

  useEffect(() => {
    calculatePages()
  }, [totalItems])

  useEffect(() => {
    saveToLocalStorage('books:books', JSON.stringify(books))
  }, [books])

  useEffect(() => {
    saveToLocalStorage('books:totalItems', JSON.stringify(totalItems))
  }, [totalItems])

  useEffect(() => {
    saveToLocalStorage('books:currentPage', JSON.stringify(currentPage))
  }, [currentPage])

  useEffect(() => {
    saveToLocalStorage('books:searchTerm', JSON.stringify(searchTerm))
  }, [searchTerm])

  const calculateMaxPages = useCallback(() => {
    const PAGE_DIVIDER = 80
    const MAX_PAGES = 15

    const maxPages = Math.min(window.innerWidth / PAGE_DIVIDER, MAX_PAGES)
    return maxPages
  }, [])

  const calculatePages = () => {
    if (!currentPage || !totalItems) return []

    const maxPages = calculateMaxPages()

    const min = 1
    const total = Math.ceil(totalItems / MAX_RESULTS)
    let length = maxPages

    if (length > total) length = total

    let start = currentPage - Math.floor(length / 2)
    start = Math.max(start, min)
    start = Math.min(start, min + total - length)

    const pages = Array.from({ length }, (el, i) => start + i)
    setPages(pages)
  }

  const searchBooks = useCallback(
    async (search: string, page: number) => {
      setLoading(true)
      const startIndex = (page - 1) * 10

      setSearchTerm(search)
      setCurrentPage(page)

      try {
        const response = await api.get<BooksApiResponse>(
          `/volumes?q=${search}&startIndex=${startIndex}&maxResults=${MAX_RESULTS}`
        )

        if (response.status !== 200) {
          throw new Error()
        }

        const totalItems = response.data.totalItems
        setTotalItems(totalItems)

        const books = totalItems === 0 ? [] : response.data.items

        setBooks(books)
        setLoading(false)
      } catch (err) {
        toast.error('Failed to load books')
        setLoading(false)
        setBooks([])
      }
    },
    [currentPage, totalItems]
  )

  const handleSearchFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      const searchTermTemp = searchTermInputRef.current?.value ?? ''

      if (!searchTermTemp) {
        toast.error(`Search term can't be empty`)
        return
      }

      searchBooks(searchTermTemp, 1)
    },
    [searchBooks, searchTermInputRef]
  )

  return (
    <Container>
      <Header />

      <Content>
        <header>
          <strong>Books</strong>
        </header>
        <SubHeader onSubmit={handleSearchFormSubmit}>
          <Input ref={searchTermInputRef} placeholder="Type your search here" />
          <Button primary type="submit">
            Search
          </Button>
        </SubHeader>

        {loading && <Card style={{ marginTop: 20 }} text="Loading..." />}

        {!loading && !books && (
          <Card
            style={{ marginTop: 20 }}
            imgSrc={readingImg}
            text="Search something"
          />
        )}

        {!loading && books && books?.length === 0 && (
          <Card
            style={{ marginTop: 20 }}
            imgSrc={nothingFoundImg}
            text="Nothing found. Maybe try a different title?"
          />
        )}

        {!loading && books?.length != null && books?.length > 0 && (
          <>
            <BooksContainer>
              {books?.map(book => (
                <article
                  data-testid="testid_book-container"
                  key={book.id}
                  onClick={() => history.push(`/books/${book.id}`)}
                >
                  <Image
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                  />

                  <div className="book-details">
                    <span
                      data-testid="testid_book-title"
                      className="book-title"
                    >
                      {' '}
                      {book.volumeInfo.title}
                    </span>

                    {book.volumeInfo.authors &&
                      book.volumeInfo.authors.length > 0 && (
                        <span className="book-authors">
                          <strong>
                            {book.volumeInfo.authors?.length > 1
                              ? 'Authors: '
                              : 'Author: '}{' '}
                          </strong>
                          {book.volumeInfo.authors?.join(', ')}
                        </span>
                      )}

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
                  onClick={() => {
                    if (page !== currentPage) {
                      searchBooks(searchTerm, page)
                    }
                  }}
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
