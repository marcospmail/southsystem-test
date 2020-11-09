import { BookProps } from '../../pages/Books'

export default (index: string): BookProps => ({
  id: index,
  volumeInfo: {
    title: `Book title ${index}`,
    subtitle: 'Book subtitle 1',
    description: 'Book description 1',
    authors: ['Book 1 Author 1', 'Book 2 Author 2'],
    publisher: 'Book 1 publisher',
    publishedDate: '25/01/2011',
    imageLinks: {
      thumbnail:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      medium:
        'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    },
  },
})
