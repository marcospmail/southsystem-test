export interface IBook {
  id: string
  volumeInfo: {
    title: string
    subtitle: string
    description: string
    authors?: string[]
    publisher: string
    publishedDate?: string
    imageLinks?: {
      thumbnail: string
      medium: string
    }
  }
}
