import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home, Mail, Globe, MessageCircle, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const ContactPage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission - in production, connect to a backend or service like Formspree
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setLoading(false);
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: isMobile ? '0.75rem 0.875rem 3rem' : '1rem 1rem 4rem',
  };

  const cardStyle: React.CSSProperties = {
    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.lg,
    padding: '2rem',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: theme.borderRadius.md,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    fontSize: '1rem',
    fontFamily: theme.typography.fontFamily,
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 500,
    color: theme.colors.text,
  };

  const contactInfoStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 0',
    borderBottom: `1px solid ${theme.colors.border}`,
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with the ShoverHub team. We'd love to hear from you about our blog, products, or any questions you have."
        url="/contact"
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 0.875rem' : '1rem',
      }}>
        <ol style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          listStyle: 'none',
          padding: 0,
          margin: 0,
          fontSize: '0.875rem',
          fontFamily: theme.typography.fontFamily,
        }}>
          <li><Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: theme.colors.textMuted }}><Home size={14} /> Home</Link></li>
          <li style={{ color: theme.colors.textMuted }}><ChevronRight size={14} /></li>
          <li style={{ color: theme.colors.text }}>Contact</li>
        </ol>
      </nav>

      <div style={containerStyle}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Get in Touch
          </h1>
          <p style={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '1.125rem',
            color: theme.colors.textSecondary,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
            Have a question or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Contact Info */}
          <div style={cardStyle}>
            <h2 style={{
              fontFamily: theme.typography.displayFont,
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '1rem',
              color: theme.colors.text,
            }}>
              Contact Information
            </h2>

            <div style={contactInfoStyle}>
              <Mail size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Email</p>
                <a href="mailto:contact@shoverhub.com" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  contact@shoverhub.com
                </a>
              </div>
            </div>

            <div style={contactInfoStyle}>
              <Globe size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Website</p>
                <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  shoverhub.com
                </a>
              </div>
            </div>

            <div style={{ ...contactInfoStyle, borderBottom: 'none' }}>
              <MessageCircle size={20} color={theme.colors.accent} />
              <div>
                <p style={{ fontWeight: 500, marginBottom: '0.25rem', color: theme.colors.text }}>Social Media</p>
                <a href="https://twitter.com/shoverhub" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent, textDecoration: 'none' }}>
                  @shoverhub
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div style={cardStyle}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <CheckCircle size={64} color={theme.colors.accent} style={{ marginBottom: '1rem' }} />
                <h2 style={{
                  fontFamily: theme.typography.displayFont,
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: theme.colors.text,
                }}>
                  Message Sent!
                </h2>
                <p style={{ color: theme.colors.textSecondary }}>
                  Thank you for reaching out. We'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="Your name"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={inputStyle}
                    placeholder="your@email.com"
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="blog">Blog Related</option>
                    <option value="feedback">Feedback</option>
                    <option value="collaboration">Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={labelStyle}>Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '0.875rem 1.5rem',
                    borderRadius: theme.borderRadius.md,
                    border: 'none',
                    backgroundColor: theme.colors.primary,
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s',
                  }}
                >
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
