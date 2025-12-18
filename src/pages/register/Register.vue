<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as authService from "@/apis/authService";
import { Eye, EyeOff } from "lucide-vue-next";
import Logo from "../../components/logo/Logo.vue";

const email = ref("");
const password = ref("");
const fullName = ref("");
const address = ref("");
const phone = ref("");
const showPassword = ref(false);
const loading = ref(false);
const generalError = ref("");
const errors = ref({});
const showSuccessAlert = ref(false);

const router = useRouter();

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
    errors.value.password = "Mật khẩu phải từ 6-15 ký tự.";
  }

  if (!fullName.value) {
    errors.value.fullName = "Họ tên không được để trống.";
  }

  if (!address.value) {
    errors.value.address = "Địa chỉ không được để trống.";
  }

  if (!phone.value) {
    errors.value.phone = "Số điện thoại không được để trống.";
  } else if (!/^[0-9]{10,11}$/.test(phone.value)) {
    errors.value.phone = "Số điện thoại không hợp lệ.";
  }

  return Object.keys(errors.value).length === 0;
};

const handleRegister = async () => {
  loading.value = true;
  generalError.value = "";

  if (!validateInput()) {
    loading.value = false;
    return;
  }

  try {
    await authService.register(
      email.value,
      password.value,
      fullName.value,
      address.value,
      phone.value
    );
    showSuccessAlert.value = true;
    setTimeout(() => {
      router.push("/login");
    }, 1700);
  } catch (error) {
    generalError.value = error?.message;
  } finally {
    loading.value = false;
  }
};

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  generalError.value = "";
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <!-- Alert đăng ký thành công -->
    <transition name="slide-down">
      <div
        v-if="showSuccessAlert"
        class="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-green-200 px-6 py-4 flex items-center gap-3 min-w-[320px]"
      >
        <div class="flex-shrink-0">
          <svg
            class="w-6 h-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-medium">Đăng ký thành công!</p>
          <p class="text-gray-600 text-sm">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    </transition>

    <!-- Register Card -->
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
          <h1 class="text-2xl font-semibold text-white mb-2">Tạo tài khoản mới</h1>
          <p class="text-blue-50 text-sm">Đăng ký để bắt đầu mua sắm</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Họ tên -->
            <div data-aos="fade-right" data-aos-delay="300">
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                Họ tên
              </label>
              <input
                v-model="fullName"
                type="text"
                id="fullName"
                required
                @input="clearError('fullName')"
                placeholder="Nguyễn Văn A"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
              />
              <p v-if="errors.fullName" class="text-red-500 text-sm mt-1.5">
                {{ errors.fullName }}
              </p>
            </div>

            <!-- Email -->
            <div data-aos="fade-right" data-aos-delay="350">
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

            <!-- Mật khẩu -->
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

            <!-- Địa chỉ -->
            <div data-aos="fade-right" data-aos-delay="450">
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <input
                v-model="address"
                type="text"
                id="address"
                required
                @input="clearError('address')"
                placeholder="Nhập địa chỉ của bạn"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
              />
              <p v-if="errors.address" class="text-red-500 text-sm mt-1.5">
                {{ errors.address }}
              </p>
            </div>

            <!-- Số điện thoại -->
            <div data-aos="fade-right" data-aos-delay="500">
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                v-model="phone"
                type="tel"
                id="phone"
                required
                @input="clearError('phone')"
                placeholder="0123456789"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1.5">
                {{ errors.phone }}
              </p>
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
              <span>{{ loading ? 'Đang đăng ký...' : 'Đăng ký' }}</span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center" data-aos="fade-up" data-aos-delay="700">
            <p class="text-sm text-gray-600">
              Đã có tài khoản?
              <router-link
                to="/login"
                class="text-blue-600 font-medium hover:underline ml-1"
              >
                Đăng nhập ngay
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

<style scoped>
@import "@/style.css";
</style>
