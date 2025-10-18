import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Home, 
  Smartphone, 
  Laptop, 
  Headphones,
  Heart,
  Star,
  Plus,
  Minus,
  CreditCard,
  Truck,
  Shield,
  ArrowLeft
} from 'lucide-react';

// Types
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const API_URL = import.meta.env.VITE_API_URL;


// Sample Products Data
const sampleProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    price: 4299,
    originalPrice: 4599,
    image: "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
    category: "smartphones",
    rating: 4.9,
    reviews: 1250,
    description: "El iPhone más avanzado con chip A17 Pro y cámaras profesionales"
  },
  {
    id: 2,
    name: "Samsung Galaxy S24 Ultra",
    price: 3899,
    originalPrice: 4199,
    image: "https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg",
    category: "smartphones",
    rating: 4.8,
    reviews: 980,
    description: "Smartphone premium con S Pen y cámaras de 200MP"
  },
  {
    id: 3,
    name: "MacBook Pro M3",
    price: 8999,
    originalPrice: 9499,
    image: "https://images.pexels.com/photos/18105/pexels-photo.jpg",
    category: "laptops",
    rating: 4.9,
    reviews: 750,
    description: "Laptop profesional con chip M3 y pantalla Liquid Retina XDR"
  },
  {
    id: 4,
    name: "Dell XPS 13",
    price: 4599,
    image: "https://images.pexels.com/photos/374074/pexels-photo-374074.jpeg",
    category: "laptops",
    rating: 4.7,
    reviews: 620,
    description: "Ultrabook premium con procesador Intel Core i7 de 13va gen"
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: 899,
    originalPrice: 1099,
    image: "https://images.pexels.com/photos/5081398/pexels-photo-5081398.jpeg",
    category: "audio",
    rating: 4.8,
    reviews: 2100,
    description: "Auriculares inalámbricos con cancelación activa de ruido"
  },
  {
    id: 6,
    name: "Sony WH-1000XM5",
    price: 1299,
    image: "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg",
    category: "audio",
    rating: 4.9,
    reviews: 1580,
    description: "Auriculares over-ear con la mejor cancelación de ruido"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Authentication LOGIN
  const handleLogin = async (email: string, password: string) => {
  try {
    //llamar al backend
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // 👈 importante si usas cookies (token)
    });

    if (!response.ok) {
      throw new Error("Credenciales incorrectas");
    }

    const data = await response.json();

    // ✅ Aquí ya tienes los datos del backend:
    // {
    //   message: "Login successful",
    //   user: { userId, nombres, email, ... },
    //   token
    // }
    console.log(data)
    setUser({
      id: data.user.userId,
      name: data.user.name,
      email: data.user.email
    });

    // ✅ Guarda el token (opcional, si no usas cookies)
    localStorage.setItem("token", data.token);

    // ✅ Cambiar de vista o ruta
    setCurrentPage("home");

  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    alert(error instanceof Error ? error.message : "Error al iniciar sesión");
  }
};

