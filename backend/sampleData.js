const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 129.99,
    originalPrice: 159.99,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"],
    category: "Electronics",
    brand: "AudioTech",
    stock: 25,
    ratings: {
      average: 4.5,
      count: 128
    },
    features: ["Noise Cancellation", "30-hour Battery", "Wireless", "Comfort Fit"],
    isActive: true
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, GPS, and smartphone connectivity.",
    price: 199.99,
    originalPrice: 249.99,
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"],
    category: "Electronics",
    brand: "FitTech",
    stock: 15,
    ratings: {
      average: 4.3,
      count: 89
    },
    features: ["Heart Rate Monitor", "GPS", "Water Resistant", "Sleep Tracking"],
    isActive: true
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    originalPrice: 39.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"],
    category: "Clothing",
    brand: "EcoWear",
    stock: 50,
    ratings: {
      average: 4.7,
      count: 204
    },
    features: ["100% Organic Cotton", "Machine Washable", "Multiple Colors", "Sustainable"],
    isActive: true
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Keep your drinks hot or cold for hours with this durable stainless steel water bottle.",
    price: 24.99,
    originalPrice: 34.99,
    images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500"],
    category: "Home & Kitchen",
    brand: "HydroFlask",
    stock: 35,
    ratings: {
      average: 4.6,
      count: 156
    },
    features: ["Double Wall Insulation", "BPA Free", "Leak Proof", "Dishwasher Safe"],
    isActive: true
  },
  {
    name: "Professional Camera Backpack",
    description: "Durable and waterproof backpack designed specifically for photographers.",
    price: 89.99,
    originalPrice: 119.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"],
    category: "Accessories",
    brand: "PhotoGear",
    stock: 12,
    ratings: {
      average: 4.4,
      count: 67
    },
    features: ["Waterproof", "Padded Compartments", "Laptop Sleeve", "Tripod Holder"],
    isActive: true
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 39.99,
    originalPrice: 49.99,
    images: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500"],
    category: "Electronics",
    brand: "ChargeTech",
    stock: 40,
    ratings: {
      average: 4.2,
      count: 93
    },
    features: ["Fast Charging", "Qi Compatible", "LED Indicator", "Non-slip Surface"],
    isActive: true
  }
];

module.exports = sampleProducts;