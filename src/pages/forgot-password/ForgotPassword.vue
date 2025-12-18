<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <!-- Forgot Password Card -->
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
          <h1 class="text-2xl font-semibold text-white mb-2">Đặt lại mật khẩu</h1>
          <p class="text-blue-50 text-sm">Nhập email để nhận mã xác thực</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleSubmitEmail" class="space-y-5">
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

            <!-- Back to Login Link -->
            <div class="text-right" data-aos="fade-left" data-aos-delay="400">
              <router-link
                to="/login"
                class="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                Quay lại đăng nhập
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
              data-aos-delay="500"
            >
              <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              <span>{{ loading ? 'Đang xử lý...' : 'Xác nhận' }}</span>
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center" data-aos="fade-up" data-aos-delay="600">
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
      <div class="text-center mt-6" data-aos="fade-up" data-aos-delay="700">
        <p class="text-sm text-gray-500">
          &copy; 2025
          <router-link to="/home" class="text-blue-600 hover:text-blue-700 font-medium">
            28.Host Team
          </router-link>
          . All rights reserved.
        </p>
      </div>
    </div>

    <!-- Popup xác thực -->
    <transition name="fade">
      <div
        v-if="showVerifyPopup"
        class="fixed inset-0 flex items-center backdrop-blur-md justify-center"
      >
        <Verify :email="email" @verified="handleOtpVerified" />
      </div>
    </transition>

    <!-- Popup Nhập mật khẩu mới -->
    <div
      v-if="showNewPasswordPopup"
      class="fixed inset-0 flex items-center backdrop-blur-md justify-center"
    >
      <PopupNewPassword
        :email="email"
        :otp="otpValue"
        @password-changed="handlePasswordChanged"
      />
    </div>

    <!-- Success Alert -->
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
          <p class="text-gray-900 font-medium">Đổi mật khẩu thành công!</p>
          <p class="text-gray-600 text-sm">Đang chuyển đến trang đăng nhập...</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as authService from "@/apis/authService";
import PopupNewPassword from "./PopupNewPassword.vue";
import Verify from "../verify/Verify.vue";
import Logo from "../../components/logo/Logo.vue";

const email = ref("");
const loading = ref(false);
const generalError = ref("");
const errors = ref({});
const showVerifyPopup = ref(false);
const showNewPasswordPopup = ref(false);
const showSuccessAlert = ref(false);

const otpValue = ref("");
const router = useRouter();

const validateInput = () => {
  errors.value = {};
  if (!email.value) {
    errors.value.email = "Email không được để trống.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    errors.value.email = "Email không đúng định dạng.";
  }
  return Object.keys(errors.value).length === 0;
};

const handleSubmitEmail = async () => {
  loading.value = true;
  generalError.value = "";

  if (!validateInput()) {
    loading.value = false;
    return;
  }

  try {
    await authService.regenerateOTP(email.value);
    showVerifyPopup.value = true;
  } catch (error) {
    generalError.value = error?.message || "Không tìm thấy email.";
  } finally {
    loading.value = false;
  }
};

const handleOtpVerified = (otp) => {
  otpValue.value = otp;
  showVerifyPopup.value = false;
  showNewPasswordPopup.value = true;
};

const handlePasswordChanged = () => {
  showNewPasswordPopup.value = false;
  showSuccessAlert.value = true;
  setTimeout(() => {
    router.push("/login");
  }, 1700);
};

const clearError = (field) => {
  if (errors.value[field]) {
    delete errors.value[field];
  }
  generalError.value = "";
};
</script>
<style scoped>
@import "@/style.css";
</style>
