import React from 'react';
import { X, ExternalLink, RefreshCw, Globe, ShieldCheck } from 'lucide-react';

interface PreviewModalProps {
  url: string | null;
  title: string;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ url, title, onClose }) => {
  const [key, setKey] = React.useState(0);

  if (!url) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ height: '88vh' }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 20, 34, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#c084fc'
            }}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#f8fafc' }}>{title}</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Globe size={11} /> {url}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setKey(k => k + 1)}
              className="btn-outline"
              title="Tải lại iframe"
              style={{ padding: '6px 10px' }}
            >
              <RefreshCw size={14} />
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              <span>Mở Tab Riêng</span>
              <ExternalLink size={13} />
            </a>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Iframe Body */}
        <div style={{ flex: 1, position: 'relative', background: '#05070c' }}>
          <iframe
            key={key}
            src={url}
            title={title}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              background: '#090d16'
            }}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
          />
        </div>
      </div>
    </div>
  );
};
