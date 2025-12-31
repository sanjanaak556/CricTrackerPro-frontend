import React, { useState } from 'react';
import { GiCricketBat } from "react-icons/gi";
import { AiFillHome } from "react-icons/ai";
import {
  FaUsers,
  FaAward,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaGithub
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [footerEmail, setFooterEmail] = useState('');
  const [footerLoading, setFooterLoading] = useState(false);

  const handleFooterSubscribe = (e) => {
    e.preventDefault();
    if (!footerEmail || !footerEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    setFooterLoading(true);
    
    // Simulate sending welcome email
    setTimeout(() => {
      // Store in localStorage
      const subscribers = JSON.parse(localStorage.getItem('cricketSubscribers') || '[]');
      const newSubscriber = {
        email: footerEmail,
        subscribedAt: new Date().toISOString(),
        id: Date.now(),
        source: 'footer'
      };
      subscribers.push(newSubscriber);
      localStorage.setItem('cricketSubscribers', JSON.stringify(subscribers));

      // Show welcome alert
      alert(`🎉 Welcome to Cricket Circle!\n\nA welcome message has been sent to: ${footerEmail}\n\nThank you for subscribing!`);
      
      setFooterEmail('');
      setFooterLoading(false);
    }, 1000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <GiCricketBat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">CricTrackerPro</h2>
                <p className="text-sm text-gray-400">Cricket Scoring Redefined</p>
              </div>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Professional cricket scoring made simple. Track matches, analyze performance,
              and connect with cricket communities worldwide.
            </p>

            <div className="flex gap-4">
              {[
                {
                  icon: FaFacebookF,
                  label: "Facebook",
                  url: "https://www.facebook.com",
                  color: "hover:text-blue-400",
                },
                {
                  icon: FaTwitter,
                  label: "Twitter",
                  url: "https://twitter.com",
                  color: "hover:text-cyan-400",
                },
                {
                  icon: FaInstagram,
                  label: "Instagram",
                  url: "https://www.instagram.com",
                  color: "hover:text-pink-400",
                },
                {
                  icon: FaYoutube,
                  label: "YouTube",
                  url: "https://www.youtube.com",
                  color: "hover:text-red-400",
                },
                {
                  icon: FaGithub,
                  label: "GitHub",
                  url: "https://github.com/sanjanaak556",
                  color: "hover:text-gray-300",
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center transition-colors ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 pb-2 border-b border-gray-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { icon: AiFillHome, text: 'Home', id: 'home' },
                { icon: FaAward, text: 'Features', id: 'features' },
                { icon: FaUsers, text: 'Testimonials', id: 'testimonials' },
                { icon: GiCricketBat, text: 'About Us', id: 'about' },
                { icon: MdEmail, text: 'Contact', id: 'contact' }
              ].map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group w-full text-left"
                  >
                    <link.icon className="w-4 h-4 group-hover:text-cyan-400" />
                    <span>{link.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 pb-2 border-b border-gray-800">
              Features
            </h3>
            <ul className="space-y-3">
              {[
                'Real-Time Scoring',
                'Live Match Updates',
                'Player Analytics',
                'Team Management',
                'Match Scheduling',
                'Performance Reports'
              ].map((feature, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group w-full text-left"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>{feature}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-bold mb-6 pb-2 border-b border-gray-800">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MdEmail className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Email</p>
                  <p className="text-gray-400">support@crictrackerpro.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaPhoneAlt className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Phone</p>
                  <p className="text-gray-400">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-white">Location</p>
                  <p className="text-gray-400">123 Cricket Lane, Sports City</p>
                </div>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <p className="text-white font-medium mb-3">Stay Updated</p>
              <form onSubmit={handleFooterSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  required
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white placeholder-gray-500"
                />
                <button 
                  type="submit"
                  disabled={footerLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-r-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                >
                  {footerLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                Get cricket updates & match alerts
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6">
              {[
                { text: '🔒 SSL Secure', color: 'text-green-400' },
                { text: '⚡ Fast Performance', color: 'text-yellow-400' },
                { text: '📱 Mobile Friendly', color: 'text-blue-400' }
              ].map((badge, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`text-lg ${badge.color}`}>{badge.text.split(' ')[0]}</span>
                  <span className="text-sm text-gray-400">{badge.text.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>

            {/* Download App */}
            <div className="flex flex-wrap gap-4 justify-center md:justify-end">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">Download on the</div>
                  <div className="text-white font-medium">App Store</div>
                </div>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35l13 8.5c.67.44.67 1.54 0 1.98l-13 8.5c-.5.26-1.14.04-1.45-.45-.15-.24-.23-.52-.23-.8z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs text-gray-400">GET IT ON</div>
                  <div className="text-white font-medium">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-gray-800">
          <div className="text-center md:text-left">
            <p className="text-gray-400">
              © {currentYear} CricTrackerPro. All rights reserved.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Crafted with ❤️ for cricket lovers worldwide
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Disclaimer
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
              Sitemap
            </a>
          </div>
        </div>

        {/* Back to Top */}
        <div className="mt-8 text-center">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Back to Top
          </button>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            🎓 This is a student project for demonstration purposes. All data shown is fictional.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Built with MERN | View source on{' '}
            <a
              href="https://github.com/sanjanaak556"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;