import React, { useState } from 'react';
import { Shield, Lock, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 8888 or admin123 or vibe
    if (pin === '8888' || pin.toLowerCase() === 'admin' || pin.toLowerCase() === 'vibe') {
      localStorage.setItem('vibe_admin_token', 'authenticated_' + Date.now());
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" style={{ backdropFilter: 'blur(16px)' }}>
      <div className="modal-content" style={{ maxWidth: '440px', padding: '32px 28px', textAlign: 'center', background: '#0e121e' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px',
          color: '#c084fc'
        }}>
          <Shield size={32} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#f8fafc', marginBottom: '8px' }}>
          Vibe Admin Portal
        </h2>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px' }}>
          Khu vực bảo mật dành cho Ban Quản Trị Hệ Sinh Thái 7 Web.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Nhập mã PIN Quản Trị (Mặc định: 8888)"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: error ? '1px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            />
            <KeyRound size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#ef4444', fontSize: '13px' }}>
              <AlertCircle size={14} />
              <span>Mã PIN không chính xác! Thử lại với mã: 8888</span>
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: '15px' }}>
            <Lock size={16} />
            <span>Mở Khóa Quản Trị Trung Tâm</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px dashed rgba(255, 255, 255, 0.08)' }}>
          <p style={{ fontSize: '12px', color: '#64748b' }}>
            💡 Gợi ý nhanh: Nhập mã PIN <strong style={{ color: '#c084fc' }}>8888</strong> hoặc <strong style={{ color: '#c084fc' }}>admin</strong> để đăng nhập.
          </p>
        </div>
      </div>
    </div>
  );
};
