<template>
  <!-- Simple colored circle when not selected -->
  <div class="w-12 h-12 rounded-full" :style="{ backgroundColor: color }"></div>
</template>

<script setup>
// Component props
const props = defineProps({
  color: {
    type: String,
    required: true,
  },
});
</script>

<script>
// Predefined color palette for reuse
export const colorPalette = {
  // Basic colors
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF",
  yellow: "#FFFF00",
  black: "#000000",
  white: "#FFFFFF",
  orange: "#FFA500",
  purple: "#800080",

  // Extended colors
  pink: "#FFC0CB",
  gray: "#808080",
  brown: "#A52A2A",
  navy: "#000080",
  lime: "#00FF00",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  silver: "#C0C0C0",

  // Fashion colors
  beige: "#F5F5DC",
  ivory: "#FFFFF0",
  khaki: "#F0E68C",
  coral: "#FF7F50",
  salmon: "#FA8072",
  gold: "#FFD700",
  crimson: "#DC143C",
  indigo: "#4B0082",

  // Pastel colors
  lightPink: "#FFB6C1",
  lightBlue: "#ADD8E6",
  lightGreen: "#90EE90",
  lightYellow: "#FFFFE0",
  lightGray: "#D3D3D3",
  lavender: "#E6E6FA",
  peach: "#FFCBA4",
  mint: "#98FB98",
};

// Common color sets for different use cases
export const colorSets = {
  basic: [
    { label: "Đỏ", value: "red", color: colorPalette.red },
    { label: "Xanh lá", value: "green", color: colorPalette.green },
    { label: "Xanh dương", value: "blue", color: colorPalette.blue },
    { label: "Vàng", value: "yellow", color: colorPalette.yellow },
    { label: "Đen", value: "black", color: colorPalette.black },
    { label: "Trắng", value: "white", color: colorPalette.white },
    { label: "Cam", value: "orange", color: colorPalette.orange },
    { label: "Tím", value: "purple", color: colorPalette.purple },
  ],

  fashion: [
    { label: "Đỏ", value: "red", color: colorPalette.red },
    { label: "Xanh lá", value: "green", color: colorPalette.green },
    { label: "Xanh dương", value: "blue", color: colorPalette.blue },
    { label: "Vàng", value: "yellow", color: colorPalette.yellow },
    { label: "Đen", value: "black", color: colorPalette.black },
    { label: "Trắng", value: "white", color: colorPalette.white },
    { label: "Cam", value: "orange", color: colorPalette.orange },
    { label: "Tím", value: "purple", color: colorPalette.purple },
    { label: "Hồng", value: "pink", color: colorPalette.pink },
    { label: "Xám", value: "gray", color: colorPalette.gray },
    { label: "Nâu", value: "brown", color: colorPalette.brown },
    { label: "Be", value: "beige", color: colorPalette.beige },
  ],

  pastel: [
    { label: "Hồng nhạt", value: "lightPink", color: colorPalette.lightPink },
    { label: "Xanh nhạt", value: "lightBlue", color: colorPalette.lightBlue },
    {
      label: "Xanh lá nhạt",
      value: "lightGreen",
      color: colorPalette.lightGreen,
    },
    {
      label: "Vàng nhạt",
      value: "lightYellow",
      color: colorPalette.lightYellow,
    },
    { label: "Xám nhạt", value: "lightGray", color: colorPalette.lightGray },
    { label: "Lavender", value: "lavender", color: colorPalette.lavender },
    { label: "Đào", value: "peach", color: colorPalette.peach },
    { label: "Bạc hà", value: "mint", color: colorPalette.mint },
  ],
};
</script>

<style scoped>
/* Custom styles for color component */
</style>
