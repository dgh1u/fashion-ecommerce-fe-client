import Profile from "../pages/dropdown-menu/profile/Profile.vue";
import Home from "../pages/home/Home.vue";
import NotFound from "../pages/not-found/NotFound.vue";
import Contact from "../pages/contact/Contact.vue";



import PaymentResult from "../pages/payment-result/PaymentResult.vue";
import PrivacyPolicy from "../pages/policy/PrivacyPolicy.vue";

import DocumentList from "../pages/document/DocumentList.vue";

import DocumentDetail from "../pages/document/DocumentDetail.vue";

export default [
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/not-found",
    name: "NotFound",
    component: NotFound,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/contact",
    name: "Contact",
    component: Contact,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/document",
    name: "DocumentList",
    component: DocumentList,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/document/:id",
    name: "DocumentDetail",
    component: DocumentDetail,
    meta: {
      requiresAuth: false,
    },
  },






  {
    path: "/payment/:id/result",
    name: "PaymentResult",
    component: PaymentResult,
    meta: {
      requiresAuth: true,
    },
  },

  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: PrivacyPolicy,
    meta: {
      requiresAuth: true,
    },
  },
];
