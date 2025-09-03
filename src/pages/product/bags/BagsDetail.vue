<template>
  <DefaultLayout>
    <!-- Breadcrumb định hướng -->
    <div
      class="pt-4 px-6"
      v-if="product"
      data-aos="zoom-out"
      data-aos-duration="800"
    >
      <div class="text-sm flex items-center flex-wrap space-x-1">
        <router-link
          to="/product/bags"
          class="hover:underline font-medium text-gray-400"
        >
          Túi xách
        </router-link>
        <span class="text-gray-400">/</span>
        <span class="font-semibold text-black">
          {{ product.title }}
        </span>
      </div>
    </div>

    <!-- Main container - change to flex column -->
    <div class="flex flex-col min-h-screen">
      <!-- Content columns wrapper -->
      <div class="flex flex-col lg:flex-row flex-1">
        <!-- Left column (Image Gallery) -->
        <div class="w-full lg:w-140 mx-auto mr-10 p-4 bg-white">
          <!-- Image Gallery Section -->
          <div class="rounded-xl my-6">
            <div class="flex gap-4">
              <!-- Thumbnail Gallery - Left Side -->
              <div
                v-if="imageUrls.length > 1"
                class="flex flex-col gap-2 overflow-y-auto max-h-96"
              >
                <div
                  v-for="(imageUrl, index) in imageUrls"
                  :key="index"
                  class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200"
                  :class="{
                    'border-sky-500': currentImageIndex === index,
                    'border-gray-200 hover:border-gray-300':
                      currentImageIndex !== index,
                  }"
                  @click="selectImage(index)"
                >
                  <img
                    :src="imageUrl"
                    alt="Thumbnail"
                    class="w-full h-full object-cover"
                    @error="handleThumbnailError($event, index)"
                  />
                </div>
              </div>

              <!-- Main Image Display - Right Side -->
              <div
                class="relative flex-1 aspect-[3/4] rounded-xl overflow-hidden"
              >
                <img
                  :src="currentImage"
                  alt="Clothing Image"
                  class="w-full h-full object-cover transition-all duration-300"
                  @error="handleImageError"
                />

                <!-- Navigation arrows for main image -->
                <div
                  v-if="imageUrls.length > 1"
                  class="absolute inset-0 flex items-center justify-between p-2"
                >
                  <button
                    @click="previousImage"
                    class="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
                    :disabled="currentImageIndex === 0"
                    :class="{
                      'opacity-50 cursor-not-allowed': currentImageIndex === 0,
                    }"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    @click="nextImage"
                    class="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
                    :disabled="currentImageIndex === imageUrls.length - 1"
                    :class="{
                      'opacity-50 cursor-not-allowed':
                        currentImageIndex === imageUrls.length - 1,
                    }"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Image counter -->
                <div
                  v-if="imageUrls.length > 1"
                  class="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-sm"
                >
                  {{ currentImageIndex + 1 }} / {{ imageUrls.length }}
                </div>
              </div>
            </div>
          </div>

          <!-- Các nút thao tác dành cho chủ bài đăng -->
          <div class="py-4 sm:py-8">
            <div v-if="isOwner" class="p-4 rounded-xl">
              <div class="text-center">
                <span class="font-semibold text-base sm:text-lg">Thao tác</span>
              </div>
              <div class="pt-4">
                <div
                  class="w-full py-2 rounded-xl flex items-center justify-center font-medium bg-sky-100 text-sm sm:text-base"
                >
                  <span class="font-normal">Trạng thái:&nbsp;</span>
                  <span
                    :class="{
                      'text-green-500': displayStatus === 'Đã duyệt',
                      'text-yellow-500': displayStatus === 'Chờ duyệt',
                      'text-red-500': displayStatus === 'Bị khóa',
                    }"
                  >
                    {{ displayStatus }}
                  </span>
                </div>
              </div>
              <div class="py-2">
                <router-link
                  :to="`/update-product/${product.id}`"
                  class="bg-yellow-500 hover:bg-yellow-600 w-full py-2 sm:py-3 rounded-xl flex items-center justify-center text-white text-sm sm:text-base"
                >
                  <span class="font-medium">Cập nhật</span>
                </router-link>
              </div>
              <div class="text-white">
                <button
                  @click="toggleHideProduct"
                  :class="
                    product.del === false
                      ? 'bg-red-400 hover:bg-red-500'
                      : 'bg-green-400 hover:bg-green-500'
                  "
                  class="w-full py-2 sm:py-3 rounded-xl mt-2 flex items-center justify-center text-white text-sm sm:text-base"
                >
                  <span class="font-medium">
                    {{
                      product.del === false ? "Ẩn tin đăng" : "Hiện tin đăng"
                    }}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right column (Details) -->
        <div class="flex-1 p-4 bg-white order-1 lg:order-2">
          <!-- Chi tiết bài đăng -->
          <div v-if="product" class="rounded-xl p-4 text-left">
            <div>
              <div>
                <span class="text-xl sm:text-3xl font-bold">{{
                  product.title
                }}</span>

                <!-- Địa chỉ và thông tin khu vực -->
                <div
                  class="flex flex-col sm:flex-row sm:justify-between text-sm my-2 gap-2"
                >
                  <div class="flex items-center flex-wrap">
                    <span class="text-sm font-medium">
                      Mã sản phẩm:<span class="ml-1 text-gray-400">
                        {{ product.id }}</span
                      >
                    </span>
                  </div>
                </div>
                <hr class="my-3 mx-2 sm:mx-6 border-gray-100" />
                <div
                  class="flex items-center justify-between flex-wrap gap-2 sm:gap-4 mt-2"
                >
                  <div class="flex items-center flex-wrap gap-2 sm:gap-4">
                    <div class="flex flex-col">
                      <!-- Giá gốc - chỉ hiển thị nếu có giảm giá -->
                      <div
                        v-if="hasValidDiscount"
                        class="text-gray-400 line-through font-semibold text-lg"
                      >
                        {{
                          new Intl.NumberFormat("vi-VN").format(
                            product.criteriaDTO.originalPrice
                          )
                        }}đ
                      </div>

                      <!-- Giá hiện tại và badge giảm giá -->
                      <div class="flex items-center gap-3">
                        <span class="text-2xl font-bold text-black">
                          {{
                            new Intl.NumberFormat("vi-VN").format(
                              product.criteriaDTO.price
                            )
                          }}đ
                        </span>
                        <span
                          v-if="hasValidDiscount"
                          class="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded"
                        >
                          -{{ discountPercentage }}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Thêm giỏ hàng -->
                <div class="mt-6">
                  <!-- Kích cỡ -->
                  <div class="mb-4">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-base">Kích thước:</span>
                        <span class="text-black font-semibold text-base">{{
                          selectedSize?.name || "Chưa chọn"
                        }}</span>
                        <span v-if="selectedSize" class="text-gray-500 text-sm">
                          (Còn {{ getAvailableQuantity(selectedSize.id) }} sản
                          phẩm)
                        </span>
                      </div>
                      <a
                        href="#"
                        class="text-blue-600 text-xs font-medium hover:underline"
                        >Hướng dẫn chọn size</a
                      >
                    </div>

                    <!-- Updated size selection design -->
                    <div class="flex gap-3 mt-3">
                      <button
                        v-for="inventory in product.inventories"
                        :key="inventory.size.id"
                        class="min-w-[70px] h-12 px-3 rounded-xl flex items-center justify-center transition-all duration-200 font-medium text-base relative"
                        :class="[
                          selectedSize?.id === inventory.size.id
                            ? 'bg-black !text-white border-2 border-black'
                            : inventory.quantity > 0
                            ? 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-2 border-transparent hover:border-gray-400'
                            : 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed relative',
                        ]"
                        :disabled="inventory.quantity === 0"
                        @click="selectSize(inventory.size, inventory.quantity)"
                      >
                        {{ inventory.size.name }}

                        <!-- Diagonal line for disabled/out of stock sizes -->
                        <div
                          v-if="inventory.quantity === 0"
                          class="absolute inset-0 flex items-center justify-center"
                        >
                          <div
                            class="w-full h-0.5 bg-gray-400 transform rotate-45 absolute"
                          ></div>
                        </div>
                      </button>
                    </div>
                  </div>
                  <div class="font-medium py-2 text-base">
                    Chất liệu chính:<span class="ml-1 text-gray-400">
                      {{ product.criteriaDTO.material }}</span
                    >
                  </div>

                  <div class="font-medium text-base">
                    Màu sắc:<span class="ml-1 text-gray-400">
                      {{ product.criteriaDTO.color }}</span
                    >
                    <!-- Hiển thị button màu tương ứng -->
                    <div v-if="productColor" class="mt-2">
                      <Color :color="productColor.color" />
                    </div>
                  </div>

                  <!-- Số lượng và nút thêm vào giỏ -->
                  <div class="flex flex-col gap-3 pt-8">
                    <div class="flex items-center gap-4 mb-2">
                      <div
                        class="flex items-center bg-gray-100 rounded-2xl font-medium"
                      >
                        <button
                          class="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-l transition-colors"
                          :disabled="quantity <= 1 || !selectedSize"
                          :class="{
                            'opacity-50 cursor-not-allowed':
                              quantity <= 1 || !selectedSize,
                          }"
                          @click="decreaseQuantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          v-model.number="quantity"
                          class="w-12 h-10 bg-gray-100 text-center focus:outline-none [-moz-appearance:_textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          :min="1"
                          :max="getMaxQuantity()"
                          :disabled="!selectedSize"
                          @input="validateQuantity"
                        />
                        <button
                          class="w-10 h-10 flex items-center justify-center text-lg font-medium hover:bg-gray-200 rounded-r transition-colors"
                          :disabled="
                            !selectedSize || quantity >= getMaxQuantity()
                          "
                          :class="{
                            'opacity-50 cursor-not-allowed':
                              !selectedSize || quantity >= getMaxQuantity(),
                          }"
                          @click="increaseQuantity"
                        >
                          +
                        </button>
                      </div>
                      <div class="flex flex-col">
                        <div class="text-lg font-semibold">
                          {{
                            new Intl.NumberFormat("vi-VN").format(
                              product.criteriaDTO.price * quantity
                            )
                          }}đ
                        </div>
                      </div>
                    </div>
                    <div class="text-white font-medium pt-2 text-lg">
                      <button
                        class="w-full py-3 transition-colors rounded-xl"
                        :class="
                          selectedSize &&
                          quantity > 0 &&
                          quantity <= getMaxQuantity()
                            ? 'bg-stone-800 hover:bg-stone-900'
                            : 'bg-gray-400 cursor-not-allowed'
                        "
                        :disabled="
                          !selectedSize ||
                          quantity <= 0 ||
                          quantity > getMaxQuantity()
                        "
                        @click="addToCart"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                    <div class="text-white font-medium text-lg">
                      <button
                        class="w-full py-3 transition-colors rounded-xl"
                        :class="
                          selectedSize &&
                          quantity > 0 &&
                          quantity <= getMaxQuantity()
                            ? 'bg-stone-600 hover:bg-stone-900'
                            : 'bg-gray-400 cursor-not-allowed'
                        "
                        :disabled="
                          !selectedSize ||
                          quantity <= 0 ||
                          quantity > getMaxQuantity()
                        "
                        @click="buyNow"
                      >
                        Mua ngay
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Các đặc điểm của quán -->
              </div>
            </div>

            <!-- PHẦN TÀI LIỆU -->
            <div v-if="clothings && clothings.length > 0" class="pt-4">
              <div class="rounded-xl p-4 text-left">
                <div class="pb-4">
                  <span class="text-xl font-bold">Tài liệu đính kèm</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    v-for="doc in clothings"
                    :key="doc.id"
                    class="flex items-center p-4 bg-white rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all cursor-pointer group"
                    @click="handleClothingClick(doc)"
                  >
                    <!-- File Icon -->
                    <div
                      class="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3"
                    >
                      <!-- PDF Icon -->
                      <img
                        v-if="doc.fileType && doc.fileType.includes('pdf')"
                        src="@/assets/fileLogo/pdf.svg"
                        alt="PDF"
                        class="w-6 h-6"
                      />
                      <!-- Word Icon -->
                      <img
                        v-else-if="
                          doc.fileType &&
                          (doc.fileType.includes('word') ||
                            doc.fileName.includes('.docx') ||
                            doc.fileName.includes('.doc'))
                        "
                        src="@/assets/fileLogo/word.svg"
                        alt="Word Clothing"
                        class="w-6 h-6"
                      />
                      <!-- PowerPoint Icon -->
                      <img
                        v-else-if="
                          doc.fileType &&
                          (doc.fileType.includes('presentation') ||
                            doc.fileName.includes('.ppt') ||
                            doc.fileName.includes('.pptx'))
                        "
                        src="@/assets/fileLogo/pp.svg"
                        alt="PowerPoint Presentation"
                        class="w-6 h-6"
                      />
                      <!-- Excel Icon -->
                      <img
                        v-else-if="
                          doc.fileType &&
                          (doc.fileType.includes('excel') ||
                            doc.fileType.includes('spreadsheet') ||
                            doc.fileName.includes('.xlsx') ||
                            doc.fileName.includes('.xls'))
                        "
                        src="@/assets/fileLogo/excel.svg"
                        alt="Excel Spreadsheet"
                        class="w-6 h-6"
                      />

                      <!-- Zip Icon -->
                      <img
                        v-else-if="
                          doc.fileType &&
                          doc.fileType.includes('x-zip-compressed')
                        "
                        src="@/assets/fileLogo/zip.png"
                        alt="Zip"
                        class="w-6 h-6"
                      />

                      <!-- Default File Icon -->
                      <svg
                        v-else
                        class="w-6 h-6 text-gray-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 18h12V6l-4-4H4v16zm8-14v4h4l-4-4z" />
                      </svg>
                    </div>

                    <!-- File Info -->
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-sm font-semibold text-gray-900 truncate mb-1"
                      >
                        {{ doc.fileName }}
                      </p>
                      <span
                        class="text-xs text-gray-500 mb-1 flex justify-between items-center"
                      >
                        <span>{{
                          getFileTypeText(doc.fileType || doc.fileName)
                        }}</span>
                        <!-- Download hint hiện sát phải khi hover -->
                        <span
                          class="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium"
                        >
                          Click để tải về
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full bg-white px-4 pb-4">
        <!-- Description heading with bolder underline -->
        <div class="border-b-2 border-blue-500 inline-block">
          <span class="text-lg font-semibold">Mô tả</span>
        </div>
        <span class="block py-2 break-words text-sm sm:text-base">
          {{ product?.content }}
        </span>
      </div>

      <!-- Comments section - moved outside the columns -->
      <div class="w-full bg-white px-4 pb-4">
        <Comment v-if="product && product.id" :productId="product.id" />
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "../../../layouts/DefaultLayout.vue";
import Comment from "../../../components/comment/Comment.vue";
import Color, { colorSets } from "@/components/color/Color.vue";
import { getDetailProduct, hideProduct } from "@/apis/productService.js";
import { getImageByProduct } from "@/apis/imageService.js";
import { useAuthStore } from "@/stores/store";

