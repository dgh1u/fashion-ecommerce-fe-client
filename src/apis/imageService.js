// src/services/imageService.js
import axios from "@/axios";

// Upload một ảnh cho một bài đăng
export const uploadImage = async (idProduct, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axios({
    url: `/api/uploadImage/product/${idProduct}`,
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Upload nhiều ảnh cho một bài đăng
export const uploadMultipleImages = async (idProduct, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return axios({
    url: `/api/uploadMultipleFiles/product/${idProduct}`,
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// Xóa tất cả ảnh của một bài đăng
export const deleteImagesByProduct = async (idProduct) => {
  return axios({
    url: `/api/deleteImage/product/${idProduct}`,
    method: "DELETE",
  });
};

// Lấy danh sách ImageDto (Base64) của một bài đăng (dùng khi chỉnh sửa)
export const getImageDTOByProduct = async (idProduct) => {
  return axios({
    url: `/api/imageByte/product/${idProduct}`,
    method: "GET",
  });
};

// Lấy danh sách URL ảnh của một bài đăng (dùng khi xem chi tiết)
export const getImageByProduct = async (idProduct) => {
  return axios({
    url: `/api/image/product/${idProduct}`,
    method: "GET",
  });
};

// Tải về một ảnh (responseType = blob để xử lý file nhị phân)
export const downloadImage = async (fileId) => {
  return axios({
    url: `/api/image/${fileId}`,
    method: "GET",
    responseType: "blob",
  });
};
