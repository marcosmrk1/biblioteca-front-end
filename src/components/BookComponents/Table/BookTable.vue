<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { OPEN_MODAL_FORM_BOOK } from '../../../@URLParams/BookParams'
  import ModalGeneric from '../../../GenericComponents/ModalGeneric.vue'
  import BookForm from '../Form/BookForm.vue'
  import { useBooksStore } from '../../../api/store/bookStore/useGetBookStore'
  import { IResponse } from '../../../@Interface/apiInterface/IResponse'
  import { IMockBook } from '../../../@Interface/models/IMockBook'

  const router = useRouter()
  const route = useRoute()
  const showModal = ref(false)
  const dataForBooks = ref<IResponse<IMockBook> | null>(null)
  watch(
    () => route.query[OPEN_MODAL_FORM_BOOK],
    (val) => {
      showModal.value = val === 'true'
    },
    { immediate: true },
  )
  const booksStore = useBooksStore()

  onMounted(async () => {
    const response = await booksStore.loadBooks()
    dataForBooks.value = response
  })

  function openModalFormBook() {
    router.push({
      query: {
        ...route.query,
        [OPEN_MODAL_FORM_BOOK]: 'true',
      },
    })
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
        <tr>
          <td>Dom Casmurro</td>
          <td>1899</td>
          <td>Machado de Assis</td>
        </tr>
        <tr>
          <td>O Pequeno Príncipe</td>
          <td>1943</td>
          <td>Antoine de Saint-Exupéry</td>
        </tr>
        <tr>
          <td>Capitães da Areia</td>
          <td>1937</td>
          <td>Jorge Amado</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <ModalGeneric :model-value="showModal" :name-modal="OPEN_MODAL_FORM_BOOK">
      <BookForm />
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
