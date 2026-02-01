import React, { useState, useEffect, useMemo } from 'react';
import { 
  Wallet, TrendingUp, TrendingDown, Plus, PieChart, Home, 
  Settings, AlertTriangle, ShoppingBag, Coffee, Car, Zap, 
  Gift, MoreHorizontal, Trash2, Target, Lock, Unlock, 
  User, LogOut, Moon, Sun, Eye, EyeOff, ArrowRight
} from 'lucide-react';

// --- UTILS & CONFIG ---

const CATEGORIES = {
  expense: [
    { id: 'food', name: 'Ăn uống', icon: <Coffee size={18} />, color: 'bg-orange-100 text-orange-600' },
    { id: 'transport', name: 'Di chuyển', icon: <Car size={18} />, color: 'bg-blue-100 text-blue-600' },
    { id: 'shopping', name: 'Mua sắm', icon: <ShoppingBag size={18} />, color: 'bg-pink-100 text-pink-600' },
    { id: 'utilities', name: 'Hóa đơn', icon: <Zap size={18} />, color: 'bg-yellow-100 text-yellow-600' },
    { id: 'entertainment', name: 'Giải trí', icon: <Gift size={18} />, color: 'bg-purple-100 text-purple-600' },
    { id: 'other', name: 'Khác', icon: <MoreHorizontal size={18} />, color: 'bg-gray-100 text-gray-600' },
  ],
  income: [
    { id: 'salary', name: 'Lương', icon: <Wallet size={18} />, color: 'bg-green-100 text-green-600' },
    { id: 'bonus', name: 'Thưởng', icon: <Gift size={18} />, color: 'bg-teal-100 text-teal-600' },
    { id: 'investment', name: 'Đầu tư', icon: <TrendingUp size={18} />, color: 'bg-indigo-100 text-indigo-600' },
  ]
};

