<template>
  <div class="container">
    <h1>Sales</h1>
    <p class="subtitle">Record gasoline sales</p>

    <div class="card">
      <h2>New Sale</h2>

      <form @submit.prevent="addSale">

        <div class="form-grid">

          <div>
            <label>Fuel Type</label>

            <select v-model="sale.productId" required>
              <option value="">Select Fuel</option>

              <option
                v-for="product in products"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </option>
            </select>
          </div>

          <div>
            <label>Liters</label>

            <input
              type="number"
              step="0.01"
              min="1"
              v-model="sale.liters"
              required
            />
          </div>

        </div>

        <div class="sale-total">
          Total:
          <strong>₱{{ saleTotal.toFixed(2) }}</strong>
        </div>

        <button class="btn" type="submit">
          Record Sale
        </button>
      </form>
    </div>

    <div class="card">
      <h2>Sales Records</h2>

      <table>
        <thead>
          <tr>
            <th>Fuel</th>
            <th>Liters</th>
            <th>Price/Liter</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="sale in sales" :key="sale.id">
            <td>{{ sale.productName }}</td>

            <td>{{ sale.liters }} L</td>

            <td>
              ₱{{ Number(sale.price).toFixed(2) }}
            </td>

            <td>
              ₱{{ Number(sale.total).toFixed(2) }}
            </td>

            <td>
              <button
                class="delete-btn"
                @click="deleteSale(sale.id)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="sales.length === 0">
            <td colspan="5" class="empty">
              No sales records.
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
  JSON.parse(localStorage.getItem('gasolineProducts')) || []
)

const sales = ref(
  JSON.parse(localStorage.getItem('gasolineSales')) || []
)

const sale = ref({
  productId: '',
  liters: ''
})

const selectedProduct = computed(() => {
  return products.value.find(
    product => product.id == sale.value.productId
  )
})

const saleTotal = computed(() => {
  if (!selectedProduct.value || !sale.value.liters) {
    return 0
  }

  return (
    Number(selectedProduct.value.price) *
    Number(sale.value.liters)
  )
})

function saveProducts() {
  localStorage.setItem(
    'gasolineProducts',
    JSON.stringify(products.value)
  )
}

function saveSales() {
  localStorage.setItem(
    'gasolineSales',
    JSON.stringify(sales.value)
  )
}

function addSale() {
  if (!selectedProduct.value) {
    alert('Please select a fuel type.')
    return
  }

  const liters = Number(sale.value.liters)

  if (liters <= 0) {
    alert('Enter a valid number of liters.')
    return
  }

  if (liters > selectedProduct.value.stock) {
    alert('Not enough stock available.')
    return
  }

  selectedProduct.value.stock -= liters

  const newSale = {
    id: Date.now(),
    productName: selectedProduct.value.name,
    liters: liters,
    price: selectedProduct.value.price,
    total: saleTotal.value
  }

  sales.value.push(newSale)

  saveProducts()
  saveSales()

  sale.value = {
    productId: '',
    liters: ''
  }

  alert('Sale recorded successfully.')
}

function deleteSale(id) {
  const confirmed = confirm(
    'Delete this sales record?'
  )

  if (!confirmed) {
    return
  }

  sales.value = sales.value.filter(
    item => item.id !== id
  )

  saveSales()
}
</script>