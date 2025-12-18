<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-8">
    <!-- Verify Card -->
    <div 
      class="w-full max-w-md"
      data-aos="fade-up"
      data-aos-duration="600"
    >
      <!-- Card Container -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
        <!-- Header Section -->
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-10 text-center">
          <div class="mb-4 w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto" data-aos="zoom-in" data-aos-delay="200">
            <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h1 class="text-2xl font-semibold text-white mb-2">Xác thực tài khoản</h1>
          <p class="text-blue-50 text-sm">Nhập mã OTP để hoàn tất đăng ký</p>
        </div>

        <!-- Form Section -->
        <div class="px-8 py-8">
          <div class="text-center mb-6" data-aos="fade-up" data-aos-delay="300">
            <p class="text-gray-600 text-sm mb-1">Mã OTP đã được gửi tới</p>
            <p class="text-gray-800 font-semibold">{{ email }}</p>
          </div>

          <form @submit.prevent="handleVerify" class="space-y-5">
            <!-- OTP Input -->
            <div data-aos="fade-up" data-aos-delay="400">
              <label class="block text-sm font-medium text-gray-700 mb-3 text-center">
                Nhập mã OTP
              </label>
              <div class="flex justify-center gap-2">
                <input
                  v-for="(digit, index) in otpInputs"
                  :key="index"
                  :id="'otp-' + index"
                  v-model="otpInputs[index]"
                  maxlength="1"
                  type="text"
                  class="w-12 h-12 text-center text-xl font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-gray-800"
                  @input="
                    (e) => {
                      clearError();
                      if (e.target.value) focusNext(index);
                    }
                  "
                  @keydown.backspace="
                    (e) => {
                      if (!otpInputs[index]) focusPrev(index);
                    }
                  "
                />
              </div>
              <p v-if="otpError" class="text-red-500 text-sm mt-2 text-center">
                {{ otpError }}
              </p>
            </div>

            <!-- Timer -->
            <div class="text-center" data-aos="fade-up" data-aos-delay="500">
              <p class="text-sm text-gray-600">
                Mã có hiệu lực trong:
                <span class="text-blue-600 font-bold ml-1">{{ timer }}</span>
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
              <span>{{ loading ? 'Đang xác thực...' : 'Xác nhận' }}</span>
            </button>
          </form>

          <!-- Resend OTP Link -->
          <div class="mt-6 text-center" data-aos="fade-up" data-aos-delay="700">
            <p class="text-sm text-gray-600">
              Không nhận được mã?
              <button
                @click="handleRegenerateOTP"
                :disabled="loading"
                class="text-blue-600 font-medium hover:underline ml-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Gửi lại
              </button>
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
import { ref, reactive, onMounted, onUnmounted } from "vue";
import * as authService from "@/apis/authService";

const props = defineProps({
  email: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["verified"]);
const otpInputs = reactive(["", "", "", "", "", ""]);
const loading = ref(false);
const generalError = ref("");
const otpError = ref("");
const timer = ref("02:00");
const countdown = ref(120);
let timerInterval;

onMounted(() => {
  startCountdown();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});

const startCountdown = () => {
  timerInterval = setInterval(() => {
    countdown.value--;
    const minutes = String(Math.floor(countdown.value / 60)).padStart(2, "0");
    const seconds = String(countdown.value % 60).padStart(2, "0");
    timer.value = `${minutes}:${seconds}`;
    if (countdown.value <= 0) {
      clearInterval(timerInterval);
      generalError.value = "Hết thời gian! Vui lòng gửi lại mã OTP.";
    }
  }, 1000);
};

const focusNext = (index) => {
  if (index < otpInputs.length - 1) {
    document.getElementById(`otp-${index + 1}`).focus();
  }
};

const focusPrev = (index) => {
  if (index > 0) {
    document.getElementById(`otp-${index - 1}`).focus();
  }
};

const getOtp = () => otpInputs.join("");

const handleVerify = async () => {
  const otp = getOtp();
  if (otp.length !== 6) {
    otpError.value = "OTP phải đủ 6 ký tự.";
    return;
  }
  loading.value = true;
  try {
    await authService.verifyAccount(props.email, otp);
    emit("verified", otp);
    clearInterval(timerInterval);
  } catch (error) {
    generalError.value =
      error?.message || "Xác thực thất bại. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

const handleRegenerateOTP = async () => {
  loading.value = true;
  try {
    await authService.regenerateOTP(props.email);
    generalError.value = "";
    otpError.value = "";
    // Reset OTP inputs
    otpInputs.forEach((_, index) => {
      otpInputs[index] = "";
    });
    // Reset countdown
    countdown.value = 120;
    clearInterval(timerInterval);
    startCountdown();
  } catch (error) {
    generalError.value =
      error?.message || "Không thể gửi lại OTP. Vui lòng thử lại!";
  } finally {
    loading.value = false;
  }
};

const clearError = () => {
  otpError.value = "";
  generalError.value = "";
};
</script>

<style scoped>
@import "@/style.css";
</style>
