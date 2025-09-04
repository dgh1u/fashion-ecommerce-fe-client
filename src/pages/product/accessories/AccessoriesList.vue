<template>
  <DefaultWhiteLayout>
    <div class="pt-6 px-6 bg-white">
      <div
        class="text-3xl font-bold flex flex-col items-center justify-center flex-wrap space-y-2"
      >
        <span class="text-gray-800"> PHỤ KIỆN </span>
      </div>
    </div>
    <!-- Wrapper toàn trang: hướng cột trên mobile, hướng hàng ngang từ md trở lên -->
    <div class="flex flex-col md:flex-row min-h-screen py-6 bg-white">
      <!-- Bộ lọc: chiếm toàn bộ chiều rộng trên mobile, tự động shrink trên desktop -->
      <div class="w-full md:w-auto md:mr-4 mb-4 md:mb-0">
        <MotelFilter :first-class="'PHU_KIEN'" @update:filters="handleFilterUpdate" />
      </div>
      <!-- Nội dung chính: chiếm phần còn lại -->
      <div class="flex-1 flex flex-col bg-white">
        <!-- Thanh tìm kiếm và sắp xếp -->
        <div class="flex items-center gap-4 mb-1">
          <!-- Thanh tìm kiếm từ khóa - bên trái -->
          <div class="flex-1 relative">
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

          <!-- Nút sắp xếp - bên phải -->
          <div class="flex-shrink-0 relative">
            <!-- Dropdown Button -->
            <button
              @click="showSortDropdown = !showSortDropdown"
              class="flex items-center space-x-2 px-4 py-3 bg-stone-100 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-200 focus:outline-none min-w-[140px]"
            >
              <span class="text-sm font-medium">{{ getSortLabel() }}</span>
              <svg
                class="w-4 h-4 ml-auto transition-transform duration-200"
                :class="{ 'rotate-180': showSortDropdown }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showSortDropdown"
              class="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50"
            >
              <div class="py-2">
                <div
                  class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100"
                >
                  Sắp xếp theo
                </div>

                <!-- Sort Options -->
                <div class="py-1">
                  <label
                    v-for="option in sortOptions"
                    :key="option.value"
                    class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer hover:text-stone-500"
                    :class="{
                      'text-stone-500': sortOption === option.value,
                    }"
                  >
                    <div class="relative">
                      <input
                        type="radio"
                        :value="option.value"
                        v-model="sortOption"
                        @change="handleSortChange"
                        class="hidden"
                      />
                      <div
                        class="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center"
                        :class="{
                          'bg-stone-500 border-stone-500':
                            sortOption === option.value,
                        }"
                      >
                        <div
                          v-if="sortOption === option.value"
                          class="w-3 h-3 rounded-full bg-white"
                        ></div>
                      </div>
                    </div>
                    <span class="ml-3 text-sm text-gray-700">{{
                      option.label
                    }}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Overlay để đóng dropdown khi click bên ngoài -->
        <div
          v-if="showSortDropdown"
          @click="showSortDropdown = false"
          class="fixed inset-0 z-40"
        ></div>

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
                :to="{ name: 'ClothingDetail', params: { id: product.id } }"
                class="block"
              >
                <ClothingCard
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
import DefaultWhiteLayout from "../../../layouts/DefaultWhiteLayout.vue";
import { getListProduct } from "@/apis/productService.js";
import { Empty } from "ant-design-vue";

import { Search } from "lucide-vue-next";
import ClothingCard from "../../../components/card/ClothingCard.vue";
import MotelFilter from "../../../components/filter/Filter.vue";

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
  priceRange: [0, 100], // ✅ Khoảng giá (từ 0-100, tương ứng 0-10 triệu VND)
  acreageRange: [5, 95], // ✅ Khoảng diện tích
  districtSelected: null, // ✅ Khu vực
  sizesSelected: [], // ✅ Các size được chọn
  materialsSelected: [], // ✅ Các chất liệu được chọn
  colorsSelected: [], // ✅ Các màu sắc được chọn
  gender: null, // ✅ Giới tính (true=nam, false=nữ, null=cả hai)
}); // Danh sách bài đăng
const products = ref([]);

// Thông báo lỗi
const errorMsg = ref("");

// Cấu hình phân trang
const pagination = ref({
  current: 1,
  pageSize: 6,
  total: 0,
});

//State cho dropdown sort
const showSortDropdown = ref(false);
const sortOption = ref("newest_first");

// Danh sách options
const sortOptions = [
  { value: "newest_first", label: "Hàng mới nhất" },
  { value: "price_asc", label: "Giá thấp trước" },
  { value: "price_desc", label: "Giá cao trước" },
];

// Function lấy label hiện tại
function getSortLabel() {
  const option = sortOptions.find((opt) => opt.value === sortOption.value);
  return option ? option.label : "Hàng mới nhất";
}

// Thêm function xử lý thay đổi sắp xếp
function handleSortChange() {
  showSortDropdown.value = false;
  pagination.value.current = 1;
  fetchProducts();
}

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
  // Mặc định là quần áo
  params.firstClass = "PHU_KIEN";

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

  // Thêm danh mục phụ (secondClass)
  if (filters.value.secondClassesSelected && filters.value.secondClassesSelected.length > 0) {
    params.secondClass = filters.value.secondClassesSelected.join(',');
  }

  // Thêm khoảng giá (priceRange) - chuyển từ trăm nghìn đồng sang VND
  if (filters.value.priceRange && filters.value.priceRange.length === 2) {
    // Chuyển đổi: 1 = 100k VND, 10 = 1 triệu VND, 100 = 10 triệu VND
    params.minPrice = filters.value.priceRange[0] * 100000; // Trăm nghìn VND -> VND
    if (filters.value.priceRange[1] >= 100) {
      // Không set maxPrice nếu chọn max (10 triệu trở lên)
      delete params.maxPrice;
    } else {
      params.maxPrice = filters.value.priceRange[1] * 100000;
    }
  }

  // Thêm khu vực (districtSelected)
  if (filters.value.districtSelected) {
    params.district = filters.value.districtSelected;
  }

  // Thêm sizes đã chọn (lọc sản phẩm có sizes còn hàng)
  if (filters.value.sizesSelected && filters.value.sizesSelected.length > 0) {
    params.sizes = filters.value.sizesSelected.join(",");
  }

  // Thêm materials đã chọn (lọc theo chất liệu chính)
  if (
    filters.value.materialsSelected &&
    filters.value.materialsSelected.length > 0
  ) {
    params.materials = filters.value.materialsSelected.join(",");
  }

  // Thêm colors đã chọn (lọc theo màu sắc chính)
  if (filters.value.colorsSelected && filters.value.colorsSelected.length > 0) {
    params.colors = filters.value.colorsSelected.join(",");
  }

  // Thêm giới tính (gender)
  if (filters.value.gender !== null) {
    params.gender = filters.value.gender;
  }

  // Xử lý sắp xếp
  switch (sortOption.value) {
    case "newest_first":
      params.sortField = "id";
      params.sortType = "DESC";
      break;
    case "price_asc":
      params.sortField = "price";
      params.sortType = "ASC";
      break;
    case "price_desc":
      params.sortField = "price";
      params.sortType = "DESC";
      break;
    default:
      params.sortField = "id";
      params.sortType = "DESC";
  }

  return params;
}

// Gọi API và cập nhật danh sách bài đăng
async function fetchProducts() {
  try {
    errorMsg.value = "";
    const queryParams = buildQueryParams();
    console.log("Query params sent to API:", queryParams); // Debug log
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
