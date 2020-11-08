import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { isValid, format, parseISO } from 'date-fns'
import { FiArrowLeft } from 'react-icons/fi'

import Header from '../../components/Header'

import api from '../../config/api'

import { BookProps } from '../Books'

import { BackButton, Container, Content, Details } from './styles'

interface ParamTypes {
  id?: string
}

const Book: React.FC = () => {
  const [book, setBook] = useState<BookProps>()
  const { id } = useParams<ParamTypes>()

  const history = useHistory()

  useEffect(() => {
    const fetchBookData = async () => {
      const response = await api.get<BookProps>(
        `/volumes/${id}?key=AIzaSyCLKOg-29zAFNtvwD1Ue0wFyZb5CGO9eVU`
      )

      if (response.status === 200) {
        setBook(response.data)

        console.log(response.data.volumeInfo.imageLinks.medium)
      }
    }

    fetchBookData()
  }, [])

  return (
    <Container>
      <Header />

      <Content>
        <header>
          <BackButton onClick={() => history.goBack()}>
            <FiArrowLeft size={30} color="#949494" />
          </BackButton>

          <strong>Book details</strong>
        </header>

        <Details>
          <img
            src={book?.volumeInfo.imageLinks.medium}
            alt={book?.volumeInfo.title}
          />

          <strong id="title">{book?.volumeInfo.title}</strong>
          <strong id="subtitle">{book?.volumeInfo.subtitle}</strong>

          <strong>AUTHOR</strong>
          <span>{book?.volumeInfo.authors?.join(', ')}</span>

          <strong>DATE</strong>
          <span>
            {book?.volumeInfo?.publishedDate &&
            isValid(parseISO(book.volumeInfo?.publishedDate))
              ? format(parseISO(book.volumeInfo?.publishedDate), 'dd/MM/yyyy')
              : book?.volumeInfo.publishedDate}
          </span>

          <strong>DESCRIPTION</strong>
          <span>{book?.volumeInfo.description}</span>
        </Details>
      </Content>
    </Container>
  )
}

export default Book
