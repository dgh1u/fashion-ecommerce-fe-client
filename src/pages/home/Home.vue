<template>
  <Layout>

    <!-- Local Shops Information Section -->
    <div class="py-12">
      <div class="container mx-auto px-4">
        <div class="text-center mb-10" data-aos="zoom-out">
          <div class="pb-3">
            <span class="text-center text-3xl font-bold">
              Danh mục sản phẩm
            </span>
          </div>
          <p class="text-gray-600 max-w-2xl mx-auto">
            Khám phá danh mục có tại hệ thống
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Quần áo Card -->
          <router-link
            to="/product/restaurant"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-105"
            data-aos="zoom-in"
          >
            <div class="h-40 overflow-hidden" data-aos="zoom-in">
              <img
                src="@/assets/home-page/quan-ao.jpg"
                alt="Quần áo"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <div class="flex items-center mb-2">
                <Shirt class="w-5 h-5 text-orange-500 mr-2 mb-2" />
                <h3 class="font-semibold text-lg">Quần áo</h3>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Đa dạng các mẫu quần áo thời trang nam nữ mới nhất.
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="w-4 h-4 mr-1" />
                <span>100+ sản phẩm</span>
              </div>
            </div>
          </router-link>

          <!-- Túi xách Card -->
          <router-link
            to="/product/store"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-105"
            data-aos="zoom-in"
          >
            <div class="h-40 overflow-hidden">
              <img
                src="@/assets/home-page/tui-xach.jpeg"
                alt="Túi xách"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <div class="flex items-center mb-2">
                <ShoppingBag class="w-5 h-5 text-blue-500 mr-2 mb-2" />
                <h3 class="font-semibold text-lg">Túi xách</h3>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Bộ sưu tập túi xách đa dạng phong cách, thời thượng.
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="w-4 h-4 mr-1" />
                <span>50+ sản phẩm</span>
              </div>
            </div>
          </router-link>

          <!-- Giày dép Card -->
          <router-link
            to="/product/beverage"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-105"
            data-aos="zoom-in"
          >
            <div class="h-40 overflow-hidden">
              <img
                src="@/assets/home-page/giay-dep.png"
                alt="Giày dép"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4">
              <div class="flex items-center mb-2">
                <Footprints class="w-5 h-5 text-amber-700 mr-2 mb-2" />
                <h3 class="font-semibold text-lg">Giày dép</h3>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Giày dép thời trang cao cấp cho nam và nữ.
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="w-4 h-4 mr-1" />
                <span>80+ sản phẩm</span>
              </div>
            </div>
          </router-link>

          <!-- Phụ kiện Card -->
          <router-link
            to="/product/utility"
            class="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl hover:scale-105"
            data-aos="zoom-in"
          >
            <div class="h-40 overflow-hidden">
              <img
                src="@/assets/home-page/phu-kien.jpg"
                alt="Phụ kiện"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="p-4 ">
              <div class="flex items-center mb-2">
                <Unlink2 class="w-5 h-5 text-emerald-600 mr-2 mb-1.5 " />
                <h3 class="font-semibold text-lg">Phụ kiện</h3>
              </div>
              <p class="text-gray-600 text-sm mb-3">
                Đa dạng phụ kiện thời trang: đồng hồ, thắt lưng, kính mát,...
              </p>
              <div class="flex items-center text-sm text-gray-500">
                <MapPin class="w-4 h-4 mr-1" />
                <span>60+ sản phẩm</span>
              </div>
            </div>
          </router-link>
        </div>

        <div class="text-center mt-8">
          <router-link
            to="/product/restaurant"
            class="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg inline-flex items-center transition-all"
            data-aos="fade-right"
          >
            Xem tất cả dịch vụ
            <ArrowRight class="w-4 h-4 ml-2" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Logo Marquee Section (Preserved) -->
    <div class="pb-16" data-aos="zoom-out">
      <div class="container mx-auto px-4">
        <div class="pb-10">
          <span class="text-center text-3xl font-bold">
            Thương hiệu đồng hành cùng chúng tôi
          </span>
        </div>
        <Vue3Marquee :clone="true" :duration="10" :direction="'reverse'">
          <img
            v-for="img in imgArray"
            :key="img"
            :src="img"
            class="mx-8 w-full h-12"
          />
        </Vue3Marquee>
      </div>
    </div>

   
           
       
   
   
  </Layout>
</template>

<script setup>
import Layout from "../../layouts/HomeLayout.vue";
import { ref } from "vue";
import {
  Home,
  Users,
  MapPin,
  Wallet,
  CalendarClock,
  Utensils,
  ShoppingBag,
  Coffee,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Star,
  Shirt,
  Footprints,
  Unlink2,
} from "lucide-vue-next";

const imgArray = [
  "src/assets/marquee-items/logo1.svg",
  "src/assets/marquee-items/logo2.svg",
  "src/assets/marquee-items/logo3.svg",
  "src/assets/marquee-items/logo4.svg",

  "src/assets/marquee-items/logo5.svg",

];

// Testimonials data
const testimonials = [
  {
    id: 1,
    name: "유승엄",
    location: "Weave Suites – Sunyu Parkside",
    quote:
      "선유도 위브스위트 선유 파크사이트에서의 경험은 정말 만족스러웠습니다",
    content:
      "선유도 위브스위트 선유 파크사이트에서의 경험은 정말 만족스러웠습니다. 시설은 매우 고급스럽고 서정적인 분위기였어요. 깨끗하고 넓은 객실에서 편안하게 지낼 수 있었습니다.",
    rating: 5,
    image: "@/assets/home-page/testimonial-1.jpg",
  },
  {
    id: 2,
    name: "Margaux Duvauchelle",
    location: "Weave Place – Hoegi",
    quote: "The staff is very nice and always available",
    content:
      "Really nice place to live in. The staff is very nice and always available if needed. I love my stay here, would definitely recommend!",
    rating: 5,
    image: "@/assets/home-page/testimonial-2.jpg",
  },
  {
    id: 3,
    name: "Nguyễn Văn Minh",
    location: "Weave Living – Hanoi",
    quote: "Tuyệt vời về mọi mặt, dịch vụ cực kỳ chuyên nghiệp",
    content:
      "Tôi đã ở đây trong vòng 3 tháng và cảm thấy rất thoải mái. Phòng ốc sạch sẽ, tiện nghi đầy đủ và đặc biệt là nhân viên rất thân thiện và hỗ trợ nhiệt tình.",
    rating: 5,
    image: "@/assets/home-page/testimonial-3.jpg",
  },
];

// Slider state
const currentTestimonial = ref(0);

// Slider navigation methods
const nextTestimonial = () => {
  currentTestimonial.value =
    (currentTestimonial.value + 1) % testimonials.length;
};

const prevTestimonial = () => {
  currentTestimonial.value =
    (currentTestimonial.value - 1 + testimonials.length) % testimonials.length;
};
</script>

<style scoped>
.bg-mint-50 {
  background-color: #f0faf9;
}
</style>
