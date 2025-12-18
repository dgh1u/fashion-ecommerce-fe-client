<template>
  <header
    :class="[
      'bg-stone-200 shadow-sm transition-all duration-300 w-full border-b border-stone-200',
      isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative',
    ]"
  >
    <!-- Desktop Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <router-link 
          to="/home" 
          class="flex-shrink-0"
          data-aos="fade-right"
          data-aos-duration="600"
        >
          <LogoText />
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <router-link
            to="/product/clothing"
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            active-class="text-gray-900 font-semibold"
            data-aos="fade-down"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            Quần áo
          </router-link>
          <router-link
            to="/product/bags"
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            active-class="text-gray-900 font-semibold"
            data-aos="fade-down"
            data-aos-duration="600"
            data-aos-delay="200"
          >
            Túi xách
          </router-link>
          <router-link
            to="/product/accessories"
            class="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200"
            active-class="text-gray-900 font-semibold"
            data-aos="fade-down"
            data-aos-duration="600"
            data-aos-delay="300"
          >
            Phụ kiện
          </router-link>
        </nav>

        <!-- Desktop Actions -->
        <div class="hidden md:flex items-center space-x-4 ">
          <!-- Cart -->
          <div 
            v-if="authStore.isAuthenticated"
            class="text-gray-900"
            data-aos="fade-left"
            data-aos-duration="600"
            data-aos-delay="100"
          >
            <CartIcon />
          </div>

          <!-- User Menu or Login -->
          <div
            class="relative z-50"
            data-aos="fade-left"
            data-aos-duration="600"
            data-aos-delay="200"
          >
            <DropdownMenu v-if="authStore.isAuthenticated" />
            <router-link
              v-else
              to="/login"
              class="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
            >
              Đăng nhập
            </router-link>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
          aria-label="Toggle menu"
        >
          <Menu v-if="!mobileMenuOpen" :size="24" />
          <X v-else :size="24" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-show="mobileMenuOpen"
        class="md:hidden border-t border-stone-200 bg-stone-50"
      >
        <div class="px-4 py-4 space-y-3">
          <!-- Mobile Navigation Links -->
          <router-link
            to="/product/clothing"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
            active-class="bg-gray-100 text-gray-900"
          >
            Quần áo
          </router-link>
          <router-link
            to="/product/bags"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
            active-class="bg-gray-100 text-gray-900"
          >
            Túi xách
          </router-link>
          <router-link
            to="/product/accessories"
            @click="closeMobileMenu"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors duration-200"
            active-class="bg-gray-100 text-gray-900"
          >
            Phụ kiện
          </router-link>

          <!-- Mobile Divider -->
          <div v-if="authStore.isAuthenticated" class="border-t border-stone-200 my-3"></div>

          <!-- Mobile Cart -->
          <div v-if="authStore.isAuthenticated" class="px-4 py-2 text-gray-900">
            <CartIcon />
          </div>

          <!-- Mobile User Actions -->
          <div v-if="authStore.isAuthenticated" class="px-4 py-2 relative z-50">
            <DropdownMenu :isMobile="true" :closeMobileMenuFn="closeMobileMenu" />
          </div>
          <router-link
            v-else
            to="/login"
            @click="closeMobileMenu"
            class="block w-full text-center px-4 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
          >
            Đăng nhập
          </router-link>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/store";
import DropdownMenu from "@/components/header/DropdownMenu.vue";
import CartIcon from "@/components/cart/CartIcon.vue";
import LogoText from "@/components/logo/Logo.vue";
import { Menu, X } from "lucide-vue-next";

const authStore = useAuthStore();

// State
const isSticky = ref(false);
const mobileMenuOpen = ref(false);

// Scroll handler for sticky header
const handleScroll = () => {
  isSticky.value = window.scrollY > 100;
};

// Toggle mobile menu
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Close mobile menu
const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// Lifecycle hooks
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
}

/* Active link styling */
.router-link-active {
  position: relative;
}

/* Optional: Add underline effect for active nav links on desktop */
@media (min-width: 768px) {
  nav a.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: currentColor;
  }
}
</style>
