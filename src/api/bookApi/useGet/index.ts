import { IResponse } from '../../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../../@Interface/models/IMockBook'

const dataMockBooks: IMockBook[] = [
  { id: 1, title: '1984', author: 'George Orwell' },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
]

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function useGetBookApi(): Promise<IResponse<IMockBook>> {
  try {
    // simula tempo de rede
    await delay(500)

    // retorna mock
    return {
      data: [...dataMockBooks],
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
  } catch (error: unknown) {
    // tratamento seguro de erro
    const message = error instanceof Error ? error.message : String(error)
    return {
      data: [],
      success: false,
      message: `Erro ao buscar livros: ${message}`,
      statusCode: 500,
      errors: [message],
      meta: { total: 0, page: 1, perPage: 0 },
    }
  }
}
