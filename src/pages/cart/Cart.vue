<template>
  <DefaultWhiteLayout>
  <div class="min-h-screen bg-white py-5">
    <div class="max-w-7xl mx-auto px-5">
      <div class="flex justify-between items-center mb-8">
        <span class="text-2xl font-bold ">Giỏ hàng</span>
        
      </div>

      <!-- Loading -->
      <div v-if="cartStore.loading" class="text-center py-12 text-lg text-gray-600">
        <i class="fas fa-spinner fa-spin"></i> Đang tải...
      </div>

      <!-- Empty Cart -->
      <div v-else-if="cartItems.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm">
        <div class="text-6xl text-gray-300 mb-5">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <h3 class="text-gray-800 mb-2">Giỏ hàng của bạn đang trống</h3>
        <p class="text-gray-600 mb-5">Hãy thêm một số sản phẩm để bắt đầu mua sắm!</p>
        <router-link to="/product/clothing" class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold text-center cursor-pointer border-0 transition-all duration-300 ease-in-out rounded hover:bg-blue-700 no-underline">
          Khám phá sản phẩm
        </router-link>
      </div>

      <!-- Cart Items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden">
          <div 
            v-for="item in cartItems" 
            :key="item.cartItemId" 
            class="grid grid-cols-[100px_1fr_120px_100px_80px] gap-4 p-5 border-b border-gray-200 items-center last:border-b-0"
          >
            <!-- Product Image -->
            <div class="w-25 h-25 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <img 
                :src="getImageUrl(item.productImage)" 
                :alt="item.productTitle"
                @error="handleImageError"
                v-if="item.productImage"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
                <i class="fas fa-image"></i>
              </div>
            </div>

            <div class="space-y-1 px-3 min-w-0 flex flex-col">
              <span class="  text-base font-semibold text-gray-800 overflow-hidden line-clamp-2">{{ item.productTitle }}</span>
              <span class=" text-gray-600 text-sm">Size: {{ item.sizeName }}</span>
              <span class=" text-red-600 text-xs font-medium">Còn lại: {{ getAvailableQuantity(item.productId, item.sizeId) }} sản phẩm</span>
              <span class=" text-green-600 font-semibold">{{ formatPrice(item.unitPrice) }}đ</span>
            </div>

            <div class="flex items-center gap-2 border border-gray-300 rounded-2xl p-1">
              <button 
                @click="updateQuantity(item, item.quantity - 1)"
                :disabled="item.quantity <= 1 || updating === item.cartItemId"
                class="w-8 h-8 border-0 bg-transparent cursor-pointer flex items-center justify-center rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                -
              </button>
              <span class="min-w-[2rem] text-center font-semibold">{{ item.quantity }}</span>
              <button 
                @click="updateQuantity(item, item.quantity + 1)"
                :disabled="updating === item.cartItemId || item.quantity >= getMaxQuantity(item.productId, item.sizeId)"
                class="w-8 h-8 border-0 bg-transparent cursor-pointer flex items-center justify-center rounded-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                +
              </button>
            </div>

            <div class="text-right text-gray-800">
              <strong>{{ formatPrice(item.totalPrice) }}đ</strong>
            </div>

            <div class="text-xs">
              <button 
                @click="removeItem(item)"
                :disabled="removing === item.cartItemId"
                class="text-red-600 bg-red-50 border border-red-200 cursor-pointer px-2 py-1.5 rounded-md transition-all duration-300 ease-in-out flex items-center gap-1.5  font-medium whitespace-nowrap hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                :title="'Xóa ' + item.productTitle"
              >
                <Loader2 v-if="removing === item.cartItemId" class="animate-spin" :size="12" />
                <Trash2 v-else :size="12" />
                <span class="inline">{{ removing === item.cartItemId ? 'Đang xóa...' : 'Xóa' }}</span>
              </button>
            </div>
          </div>
        

        </div>
        
        <!-- Cart Summary -->
        <div class="bg-white rounded-lg shadow-sm h-fit sticky top-5">
          <div class="p-5">
            <h3 class="m-0 mb-5 text-gray-800">Tóm tắt đơn hàng</h3>
            <div class="flex justify-between mb-2 text-gray-800">
              <span>Tổng sản phẩm:</span>
              <span>{{ cartStore.cartItemCount }} sản phẩm</span>
            </div>
            <div class="flex justify-between mb-2 text-gray-800">
              <span>Tạm tính:</span>
              <span>{{ formatPrice(cartStore.cartTotal) }}đ</span>
            </div>
            <div class="flex justify-between mb-2 text-gray-800">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            <hr class="my-4">
            <div class="flex justify-between text-lg mt-2 text-gray-800">
              <span><strong>Tổng cộng:</strong></span>
              <span><strong>{{ formatPrice(cartStore.cartTotal) }}đ</strong></span>
            </div>

            <div class="flex flex-col gap-2 mt-5 text-base text-white">
         
              
              <button 
                @click="proceedToCheckout"
                class="px-6 py-3 rounded bg-green-600 text-white font-semibold text-center cursor-pointer border-0 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-green-700"
              >
                <i class="fas fa-credit-card text-white "></i>
                Thanh toán
              </button>
            </div>
          </div>
          
        </div>
               <button 
                @click="clearAllCart"
                :disabled="clearing"
                class="px-6 py-3 rounded bg-transparent text-red-600 border-2 border-red-600 font-semibold text-center cursor-pointer transition-all duration-300 ease-in-out flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i class="fas fa-trash-alt"></i>
                {{ clearing ? 'Đang xóa...' : 'Xóa tất cả' }}
              </button>
      </div>
    </div>
  </div>
  </DefaultWhiteLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../../stores/store';
