import axios from '../axios.js';

export const orderService = {
    // Lấy danh sách đơn hàng của user hiện tại
    getMyOrders: async (page = 1, limit = 10) => {
        return await axios.get(`/api/orders?page=${page}&limit=${limit}`);
    },

    // Lấy chi tiết đơn hàng theo ID
    getOrderById: async (orderId) => {
        return await axios.get(`/api/orders/${orderId}`);
    },

    // Lấy đơn hàng theo order code
    getOrderByCode: async (orderCode) => {
        return await axios.get(`/api/orders/code/${orderCode}`);
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId) => {
        return await axios.patch(`/api/order/${orderId}/cancel`);
    }
};
