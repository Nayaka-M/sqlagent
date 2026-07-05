import { useState } from 'react';
import { Mail, Send, CheckCircle, User, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

export default function Contact() {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/contact`,
        {
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'New Contact Message',
          message: formData.message
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success('✅ Message sent! We\'ll get back to you soon.');
        setSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        setTimeout(() => setSent(false), 5000);
      } else {
        toast.error('❌ Failed to send message. Please try again.');
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.detail || '❌ Failed to send message');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text">Contact Us</h2>
        <p className="text-gray-400 mt-2">We'll get back to you within 24 hours</p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <User className="w-4 h-4 text-[#6C63FF]" />
          <p className="text-xs text-gray-500">We'll respond to: <span className="text-[#6C63FF] font-medium">{formData.email || 'your email'}</span></p>
        </div>
      </div>

      {sent ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white">Message Sent Successfully! 🎉</h3>
          <p className="text-gray-400 mt-2">We'll get back to you soon via email.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
              <Mail className="w-6 h-6 text-[#6C63FF] mb-3" />
              <h3 className="text-white font-semibold">Email</h3>
              <p className="text-gray-400 text-sm">support@sqlagent.com</p>
              <p className="text-gray-400 text-sm">We'll respond to your email</p>
            </div>
            <div className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700">
              <MessageCircle className="w-6 h-6 text-[#FF6584] mb-3" />
              <h3 className="text-white font-semibold">Response Time</h3>
              <p className="text-gray-400 text-sm">We aim to respond within 24 hours</p>
              <p className="text-gray-400 text-sm">Support hours: 9AM - 9PM UTC</p>
            </div>
            <div className="bg-[#6C63FF]/10 rounded-xl p-6 border border-[#6C63FF]/20">
              <p className="text-sm text-gray-300">
                💡 <span className="text-white font-medium">Tip:</span> Check your spam folder if you don't receive a response within 24 hours.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#1a1a2e] rounded-xl p-6 border border-gray-700 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="How can we help?"
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Message *</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue or question..."
                rows={4}
                className="w-full px-4 py-3 bg-[#0F0E17] border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#6C63FF] resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#6C63FF] to-[#FF6584] hover:opacity-90 disabled:opacity-50 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center">
              We'll respond to: <span className="text-[#6C63FF]">{formData.email || 'your email'}</span>
            </p>
          </form>
        </div>
      )}
    </div>
  );
}