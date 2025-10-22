<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'
  import { useAuthorsStore } from '../../../store/authorStore/useGetAuthorStore'
  import { usePostBookStore } from '../../../store/bookStore/usePostBookStore'
  import { useEditBookStore } from '../../../store/bookStore/useEditBookStore'
  import { useBooksStore } from '../../../store/bookStore/useGetBookStore'
  import LoadingGeneric from '../../../GenericComponents/LoadingGeneric.vue'
  import AlertGeneric from '../../../GenericComponents/AlertGeneric.vue'
  import { IMockBook } from '../../../@Interface/models/IMockBook'

  interface Props {
    buttonCancel?: {
      text: string
      func: (() => void) | null
    }
    buttonSave?: {
      text: string
      func: (() => void) | null
    }
    bookToEdit?: IMockBook | null
  }

  const props = withDefaults(defineProps<Props>(), {
    buttonCancel: () => ({
      text: 'Cancelar',
      func: null,
    }),
    buttonSave: () => ({
      text: 'Salvar',
      func: null,
    }),
    bookToEdit: null,
  })

  const authorsStore = useAuthorsStore()
  const postBookStore = usePostBookStore()
  const editBookStore = useEditBookStore()
  const booksStore = useBooksStore()

  const showToastError = ref(false)
  const showToastSuccess = ref(false)
  const isEditMode = ref(false)
  const authorSelectRef = ref<HTMLSelectElement | null>(null)

  const book = ref({
    id: null as number | null,
    title: '',
    publishDate: '',
    authorId: null as number | null,
  })

  onMounted(async () => {
    await authorsStore.loadAuthors()

    if (!authorsStore.success && !authorsStore.loading) {
      showToastError.value = true
    }

    if (props.bookToEdit) {
      loadBookData(props.bookToEdit)
    }

    setupCustomValidationMessages()
  })

  function setupCustomValidationMessages() {
    setTimeout(() => {
      const titleInput = document.getElementById('title') as HTMLInputElement
      const dateInput = document.getElementById('publishDate') as HTMLInputElement

      if (titleInput) {
        titleInput.addEventListener('invalid', () => {
          titleInput.setCustomValidity('Preencha este campo.')
        })
        titleInput.addEventListener('input', () => {
          titleInput.setCustomValidity('')
        })
      }

      if (dateInput) {
        dateInput.addEventListener('invalid', () => {
          dateInput.setCustomValidity('Preencha este campo.')
        })
        dateInput.addEventListener('change', () => {
          dateInput.setCustomValidity('')
        })
      }

      if (authorSelectRef.value) {
        authorSelectRef.value.addEventListener('invalid', () => {
          authorSelectRef.value?.setCustomValidity('Selecione um  autor para cadastrar.')
        })
        authorSelectRef.value.addEventListener('change', () => {
          authorSelectRef.value?.setCustomValidity('')
        })
      }
    }, 100)
  }

  watch(
    () => props.bookToEdit,
    (newBook) => {
      if (newBook) {
        loadBookData(newBook)
      } else {
        resetForm()
      }
    },
  )

  function loadBookData(bookData: IMockBook) {
    isEditMode.value = true
    book.value = {
      id: bookData.id,
      title: bookData.title,
      publishDate: bookData.publicationDate,
      authorId: bookData.author[0]?.id || null,
    }
  }

  async function submitForm() {
    if (!validateForm()) return

    const selectedAuthor = authorsStore.data?.find(
      (author) => author.id === book.value.authorId,
    )

    if (!selectedAuthor) {
      const activeStore = isEditMode.value ? editBookStore : postBookStore
      activeStore.message = 'Autor não encontrado'
      activeStore.errors = ['Selecione um autor válido']
      showToastError.value = true
      return
    }

    let response

    if (isEditMode.value && book.value.id) {
      response = await editBookStore.editBook({
        id: book.value.id,
        title: book.value.title,
        publishDate: book.value.publishDate,
        author: selectedAuthor,
      })
    } else {
      response = await postBookStore.createBook({
        title: book.value.title,
        publishDate: book.value.publishDate,
        author: selectedAuthor,
      })
    }

    if (response.success) {
      showToastSuccess.value = true
      resetForm()

      await booksStore.loadBooks()

      if (props.buttonCancel.func) {
        setTimeout(() => {
          props.buttonCancel.func?.()
        }, 1500)
      }
    } else {
      showToastError.value = true
    }
  }

  function resetForm() {
    isEditMode.value = false
    book.value = {
      id: null,
      title: '',
      publishDate: '',
      authorId: null,
    }
  }

  function validateForm() {
    return book.value.title && book.value.publishDate && book.value.authorId
  }

  function closeToastError() {
    showToastError.value = false
  }

  function closeToastSuccess() {
    showToastSuccess.value = false
  }

  const formTitle = computed(() =>
    isEditMode.value ? 'Editar Livro' : 'Cadastro de Livro',
  )
  const saveButtonText = computed(() => {
    if (isEditMode.value) {
      return editBookStore.loading ? 'Atualizando...' : 'Atualizar'
    }
    return postBookStore.loading ? 'Salvando...' : 'Salvar'
  })
  const isLoading = computed(
    () => postBookStore.loading || editBookStore.loading || authorsStore.loading,
  )
  const activeStore = computed(() => (isEditMode.value ? editBookStore : postBookStore))
