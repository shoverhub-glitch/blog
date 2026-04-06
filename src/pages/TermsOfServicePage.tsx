import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const TermsOfServicePage = () => {
  const { theme } = useTheme();
  const isMobile = useMediaQuery('(max-width: 640px)');

  const sectionStyle: React.CSSProperties = {
    marginBottom: '2rem',
  };

  const headingStyle: React.CSSProperties = {
    fontFamily: theme.typography.displayFont,
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    fontWeight: 700,
    color: theme.colors.text,
    marginBottom: '1rem',
  };

  const paragraphStyle: React.CSSProperties = {
    fontFamily: theme.typography.fontFamily,
    fontSize: '1rem',
    lineHeight: 1.7,
    color: theme.colors.textSecondary,
    marginBottom: '1rem',
  };

  const listStyle: React.CSSProperties = {
    ...paragraphStyle,
    paddingLeft: '1.5rem',
  };

  return (
    <>
      <SEO
        title="Terms of Service"
        description="Terms of Service for ShoverHub Blog. Read our terms and conditions governing the use of our website and services."
        url="/terms-of-service"
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
          <li style={{ color: theme.colors.text }}>Terms of Service</li>
        </ol>
      </nav>

      <article style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '0.75rem 0.875rem 3rem' : '1rem 1rem 4rem',
        fontFamily: theme.typography.fontFamily,
      }}>
        <header style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: theme.typography.displayFont,
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}>
            Terms of Service
          </h1>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.875rem' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Agreement to Terms</h2>
          <p style={paragraphStyle}>
            These Terms of Service ("Terms") govern your use of the ShoverHub website and services (collectively, "Site") 
            operated by ShoverHub ("us", "we", or "our"). By accessing or using the Site, you agree to be bound by these Terms.
          </p>
          <p style={paragraphStyle}>
            If you do not agree to these Terms, please do not use the Site.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Use of the Site</h2>
          <p style={paragraphStyle}>You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul style={listStyle}>
            <li>Use the Site in any way that violates applicable laws or regulations</li>
            <li>Attempt to gain unauthorized access to any part of the Site</li>
            <li>Use the Site to transmit any viruses, malware, or other malicious code</li>
            <li>Collect or harvest any information from the Site without permission</li>
            <li>Interfere with the Site's security features or proper operation</li>
            <li>Use the Site to spam, harass, or harm others</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Intellectual Property</h2>
          <p style={paragraphStyle}>
            The Site and its original content, features, and functionality are owned by ShoverHub and are protected by 
            international copyright, trademark, and other intellectual property laws.
          </p>
          <p style={paragraphStyle}>
            You may not reproduce, distribute, modify, or create derivative works from the content on this Site without 
            our prior written permission.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>User Content</h2>
          <p style={paragraphStyle}>
            The Site may allow you to post, link, store, share, or otherwise make available certain content, including 
            comments and feedback. You are responsible for the content you provide and its legality.
          </p>
          <p style={paragraphStyle}>
            By posting content on the Site, you grant us the right to use, modify, and distribute such content in 
            connection with providing our services.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Third-Party Links</h2>
          <p style={paragraphStyle}>
            The Site may contain links to third-party websites or services that are not owned or controlled by ShoverHub.
          </p>
          <p style={paragraphStyle}>
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any 
            third-party websites or services. You acknowledge and agree that we shall not be responsible for any damages 
            or losses caused by your use of such third-party services.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Advertising</h2>
          <p style={paragraphStyle}>
            The Site displays third-party advertisements, including Google AdSense. The appearance of advertising does not 
            constitute an endorsement of the advertisers or their products by ShoverHub.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Disclaimer</h2>
          <p style={paragraphStyle}>
            The Site is provided on an "AS IS" and "AS AVAILABLE" basis. We make no representations or warranties of any 
            kind, express or implied, as to the operation of the Site or the information, content, or materials included 
            on the Site.
          </p>
          <p style={paragraphStyle}>
            We do not warrant that the Site will be uninterrupted, secure, or error-free. You expressly agree that your 
            use of the Site is at your sole risk.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Limitation of Liability</h2>
          <p style={paragraphStyle}>
            In no event shall ShoverHub, its directors, employees, partners, agents, suppliers, or affiliates be liable 
            for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss 
            of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or 
            inability to access or use the Site.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Changes to Terms</h2>
          <p style={paragraphStyle}>
            We reserve the right to modify or replace these Terms at any time. We will provide notice of any significant 
            changes by posting the updated Terms on this page with a new "Last updated" date.
          </p>
          <p style={paragraphStyle}>
            Your continued use of the Site after any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Governing Law</h2>
          <p style={paragraphStyle}>
            These Terms shall be governed by and construed in accordance with the laws applicable to our services, 
            without regard to its conflict of law provisions.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={paragraphStyle}>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul style={listStyle}>
            <li>By email: contact@shoverhub.com</li>
            <li>By visiting our contact page: <Link to="/contact" style={{ color: theme.colors.accent }}>Contact Us</Link></li>
            <li>By visiting our main website: <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>shoverhub.com</a></li>
          </ul>
        </section>
      </article>
    </>
  );
};
