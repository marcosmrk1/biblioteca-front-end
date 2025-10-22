import { defineStore } from 'pinia'
import { useGetBookApi } from '../../response/bookApi/useGet'
import { IMockBook } from '../../@Interface/models/IMockBook'
import { IResponse } from '../../@Interface/apiInterface/IResponse'

const BOOKS_STORAGE_KEY = 'books'
const EDITED_BOOKS_KEY = 'editedBooks' // Nova chave para livros editados

export const useBooksStore = defineStore('books', {
  state: (): IResponse<IMockBook> => ({
    data: [],
    loading: false,
    errors: [],
    success: false,
    message: '',
    meta: {
      total: 0,
      page: 1,
      perPage: 0,
    },
    statusCode: 200,
  }),
  actions: {
    async loadBooks() {
      this.loading = true

      try {
        const response = await useGetBookApi()

        // Buscar livros criados localmente
        const savedBooksJson = localStorage.getItem(BOOKS_STORAGE_KEY)
        const savedBooks: IMockBook[] = savedBooksJson ? JSON.parse(savedBooksJson) : []

        // Buscar livros editados
        const editedBooksJson = localStorage.getItem(EDITED_BOOKS_KEY)
        const editedBooks: IMockBook[] = editedBooksJson
          ? JSON.parse(editedBooksJson)
          : []

        // Mesclar livros da API com as edições
        let allBooks = response.data ? [...response.data] : []

        // Substituir livros da API que foram editados
        editedBooks.forEach((editedBook) => {
          const index = allBooks.findIndex((book) => book.id === editedBook.id)
          if (index !== -1) {
            allBooks[index] = editedBook
          }
        })

        // Adicionar livros criados localmente
        allBooks = [...allBooks, ...savedBooks]

        this.data = allBooks
        this.success = response.success
        this.message = response.message
        this.errors = response.errors || []
        this.statusCode = response.statusCode
        this.meta = {
          ...response.meta,
          total: allBooks.length,
        }

        console.log('Books loaded:', {
          fromAPI: response.data?.length || 0,
          fromLocalStorage: savedBooks.length,
          edited: editedBooks.length,
          total: allBooks.length,
        })

        return { ...response, data: allBooks }
      } catch (err) {
        console.log('Error loading books:', err)

        const errorMessage = err instanceof Error ? err.message : String(err)

        this.data = null
        this.success = false
        this.message = 'Erro ao buscar livros'
        this.errors = [errorMessage, 'Erro ao se comunicar com a API']
        this.statusCode = 500

        return {
          data: null,
          success: false,
          message: 'Erro ao buscar livros',
          statusCode: 500,
          errors: [errorMessage, 'Erro ao se comunicar com a API'],
        }
      } finally {
        this.loading = false
      }
    },
  },
})
