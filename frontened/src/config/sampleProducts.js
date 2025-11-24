const sampleProducts = [
  {
    _id: "dummy_1",
    name: "Wireless Bluetooth Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and long battery life.",
    price: 129.99,
    originalPrice: 159.99,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    ],
    category: "Electronics",
    brand: "AudioTech",
    stock: 25,
    ratings: { average: 4.5, count: 128 },
    isActive: true,
  },
  {
    _id: "dummy_2",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring and GPS.",
    price: 199.99,
    originalPrice: 249.99,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    ],
    category: "Electronics",
    brand: "FitTech",
    stock: 15,
    ratings: { average: 4.3, count: 89 },
    isActive: true,
  },
  {
    _id: "dummy_3",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    ],
    category: "Clothing",
    brand: "EcoWear",
    stock: 50,
    ratings: { average: 4.7, count: 204 },
    isActive: true,
  },
];

export default sampleProducts;
