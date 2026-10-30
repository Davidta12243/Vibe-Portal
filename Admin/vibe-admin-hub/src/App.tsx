import { useState, useEffect } from 'react';
import {
  Shield,
  GraduationCap,
  Apple,
  Video,
  Plane,
  ShoppingBag,
  Cpu,
  Globe,
  ExternalLink,
  Eye,
  Database,
  Server,
  Lock,
  Search,
  Terminal,
  CheckCircle2,
  Layers,
  Activity,
  Sparkles,
  LayoutDashboard,
  CloudLightning
} from 'lucide-react';
import { subSystems, cloudTools } from './data';
import type { SubSystem } from './types';
import { PreviewModal } from './components/PreviewModal';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'admin-only' | 'cloud' | 'local'>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('vibe_admin_token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLock = () => {
    localStorage.removeItem('vibe_admin_token');
    setIsAuthenticated(false);
  };

  const getIcon = (name: string, size = 22) => {
    switch (name) {
      case 'GraduationCap': return <GraduationCap size={size} />;
      case 'Apple': return <Apple size={size} />;
      case 'Video': return <Video size={size} />;
      case 'Plane': return <Plane size={size} />;
      case 'ShoppingBag': return <ShoppingBag size={size} />;
      case 'Cpu': return <Cpu size={size} />;
      default: return <Globe size={size} />;
    }
  };

  const filteredSystems = subSystems.filter(sys => {
    const matchesSearch = sys.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sys.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sys.database.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'admin-only') {
      return matchesSearch && (sys.id === 'lms' || sys.id === 'food' || sys.id === 'live' || sys.id === 'travel');
    }
    return matchesSearch;
  });

  const openPreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-darkest)' }}>
      {!isAuthenticated && <AuthModal onSuccess={() => setIsAuthenticated(true)} />}

      {/* Top Navigation Bar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(16px)',
        background: 'rgba(7, 9, 14, 0.85)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '12px 24px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
            }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }} className="font-display">
                  Vibe Studio
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: 'rgba(168, 85, 247, 0.2)',
                  color: '#c084fc',
                  border: '1px solid rgba(168, 85, 247, 0.4)',
                  letterSpacing: '0.5px'
                }}>
                  MASTER ADMIN
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748b' }}>
                Cổng Quản Trị & Điều Hành Hệ Sinh Thái 7 Web
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <div className="pulse-dot"></div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#34d399' }}>7/7 Web Trực Tuyến</span>
            </div>

            <button
              onClick={handleLock}
              className="btn-outline"
              title="Khóa phiên làm việc quản trị"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Lock size={14} />
              <span>Khóa Hub</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px', flex: 1, width: '100%' }}>
        {/* Hero Section of Admin */}
        <div className="glass-panel" style={{
          padding: '28px 32px',
          marginBottom: '32px',
          background: 'linear-gradient(135deg, rgba(20, 26, 42, 0.8), rgba(12, 16, 26, 0.9))',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontSize: '13px', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>BẢNG ĐIỀU KHIỂN TẬP TRUNG TẤT CẢ PHÂN HỆ</span>
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Trung Tâm Chỉ Huy Quản Trị <span className="text-gradient">Vibe Studio</span>
            </h1>
            <p style={{ fontSize: '15px', color: '#94a3b8', maxWidth: '850px', lineHeight: 1.6 }}>
              Quản trị tập trung toàn bộ dữ liệu người dùng, bài giảng, kho nông sản, phòng livestream và cơ sở dữ liệu đám mây. Bạn có thể mở nhanh trang quản trị chuyên sâu hoặc xem trước trực tiếp mà không cần rời khỏi Hub.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c084fc' }}>
                <Layers size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Tổng Phân Hệ</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>7 Web Độc Lập</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <Database size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Cơ Sở Dữ Liệu</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>MongoDB + Firebase</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                <Server size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Hạ Tầng Cloud</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Vercel Serverless</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb7185' }}>
                <Activity size={20} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Cổng Local</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc' }}>Ports 3000 - 3007</div>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '24px' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.04)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'all' ? 'linear-gradient(135deg, #9333ea, #db2777)' : 'transparent',
                color: activeTab === 'all' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <LayoutDashboard size={14} />
              <span>Tất Cả 7 Web</span>
            </button>

            <button
              onClick={() => setActiveTab('admin-only')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'admin-only' ? 'linear-gradient(135deg, #9333ea, #db2777)' : 'transparent',
                color: activeTab === 'admin-only' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={14} />
              <span>Khu Quản Trị Chuyên Sâu</span>
            </button>

            <button
              onClick={() => setActiveTab('cloud')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'cloud' ? 'linear-gradient(135deg, #9333ea, #db2777)' : 'transparent',
                color: activeTab === 'cloud' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <CloudLightning size={14} />
              <span>Cơ Sở Dữ Liệu Cloud</span>
            </button>

            <button
              onClick={() => setActiveTab('local')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'local' ? 'linear-gradient(135deg, #9333ea, #db2777)' : 'transparent',
                color: activeTab === 'local' ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              <Terminal size={14} />
              <span>Điều Khiển Local Máy</span>
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Tìm kiếm phân hệ, database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 38px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          </div>
        </div>

        {/* TAB 1 & 2: Systems Grid */}
        {(activeTab === 'all' || activeTab === 'admin-only') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
            {filteredSystems.map((sys: SubSystem) => (
              <div
                key={sys.id}
                className="glass-panel glass-panel-hover"
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `3px solid ${sys.color}`,
                  position: 'relative'
                }}
              >
                <div>
                  {/* Card Header */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: `${sys.color}20`,
                        color: sys.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `1px solid ${sys.color}40`
                      }}>
                        {getIcon(sys.iconName)}
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: sys.color, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                          {sys.category}
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
                          {sys.name}
                        </h3>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#94a3b8'
                    }}>
                      Port :{sys.port}
                    </span>
                  </div>

                  {/* Badge Text */}
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      background: `${sys.color}15`,
                      color: sys.color,
                      border: `1px solid ${sys.color}30`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Shield size={12} />
                      {sys.badgeText}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '16px' }}>
                    {sys.description}
                  </p>

                  {/* Admin Feature Bullets */}
                  <div style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                      Nghiệp vụ quản trị:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px' }}>
                      {sys.adminFeatures.map((feat, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                          <CheckCircle2 size={13} style={{ color: sys.color, flexShrink: 0 }} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech specs */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '18px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                    <span>Cơ sở dữ liệu: <strong style={{ color: '#cbd5e1' }}>{sys.database}</strong></span>
                    <span>Nền tảng: <strong style={{ color: '#cbd5e1' }}>{sys.framework}</strong></span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => openPreview(sys.adminUrl, sys.name + ' - Quản Trị')}
                    className="btn-primary"
                    style={{ flex: 1, justifyContent: 'center', padding: '10px 14px', fontSize: '13px' }}
                  >
                    <Eye size={15} />
                    <span>{sys.adminActionLabel}</span>
                  </button>

                  <a
                    href={sys.adminUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    title="Mở trong tab trình duyệt mới"
                    style={{ padding: '10px 12px' }}
                  >
                    <ExternalLink size={16} />
                  </a>

                  <a
                    href={sys.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline"
                    title="Mở giao diện khách hàng (Live Web)"
                    style={{ padding: '10px 12px' }}
                  >
                    <Globe size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: Cloud & Databases Access */}
        {activeTab === 'cloud' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ marginBottom: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc' }}>
                Hạ Tầng Đám Mây & Cơ Sở Dữ Liệu Tập Trung
              </h2>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                Truy cập trực tiếp vào các nhà kho dữ liệu (Databases) và dịch vụ máy chủ quản lý toàn bộ hệ thống.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
              {cloudTools.map((tool, idx) => (
                <div
                  key={idx}
                  className="glass-panel glass-panel-hover"
                  style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: tool.iconColor, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                        {tool.type}
                      </span>
                      <span className="pulse-dot"></span>
                    </div>

                    <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
                      {tool.name}
                    </h3>

                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '20px' }}>
                      {tool.description}
                    </p>
                  </div>

                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ justifyContent: 'center' }}
                  >
                    <span>Mở Bảng Điều Khiển {tool.name.split(' ')[0]}</span>
                    <ExternalLink size={15} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Local Port & Process Management */}
        {activeTab === 'local' && (
          <div className="glass-panel" style={{ padding: '28px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px' }}>
              Trung Tâm Điều Khiển Chạy Local (Môi Trường Máy Của Bạn)
            </h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
              Hệ sinh thái Vibe Studio đã được phân luồng độc lập qua 8 cổng port riêng biệt từ 3000 đến 3007.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#a855f7', fontWeight: 700 }}>PORT 3000</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>0-Vibe portal (Landing Page)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3000</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#f97316', fontWeight: 700 }}>PORT 3001</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>1-Shop (Shopee Clone)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3001</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>PORT 3002</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>2-Food-Selling (Nông Sản)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3002</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700 }}>PORT 3003</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>3-Computer-Service (Ráp PC)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3003</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#06b6d4', fontWeight: 700 }}>PORT 3004</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>4-Booking-Office (Traveloka)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3004</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#8b5cf6', fontWeight: 700 }}>PORT 3005</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>5-LMS (Giáo Dục Trực Tuyến)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3005</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ fontSize: '11px', color: '#f43f5e', fontWeight: 700 }}>PORT 3006</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>6-Livestream (LiveKit)</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>http://localhost:3006</div>
              </div>

              <div style={{ padding: '14px', borderRadius: '10px', background: 'rgba(236, 72, 153, 0.1)', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                <span style={{ fontSize: '11px', color: '#ec4899', fontWeight: 700 }}>PORT 3007 (MỚI)</span>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f8fafc' }}>Admin/vibe-admin-hub</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>http://localhost:3007 (Hub này)</div>
              </div>
            </div>

            {/* Quick scripts */}
            <div style={{ padding: '16px', borderRadius: '10px', background: '#07090e', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Terminal size={14} style={{ color: '#38bdf8' }} />
                <span>Cách khởi động toàn bộ hệ thống bằng 1 click:</span>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
                Bạn chỉ cần nhấp đúp chuột vào file <code>start-all.bat</code> ở thư mục gốc của dự án, hệ thống sẽ tự động bật 8 cửa sổ console độc lập cho từng dịch vụ. Khi muốn tắt, chỉ cần nhấp đúp vào <code>stop-all.bat</code>.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '20px 24px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b',
        background: 'rgba(7, 9, 14, 0.95)'
      }}>
        Vibe Studio Master Admin Portal • Kiến Trúc Hệ Sinh Thái Micro-Frontends 2026
      </footer>

      {/* Embedded Live Preview Modal */}
      {previewUrl && (
        <PreviewModal
          url={previewUrl}
          title={previewTitle}
          onClose={() => setPreviewUrl(null)}
        />
      )}
    </div>
  );
}
