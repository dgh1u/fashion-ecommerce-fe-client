<template>
  <aside class="hidden md:block w-100 bg-gray-100 shadow-lg rounded-2xl p-4">
    <span class="font-extrabold text-lg mb-4 flex items-center">
      <FilterIcon class="w-5 h-5 mr-2" />
      <span>Bộ lọc</span>
    </span>
    <!-- Lựa chọn loại quán nước - Chỉ cho phép chọn một tùy chọn -->
    <div class="mb-6">
      <div class="p-3 text-left">
        <span class="font-bold text-lg mb-2">Loại tài liệu</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(secondMotel, idx) in secondMotelOptions"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-teal-500"
          :class="{
            'text-teal-500': selectedSecondMotel === secondMotel.value,
          }"
          @click="selectSecondMotel(secondMotel.value)"
        >
          <div class="relative">
            <input
              type="radio"
              class="hidden"
              :checked="selectedSecondMotel === secondMotel.value"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center"
              :class="{
                'bg-teal-500 border-teal-500':
                  selectedSecondMotel === secondMotel.value,
              }"
            >
              <div
                v-if="selectedSecondMotel === secondMotel.value"
                class="w-3 h-3 rounded-full bg-white"
              ></div>
            </div>
          </div>
          <span class="ml-2 text-sm">{{ secondMotel.label }}</span>
        </div>
      </div>
    </div>

    <!-- Lựa chọn khu vực - Chỉ cho phép chọn một tùy chọn -->
    <div class="mb-6">
      <div class="p-3 text-left">
        <span class="font-bold text-lg mb-2">Chuyên ngành</span>
      </div>
      <div class="grid grid-cols-2">
        <div
          v-for="(major, idx) in majorOptions"
          :key="idx"
          class="flex items-center p-2 rounded-lg cursor-pointer hover:text-teal-500"
          :class="{ 'text-teal-500': selectedMajor === major.value }"
          @click="selectMajor(major.value)"
        >
          <div class="relative">
            <input
              type="radio"
              class="hidden"
              :checked="selectedMajor === major.value"
              readonly
            />
            <div
              class="w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center"
              :class="{
                'bg-teal-500 border-teal-500': selectedMajor === major.value,
              }"
            >
              <div
                v-if="selectedMajor === major.value"
                class="w-3 h-3 rounded-full bg-white"
              ></div>
            </div>
          </div>
          <span class="ml-2 text-sm">{{ major.label }}</span>
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
import { ref, defineEmits } from "vue";

import {
  Filter as FilterIcon,
  Check as CheckIcon,
  RefreshCw as ResetIcon,
} from "lucide-vue-next";

// Định nghĩa sự kiện để gửi dữ liệu bộ lọc cho component cha
const emit = defineEmits(["update:filters"]);

// Danh sách các tùy chọn khu vực
const majorOptions = [
  { label: "Thú y", value: "Thú y" },
  { label: "Chăn nuôi - Thủy sản", value: "Chăn nuôi - Thủy sản" },
  { label: "Cơ điện", value: "Cơ điện" },
  { label: "Công nghệ thông tin", value: "Công nghệ thông tin" },
  { label: "Kinh tế", value: "Kinh tế" },
  { label: "Công nghệ sinh học", value: "Công nghệ sinh học" },
  { label: "Công nghệ thực phẩm", value: "Công nghệ thực phẩm" },
  { label: "Nông học", value: "Nông học" },
  { label: "Khoa học môi trường", value: "Khoa học môi trường" },
  { label: "Xã hội học", value: "Xã hội học" },
  { label: "Ngôn ngữ", value: "Ngôn ngữ" },
  { label: "Du lịch", value: "Du lịch" },
  { label: "Sư phạm", value: "Sư phạm" },
  { label: "Quản lý đất đai", value: "Quản lý đất đai" },
];

// Danh sách các tùy chọn loại quán nước
const secondMotelOptions = [
  { label: "Giáo trình", value: "Giáo trình" },
  { label: "Sách tham khảo", value: "Sách tham khảo" },
  { label: "Khóa luận tốt nghiệp", value: "Khóa luận tốt nghiệp" },
  { label: "Báo cáo thực tập", value: "Báo cáo thực tập" },
  { label: "Nghiên cứu khoa học", value: "Nghiên cứu khoa học" },
  { label: "Bài báo khoa học", value: "Bài báo khoa học" },
  { label: "Tài liệu khác", value: "Tài liệu khác" },
];

// Khai báo trạng thái cho các lựa chọn
const selectedMajor = ref(null); // Lưu khu vực được chọn
const selectedSecondMotel = ref(null); // Lưu loại quán nước được chọn

// Hàm xử lý chọn khu vực (chỉ một tùy chọn được chọn)
function selectMajor(value) {
  if (selectedMajor.value === value) {
    // Nếu click vào giá trị đã chọn, bỏ chọn nó
    selectedMajor.value = null;
  } else {
    // Chọn giá trị mới
    selectedMajor.value = value;
  }
  updateFilters();
}

// Hàm xử lý chọn loại quán nước (chỉ một tùy chọn được chọn)
function selectSecondMotel(value) {
  if (selectedSecondMotel.value === value) {
    // Nếu click vào giá trị đã chọn, bỏ chọn nó
    selectedSecondMotel.value = null;
  } else {
    // Chọn giá trị mới
    selectedSecondMotel.value = value;
  }
  updateFilters();
}

// Đặt lại toàn bộ bộ lọc
function resetAll() {
  selectedMajor.value = null;
  selectedSecondMotel.value = null;

  updateFilters();

  // Cuộn trang lên đầu
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Cập nhật và gửi thông tin bộ lọc cho component cha
function updateFilters() {
  emit("update:filters", {
    majorSelected: selectedMajor.value,
    secondMotelSelected: selectedSecondMotel.value,
  });
}
</script>

<style scoped>
/* Có thể thêm style tùy chỉnh ở đây nếu cần */
</style>
