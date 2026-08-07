import { useState, useEffect } from 'react';
import { getMessages } from '../../services/api';
import { Mail, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export default function MessagesInbox() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getMessages();
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ padding: 'var(--space-3xl)' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--text-secondary)' }} />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center" style={{ padding: 'var(--space-3xl)' }}>
        <Mail size={48} style={{ color: 'var(--text-tertiary)' }} className="mx-auto mb-3" />
        <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>No Messages Yet</p>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: 'var(--space-xs)' }}>
          Contact form submissions will appear here.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
      {messages.map((msg) => (
        <div
          key={msg._id}
          className="overflow-hidden theme-transition"
          style={{
            backgroundColor: 'var(--surface-elevated)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-primary)',
            transition: 'var(--transition-base)',
          }}
        >
          <button
            onClick={() => toggleExpand(msg._id)}
            className="w-full flex items-center justify-between text-left"
            style={{
              padding: 'var(--space-md) var(--space-base)',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }} className="truncate">
                  {msg.name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  {msg.email}
                </span>
              </div>
              <p
                className="truncate"
                style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '2px' }}
              >
                {msg.subject || msg.message.substring(0, 60)}
              </p>
            </div>
            <div className="flex items-center shrink-0" style={{ gap: 'var(--space-md)', marginLeft: 'var(--space-md)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
              {expandedId === msg._id ? (
                <ChevronUp size={16} style={{ color: 'var(--text-secondary)' }} />
              ) : (
                <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} />
              )}
            </div>
          </button>

          {expandedId === msg._id && (
            <div
              className="animate-fade-in"
              style={{
                padding: '0 var(--space-base) var(--space-base)',
                borderTop: '1px solid var(--border-secondary)',
              }}
            >
              <div style={{ paddingTop: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    From:
                  </span>
                  <span style={{ fontSize: '14px', marginLeft: 'var(--space-sm)', color: 'var(--text-primary)' }}>
                    {msg.name} ({msg.email})
                  </span>
                </div>
                {msg.subject && (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Subject:
                    </span>
                    <span style={{ fontSize: '14px', marginLeft: 'var(--space-sm)', color: 'var(--text-primary)' }}>
                      {msg.subject}
                    </span>
                  </div>
                )}
                <div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'block',
                      marginBottom: 'var(--space-xs)',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    Message:
                  </span>
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
