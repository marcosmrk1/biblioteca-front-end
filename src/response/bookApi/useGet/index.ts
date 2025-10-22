import { IResponse } from '../../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../../@Interface/models/IMockBook'

export const dataMockBooks: IMockBook[] = [
  {
    id: 1,
    title: '1984',
    author: [
      {
        name: 'George Orwell',
        id: 1,
      },
    ],
    publicationDate: '1949-06-08',
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: [{ id: 1, name: 'Harper Lee' }],
    publicationDate: '1960-07-11',
  },
  {
    id: 3,
    title: 'The Great Gatsby',
    author: [{ id: 2, name: 'F. Scott Fitzgerald' }],
    publicationDate: '1925-04-10',
  },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
const MOCK_ERROR = false //caso queira simular erro, deixar true

export async function useGetBookApi(): Promise<IResponse<IMockBook>> {
  await delay(2000)
  try {
    if (MOCK_ERROR) {
      return {
        data: null,
        success: false,
        message: 'Erro ao buscar livros',
        statusCode: 500,
        errors: [
          'Falha na conexão com o servidor',
          'Timeout na requisição após 30s',
          'Banco de dados indisponível',
        ],
      }
    }
    const response: IResponse<IMockBook> = {
      data: dataMockBooks,
      success: true,
      message: 'Busca de livros realizada com sucesso',
      statusCode: 200,
      errors: [],
      meta: {
        total: dataMockBooks.length,
        page: 1,
        perPage: dataMockBooks.length,
      },
    }

    return response

    // return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    const errorResponse: IResponse<IMockBook> = {
      data: null,
      success: false,
      message: `Erro ao buscar livros: ${message}`,
      statusCode: 500,
      errors: [message],
      meta: { total: 0, page: 1, perPage: 0 },
    }

    return errorResponse
  }
}
