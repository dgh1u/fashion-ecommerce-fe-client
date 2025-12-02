<template>
  <div class="cart-icon" @click="goToCart">
    <ShoppingBasket :size="25" />
    <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { ShoppingBasket } from 'lucide-vue-next';
import { useCartStore } from '../../stores/store';
import { useAuthStore } from '../../stores/store';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const cartItemCount = computed(() => cartStore.cartItemCount);

const goToCart = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  router.push('/cart');
};

// Load cart khi component mount (chỉ khi đã đăng nhập)
onMounted(() => {
  if (authStore.isAuthenticated) {
    cartStore.fetchCart();
  }
});
</script>

<style scoped>
.cart-icon {
  position: relative;
  cursor: pointer;
  padding: 10px;
  color: white;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-icon:hover {
  color: #007bff;
}

.cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}
</style>