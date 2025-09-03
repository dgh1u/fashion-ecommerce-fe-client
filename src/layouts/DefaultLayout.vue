<template>
  <div class="flex flex-col min-h-screen">
    <!-- Secondary Header -->
    <SecondaryHeader />
    <!-- Header -->
    <Header class="bg-gray-300 p-2" />

    <main class="px-4 md:px-2 bg-white lg:px-12 xl:px-40">
      <slot />
      <!-- Khu vực hiển thị nội dung trang -->
    </main>

    <!-- Footer -->
    <Footer class="bg-gray-300 p-4" />
  </div>
</template>

<script setup>
import Header from "../components/header/Header.vue";
import SecondaryHeader from "../components/header/SecondaryHeader.vue";
import Footer from "../components/footer/Footer.vue";
</script>