import { useRouter } from 'vue-router';
import { useProductImages } from '../../composables/useProductImages';
import { getDetailProduct } from '../../apis/productService';
import { Trash2, Loader2 } from 'lucide-vue-next';
import { Modal, message } from 'ant-design-vue';
import DefaultWhiteLayout from '../../layouts/DefaultWhiteLayout.vue';

const cartStore = useCartStore();
const router = useRouter();
const { getProductImage, getImageUrl, handleImageError } = useProductImages();

const updating = ref(null);
const removing = ref(null);
const clearing = ref(false);

// Map để lưu ảnh theo productId
const productImages = ref(new Map());

// Map để lưu inventory data theo productId
const productInventories = ref(new Map());

const cartItems = computed(() => {
  // Merge cart items với ảnh đã load
  return cartStore.cartItems.map(item => ({
    ...item,
    productImage: productImages.value.get(item.productId) || item.productImage
  }));
});

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price);
};

// Inventory validation functions (similar to ClothingDetail)
const getAvailableQuantity = (productId, sizeId) => {
  const product = productInventories.value.get(productId);
  if (!product || !product.inventories) return 0;
  
  const inventory = product.inventories.find(
    (inv) => inv.size.id === sizeId
  );
  return inventory?.quantity || 0;
};

const getMaxQuantity = (productId, sizeId) => {
  return getAvailableQuantity(productId, sizeId);
};

const validateQuantity = (item, newQuantity) => {
  const maxQty = getMaxQuantity(item.productId, item.sizeId);
  if (newQuantity < 1) {
    return 1;
  } else if (newQuantity > maxQty) {
    return maxQty;
  }
  return newQuantity;
};

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  
  // Validate quantity against inventory
  const validatedQuantity = validateQuantity(item, newQuantity);
  
  // Check if we're trying to exceed available inventory
  const maxQty = getMaxQuantity(item.productId, item.sizeId);
  if (newQuantity > maxQty) {
    message.warning(`Chỉ còn ${maxQty} sản phẩm trong kho cho size ${item.sizeName}`);
    return;
  }
  
  try {
    updating.value = item.cartItemId;
    await cartStore.updateCartItem(item.cartItemId, validatedQuantity);
  } catch (error) {
    console.error('Error updating quantity:', error);
    message.error('Có lỗi xảy ra khi cập nhật số lượng');
  } finally {
    updating.value = null;
  }
};

const removeItem = async (item) => {
  Modal.confirm({
    title: 'Xác nhận xóa sản phẩm',
    content: `Bạn có chắc muốn xóa "${item.productTitle}" khỏi giỏ hàng?`,
    okText: 'Xóa',
    cancelText: 'Hủy',
    okType: 'danger',
    onOk: async () => {
      try {
        removing.value = item.cartItemId;
        await cartStore.removeFromCart(item.cartItemId);
        
        message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        
        // Clean up image and inventory from map if no other items use this product
        const hasOtherItems = cartStore.cartItems.some(cartItem => 
          cartItem.productId === item.productId && cartItem.cartItemId !== item.cartItemId
        );
        if (!hasOtherItems) {
          productImages.value.delete(item.productId);
          productInventories.value.delete(item.productId);
        }
      } catch (error) {
        console.error('Error removing item:', error);
        message.error('Có lỗi xảy ra khi xóa sản phẩm');
      } finally {
        removing.value = null;
      }
    },
    onCancel: () => {
      // User cancelled, do nothing
    }
  });
};