const formatCurrency = (amount, isHidden) => {
  if (isHidden) return '******';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatDate = (dateString) => {
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('vi-VN', options);
};

// --- AUTH COMPONENTS ---

const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem('fin_users') || '[]');

      if (isLogin) {
        const user = users.find(u => u.username === formData.username && u.password === formData.password);
        if (user) {
          onLogin(user);
        } else {
          setError('Tên đăng nhập hoặc mật khẩu không đúng!');
        }
      } else {
        if (!formData.username || !formData.password || !formData.fullName) {
          setError('Vui lòng điền đầy đủ thông tin!');
          setLoading(false);
          return;
        }
        if (users.find(u => u.username === formData.username)) {
          setError('Tên đăng nhập đã tồn tại!');
        } else {
          const newUser = { ...formData, id: Date.now().toString() };
          localStorage.setItem('fin_users', JSON.stringify([...users, newUser]));
          onLogin(newUser);
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 to-teal-800 flex flex-col items-center justify-center p-6 text-white">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-lg">
            <Wallet size={32} />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">{isLogin ? 'Đăng nhập' : 'Tạo tài khoản'}</h2>
        <p className="text-center text-emerald-100 text-sm mb-8">Quản lý tài chính cá nhân thông minh</p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <input 
                type="text" 
                placeholder="Họ và tên" 
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-emerald-400"
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
              />
            </div>
          )}
          <div>
            <input 
              type="text" 
              placeholder="Tên đăng nhập" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-emerald-400"
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Mật khẩu" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-emerald-400"
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {error && <div className="text-red-300 text-xs text-center bg-red-900/30 py-2 rounded-lg">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-teal-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition shadow-lg flex justify-center items-center gap-2"
          >
            {loading ? <span className="animate-spin w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full"></span> : (isLogin ? 'Đăng nhập' : 'Đăng ký ngay')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-sm text-emerald-100 hover:text-white hover:underline"
          >
            {isLogin ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CHART COMPONENT ---

const DonutChart = ({ data }) => {
  if (!data || data.length === 0) return (
    <div className="h-48 flex items-center justify-center text-gray-400 text-sm dark:text-gray-500">
      Chưa có dữ liệu chi tiêu
    </div>
  );

  const total = data.reduce((acc, item) => acc + item.value, 0);
  let cumulativePercent = 0;

  const slices = data.map((slice, i) => {
    const start = cumulativePercent;
    const end = cumulativePercent + (slice.value / total);
    cumulativePercent = end;

    const x1 = Math.cos(2 * Math.PI * start);
    const y1 = Math.sin(2 * Math.PI * start);
    const x2 = Math.cos(2 * Math.PI * end);
    const y2 = Math.sin(2 * Math.PI * end);

    const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
    const pathData = `M ${x1} ${y1} A 1 1 0 ${largeArcFlag} 1 ${x2} ${y2} L 0 0`;
    const colors = ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#6b7280'];
    
    return <path d={pathData} fill={colors[i % colors.length]} key={i} />;
  });

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg viewBox="-1 -1 2 2" className="transform -rotate-90 w-full h-full">{slices}</svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center shadow-inner">
            <span className="text-xs text-gray-400">Tổng chi</span>
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
        {data.map((item, index) => (
           <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-300">
             <span className={`w-3 h-3 rounded-full mr-2`} style={{backgroundColor: ['#10b981', '#3b82f6', '#ec4899', '#f59e0b', '#8b5cf6', '#6b7280'][index % 6]}}></span>
             <span className="truncate flex-1">{item.name}</span>
             <span className="font-medium">{Math.round((item.value/total)*100)}%</span>
           </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN APP ---

const App = () => {
  // Global State
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem('fin_current_user'));
  });
  
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [privateMode, setPrivateMode] = useState(false); // Hide numbers
  const [view, setView] = useState('home'); // home, stats, settings
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // --- AUTH & DATA LOADING ---
  
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fin_current_user', JSON.stringify(currentUser));
      // Load user specific data
      const userKey = `fin_data_${currentUser.id}`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        setTransactions(JSON.parse(savedData));
      } else {
        setTransactions([]); // New user has empty data
      }
    } else {
      localStorage.removeItem('fin_current_user');
      setTransactions([]);
    }
  }, [currentUser]);

  useEffect(() => {
    // Save data whenever transactions change, if logged in
    if (currentUser) {
      const userKey = `fin_data_${currentUser.id}`;
      localStorage.setItem(userKey, JSON.stringify(transactions));
    }
  }, [transactions, currentUser]);

  // Dark Mode Toggle Class
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  // --- LOGIC ---
  
  const { totalIncome, totalExpense, balance, expenseByCategory } = useMemo(() => {
    let inc = 0, exp = 0;
    const catStats = {};
    transactions.forEach(t => {
      if (t.type === 'income') inc += Number(t.amount);
      else {
        exp += Number(t.amount);
        if (!catStats[t.category]) catStats[t.category] = 0;
        catStats[t.category] += Number(t.amount);
      }
    });
    const chartData = Object.keys(catStats).map(key => {
      const catDef = CATEGORIES.expense.find(c => c.id === key) || CATEGORIES.expense[5];
      return { name: catDef.name, value: catStats[key] };
    }).sort((a, b) => b.value - a.value);
    return { totalIncome: inc, totalExpense: exp, balance: inc - exp, expenseByCategory: chartData };
  }, [transactions]);

  const handleAddTransaction = () => {
    if (!amount || !category) return;
    const newTransaction = {
      id: Date.now(),
      type: modalType,
      amount: parseFloat(amount),
      category,
      date: new Date(date).toISOString(),
      note
    };
    setTransactions([newTransaction, ...transactions]);
    setShowModal(false);
    setAmount(''); setNote('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('home');
  };

  const getCategoryDef = (id, type) => {
    const list = type === 'income' ? CATEGORIES.income : CATEGORIES.expense;
    return list.find(c => c.id === id) || { name: 'Khác', icon: <MoreHorizontal/>, color: 'bg-gray-100 text-gray-600' };
  };

  // --- RENDERERS ---

  if (!currentUser) {
    return <AuthScreen onLogin={setCurrentUser} />;
  }

  const renderHeader = () => (
    <div className="bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-teal-900 rounded-b-3xl p-6 pb-12 shadow-lg text-white relative overflow-hidden transition-all">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl transform translate-x-10 -translate-y-10"></div>
      
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <p className="text-xs opacity-80">Xin chào,</p>
            <p className="font-semibold text-sm truncate max-w-[150px]">{currentUser.fullName}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setPrivateMode(!privateMode)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            {privateMode ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button onClick={() => setView('settings')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
            <Settings size={18} />
          </button>
        </div>
      </div>

      <div className="text-center mb-4 z-10 relative">
        <p className="text-sm opacity-90 mb-1">Tổng số dư</p>
        <h1 className="text-4xl font-bold tracking-tight">{formatCurrency(balance, privateMode)}</h1>
      </div>

      <div className="flex gap-4 mt-6 z-10 relative">
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center border border-white/10">
          <div className="flex items-center gap-1 text-emerald-100 text-xs mb-1">
            <TrendingUp size={14} /> Thu nhập
          </div>
          <p className="font-bold text-lg">{formatCurrency(totalIncome, privateMode)}</p>
        </div>
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-3 flex flex-col items-center border border-white/10">
          <div className="flex items-center gap-1 text-red-100 text-xs mb-1">
            <TrendingDown size={14} /> Chi tiêu
          </div>
          <p className="font-bold text-lg">{formatCurrency(totalExpense, privateMode)}</p>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      {renderHeader()}
      
      {/* Budget Limit Card */}
      <div className="mx-4 -mt-6 mb-4 bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 relative z-10 border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="flex justify-between items-end mb-2">
           <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
             <Target size={16} className="text-blue-500"/> Giới hạn chi (Tháng)
           </h3>
           <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatCurrency(totalExpense, privateMode)} / 10tr</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div className="h-2 bg-teal-500 rounded-full" style={{ width: `${Math.min((totalExpense/10000000)*100, 100)}%` }}></div>
        </div>
      </div>

      {/* Transactions */}
      <div className="px-4 pb-24">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800 dark:text-white">Giao dịch gần đây</h3>
          <button onClick={() => setView('stats')} className="text-xs text-teal-600 dark:text-teal-400 font-medium">Xem tất cả</button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="text-center py-10 opacity-50 dark:text-gray-400">
            <p>Chưa có giao dịch nào</p>
            <button onClick={() => setShowModal(true)} className="text-sm text-teal-600 mt-2 font-bold">Thêm ngay</button>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => {
              const catInfo = getCategoryDef(t.category, t.type);
              return (
                <div key={t.id} className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-50 dark:border-gray-700 flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${catInfo.color} dark:bg-opacity-20`}>
                    {catInfo.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 dark:text-gray-100 text-sm truncate">{t.note || catInfo.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(t.date)}</p>
                  </div>
                  <p className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, privateMode)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );

  const renderSettings = () => (
    <div className="p-6 pb-24 dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Cài đặt</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-6">
        <div className="p-4 flex items-center gap-4 border-b border-gray-100 dark:border-gray-700">
          <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 text-xl font-bold">
            {currentUser.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-lg">{currentUser.fullName}</h3>
            <p className="text-xs text-gray-500">@{currentUser.username}</p>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              <span>Chế độ tối (Dark Mode)</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>

          <div className="flex justify-between items-center">
             <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              {privateMode ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>Chế độ riêng tư</span>
            </div>
            <button 
              onClick={() => setPrivateMode(!privateMode)}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${privateMode ? 'bg-teal-500' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${privateMode ? 'translate-x-6' : ''}`}></div>
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={handleLogout}
        className="w-full bg-red-50 text-red-600 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-100 transition"
      >
        <LogOut size={20} /> Đăng xuất
      </button>

      <div className="mt-8 text-center text-xs text-gray-400">
        <p>Phiên bản 2.0.0</p>
        <p>Dữ liệu được mã hóa cục bộ</p>
      </div>
    </div>
  );

  const renderAddModal = () => {
    if (!showModal) return null;
    const isExpense = modalType === 'expense';
    const list = isExpense ? CATEGORIES.expense : CATEGORIES.income;

    return (
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 dark:text-white">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Thêm giao dịch</h2>
            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">Đóng</button>
          </div>

          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
            <button 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${isExpense ? 'bg-white dark:bg-gray-700 text-red-600 shadow-sm' : 'text-gray-500'}`}
              onClick={() => { setModalType('expense'); setCategory(CATEGORIES.expense[0].id); }}
            >Chi tiêu</button>
            <button 
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${!isExpense ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-500'}`}
              onClick={() => { setModalType('income'); setCategory(CATEGORIES.income[0].id); }}
            >Thu nhập</button>
          </div>

          <div className="mb-6 relative">
             <input 
                type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0"
                className="w-full text-4xl font-bold bg-transparent border-b-2 border-gray-200 dark:border-gray-700 focus:border-teal-500 outline-none py-2 text-center text-gray-800 dark:text-white"
                autoFocus
              />
              <span className="absolute right-0 bottom-4 text-xs font-bold text-gray-400">VND</span>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {list.map((cat) => (
              <button key={cat.id} onClick={() => setCategory(cat.id)}
                className={`flex flex-col items-center gap-2 p-2 rounded-xl border ${category === cat.id ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/30' : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cat.color} dark:bg-opacity-80`}>{cat.icon}</div>
                <span className="text-[10px] font-medium truncate w-full text-center text-gray-600 dark:text-gray-300">{cat.name}</span>
              </button>
            ))}
          </div>

          <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú (Tùy chọn)" 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 mb-4 focus:ring-2 focus:ring-teal-500 outline-none" 
          />
          
          <button onClick={handleAddTransaction} disabled={!amount} 
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 transition shadow-lg shadow-teal-500/30">
            Lưu
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-md mx-auto min-h-screen bg-gray-50 dark:bg-gray-900 shadow-2xl overflow-hidden relative">
        
        {view === 'home' && renderHome()}
        
        {view === 'stats' && (
          <div className="p-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-2xl font-bold mb-2 dark:text-white">Thống kê</h2>
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                <DonutChart data={expenseByCategory} />
             </div>
             {/* Gamification Example */}
             <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between mb-2">
                    <span className="text-indigo-200 text-xs uppercase font-bold tracking-wider">Thử thách tiết kiệm</span>
                    <Gift size={20} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Giảm chi ăn uống &lt; 2tr</h3>
                  <div className="w-full bg-black/30 rounded-full h-1.5 mb-2">
                    <div className="bg-yellow-400 h-1.5 rounded-full" style={{width: '60%'}}></div>
                  </div>
                  <p className="text-xs text-indigo-100">Còn 800k nữa để nhận Badge "Vua Tiết Kiệm"!</p>
                </div>
             </div>
          </div>
        )}

        {view === 'settings' && renderSettings()}

        {/* Bottom Nav */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-6 py-3 flex justify-between items-center z-50">
          <button onClick={() => setView('home')} className={`flex flex-col items-center gap-1 ${view === 'home' ? 'text-teal-600' : 'text-gray-400 dark:text-gray-600'}`}>
            <Home size={24} strokeWidth={view === 'home' ? 2.5 : 2} />
          </button>
          <div className="relative -top-6">
            <button onClick={() => setShowModal(true)} className="w-14 h-14 bg-teal-600 rounded-full text-white shadow-xl shadow-teal-500/40 flex items-center justify-center hover:scale-105 transition active:scale-95 ring-4 ring-white dark:ring-gray-900">
              <Plus size={28} />
            </button>
          </div>
          <button onClick={() => setView('stats')} className={`flex flex-col items-center gap-1 ${view === 'stats' ? 'text-teal-600' : 'text-gray-400 dark:text-gray-600'}`}>
            <PieChart size={24} strokeWidth={view === 'stats' ? 2.5 : 2} />
          </button>
        </div>

        {renderAddModal()}
      </div>
    </div>
  );
};

export default App;