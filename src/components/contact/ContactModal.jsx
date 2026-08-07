import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { submitContact } from '../../services/api';

export default function ContactModal({ isOpen, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [serverError, setServerError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', email: '', subject: '', message: '' });
      setErrors({});
      setStatus('idle');
      setServerError('');
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email';
    }
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    try {
      await submitContact(form);
      setStatus('success');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const inputStyle = (fieldName) => ({
    width: '100%',
    padding: 'var(--space-md) var(--space-base)',
    borderRadius: 'var(--radius-md)',
    border: `1.5px solid ${errors[fieldName] ? 'var(--error)' : 'var(--border-primary)'}`,
    backgroundColor: 'var(--surface-secondary)',
    fontSize: '14px',
    outline: 'none',
    color: 'var(--text-primary)',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.65)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative w-full animate-scale-in theme-transition"
        style={{
          maxWidth: '440px',
          margin: 'var(--space-base)',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: 'var(--surface-elevated)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-primary)',
        }}
      >
        {/* Gradient accent line at top */}
        <div
          style={{
            height: '3px',
            background: 'var(--accent-gradient)',
            borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
          }}
        />

        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{
            padding: 'var(--space-base) var(--space-lg)',
            borderBottom: '1px solid var(--border-primary)',
          }}
        >
          <h2 style={{ fontWeight: 600, fontSize: '16px', color: 'var(--text-primary)' }}>
            Send a Message
          </h2>
          <button
            id="contact-modal-close"
            onClick={onClose}
            className="rounded-full"
            style={{
              padding: 'var(--space-sm)',
              color: 'var(--text-secondary)',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-soft)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div
            className="flex flex-col items-center justify-center animate-scale-in"
            style={{ padding: 'var(--space-3xl) var(--space-lg)' }}
          >
            <CheckCircle
              size={64}
              style={{ color: 'var(--success)' }}
              className="mb-4"
            />
            <h3 style={{ fontWeight: 600, fontSize: '18px', color: 'var(--text-primary)', marginBottom: 'var(--space-xs)' }}>
              Message Sent!
            </h3>
            <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Thanks for reaching out. I'll get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="btn-gradient"
              style={{
                marginTop: 'var(--space-lg)',
                padding: 'var(--space-sm) var(--space-lg)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
              }}
            >
              Done
            </button>
          </div>
        ) : (
          /* Form */
          <form
            onSubmit={handleSubmit}
            style={{
              padding: 'var(--space-lg)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-base)',
            }}
          >
            {/* Name */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Name *
              </label>
              <input
                id="contact-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                style={inputStyle('name')}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.name ? 'var(--error)' : 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Your name"
              />
              {errors.name && (
                <p style={{ fontSize: '12px', marginTop: 'var(--space-xs)', color: 'var(--error)' }}>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Email *
              </label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                style={inputStyle('email')}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? 'var(--error)' : 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="your@email.com"
              />
              {errors.email && (
                <p style={{ fontSize: '12px', marginTop: 'var(--space-xs)', color: 'var(--error)' }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Subject
              </label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                style={inputStyle('subject')}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="What's this about?"
              />
            </div>

            {/* Message */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 600,
                  marginBottom: 'var(--space-sm)',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Message *
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                style={{ ...inputStyle('message'), minHeight: '100px', resize: 'vertical' }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.message ? 'var(--error)' : 'var(--border-primary)';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Your message..."
              />
              {errors.message && (
                <p style={{ fontSize: '12px', marginTop: 'var(--space-xs)', color: 'var(--error)' }}>
                  {errors.message}
                </p>
              )}
            </div>

            {status === 'error' && (
              <p style={{ fontSize: '14px', textAlign: 'center', color: 'var(--error)' }}>
                {serverError}
              </p>
            )}

            <button
              id="contact-submit"
              type="submit"
              disabled={status === 'submitting'}
              className="btn-gradient w-full flex items-center justify-center"
              style={{
                padding: 'var(--space-md)',
                borderRadius: 'var(--radius-md)',
                fontSize: '14px',
                gap: 'var(--space-sm)',
                opacity: status === 'submitting' ? 0.7 : 1,
                cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
              }}
            >
              {status === 'submitting' && <Loader2 size={16} className="animate-spin" />}
              {status === 'submitting' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
