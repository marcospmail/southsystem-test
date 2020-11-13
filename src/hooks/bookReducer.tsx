import { useCallback, useEffect, useReducer, useRef } from 'react'
import { toast } from 'react-toastify'

import { IBook } from '../types/IBook'
import api from '../config/api'
import { calculatePages } from '../utils/pages'

export interface State {
  pages: number[]
  onlyFavorites: boolean
  searchTerm: string
  currentPage: number
  totalItems: number
  books: IBook[] | undefined
  favorites: IBook[]
  loading: boolean
}

export enum Types {
  UPDATE,
}

type Action = {
  type: Types.UPDATE
  payload: Partial<State>
}
const bookReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case Types.UPDATE: {
      const { payload } = action

      saveToLocalStorage(payload)
      return { ...state, ...payload }
    }
    default:
      return state
  }
}

const saveToLocalStorage = (newData: Partial<State>): void => {
  const localStoredBooksData = localStorage.getItem('@SouthSystem:books')

  let booksData = {}
  if (localStoredBooksData) booksData = JSON.parse(localStoredBooksData)

  const stringifiedBooks = JSON.stringify({ ...booksData, ...newData })

  localStorage.setItem('@SouthSystem:books', stringifiedBooks)
}

export const initialState = {
  onlyFavorites: false,
  currentPage: 0,
  searchTerm: '',
  totalItems: 0,
  pages: [],
  books: [],
  favorites: [],
  loading: false,
}

export const initializer = (initialValue = initialState): State => {
  const localStoredBooksData = localStorage.getItem('@SouthSystem:books')

  let booksData = {}
  if (localStoredBooksData) {
    booksData = JSON.parse(localStoredBooksData)

    Object.assign(initialValue, booksData)
  }

  return initialValue
}

interface BooksApiResponse {
  totalItems: number
  items?: IBook[]
}

interface IUseBooks extends Omit<State, 'totalItems'> {
  fetchBooks: (search: string, page: number) => void
  update: (data: Partial<State>) => void
  updatePagesCount: () => void
  toggleFavorite: (book: IBook) => void
  search: (searchTerm: string) => void
}

const MAX_ITEMS_PER_PAGE = 10

export const useBooks = (): IUseBooks => {
  const didMount = useRef(false)

  const [
    {
      currentPage,
      searchTerm,
      totalItems,
      books,
      favorites,
      onlyFavorites,
      pages,
      loading,
    },
    dispatch,
  ] = useReducer(bookReducer, initialState, initializer)

  const fetchBooks = useCallback(
    async (search: string, page: number) => {
      update({ loading: true })

      const startIndex = (page - 1) * 10

      let books: IBook[] | undefined = []
      let totalItems

      try {
        if (onlyFavorites) {
          books = favorites.filter(fav =>
            fav.volumeInfo.title.toLowerCase().includes(search.toLowerCase())
          )

          totalItems = books.length
          books = books.slice(startIndex, startIndex + MAX_ITEMS_PER_PAGE)
        } else {
          const response = await api.get<BooksApiResponse>(
            `/volumes?q=${search}&startIndex=${startIndex}&maxResults=${MAX_ITEMS_PER_PAGE}`
          )

          if (response.status !== 200) {
            throw new Error()
          }

          totalItems = response.data.totalItems
          books = totalItems === 0 ? [] : response.data.items
        }

        update({
          totalItems,
          searchTerm: search,
          books,
          currentPage: page,
          loading: false,
        })
      } catch (err) {
        toast.error('Failed to load books')

        update({
          totalItems: 0,
          books: [],
        })

        update({ loading: false })
      }
    },
    [favorites, onlyFavorites]
  )

  useEffect(() => {
    updatePagesCount()
  }, [totalItems])

  useEffect(() => {
    if (!didMount.current) {
      return
    }

    if (onlyFavorites) {
      fetchBooks(searchTerm, currentPage)
    }
  }, [favorites])

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (!onlyFavorites && !searchTerm) {
      update({ books: undefined })
      return
    }

    fetchBooks(searchTerm, 1)
  }, [onlyFavorites])

  const action = (data: Partial<State>): Action => {
    return {
      type: Types.UPDATE,
      payload: data,
    }
  }

  const update = useCallback((data: Partial<State>) => {
    dispatch(action(data))
  }, [])

  const updatePagesCount = useCallback(() => {
    update({
      pages: calculatePages(currentPage, totalItems, MAX_ITEMS_PER_PAGE),
    })
  }, [currentPage, totalItems])

  const search = useCallback(
    (search: string) => {
      if (!search && !onlyFavorites) {
        toast.error(`Search term can't be empty`)
        return
      }

      fetchBooks(search, 1)
    },
    [onlyFavorites, fetchBooks]
  )

  const toggleFavorite = useCallback(
    (book: IBook) => {
      let newFavorites = favorites.filter(fav => fav.id !== book.id)

      if (newFavorites.length === favorites?.length) {
        newFavorites = [...favorites, book]
      }

      update({
        favorites: newFavorites,
      })
    },
    [favorites]
  )

  return {
    update,
    updatePagesCount,
    fetchBooks,
    toggleFavorite,
    search,
    currentPage,
    searchTerm,
    books,
    favorites,
    onlyFavorites,
    pages,
    loading,
  }
}

export { bookReducer }
