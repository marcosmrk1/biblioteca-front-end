import { IResponse } from '../../../@Interface/apiInterface/IResponse'
import { IMockBook } from '../../../@Interface/models/IMockBook'
import { IMockBookAuthor } from '../../../@Interface/models/IMockAuthors'

interface BookFormData {
  title: string
  publishDate: string
  author: IMockBookAuthor
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const MOCK_ERROR = false
const DELAY_MS = 1500

export async function usePostBookApi(
  bookData: BookFormData,
): Promise<IResponse<IMockBook>> {
  try {
    await delay(DELAY_MS)

    if (MOCK_ERROR) {
      return {
        data: null,
        success: false,
        message: 'Erro ao cadastrar livro',
        statusCode: 500,
        errors: [
          'Falha na conexão com o servidor',
          'Timeout na requisição após 30s',
          'Erro ao processar dados do livro',
        ],
        meta: { total: 0, page: 1, perPage: 0 },
      }
    }

    const newId = Date.now()

    const newBook: IMockBook = {
      id: newId,
      title: bookData.title,
      publicationDate: bookData.publishDate,
      author: [bookData.author],
    }

    const response: IResponse<IMockBook> = {
      data: [newBook],
      success: true,
      message: 'Livro cadastrado com sucesso!',
      statusCode: 201,
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
      message: `Erro ao cadastrar livro: ${message}`,
      statusCode: 500,
      errors: [message],
      meta: { total: 0, page: 1, perPage: 0 },
    }

    return errorResponse
  }
}
