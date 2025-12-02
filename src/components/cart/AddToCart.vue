<template>
  <div class="add-to-cart-section">
    <!-- Size Selection -->
    <div class="size-selection" v-if="availableSizes?.length > 0">
      <label>Chọn size:</label>
      <div class="size-options">
        <button 
          v-for="size in availableSizes" 
          :key="size.id"
          :class="['size-option', { active: selectedSize?.id === size.id }]"
          @click="selectedSize = size"
        >
          {{ size.name }}
        </button>
      </div>
    </div>

    <!-- Quantity Selection -->
    <div class="quantity-selection">
      <label>Số lượng:</label>
      <div class="quantity-controls">
        <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
        <input type="number" v-model="quantity" min="1" max="99" />
        <button @click="increaseQuantity" :disabled="quantity >= 99">+</button>
      </div>
    </div>

    <!-- Add to Cart Button -->
    <button 
      class="add-to-cart-btn" 
      @click="handleAddToCart"
      :disabled="!selectedSize || loading || !authStore.isAuthenticated"
    >
      <i class="fas fa-shopping-cart" v-if="!loading"></i>
      <i class="fas fa-spinner fa-spin" v-if="loading"></i>
      {{ loading ? 'Đang thêm...' : 'Thêm vào giỏ hàng' }}
    </button>

    <!-- Login prompt -->
    <p v-if="!authStore.isAuthenticated" class="login-prompt">
      <router-link to="/login">Đăng nhập</router-link> để thêm vào giỏ hàng
    </p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import { useCartStore } from '../../stores/store';
import { useAuthStore } from '../../stores/store';

const props = defineProps({
  productId: {
    type: Number,
    required: true
  },
  availableSizes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['added']);

const cartStore = useCartStore();
const authStore = useAuthStore();

const selectedSize = ref(null);
const quantity = ref(1);
const loading = ref(false);

const increaseQuantity = () => {
  if (quantity.value < 99) {
    quantity.value++;
  }
};

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = async () => {
  if (!authStore.isAuthenticated) {
    return;
  }
  
  if (!selectedSize.value) {
    alert('Vui lòng chọn size');
    return;
  }

  try {
    loading.value = true;
    await cartStore.addToCart(props.productId, selectedSize.value.id, quantity.value);
    
    // Show success message
    alert(`Đã thêm ${quantity.value} sản phẩm size ${selectedSize.value.name} vào giỏ hàng!`);
    
    // Emit event to parent component
    emit('added', {
      productId: props.productId,
      sizeId: selectedSize.value.id,
      quantity: quantity.value
    });
    
  } catch (error) {
    console.error('Error adding to cart:', error);
    alert('Có lỗi xảy ra khi thêm vào giỏ hàng: ' + (error.message || 'Vui lòng thử lại'));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.add-to-cart-section {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
}

.size-selection, .quantity-selection {
  margin-bottom: 20px;
}

.size-selection label, .quantity-selection label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

.size-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.size-option {
  padding: 8px 16px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.size-option:hover {
  border-color: #007bff;
}

.size-option.active {
  border-color: #007bff;
  background-color: #007bff;
  color: white;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover:not(:disabled) {
  background-color: #f8f9fa;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-controls input {
  width: 60px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.add-to-cart-btn {
  width: 100%;
  padding: 12px 24px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.add-to-cart-btn:hover:not(:disabled) {
  background-color: #218838;
}

.add-to-cart-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  margin-top: 10px;
  color: #666;
}

.login-prompt a {
  color: #007bff;
  text-decoration: none;
}

.login-prompt a:hover {
  text-decoration: underline;
}
</style>