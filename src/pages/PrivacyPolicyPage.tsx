import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import { SEO } from '../components/SEO';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const PrivacyPolicyPage = () => {
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
        title="Privacy Policy"
        description="Privacy Policy for ShoverHub Blog. Learn how we collect, use, and protect your personal information."
        url="/privacy-policy"
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
          <li style={{ color: theme.colors.text }}>Privacy Policy</li>
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
            Privacy Policy
          </h1>
          <p style={{ color: theme.colors.textMuted, fontSize: '0.875rem' }}>
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Introduction</h2>
          <p style={paragraphStyle}>
            ShoverHub ("we", "our", or "us") operates the blog.shoverhub.com website (the "Site"). 
            This page informs you of our policies regarding the collection, use, and disclosure of personal data 
            when you use our Site and the choices you have associated with that data.
          </p>
          <p style={paragraphStyle}>
            By using the Site, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Information We Collect</h2>
          <p style={paragraphStyle}>We collect several types of information for various purposes to provide and improve our service to you:</p>
          
          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Personal Data</h3>
          <p style={paragraphStyle}>While using our Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include:</p>
          <ul style={listStyle}>
            <li>Email address</li>
            <li>Name</li>
            <li>Cookies and usage data</li>
          </ul>

          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Usage Data</h3>
          <p style={paragraphStyle}>
            We may also collect information on how the Site is accessed and used ("Usage Data"). 
            This Usage Data may include information such as your computer's Internet Protocol address, 
            browser type, browser version, the pages of our Site that you visit, the time and date of your visit, 
            the time spent on those pages, unique device identifiers, and other diagnostic data.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Use of Data</h2>
          <p style={paragraphStyle}>We use the collected data for various purposes:</p>
          <ul style={listStyle}>
            <li>To provide and maintain our Site</li>
            <li>To notify you about changes to our Site</li>
            <li>To provide customer support</li>
            <li>To gather analysis and usage data so we can improve our Site</li>
            <li>To monitor the usage of our Site</li>
            <li>To detect, prevent, and address technical issues</li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Cookies</h2>
          <p style={paragraphStyle}>
            We use cookies and similar tracking technologies to track the activity on our Site and hold certain information.
          </p>
          <p style={paragraphStyle}>
            Cookies are files with small amount of data which may include an anonymous unique identifier. 
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Third-Party Services</h2>
          <p style={paragraphStyle}>
            We may employ third-party companies and individuals to facilitate our Site, provide services on our behalf, 
            perform Site-related services, or assist us in analyzing how our Site is used.
          </p>
          <p style={paragraphStyle}>These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          
          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Google Analytics</h3>
          <p style={paragraphStyle}>
            We use Google Analytics to monitor and analyze the use of our Site. Google Analytics is a web analytics service 
            offered by Google that tracks and reports website traffic.
          </p>

          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Google AdSense</h3>
          <p style={paragraphStyle}>
            We use Google AdSense to display advertisements on our Site. Google AdSense uses cookies to serve ads 
            based on your prior visits to our Site and other websites.
          </p>
          <p style={paragraphStyle}>
            Google AdSense uses the DoubleClick DART cookie to serve ads based on your visit to our Site and other websites. 
            You may opt out of the use of the DART cookie by visiting the Google AdSense settings page:{' '}
            <a href="https://adssettings.google.com/authenticated" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>
              https://adssettings.google.com/authenticated
            </a>
          </p>
          <p style={paragraphStyle}>
            For more information about Google's privacy practices, please visit:{' '}
            <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>
              https://policies.google.com/technologies/ads
            </a>
          </p>

          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Third-Party Advertising Partners</h3>
          <p style={paragraphStyle}>
            We work with third-party advertising networks that use cookies, web beacons, and other tracking technologies 
            to collect information about your activity on our Site to provide targeted advertisements based on your interests.
          </p>
          <p style={paragraphStyle}>
            These third-party ad servers or ad networks use technology to send, directly to your browser, the advertisements 
            and links that appear on our Site. They automatically receive your IP address when this occurs. They may also 
            use other technologies (such as cookies, JavaScript, or Web Beacons) to measure the effectiveness of their 
            advertisements and to personalize advertising content.
          </p>
          <p style={paragraphStyle}>
            We do not have access to or control over cookies or other features that they may use. Their practices are not 
            covered by this Privacy Policy.
          </p>

          <h3 style={{ ...headingStyle, fontSize: isMobile ? '1.125rem' : '1.25rem' }}>Managing Your Advertising Preferences</h3>
          <p style={paragraphStyle}>
            You can opt out of targeted advertising from participating companies through industry-wide opt-out tools:
          </p>
          <ul style={listStyle}>
            <li>Network Advertising Initiative (NAI): <a href="https://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>https://www.networkadvertising.org/choices/</a></li>
            <li>Digital Advertising Alliance (DAA): <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>https://optout.aboutads.info/</a></li>
            <li>Your Online Choices (EU): <a href="https://www.youronlinechoices.com/uk/your-ad-choices" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>https://www.youronlinechoices.com/uk/your-ad-choices</a></li>
          </ul>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Security of Data</h2>
          <p style={paragraphStyle}>
            The security of your data is important to us. We strive to use commercially acceptable means to protect your Personal Data, 
            but no method of transmission over the Internet or electronic storage is 100% secure.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Links to Other Sites</h2>
          <p style={paragraphStyle}>
            Our Site may contain links to other sites that are not operated by us. If you click on a third-party link, 
            you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>
          <p style={paragraphStyle}>
            We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Changes to This Privacy Policy</h2>
          <p style={paragraphStyle}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p style={paragraphStyle}>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={paragraphStyle}>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul style={listStyle}>
            <li>By email: contact@shoverhub.com</li>
            <li>By visiting our main website: <a href="https://shoverhub.com" target="_blank" rel="noopener noreferrer" style={{ color: theme.colors.accent }}>shoverhub.com</a></li>
          </ul>
        </section>
      </article>
    </>
  );
};
