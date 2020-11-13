import { IBook } from '../../types/IBook'

export default (index: string): IBook => ({
  id: index,
  volumeInfo: {
    title: `Book title ${index}`,
    subtitle: `Book subtitle ${index}`,
    description: `Book description ${index}`,
    authors: ['Book 1 Author 1', `Book ${index} Author ${index}`],
    publisher: `Book ${index} publisher`,
    publishedDate: '25/01/2011',
    imageLinks: {
      thumbnail:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      medium:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    },
  },
})