</script>

<template>
  <div class="book-form">
    <h2>{{ formTitle }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Título do Livro <span class="required">*</span></label>
        <input
          type="text"
          id="title"
          v-model="book.title"
          class="form-control"
          :disabled="isLoading"
          required
          placeholder="Digite o título do livro"
        />
      </div>

      <div class="form-group">
        <label for="publishDate"
          >Data de Publicação <span class="required">*</span></label
        >
        <input
          type="date"
          id="publishDate"
          v-model="book.publishDate"
          class="form-control"
          :disabled="isLoading"
          required
        />
      </div>

      <div class="form-group">
        <label for="author">Autor <span class="required">*</span></label>
        <div v-if="authorsStore.loading" class="select-loading">
          <LoadingGeneric size="small" message="Carregando autores..." />
        </div>
        <div v-else-if="!authorsStore.success" class="select-error">
          <p style="color: red; margin: 0">❌ Erro ao carregar autores</p>
        </div>
        <select
          v-else
          id="author"
          ref="authorSelectRef"
          v-model="book.authorId"
          class="form-control"
          :disabled="isLoading"
          required
        >
          <option value="" disabled selected>Selecione um autor</option>
          <option
            v-for="author in authorsStore.data"
            :key="author.id"
            :value="author.id"
          >
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="authorsStore.loading || !authorsStore.success || isLoading"
        >
          {{ saveButtonText }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="props.buttonCancel.func?.()"
          :disabled="isLoading"
        >
          {{ buttonCancel.text }}
        </button>
      </div>
    </form>
  </div>

  <AlertGeneric
    v-if="showToastError"
    type="error"
    :message="activeStore.message || authorsStore.message"
    :errors="activeStore.errors.length > 0 ? activeStore.errors : authorsStore.errors"
    :duration="5000"
    @close="closeToastError"
  />

  <AlertGeneric
    v-if="showToastSuccess"
    type="success"
    :message="activeStore.message"
    :duration="3000"
    @close="closeToastSuccess"
  />
</template>

<style scoped>
  .book-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }

  .form-group {
    margin-bottom: 15px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }

  .required {
    color: #ef4444;
    font-weight: bold;
  }

  .field-hint {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
  }

  .form-control {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .form-control:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }

  .select-loading,
  .select-error {
    padding: 10px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #f9f9f9;
  }

  .form-actions {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    width: 100%;
    flex-direction: row-reverse;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-primary {
    background-color: #4caf50;
    color: white;
  }

  .btn-secondary {
    background-color: #f1f1f1;
    color: #333;
  }
</style>