const clearAllCart = async () => {
  Modal.confirm({
    title: 'Xác nhận xóa toàn bộ giỏ hàng',
    content: 'Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?',
    okText: 'Xóa tất cả',
    cancelText: 'Hủy',
    okType: 'danger',
    onOk: async () => {
      try {
        clearing.value = true;
        await cartStore.clearCart();
        
        message.success('Đã xóa tất cả sản phẩm trong giỏ hàng');
        
        // Clear all product images and inventories
        productImages.value.clear();
        productInventories.value.clear();
      } catch (error) {
        console.error('Error clearing cart:', error);
        message.error('Có lỗi xảy ra khi xóa giỏ hàng');
      } finally {
        clearing.value = false;
      }
    },
    onCancel: () => {
      // User cancelled, do nothing
    }
  });
};

const proceedToCheckout = () => {
  router.push('/checkout');
};

// Load images for cart items
const loadCartImages = async () => {
  const items = cartStore.cartItems;
  
  // Tạo một array của promises để tải song song
  const imageLoadPromises = items.map(async (item) => {
    if (item.productId && !productImages.value.has(item.productId)) {
      try {
        const imageUrl = await getProductImage(item.productId);
        if (imageUrl) {
          // Lưu ảnh vào map thay vì update trực tiếp item
          productImages.value.set(item.productId, imageUrl);
        }
      } catch (error) {
        console.error(`Failed to load image for product ${item.productId}:`, error);
      }
    }
  });

  // Đợi tất cả ảnh load xong
  await Promise.all(imageLoadPromises);
  console.log('All cart images loaded');
};

// Load inventory data for cart items
const loadCartInventories = async () => {
  const items = cartStore.cartItems;
  
  // Tạo một array của promises để tải song song
  const inventoryLoadPromises = items.map(async (item) => {
    if (item.productId && !productInventories.value.has(item.productId)) {
      try {
        const response = await getDetailProduct(item.productId);
        if (response.data) {
          // Lưu product data vào map
          productInventories.value.set(item.productId, response.data);
        }
      } catch (error) {
        console.error(`Failed to load inventory for product ${item.productId}:`, error);
      }
    }
  });

  // Đợi tất cả inventory data load xong
  await Promise.all(inventoryLoadPromises);
  console.log('All cart inventories loaded');
};

onMounted(async () => {
  await cartStore.fetchCart();
  console.log('Cart loaded:', cartStore.cartItems);
  
  // Load images and inventories after cart is fetched
  await Promise.all([
    loadCartImages(),
    loadCartInventories()
  ]);
});

// Watch for changes in cart items and reload images if needed
watch(() => cartStore.cartItems, async (newItems) => {
  if (newItems && newItems.length > 0) {
    // Tự động tải ảnh và inventory cho các item mới hoặc chưa có dữ liệu
    await Promise.all([
      loadCartImages(),
      loadCartInventories()
    ]);
  }
}, { deep: true });
</script>

<style scoped>
/* Custom width/height utilities */
.w-25 {
  width: 6.25rem; /* 100px */
}

.h-25 {
  height: 6.25rem; /* 100px */
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

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Responsive styles */
@media (max-width: 1024px) {
  .grid-cols-\[1fr_350px\] {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .grid-cols-\[100px_1fr_120px_100px_80px\] {
    grid-template-columns: 80px 1fr 100px 80px 70px;
    gap: 0.625rem;
    padding: 0.9375rem;
  }
  
  .w-25 {
    width: 5rem; /* 80px */
  }
  
  .h-25 {
    height: 5rem; /* 80px */
  }
  
  .remove-text {
    display: none;
  }
  
  .px-3 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .grid-cols-\[100px_1fr_120px_100px_80px\],
  .grid-cols-\[80px_1fr_100px_80px_70px\] {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .w-25 {
    width: 6.25rem; /* 100px back to original */
  }
  
  .h-25 {
    height: 6.25rem; /* 100px back to original */
  }
  
  .min-w-0 {
    margin: 0 auto 0.625rem;
  }
}
</style>