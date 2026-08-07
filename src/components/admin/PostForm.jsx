import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';
import axios from 'axios';

export default function PostForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [form, setForm] = useState({
    imageUrl: initialData?.imageUrl || '',
    caption: initialData?.caption || '',
    likesCount: initialData?.likesCount || 0,
    commentsCount: initialData?.commentsCount || 0,
    sharesCount: initialData?.sharesCount || 0,
    location: initialData?.location || '',
    aspectRatio: initialData?.aspectRatio || '1:1',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [sizeInfo, setSizeInfo] = useState(null);
  const [checkingSize, setCheckingSize] = useState(false);

  // Debounced image size check
  useEffect(() => {
    if (!form.imageUrl || !form.imageUrl.startsWith('http')) {
      setSizeInfo(null);
      return;
    }

    const timer = setTimeout(async () => {
      setCheckingSize(true);
      try {
        const res = await axios.get(`/api/images/check-size?url=${encodeURIComponent(form.imageUrl)}`);
        setSizeInfo(res.data);
      } catch {
        setSizeInfo({ accessible: false });
      } finally {
        setCheckingSize(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [form.imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.imageUrl.trim() || !form.caption.trim()) {
      setError('Image URL and caption are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        ...form,
        likesCount: Number(form.likesCount),
        commentsCount: Number(form.commentsCount),
        sharesCount: Number(form.sharesCount),
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'imageUrl') setImageError(false);
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fieldStyle = {
    width: '100%',
    padding: 'var(--space-md) var(--space-base)',
    border: '1.5px solid var(--border-primary)',
    borderRadius: 'var(--radius-md)',
    fontSize: '14px',
    backgroundColor: 'var(--surface-secondary)',
    outline: 'none',
    color: 'var(--text-primary)',
    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
  };

  const focusHandlers = {
    onFocus: (e) => {
      e.target.style.borderColor = 'var(--accent-primary)';
      e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
    },
    onBlur: (e) => {
      e.target.style.borderColor = 'var(--border-primary)';
      e.target.style.boxShadow = 'none';
    },
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 500,
    marginBottom: 'var(--space-sm)',
    color: 'var(--text-primary)',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-base)' }}
    >
      <div>
        <label style={labelStyle}>Image URL *</label>
        <input
          name="imageUrl"
          value={form.imageUrl}
          onChange={handleChange}
          style={fieldStyle}
          placeholder="https://pub-....r2.dev/image.jpg"
          {...focusHandlers}
        />

        {/* Real-time file size & optimization status */}
        {checkingSize && (
          <div className="flex items-center gap-2 mt-2 text-xs text-[var(--text-secondary)]">
            <Loader2 size={12} className="animate-spin" />
            <span>Checking file size & accessibility...</span>
          </div>
        )}

        {!checkingSize && sizeInfo && (
          <div className="mt-2 text-xs">
            {sizeInfo.accessible ? (
              <div
                className="flex items-center gap-2 p-2 rounded-lg"
                style={{
                  backgroundColor: 'var(--surface-tertiary)',
                  border: '1px solid var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
              >
                {sizeInfo.sizeMB > 25 ? (
                  <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                ) : (
                  <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                )}
                <span>
                  <strong>Raw Size: {sizeInfo.sizeMB} MB</strong>
                  {sizeInfo.sizeMB > 0 && (
                    <span className="text-[var(--text-secondary)] ml-1">
                      — Automatically converted to optimized WebP (~40KB) for instant visitor loading.
                    </span>
                  )}
                </span>
              </div>
            ) : (
              <p className="text-[var(--error)] flex items-center gap-1">
                <AlertTriangle size={13} />
                <span>Unable to reach image URL. Please check that the URL is public and valid.</span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Image Preview */}
      {form.imageUrl && (
        <div>
          <div
            className="overflow-hidden"
            style={{
              maxWidth: '200px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-primary)',
              backgroundColor: 'var(--surface-tertiary)',
            }}
          >
            <img
              src={getOptimizedImageUrl(form.imageUrl, { width: 400, quality: 80 })}
              alt="Preview"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover"
              style={{ display: imageError ? 'none' : 'block' }}
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          </div>
          {imageError && (
            <p style={{ fontSize: '12px', color: 'var(--error)', marginTop: 'var(--space-xs)' }}>
              ⚠️ Unable to display image preview. Ensure the URL is public and served inline with proper image headers.
            </p>
          )}
        </div>
      )}

      <div>
        <label style={labelStyle}>Caption *</label>
        <textarea
          name="caption"
          value={form.caption}
          onChange={handleChange}
          style={{ ...fieldStyle, minHeight: '80px', resize: 'vertical' }}
          placeholder="Write a caption..."
          {...focusHandlers}
        />
      </div>

      <div className="grid grid-cols-3" style={{ gap: 'var(--space-md)' }}>
        <div>
          <label style={labelStyle}>Likes</label>
          <input
            name="likesCount"
            type="number"
            value={form.likesCount}
            onChange={handleChange}
            style={fieldStyle}
            min="0"
            {...focusHandlers}
          />
        </div>
        <div>
          <label style={labelStyle}>Comments</label>
          <input
            name="commentsCount"
            type="number"
            value={form.commentsCount}
            onChange={handleChange}
            style={fieldStyle}
            min="0"
            {...focusHandlers}
          />
        </div>
        <div>
          <label style={labelStyle}>Shares</label>
          <input
            name="sharesCount"
            type="number"
            value={form.sharesCount}
            onChange={handleChange}
            style={fieldStyle}
            min="0"
            {...focusHandlers}
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          style={fieldStyle}
          placeholder="e.g., New York City"
          {...focusHandlers}
        />
      </div>

      <div>
        <label style={{ ...labelStyle, marginBottom: 'var(--space-md)' }}>Aspect Ratio</label>
        <div className="flex" style={{ gap: 'var(--space-lg)' }}>
          {['1:1', '4:5'].map((ratio) => (
            <label
              key={ratio}
              className="flex items-center cursor-pointer"
              style={{ gap: 'var(--space-sm)' }}
            >
              <input
                type="radio"
                name="aspectRatio"
                value={ratio}
                checked={form.aspectRatio === ratio}
                onChange={handleChange}
                style={{ accentColor: 'var(--accent-primary)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                {ratio === '1:1' ? 'Square (1:1)' : 'Portrait (4:5)'}
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: '14px', color: 'var(--error)' }}>{error}</p>
      )}

      <div className="flex" style={{ gap: 'var(--space-md)', paddingTop: 'var(--space-sm)' }}>
        <button
          type="submit"
          disabled={loading}
          className="btn-gradient flex items-center"
          style={{
            gap: 'var(--space-sm)',
            padding: 'var(--space-sm) var(--space-lg)',
            borderRadius: 'var(--radius-md)',
            fontSize: '14px',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isEditing ? 'Update Post' : 'Create Post'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: 'var(--space-sm) var(--space-lg)',
              borderRadius: 'var(--radius-md)',
              fontSize: '14px',
              fontWeight: 600,
              backgroundColor: 'var(--surface-tertiary)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-primary)',
              transition: 'var(--transition-fast)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-secondary)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--surface-tertiary)'; }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
