<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useAuthorsStore } from '../../../store/authorStore/useGetAuthorStore'
  import { usePostBookStore } from '../../../store/bookStore/usePostBookStore'
  import { useBooksStore } from '../../../store/bookStore/useGetBookStore'
  import LoadingGeneric from '../../../GenericComponents/LoadingGeneric.vue'
  import AlertGeneric from '../../../GenericComponents/AlertGeneric.vue'

  interface Props {
    buttonCancel?: {
      text: string
      func: (() => void) | null
    }
    buttonSave?: {
      text: string
      func: (() => void) | null
    }
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
  })

  const authorsStore = useAuthorsStore()
  const postBookStore = usePostBookStore()
  const booksStore = useBooksStore()

  const showToastError = ref(false)
  const showToastSuccess = ref(false)

  const book = ref({
    title: '',
    publishDate: '',
    authorId: null as number | null,
  })

  onMounted(async () => {
    await authorsStore.loadAuthors()

    if (!authorsStore.success && !authorsStore.loading) {
      showToastError.value = true
    }
  })

  async function submitForm() {
    if (!validateForm()) return

    const selectedAuthor = authorsStore.data?.find(
      (author) => author.id === book.value.authorId,
    )

    if (!selectedAuthor) {
      postBookStore.message = 'Autor não encontrado'
      postBookStore.errors = ['Selecione um autor válido']
      showToastError.value = true
      return
    }

    // Enviar objeto completo do autor
    const response = await postBookStore.createBook({
      title: book.value.title,
      publishDate: book.value.publishDate,
      author: selectedAuthor,
    })

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
    book.value = {
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
</script>

<template>
  <div class="book-form">
    <h2>Cadastro de Livro</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Título do Livro</label>
        <input
          type="text"
          id="title"
          v-model="book.title"
          class="form-control"
          :disabled="postBookStore.loading"
          required
        />
      </div>

      <div class="form-group">
        <label for="publishDate">Data de Publicação</label>
        <input
          type="date"
          id="publishDate"
          v-model="book.publishDate"
          class="form-control"
          :disabled="postBookStore.loading"
          required
        />
      </div>

      <div class="form-group">
        <label for="author">Autor</label>
        <div v-if="authorsStore.loading" class="select-loading">
          <LoadingGeneric size="small" message="Carregando autores..." />
        </div>
        <div v-else-if="!authorsStore.success" class="select-error">
          <p style="color: red; margin: 0">❌ Erro ao carregar autores</p>
        </div>
        <select
          v-else
          id="author"
          v-model="book.authorId"
          class="form-control"
          :disabled="postBookStore.loading"
          required
        >
          <option :value="null" disabled>Selecione um autor</option>
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
          :disabled="
            authorsStore.loading || !authorsStore.success || postBookStore.loading
          "
        >
          <span v-if="postBookStore.loading">Salvando...</span>
          <span v-else>{{ buttonSave.text }}</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetForm"
          :disabled="authorsStore.loading || postBookStore.loading"
        >
          {{ buttonCancel.text }}
        </button>
      </div>
    </form>
  </div>

  <AlertGeneric
    v-if="showToastError"
    type="error"
    :message="postBookStore.message || authorsStore.message"
    :errors="
      postBookStore.errors.length > 0 ? postBookStore.errors : authorsStore.errors
    "
    :duration="5000"
    @close="closeToastError"
  />

  <AlertGeneric
    v-if="showToastSuccess"
    type="success"
    :message="postBookStore.message"
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
