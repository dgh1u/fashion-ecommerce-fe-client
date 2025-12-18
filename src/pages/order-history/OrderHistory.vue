<template>
  <ProfileLayout>
  
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 flex items-center">
              <ShoppingBag class="mr-3 h-6 w-6" />
              Lịch sử đơn hàng
            </h1>
            <p class="text-gray-600 mt-1">Theo dõi tình trạng các đơn hàng của bạn</p>
          </div>
          <div class="flex items-center space-x-4">
            <a-select
              v-model:value="statusFilter"
              placeholder="Lọc theo trạng thái"
              class="w-40"
              @change="handleStatusChange"
            >
              <a-select-option value="">Tất cả</a-select-option>
              <a-select-option value="pending">Chờ xử lý</a-select-option>
              <a-select-option value="paid">Đã thanh toán</a-select-option>
              <a-select-option value="shipping">Đang giao</a-select-option>
              <a-select-option value="completed">Hoàn thành</a-select-option>
              <a-select-option value="cancelled">Đã hủy</a-select-option>
            </a-select>
           
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && orders.length === 0" class="flex justify-center py-12">
        <a-spin size="large">
          <template #indicator>
            <LoaderCircle class="h-8 w-8 animate-spin text-blue-600" />
          </template>
        </a-spin>
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && orders.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
        <Package class="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
        <p class="text-gray-600 mb-6">Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
        <router-link to="/home">
          <a-button type="primary" size="large">
            <ShoppingCart class="mr-2 h-4 w-4" />
            Bắt đầu mua sắm
          </a-button>
        </router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div 
          v-for="order in orders" 
          :key="order.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Order Header -->
          <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-6">
                <div>
                  <p class="text-sm font-medium text-gray-900">Mã đơn hàng</p>
                  <p class="text-lg font-bold text-blue-600">#{{ order.orderCode }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Ngày đặt</p>
                  <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">Tổng tiền</p>
                  <p class="text-lg font-bold text-red-600">{{ formatCurrency(order.totalAmount) }}</p>
                </div>
              </div>
              <div class="flex items-center space-x-4">
                <div class="flex flex-col items-end space-y-1">
                  <a-tag 
                    :color="getStatusColor(order.status)" 
                    class="px-3 py-1 text-sm font-medium rounded-full"
                  >
                    {{ getStatusText(order.status) }}
                  </a-tag>
                  <div v-if="getTimeLeftToCancel(order)" class="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
                    {{ getTimeLeftToCancel(order) }}
                  </div>
                </div>
                <a-dropdown>
                  <a-button type="text" size="small">
                    <MoreVertical class="h-4 w-4" />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="viewOrderDetail(order)">
                        <Eye class="mr-2 h-4 w-4" />
                        Xem chi tiết
                      </a-menu-item>
                      <a-menu-item 
                        v-if="canCancelOrder(order)" 
                        @click="cancelOrder(order.id)"
                      >
                        <X class="mr-2 h-4 w-4" />
                        Hủy đơn hàng
                      </a-menu-item>
                      <a-menu-item 
                        v-else-if="order.status === 'pending' || order.status === 'paid'"
                        disabled
                        :title="getCancelReasonMessage(order)"
                      >
                        <X class="mr-2 h-4 w-4 text-gray-400" />
                        <span class="text-gray-400">Hủy đơn hàng</span>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </div>

          <!-- Order Info -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-sm font-medium text-gray-900 mb-1">Thông tin giao hàng</p>
                <div class="text-sm text-gray-600">
                  <p class="flex items-center"><User class="mr-2 h-4 w-4" />{{ order.customerName }}</p>
                  <p class="flex items-center mt-1"><Phone class="mr-2 h-4 w-4" />{{ order.customerPhone }}</p>
                  <p class="flex items-center mt-1"><MapPin class="mr-2 h-4 w-4" />{{ order.shippingAddress }}</p>
                </div>
              </div>
              <div v-if="order.notes">
                <p class="text-sm font-medium text-gray-900 mb-1">Ghi chú</p>
                <p class="text-sm text-gray-600 bg-gray-50 rounded p-2">{{ order.notes }}</p>
              </div>
            </div>

            <!-- Order Items -->
            <div class="border-t border-gray-200 pt-4">
              <p class="text-sm font-medium text-gray-900 mb-3">Sản phẩm đã đặt ({{ order.orderItems.length }})</p>
              <div class="space-y-3">
                <div 
                  v-for="item in order.orderItems" 
                  :key="item.id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div class="flex items-center space-x-4">
                    <div class="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        v-if="item.productImage"
                        :src="getImageUrl(item.productImage)"
                        :alt="item.productTitle"
                        @error="handleImageError"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                        <Image class="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h4 class="font-medium text-gray-900">{{ item.productTitle }}</h4>
                      
                      <div class="flex items-center space-x-4 mt-1">
                        <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Size: {{ item.sizeName }}
                        </span>
                        <span class="text-xs text-gray-500">Số lượng: {{ item.quantity }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-gray-600">{{ formatCurrency(item.unitPrice) }} x {{ item.quantity }}</p>
                    <p class="font-bold text-gray-900">{{ formatCurrency(item.totalPrice) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="orders.length > 0" class="flex justify-center mt-8">
        <a-pagination
          v-model:current="currentPage"
          :total="totalOrders"
          :page-size="pageSize"
          :show-size-changer="false"
          :show-quick-jumper="true"
          :show-total="(total, range) => `${range[0]}-${range[1]} của ${total} đơn hàng`"
          @change="handlePageChange"
        />
      </div>
    </div>

    <!-- Order Detail Modal -->
    <a-modal
      v-model:open="showDetailModal"
      title="Chi tiết đơn hàng"
      :width="800"
      :footer="null"
    >
      <div v-if="selectedOrder" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-medium">Mã đơn hàng:</p>
            <p class="text-blue-600 font-bold">#{{ selectedOrder.orderCode }}</p>
          </div>
          <div>
            <p class="font-medium">Trạng thái:</p>
            <a-tag :color="getStatusColor(selectedOrder.status)">
              {{ getStatusText(selectedOrder.status) }}
            </a-tag>
          </div>
          <div>
            <p class="font-medium">Ngày đặt:</p>
            <p>{{ formatDate(selectedOrder.createdAt) }}</p>
          </div>
          <div>
            <p class="font-medium">Tổng tiền:</p>
            <p class="font-bold text-red-600">{{ formatCurrency(selectedOrder.totalAmount) }}</p>
          </div>
        </div>
        
        <div class="border-t pt-4">
          <p class="font-medium mb-2">Thông tin giao hàng:</p>
          <div class="bg-gray-50 p-3 rounded">
            <p>Người nhận: {{ selectedOrder.customerName }}</p>
            <p>Số điện thoại: {{ selectedOrder.customerPhone }}</p>
            <p>Địa chỉ: {{ selectedOrder.shippingAddress }}</p>
            <p v-if="selectedOrder.notes">Ghi chú: {{ selectedOrder.notes }}</p>
          </div>
        </div>

        <div class="border-t pt-4">
          <p class="font-medium mb-2">Chi tiết sản phẩm:</p>
          <a-table 
            :dataSource="selectedOrder.orderItems" 
            :columns="detailColumns"
            :pagination="false"
            size="small"
          />
        </div>
      </div>
    </a-modal>
    
  </ProfileLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import ProfileLayout from '@/layouts/ProfileLayout.vue';
import { 
  ShoppingBag, 
  RefreshCw, 
  LoaderCircle, 
  Package, 
  ShoppingCart,
  User,
  Phone,
  MapPin,
  MoreVertical,
  Eye,
  X,
  Image
} from 'lucide-vue-next';
import { orderService } from '@/apis/orderService';
import { useProductImages } from '@/composables/useProductImages';

// Use the composable
const { getProductImage, getImageUrl, handleImageError } = useProductImages();

// Reactive data
const orders = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const totalOrders = ref(0);
const statusFilter = ref('');
const showDetailModal = ref(false);
const selectedOrder = ref(null);

// Table columns for order detail modal
const detailColumns = [
  {
    title: 'Sản phẩm',
    dataIndex: 'productTitle',
    key: 'productTitle',
    width: '30%'
  },
  {
    title: 'Size',
    dataIndex: 'sizeName',
    key: 'sizeName',
    width: '10%'
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
    width: '15%'
  },
  {
    title: 'Đơn giá',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    width: '20%',
    customRender: ({ text }) => formatCurrency(text)
  },
  {
    title: 'Thành tiền',
    dataIndex: 'totalPrice',
    key: 'totalPrice',
    width: '25%',
    customRender: ({ text }) => formatCurrency(text)
  }
];

// Methods
const fetchOrders = async () => {
  loading.value = true;
  try {
    const response = await orderService.getMyOrders(currentPage.value, pageSize.value, statusFilter.value);
    if (response.success) {
      orders.value = response.data.items;
      totalOrders.value = response.data.total;
      
      // Load images for products
      await loadOrderItemImages();
    } else {
      message.error('Không thể tải danh sách đơn hàng');
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
    message.error('Có lỗi xảy ra khi tải danh sách đơn hàng');
  } finally {
    loading.value = false;
  }
};

// Load images for order items - similar to PaymentResult.vue
const loadOrderItemImages = async () => {
  for (const order of orders.value) {
    if (order.orderItems && order.orderItems.length > 0) {
      for (const item of order.orderItems) {
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
    }
  }
};

const refreshOrders = () => {
  fetchOrders();
};

const handlePageChange = (page) => {
  currentPage.value = page;
  fetchOrders();
};

const handleStatusChange = (status) => {
  statusFilter.value = status;
  currentPage.value = 1;
  fetchOrders();
};

const viewOrderDetail = (order) => {
  selectedOrder.value = order;
  showDetailModal.value = true;
};

const cancelOrder = async (orderId) => {
  // Hiển thị dialog xác nhận
  const confirmed = await new Promise((resolve) => {
    Modal.confirm({
      title: 'Xác nhận hủy đơn hàng',
      content: 'Bạn có chắc chắn muốn hủy đơn hàng này không?\n\nLưu ý: Đơn hàng (bao gồm cả đơn đã thanh toán) chỉ có thể hủy trong vòng 24 giờ kể từ thời gian đặt hàng. Hành động này không thể hoàn tác.',
      okText: 'Có, hủy đơn hàng',
      cancelText: 'Không',
      okType: 'danger',
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });

  if (!confirmed) return;

  try {
    await orderService.cancelOrder(orderId);
    message.success('Hủy đơn hàng thành công');
    fetchOrders();
  } catch (error) {
    console.error('Error canceling order:', error);
    // Hiển thị thông báo lỗi cụ thể từ server nếu có
    const errorMessage = error.response?.data?.message || 
                        error.response?.data || 
                        'Không thể hủy đơn hàng';
    message.error(errorMessage);
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Kiểm tra xem đơn hàng có thể hủy được không (trong vòng 24h và trạng thái pending hoặc paid)
const canCancelOrder = (order) => {
  // Kiểm tra trạng thái - cho phép hủy đơn pending hoặc paid
  if (order.status !== 'pending' && order.status !== 'paid') {
    return false;
  }
  
  // Kiểm tra thời gian (trong vòng 24h)
  const now = new Date();
  const orderCreatedAt = new Date(order.createdAt);
  const hoursElapsed = (now - orderCreatedAt) / (1000 * 60 * 60); // Convert to hours
  
  return hoursElapsed <= 24;
};

// Lấy thông báo lý do không thể hủy đơn hàng
const getCancelReasonMessage = (order) => {
  if (order.status !== 'pending' && order.status !== 'paid') {
    return 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý hoặc đã thanh toán';
  }
  
  const now = new Date();
  const orderCreatedAt = new Date(order.createdAt);
  const hoursElapsed = Math.floor((now - orderCreatedAt) / (1000 * 60 * 60));
  
  if (hoursElapsed > 24) {
    return `Không thể hủy đơn hàng sau 24 giờ. Đơn hàng này đã được đặt cách đây ${hoursElapsed} giờ`;
  }
  
  return '';
};

// Lấy thời gian còn lại có thể hủy đơn hàng
const getTimeLeftToCancel = (order) => {
  if (order.status !== 'pending' && order.status !== 'paid') {
    return null;
  }
  
  const now = new Date();
  const orderCreatedAt = new Date(order.createdAt);
  const hoursElapsed = (now - orderCreatedAt) / (1000 * 60 * 60);
  
  if (hoursElapsed >= 24) {
    return null;
  }
  
  const hoursLeft = 24 - hoursElapsed;
  
  if (hoursLeft >= 1) {
    return `Còn ${Math.floor(hoursLeft)}h ${Math.floor((hoursLeft % 1) * 60)}p để hủy`;
  } else {
    return `Còn ${Math.floor(hoursLeft * 60)}p để hủy`;
  }
};

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    paid: 'blue',
    shipping: 'cyan',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'default';
};

const getStatusText = (status) => {
  const texts = {
    pending: 'Chờ xử lý',
    paid: 'Đã thanh toán',
    shipping: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã hủy'
  };
  return texts[status] || status;
};

// Lifecycle
onMounted(() => {
  fetchOrders();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
