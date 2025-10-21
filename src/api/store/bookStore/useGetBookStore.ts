import { defineStore } from 'pinia'
import { useGetBookApi } from '../../bookApi/useGet'
import { IMockBook } from '../../../@Interface/models/IMockBook'
import { IResponse } from '../../../@Interface/apiInterface/IResponse'
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
      this.error = null
      try {
        const response = await useGetBookApi()
        return response
      } catch (err) {
        this.error = err instanceof Error ? err.message : String(err)
        return {
          data: [],
          success: false,
          message: `Erro ao buscar livros`,
          statusCode: err.statusCode ?? 500,
          errors: [this.error],
        }
      } finally {
        this.loading = false
      }
    },
  },
})
