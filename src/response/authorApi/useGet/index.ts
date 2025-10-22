import { IResponse } from '../../../@Interface/apiInterface/IResponse'
import { IMockBookAuthor } from '../../../@Interface/models/IMockAuthors'

const dataMockAuthors: IMockBookAuthor[] = [
  {
    id: 1,
    name: 'George Orwell',
  },
  {
    id: 2,
    name: 'Harper Lee',
  },
  {
    id: 3,
    name: 'F. Scott Fitzgerald',
  },
  {
    id: 4,
    name: 'J.K. Rowling',
  },
  {
    id: 5,
    name: 'J.R.R. Tolkien',
  },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_ERROR = false
const DELAY_MS = 1000

export async function useGetAuthorApi(): Promise<IResponse<IMockBookAuthor>> {
  try {
    await delay(DELAY_MS)

    if (MOCK_ERROR) {
      return {
        data: null,
        success: false,
        message: 'Erro ao buscar autores',
        statusCode: 500,
        errors: [
          'Falha na conexão com o servidor',
          'Timeout na requisição após 30s',
          'Serviço de autores indisponível',
        ],
        meta: { total: 0, page: 1, perPage: 0 },
      }
    }

    const response: IResponse<IMockBookAuthor> = {
      data: dataMockAuthors,
      success: true,
      message: 'Busca de autores realizada com sucesso',
      statusCode: 200,
      errors: [],
      meta: {
        total: dataMockAuthors.length,
        page: 1,
        perPage: dataMockAuthors.length,
      },
    }

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    const errorResponse: IResponse<IMockBookAuthor> = {
      data: null,
      success: false,
      message: `Erro ao buscar autores: ${message}`,
      statusCode: 500,
      errors: [message],
      meta: { total: 0, page: 1, perPage: 0 },
    }

    return errorResponse
  }
}