import { getProfile } from "@/apis/authService.js";
import { message } from "ant-design-vue";
import {
  Phone,
  MapPin,
  Mail,
  Clock,
  CircleParking,
  Truck,
  UtensilsCrossed,
  ShoppingBag,
  Expand,
  Tag,
  GraduationCap,
} from "lucide-vue-next";
import {
  MapPin as MapPinIcon,
  Snowflake as SnowflakeIcon,
  Wifi as WifiIcon,
} from "lucide-vue-next";

const route = useRoute();
const router = useRouter();

const product = ref(null);
const errorMsg = ref("");
const currentUser = ref(null);

// Image gallery management
const imageUrls = ref([]);
const currentImageIndex = ref(0);

// Computed property for current image
const currentImage = computed(() => {
  return imageUrls.value.length > 0
    ? imageUrls.value[currentImageIndex.value]
    : "https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image";
});

// Gallery navigation methods
function selectImage(index) {
  currentImageIndex.value = index;
}

function nextImage() {
  if (currentImageIndex.value < imageUrls.value.length - 1) {
    currentImageIndex.value++;
  }
}

function previousImage() {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  }
}

// Định dạng ngày tháng
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString();
}

// Tạo URL Google Maps
const mapUrl = computed(() => {
  if (!product.value?.criteriaDTO?.address) return "";
  const encodedAddress = encodeURIComponent(product.value.criteriaDTO.address);
  return `https://maps.google.com/maps?q=${encodedAddress}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
});

const displayStatus = computed(() => {
  if (!product.value) return "";

  if (product.value.approved === true && product.value.notApproved === false) {
    return "Đã duyệt";
  } else if (
    product.value.approved === true &&
    product.value.notApproved === true
  ) {
    return "Chờ duyệt";
  } else if (product.value.approved === false) {
    return "Bị khóa";
  }
  return "";
});

// Xử lý hiển thị avatar
const finalAvatar = computed(() => {
  const avatar = product.value?.userDTO?.b64;
  if (avatar) {
    return avatar.startsWith("data:image")
      ? avatar
      : "data:image/png;base64," + avatar;
  }
  return null;
});

// Tìm màu sắc tương ứng từ colorSets
const productColor = computed(() => {
  if (!product.value?.criteriaDTO?.color) return null;

  const colorValue = product.value.criteriaDTO.color.toLowerCase();
  const colorSet = colorSets.fashion;

  // Tìm màu trong colorSet dựa trên value hoặc label
  const foundColor = colorSet.find(
    (color) =>
      color.value.toLowerCase() === colorValue ||
      color.label.toLowerCase() === colorValue ||
      color.label.toLowerCase().includes(colorValue) ||
      colorValue.includes(color.label.toLowerCase())
  );

  return foundColor;
});

// Lấy thông tin chi tiết bài đăng
async function fetchProduct() {
  const id = route.params.id;
  try {
    const { data: result } = await getDetailProduct(id);
    product.value = result;
    await loadGalleryImages(result.id);
    clothings.value = result.clothings || [];

    // Auto-select first available size
    if (result.inventories && result.inventories.length > 0) {
      const firstAvailableInventory = result.inventories.find(
        (inv) => inv.quantity > 0
      );
      if (firstAvailableInventory) {
        selectSize(
          firstAvailableInventory.size,
          firstAvailableInventory.quantity
        );
      }
    }
  } catch (error) {
    errorMsg.value = "Có lỗi khi tải bài đăng";
  }
}

// Load gallery images
async function loadGalleryImages(productId) {
  try {
    const urls = await getImageByProduct(productId);
    if (Array.isArray(urls) && urls.length > 0) {
      imageUrls.value = urls;
      currentImageIndex.value = 0;
    } else {
      // Fallback to placeholder if no images
      imageUrls.value = [
        "https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image",
      ];
      currentImageIndex.value = 0;
    }
  } catch (err) {
    console.error("Error loading gallery images:", err);
    imageUrls.value = [
      "https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image",
    ];
    currentImageIndex.value = 0;
  }
}

// Error handlers for images
function handleImageError(e) {
  e.target.src =
    "https://dummyimage.com/800x600/cccccc/000000.png&text=No+Image";
}

function handleThumbnailError(e, index) {
  e.target.src = "https://dummyimage.com/200x200/cccccc/000000.png&text=Error";
}

// Hàm tải tài liệu đã được cập nhật để sử dụng API downloadDoc
async function handleClothingClick(doc) {
  try {
    console.log("💾 Tải tài liệu:", doc.file_name);
    console.log("🆔 Clothing ID:", doc.id);

    // Gọi API downloadDoc thay vì fetch trực tiếp
    const response = await downloadDoc(doc.id);

    console.log("📡 Response:", response);
    console.log("📡 Response type:", typeof response);
    console.log("📡 Is Blob:", response instanceof Blob);

    let blob;
    let downloadFileName = doc.fileName; // Fallback filename

    // Kiểm tra nếu response là Blob trực tiếp
    if (response instanceof Blob) {
      blob = response;
      console.log(
        "📦 Direct blob - size:",
        blob.size,
        "bytes, type:",
        blob.type
      );
    } else if (response.data) {
      // Nếu response có structure thông thường
      console.log("📡 Response headers:", response.headers);

      // Lấy filename từ Content-Disposition header nếu có
      if (response.headers && response.headers["content-disposition"]) {
        const contentDisposition = response.headers["content-disposition"];
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch && fileNameMatch[1]) {
          downloadFileName = fileNameMatch[1].replace(/['"]/g, "");
          console.log("📝 Filename từ header:", downloadFileName);
        }
      }

      // Kiểm tra xem response.data có hợp lệ không
      if (!response.data) {
        throw new Error("API không trả về dữ liệu file");
      }

      // Tạo blob từ response data
      blob = new Blob([response.data]);
    } else {
      throw new Error("Response format không được hỗ trợ");
    }

    console.log("📦 Final blob size:", blob.size, "bytes");
    console.log("📝 Download filename:", downloadFileName);

    if (blob.size === 0) {
      throw new Error("File rỗng");
    }

    // Tạo URL tạm từ blob và tải về
    const url = window.URL.createObjectURL(blob);
    const link = clothing.createElement("a");
    link.href = url;
    link.download = downloadFileName; // ⭐ Quan trọng: download attribute
    link.style.display = "none"; // Ẩn link

    // Thêm vào DOM, click, rồi xóa ngay
    clothing.body.appendChild(link);
    link.click();
    clothing.body.removeChild(link);

    // Cleanup URL sau 1 giây
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      console.log("🗑️ Cleaned up blob URL");
    }, 1000);

    message.success(
      `Đã tải về: ${downloadFileName} (${(blob.size / 1024 / 1024).toFixed(
        1
      )}MB)`
    );
  } catch (error) {
    console.error("❌ Lỗi tải file:", error);
    message.error(`Không thể tải file: ${error.message}`);
  }
}

function getFileTypeText(fileTypeOrName) {
  if (typeof fileTypeOrName === "string") {
    const lower = fileTypeOrName.toLowerCase();
    if (lower.includes("pdf")) return "PDF Clothing";
    if (lower.includes("word")) return "Word Clothing";
    if (lower.includes("presentation")) return "PowerPoint";
    if (lower.includes("spreadsheet")) return "Excel";
    if (lower.includes("x-zip-compressed")) return "Zip";
  }
  return "Clothing";
}

// Lấy thông tin người dùng hiện tại
async function fetchProfile() {
  try {
    const response = await getProfile();
    currentUser.value = response.data;
  } catch (error) {
    // Xử lý lỗi khi tải thông tin người dùng
  }
}

// Kiểm tra người xem có phải là chủ bài đăng
const isOwner = computed(() => {
  return (
    currentUser.value &&
    product.value &&
    product.value.userDTO &&
    currentUser.value.id === product.value.userDTO.id
  );
});

// Xử lý ẩn/hiện bài đăng
async function toggleHideProduct() {
  try {
    const response = await hideProduct(product.value.id);
    message.success(response.data.message);
    product.value.del = product.value.del === false ? true : false;
  } catch (error) {
    message.error("Có lỗi xảy ra khi ẩn/hiện tin đăng");
  }
}

// Simplified discount calculation - using criteriaDTO data consistently
const discountPercentage = computed(() => {
  if (!product.value?.criteriaDTO) return 0;

  const originalPrice =
    parseFloat(product.value.criteriaDTO.originalPrice) || 0;
  const currentPrice = parseFloat(product.value.criteriaDTO.price) || 0;

  if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  return 0;
});

// Check if there's a valid discount to display
const hasValidDiscount = computed(() => {
  if (!product.value?.criteriaDTO) return false;

  const originalPrice =
    parseFloat(product.value.criteriaDTO.originalPrice) || 0;
  const currentPrice = parseFloat(product.value.criteriaDTO.price) || 0;

  return originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
});

// Remove the old calculateDiscount function as it's replaced by computed properties

// Add new reactive variables for size and quantity management
const selectedSize = ref(null);
const quantity = ref(1);
const selectedInventory = ref(null);

// Functions for size and quantity management
function selectSize(size, availableQuantity) {
  if (availableQuantity > 0) {
    selectedSize.value = size;
    selectedInventory.value = product.value.inventories.find(
      (inv) => inv.size.id === size.id
    );
    // Reset quantity to 1 when changing size
    quantity.value = 1;
  }
}

function getAvailableQuantity(sizeId) {
  const inventory = product.value?.inventories?.find(
    (inv) => inv.size.id === sizeId
  );
  return inventory?.quantity || 0;
}

function getMaxQuantity() {
  if (!selectedSize.value) return 0;
  return getAvailableQuantity(selectedSize.value.id);
}

function increaseQuantity() {
  const maxQty = getMaxQuantity();
  if (quantity.value < maxQty) {
    quantity.value++;
  }
}

function decreaseQuantity() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}

function validateQuantity() {
  const maxQty = getMaxQuantity();
  if (quantity.value < 1) {
    quantity.value = 1;
  } else if (quantity.value > maxQty) {
    quantity.value = maxQty;
  }
}

// Updated addToCart function
const addToCart = () => {
  if (!selectedSize.value) {
    message.warning("Vui lòng chọn kích thước");
    return;
  }

  if (quantity.value <= 0 || quantity.value > getMaxQuantity()) {
    message.warning("Số lượng không hợp lệ");
    return;
  }

  // TODO: Implement add to cart functionality with size and quantity
  message.success(
    `Đã thêm ${quantity.value} sản phẩm size ${selectedSize.value.name} vào giỏ hàng`
  );
};

// Add buyNow function
const buyNow = () => {
  if (!selectedSize.value) {
    message.warning("Vui lòng chọn kích thước");
    return;
  }

  if (quantity.value <= 0 || quantity.value > getMaxQuantity()) {
    message.warning("Số lượng không hợp lệ");
    return;
  }

  // TODO: Implement buy now functionality
  message.success(
    `Mua ngay ${quantity.value} sản phẩm size ${selectedSize.value.name}`
  );
};

onMounted(() => {
  fetchProduct();

  const authStore = useAuthStore();
  if (authStore.isAuthenticated && authStore.token?.trim() !== "") {
    fetchProfile();
  }
});
</script>

<style scoped>
.break-words {
  word-break: break-word;
}

.object-cover {
  object-fit: cover;
}

/* Custom scrollbar for thumbnail gallery */
.flex.gap-2.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.flex.gap-2.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.flex.gap-2.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.flex.gap-2.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Enhanced button styles */
button:disabled {
  cursor: not-allowed !important;
  opacity: 0.6;
}

.cursor-not-allowed {
  cursor: not-allowed !important;
}

/* Smooth transitions for size buttons */
button {
  transition: all 0.2s ease-in-out;
}

button:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Diagonal line animation */
button:disabled .absolute div {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: rotate(45deg) scaleX(0);
  }
  to {
    opacity: 1;
    transform: rotate(45deg) scaleX(1);
  }
}
</style>
