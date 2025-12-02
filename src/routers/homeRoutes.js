import Profile from "../pages/dropdown-menu/profile/Profile.vue";
import Home from "../pages/home/Home.vue";
import NotFound from "../pages/not-found/NotFound.vue";
import Contact from "../pages/contact/Contact.vue";

import PrivacyPolicy from "../pages/policy/PrivacyPolicy.vue";

import ClothingList from "../pages/product/clothing/ClothingList.vue";
import ClothingDetail from "../pages/product/clothing/ClothingDetail.vue";

import BagsDetail from "../pages/product/bags/BagsDetail.vue";
import BagsList from "../pages/product/bags/BagsList.vue";

import AccessoriesDetail from "../pages/product/accessories/AccessoriesDetail.vue";
import AccessoriesList from "../pages/product/accessories/AccessoriesList.vue";

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
    path: "/product/clothing",
    name: "ClothingList",
    component: ClothingList,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/clothing/:id",
    name: "ClothingDetail",
    component: ClothingDetail,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/bags",
    name: "BagsList",
    component: BagsList,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/bags/:id",
    name: "BagsDetail",
    component: BagsDetail,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/accessories",
    name: "AccessoriesList",
    component: AccessoriesList,
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "/product/accessories/:id",
    name: "AccessoriesDetail",
    component: AccessoriesDetail,
    meta: {
      requiresAuth: false,
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
