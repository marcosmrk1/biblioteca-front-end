import { defineStore } from 'pinia'
import { useGetAuthorApi } from '../../response/authorApi/useGet'
import { IResponse } from '../../@Interface/apiInterface/IResponse'
import { IMockBookAuthor } from '../../@Interface/models/IMockAuthors'

export const useAuthorsStore = defineStore('authors', {
  state: (): IResponse<IMockBookAuthor> => ({
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
    async loadAuthors() {
      this.loading = true

      try {
        const response = await useGetAuthorApi()

        this.data = response.data
        this.success = response.success
        this.message = response.message
        this.errors = response.errors || []
        this.statusCode = response.statusCode
        this.meta = response.meta

        console.log('Authors loaded:', response)
        return response
      } catch (err) {
        console.log('Error loading authors:', err)

        const errorMessage = err instanceof Error ? err.message : String(err)

        this.data = null
        this.success = false
        this.message = 'Erro ao buscar autores'
        this.errors = [errorMessage, 'Erro ao se comunicar com a API']
        this.statusCode = 500

        return {
          data: null,
          success: false,
          message: 'Erro ao buscar autores',
          statusCode: 500,
          errors: [errorMessage, 'Erro ao se comunicar com a API'],
        }
      } finally {
        this.loading = false
      }
    },
  },
})
