// Order related routes
const orderRoutes = [
    {
        path: '/orders',
        name: 'OrderHistory',
        component: () => import('../pages/order-history/OrderHistory.vue'),
        meta: {
            requiresAuth: true,
            title: 'Lịch sử đơn hàng'
        }
    },
    {
        path: '/orders/:id',
        name: 'OrderDetail',
        component: () => import('../pages/order-history/OrderHistory.vue'),
        meta: {
            requiresAuth: true,
            title: 'Chi tiết đơn hàng'
        }
    }
];

export default orderRoutes;