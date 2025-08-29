<template>
  <DefaultWhiteLayout>
    <div class="pt-6 px-6 bg-white">
      <div
        class="text-3xl font-bold flex flex-col items-center justify-center flex-wrap space-y-2"
      >
        <span class="text-gray-800"> QUẦN ÁO </span>
      </div>
    </div>
    <!-- Wrapper toàn trang: hướng cột trên mobile, hướng hàng ngang từ md trở lên -->
    <div class="flex flex-col md:flex-row min-h-screen py-6 bg-white">
      <!-- Bộ lọc: chiếm toàn bộ chiều rộng trên mobile, tự động shrink trên desktop -->
      <div class="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
        <MotelFilter @update:filters="handleFilterUpdate" />
      </div>
      <!-- Nội dung chính: chiếm phần còn lại -->
      <div class="flex-1 flex flex-col bg-white">
        <!-- Thanh tìm kiếm từ khóa -->
        <div class="mb-1 relative">
          <input
            v-model="filters.keywords"
            type="text"
            placeholder="Nhập tên sản phẩm muốn tìm..."
            class="w-full font-medium p-3 pl-10 bg-stone-100 rounded-xl shadow hover:shadow-2xl"
          />
          <Search
            class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        <!-- Hiển thị thông báo lỗi nếu có -->
        <div v-if="errorMsg" class="p-4 text-red-600">
          {{ errorMsg }}
        </div>
        <!-- Danh sách tin đăng -->
        <div class="p-2 pb-20 flex-1 overflow-y-auto">
          <template v-if="products.length">
            <!-- Grid 1 cột trên mobile, 2 cột từ md trở lên -->
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <router-link
                v-for="product in products"
                :key="product.id"
                :to="{ name: 'DocumentDetail', params: { id: product.id } }"
                class="block"
              >
                <DocumentCard
                  :product="product"
                  data-aos="fade-left"
                  data-aos-duration="800"
                />
              </router-link>
            </div>
            <!-- Phân trang (Ant Design Vue) -->
            <div class="pt-10">
              <a-pagination
                :current="pagination.current"
                :pageSize="pagination.pageSize"
                :total="pagination.total"
                show-quick-jumper
                :locale="paginationLocale"
                :itemRender="itemRender"
                @change="handlePageChange"
              />
            </div>
          </template>
          <template v-else>
            <div class="flex items-center font-semibold justify-center py-10">
              <a-empty description="Không tìm thấy tin đăng nào!" />
            </div>
          </template>
        </div>
      </div>
    </div>
  </DefaultWhiteLayout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import DefaultWhiteLayout from "../../layouts/DefaultWhiteLayout.vue";
import { getListProduct } from "@/apis/productService.js";
import { Empty } from "ant-design-vue";

import { Search } from "lucide-vue-next";
import DocumentCard from "../../components/card/DocumentCard.vue";
import MotelFilter from "../../components/filter/MotelFilter.vue";

// Format price with thousand separators
const formatPrice = (price) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

// Khởi tạo bộ lọc
const filters = ref({
  keywords: "",
  majorSelected: null,
  secondMotelSelected: null,
});

// Danh sách bài đăng
const products = ref([]);

// Thông báo lỗi
const errorMsg = ref("");

// Cấu hình phân trang
const pagination = ref({
  current: 1,
  pageSize: 6,
  total: 0,
});

// Xử lý cập nhật bộ lọc từ component BeverageFilter
function handleFilterUpdate(newFilters) {
  filters.value = {
    ...filters.value,
    ...newFilters,
    keywords: filters.value.keywords,
  };
  // Reset về trang 1 khi filter thay đổi
  pagination.value.current = 1;
  fetchProducts();
}

// Chuyển đổi bộ lọc thành query params cho API
function buildQueryParams() {
  const params = {};
  // Mặc định là quán nước
  params.firtClass = "TAI_LIEU";

  // Chỉ lấy tin đã duyệt và đang hiển thị
  params.approved = true;
  params.notApproved = false;
  params.del = false;

  // Tham số phân trang
  params.start = Math.max(pagination.value.current - 1, 0);
  params.limit = pagination.value.pageSize;

  // Thêm từ khóa tìm kiếm
  if (filters.value.keywords && filters.value.keywords.trim() !== "") {
    params.keywords = filters.value.keywords.trim();
  }

  // Thêm khu vực
  if (filters.value.majorSelected) {
    params.majorName = filters.value.majorSelected;
  }

  // Thêm loại quán
  if (filters.value.secondMotelSelected) {
    params.secondMotel = filters.value.secondMotelSelected;
  }

  return params;
}

// Gọi API và cập nhật danh sách bài đăng
async function fetchProducts() {
  try {
    errorMsg.value = "";
    const queryParams = buildQueryParams();
    const response = await getListProduct(queryParams);
    const data = response.data;

    if (data && data.items) {
      products.value = data.items;
      pagination.value.total = data.total || 0;
    } else {
      products.value = [];
      pagination.value.total = 0;
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    errorMsg.value =
      "Có lỗi xảy ra khi lấy danh sách bài đăng. Vui lòng kiểm tra lại log!";
  }
}

// Xử lý chuyển trang
function handlePageChange(page) {
  pagination.value.current = page;
  fetchProducts();
  // Cuộn lên đầu trang
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Khởi tạo dữ liệu khi component được mount
onMounted(() => {
  fetchProducts();
});

// Tự động cập nhật dữ liệu khi bộ lọc thay đổi
watch(
  filters,
  () => {
    fetchProducts();
  },
  { deep: true }
);
</script>

<style scoped>
/* Tuỳ chỉnh style nếu cần */
</style>
