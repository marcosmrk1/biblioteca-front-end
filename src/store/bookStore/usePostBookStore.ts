import { defineStore } from 'pinia'
import { usePostBookApi } from '../../response/bookApi/usePost'
import { IResponse } from '../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../@Interface/models/IMockBook'
import { IMockBookAuthor } from '../../@Interface/models/IMockAuthors'

interface BookFormData {
  title: string
  publishDate: string
  author: IMockBookAuthor
}

const BOOKS_STORAGE_KEY = 'books'

export const usePostBookStore = defineStore('postBook', {
  state: () => ({
    loading: false,
    success: false,
    message: '',
    errors: [] as string[],
    statusCode: 200,
  }),

  actions: {
    async createBook(bookData: BookFormData): Promise<IResponse<IMockBook>> {
      this.loading = true

      try {
        const response = await usePostBookApi(bookData)

        this.success = response.success
        this.message = response.message
        this.errors = response.errors || []
        this.statusCode = response.statusCode

        if (response.success && response.data) {
          this.saveToLocalStorage(response.data[0])
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err)

        this.success = false
        this.message = 'Erro ao cadastrar livro'
        this.errors = [errorMessage, 'Erro ao se comunicar com a API']
        this.statusCode = 500

        return {
          data: null,
          success: false,
          message: 'Erro ao cadastrar livro',
          statusCode: 500,
          errors: [errorMessage, 'Erro ao se comunicar com a API'],
        }
      } finally {
        this.loading = false
      }
    },

    saveToLocalStorage(newBook: IMockBook) {
      try {
        const existingBooksJson = localStorage.getItem(BOOKS_STORAGE_KEY)
        const existingBooks: IMockBook[] = existingBooksJson
          ? JSON.parse(existingBooksJson)
          : []

        const updatedBooks = [...existingBooks, newBook]

        localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(updatedBooks))

        console.log('Book saved to localStorage:', newBook)
      } catch (error) {
        console.error('Error saving to localStorage:', error)
      }
    },
  },
})
