import axios from 'axios'

const siteMercadoApi = axios.create({
  baseURL: 'https://www.googleapis.com/books/v1',
})

export default siteMercadoApi
