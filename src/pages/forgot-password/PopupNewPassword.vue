<script setup>
import { ref } from "vue";
import * as authService from "@/apis/authService";

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["password-changed"]);

const newPassword = ref("");
const loading = ref(false);
const errors = ref({});
const generalError = ref("");

const validateInput = () => {
  errors.value = {};
  if (!newPassword.value) {
    errors.value.newPassword = "Mật khẩu không được để trống.";
  } else if (newPassword.value.length < 6 || newPassword.value.length > 15) {
    errors.value.newPassword = "Mật khẩu phải từ 6-15 ký tự.";
  }
  return Object.keys(errors.value).length === 0;
};

const handleChangePassword = async () => {
  if (!validateInput()) return;

  loading.value = true;
  try {
    await authService.forgotPassword(props.email, newPassword.value, props.otp);
    emit("password-changed");
  } catch (error) {
    generalError.value = error?.message || "Đổi mật khẩu thất bại!";
  } finally {
    loading.value = false;
  }
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
    <!-- New Password Card -->
    <div 
      class="w-full max-w-md"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
          <h1 class="text-2xl font-semibold text-white mb-2">Nhập mật khẩu mới</h1>
          <p class="text-blue-50 text-sm">Tạo mật khẩu mới cho tài khoản của bạn</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <form @submit.prevent="handleChangePassword" class="space-y-5">
            <!-- Password Input -->
            <div data-aos="fade-right" data-aos-delay="300">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <input
                v-model="newPassword"
                type="password"
                id="password"
                required
                @input="clearError('newPassword')"
                placeholder="Nhập mật khẩu mới (6-15 ký tự)"
                class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
              />
              <p v-if="errors.newPassword" class="text-red-500 text-sm mt-1.5">
                {{ errors.newPassword }}
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
              data-aos-delay="400"
            >
              <span v-if="loading" class="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              <span>{{ loading ? 'Đang xử lý...' : 'Xác nhận' }}</span>
            </button>
          </form>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-6" data-aos="fade-up" data-aos-delay="500">
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
