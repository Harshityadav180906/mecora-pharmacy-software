'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Package,
  ShoppingCart,
  PlusCircle,
  Clock,
  TrendingDown,
  ArrowUpRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Search,
  Printer,
  Moon,
  Sun,
  QrCode,
  Building2,
  User,
  Shield,
  Trash2,
  Plus,
  Minus,
  RefreshCw,
  Download,
  Receipt,
  LogOut,
  ChevronRight,
  Filter,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  Layers,
  Settings as SettingsIcon,
  Check,
  Brain,
  Stethoscope,
  Pill,
  DollarSign,
  UserPlus,
  Users,
  Lock,
  Sparkles,
  Info,
  HelpCircle,
  Flame,
  ArrowRight,
  Eye,
  EyeOff,
  Server,
  Globe
} from 'lucide-react';
import { printReceipt } from '@/lib/printReceipt';
import { predictMedicineDetails, AIMedicineInfo } from '@/lib/medicineAI';

interface Product {
  _id?: string;
  name: string;
  barcode: string;
  pack: string;
  batch: string;
  purchasePrice: number;
  price: number;
  stockQuantity: number;
  minAlertQuantity: number;
  quantityPerPack: number;
  gstPercentage: number;
  expiryDate: string;
  supplier: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderItem {
  productId?: string;
  name: string;
  batch?: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  _id?: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  grandTotal: number;
  cashGiven?: number;
  cashChange?: number;
  paymentMethod: 'UPI' | 'Cash' | 'Card';
  cashierName: string;
  cashierId?: string;
  dateString: string;
}

interface Pharmacy {
  pharmacyId: string;
  name: string;
  ownerEmail: string;
  phone: string;
  address: string;
  drugLicenseNo: string;
  gstin: string;
  status?: string;
  totalProducts?: number;
  totalOrders?: number;
  revenue?: number;
}

interface StaffMember {
  _id?: string;
  name: string;
  email: string;
  employeeCode: string;
  role: 'Admin' | 'Pharmacist' | 'Cashier' | 'Billing Staff';
  phone?: string;
}

interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'PHARMACY_OWNER' | 'EMPLOYEE';
  pharmacyId?: string;
  pharmacyName?: string;
  employeeCode?: string;
  phone?: string;
}

interface AuditLog {
  action: string;
  user: string;
  role: string;
  timestamp: string;
}

