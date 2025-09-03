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
        :max="100"
        :step="1"
        :tooltip="true"
      />
    </div>

    <!-- Bộ lọc giới tính -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Giới tính</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isGenderSelected(true) }"
          @click="toggleGender(true)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isGenderSelected(true)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isGenderSelected(true),
              }"
            >
              <CheckIcon
                v-if="isGenderSelected(true)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">Nam</span>
        </div>
        <div
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isGenderSelected(false) }"
          @click="toggleGender(false)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isGenderSelected(false)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isGenderSelected(false),
              }"
            >
              <CheckIcon
                v-if="isGenderSelected(false)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">Nữ</span>
        </div>
      </div>
    </div>

    <!-- Bộ lọc size - Chọn nhiều -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Size</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(size, idx) in sizeOptions"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isSizeSelected(size.value) }"
          @click="toggleSize(size.value)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isSizeSelected(size.value)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isSizeSelected(size.value),
              }"
            >
              <CheckIcon
                v-if="isSizeSelected(size.value)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">{{ size.label }}</span>
        </div>
      </div>
    </div>

    <!-- Color filter section -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Màu sắc</span>
      </div>
      <div class="grid grid-cols-4 gap-2 px-3">
        <div
          v-for="(color, idx) in colorOptions"
          :key="idx"
          class="flex flex-col items-center gap-1 cursor-pointer"
          @click="toggleColor(color.value)"
        >
          <div class="relative">
            <!-- Conditional rendering based on selection -->
            <div
              v-if="isColorSelected(color.value)"
              class="w-12 h-12 rounded-full border-2 border-black bg-white flex items-center justify-center p-0.5"
            >
              <!-- Inner colored circle when selected -->
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: color.color }"
              >
                <CheckIcon
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

            <!-- Simple colored circle when not selected using Color component -->
            <Color v-else :color="color.color" />
          </div>
          <span class="text-xs text-center font-medium">{{ color.label }}</span>
        </div>
      </div>
    </div>

    <!-- Bộ lọc chất liệu - Chọn nhiều -->
    <div class="mb-4">
      <div class="p-3 text-left">
        <span class="font-bold text-base mb-2">Chất liệu</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(material, idx) in materialOptions"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-stone-500"
          :class="{ 'text-stone-500': isMaterialSelected(material.value) }"
          @click="toggleMaterial(material.value)"
        >
          <div class="relative">
            <input
              type="checkbox"
              class="hidden"
              :checked="isMaterialSelected(material.value)"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
              :class="{
                'bg-stone-500 border-stone-500 ': isMaterialSelected(
                  material.value
                ),
              }"
            >
              <CheckIcon
                v-if="isMaterialSelected(material.value)"
                class="w-3 h-3 text-white"
              />
            </div>
          </div>
          <span class="ml-2 text-xs font-medium">{{ material.label }}</span>
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
import Color, { colorSets } from "@/components/color/Color.vue";

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
const priceRangeLocal = ref([0, 100]);
const acreageRangeLocal = ref([5, 95]);
const selectedGenders = ref([]); // Thay đổi thành mảng để lưu nhiều giá trị

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

// Danh sách các size
const sizeOptions = [
  { label: "S", value: "S" },
  { label: "M", value: "M" },
  { label: "L", value: "L" },
  { label: "XL", value: "XL" },
  { label: "2XL", value: "2XL" },
  { label: "3XL", value: "3XL" },
  { label: "4XL", value: "4XL" },
];

// Danh sách các chất liệu
const materialOptions = [
  { label: "Cotton", value: "Cotton" },
  { label: "Polyester", value: "Polyester" },
  { label: "Nylon", value: "Nylon" },
  { label: "Wool", value: "Wool" },
  { label: "Spandex", value: "Spandex" },
  { label: "Modal", value: "Modal" },
  { label: "Kapok", value: "Kapok" },
];

