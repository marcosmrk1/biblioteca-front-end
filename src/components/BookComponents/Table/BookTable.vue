<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { OPEN_MODAL_FORM_BOOK } from '../../../@URLParams/BookParams'
  import ModalGeneric from '../../../GenericComponents/ModalGeneric.vue'
  import BookForm from '../Form/BookForm.vue'
  import AlertGeneric from '../../../GenericComponents/AlertGeneric.vue'
  import { useBooksStore } from '../../../store/bookStore/useGetBookStore'
  import LoadingGeneric from '../../../GenericComponents/LoadingGeneric.vue'

  const router = useRouter()
  const route = useRoute()
  const showModal = ref(false)
  const showToast = ref(false)

  watch(
    () => route.query[OPEN_MODAL_FORM_BOOK],
    (val) => {
      showModal.value = val === 'true'
    },
    { immediate: true },
  )

  const booksStore = useBooksStore()

  onMounted(async () => {
    await booksStore.loadBooks()

    if (!booksStore.success && !booksStore.loading) {
      showToast.value = true
    }
  })

  function openModalFormBook() {
    router.push({
      query: {
        ...route.query,
        [OPEN_MODAL_FORM_BOOK]: 'true',
      },
    })
  }

  function closeToast() {
    showToast.value = false
  }

  function closeModal() {
    router.push({
      query: {
        ...route.query,
        [OPEN_MODAL_FORM_BOOK]: undefined,
      },
    })
  }

  // Função para formatar autores
  function formatAuthors(authors: Array<{ id: number; name: string }>) {
    return authors.map((author) => author.name).join(', ')
  }
</script>

<template>
  <div class="table-container">
    <button class="button-form-book" @click="openModalFormBook">Novo Livro</button>
    <table class="book-table">
      <thead>
        <tr>
          <th>Título do Livro</th>
          <th>Data de Publicação</th>
          <th>Autores</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="booksStore.loading">
          <td colspan="3" style="text-align: center; padding: 20px">
            <LoadingGeneric message="Carregando livros..." />
          </td>
        </tr>
        <tr v-else-if="!booksStore.success">
          <td colspan="3" style="text-align: center; padding: 20px; color: red">
            ⚠️ Erro ao carregar livros
          </td>
        </tr>
        <tr v-else-if="!booksStore.data || booksStore.data.length === 0">
          <td colspan="3" style="text-align: center; padding: 20px">
            Nenhum livro encontrado
          </td>
        </tr>
        <tr v-else v-for="book in booksStore.data" :key="book.id">
          <td>{{ book.title }}</td>
          <td>{{ book.publicationDate }}</td>
          <td>{{ formatAuthors(book.author) }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <AlertGeneric
    v-if="showToast"
    type="error"
    :message="booksStore.message"
    :errors="booksStore.errors"
    :duration="5000"
    @close="closeToast"
  />

  <div>
    <ModalGeneric :model-value="showModal" :name-modal="OPEN_MODAL_FORM_BOOK">
      <BookForm
        :button-cancel="{
          text: 'Cancelar',
          func: closeModal,
        }"
      />
    </ModalGeneric>
  </div>
</template>

<style scoped>
  .table-container {
    max-width: 800px;
    margin: 32px auto;
    padding: 16px;
    background: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .button-form-book {
    background-color: #1976d2;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 16px;
  }
  .button-form-book:active {
    background-color: #115293;
  }
  .book-table {
    width: 100%;
    border-collapse: collapse;
    font-family: Arial, sans-serif;
  }
  .book-table th,
  .book-table td {
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }
  .book-table th {
    background: #1976d2;
    color: #fff;
    font-weight: bold;
  }
  .book-table tr:nth-child(even) {
    background: #f1f7ff;
  }
</style>
