import { IResponse } from '../../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../../@Interface/models/IMockBook'
import { IMockBookAuthor } from '../../../@Interface/models/IMockAuthors'

interface BookEditData {
  id: number
  title: string
  publishDate: string
  author: IMockBookAuthor
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_ERROR = false // caso queira simular erro, deixar true
const DELAY_MS = 1500 // tempo de delay em milissegundos (1.5 segundos)

export async function useEditBookApi(
  bookData: BookEditData,
): Promise<IResponse<IMockBook>> {
  try {
    // Simular loading com delay
    await delay(DELAY_MS)

    if (MOCK_ERROR) {
      return {
        data: null,
        success: false,
        message: 'Erro ao editar livro',
        statusCode: 500,
        errors: [
          'Falha na conexão com o servidor',
          'Timeout na requisição após 30s',
          'Erro ao processar atualização do livro',
        ],
        meta: { total: 0, page: 1, perPage: 0 },
      }
    }

    const updatedBook: IMockBook = {
      id: bookData.id,
      title: bookData.title,
      publicationDate: bookData.publishDate,
      author: [bookData.author],
    }

    const response: IResponse<IMockBook> = {
      data: [updatedBook],
      success: true,
      message: 'Livro atualizado com sucesso!',
      statusCode: 200,
      errors: [],
      meta: {
        total: 1,
        page: 1,
        perPage: 1,
      },
    }

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    const errorResponse: IResponse<IMockBook> = {
      data: null,
      success: false,
      message: `Erro ao editar livro: ${message}`,
      statusCode: 500,
      errors: [message],
      meta: { total: 0, page: 1, perPage: 0 },
    }

    return errorResponse
  }
}
