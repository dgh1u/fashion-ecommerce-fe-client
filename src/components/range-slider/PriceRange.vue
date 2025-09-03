<template>
  <div class="p-3">
    <div class="pb-12 text-left">
      <span class="font-bold text-lg">Giá</span>
      <span class="font-semibold text-gray-400 text-sm"> (VND)</span>
    </div>

    <!-- Thanh slider điều chỉnh giá -->
    <Slider
      :range="true"
      :min="min"
      :max="max"
      :step="step"
      :tooltip="tooltip"
      :modelValue="modelValue"
      @update:modelValue="updateValue"
      class="slider-red"
    />
    <p class="pt-2 text-sm text-center font-medium">
      Giá từ: <strong>{{ formatPrice(modelValue[0]) }}</strong>
      <span class="text-gray-500"> đến </span>
      <strong>{{ formatPrice(modelValue[1]) }}</strong>
    </p>

    <!-- Checkbox chọn khoảng giá nhanh -->
    <div class="mt-3 grid grid-cols-2 gap-3">
      <div
        v-for="(range, idx) in quickPriceRanges"
        :key="idx"
        class="flex items-center space-x-2 cursor-pointer hover:text-stone-500"
        @click.prevent="applyQuickPrice(range)"
        :class="{ 'text-stone-500': isQuickRangeSelected(range) }"
      >
        <div class="relative">
          <div
            class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center"
            :class="{
              'bg-stone-500 border-stone-500': isQuickRangeSelected(range),
            }"
          >
            <CheckIcon
              v-if="isQuickRangeSelected(range)"
              class="w-3 h-3 text-white"
            />
          </div>
        </div>
        <span class="text-sm font-medium">{{ range.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, defineExpose } from "vue";
import Slider from "@vueform/slider";
import { Check as CheckIcon } from "lucide-vue-next";

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [0, 100], // Đổi sang 0-100 (tương ứng với 0-10 triệu VND)
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100, // Đổi sang 100 (tương ứng với 10 triệu VND)
  },
  step: {
    type: Number,
    default: 1,
  },
  tooltip: {
    type: Boolean,
    default: true,
  },
});

const emits = defineEmits(["update:modelValue"]);

// Danh sách các khoảng giá nhanh (theo trăm nghìn đồng)
const quickPriceRanges = [
  { label: "Dưới 100k", min: 0, max: 1 },
  { label: "100k - 200k", min: 1, max: 2 },
  { label: "200k - 300k", min: 2, max: 3 },
  { label: "300k - 500k", min: 3, max: 5 },
  { label: "500k - 1 triệu", min: 5, max: 10 },
  { label: "Trên 1 triệu", min: 10, max: 100 },
];

// Lưu trạng thái khoảng giá nhanh được chọn
const quickPriceSelected = ref(null);

// Format hiển thị giá
function formatPrice(value) {
  if (value === 0) {
    return "0đ";
  } else if (value <= 10) {
    // 0-10: hiển thị theo trăm nghìn (100k, 200k, ...)
    return `${value * 100}k`;
  } else {
    // 10-100: hiển thị theo triệu (1.1 triệu, 1.2 triệu, ...)
    return `${(value / 10).toFixed(1)} triệu`;
  }
}

/**
 * Cập nhật giá trị slider và phát ra sự kiện
 * @param {Array} val - Giá trị mới của slider [min, max]
 * @param {Boolean} resetQuick - Có reset lựa chọn nhanh hay không
 */
function updateValue(val, resetQuick = true) {
  emits("update:modelValue", val);
  if (resetQuick) {
    quickPriceSelected.value = null;
  }
}

/**
 * Áp dụng khoảng giá nhanh khi người dùng chọn
 * Nếu chọn lại khoảng giá đang active thì sẽ bỏ chọn
 */
function applyQuickPrice(range) {
  if (
    quickPriceSelected.value &&
    quickPriceSelected.value.label === range.label
  ) {
    quickPriceSelected.value = null;
    updateValue([props.min, props.max], false);
  } else {
    quickPriceSelected.value = range;
    updateValue([range.min, range.max], false);
  }
}

/**
 * Kiểm tra xem khoảng giá nhanh có đang được chọn không
 * @param {Object} range - Khoảng giá cần kiểm tra
 * @returns {Boolean} - True nếu đang được chọn
 */
function isQuickRangeSelected(range) {
  return (
    quickPriceSelected.value && quickPriceSelected.value.label === range.label
  );
}

/**
 * Reset lựa chọn khoảng giá nhanh về trạng thái ban đầu
 */
function resetQuickPrice() {
  quickPriceSelected.value = null;
}

// Cung cấp các phương thức cho component cha sử dụng
defineExpose({
  resetQuickPrice,
});
</script>

<!-- Import theme mặc định cho slider -->
<style src="@vueform/slider/themes/default.css"></style>

<style scoped>
.slider-red {
  --slider-connect-bg: #78716c;
  --slider-tooltip-bg: #78716c;
  --slider-handle-ring-color: #ef444430;
}
</style>