export default function MecoraMedicalApp() {
  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Authentication State (Gated: Starts Logged OUT)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loginEmail, setLoginEmail] = useState('admin@mecora.com');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [loginRole, setLoginRole] = useState<'SUPER_ADMIN' | 'PHARMACY_OWNER' | 'EMPLOYEE'>('SUPER_ADMIN');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Multi-tenant Pharmacy state
  const [activePharmacyId, setActivePharmacyId] = useState<string>('xyz');
  const [availablePharmacies, setAvailablePharmacies] = useState<Pharmacy[]>([]);
  const [currentPharmacy, setCurrentPharmacy] = useState<Pharmacy | null>(null);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [newPharmacyName, setNewPharmacyName] = useState('');
  const [newPharmacyEmail, setNewPharmacyEmail] = useState('');

  // Super Admin Network Analytics State
  const [superAdminData, setSuperAdminData] = useState<{
    stats: { totalPharmacies: number; totalRevenue: number; totalOrdersCount: number; totalProductsCount: number; totalUsers: number };
    pharmacySummaries: Pharmacy[];
    users: any[];
    globalAudits: AuditLog[];
  } | null>(null);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Scoped Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    expiringSoonCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
    cashCollection: 0,
    upiCollection: 0,
    cardCollection: 0,
  });
  const [loading, setLoading] = useState(false);

  // POS / Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [posSearch, setPosSearch] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [customerName, setCustomerName] = useState('Counter Patient');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Cash' | 'Card'>('Cash');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [cashGivenInput, setCashGivenInput] = useState<number | ''>('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Inventory Search & Filter
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('ALL');

  // AI Medicine Intelligence Drawer
  const [selectedAIMedicine, setSelectedAIMedicine] = useState<AIMedicineInfo | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);

  // Add Product Form State
  const [newProd, setNewProd] = useState({
    barcode: '',
    name: '',
    pack: '10 tablets',
    batch: '',
    purchasePrice: 0,
    price: 0,
    stockQuantity: 50,
    minAlertQuantity: 10,
    quantityPerPack: 10,
    gstPercentage: 12,
    expiryDate: '',
    supplier: 'Medica Wholesale Corp',
    category: 'General Medicine',
  });
  const [addProdSuccess, setAddProdSuccess] = useState(false);

  // Add Staff Member Form State
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'Billing Staff' as 'Admin' | 'Pharmacist' | 'Cashier' | 'Billing Staff',
    phone: '',
    password: '',
  });

  // Toast / Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initialize Pharmacies & Seed DB on Load
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/pharmacy/init');
        const data = await res.json();
        if (data.success && data.pharmacies) {
          setAvailablePharmacies(data.pharmacies);
          const found = data.pharmacies.find((p: Pharmacy) => p.pharmacyId === activePharmacyId) || data.pharmacies[0];
          if (found) {
            setCurrentPharmacy(found);
            setActivePharmacyId(found.pharmacyId);
          }
        }
      } catch (err) {
        console.error('Failed to init pharmacies:', err);
      }
    }
    init();
  }, []);

  // 2. Fetch Data when activePharmacyId or user changes
  const fetchPharmacyData = async (pharmacyId: string) => {
    setLoading(true);
    try {
      const [dataRes, staffRes] = await Promise.all([
        fetch(`/api/pharmacy/data?pharmacyId=${pharmacyId}`),
        fetch(`/api/pharmacy/staff?pharmacyId=${pharmacyId}`),
      ]);
      const data = await dataRes.json();
      const staffData = await staffRes.json();

      if (data.success) {
        setCurrentPharmacy(data.pharmacy);
        setProducts(data.products || []);
        setOrders(data.orders || []);
        setAudits(data.audits || []);
        setStats(data.stats || {
          totalProducts: 0,
          lowStockCount: 0,
          expiringSoonCount: 0,
          totalOrders: 0,
          totalRevenue: 0,
          cashCollection: 0,
          upiCollection: 0,
          cardCollection: 0,
        });
      }
      if (staffData.success) {
        setStaffList(staffData.staff || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Super Admin Global Network Data
  const fetchSuperAdminData = async () => {
    try {
      const res = await fetch('/api/admin/network');
      const data = await res.json();
      if (data.success) {
        setSuperAdminData(data);
      }
    } catch (err) {
      console.error('Failed to fetch Super Admin data:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      if (currentUser?.role === 'SUPER_ADMIN') {
        fetchSuperAdminData();
      }
      if (activePharmacyId) {
        fetchPharmacyData(activePharmacyId);
        setCart([]);
        setCashGivenInput('');
      }
    }
  }, [isLoggedIn, activePharmacyId, currentUser]);

  // LOGIN FUNCTION - Authenticates against MongoDB Compass
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setAuthLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
          role: loginRole,
        }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        if (data.user.pharmacyId) {
          setActivePharmacyId(data.user.pharmacyId);
          if (data.pharmacy) setCurrentPharmacy(data.pharmacy);
        }
        showToast(`✅ Welcome back, ${data.user.name}!`);
      } else {
        setLoginError(data.message || 'Login failed. Please check credentials.');
      }
    } catch (err) {
      setLoginError('Failed to connect to authentication server.');
    } finally {
      setAuthLoading(false);
    }
  };

  // LOGOUT FUNCTION
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCart([]);
    showToast('Logged out successfully');
  };

  // Switch Pharmacy Branch
  const handleSelectPharmacy = (pharmacy: Pharmacy) => {
    setActivePharmacyId(pharmacy.pharmacyId);
    setCurrentPharmacy(pharmacy);
    setShowPharmacyModal(false);
    showToast(`Switched active branch to ${pharmacy.name}`);
  };

  // Handle Create Custom Pharmacy Branch
  const handleCreatePharmacy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPharmacyName || !newPharmacyEmail) return;
    const newId = newPharmacyName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15) + '-' + Math.floor(100 + Math.random() * 900);
    const newPharm: Pharmacy = {
      pharmacyId: newId,
      name: newPharmacyName,
      ownerEmail: newPharmacyEmail,
      phone: '+91 98765 00000',
      address: 'Medical Enclave, Central Market',
      drugLicenseNo: `DL-2026-${newId.toUpperCase()}`,
      gstin: '07AAAPH0000A1Z1',
    };
    setAvailablePharmacies(prev => [...prev, newPharm]);
    handleSelectPharmacy(newPharm);
    setNewPharmacyName('');
    setNewPharmacyEmail('');
  };

  // Add Employee Form Submit
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) {
      showToast('Name and email are required');
      return;
    }
    try {
      const res = await fetch('/api/pharmacy/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newStaff, pharmacyId: activePharmacyId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Employee ${newStaff.name} registered in MongoDB!`);
        fetchPharmacyData(activePharmacyId);
        setNewStaff({ name: '', email: '', role: 'Billing Staff', phone: '', password: '' });
      } else {
        showToast(`Error: ${data.message}`);
      }
    } catch (err) {
      showToast('Failed to add staff');
    }
  };

  // AI Medicine Click Handler
  const handleOpenAIMedicine = (medicineName: string) => {
    const aiDetails = predictMedicineDetails(medicineName);
    setSelectedAIMedicine(aiDetails);
    setShowAIModal(true);
  };

  // POS Actions
  const addToCart = (product: Product) => {
    if (product.stockQuantity <= 0) {
      showToast(`Out of stock: ${product.name}`);
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.product._id === product._id || (item.product.name === product.name && item.product.batch === product.batch));
      if (existing) {
        if (existing.quantity >= product.stockQuantity) {
          showToast(`Cannot add more than available stock (${product.stockQuantity})`);
          return prev;
        }
        return prev.map(item => item === existing ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQty = (index: number, delta: number) => {
    setCart(prev => {
      const updated = [...prev];
      const item = updated[index];
      const newQty = item.quantity + delta;
      if (newQty <= 0) {
        return updated.filter((_, i) => i !== index);
      }
      if (newQty > item.product.stockQuantity) {
        showToast(`Max available stock: ${item.product.stockQuantity}`);
        return prev;
      }
      updated[index] = { ...item, quantity: newQty };
      return updated;
    });
  };

  const removeCartItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  // Barcode quick add
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;
    const found = products.find(p => p.barcode === barcodeInput.trim() || p.name.toLowerCase().includes(barcodeInput.toLowerCase()));
    if (found) {
      addToCart(found);
      showToast(`Added: ${found.name}`);
      setBarcodeInput('');
    } else {
      showToast(`Product with barcode "${barcodeInput}" not found`);
    }
  };

  // POS Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartGst = cart.reduce((sum, item) => {
    const itemTotal = item.product.price * item.quantity;
    return sum + (itemTotal * (item.product.gstPercentage || 12) / 100);
  }, 0);
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const cartGrandTotal = Math.round(cartSubtotal + cartGst - discountAmount);

  // Cash Calculation & Change Calculation
  const cashGivenNumber = typeof cashGivenInput === 'number' ? cashGivenInput : 0;
  const cashChange = paymentMethod === 'Cash' && cashGivenNumber >= cartGrandTotal ? cashGivenNumber - cartGrandTotal : 0;
  const cashRemaining = paymentMethod === 'Cash' && cashGivenNumber > 0 && cashGivenNumber < cartGrandTotal ? cartGrandTotal - cashGivenNumber : 0;

  // Complete POS Order
  const handleCompleteOrder = async () => {
    if (!cart.length) {
      showToast('Please add items to the cart');
      return;
    }

    const orderPayload = {
      pharmacyId: activePharmacyId,
      customerName: customerName || 'Counter Patient',
      customerPhone: customerPhone || '',
      items: cart.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        batch: item.product.batch,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      subtotal: cartSubtotal,
      gstAmount: Math.round(cartGst),
      discount: Math.round(discountAmount),
      grandTotal: cartGrandTotal,
      cashGiven: paymentMethod === 'Cash' ? (cashGivenNumber || cartGrandTotal) : 0,
      cashChange: cashChange,
      paymentMethod,
      cashierName: currentUser?.name || 'Pharmacist',
      cashierId: currentUser?.email || 'staff',
    };

    try {
      const res = await fetch('/api/pharmacy/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });
      const data = await res.json();
      if (data.success) {
        setCompletedOrder(data.order);
        setShowInvoiceModal(true);
        setCart([]);
        setCashGivenInput('');
        fetchPharmacyData(activePharmacyId);
        showToast(`✅ Order #${data.order.orderNumber} Completed (₹${cartGrandTotal})`);
      } else {
        showToast(`Failed to create order: ${data.message}`);
      }
    } catch (err) {
      showToast('Network error during checkout');
    }
  };

  // 1-Click Dynamic Restock
  const handleRestock = async (product: Product, addAmount: number) => {
    if (!product || !product._id) {
      const target = products.find(p => p.name === product.name) || products[0];
      if (!target?._id) {
        showToast('No matching product found to restock');
        return;
      }
      product = target;
    }
    try {
      const res = await fetch('/api/pharmacy/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: product._id, stockQuantity: (product.stockQuantity || 0) + addAmount }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✅ Restocked ${product.name} (+${addAmount} units)`);
        fetchPharmacyData(activePharmacyId);
      }
    } catch (err) {
      showToast('Failed to restock');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      const res = await fetch(`/api/pharmacy/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Deleted ${name}`);
        fetchPharmacyData(activePharmacyId);
      }
    } catch (err) {
      showToast('Failed to delete product');
    }
  };

  // Add Product Form Submit
  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.batch || !newProd.expiryDate) {
      showToast('Please fill all required fields');
      return;
    }

    try {
      const res = await fetch('/api/pharmacy/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newProd, pharmacyId: activePharmacyId }),
      });
      const data = await res.json();
      if (data.success) {
        setAddProdSuccess(true);
        showToast(`✅ ${newProd.name} added to ${currentPharmacy?.name || 'Inventory'}!`);
        fetchPharmacyData(activePharmacyId);
        setNewProd({
          barcode: '',
          name: '',
          pack: '10 tablets',
          batch: '',
          purchasePrice: 0,
          price: 0,
          stockQuantity: 50,
          minAlertQuantity: 10,
          quantityPerPack: 10,
          gstPercentage: 12,
          expiryDate: '',
          supplier: 'Medica Wholesale Corp',
          category: 'General Medicine',
        });
        setTimeout(() => setAddProdSuccess(false), 4000);
      } else {
        showToast(`Error: ${data.message}`);
      }
    } catch (err) {
      showToast('Failed to save product');
    }
  };

  // Filtered Products for Inventory
  const filteredInventory = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          p.batch.toLowerCase().includes(inventorySearch.toLowerCase()) ||
                          p.barcode.includes(inventorySearch);
    const matchesCategory = inventoryCategory === 'ALL' || p.category === inventoryCategory || (inventoryCategory === 'LOW' && p.stockQuantity <= p.minAlertQuantity);
    return matchesSearch && matchesCategory;
  });

  // Filtered Products for POS Catalog
  const filteredPosProducts = products.filter(p => {
    return p.name.toLowerCase().includes(posSearch.toLowerCase()) ||
           p.barcode.includes(posSearch) ||
           p.category.toLowerCase().includes(posSearch.toLowerCase());
  });

  // Role Checks
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';
  const isOwner = currentUser?.role === 'PHARMACY_OWNER';
  const isEmployee = currentUser?.role === 'EMPLOYEE';

  // Employee Shift Scoped Orders
  const displayedOrders = isEmployee
    ? orders.filter(o => o.cashierName?.includes(currentUser?.name || '') || o.cashierId === currentUser?.email)
    : orders;

  const employeeUpiOrders = displayedOrders.filter(o => o.paymentMethod === 'UPI').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const employeeCashOrders = displayedOrders.filter(o => o.paymentMethod === 'Cash').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const employeeCardOrders = displayedOrders.filter(o => o.paymentMethod === 'Card').reduce((sum, o) => sum + (o.grandTotal || 0), 0);
  const employeeTotalRevenue = employeeUpiOrders + employeeCashOrders + employeeCardOrders;

  // =========================================================================
  // VIEW 1: FULL SCREEN GATED LOGIN PORTAL (SHOWN WHEN NOT LOGGED IN)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen font-sans flex flex-col justify-between ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-slate-100 via-blue-50/50 to-slate-100 text-slate-900'}`}>
        
        {/* Top Navbar */}
        <header className="p-4 lg:px-8 flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Mecora Medical
              </h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                Pharmacy Operating Suite
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full font-bold">
              <Server className="w-3.5 h-3.5" />
              <span>MongoDB Compass Connected</span>
            </span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700 shadow-xs'}`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Center Login Box */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`w-full max-w-lg p-8 rounded-3xl border shadow-2xl relative ${
            darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white border-slate-200 shadow-blue-500/5'
          }`}>
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-black flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">Secure Portal Access</h2>
              <p className="text-slate-400 text-xs mt-1">Authenticate with your registered credentials in MongoDB</p>
            </div>

            {/* Role Select Tabs */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setLoginRole('SUPER_ADMIN');
                  setLoginEmail('admin@mecora.com');
                  setLoginPassword('admin123');
                }}
                className={`py-2 rounded-xl transition-all ${
                  loginRole === 'SUPER_ADMIN' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                👑 Super Admin
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('PHARMACY_OWNER');
                  setLoginEmail('xyz@pharmacy.com');
                  setLoginPassword('admin123');
                }}
                className={`py-2 rounded-xl transition-all ${
                  loginRole === 'PHARMACY_OWNER' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                🏥 Store Owner
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginRole('EMPLOYEE');
                  setLoginEmail('rohit@xyz.com');
                  setLoginPassword('123456');
                }}
                className={`py-2 rounded-xl transition-all ${
                  loginRole === 'EMPLOYEE' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                👤 Staff / Cashier
              </button>
            </div>

            {/* Quick Demo Chips for Instant Autofill */}
            <div className="mb-5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">QUICK TEST LOGIN CHIPS (CLICK TO AUTOFILL):</p>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('SUPER_ADMIN');
                    setLoginEmail('admin@mecora.com');
                    setLoginPassword('admin123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-cyan-400 font-bold border border-blue-500/20"
                >
                  👑 Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('PHARMACY_OWNER');
                    setLoginEmail('xyz@pharmacy.com');
                    setLoginPassword('admin123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold border border-cyan-500/20"
                >
                  🏥 XYZ Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('PHARMACY_OWNER');
                    setLoginEmail('zyx@pharmacy.com');
                    setLoginPassword('admin123');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20"
                >
                  🏥 ZYX Owner
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRole('EMPLOYEE');
                    setLoginEmail('rohit@xyz.com');
                    setLoginPassword('123456');
                  }}
                  className="px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20"
                >
                  👤 Staff (Rohit)
                </button>
              </div>
            </div>

            {/* Error Message */}
            {loginError && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Registered Email / User ID</label>
                <input
                  type="email"
                  required
                  placeholder="e.g., admin@mecora.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full p-3 rounded-xl border outline-none font-medium ${
                    darkMode ? 'bg-slate-800 border-slate-700 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 focus:border-blue-500'
                  }`}
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">Password / Security PIN</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={`w-full p-3 pr-10 rounded-xl border outline-none font-medium ${
                      darkMode ? 'bg-slate-800 border-slate-700 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 focus:border-blue-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50 mt-2"
              >
                {authLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Database...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-slate-400">
          <p>© 2026 Mecora Medical Software • Multi-Tenant Pharmacy Cloud Suite</p>
        </footer>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: FULL AUTHENTICATED DASHBOARD (SHOWN ONLY AFTER LOGIN)
  // =========================================================================
  return (
    <div className={`min-h-screen font-sans antialiased transition-colors ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce border border-blue-400/40">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span className="font-semibold text-xs tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER / NAVBAR (AUTHENTICATED) */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-xs'}`}>
        <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Current Role */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-lg font-black bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent leading-none">
                  Mecora Medical
                </h1>
                <span className="bg-blue-500/10 text-blue-600 dark:text-cyan-400 text-[10px] font-black px-1.5 py-0.5 rounded border border-blue-500/20">
                  {isSuperAdmin ? '👑 Super Admin Master' : isOwner ? '🏥 Owner Portal' : '👤 Cashier Shift'}
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                {currentPharmacy?.name || 'Central Pharmacy Network'}
              </span>
            </div>
          </div>

          {/* Center Branch Selector (Available for Super Admin & Owner) */}
          {!isEmployee && (
            <div className="hidden md:flex items-center space-x-2">
              <button
                onClick={() => setShowPharmacyModal(true)}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  darkMode
                    ? 'bg-slate-800 border-slate-700 hover:border-cyan-500 text-slate-200'
                    : 'bg-slate-100 border-slate-200 hover:border-blue-500 text-slate-800 shadow-xs'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-cyan-500" />
                <span>Active Branch: <strong className="text-blue-600 dark:text-cyan-400">{currentPharmacy?.name}</strong></span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-1.5 py-0.5 rounded font-bold">Switch</span>
              </button>
            </div>
          )}

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Quick POS Button */}
            <button
              onClick={() => setActiveTab('pos')}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>New Bill (POS)</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Profile Badge (Fetched from DB) */}
            <div className={`flex items-center space-x-2 pl-2 border-l ${darkMode ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'}`}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-black flex items-center justify-center text-xs shadow-xs">
                {currentUser?.name.charAt(0)}
              </div>
              <div className="hidden lg:block text-left text-[11px]">
                <p className="font-black leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 font-mono">{currentUser?.email}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500/10 transition-colors"
              title="Logout from System"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TILES */}
        <div className={`px-4 lg:px-6 flex items-center space-x-1 overflow-x-auto no-scrollbar border-t text-xs font-semibold py-1.5 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {/* Super Admin Dedicated Master Tab */}
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('master-network')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'master-network'
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>🌐 Super Admin Network</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>{isEmployee ? 'My Shift Dashboard' : 'Store Dashboard'}</span>
          </button>

          <button
            onClick={() => setActiveTab('pos')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'pos'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Point of Sale (Billing)</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'add-product'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Medicine</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>{isEmployee ? `My Bills (${displayedOrders.length})` : `All Bills (${orders.length})`}</span>
          </button>

          {/* Admin / Owner only tabs */}
          {!isEmployee && (
            <>
              <button
                onClick={() => setActiveTab('staff')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'staff'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Employees & Staff ({staffList.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics & Reports</span>
              </button>

              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
                  activeTab === 'admin'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>Admin & Security</span>
              </button>
            </>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">

        {/* 0. SUPER ADMIN MASTER NETWORK VIEW */}
        {isSuperAdmin && activeTab === 'master-network' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                    👑 Super Admin Platform Control
                  </span>
                  <h2 className="text-2xl font-black mt-1">Mecora Medical Global Network</h2>
                  <p className="text-xs text-slate-400">Total system overview across all branches and database users</p>
                </div>
                <button
                  onClick={fetchSuperAdminData}
                  className="p-2.5 rounded-xl border flex items-center space-x-1.5 text-xs font-bold"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh Network</span>
                </button>
              </div>

              {/* Global Network Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border border-blue-500/20">
                  <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase">Platform Revenue (GMV)</span>
                  <p className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-2">
                    ₹{superAdminData?.stats.totalRevenue.toLocaleString('en-IN') || 0}.00
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Across all live pharmacies</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/10 to-indigo-500/10 border border-purple-500/20">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Active Pharmacies</span>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
                    {superAdminData?.stats.totalPharmacies || availablePharmacies.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Multi-tenant isolated branches</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600/10 to-green-500/10 border border-emerald-500/20">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Total Bills Processed</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                    {superAdminData?.stats.totalOrdersCount || orders.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Orders in MongoDB database</p>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-600/10 to-orange-500/10 border border-amber-500/20">
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase">Registered Users</span>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-2">
                    {superAdminData?.stats.totalUsers || 5}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Super Admins, Owners & Staff</p>
                </div>
              </div>
            </div>

            {/* Pharmacies List */}
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="font-black text-sm mb-4">All Registered Pharmacy Branches</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availablePharmacies.map((pharm) => (
                  <div key={pharm.pharmacyId} className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    activePharmacyId === pharm.pharmacyId ? 'border-blue-500 bg-blue-500/5' : 'dark:border-slate-800'
                  }`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-black text-sm">{pharm.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600">Active</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{pharm.address} • {pharm.phone}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 font-mono">DL: {pharm.drugLicenseNo} | GSTIN: {pharm.gstin}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs text-slate-400">Owner: {pharm.ownerEmail}</span>
                      <button
                        onClick={() => {
                          handleSelectPharmacy(pharm);
                          setActiveTab('dashboard');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Enter Branch Dashboard →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registered Users Table */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="p-4 border-b dark:border-slate-800">
                <h3 className="font-black text-sm">MongoDB Database Users Roster</h3>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <tr>
                      <th className="p-3">NAME</th>
                      <th className="p-3">EMAIL</th>
                      <th className="p-3">ROLE</th>
                      <th className="p-3">ASSIGNED PHARMACY</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {superAdminData?.users?.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-500/5">
                        <td className="p-3 font-bold">{u.name}</td>
                        <td className="p-3 font-mono text-slate-400">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            u.role === 'SUPER_ADMIN' ? 'bg-purple-500/20 text-purple-600' :
                            u.role === 'PHARMACY_OWNER' ? 'bg-blue-500/20 text-blue-600' : 'bg-slate-500/20 text-slate-600'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{u.pharmacyName || u.pharmacyId}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Header Banner */}
            <div className={`p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-blue-600 dark:text-cyan-400 uppercase tracking-wider">
                    🏥 {currentPharmacy?.name || 'XYZ Pharmacy'}
                  </span>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
                    ● MongoDB Connected
                  </span>
                </div>
                <h2 className="text-2xl font-black mt-1">
                  {isEmployee ? `Welcome, ${currentUser?.name} (Shift Active)` : 'Store Performance Overview'}
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Logged in as: <strong className="text-blue-500">{currentUser?.name}</strong> ({currentUser?.role}) | Branch: {currentPharmacy?.address}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => fetchPharmacyData(activePharmacyId)}
                  className={`px-3 py-2 rounded-xl border flex items-center space-x-1.5 text-xs font-bold ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>Sync DB</span>
                </button>
                <button
                  onClick={() => setActiveTab('pos')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Open Billing Counter</span>
                </button>
              </div>
            </div>

            {/* Metric Cards (Owner vs Employee Mode) */}
            {isEmployee ? (
              /* EMPLOYEE SHIFT CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">MY SHIFT COLLECTION</span>
                  <p className="text-2xl font-black mt-2 text-emerald-500">₹{employeeTotalRevenue.toLocaleString('en-IN')}.00</p>
                  <p className="text-[11px] text-slate-400 mt-1">{displayedOrders.length} bills completed today</p>
                </div>
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">MY UPI PAYMENTS</span>
                  <p className="text-2xl font-black mt-2 text-purple-500">₹{employeeUpiOrders.toLocaleString('en-IN')}.00</p>
                  <p className="text-[11px] text-slate-400 mt-1">Digital QR scan</p>
                </div>
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">MY CASH IN DRAWER</span>
                  <p className="text-2xl font-black mt-2 text-green-500">₹{employeeCashOrders.toLocaleString('en-IN')}.00</p>
                  <p className="text-[11px] text-slate-400 mt-1">Physical cash counted</p>
                </div>
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-wider">MY CARD TRANSACTIONS</span>
                  <p className="text-2xl font-black mt-2 text-blue-500">₹{employeeCardOrders.toLocaleString('en-IN')}.00</p>
                  <p className="text-[11px] text-slate-400 mt-1">POS swipe machine</p>
                </div>
              </div>
            ) : (
              /* STORE OWNER / SUPER ADMIN CARDS */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
                    <span>Total Revenue</span>
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500"><Banknote className="w-4 h-4" /></div>
                  </div>
                  <p className="text-2xl font-black mt-2 text-green-600 dark:text-green-400">₹{stats.totalRevenue.toLocaleString('en-IN')}.00</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    UPI: ₹{stats.upiCollection} | Cash: ₹{stats.cashCollection}
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
                    <span>Total Placed Orders</span>
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500"><Receipt className="w-4 h-4" /></div>
                  </div>
                  <p className="text-2xl font-black mt-2">{stats.totalOrders}</p>
                  <p className="text-[11px] text-blue-600 dark:text-cyan-400 mt-1 cursor-pointer hover:underline" onClick={() => setActiveTab('orders')}>
                    View all placed orders →
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
                    <span>Low Stock Alerts</span>
                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500"><AlertCircle className="w-4 h-4" /></div>
                  </div>
                  <p className="text-2xl font-black mt-2 text-amber-500">{stats.lowStockCount}</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 cursor-pointer hover:underline" onClick={() => { setActiveTab('inventory'); setInventoryCategory('LOW'); }}>
                    Needs immediate restock →
                  </p>
                </div>

                <div className={`p-5 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center text-slate-400 text-xs font-bold uppercase">
                    <span>Total Products</span>
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><Package className="w-4 h-4" /></div>
                  </div>
                  <p className="text-2xl font-black mt-2">{stats.totalProducts}</p>
                  <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1 cursor-pointer hover:underline" onClick={() => setActiveTab('inventory')}>
                    Manage all products →
                  </p>
                </div>
              </div>
            )}

            {/* AI Automated Inventory Recommendations with 1-Click Restock */}
            <div className="space-y-3">
              <h3 className="text-sm font-black flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                <Brain className="w-4 h-4 text-cyan-500" />
                <span>AI Automated Inventory Recommendations</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.length > 0 ? (
                  <>
                    {/* Recommendation 1 */}
                    {(() => {
                      const lowProd = products.find(p => p.stockQuantity <= p.minAlertQuantity) || products[0];
                      return (
                        <div className={`p-4 rounded-2xl border flex items-start space-x-3.5 ${
                          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                            <TrendingDown className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-black">Reorder Advice: {lowProd?.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Current Stock: <strong>{lowProd?.stockQuantity} units</strong> | Batch: {lowProd?.batch}.
                            </p>
                            <div className="mt-2.5 flex items-center space-x-2">
                              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 px-2 py-0.5 rounded">
                                AI Tip: Restock +50 units
                              </span>
                              <button
                                onClick={() => handleRestock(lowProd, 50)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-bold transition-all active:scale-95 shadow-xs"
                              >
                                ⚡ 1-Click Restock 50
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Recommendation 2 */}
                    {(() => {
                      const secondProd = products[1] || products[0];
                      return (
                        <div className={`p-4 rounded-2xl border flex items-start space-x-3.5 ${
                          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                            <Clock className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-black">Stock Status: {secondProd?.name}</h4>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Expiry: <strong>{secondProd?.expiryDate}</strong> | Stock: {secondProd?.stockQuantity} units.
                            </p>
                            <div className="mt-2.5 flex items-center space-x-2">
                              <button
                                onClick={() => handleOpenAIMedicine(secondProd.name)}
                                className="text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-lg font-bold transition-colors"
                              >
                                🩺 AI Clinical Cause
                              </button>
                              <button
                                onClick={() => handleRestock(secondProd, 20)}
                                className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg font-bold transition-all shadow-xs"
                              >
                                +20 Units
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </>
                ) : null}
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="p-4 border-b flex justify-between items-center dark:border-slate-800">
                <h3 className="font-bold text-xs">Recent Billing Transactions</h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline">
                  View Full Orders →
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'bg-slate-800/50 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <tr>
                      <th className="p-3 font-semibold">MEMO / ID</th>
                      <th className="p-3 font-semibold">DATE & TIME</th>
                      <th className="p-3 font-semibold">PATIENT DETAILS</th>
                      <th className="p-3 font-semibold">ITEMS SUMMARY</th>
                      <th className="p-3 font-semibold">TOTAL</th>
                      <th className="p-3 font-semibold">METHOD</th>
                      <th className="p-3 font-semibold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {displayedOrders.slice(0, 5).map((ord) => (
                      <tr key={ord._id || ord.orderNumber} className="hover:bg-slate-500/5 transition-colors">
                        <td className="p-3 font-black text-blue-600 dark:text-cyan-400">#{ord.orderNumber}</td>
                        <td className="p-3 text-slate-400">{ord.dateString}</td>
                        <td className="p-3 font-semibold">{ord.customerName} {ord.customerPhone && <span className="block text-[10px] text-slate-400">{ord.customerPhone}</span>}</td>
                        <td className="p-3 text-slate-400">
                          {ord.items?.map(it => `${it.name} (x${it.quantity})`).join(', ') || 'Prescription Items'}
                        </td>
                        <td className="p-3 font-black text-green-600 dark:text-green-400">₹{ord.grandTotal}.00</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentMethod === 'UPI' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                            ord.paymentMethod === 'Cash' ? 'bg-green-500/20 text-green-600 dark:text-green-300' : 'bg-blue-500/20 text-blue-600'
                          }`}>
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => printReceipt(ord, currentPharmacy)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded text-[11px] font-bold"
                          >
                            Print
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!displayedOrders.length && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No transactions found yet. Click "New Bill (POS)" to bill your first customer!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. POINT OF SALE (POS / BILLING) VIEW */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Catalog (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className={`p-4 rounded-2xl border space-y-3 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <form onSubmit={handleBarcodeSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <QrCode className="absolute left-3 top-2.5 w-4 h-4 text-cyan-500" />
                    <input
                      type="text"
                      placeholder="Scan Barcode / Enter Code & Press Enter..."
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none font-mono ${
                        darkMode ? 'bg-slate-800 border-slate-700 focus:border-cyan-500' : 'bg-slate-50 border-slate-300 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap">
                    Scan Add
                  </button>
                </form>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medicine by name, salt, or category..."
                    value={posSearch}
                    onChange={(e) => setPosSearch(e.target.value)}
                    className={`w-full pl-9 pr-4 py-2 text-xs rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 focus:border-blue-500' : 'bg-slate-50 border-slate-300 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
                {filteredPosProducts.map((p) => (
                  <div
                    key={p._id || p.batch}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      p.stockQuantity <= 0 ? 'opacity-50' : 'hover:scale-[1.01]'
                    } ${
                      darkMode ? 'bg-slate-900 border-slate-800 hover:border-cyan-500/50' : 'bg-white border-slate-200 hover:border-blue-500 shadow-sm'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-cyan-400">
                          {p.pack}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          p.stockQuantity <= p.minAlertQuantity ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'
                        }`}>
                          Stock: {p.stockQuantity}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs mt-2 leading-snug">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Batch: {p.batch} | Exp: {p.expiryDate}</p>
                    </div>

                    <div className="mt-3 flex justify-between items-center pt-2 border-t dark:border-slate-800">
                      <span className="text-sm font-black text-blue-600 dark:text-cyan-400">₹{p.price}.00</span>
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleOpenAIMedicine(p.name)}
                          className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 text-xs"
                          title="AI Clinical Predictor"
                        >
                          <Brain className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => addToCart(p)}
                          className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg text-xs font-bold"
                          title="Add to Bill"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Active Bill (5 cols) */}
            <div className="lg:col-span-5">
              <div className={`p-5 rounded-3xl border flex flex-col h-full ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
              }`}>
                <div className="border-b pb-3 dark:border-slate-800 flex justify-between items-center">
                  <div>
                    <h3 className="font-black text-sm flex items-center space-x-1.5">
                      <Receipt className="w-4 h-4 text-cyan-500" />
                      <span>Counter Billing Invoice</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Billed by: {currentUser?.name}</p>
                  </div>
                  {cart.length > 0 && (
                    <button onClick={() => setCart([])} className="text-xs text-red-500 font-bold hover:underline">
                      Clear
                    </button>
                  )}
                </div>

                {/* Patient Details */}
                <div className="grid grid-cols-2 gap-2 my-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PATIENT NAME</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Patient Name"
                      className={`w-full px-2.5 py-1.5 text-xs rounded-xl border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">PHONE NUMBER</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Mobile No."
                      className={`w-full px-2.5 py-1.5 text-xs rounded-xl border outline-none ${
                        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                      }`}
                    />
                  </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto max-h-[220px] space-y-2 pr-1 divide-y dark:divide-slate-800">
                  {cart.map((item, idx) => (
                    <div key={idx} className="pt-2 flex justify-between items-center">
                      <div className="flex-1 pr-2">
                        <p className="text-xs font-bold leading-tight">{item.product.name}</p>
                        <p className="text-[10px] text-slate-400">₹{item.product.price} each (Batch: {item.product.batch})</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className={`flex items-center border rounded-lg ${darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                          <button onClick={() => updateCartQty(idx, -1)} className="p-1 hover:bg-slate-500/10"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(idx, 1)} className="p-1 hover:bg-slate-500/10"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="text-xs font-bold w-14 text-right">₹{item.product.price * item.quantity}</span>
                        <button onClick={() => removeCartItem(idx)} className="text-red-500 hover:text-red-700 p-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {!cart.length && (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      Cart is empty. Click medicines or scan barcode to add.
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="border-t pt-3 mt-3 space-y-1.5 dark:border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal:</span>
                    <span>₹{cartSubtotal}.00</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>GST (Estimated):</span>
                    <span>₹{Math.round(cartGst)}.00</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-400">
                    <span>Discount:</span>
                    <select
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(Number(e.target.value))}
                      className={`text-xs px-2 py-0.5 rounded border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-300'}`}
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={10}>10%</option>
                      <option value={15}>15%</option>
                    </select>
                  </div>
                  <div className="flex justify-between text-base font-black pt-2 border-t dark:border-slate-800 text-blue-600 dark:text-cyan-400">
                    <span>Grand Total:</span>
                    <span>₹{cartGrandTotal}.00</span>
                  </div>
                </div>

                {/* Payment Mode */}
                <div className="mt-3 space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 block">PAYMENT MODE</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('Cash')}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'Cash' ? 'border-green-500 bg-green-500/10 text-green-600 dark:text-green-300' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span>Cash</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'UPI' ? 'border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-300' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>UPI QR</span>
                    </button>

                    <button
                      onClick={() => setPaymentMethod('Card')}
                      className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                        paymentMethod === 'Card' ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-300' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Card</span>
                    </button>
                  </div>
                </div>

                {/* Cash Received & Change Calculator */}
                {paymentMethod === 'Cash' && (
                  <div className={`mt-3 p-3 rounded-2xl border space-y-2 ${darkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex justify-between items-center">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                        Cash Given by Customer (₹):
                      </label>
                      <input
                        type="number"
                        placeholder="e.g., 500"
                        value={cashGivenInput}
                        onChange={(e) => setCashGivenInput(e.target.value === '' ? '' : Number(e.target.value))}
                        className={`w-28 text-right font-black px-2 py-1 text-sm rounded-lg border outline-none ${
                          darkMode ? 'bg-slate-900 border-slate-600 text-green-400' : 'bg-white border-slate-300 text-green-600'
                        }`}
                      />
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => setCashGivenInput(cartGrandTotal)}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200"
                      >
                        Exact (₹{cartGrandTotal})
                      </button>
                      {[100, 200, 500, 2000].filter(n => n >= cartGrandTotal).map(note => (
                        <button
                          key={note}
                          onClick={() => setCashGivenInput(note)}
                          className="px-2 py-1 text-[10px] font-bold rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200"
                        >
                          ₹{note}
                        </button>
                      ))}
                    </div>

                    {cashGivenNumber >= cartGrandTotal && cartGrandTotal > 0 && (
                      <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/30 flex justify-between items-center">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400">Change to Return:</span>
                        <span className="text-base font-black text-green-600 dark:text-green-400">₹{cashChange}.00</span>
                      </div>
                    )}

                    {cashRemaining > 0 && (
                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-amber-600 dark:text-amber-400 text-xs font-bold">
                        <span>Insufficient Cash:</span>
                        <span>₹{cashRemaining} remaining due</span>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleCompleteOrder}
                  disabled={cart.length === 0}
                  className="mt-4 w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 disabled:opacity-40 text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Complete Order & Print Bill (₹{cartGrandTotal})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. INVENTORY VIEW */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-3 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex flex-wrap items-center gap-2 flex-1 w-full md:w-auto">
                <div className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search medicines by name, batch, barcode..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
                    }`}
                  />
                </div>

                <div className="flex items-center space-x-1 text-xs">
                  <button
                    onClick={() => setInventoryCategory('ALL')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${
                      inventoryCategory === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    All ({products.length})
                  </button>
                  <button
                    onClick={() => setInventoryCategory('LOW')}
                    className={`px-3 py-1.5 rounded-lg font-bold ${
                      inventoryCategory === 'LOW' ? 'bg-amber-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    Low Stock ({stats.lowStockCount})
                  </button>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('add-product')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </button>
            </div>

            {/* Inventory Table */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <tr>
                      <th className="p-3 font-semibold">MEDICINE & SALT</th>
                      <th className="p-3 font-semibold">AI CLINICAL CAUSE</th>
                      <th className="p-3 font-semibold">PACK</th>
                      <th className="p-3 font-semibold">BATCH NO.</th>
                      <th className="p-3 font-semibold">STOCK QTY</th>
                      <th className="p-3 font-semibold">PRICE</th>
                      <th className="p-3 font-semibold">STATUS</th>
                      <th className="p-3 font-semibold text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {filteredInventory.map((p) => (
                      <tr key={p._id || p.batch} className="hover:bg-slate-500/5 transition-colors">
                        <td
                          className="p-3 font-bold text-slate-900 dark:text-slate-100 cursor-pointer group"
                          onClick={() => handleOpenAIMedicine(p.name)}
                        >
                          <span className="group-hover:text-blue-500 transition-colors flex items-center space-x-1">
                            <span>{p.name}</span>
                            <Brain className="w-3 h-3 text-cyan-500 opacity-60 group-hover:opacity-100" />
                          </span>
                          <span className="block text-[10px] text-slate-400 font-mono">{p.barcode}</span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => handleOpenAIMedicine(p.name)}
                            className="text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/20 flex items-center space-x-1"
                          >
                            <Stethoscope className="w-3 h-3" />
                            <span>AI Cause & Uses</span>
                          </button>
                        </td>
                        <td className="p-3 text-slate-400">{p.pack}</td>
                        <td className="p-3 font-mono text-slate-400">{p.batch}</td>
                        <td className="p-3 font-bold">
                          <span className={p.stockQuantity <= p.minAlertQuantity ? 'text-amber-500 font-black' : ''}>
                            {p.stockQuantity}
                          </span>
                        </td>
                        <td className="p-3 font-black text-blue-600 dark:text-cyan-400">₹{p.price}.00</td>
                        <td className="p-3">
                          {p.stockQuantity <= 0 ? (
                            <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold">Out of Stock</span>
                          ) : p.stockQuantity <= p.minAlertQuantity ? (
                            <span className="bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded text-[10px] font-bold">Low ({p.stockQuantity})</span>
                          ) : (
                            <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded text-[10px] font-bold">In Stock</span>
                          )}
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() => handleRestock(p, 10)}
                            className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-2 py-1 rounded text-[11px] font-bold"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => handleRestock(p, 50)}
                            className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-2 py-1 rounded text-[11px] font-bold"
                          >
                            +50
                          </button>
                          <button
                            onClick={() => p._id && handleDeleteProduct(p._id, p.name)}
                            className="text-red-500 hover:text-red-700 p-1 inline-block"
                            title="Delete Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. ADD NEW MEDICINE VIEW */}
        {activeTab === 'add-product' && (
          <div className="max-w-2xl mx-auto">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="text-center mb-6">
                <h2 className="text-xl font-black">Add Medicine to {currentPharmacy?.name}</h2>
                <p className="text-slate-400 text-xs mt-1">This product will be saved directly to MongoDB Compass and available in Point of Sale.</p>
              </div>

              {addProdSuccess && (
                <div className="mb-4 p-3 bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Medicine created and synced to database!</span>
                </div>
              )}

              <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs font-medium">
                <div>
                  <label className="block mb-1 text-slate-400">Barcode</label>
                  <input
                    type="text"
                    placeholder="Type barcode or leave empty for auto-generation"
                    value={newProd.barcode}
                    onChange={(e) => setNewProd({ ...newProd, barcode: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400">Medicine Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Augmentin 625 Duo Tablets"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-400">Pack *</label>
                    <input
                      type="text"
                      placeholder="e.g., 10 tablets / 100ml"
                      value={newProd.pack}
                      onChange={(e) => setNewProd({ ...newProd, pack: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Batch No. *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., AUG-9021"
                      value={newProd.batch}
                      onChange={(e) => setNewProd({ ...newProd, batch: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-400">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      placeholder="MRP / Price"
                      value={newProd.price || ''}
                      onChange={(e) => setNewProd({ ...newProd, price: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">Stock Quantity *</label>
                    <input
                      type="number"
                      required
                      placeholder="Initial stock"
                      value={newProd.stockQuantity || ''}
                      onChange={(e) => setNewProd({ ...newProd, stockQuantity: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-slate-400">Expiry Date *</label>
                    <input
                      type="date"
                      required
                      value={newProd.expiryDate}
                      onChange={(e) => setNewProd({ ...newProd, expiryDate: e.target.value })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-slate-400">GST (%)</label>
                    <input
                      type="number"
                      value={newProd.gstPercentage}
                      onChange={(e) => setNewProd({ ...newProd, gstPercentage: Number(e.target.value) })}
                      className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs shadow-md transition-colors"
                >
                  Save Medicine to Inventory
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 5. ORDERS & BILLING HISTORY VIEW */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className={`p-5 rounded-3xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div>
                <h2 className="text-xl font-black">
                  {isEmployee ? `My Shift Invoices (${displayedOrders.length})` : `All Placed Orders Dashboard (${orders.length})`}
                </h2>
                <p className="text-xs text-slate-400">Branch: {currentPharmacy?.name}</p>
              </div>

              {/* Collections breakdown */}
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20 text-xs">
                  <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 block">CASH</span>
                  <strong className="text-green-600 dark:text-green-400 text-sm">₹{isEmployee ? employeeCashOrders : stats.cashCollection}.00</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs">
                  <span className="text-[10px] uppercase font-bold text-purple-600 dark:text-purple-400 block">UPI</span>
                  <strong className="text-purple-600 dark:text-purple-400 text-sm">₹{isEmployee ? employeeUpiOrders : stats.upiCollection}.00</strong>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs">
                  <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 block">CARD</span>
                  <strong className="text-blue-600 dark:text-blue-400 text-sm">₹{isEmployee ? employeeCardOrders : stats.cardCollection}.00</strong>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <tr>
                      <th className="p-3 font-semibold">MEMO / ID</th>
                      <th className="p-3 font-semibold">DATE & TIME</th>
                      <th className="p-3 font-semibold">PATIENT DETAILS</th>
                      <th className="p-3 font-semibold">ITEMS SUMMARY</th>
                      <th className="p-3 font-semibold">GRAND TOTAL</th>
                      <th className="p-3 font-semibold">METHOD</th>
                      <th className="p-3 font-semibold text-right">PRINT BILL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {displayedOrders.map((ord) => (
                      <tr key={ord._id || ord.orderNumber} className="hover:bg-slate-500/5 transition-colors">
                        <td className="p-3 font-black text-blue-600 dark:text-cyan-400">
                          #{ord.orderNumber}
                        </td>
                        <td className="p-3 text-slate-400 whitespace-nowrap">{ord.dateString}</td>
                        <td className="p-3 font-semibold">
                          {ord.customerName}
                          {ord.customerPhone && <span className="block text-[10px] text-slate-400">Ph: {ord.customerPhone}</span>}
                        </td>
                        <td className="p-3 text-slate-400 max-w-xs">
                          {ord.items?.map(it => `• ${it.name} (x${it.quantity})`).join(', ') || 'Prescription Medicines'}
                        </td>
                        <td className="p-3 font-black text-green-600 dark:text-green-400 text-sm">₹{ord.grandTotal}.00</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentMethod === 'UPI' ? 'bg-purple-500/20 text-purple-600 dark:text-purple-300' :
                            ord.paymentMethod === 'Cash' ? 'bg-green-500/20 text-green-600 dark:text-green-300' : 'bg-blue-500/20 text-blue-600'
                          }`}>
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => printReceipt(ord, currentPharmacy)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1 ml-auto shadow-xs"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print Bill</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!displayedOrders.length && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          No orders placed yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. STAFF & EMPLOYEE MANAGEMENT VIEW (Owner / Super Admin Only) */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-black">Register New Staff Member / Cashier</h3>
                  <p className="text-xs text-slate-400">Employees can log in with their credentials to access POS billing and track their shift orders</p>
                </div>
                <UserPlus className="w-6 h-6 text-blue-500" />
              </div>

              <form onSubmit={handleAddStaffSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block mb-1 text-slate-400 font-semibold">Staff Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rohit Sharma"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400 font-semibold">Email / Login ID *</label>
                  <input
                    type="email"
                    required
                    placeholder="rohit@pharmacy.com"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-400 font-semibold">Role *</label>
                  <select
                    value={newStaff.role}
                    onChange={(e: any) => setNewStaff({ ...newStaff, role: e.target.value })}
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  >
                    <option value="Billing Staff">Billing Staff / Cashier</option>
                    <option value="Pharmacist">Pharmacist</option>
                    <option value="Admin">Branch Admin</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs shadow-md transition-all"
                  >
                    + Add Employee
                  </button>
                </div>
              </form>
            </div>

            {/* Staff List Table */}
            <div className={`rounded-3xl border overflow-hidden ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="p-4 border-b flex justify-between items-center dark:border-slate-800">
                <h3 className="font-bold text-xs">Active Branch Staff Roster</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <tr>
                      <th className="p-3 font-semibold">EMPLOYEE CODE</th>
                      <th className="p-3 font-semibold">STAFF NAME</th>
                      <th className="p-3 font-semibold">EMAIL</th>
                      <th className="p-3 font-semibold">ASSIGNED ROLE</th>
                      <th className="p-3 font-semibold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    <tr className="bg-blue-500/5">
                      <td className="p-3 font-mono font-bold text-blue-600">OWNER-01</td>
                      <td className="p-3 font-black">{currentPharmacy?.name} (Owner)</td>
                      <td className="p-3 text-slate-400">{currentPharmacy?.ownerEmail}</td>
                      <td className="p-3"><span className="bg-purple-500/20 text-purple-600 font-bold px-2 py-0.5 rounded text-[10px]">Pharmacy Owner</span></td>
                      <td className="p-3"><span className="bg-emerald-500/20 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">Active</span></td>
                    </tr>
                    {staffList.map((st) => (
                      <tr key={st._id || st.employeeCode} className="hover:bg-slate-500/5">
                        <td className="p-3 font-mono font-bold">{st.employeeCode}</td>
                        <td className="p-3 font-bold">{st.name}</td>
                        <td className="p-3 text-slate-400">{st.email}</td>
                        <td className="p-3">
                          <span className="bg-blue-500/10 text-blue-600 font-bold px-2 py-0.5 rounded text-[10px]">{st.role}</span>
                        </td>
                        <td className="p-3"><span className="bg-emerald-500/20 text-emerald-600 font-bold px-2 py-0.5 rounded text-[10px]">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. ADMIN & SECURITY AUDIT PANEL */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-black">Admin Security & Stock Dashboard</h2>
                <span className="text-xs bg-blue-500/10 text-blue-600 dark:text-cyan-400 font-bold px-3 py-1 rounded-full border border-blue-500/20">
                  Active User: {currentUser?.name}
                </span>
              </div>

              {/* Stock Alerts Box */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase text-slate-400">Stock Depletion Warnings ({stats.lowStockCount})</h3>
                {products.filter(p => p.stockQuantity <= p.minAlertQuantity).map(lowP => (
                  <div key={lowP._id || lowP.name} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    darkMode ? 'bg-slate-800/40 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-8 bg-amber-500 rounded-full" />
                      <div>
                        <strong className="text-xs">{lowP.name} ({lowP.pack})</strong>
                        <span className="ml-2 bg-amber-500/20 text-amber-500 font-bold px-2 py-0.5 rounded text-[10px]">
                          Only {lowP.stockQuantity} left
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestock(lowP, 50)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-xs"
                    >
                      + Restock 50
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Log Box */}
            <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Live System Audit Log (MongoDB Scoped)</h3>
              <div className="bg-black text-green-400 font-mono text-xs p-4 rounded-2xl space-y-2 max-h-60 overflow-y-auto">
                <p>[{new Date().toLocaleTimeString()}] harshit ADMIN: User "{currentUser?.name}" active in {currentPharmacy?.name}</p>
                {audits.map((a, i) => (
                  <p key={i}>[{a.timestamp}] {a.user} {a.role}: {a.action}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. ANALYTICS VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-xl font-black">Sales & Payment Method Distribution</h2>
              <p className="text-xs text-slate-400">Real-time payment analytics for {currentPharmacy?.name}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-center">
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-black uppercase">UPI Payments</span>
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-2">
                    ₹{stats.upiCollection}.00
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{stats.totalRevenue > 0 ? Math.round((stats.upiCollection / stats.totalRevenue) * 100) : 0}% of total revenue</p>
                </div>
                <div className="p-5 rounded-2xl bg-green-500/10 border border-green-500/20 text-center">
                  <span className="text-xs text-green-600 dark:text-green-400 font-black uppercase">Cash Payments</span>
                  <p className="text-2xl font-black text-green-600 dark:text-green-400 mt-2">
                    ₹{stats.cashCollection}.00
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{stats.totalRevenue > 0 ? Math.round((stats.cashCollection / stats.totalRevenue) * 100) : 0}% of total revenue</p>
                </div>
                <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-center">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-black uppercase">Card Swipes</span>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
                    ₹{stats.cardCollection}.00
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">{stats.totalRevenue > 0 ? Math.round((stats.cardCollection / stats.totalRevenue) * 100) : 0}% of total revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 9. SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <h2 className="text-xl font-black mb-4">Pharmacy Profile & Header Configuration</h2>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Pharmacy Trade Name</label>
                  <input
                    type="text"
                    value={currentPharmacy?.name || ''}
                    readOnly
                    className={`w-full p-2.5 rounded-xl border outline-none font-bold ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Address & Contact</label>
                  <input
                    type="text"
                    value={`${currentPharmacy?.address || ''} | ${currentPharmacy?.phone || ''}`}
                    readOnly
                    className={`w-full p-2.5 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Drug License No.</label>
                    <input
                      type="text"
                      value={currentPharmacy?.drugLicenseNo || ''}
                      readOnly
                      className={`w-full p-2.5 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">GSTIN</label>
                    <input
                      type="text"
                      value={currentPharmacy?.gstin || ''}
                      readOnly
                      className={`w-full p-2.5 rounded-xl border outline-none font-mono ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODAL 1: AI MEDICINE CLINICAL PREDICTOR & USES */}
      {showAIModal && selectedAIMedicine && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-xl p-6 rounded-3xl border shadow-2xl relative max-h-[90vh] overflow-y-auto ${
            darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <button
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-black"
            >
              ✕
            </button>

            <div className="flex items-center space-x-2.5 mb-4">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white shadow-md">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  Mecora Clinical AI Intelligence
                </span>
                <h3 className="text-lg font-black">{selectedAIMedicine.name}</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Salt */}
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p className="font-bold text-blue-600 dark:text-cyan-400 text-[11px]">SALT COMPOSITION & CLASS:</p>
                <p className="font-black text-sm mt-0.5">{selectedAIMedicine.salt}</p>
                <p className="text-[11px] text-slate-400">{selectedAIMedicine.category}</p>
              </div>

              {/* Uses */}
              <div>
                <h4 className="font-black text-xs text-slate-700 dark:text-slate-300 flex items-center mb-2">
                  <Stethoscope className="w-4 h-4 text-emerald-500 mr-1.5" />
                  Primary Diseases, Symptoms & Causes Treated:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedAIMedicine.primaryUses.map((use, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 font-bold border border-emerald-500/20">
                      ✓ {use}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dosage */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border dark:border-slate-700">
                <h4 className="font-black text-xs text-slate-700 dark:text-slate-300 flex items-center mb-1">
                  <Pill className="w-4 h-4 text-blue-500 mr-1.5" />
                  Recommended Dosage Administration:
                </h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedAIMedicine.dosageAdvice}</p>
              </div>

              {/* AI Clinical Tip */}
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <h4 className="font-black text-xs text-purple-600 dark:text-purple-400 flex items-center mb-1">
                  <Sparkles className="w-4 h-4 text-purple-500 mr-1.5" />
                  AI Clinical Insight for Pharmacist:
                </h4>
                <p className="text-purple-900 dark:text-purple-200 font-medium leading-relaxed">{selectedAIMedicine.aiClinicalTip}</p>
              </div>

              {/* Substitutes */}
              <div>
                <p className="font-bold text-slate-400 text-[10px] uppercase">Generic / Equivalent Substitutes:</p>
                <p className="font-bold text-blue-600 dark:text-cyan-400 mt-0.5">{selectedAIMedicine.substitutes.join(', ')}</p>
              </div>
            </div>

            <button
              onClick={() => setShowAIModal(false)}
              className="mt-6 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md"
            >
              Close Intelligence Card
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: BRANCH SWITCHER MODAL */}
      {showPharmacyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Switch Branch</h3>
                <p className="text-xs text-slate-400">Each branch maintains isolated MongoDB data</p>
              </div>
              <button onClick={() => setShowPharmacyModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="space-y-2 mb-6">
              {availablePharmacies.map((pharm) => (
                <div
                  key={pharm.pharmacyId}
                  onClick={() => handleSelectPharmacy(pharm)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${
                    activePharmacyId === pharm.pharmacyId
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'hover:border-slate-400 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-xs">{pharm.name}</h4>
                    <p className="text-[11px] text-slate-400">{pharm.ownerEmail} • {pharm.address}</p>
                  </div>
                  {activePharmacyId === pharm.pharmacyId && (
                    <span className="text-blue-500 font-bold text-xs flex items-center">
                      <Check className="w-4 h-4 mr-1" /> Active
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Create New Pharmacy Form */}
            <form onSubmit={handleCreatePharmacy} className="pt-4 border-t dark:border-slate-800 space-y-2 text-xs">
              <label className="font-bold block">Or Register New Pharmacy Branch:</label>
              <input
                type="text"
                placeholder="e.g., Apollo Health Store"
                value={newPharmacyName}
                onChange={(e) => setNewPharmacyName(e.target.value)}
                className={`w-full p-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
              />
              <input
                type="email"
                placeholder="branch.email@pharmacy.com"
                value={newPharmacyEmail}
                onChange={(e) => setNewPharmacyEmail(e.target.value)}
                className={`w-full p-2 rounded-xl border outline-none ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'}`}
              />
              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                Create & Switch to New Pharmacy
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ORDER SUCCESS & PRINT INVOICE POPUP */}
      {showInvoiceModal && completedOrder && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white text-slate-900 p-6 rounded-3xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowInvoiceModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-lg font-bold"
            >
              ✕
            </button>

            {/* Receipt Preview */}
            <div className="text-xs space-y-3 font-mono border p-4 rounded-2xl bg-slate-50">
              <div className="text-center border-b pb-3">
                <h2 className="text-base font-black tracking-wider uppercase text-blue-700">{currentPharmacy?.name || 'Mecora Pharmacy'}</h2>
                <p className="text-[11px] text-slate-600">{currentPharmacy?.address}</p>
                <p className="text-[10px] text-slate-500">DL: {currentPharmacy?.drugLicenseNo} | GSTIN: {currentPharmacy?.gstin}</p>
                <p className="text-[10px] text-blue-600 font-bold mt-1">TAX INVOICE / CASH MEMO</p>
              </div>

              <div className="flex justify-between border-b pb-2 text-[11px]">
                <div>
                  <p><strong>Bill No:</strong> #{completedOrder.orderNumber}</p>
                  <p><strong>Patient:</strong> {completedOrder.customerName}</p>
                </div>
                <div className="text-right">
                  <p><strong>Date:</strong> {completedOrder.dateString}</p>
                  <p><strong>Method:</strong> {completedOrder.paymentMethod}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 divide-y divide-slate-200">
                {completedOrder.items.map((it, idx) => (
                  <div key={idx} className="pt-1 flex justify-between">
                    <div>
                      <strong>{it.name}</strong>
                      <span className="block text-[10px] text-slate-500">Batch: {it.batch} | Qty: {it.quantity} x ₹{it.price}</span>
                    </div>
                    <strong className="text-right">₹{it.total}.00</strong>
                  </div>
                ))}
              </div>

              {/* Totals & Change */}
              <div className="border-t pt-2 space-y-1 text-right text-[11px]">
                <p>Subtotal: ₹{completedOrder.subtotal}.00</p>
                {completedOrder.gstAmount > 0 && <p>GST: ₹{completedOrder.gstAmount}.00</p>}
                {completedOrder.discount > 0 && <p className="text-red-600">Discount: -₹{completedOrder.discount}.00</p>}
                <p className="text-base font-black text-blue-700 border-t pt-1">
                  GRAND TOTAL: ₹{completedOrder.grandTotal}.00
                </p>
                {completedOrder.cashGiven && completedOrder.cashGiven > 0 ? (
                  <>
                    <p className="text-slate-600">Cash Received: ₹{completedOrder.cashGiven}.00</p>
                    <p className="text-green-600 font-black text-sm">Change Returned: ₹{completedOrder.cashChange || 0}.00</p>
                  </>
                ) : null}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex space-x-2">
              <button
                onClick={() => printReceipt(completedOrder, currentPharmacy)}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow-lg active:scale-95 transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="px-5 py-3 border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
