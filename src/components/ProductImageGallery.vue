<template>
  <div class="product-images">
    <!-- Main image display -->
    <div class="main-image-container mb-4">
      <img
        :src="currentImage"
        :alt="product.name || 'Product image'"
        class="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
        @error="handleImageError"
      />
    </div>

    <!-- Thumbnail navigation -->
    <div v-if="images.length > 1" class="thumbnails-container">
      <div class="flex space-x-2 overflow-x-auto pb-2">
        <div
          v-for="(image, index) in images"
          :key="image.id || index"
          @click="selectImage(index)"
          class="thumbnail cursor-pointer flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200"
          :class="{
            'border-blue-500 ring-2 ring-blue-200': currentImageIndex === index,
            'border-gray-300 hover:border-gray-400': currentImageIndex !== index
          }"
        >
          <img
            :src="getImageUrl(image)"
            :alt="`Product image ${index + 1}`"
            class="w-full h-full object-cover"
            @error="handleThumbnailError"
          />
        </div>
      </div>
    </div>

    <!-- Image counter -->
    <div v-if="images.length > 1" class="text-center mt-2 text-sm text-gray-600">
      {{ currentImageIndex + 1 }} / {{ images.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  product: {
    type: Object,
    default: () => ({})
  }
})

const currentImageIndex = ref(0)

const currentImage = computed(() => {
  if (props.images.length === 0) return '/placeholder-image.jpg'
  return getImageUrl(props.images[currentImageIndex.value])
})

const getImageUrl = (image) => {
  // Nếu là ảnh dạng base64 từ ImageDto
  if (image.uri && !image.uri.startsWith('http')) {
    return `data:image/jpeg;base64,${image.uri}`
  }
  // Nếu là URL từ API
  if (typeof image === 'string') {
    return image
  }
  // Fallback
  return image.uri || image.url || '/placeholder-image.jpg'
}

const selectImage = (index) => {
  currentImageIndex.value = index
}

const handleImageError = () => {
  console.error('Failed to load main image')
}

const handleThumbnailError = () => {
  console.error('Failed to load thumbnail image')
}

// Reset current image index when images change
watch(() => props.images, () => {
  currentImageIndex.value = 0
}, { deep: true })
</script>

<style scoped>
.thumbnail {
  transition: all 0.2s ease-in-out;
}

.thumbnail:hover {
  transform: scale(1.05);
}

.thumbnails-container {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

.thumbnails-container::-webkit-scrollbar {
  height: 4px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.thumbnails-container::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>