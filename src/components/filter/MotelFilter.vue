<template>
  <aside class="hidden md:block w-80 bg-white p-4">
    <span class="font-extrabold text-base mb-4 flex items-center">
      <SlidersHorizontal class="w-5 h-5 mr-2" />
      <span>Bộ lọc</span>
    </span>

    <!-- Bộ lọc khoảng giá -->
    <div class="mb-6">
      <PriceRange
        ref="priceRangeRef"
        v-model="priceRangeLocal"
        :min="0"
        :max="30"
        :step="1"
        :tooltip="true"
      />
    </div>

    <!-- Bộ lọc đặc điểm - Chọn nhiều -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Đặc điểm</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(feature, idx) in featureOptions"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isFeatureSelected(feature.value) }"
          @click="toggleFeature(feature.value)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isFeatureSelected(feature.value)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isFeatureSelected(
                  feature.value
                ),
              }"
            >
              <CheckIcon
                v-if="isFeatureSelected(feature.value)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">{{ feature.label }}</span>
        </div>
      </div>
    </div>

    <!-- Add new color filter section -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Màu sắc</span>
      </div>
      <div class="grid grid-cols-4 gap-2 px-3">
        <div
          v-for="(color, idx) in colorOptions"
          :key="idx"
          class="flex flex-col items-center gap-1 cursor-pointer"
          @click="toggleFeature(color.value)"
        >
          <div class="relative">
            <div
              class="w-8 h-8 rounded-full border border-black flex items-center justify-center"
              :style="{ backgroundColor: color.color }"
            >
              <CheckIcon
                v-if="isFeatureSelected(color.value)"
                class="w-4 h-4"
                :class="
                  color.color === '#FFFFFF' ||
                  color.color === '#FFFFF0' ||
                  color.color === '#F5F5DC'
                    ? 'text-gray-800'
                    : 'text-white'
                "
              />
            </div>
          </div>
          <span class="text-xs text-center font-medium">{{ color.label }}</span>
        </div>
      </div>
    </div>

    <!-- Bộ lọc đặc điểm - Chọn nhiều -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Chất liệu</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(feature, idx) in feature2Options"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isFeatureSelected(feature.value) }"
          @click="toggleFeature(feature.value)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isFeatureSelected(feature.value)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isFeatureSelected(
                  feature.value
                ),
              }"
            >
              <CheckIcon
                v-if="isFeatureSelected(feature.value)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">{{ feature.label }}</span>
        </div>
      </div>
    </div>

    <!-- Nút đặt lại bộ lọc -->
    <div class="p-2 text-white">
      <button
        class="flex items-center space-x-2 font-bold border border-red-400 px-5 py-2 rounded bg-red-400 hover:bg-red-500 text-white hover:border-red-500 transition"
        @click="resetAll"
      >
        <ResetIcon class="w-4 h-4" />
        <span>Đặt lại</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, watch, defineEmits } from "vue";
import PriceRange from "@/components/range-slider/PriceRange.vue";

import {
  Filter as FilterIcon,
  Check as CheckIcon,
  RefreshCw as ResetIcon,
  SlidersHorizontal,
} from "lucide-vue-next";

// Định nghĩa emit để gửi thông tin bộ lọc đến component cha
const emit = defineEmits(["update:filters"]);

// Tham chiếu đến các component slider
const priceRangeRef = ref(null);
const acreageRangeRef = ref(null);

// Giá trị mặc định cho các bộ lọc
const priceRangeLocal = ref([0, 30]);
const acreageRangeLocal = ref([5, 95]);

// Danh sách các khu vực
const districtOptions = [
  { label: "An Đào", value: "An Đào" },
  { label: "Đào Nguyên", value: "Đào Nguyên" },
  { label: "Cửu Việt", value: "Cửu Việt" },
  { label: "Thành Chung", value: "Thành Chung" },
  { label: "Ngô Xuân Quảng", value: "Ngọ Xuân Quảng" },
  { label: "Vinhomes OCP", value: "Vinhomes Ocean Park" },
  { label: "Khu vực khác", value: "Khác" },
];

