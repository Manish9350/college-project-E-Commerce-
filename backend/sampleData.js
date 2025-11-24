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
  },

   {
    name: "Portable Bluetooth Speaker",
    description: "Compact speaker with deep bass and 12 hours of playtime.",
    price: 59.99,
    originalPrice: 79.99,
    images: ["https://images.unsplash.com/photo-1585386959984-a41552231693?w=500"],
    category: "Electronics",
    brand: "SoundBoom",
    stock: 30,
    ratings: {
      average: 4.4,
      count: 142
    },
    features: ["Deep Bass", "12-hour Battery", "Bluetooth 5.0", "Water Resistant"],
    isActive: true
  },
  {
    name: "Ergonomic Office Chair",
    description: "High-back mesh office chair with lumbar support for long working hours.",
    price: 249.99,
    originalPrice: 299.99,
    images: ["https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500"],
    category: "Furniture",
    brand: "WorkEase",
    stock: 10,
    ratings: {
      average: 4.6,
      count: 66
    },
    features: ["Lumbar Support", "Adjustable Height", "Breathable Mesh", "360° Swivel"],
    isActive: true
  },
  {
    name: "Stainless Steel Chef Knife",
    description: "Professional chef knife with ergonomic grip and razor-sharp steel blade.",
    price: 49.99,
    originalPrice: 69.99,
    images: ["https://images.unsplash.com/photo-1556429273-367ea4eb4db5?w=500"],
    category: "Home & Kitchen",
    brand: "SharpEdge",
    stock: 45,
    ratings: {
      average: 4.8,
      count: 178
    },
    features: ["Razor Sharp", "Ergonomic Grip", "Stainless Steel", "Rust Resistant"],
    isActive: true
  },
  {
    name: "Gaming Mechanical Keyboard",
    description: "RGB mechanical keyboard with tactile switches for gamers and programmers.",
    price: 89.99,
    originalPrice: 129.99,
    images: ["https://images.unsplash.com/photo-1595225476474-87563907a59e?w=500"],
    category: "Electronics",
    brand: "KeyMaster",
    stock: 20,
    ratings: {
      average: 4.5,
      count: 201
    },
    features: ["RGB Lighting", "Tactile Switches", "Anti-Ghosting", "Metal Frame"],
    isActive: true
  },
  {
    name: "Yoga Exercise Mat",
    description: "Non-slip eco-friendly yoga mat with carrying strap.",
    price: 34.99,
    originalPrice: 49.99,
    images: ["https://images.unsplash.com/photo-1599050751754-6a9f1a5e9f59?w=500"],
    category: "Sports",
    brand: "FlexFit",
    stock: 50,
    ratings: {
      average: 4.7,
      count: 139
    },
    features: ["Eco-Friendly", "Non-Slip", "Extra Cushion", "Carrying Strap"],
    isActive: true
  },
  {
    name: "Electric Hair Trimmer",
    description: "Rechargeable grooming trimmer with multiple length settings.",
    price: 54.99,
    originalPrice: 79.99,
    images: ["https://images.unsplash.com/photo-1605497788044-5a32c707f8bb?w=500"],
    category: "Personal Care",
    brand: "TrimPro",
    stock: 28,
    ratings: {
      average: 4.3,
      count: 112
    },
    features: ["Rechargeable", "Adjustable Blades", "Cordless", "Stainless Steel Blades"],
    isActive: true
  },
  {
    name: "Smart LED Desk Lamp",
    description: "Touch-control LED lamp with adjustable brightness and USB charging port.",
    price: 39.99,
    originalPrice: 59.99,
    images: ["https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=500"],
    category: "Home & Office",
    brand: "BrightLite",
    stock: 33,
    ratings: {
      average: 4.5,
      count: 98
    },
    features: ["Touch Control", "Adjustable Brightness", "USB Charging", "Energy Saving"],
    isActive: true
  },
  {
    name: "Portable Laptop Stand",
    description: "Foldable aluminum laptop stand for better ergonomics and cooling.",
    price: 29.99,
    originalPrice: 44.99,
    images: ["https://images.unsplash.com/photo-1587825140708-628d4a54f36f?w=500"],
    category: "Accessories",
    brand: "ProStand",
    stock: 40,
    ratings: {
      average: 4.4,
      count: 150
    },
    features: ["Foldable", "Aluminum Body", "Cooling Design", "Height Adjustable"],
    isActive: true
  },
  {
    name: "Premium Running Shoes",
    description: "Lightweight and breathable running shoes for everyday fitness.",
    price: 79.99,
    originalPrice: 109.99,
    images: ["https://images.unsplash.com/photo-1600180758890-6c0b91b7a84a?w=500"],
    category: "Footwear",
    brand: "RunX",
    stock: 22,
    ratings: {
      average: 4.6,
      count: 185
    },
    features: ["Breathable", "Lightweight", "Shock Absorption", "Slip Resistant"],
    isActive: true
  },
  {
    name: "4K Action Camera",
    description: "Waterproof 4K action camera with wide-angle lens and accessories kit.",
    price: 149.99,
    originalPrice: 199.99,
    images: ["https://images.unsplash.com/photo-1519183071298-a2962be90b08?w=500"],
    category: "Electronics",
    brand: "AdventureCam",
    stock: 18,
    ratings: {
      average: 4.4,
      count: 122
    },
    features: ["4K Video", "Waterproof", "Wide Angle Lens", "Mounting Kit Included"],
    isActive: true
  }
];

module.exports = sampleProducts;