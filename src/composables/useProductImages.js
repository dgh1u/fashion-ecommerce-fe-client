import { ref } from 'vue';
import { getImageByProduct } from '@/apis/imageService';

export function useProductImages() {
    const imageCache = ref(new Map());
    const loadingImages = ref(new Set());

    const getProductImage = async (productId) => {
        // Kiểm tra cache trước
        if (imageCache.value.has(productId)) {
            return imageCache.value.get(productId);
        }

        // Kiểm tra xem đang tải ảnh này không
        if (loadingImages.value.has(productId)) {
            return null;
        }

        try {
            loadingImages.value.add(productId);

            const response = await getImageByProduct(productId);
            let imageUrls = [];

            // Xử lý response dựa trên cấu trúc trả về
            if (response?.data && Array.isArray(response.data)) {
                imageUrls = response.data;
            } else if (response?.body?.data && Array.isArray(response.body.data)) {
                imageUrls = response.body.data;
            } else if (response?.body && Array.isArray(response.body)) {
                imageUrls = response.body;
            } else if (Array.isArray(response)) {
                imageUrls = response;
            } else {
                console.warn(`Unexpected response structure for product ${productId}:`, response);
            }

            // Lấy ảnh đầu tiên
            const firstImageUrl = imageUrls.length > 0 ? imageUrls[0] : null;

            // Lưu vào cache
            imageCache.value.set(productId, firstImageUrl);

            return firstImageUrl;
        } catch (error) {
            console.error(`Error loading image for product ${productId}:`, error);
            // Lưu null vào cache để không thử lại liên tục
            imageCache.value.set(productId, null);
            return null;
        } finally {
            loadingImages.value.delete(productId);
        }
    };

    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return '/placeholder-image.svg'; // Ảnh mặc định

        // Nếu là URL đầy đủ thì return luôn
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }

        // Nếu là đường dẫn tương đối, thêm base URL
        return `${import.meta.env.VITE_API_URL || ''}${imageUrl}`;
    };

    const handleImageError = (event) => {
        event.target.src = '/placeholder-image.svg';
    };

    return {
        getProductImage,
        getImageUrl,
        handleImageError,
        imageCache
    };
}