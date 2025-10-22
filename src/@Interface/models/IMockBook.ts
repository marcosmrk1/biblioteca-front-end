import { IMockBookAuthor } from './IMockAuthors'

export interface IMockBook {
  id: number
  publicationDate: string
  author: IMockBookAuthor[]
  title: string
}
export interface BookEditData {
  id: number
  title: string
  publishDate: string
  author: IMockBookAuthor
}
export interface BookFormData {
  title: string
  publishDate: string
  author: IMockBookAuthor
}
