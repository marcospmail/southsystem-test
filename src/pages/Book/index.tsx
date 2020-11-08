import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { isValid, format, parseISO } from 'date-fns'
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'

import { BookProps } from '../Books'

import Header from '../../components/Header'

import api from '../../config/api'

import nothingFoundImg from '../../assets/nothing-found.svg'

import {
  BackButton,
  Container,
  Content,
  Details,
  EmptyData,
  Loading,
} from './styles'

interface ParamTypes {
  id?: string
}

const Book: React.FC = () => {
  const [book, setBook] = useState<BookProps>()
  const [loading, setLoading] = useState(true)
  const { id } = useParams<ParamTypes>()

  const history = useHistory()

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true)

        const response = await api.get<BookProps>(`/volumes/${id}`)

        if (response.status !== 200) {
          throw new Error()
        }

        setBook(response.data)
        setLoading(false)
      } catch (err) {
        toast.error('Failed to load book')
        setLoading(false)
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

        {loading ? (
          <Loading>Loading...</Loading>
        ) : !book ? (
          <EmptyData>
            <img src={nothingFoundImg} />
            <span>{`There's nothing here`}</span>
          </EmptyData>
        ) : (
          <Details>
            <img
              src={book?.volumeInfo.imageLinks.medium}
              alt={book?.volumeInfo.title}
            />

            <strong id="title">{book?.volumeInfo.title}</strong>
            <strong id="subtitle">{book?.volumeInfo.subtitle}</strong>

            {book?.volumeInfo.authors && (
              <>
                <strong>
                  {book?.volumeInfo.authors?.length > 1 ? 'AUTHORS' : 'AUTHOR'}
                </strong>
                <span>{book?.volumeInfo.authors?.join(', ')}</span>
              </>
            )}

            {book?.volumeInfo?.publishedDate && (
              <>
                <strong>DATE</strong>
                <span>
                  {isValid(parseISO(book.volumeInfo?.publishedDate))
                    ? format(
                        parseISO(book.volumeInfo?.publishedDate),
                        'dd/MM/yyyy'
                      )
                    : book?.volumeInfo.publishedDate}
                </span>
              </>
            )}

            {book?.volumeInfo.description && (
              <>
                <strong>DESCRIPTION</strong>
                <span>{book?.volumeInfo.description}</span>
              </>
            )}
          </Details>
        )}
      </Content>
    </Container>
  )
}

export default Book
