// Cart và checkout routes
const cartRoutes = [
    {
        path: '/cart',
        name: 'Cart',
        component: () => import('../pages/cart/Cart.vue'),
        meta: {
            requiresAuth: true,
            title: 'Giỏ hàng'
        }
    },
    {
        path: '/checkout',
        name: 'Checkout',
        component: () => import('../pages/checkout/Checkout.vue'),
        meta: {
            requiresAuth: true,
            title: 'Thanh toán'
        }
    },
    {
        path: '/payment/:id/result',
        name: 'PaymentResult',
        component: () => import('../pages/payment/PaymentResult.vue'),
        meta: {
            title: 'Kết quả thanh toán'
        }
    }
];

export default cartRoutes;