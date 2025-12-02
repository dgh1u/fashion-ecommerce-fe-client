<template>
  <div class="min-h-screen bg-gray-50 py-5">
    <div class="max-w-7xl mx-auto px-5">
      <div class="flex justify-between text-2xl font-bold items-center mb-8">
        <span class="text-gray-800 ">Thanh toán</span>
        <router-link to="/cart" class="text-blue-600 text-base no-underline font-medium hover:underline">
         Quay lại giỏ hàng
        </router-link>
      </div>

      <!-- Loading -->
      <div v-if="cartStore.loading" class="text-center py-12 text-lg text-gray-600">
       Đang tải...
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
       
        <h3 class="text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h3>
        <p class="text-gray-600 mb-5">Không thể tiến hành thanh toán với giỏ hàng trống.</p>
        <router-link to="/product/clothing" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-center cursor-pointer border-0 transition-all duration-300 ease-in-out rounded hover:bg-blue-700 no-underline">
          Khám phá sản phẩm
        </router-link>
      </div>

      <!-- Checkout Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
        <!-- Order Summary -->
        <div class="bg-white rounded-lg shadow-sm p-5 h-fit sticky top-5">
          <h3 class=" mb-5 text-gray-800">Đơn hàng của bạn</h3>
          <div class="mb-5">
            <div 
              v-for="item in cartItems" 
              :key="item.cartItemId" 
              class="flex gap-3 py-3 border-b border-gray-200 last:border-b-0"
            >
              <div class="flex-shrink-0">
                <img 
                  :src="getImageUrl(item.productImage)" 
                  :alt="item.productTitle"
                  @error="handleImageError"
                  class="w-15 h-15 object-cover rounded"
                />
              </div>
              <div class="flex flex-col justify-between flex-1">
                <span class="m-0 mb-1 text-sm font-semibold text-gray-800">{{ item.productTitle }}</span>
                <span class="m-0 mb-1 text-xs text-gray-600">Size: {{ item.sizeName }} | Số lượng: {{ item.quantity }}</span>
                <span class="m-0 text-green-600 font-semibold text-xs">{{ formatPrice(item.totalPrice) }}đ </span>
              </div>
            </div>
          </div>
          
          <div class="pt-4">
            <div class="flex justify-between mb-2 text-gray-800">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}đ</span>
            </div>
            <div class="flex justify-between mb-2 text-gray-800">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <hr class="my-3">
            <div class="flex justify-between text-lg mt-3 text-gray-800">
              <span><strong>Tổng cộng:</strong></span>
              <span><strong>{{ formatPrice(cartStore.cartTotal) }}đ</strong></span>
            </div>
          </div>
        </div>

        <!-- Checkout Form -->
        <div class="bg-white rounded-lg shadow-sm p-8">
          <h3 class="m-0 mb-6 text-gray-800">Thông tin giao hàng</h3>
          <form @submit.prevent="handleCheckout">
            <div class="mb-5">
              <label for="customerName" class="block mb-1 font-semibold text-gray-800">Họ và tên *</label>
              <input
                id="customerName"
                type="text"
                v-model="checkoutData.customerName"
                placeholder="Nhập họ và tên"
                required
                class="w-full px-3 py-3 border-2 border-gray-300 rounded text-sm transition-colors duration-300 ease-in-out focus:outline-none focus:border-blue-600"
              />
            </div>

            <div class="mb-5">
              <label for="customerPhone" class="block mb-1 font-semibold text-gray-800">Số điện thoại *</label>
              <input
                id="customerPhone"
                type="tel"
                v-model="checkoutData.customerPhone"
                placeholder="Nhập số điện thoại"
                pattern="[0-9]{10,11}"
                required
                class="w-full px-3 py-3 border-2 border-gray-300 rounded text-sm transition-colors duration-300 ease-in-out focus:outline-none focus:border-blue-600"
              />
            </div>

            <div class="mb-5">
              <label for="shippingAddress" class="block mb-1 font-semibold text-gray-800">Địa chỉ giao hàng *</label>
              <textarea
                id="shippingAddress"
                v-model="checkoutData.shippingAddress"
                placeholder="Nhập địa chỉ chi tiết"
                rows="3"
                required
                class="w-full px-3 py-3 border-2 border-gray-300 rounded text-sm transition-colors duration-300 ease-in-out focus:outline-none focus:border-blue-600"
              ></textarea>
            </div>

            <div class="mb-5">
              <label for="notes" class="block mb-1 font-semibold text-gray-800">Ghi chú đơn hàng</label>
              <textarea
                id="notes"
                v-model="checkoutData.notes"
                placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                rows="2"
                class="w-full px-3 py-3 border-2 border-gray-300 rounded text-sm transition-colors duration-300 ease-in-out focus:outline-none focus:border-blue-600"
              ></textarea>
            </div>

            <!-- Payment Method -->
            <div class="my-8 p-5 border border-gray-200 rounded bg-gray-50">
              <h4 class="m-0 mb-4 text-gray-800 text-base">Phương thức thanh toán</h4>
              <div class="flex items-center gap-2 mb-2">
                <input type="radio" id="payos" value="payos" v-model="paymentMethod" class="w-auto" />
                <label for="payos" class="flex items-center gap-2 m-0 cursor-pointer">
                  <Landmark class="w-5 h-5" />
                  Thanh toán qua Chuyển khoản ngân hàng (QR Code)
                </label>
              </div>
              <p class="text-xs text-gray-600 mt-2 mb-0">
                Bạn sẽ được chuyển hướng đến trang PayOS để thanh toán bằng QR code.
              </p>
            </div>

            <div class="flex gap-4 mt-8 text-base font-semibold text-white">
             
              
              <button 
                type="submit" 
                class="flex-1  px-8 py-4 bg-blue-600  text-center cursor-pointer border-0 rounded transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                :disabled="processing"
              >
                
                {{ processing ? 'Đang xử lý...' : 'ĐẶT HÀNG' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '../../stores/store';
import { useAuthStore } from '../../stores/store';
import { useRouter } from 'vue-router';
import { checkoutService } from '../../apis/checkoutService';
import { useProductImages } from '../../composables/useProductImages';
import { Landmark } from 'lucide-vue-next';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const { getProductImage, getImageUrl, handleImageError } = useProductImages();

const processing = ref(false);
const paymentMethod = ref('payos');

const cartItems = computed(() => cartStore.cartItems);

const checkoutData = ref({
  customerName: '',
  customerPhone: '',
  shippingAddress: '',
  notes: '',
  totalAmount: computed(() => cartStore.cartTotal)
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const handleCheckout = async () => {
  try {
    processing.value = true;
    
    // Validate form
    if (!checkoutData.value.customerName.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }
    
    if (!checkoutData.value.customerPhone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    
    if (!checkoutData.value.shippingAddress.trim()) {
      alert('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    // Prepare checkout data
    const checkoutPayload = {
      customerName: checkoutData.value.customerName.trim(),
      customerPhone: checkoutData.value.customerPhone.trim(),
      shippingAddress: checkoutData.value.shippingAddress.trim(),
      notes: checkoutData.value.notes.trim(),
      totalAmount: cartStore.cartTotal
    };

    // Call checkout API
    const response = await checkoutService.checkout(checkoutPayload);
    
    if (response.data?.url) {
      // Store checkout info for later use
      localStorage.setItem('checkout_info', JSON.stringify({
        orderCode: response.data.orderCode,
        orderId: response.data.orderId,
        customerInfo: checkoutPayload
      }));
      
      // Redirect to PayOS
      window.location.href = response.data.url;
    } else {
      throw new Error('Không nhận được URL thanh toán');
    }
    
  } catch (error) {
    console.error('Checkout error:', error);
    alert('Có lỗi xảy ra khi thanh toán: ' + (error.message || 'Vui lòng thử lại'));
  } finally {
    processing.value = false;
  }
};

// Load images for cart items
const loadCartImages = async () => {
  const items = cartStore.cartItems;
  for (const item of items) {
    if (item.productId && !item.productImage) {
      try {
        const imageUrl = await getProductImage(item.productId);
        if (imageUrl) {
          // Update the item with image
          item.productImage = imageUrl;
        }
      } catch (error) {
        console.error(`Failed to load image for product ${item.productId}:`, error);
      }
    }
  }
};

onMounted(async () => {
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  // Load cart
  await cartStore.fetchCart();
  
  // Load images after cart is fetched
  await loadCartImages();
  
  // Pre-fill user info if available
  if (authStore.user) {
    checkoutData.value.customerName = authStore.user.fullName || '';
    checkoutData.value.customerPhone = authStore.user.phone || '';
    checkoutData.value.shippingAddress = authStore.user.address || '';
  }
});
</script>

<style scoped>
/* Custom width/height utilities */
.w-15 {
  width: 3.75rem; /* 60px */
}

.h-15 {
  height: 3.75rem; /* 60px */
}

/* Animation for spin */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fa-spin {
  animation: spin 1s linear infinite;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .grid-cols-\[400px_1fr\] {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .flex.gap-4 {
    flex-direction: column;
  }
  
  .flex.gap-4 a {
    order: 2;
  }
}
</style>