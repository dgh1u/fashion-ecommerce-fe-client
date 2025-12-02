import { defineStore } from "pinia";
import { loginUser, logoutUser, getAvatar } from "../apis/authService";
import { cartService } from "../apis/cartService";
import { ref, computed } from "vue";

export const useAuthStore = defineStore(
  "auth",
  () => {
    const user = ref(null);
    const token = ref("");
    const isAuthenticated = ref(false);
    // Biến lưu avatar dưới dạng chuỗi base64 hoặc URL
    const avatar = ref("");

    // Đăng nhập: gọi loginUser, sau đó gọi getAvatar để lấy avatar từ API
    const login = async (email, password) => {
      if (!email || !password) {
        return;
      }
      try {
        const response = await loginUser(email, password);
        if (!response || !response.token) {
          throw new Error("Email hoặc mật khẩu không chính xác");
        }

        // Cập nhật thông tin người dùng
        user.value = response;
        token.value = response.token;
        isAuthenticated.value = true;

        // Gọi API getAvatar để lấy avatar từ server và cập nhật store
        const avatarRes = await getAvatar();
        avatar.value = `data:image/png;base64,${avatarRes.data}`;

        return response;
      } catch (error) {
        if (error.response) {
          console.error(error.response.data.message || "Đăng nhập thất bại.");
        } else {
          console.error("Lỗi kết nối hoặc lỗi không xác định:", error.message);
        }
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        throw error;
      }
    };

    // Đăng xuất
    const logout = async () => {
      try {
        await logoutUser();
      } catch (error) {
        console.warn("Logout API failed, proceeding to clear session.");
      } finally {
        user.value = null;
        token.value = "";
        isAuthenticated.value = false;
        avatar.value = ""; // reset avatar khi đăng xuất
        localStorage.removeItem("auth");
        localStorage.removeItem("chatMessages");

      }
    };

    // Hàm cập nhật avatar trong store (nếu cần update sau này)
    const setAvatar = (newAvatar) => {
      avatar.value = newAvatar;
    };

    return { user, token, isAuthenticated, avatar, login, logout, setAvatar };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: "auth",
          storage: localStorage,
          paths: ["token", "user", "isAuthenticated", "avatar"],
        },
      ],
    },
  }
);

// Cart Store
export const useCartStore = defineStore(
  "cart",
  () => {
    const cart = ref(null);
    const loading = ref(false);

    // Computed properties
    const cartItemCount = computed(() => {
      return cart.value?.items?.length || 0;
    });

    const cartTotal = computed(() => {
      return cart.value?.totalAmount || 0;
    });

    const cartItems = computed(() => {
      return cart.value?.items || [];
    });

    // Actions
    const fetchCart = async () => {
      try {
        loading.value = true;
        const response = await cartService.getCart();
        cart.value = response.data;
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        loading.value = false;
      }
    };

    const addToCart = async (productId, sizeId, quantity = 1) => {
      try {
        const response = await cartService.addToCart(productId, sizeId, quantity);
        cart.value = response;
        return response;
      } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
      }
    };

    const updateCartItem = async (cartItemId, quantity) => {
      try {
        const response = await cartService.updateCartItem(cartItemId, quantity);
        cart.value = response.data;
        return response;
      } catch (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }
    };

    const removeFromCart = async (cartItemId) => {
      try {
        const response = await cartService.removeFromCart(cartItemId);
        cart.value = response.data;
        return response;
      } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
      }
    };

    const clearCart = async () => {
      try {
        await cartService.clearCart();
        cart.value = {
          cartId: null,
          userId: null,
          totalItems: 0,
          totalAmount: 0,
          items: []
        };
      } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }
    };

    return {
      cart,
      loading,
      cartItemCount,
      cartTotal,
      cartItems,
      fetchCart,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart
    };
  }
);
