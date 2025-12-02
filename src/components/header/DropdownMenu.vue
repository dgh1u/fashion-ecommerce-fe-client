<template>
  <div class="relative" @mouseenter="showMenu" @mouseleave="hideMenu">
    <!-- Desktop Dropdown Trigger Button -->
    <div
      class="hidden md:flex items-center px-5 py-2 rounded-lg cursor-pointer"
      data-aos="zoom-out"
      data-aos-duration="800"
    >
      <div class="w-10 h-10 relative ml-4">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="w-10 h-10 rounded-full object-cover"
        />
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobile" class="px-4 py-2">
      <!-- Mobile User Info -->
      <div class="flex items-center mb-4">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          alt="User Avatar"
          class="w-12 h-12 rounded-full object-cover mr-3"
        />
        <div>
          <div class="font-semibold text-base">{{ profile.fullName }}</div>
          <div class="text-sm text-gray-500">{{ profile.email }}</div>
        </div>
      </div>

      <!-- Mobile Menu Links -->
      <div class="space-y-4">
        <a
          href="/profile"
          class="block pt-1 pb-1.5 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-3"
          @click="closeMobileMenuIfNeeded"
        >
          <User size="20" />
          <span>Thông tin tài khoản</span>
        </a>
        <a
          href="/my-products"
          class="block py-1.5 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-3"
          @click="closeMobileMenuIfNeeded"
        >
          <Folder size="20" />
          <span>Danh sách tin đăng</span>
        </a>
        <a
          href="/orders"
          class="block py-1.5 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-3"
          @click="closeMobileMenuIfNeeded"
        >
          <ShoppingBag size="20" />
          <span>Lịch sử đơn hàng</span>
        </a>
        <div class="border-t my-2"></div>
        <a
          href="#"
          @click.prevent="handleLogout"
          class="block pt-1.5 pb-1.5 text-base hover:text-red-400 transition duration-150 flex items-center space-x-3"
        >
          <LogOut size="20" />
          <span>Đăng xuất</span>
        </a>
      </div>
    </div>

    <!-- Desktop Dropdown Content -->
    <div
      v-show="showDropdown && !isMobile"
      class="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg transition-opacity duration-200"
      style="z-index: 9999"
      @mouseenter="showMenu"
      @mouseleave="hideMenu"
    >
      <!-- Khu vực thông tin người dùng và số dư -->
      <div class="p-4">
        <div class="flex items-center">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            alt="User Avatar"
            class="w-12 h-12 rounded-full object-cover"
          />
          <div class="ml-3">
            <span class="font-semibold text-gray-800">{{
              profile.fullName
            }}</span>
            <span class="block text-sm text-gray-500">{{ profile.email }}</span>
          </div>
        </div>
      </div>

      <!-- Danh sách tùy chọn -->
      <a
        href="/profile"
        class="block px-4 pt-1 pb-1.5 ml-2 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-2"
      >
        <User size="18" />
        <span>Thông tin tài khoản</span>
      </a>
      <a
        href="/my-products"
        class="block px-4 py-1.5 ml-2 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-2"
      >
        <Folder size="18" />
        <span>Giỏ hàng</span>
      </a>
      <a
        href="/orders"
        class="block px-4 py-1.5 ml-2 text-base hover:text-stone-500 transition duration-150 flex items-center space-x-2"
      >
        <ShoppingBag size="18" />
        <span>Lịch sử đơn hàng</span>
      </a>

      <!-- Thanh ngăn cách -->
      <div class="w-5/6 mx-auto border-t my-2"></div>

      <a
        href="#"
        @click.prevent="handleLogout"
        class="block px-4 pt-1.5 pb-3 ml-2 text-base hover:text-red-400 transition duration-150 flex items-center space-x-2"
      >
        <LogOut size="18" />
        <span>Đăng xuất</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps } from "vue";
import { useAuthStore } from "@/stores/store";
import { useRouter } from "vue-router";
import { ShoppingBag, User, LogOut, CreditCard, Folder } from "lucide-vue-next";
import { getProfile } from "@/apis/authService";

// Nhận props từ component cha
const props = defineProps({
  isMobile: {
    type: Boolean,
    default: false,
  },
  closeMobileMenuFn: {
    type: Function,
    default: null,
  },
});

const authStore = useAuthStore();
const router = useRouter();

// Biến quản lý trạng thái hiển thị dropdown
const showDropdown = ref(false);
let hideTimeout = null;

// Lấy URL avatar từ store
const avatarUrl = computed(() => authStore.avatar);

// Thông tin người dùng
const profile = ref({
  fullName: "",
  email: "",
});

// Số dư tài khoản
const balance = ref(0);

// Lấy thông tin người dùng khi component được khởi tạo
onMounted(async () => {
  try {
    const response = await getProfile();
    profile.value = {
      fullName: response.data.fullName,
      email: response.data.email,
    };
    balance.value = response.data.balance;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin profile:", error);
  }
});

// Định dạng số dư theo định dạng tiền tệ Việt Nam
const formattedBalance = computed(() => {
  return new Intl.NumberFormat("vi-VN", {
    style: "decimal",
    maximumFractionDigits: 0,
  }).format(balance.value);
});

// Hiển thị menu dropdown
const showMenu = () => {
  if (props.isMobile) return; // Không sử dụng hiệu ứng hover trên mobile
  clearTimeout(hideTimeout);
  showDropdown.value = true;
};

// Ẩn menu dropdown với độ trễ
const hideMenu = () => {
  if (props.isMobile) return; // Không sử dụng hiệu ứng hover trên mobile
  hideTimeout = setTimeout(() => {
    showDropdown.value = false;
  }, 100);
};

// Đóng mobile menu nếu được gọi từ component cha
const closeMobileMenuIfNeeded = () => {
  if (
    props.closeMobileMenuFn &&
    typeof props.closeMobileMenuFn === "function"
  ) {
    props.closeMobileMenuFn();
  }
};

// Xử lý sự kiện nạp tiền
const handleDeposit = () => {
  closeMobileMenuIfNeeded();
  router.push("/payment");
};

// Xử lý sự kiện đăng xuất
const handleLogout = () => {
  authStore.logout();
  showDropdown.value = false;
  closeMobileMenuIfNeeded();
  router.push("/login");
};
</script>

<style scoped>
/* Thêm các styles specifics cho mobile nếu cần */
</style>
