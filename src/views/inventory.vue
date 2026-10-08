<template>
  <div class="container">
    <h1>Gasoline Inventory</h1>
    <p class="subtitle">Manage your gasoline products</p>

    <div class="card">
      <h2>{{ editingId ? 'Edit Gasoline' : 'Add Gasoline' }}</h2>

      <form @submit.prevent="saveProduct">
        <div class="form-grid">

          <div>
            <label>Fuel Type</label>

            <select v-model="form.name" required>
              <option value="">Select Fuel Type</option>
              <option>Regular Gasoline</option>
              <option>Premium Gasoline</option>
              <option>Diesel</option>
            </select>
          </div>

          <div>
            <label>Price per Liter</label>

            <input
              type="number"
              step="0.01"
              v-model="form.price"
              required
            />
          </div>

          <div>
            <label>Stock (Liters)</label>

            <input
              type="number"
              step="0.01"
              v-model="form.stock"
              required
            />
          </div>

        </div>

        <div class="form-buttons">
          <button class="btn" type="submit">
            {{ editingId ? 'Update Product' : 'Add Product' }}
          </button>

          <button
            v-if="editingId"
            type="button"
            class="btn secondary"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="table-header">
        <h2>Inventory List</h2>

        <input
          class="search"
          type="text"
          v-model="search"
          placeholder="Search gasoline..."
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fuel Type</th>
            <th>Price/Liter</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="product in filteredProducts"
            :key="product.id"
          >
            <td>{{ product.id }}</td>

            <td>{{ product.name }}</td>

            <td>
              ₱{{ Number(product.price).toFixed(2) }}
            </td>

            <td>{{ product.stock }} L</td>

            <td>
              <span
                :class="
                  product.stock <= 100
                    ? 'badge low'
                    : 'badge available'
                "
              >
                {{ product.stock <= 100 ? 'Low Stock' : 'Available' }}
              </span>
            </td>

            <td>
              <button
                class="edit-btn"
                @click="editProduct(product)"
              >
                Edit
              </button>

              <button
                class="delete-btn"
                @click="deleteProduct(product.id)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="filteredProducts.length === 0">
            <td colspan="6" class="empty">
              No gasoline products found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const products = ref(
  JSON.parse(localStorage.getItem('gasolineProducts')) || [
    {
      id: 1,
      name: 'Regular Gasoline',
      price: 58.50,
      stock: 500
    },
    {
      id: 2,
      name: 'Premium Gasoline',
      price: 65.20,
      stock: 350
    },
    {
      id: 3,
      name: 'Diesel',
      price: 55.80,
      stock: 150
    }
  ]
)

const form = ref({
  name: '',
  price: '',
  stock: ''
})

const editingId = ref(null)
const search = ref('')

function saveData() {
  localStorage.setItem(
    'gasolineProducts',
    JSON.stringify(products.value)
  )
}

function saveProduct() {
  if (
    !form.value.name ||
    form.value.price === '' ||
    form.value.stock === ''
  ) {
    alert('Please complete all fields.')
    return
  }

  if (editingId.value) {
    const product = products.value.find(
      item => item.id === editingId.value
    )

    product.name = form.value.name
    product.price = Number(form.value.price)
    product.stock = Number(form.value.stock)

    alert('Product updated successfully.')
  } else {
    const newProduct = {
      id: Date.now(),
      name: form.value.name,
      price: Number(form.value.price),
      stock: Number(form.value.stock)
    }

    products.value.push(newProduct)

    alert('Product added successfully.')
  }

  saveData()
  resetForm()
}

function editProduct(product) {
  editingId.value = product.id

  form.value = {
    name: product.name,
    price: product.price,
    stock: product.stock
  }

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

function deleteProduct(id) {
  const confirmed = confirm(
    'Are you sure you want to delete this product?'
  )

  if (!confirmed) {
    return
  }

  products.value = products.value.filter(
    product => product.id !== id
  )

  saveData()

  alert('Product deleted successfully.')
}

function resetForm() {
  form.value = {
    name: '',
    price: '',
    stock: ''
  }

  editingId.value = null
}

function cancelEdit() {
  resetForm()
}

const filteredProducts = computed(() => {
  return products.value.filter(product =>
    product.name
      .toLowerCase()
      .includes(search.value.toLowerCase())
  )
})
</script>