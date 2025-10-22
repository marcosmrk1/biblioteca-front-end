import { IMockBookAuthor } from './IMockAuthors'

export interface IMockBook {
  id: number
  publicationDate: string
  author: IMockBookAuthor[]
  title: string
}
