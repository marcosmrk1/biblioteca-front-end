<script setup>
  import { reactive, ref } from 'vue'

  const props = defineProps({
    buttonCancel: {
      type: Object,
      default: () => ({
        text: 'Cancelar',
        func: null,
      }),
    },
    buttonSave: {
      type: Object,
      default: () => ({
        text: 'Salvar',
        func: null,
      }),
    },
  })
</script>
<script>
  export default {
    name: 'formBook',
    data() {
      return {
        book: {
          title: '',
          publishDate: '',
          authorId: '',
        },
        authors: [
          // Aqui você deve carregar a lista de autores da sua API
          // Exemplo:
          { id: 1, name: 'Gabriel García Márquez' },
          { id: 2, name: 'Machado de Assis' },
          { id: 3, name: 'Clarice Lispector' },
        ],
      }
    },
    methods: {
      submitForm() {
        // Validar formulário
        if (this.validateForm()) {
          // Emitir evento para o componente pai com os dados do livro
          this.$emit('save-book', { ...this.book })

          // Limpar formulário após envio bem-sucedido
          this.resetForm()
        }
      },
      resetForm() {
        this.book = {
          title: '',
          publishDate: '',
          authorId: '',
        }
      },
      validateForm() {
        // Aqui você pode adicionar validações adicionais se necessário
        return true
      },
    },
    // Se precisar carregar os autores de uma API:
    // created() {
    //   this.fetchAuthors();
    // },
    // methods: {
    //   async fetchAuthors() {
    //     try {
    //       const response = await fetch('sua-api/authors');
    //       this.authors = await response.json();
    //     } catch (error) {
    //       console.error('Erro ao carregar autores:', error);
    //     }
    //   }
    // }
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
          required
        />
      </div>

      <div class="form-group">
        <label for="author">Autor</label>
        <select id="author" v-model="book.authorId" class="form-control" required>
          <option value="" disabled>Selecione um autor</option>
          <option v-for="author in authors" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Salvar</button>
        <button type="button" class="btn btn-secondary" @click="resetForm">
          Cancelar
        </button>
      </div>
    </form>
  </div>
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