//este es un ednpoint de registro que manda los datos del formulario al backend
  const handleRegister = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword: password, // para evitar error del esquema
      }),
      credentials: "include", // importante si usas cookies con JWT
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.message || "Error al registrarse");
      return;
    }

    const data = await response.json();

    // ✅ Guardar usuario en el estado global
    setUser({
      id: data.user.userId,
      name: data.user.nombres || data.user.name,
      email: data.user.email,
    });

    // ✅ Redirigir al home
    setCurrentPage("home");
  } catch (error) {
    console.error("Error en registro:", error);
    alert("No se pudo conectar con el servidor");
  }
};


  const handleLogout = () => {
    setUser(null);
    setCart([]);
  };

  // Google OAuth redirect (shared for login and register)
  const handleGoogleSignIn = () => {
    // If VITE_API_URL is not set, default to localhost API path used elsewhere in the app
    const base = API_URL ?? 'http://localhost:3000/api';
    const normalized = base.endsWith('/') ? base.slice(0, -1) : base;
    const url = `${normalized}/auth/google`;

    // Open in the same tab so the OAuth redirect can return to the app
    window.location.href = url;
  };

  // Cart functions
  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Filter products
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Header Component
  const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold text-blue-600 cursor-pointer"
              onClick={() => setCurrentPage('home')}
            >
              ChipiCell
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* User */}
            <div className="flex items-center space-x-2">
              {user ? (
                <div className="hidden md:flex items-center space-x-2">
                  <span className="text-gray-700">Hola, {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Salir
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCurrentPage('login')}
                  className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <User className="w-6 h-6" />
                  <span className="hidden md:inline">Ingresar</span>
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="px-2 pb-3 space-y-1">
              <button
                onClick={() => {setCurrentPage('home'); setIsMenuOpen(false);}}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => {setCurrentPage('products'); setIsMenuOpen(false);}}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Productos
              </button>
              <button
                onClick={() => {setCurrentPage('about'); setIsMenuOpen(false);}}
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Nosotros
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-gray-100 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-8 py-3">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'home' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Inicio</span>
          </button>
          <button
            onClick={() => setCurrentPage('products')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'products' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Productos</span>
          </button>
          <button
            onClick={() => setCurrentPage('about')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'about' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Nosotros</span>
          </button>
          <button
            onClick={() => setCurrentPage('contact')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              currentPage === 'contact' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Contacto</span>
          </button>
        </div>
      </div>
    </nav>
  );

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-xl"
        />
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900">S/ {product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                S/ {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Agregar al carrito</span>
        </button>
      </div>
    </div>
  );

  // Pages
  const HomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 md:p-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Bienvenido a ChipiCell
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Tu tienda de tecnología favorita. Los mejores smartphones, laptops y accesorios al mejor precio.
          </p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Ver productos
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {setCurrentPage('products'); setSelectedCategory('smartphones');}}
        >
          <Smartphone className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Smartphones</h3>
          <p className="opacity-90">Los últimos modelos de iPhone y Samsung</p>
        </div>
        <div 
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {setCurrentPage('products'); setSelectedCategory('laptops');}}
        >
          <Laptop className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Laptops</h3>
          <p className="opacity-90">MacBooks y laptops para trabajo y gaming</p>
        </div>
        <div 
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {setCurrentPage('products'); setSelectedCategory('audio');}}
        >
          <Headphones className="w-8 h-8 mb-3" />
          <h3 className="text-xl font-semibold mb-2">Audio</h3>
          <p className="opacity-90">AirPods y auriculares premium</p>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Productos destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.slice(0, 6).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );

  const ProductsPage = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">Productos</h1>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setSelectedCategory('smartphones')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'smartphones' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Smartphones
          </button>
          <button
            onClick={() => setSelectedCategory('laptops')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'laptops' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Laptops
          </button>
          <button
            onClick={() => setSelectedCategory('audio')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedCategory === 'audio' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Audio
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron productos</p>
        </div>
      )}
    </div>
  );

  const LoginPage = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (isLoginMode) {
        handleLogin(formData.email, formData.password);
      } else {
        if (formData.password === formData.confirmPassword) {
          handleRegister(formData.name, formData.email, formData.password);
        } else {
          alert('Las contraseñas no coinciden');
        }
      }
    };

    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              {isLoginMode ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

            {/* Google Sign-in button */}
            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-3 border border-gray-300 rounded-lg py-2 hover:shadow-sm transition-shadow bg-white"
              >
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-medium text-gray-700">Continuar con Google</span>
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-blue-600 hover:text-blue-800 ml-1 font-semibold"
              >
                {isLoginMode ? 'Regístrate aquí' : 'Inicia sesión'}
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const CartPage = () => {
    if (cart.length === 0) {
      return (
        <div className="text-center py-12">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-6">¡Agrega algunos productos increíbles!</p>
          <button
            onClick={() => setCurrentPage('products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver productos
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Carrito de compras</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <p className="text-lg font-bold text-blue-600">S/ {item.price.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/ {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>S/ {getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            <button
              onClick={() => user ? setCurrentPage('checkout') : setCurrentPage('login')}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              {user ? 'Continuar compra' : 'Inicia sesión para comprar'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const [orderData, setOrderData] = useState({
      address: '',
      phone: '',
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });

    const handleInputChange = (field: string, value: string) => {
      setOrderData({ ...orderData, [field]: value });
    };

    const handleCompleteOrder = () => {
      alert('¡Pedido completado exitosamente! Recibirás un correo de confirmación.');
      setCart([]);
      setCurrentPage('home');
    };

    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center space-x-2 mb-8">
          <button
            onClick={() => setCurrentPage('cart')}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-8">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              1
            </div>
            <span>Información de envío</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              2
            </div>
            <span>Método de pago</span>
          </div>
          <div className="w-8 h-px bg-gray-300"></div>
          <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>
              3
            </div>
            <span>Confirmación</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === 1 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Información de envío</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dirección completa
                    </label>
                    <input
                      type="text"
                      required
                      value={orderData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Av. Principal 123, San Isidro, Lima"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      required
                      value={orderData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="999 999 999"
                    />
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!orderData.address || !orderData.phone}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Continuar al pago
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Método de pago</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="card"
                      name="payment"
                      value="card"
                      checked={orderData.paymentMethod === 'card'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="card" className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5" />
                      <span>Tarjeta de crédito/débito</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      id="transfer"
                      name="payment"
                      value="transfer"
                      checked={orderData.paymentMethod === 'transfer'}
                      onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      className="text-blue-600"
                    />
                    <label htmlFor="transfer" className="flex items-center space-x-2">
                      <Truck className="w-5 h-5" />
                      <span>Transferencia bancaria</span>
                    </label>
                  </div>
                </div>

                {orderData.paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        value={orderData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de vencimiento
                        </label>
                        <input
                          type="text"
                          required
                          value={orderData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          required
                          value={orderData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="123"
                          maxLength={4}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre en la tarjeta
                      </label>
                      <input
                        type="text"
                        required
                        value={orderData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Revisar pedido
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6">Confirmar pedido</h2>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-gray-900">Dirección de envío</h3>
                    <p className="text-gray-600">{orderData.address}</p>
                    <p className="text-gray-600">{orderData.phone}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">Método de pago</h3>
                    <p className="text-gray-600">
                      {orderData.paymentMethod === 'card' 
                        ? `Tarjeta terminada en ${orderData.cardNumber.slice(-4)}`
                        : 'Transferencia bancaria'
                      }
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Productos</h3>
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between py-2">
                      <span className="text-gray-600">{item.name} x{item.quantity}</span>
                      <span className="font-semibold">S/ {(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Regresar
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Completar pedido
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-fit">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>S/ {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío:</span>
                <span>Gratis</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>S/ {getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p className="flex items-center space-x-2 mb-2">
                <Truck className="w-4 h-4" />
                <span>Envío gratis en 2-3 días hábiles</span>
              </p>
              <p className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Compra 100% segura</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AboutPage = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Sobre ChipiCell</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Somos la tienda de tecnología líder en Perú, comprometida con ofrecer los mejores productos
          y el mejor servicio a nuestros clientes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Productos Originales</h3>
          <p className="text-gray-600">
            Todos nuestros productos son 100% originales con garantía oficial.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
          <p className="text-gray-600">
            Entregamos tu pedido en 24-48 horas en Lima y provincias.
          </p>
        </div>
        <div className="text-center">
          <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Soporte 24/7</h3>
          <p className="text-gray-600">
            Nuestro equipo está disponible para ayudarte cuando lo necesites.
          </p>
        </div>
      </div>
    </div>
  );

  const ContactPage = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Contáctanos</h1>
        <p className="text-xl text-gray-600">
          Estamos aquí para ayudarte con cualquier consulta
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tu mensaje..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Enviar mensaje
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dirección</h3>
              <p className="text-gray-600">
                Av. Javier Prado Este 4200<br />
                San Isidro, Lima 15036<br />
                Perú
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Teléfono</h3>
              <p className="text-gray-600">+51 1 234-5678</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-600">hola@chipicell.pe</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Horarios</h3>
              <p className="text-gray-600">
                Lunes a Viernes: 9:00 AM - 8:00 PM<br />
                Sábados: 10:00 AM - 6:00 PM<br />
                Domingos: 11:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Footer Component
  const Footer = () => (
    <footer className="bg-gray-900 text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold text-blue-400 mb-4">ChipiCell</div>
            <p className="text-gray-400 mb-4">
              Tu tienda de tecnología favorita en Perú. Productos originales con la mejor garantía.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Productos</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Smartphones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Laptops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Audio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Accesorios</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Centro de ayuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Garantías</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Devoluciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carreras</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 ChipiCell. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );

  // Render current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'login':
        return <LoginPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
}

export default App;