// Danh sách các đặc điểm
const featureOptions = [
  { label: "S", value: "full_furniture" },
  { label: "M", value: "has_kitchen" },
  { label: "L", value: "has_aircon" },
  { label: "XL", value: "has_washer" },
  { label: "2XL", value: "has_internet" },
  { label: "3XL", value: "no_toilet" },
  { label: "4XL", value: "no_owner" },
];

// Danh sách các đặc điểm
const feature2Options = [
  { label: "Cotton", value: "full_furniture" },
  { label: "Polyester", value: "has_kitchen" },
  { label: "Nylon", value: "has_aircon" },
  { label: "Wool", value: "has_washer" },
  { label: "Spandex", value: "has_internet" },
  { label: "Modal", value: "no_toilet" },
  { label: "Kapok", value: "no_owner" },
];

// Danh sách màu sắc
const colorOptions = [
  { label: "Đỏ", value: "red", color: "#FF0000" },
  { label: "Xanh lá", value: "green", color: "#00FF00" },
  { label: "Xanh dương", value: "blue", color: "#0000FF" },
  { label: "Vàng", value: "yellow", color: "#FFFF00" },
  { label: "Đen", value: "black", color: "#000000" },
  { label: "Trắng", value: "white", color: "#FFFFFF" },
  { label: "Cam", value: "orange", color: "#FFA500" },
  { label: "Tím", value: "purple", color: "#800080" },
];

// Khu vực - chỉ chọn một giá trị duy nhất
const selectedDistrict = ref(null);
// Đặc điểm - cho phép chọn nhiều giá trị
const selectedFeatures = ref([]);

// Xử lý chọn khu vực
function selectDistrict(value) {
  // Nếu click vào cùng giá trị đã chọn thì bỏ chọn
  if (selectedDistrict.value === value) {
    selectedDistrict.value = null;
  } else {
    // Chọn giá trị mới
    selectedDistrict.value = value;
  }
  updateFilters();
}

// Xử lý chọn đặc điểm
function toggleFeature(value) {
  const index = selectedFeatures.value.indexOf(value);
  if (index === -1) {
    // Thêm nếu chưa có trong danh sách
    selectedFeatures.value.push(value);
  } else {
    // Xóa nếu đã có trong danh sách
    selectedFeatures.value.splice(index, 1);
  }
  updateFilters();
}

// Kiểm tra đặc điểm đã được chọn chưa
function isFeatureSelected(value) {
  return selectedFeatures.value.includes(value);
}

// Đặt lại toàn bộ bộ lọc về giá trị mặc định
function resetAll() {
  // Đặt lại giá trị các bộ lọc
  priceRangeLocal.value = [0, 30];
  acreageRangeLocal.value = [0, 100];
  selectedDistrict.value = null;
  selectedFeatures.value = [];

  // Đặt lại lựa chọn nhanh trong component PriceRange
  if (priceRangeRef.value) {
    priceRangeRef.value.resetQuickPrice();
  }

  // Đặt lại lựa chọn nhanh trong component AcreageRange
  if (acreageRangeRef.value) {
    acreageRangeRef.value.resetQuickAcreage();
  }

  // Cập nhật bộ lọc sau khi đặt lại
  updateFilters();

  // Cuộn trang lên đầu
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Cập nhật và gửi thông tin bộ lọc đến component cha
function updateFilters() {
  emit("update:filters", {
    priceRange: priceRangeLocal.value,
    acreageRange: acreageRangeLocal.value,
    districtSelected: selectedDistrict.value,
    featuresSelected: selectedFeatures.value,
  });
}

// Theo dõi thay đổi của các bộ lọc để cập nhật
watch(priceRangeLocal, updateFilters);
watch(acreageRangeLocal, updateFilters);
</script>

<style scoped>
/* Có thể thêm CSS tùy chỉnh nếu cần */
</style>
