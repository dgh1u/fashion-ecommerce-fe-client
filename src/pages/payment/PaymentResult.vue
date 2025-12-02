<template>
  <div class="min-h-screen bg-gray-50 py-5 flex items-center">
    <div class="max-w-2xl mx-auto px-5">
      <!-- Loading -->
      <div v-if="loading" class="text-center p-12 bg-white rounded-xl shadow-md">
        <Loader2 class="h-10 w-10 text-blue-500 mb-4 animate-spin mx-auto" />
        <p class="text-base text-gray-600 m-0">Đang kiểm tra kết quả thanh toán...</p>
      </div>

      <!-- Payment Success -->
      <div v-else-if="paymentResult && isPaymentSuccessful(paymentResult)" class="bg-white rounded-xl shadow-md p-10 text-center">
        <div class="text-green-500 mb-5 flex justify-center">
          <CheckCircle class="h-20 w-20" />
        </div>
        <h1 class="m-0 mb-4 text-gray-800 text-3xl font-bold">Thanh toán thành công!</h1>
        <p class="text-base text-gray-600 mb-8 leading-relaxed">
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
        </p>
        
        <div class="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h3 class="m-0 mb-4 text-gray-800 text-lg font-semibold">Thông tin đơn hàng</h3>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Mã đơn hàng:</span>
            <span><strong>#{{ paymentResult.orderCode }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Tên khách hàng:</span>
            <span><strong>{{ paymentResult.customerName }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Số điện thoại:</span>
            <span><strong>{{ paymentResult.customerPhone }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Địa chỉ giao hàng:</span>
            <span><strong>{{ paymentResult.shippingAddress }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Tổng tiền:</span>
            <span><strong>{{ formatPrice(paymentResult.totalAmount) }}đ</strong></span>
          </div>
         
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Thời gian đặt hàng:</span>
            <span>{{ formatDateTime(paymentResult.createdAt) }}</span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200" v-if="paymentResult.reference">
            <span>Mã tham chiếu thanh toán:</span>
            <span>{{ paymentResult.reference }}</span>
          </div>
          <div class="flex justify-between mb-0 pb-0 border-b-0" v-if="paymentResult.notes">
            <span>Ghi chú:</span>
            <span>{{ paymentResult.notes }}</span>
          </div>
        </div>

        <!-- Order Items -->
        <div class="bg-gray-50 rounded-lg p-5 mb-6 text-left" v-if="paymentResult.orderItems && paymentResult.orderItems.length > 0">
          <h3 class="m-0 mb-4 text-gray-800 text-lg font-semibold">Sản phẩm đã mua</h3>
          <div class="flex flex-col gap-3">
            <div 
              v-for="item in paymentResult.orderItems" 
              :key="item.id" 
              class="flex bg-white rounded-lg p-3 border border-gray-200"
            >
              <!-- Product Image -->
              <div class="w-20 h-20 mr-3 rounded-md overflow-hidden flex-shrink-0 bg-gray-50 flex items-center justify-center">
                <img 
                  :src="getImageUrl(item.productImage)" 
                  :alt="item.productTitle"
                  @error="handleImageError"
                  v-if="item.productImage"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                  <Image class="h-8 w-8" />
                </div>
              </div>
              
              <div class="flex-1">
                <h4 class="m-0 mb-2 text-base font-semibold text-gray-800 leading-tight">{{ item.productTitle }}</h4>
                <div class="flex gap-3 mb-1.5 text-sm text-gray-600  ">
                  <span class="whitespace-nowrap">Size: {{ item.sizeName }}</span>
                  <span class="whitespace-nowrap">Số Lượng: {{ item.quantity }}</span>
                  
                </div>
                <div class="text-sm text-gray-800">
                  Thành tiền: <strong class="text-blue-500">{{ formatPrice(item.totalPrice) }}đ</strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h3 class="m-0 mb-4 text-gray-800 text-lg font-semibold">Bước tiếp theo</h3>
          <ul class="m-0 p-0 list-none">
            <li class="mb-2.5 flex items-center gap-2.5"><Truck class="h-4 w-4 text-green-500" /> Chúng tôi sẽ giao hàng trong 2-3 ngày làm việc</li>
            <li class="mb-0 flex items-center gap-2.5"><Phone class="h-4 w-4 text-green-500" /> Bạn sẽ nhận được cuộc gọi xác nhận trước khi giao hàng</li>
          </ul>
        </div>

        <div class="flex gap-4 justify-center">
          <router-link to="/product/clothing" class="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white">
            <ShoppingBag class="h-4 w-4" />
            Tiếp tục mua sắm
          </router-link>
         
        </div>
      </div>

      <!-- Payment Failed -->
      <div v-else-if="paymentResult && !isPaymentSuccessful(paymentResult)" class="bg-white rounded-xl shadow-md p-10 text-center">
        <div class="text-red-500 mb-5 flex justify-center">
          <XCircle class="h-20 w-20" />
        </div>
        <h1 class="m-0 mb-4 text-gray-800 text-3xl font-bold">Thanh toán không thành công</h1>
        <p class="text-base text-gray-600 mb-8 leading-relaxed">
          Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
        </p>
        
        <div class="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h3 class="m-0 mb-4 text-gray-800 text-lg font-semibold">Thông tin đơn hàng</h3>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Mã đơn hàng:</span>
            <span><strong>#{{ paymentResult.orderCode }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Tên khách hàng:</span>
            <span><strong>{{ paymentResult.customerName }}</strong></span>
          </div>
          <div class="flex justify-between mb-2 pb-2 border-b border-gray-200">
            <span>Tổng tiền:</span>
            <span><strong>{{ formatPrice(paymentResult.totalAmount) }}đ</strong></span>
          </div>
          <div class="flex justify-between mb-0 pb-0 border-b-0">
            <span>Thời gian đặt hàng:</span>
            <span>{{ formatDateTime(paymentResult.createdAt) }}</span>
          </div>
        </div>

        <div class="bg-gray-50 rounded-lg p-5 mb-6 text-left">
          <h3 class="m-0 mb-4 text-gray-800 text-lg font-semibold">Bạn có thể thử lại</h3>
          <ul class="m-0 p-0 list-none">
            <li class="mb-2.5 flex items-center gap-2.5"><RotateCcw class="h-4 w-4 text-blue-500" /> Thử lại với cùng phương thức thanh toán</li>
            <li class="mb-2.5 flex items-center gap-2.5"><CreditCard class="h-4 w-4 text-blue-500" /> Sử dụng thẻ/tài khoản khác</li>
            <li class="mb-0 flex items-center gap-2.5"><Phone class="h-4 w-4 text-blue-500" /> Liên hệ hỗ trợ nếu vấn đề tiếp tục</li>
          </ul>
        </div>

        <div class="flex gap-4 justify-center">
          <router-link to="/cart" class="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white">
            <ShoppingCart class="h-4 w-4" />
            Quay lại giỏ hàng
          </router-link>
          <button @click="retryPayment" class="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-blue-500 text-white hover:bg-blue-700">
            <RotateCcw class="h-4 w-4" />
            Thử lại thanh toán
          </button>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="bg-white rounded-xl shadow-md p-10 text-center">
        <div class="text-yellow-400 mb-5 flex justify-center">
          <AlertTriangle class="h-20 w-20" />
        </div>
        <h1 class="m-0 mb-4 text-gray-800 text-3xl font-bold">Không thể xác định kết quả</h1>
        <p class="text-base text-gray-600 mb-8 leading-relaxed">
          Không tìm thấy thông tin thanh toán hoặc có lỗi xảy ra.
        </p>
        
        <div class="flex gap-4 justify-center">
          <router-link to="/cart" class="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-transparent text-gray-500 border-2 border-gray-500 hover:bg-gray-500 hover:text-white">
            <ShoppingCart class="h-4 w-4" />
            Quay lại giỏ hàng
          </router-link>
          <button @click="checkAgain" class="px-6 py-3 rounded-md no-underline font-semibold text-center cursor-pointer border-none transition-all duration-300 flex items-center justify-center gap-2 min-w-40 bg-blue-500 text-white hover:bg-blue-700">
            <RefreshCw class="h-4 w-4" />
            Kiểm tra lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { 
  Loader2, 
  CheckCircle, 
  Image, 
  Truck, 
  Phone, 
  ShoppingBag, 
  XCircle, 
  RotateCcw, 
  CreditCard, 
  ShoppingCart, 
  AlertTriangle, 
  RefreshCw 
} from 'lucide-vue-next';
import { checkoutService } from '../../apis/checkoutService';
import { useCartStore } from '../../stores/store';
import { useProductImages } from '../../composables/useProductImages';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const { getProductImage, getImageUrl, handleImageError } = useProductImages();

const loading = ref(true);
const paymentResult = ref(null);

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  
  try {
    // PayOS returns datetime in format like "2024-01-15 14:30:25"
    const date = new Date(dateTimeString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return dateTimeString;
  }
};



// Helper function to check if payment is successful
const isPaymentSuccessful = (paymentData) => {
  if (!paymentData) return false;
  
  // Check multiple possible fields for payment success
  return paymentData.paymentSuccess === true || 
         paymentData.paymentStatus === 'success' ||
         paymentData.paymentStatus === 'PAID' ||
         paymentData.status === 'PAID' ||
         paymentData.status === 'CONFIRMED';
};

const checkPaymentResult = async () => {
  try {
    loading.value = true;
    
    // Get payment history ID from route params
    const paymentHistoryId = route.params.id;
    
    if (!paymentHistoryId) {
      throw new Error('Không tìm thấy mã thanh toán');
    }
    
    // Call API to get order info from payment result
    const response = await checkoutService.getOrderFromPaymentResult(paymentHistoryId);
    console.log('Order payment result response:', response);
    
    // Response after interceptor can be:
    // 1. { data: {...}, success: true } - if backend returns standard format
    // 2. { body: { data: {...} } } - if backend returns different format  
    // 3. Direct data object - if interceptor unwraps differently
    let responseData;
    
    if (response.body && response.body.data) {
      // Case: response has body.data structure
      responseData = response.body.data;
    } else if (response.data) {
      // Case: response has data property
      responseData = response.data;
    } else {
      // Case: response is the data itself
      responseData = response;
    }
    
    paymentResult.value = responseData;
    console.log('Order payment result data:', responseData);
    console.log('Payment success status:', isPaymentSuccessful(responseData));
    
    // Load images for order items
    if (responseData && responseData.orderItems && responseData.orderItems.length > 0) {
      await loadOrderItemImages(responseData.orderItems);
    }
    
    // If payment successful, refresh cart (should be empty now)
    if (responseData && isPaymentSuccessful(responseData)) {
      console.log('Payment successful, refreshing cart');
      cartStore.fetchCart();
    } else {
      console.log('Payment not successful:', responseData?.paymentSuccess);
    }
    
  } catch (error) {
    console.error('Error checking payment result:', error);
    paymentResult.value = null;
  } finally {
    loading.value = false;
  }
};

// Load images for order items
const loadOrderItemImages = async (orderItems) => {
  for (const item of orderItems) {
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

const retryPayment = () => {
  // Try to get checkout info from localStorage
  const checkoutInfo = localStorage.getItem('checkout_info');
  
  if (checkoutInfo) {
    // Go back to checkout page with stored info
    router.push('/checkout');
  } else {
    // Go to cart if no stored info
    router.push('/cart');
  }
};

const checkAgain = () => {
  checkPaymentResult();
};

onMounted(() => {
  checkPaymentResult();
  
  // Clear checkout info from localStorage on result page
  localStorage.removeItem('checkout_info');
});
</script>

<style scoped>
/* Tailwind CSS đã được sử dụng trong template, chỉ cần responsive utilities */
</style>