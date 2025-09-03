<template>
  <div
    class="rounded-lg p-4 hover:scale-[1.03] hover:shadow-lg hover:bg-white transition flex flex-col w-full"
  >
    <div class="w-full flex flex-col gap-2">
      <div class="w-full h-80 bg-gray-200 rounded-2xl overflow-hidden relative">
        <!-- NEW badge -->
        <div
          class="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium"
        >
          NEW
        </div>
        <img
          :src="thumbnailImage"
          alt="preview"
          @error="onImgError"
          class="object-cover w-full h-full"
        />
      </div>
    </div>
    <div class="flex-1 flex flex-col py-3">
      <!-- Hiển thị tiêu đề bài đăng -->
      <span
        class="line-clamp-2 text-base font-medium text-gray-800 mb-2 text-left leading-tight"
        >{{ product.title }}</span
      >

      <!-- Price section with discount -->
      <div class="flex items-center gap-2 text-left">
        <!-- Current discounted price -->
        <span class="text-lg font-bold text-black">
          {{ formatPrice(product.criteriaDTO?.price) }}
        </span>

        <!-- Discount percentage badge and original price - only show if there's a valid discount -->
        <template v-if="hasValidDiscount">
          <span
            class="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
          >
            -{{ discountPercentage }}%
          </span>

          <!-- Original price with strikethrough -->
          <span class="text-sm text-gray-400 line-through">
            {{ formatPrice(product.criteriaDTO?.originalPrice) }}
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, onMounted, watch } from "vue";
import {
  Phone as PhoneIcon,
  MapPin as MapPinIcon,
  Clock,
  Truck,
  Tag,
  GraduationCap,
} from "lucide-vue-next";
import { getImageByProduct } from "@/apis/imageService";

const props = defineProps({
  product: { type: Object, required: true },
});

const placeholder =
  "https://dummyimage.com/400x300/cccccc/000000.png&text=No+Image";
const fetchedImages = ref([]);

// Lấy danh sách hình ảnh của bài đăng
async function fetchImages() {
  if (!props.product.id) return;
  try {
    const images = await getImageByProduct(props.product.id);
    fetchedImages.value = Array.isArray(images) ? images : [];
  } catch {
    fetchedImages.value = [];
  }
}

onMounted(fetchImages);
watch(() => props.product.id, fetchImages);

// Lấy hình ảnh đầu tiên làm thumbnail hoặc sử dụng ảnh placeholder
const thumbnailImage = computed(() => {
  return fetchedImages.value.length > 0 ? fetchedImages.value[0] : placeholder;
});

// Calculate discount percentage - simplified and accurate
const discountPercentage = computed(() => {
  const originalPrice =
    parseFloat(props.product.criteriaDTO?.originalPrice) || 0;
  const currentPrice = parseFloat(props.product.criteriaDTO?.price) || 0;

  if (originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  return 0;
});

// Check if there's a valid discount to display
const hasValidDiscount = computed(() => {
  const originalPrice =
    parseFloat(props.product.criteriaDTO?.originalPrice) || 0;
  const currentPrice = parseFloat(props.product.criteriaDTO?.price) || 0;

  return originalPrice > 0 && currentPrice > 0 && originalPrice > currentPrice;
});

// Format price with thousand separators
const formatPrice = (price) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
};

// Xử lý lỗi khi không tải được hình ảnh
function onImgError(event) {
  console.error("⚠️ Image failed to load:", event.target.src);
  event.target.src = placeholder;
}
</script>

<style scoped>
/* Giới hạn nội dung text chỉ hiển thị 2 dòng */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}
</style>
