<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <!-- Login Card -->
    <div 
      class="w-full max-w-md"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section with Logo -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
          <div class="mb-4" data-aos="zoom-in" data-aos-delay="200">
            <Logo />
          </div>
          <h1 class="text-2xl font-semibold text-white mb-2">Chào mừng trở lại</h1>
          <p class="text-blue-50 text-sm">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email Input -->
            <div data-aos="fade-right" data-aos-delay="300">
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                v-model="email"
                type="email"
                id="email"
                required
                @input="clearError('email')"
                placeholder="your@email.com"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1.5">
                {{ errors.email }}
              </p>
            </div>

            <!-- Password Input -->
            <div data-aos="fade-right" data-aos-delay="400">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  required
                  @input="clearError('password')"
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800 pr-12"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  @click="togglePasswordVisibility"
                >
                  <EyeOff v-if="showPassword" :size="20" />
                  <Eye v-else :size="20" />
                </button>
              </div>
              <p v-if="errors.password" class="text-red-500 text-sm mt-1.5">
                {{ errors.password }}
              </p>
            </div>

            <!-- Forgot Password Link -->
            <div class="text-right" data-aos="fade-left" data-aos-delay="500">
              <router-link
                to="/forgot-password"
                class="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Quên mật khẩu?
              </router-link>
            </div>

            <!-- General Error -->
            <p
              v-if="generalError"
              class="text-red-500 text-sm text-center bg-red-50 py-2 px-4 rounded-lg"
              data-aos="shake"
            >
              {{ generalError }}
            </p>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center shadow-lg"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              <span>{{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}</span>
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center" data-aos="fade-up" data-aos-delay="700">
            <p class="text-sm text-gray-600">
              Chưa có tài khoản?
              <router-link
                to="/register"
                class="text-blue-600 font-medium hover:underline ml-1"
              >
                Đăng ký ngay
              </router-link>
            </p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6" data-aos="fade-up" data-aos-delay="800">
        <p class="text-sm text-gray-500">
          &copy; 2025
          <router-link to="/home" class="text-blue-600 hover:text-blue-700 font-medium">
            28.Host Team
          </router-link>
          . All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/store";
import { Eye, EyeOff } from "lucide-vue-next";
import Logo from "../../components/logo/Logo.vue";

// Khai báo các biến reactive
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errors = ref({});
const generalError = ref("");
const router = useRouter();
const authStore = useAuthStore();

// Kiểm tra tính hợp lệ của dữ liệu đầu vào
const validateInput = () => {
  errors.value = {};

  if (!email.value) {
    errors.value.email = "Email không được để trống.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = "Email không đúng định dạng.";
  }

  if (!password.value) {
    errors.value.password = "Mật khẩu không được để trống.";
  } else if (password.value.length < 6 || password.value.length > 15) {
    errors.value.password = "Mật khẩu phải từ 6-15 kí tự.";
  }

  return Object.keys(errors.value).length === 0;
};

// Xóa thông báo lỗi khi người dùng nhập lại
const clearError = (field) => {
  if (errors.value[field]) {
    errors.value[field] = "";
  }
  generalError.value = "";
};

// Bật/tắt hiển thị mật khẩu
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Xử lý đăng nhập
const handleLogin = async () => {
  loading.value = true;
  generalError.value = "";

  if (!validateInput()) {
    loading.value = false;
    return;
  }

  try {
    await authStore.login(email.value, password.value);

    // Lấy URL chuyển hướng từ localStorage (nếu có)
    const redirectPath = localStorage.getItem("redirectAfterLogin") || "/home";

    // Xóa dữ liệu chuyển hướng
    localStorage.removeItem("redirectAfterLogin");

    // Chuyển hướng người dùng
    router.push(redirectPath);
  } catch (err) {
    generalError.value = err?.message || "Đăng nhập thất bại!";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
@import "@/style.css";
</style>