// Danh sách màu sắc - mapping đúng với dữ liệu backend
const colorOptions = [
  { label: "Be", value: "Be", color: "#F5F5DC" }, // Từ API response
  { label: "Đỏ", value: "Đỏ", color: "#FF0000" },
  { label: "Xanh", value: "Xanh", color: "#0000FF" },
  { label: "Vàng", value: "Vàng", color: "#FFFF00" },
  { label: "Đen", value: "Đen", color: "#000000" },
  { label: "Trắng", value: "Trắng", color: "#FFFFFF" },
  { label: "Hồng", value: "Hồng", color: "#FFC0CB" },
  { label: "Xám", value: "Xám", color: "#808080" },
];

// Khu vực - chỉ chọn một giá trị duy nhất
const selectedDistrict = ref(null);
// Các filter riêng biệt cho từng loại
const selectedSizes = ref([]); // Sizes được chọn
const selectedMaterials = ref([]); // Materials được chọn
const selectedColors = ref([]); // Colors được chọn

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

// Xử lý chọn giới tính
function toggleGender(value) {
  const index = selectedGenders.value.indexOf(value);
  if (index === -1) {
    selectedGenders.value.push(value);
  } else {
    selectedGenders.value.splice(index, 1);
  }
  updateFilters();
}

// Kiểm tra giới tính đã được chọn chưa
function isGenderSelected(value) {
  return selectedGenders.value.includes(value);
}

// Xử lý chọn size
function toggleSize(value) {
  const index = selectedSizes.value.indexOf(value);
  if (index === -1) {
    selectedSizes.value.push(value);
  } else {
    selectedSizes.value.splice(index, 1);
  }
  updateFilters();
}

// Xử lý chọn material
function toggleMaterial(value) {
  const index = selectedMaterials.value.indexOf(value);
  if (index === -1) {
    selectedMaterials.value.push(value);
  } else {
    selectedMaterials.value.splice(index, 1);
  }
  updateFilters();
}

// Xử lý chọn color
function toggleColor(value) {
  const index = selectedColors.value.indexOf(value);
  if (index === -1) {
    selectedColors.value.push(value);
  } else {
    selectedColors.value.splice(index, 1);
  }
  updateFilters();
}

// Kiểm tra size đã được chọn chưa
function isSizeSelected(value) {
  return selectedSizes.value.includes(value);
}

// Kiểm tra material đã được chọn chưa
function isMaterialSelected(value) {
  return selectedMaterials.value.includes(value);
}

// Kiểm tra color đã được chọn chưa
function isColorSelected(value) {
  return selectedColors.value.includes(value);
}

// Đặt lại toàn bộ bộ lọc về giá trị mặc định
function resetAll() {
  // Đặt lại giá trị các bộ lọc
  priceRangeLocal.value = [0, 100];
  acreageRangeLocal.value = [0, 100];
  selectedDistrict.value = null;
  selectedSizes.value = [];
  selectedMaterials.value = [];
  selectedColors.value = [];
  selectedGenders.value = []; // Đặt lại giới tính

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
  // Xử lý logic giới tính
  let genderValue = null;
  if (selectedGenders.value.length === 1) {
    // Chỉ chọn 1 giới tính
    genderValue = selectedGenders.value[0];
  } else if (
    selectedGenders.value.length === 0 ||
    selectedGenders.value.length === 2
  ) {
    // Không chọn gì hoặc chọn cả 2 -> lấy tất cả
    genderValue = null;
  }

  emit("update:filters", {
    priceRange: priceRangeLocal.value,
    acreageRange: acreageRangeLocal.value,
    districtSelected: selectedDistrict.value,
    sizesSelected: selectedSizes.value, // Filter theo sizes
    materialsSelected: selectedMaterials.value, // Filter theo materials
    colorsSelected: selectedColors.value, // Filter theo colors
    gender: genderValue, // Filter theo giới tính
  });
}

// Theo dõi thay đổi của các bộ lọc để cập nhật
watch(priceRangeLocal, updateFilters);
watch(acreageRangeLocal, updateFilters);
</script>

<style scoped>
/* Có thể thêm CSS tùy chỉnh nếu cần */
</style>
