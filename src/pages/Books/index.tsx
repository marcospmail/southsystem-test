import React, { useCallback, useEffect, FormEvent, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { format, parseISO, isValid } from 'date-fns'
import { FiStar } from 'react-icons/fi'

import Header from '../../components/Header'
import Input from '../../components/Input'
import Button from '../../components/Button'
import Image from '../../components/Image'
import Card from '../../components/Card'

import { useBooks } from '../../hooks/bookReducer'
import { IBook } from '../../types/IBook'

import nothingFoundImg from '../../assets/nothing-found.svg'
import readingImg from '../../assets/reading.svg'

import {
  BooksContainer,
  Container,
  Content,
  Paginator,
  SubHeader,
} from './styles'

const Books: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const {
    fetchBooks,
    update,
    updatePagesCount,
    toggleFavorite,
    search,
    searchTerm,
    currentPage,
    pages,
    books,
    favorites,
    loading,
    onlyFavorites,
  } = useBooks()

  const history = useHistory()

  useEffect(() => {
    window.addEventListener('resize', updatePagesCount)

    return () => {
      window.removeEventListener('resize', updatePagesCount)
    }
  }, [])

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.value = searchTerm
    }
  }, [searchInputRef])

  const handleToggleFavoriteBook = useCallback(
    (book: IBook) => {
      toggleFavorite(book)
    },
    [toggleFavorite]
  )

  const handleSearchFormSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      const searchTemp = searchInputRef.current?.value ?? ''
      search(searchTemp)
    },
    [fetchBooks, searchInputRef]
  )

  const toggleOnlyFavorites = useCallback(() => {
    update({
      onlyFavorites: !onlyFavorites,
      searchTerm: searchInputRef.current?.value,
    })
  }, [onlyFavorites, searchInputRef])

  return (
    <Container>
      <Header />

      <Content>
        <header>
          <strong>Books</strong>
        </header>
        <SubHeader onSubmit={handleSearchFormSubmit}>
          <Input ref={searchInputRef} placeholder="Type your search here">
            <FiStar
              data-testid="testid_filteronlyfavorites-svg"
              size={20}
              title="Filter only favorite books"
              onClick={toggleOnlyFavorites}
              color={onlyFavorites ? '#3f3d56' : '#ddd'}
            />
          </Input>
          <Button primary type="submit">
            Search
          </Button>
        </SubHeader>

        {loading && (
          <Card
            style={{ marginTop: 20 }}
            text="Loading..."
            textStyle={{
              textAlign: 'center',
              fontSize: 30,
            }}
          />
        )}

        {!loading && !books && (
          <Card
            style={{ marginTop: 20 }}
            imgSrc={readingImg}
            text="Search something."
          />
        )}

        {!loading && books && books?.length === 0 && (
          <Card
            style={{ marginTop: 20 }}
            imgSrc={nothingFoundImg}
            text={
              onlyFavorites
                ? favorites.length === 0
                  ? 'Nothing favorited'
                  : `No favorites found with this search`
                : 'Nothing found. Maybe try a different search?'
            }
          />
        )}

        {!loading && books?.length != null && books?.length > 0 && (
          <>
            <BooksContainer>
              {books?.map(book => {
                const favorite = favorites.some(fav => fav.id === book.id)

                return (
                  <article
                    data-testid="testid_book-container"
                    key={book.id}
                    className={favorite ? 'favorite' : undefined}
                    onClick={() => history.push(`/books/${book.id}`)}
                  >
                    <FiStar
                      data-testid="testid_favorite-svg"
                      title="Click to favorite this book"
                      size={20}
                      color={favorite ? '#3f3d56' : '#ddd'}
                      onClick={e => {
                        e.stopPropagation()
                        handleToggleFavoriteBook(book)
                      }}
                    />

                    <Image
                      src={book.volumeInfo.imageLinks?.thumbnail}
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

                      {book.volumeInfo.publisher && (
                        <span className="book-publish">
                          <strong>Publisher: </strong>
                          {book.volumeInfo.publisher}
                        </span>
                      )}

                      {book.volumeInfo.publishedDate && (
                        <span className="book-publisheddate">
                          <strong>Date: </strong>
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
                )
              })}
            </BooksContainer>

            <Paginator>
              {pages.map(page => (
                <li
                  data-testid="testid_page-li"
                  key={page}
                  onClick={() => {
                    if (page !== currentPage) {
                      fetchBooks(searchTerm, page)
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
