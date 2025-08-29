<template>
  
    <!-- Banner Slider -->
    <div class="relative w-full h-[500px] overflow-hidden">
      <!-- Image Slides -->
      <div
        v-for="(image, index) in images"
        :key="index"
        class="absolute inset-0 w-full h-full transition-transform duration-500"
        :class="{ 
          'translate-x-0': currentIndex === index,
          'translate-x-full': currentIndex < index,
          '-translate-x-full': currentIndex > index
        }"
      >
        <img
          :src="image"
          :alt="`Banner ${index + 1}`"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Navigation Dots -->
      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 z-10">
        <button
          v-for="(_, index) in images"
          :key="index"
          @click="setCurrentIndex(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'"
        ></button>
      </div>
    </div>
 
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Banner images array
const images = [
  '/src/assets/banner/banner1.png',
  '/src/assets/banner/banner2.png',
  '/src/assets/banner/banner3.png',
  '/src/assets/banner/banner4.png'

];

const currentIndex = ref(0);
let intervalId = null;

// Function to move to next slide
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length;
};

// Function to set specific slide
const setCurrentIndex = (index) => {
  currentIndex.value = index;
};

// Start auto-sliding when component mounts
onMounted(() => {
  intervalId = setInterval(nextSlide, 5000); // Change slide every 2 seconds
});

// Clean up interval when component unmounts
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<style scoped>
/* Hiệu ứng xoay cho hình ảnh nền */
.hero-animation-spin {
  animation: spin 45s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Hiệu ứng mờ dần cho các box thông điệp */
.hero-animation-fade {
  animation: fadeInOut 6s ease-in-out infinite;
}

/* Delay cho các hiệu ứng mờ dần */
.hero-animation-delay-1 {
  animation-delay: 1s;
}

.hero-animation-delay-2 {
  animation-delay: 2s;
}

.hero-animation-delay-3 {
  animation-delay: 3s;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.transition-transform {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Optional: Add hover pause functionality */
section:hover .banner-slider {
  animation-play-state: paused;
}
</style>
