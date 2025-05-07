
import chair1Img from '../assets/chair1.png'
import bedImg from '../assets/bed.jpg'
import deskImg from '../assets/desk.jpg'
import armImg from '../assets/arm.jpg'
import sofaImg from '../assets/sofa.jpg'
import coffeeImg from '../assets/coffee.jpg'
import bookImg from '../assets/books.jpg'
import diningImg from '../assets/dining.jpg'
import product5Img from '../assets/product-5.png'
import product3Img from '../assets/product-3.png'

const furnitureProducts = [
    {
      id: 1,
      name: "Modern Wooden Chair",
      category: "Living Room",
      image: chair1Img,
      additionalImages: [product5Img, product3Img],
      rating: 4,
      reviews: 24,
      currentPrice: 129.99,
      originalPrice: 159.99,
      discount: 20,
      description: "Elegant wooden chair with ergonomic design, perfect for modern living rooms.",
      materials: ["Solid oak", "Linen upholstery"],
      colors: ["Natural wood", "Walnut", "Black"],
      dimensions: "22 x 20 x 32 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 2,
      name: "Velvet Sofa",
      category: "Living Room",
      image: sofaImg,
      additionalImages: [product5Img, product3Img],
      rating: 5,
      reviews: 36,
      currentPrice: 899.99,
      originalPrice: 1099.99,
      discount: 18,
      description: "Luxurious velvet sofa with deep seating and tapered legs.",
      materials: ["Velvet fabric", "Solid wood frame"],
      colors: ["Emerald green", "Navy blue", "Blush pink"],
      dimensions: "84 x 36 x 32 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 3,
      name: "Industrial Coffee Table",
      category: "Living Room",
      image: coffeeImg,
      additionalImages: [product5Img, product3Img],
      rating: 4,
      reviews: 18,
      currentPrice: 249.99,
      originalPrice: 299.99,
      discount: 17,
      description: "Sturdy industrial-style coffee table with metal accents.",
      materials: ["Reclaimed wood", "Iron"],
      colors: ["Rustic brown", "Black"],
      dimensions: "48 x 24 x 18 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 4,
      name: "Minimalist Bookshelf",
      category: "Office",
      image: bookImg,
      additionalImages: [product5Img, product3Img],
      rating: 4,
      reviews: 42,
      currentPrice: 179.99,
      originalPrice: 199.99,
      discount: 10,
      description: "Sleek, space-saving bookshelf with five adjustable shelves.",
      materials: ["Birch plywood", "Metal brackets"],
      colors: ["White", "Black"],
      dimensions: "72 x 30 x 12 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 5,
      name: "Upholstered Bed Frame",
      category: "Bedroom",
      image: bedImg,
      additionalImages: [product5Img, product3Img],
      rating: 5,
      reviews: 29,
      currentPrice: 699.99,
      originalPrice: 799.99,
      discount: 13,
      description: "King-sized upholstered bed with tufted headboard.",
      materials: ["Linen fabric", "Solid wood frame"],
      colors: ["Charcoal gray", "Light beige"],
      dimensions: "80 x 76 x 42 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 6,
      name: "Dining Table Set",
      category: "Dining",
      image: diningImg,
      additionalImages: [product5Img, product3Img],
      rating: 4,
      reviews: 31,
      currentPrice: 599.99,
      originalPrice: 749.99,
      discount: 20,
      description: "6-piece dining set with extendable table and cushioned chairs.",
      materials: ["Oak wood", "Polyester upholstery"],
      colors: ["Natural", "Walnut stain"],
      dimensions: "Table: 72 x 36 x 30 inches (extends to 96 inches)",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 7,
      name: "Accent Armchair",
      category: "Living Room",
      image: armImg,
      additionalImages: [product5Img, product3Img],
      rating: 4,
      reviews: 15,
      currentPrice: 199.99,
      originalPrice: 249.99,
      discount: 20,
      description: "Mid-century inspired accent chair with walnut legs.",
      materials: ["Boucle fabric", "Walnut wood"],
      colors: ["Cream", "Light gray"],
      dimensions: "28 x 31 x 30 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
    },
    {
      id: 8,
      name: "Executive Desk",
      category: "Office",
      image: deskImg,
      additionalImages: [product5Img, product3Img],
      rating: 5,
      reviews: 27,
      currentPrice: 449.99,
      originalPrice: 499.99,
      discount: 10,
      description: "Spacious executive desk with built-in cable management.",
      materials: ["Engineered wood", "Metal frame"],
      colors: ["Dark walnut", "White oak"],
      dimensions: "60 x 30 x 29 inches",
      sku: "FC-1001",
      features: [
        "Handcrafted from sustainable materials",
        "Ergonomic design for all-day comfort",
        "Available in multiple finishes"
        ]
     }
  ];
  
  export default furnitureProducts;