import { defineStore } from 'pinia'
import { useEditBookApi } from '../../response/bookApi/useEdit'
import { IResponse } from '../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../@Interface/models/IMockBook'
import { IMockBookAuthor } from '../../@Interface/models/IMockAuthors'

interface BookEditData {
  id: number
  title: string
  publishDate: string
  author: IMockBookAuthor
}

const BOOKS_STORAGE_KEY = 'books'
const EDITED_BOOKS_KEY = 'editedBooks'

export const useEditBookStore = defineStore('editBook', {
  state: () => ({
    loading: false,
    success: false,
    message: '',
    errors: [] as string[],
    statusCode: 200,
  }),

  actions: {
    async editBook(bookData: BookEditData): Promise<IResponse<IMockBook>> {
      this.loading = true

      try {
        const response = await useEditBookApi(bookData)

        this.success = response.success
        this.message = response.message
        this.errors = response.errors || []
        this.statusCode = response.statusCode

        if (response.success && response.data) {
          this.updateInLocalStorage(response.data[0])
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)

        this.success = false
        this.message = 'Erro ao editar livro'
        this.errors = [errorMessage, 'Erro ao se comunicar com a API']
        this.statusCode = 500

        return {
          data: null,
          success: false,
          message: 'Erro ao editar livro',
          statusCode: 500,
          errors: [errorMessage, 'Erro ao se comunicar com a API'],
        }
      } finally {
        this.loading = false
      }
    },

    updateInLocalStorage(updatedBook: IMockBook) {
      try {
        const existingBooksJson = localStorage.getItem(BOOKS_STORAGE_KEY)
        const existingBooks: IMockBook[] = existingBooksJson
          ? JSON.parse(existingBooksJson)
          : []

        const bookIndex = existingBooks.findIndex((book) => book.id === updatedBook.id)

        if (bookIndex !== -1) {
          existingBooks[bookIndex] = updatedBook
          localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(existingBooks))
        } else {
          const editedBooksJson = localStorage.getItem(EDITED_BOOKS_KEY)
          const editedBooks: IMockBook[] = editedBooksJson
            ? JSON.parse(editedBooksJson)
            : []

          const editedIndex = editedBooks.findIndex((book) => book.id === updatedBook.id)

          if (editedIndex !== -1) {
            editedBooks[editedIndex] = updatedBook
          } else {
            editedBooks.push(updatedBook)
          }

          localStorage.setItem(EDITED_BOOKS_KEY, JSON.stringify(editedBooks))
        }
      } catch (error) {
        console.error('Error updating in localStorage:', error)
      }
    },
  },
})
