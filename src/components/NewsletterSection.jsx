import React, { useState } from 'react';
import { Send, Mail, Bell, CheckCircle, Download, X, MessageSquare, User, Phone } from 'lucide-react';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'Feedback',
        message: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !email.includes('@')) return;

        setLoading(true);

        setTimeout(() => {
            const subscribers = JSON.parse(localStorage.getItem('cricketSubscribers') || '[]');
            const newSubscriber = {
                email,
                subscribedAt: new Date().toISOString(),
                id: Date.now()
            };
            subscribers.push(newSubscriber);
            localStorage.setItem('cricketSubscribers', JSON.stringify(subscribers));

            alert(`🎉 Welcome to Cricket Circle!\n\nA welcome message has been sent to: ${email}\n\n`);

            setSubscribed(true);
            setLoading(false);
            setEmail('');

            setTimeout(() => setSubscribed(false), 5000);
        }, 1500);
    };

    // Modal handlers
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setFeedbackSubmitted(false);
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: 'Feedback',
            message: ''
        });
    };

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        setFeedbackLoading(true);

        // Simulate API call
        setTimeout(() => {
            // Store feedback in localStorage
            const feedbacks = JSON.parse(localStorage.getItem('cricketFeedbacks') || '[]');
            const newFeedback = {
                ...formData,
                id: Date.now(),
                submittedAt: new Date().toISOString()
            };
            feedbacks.push(newFeedback);
            localStorage.setItem('cricketFeedbacks', JSON.stringify(feedbacks));

            setFeedbackSubmitted(true);
            setFeedbackLoading(false);
            
            // Reset form after 3 seconds
            setTimeout(() => {
                setFeedbackSubmitted(false);
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'Feedback',
                    message: ''
                });
                closeModal();
            }, 3000);
        }, 1500);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDemoUnsubscribe = () => {
        const userEmail = prompt('Enter the email you want to unsubscribe:');
        if (userEmail) {
            const subscribers = JSON.parse(localStorage.getItem('cricketSubscribers') || '[]');
            const updatedSubscribers = subscribers.filter(sub => sub.email !== userEmail);
            localStorage.setItem('cricketSubscribers', JSON.stringify(updatedSubscribers));
            alert(`✅ ${userEmail} has been unsubscribed (demo mode).`);
        }
    };

    const downloadSubscribers = () => {
        const subscribers = JSON.parse(localStorage.getItem('cricketSubscribers') || '[]');
        const dataStr = JSON.stringify(subscribers, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cricket-subscribers.json';
        link.click();
    };

    // Modal Component
    const ContactModal = () => {
        if (!isModalOpen) return null;

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>

                    <div className="p-6">
                        {feedbackSubmitted ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    Thank You! 🎉
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Your feedback has been received. We'll get back to you soon!
                                </p>
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 mb-4">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        Get In Touch
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                                        Send us your feedback, questions, or suggestions
                                    </p>
                                </div>

                                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Email Address *
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Phone Number (Optional)
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Subject
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white"
                                        >
                                            <option value="Feedback">General Feedback</option>
                                            <option value="Feature Request">Feature Request</option>
                                            <option value="Bug Report">Bug Report</option>
                                            <option value="Partnership">Partnership Inquiry</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Your Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows="4"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900 dark:text-white resize-none"
                                            placeholder="Tell us what's on your mind..."
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={feedbackLoading}
                                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {feedbackLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Send Message
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-3">
                                            We typically respond within 24 hours
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <ContactModal />
            
            <section id="contact" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                                <Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    STAY UPDATED
                                </span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                Join Our
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                                    Cricket Circle
                                </span>
                            </h2>

                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Get cricket updates, match alerts, and exclusive content. No spam, just cricket love!
                            </p>
                        </div>

                        {/* Newsletter Form */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100 dark:border-gray-700">
                            {subscribed ? (
                                <div className="text-center py-10">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                        Welcome to Cricket Circle! 🎉
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                                        You'll now receive cricket updates and match alerts.
                                    </p>
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setSubscribed(false)}
                                            className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                        >
                                            Subscribe Another Email
                                        </button>
                                        <button
                                            onClick={handleDemoUnsubscribe}
                                            className="block mx-auto text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
                                        >
                                            Try Unsubscribe Feature
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                            <Mail className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                Get Cricket Updates
                                            </h3>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Your Email Address
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@example.com"
                                                className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                                                required
                                            />
                                        </div>

                                        {/* What you get */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5">
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-3">What you'll get:</h4>
                                            <div className="space-y-2">
                                                {[
                                                    { icon: '🏏', text: 'Live match score alerts' },
                                                    { icon: '📊', text: 'Player performance updates' },
                                                    { icon: '🎯', text: 'Cricket tips & strategies' },
                                                    { icon: '⭐', text: 'Exclusive content access' }
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <span className="text-lg">{item.icon}</span>
                                                        <span className="text-gray-700 dark:text-gray-300 text-sm">{item.text}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading || !email.includes('@')}
                                                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3"
                                            >
                                                {loading ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                        Subscribing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-5 h-5" />
                                                        Join Cricket Circle
                                                    </>
                                                )}
                                            </button>

                                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                                Unsubscribe anytime. We respect your privacy.
                                            </p>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Demo Info & Unsubscribe Section */}
                        <div className="mt-10 text-center">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 max-w-2xl mx-auto">
                                <h4 className="font-bold text-gray-900 dark:text-white mb-3">
                                    How This Works
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">📧</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            1. Enter email
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🎯</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            2. See welcome alert
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl mb-2">🗑️</div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            3. Try unsubscribe
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center">
                                    <button
                                        onClick={handleDemoUnsubscribe}
                                        className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                                    >
                                        Try Unsubscribe Feature
                                    </button>
                                    <button
                                        onClick={downloadSubscribers}
                                        className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors cursor-pointer flex items-center gap-2"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Subscribers (JSON)
                                    </button>
                                </div>
                            </div>

                            {/* Alternative Contact */}
                            <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700 text-center">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    Want to Share Feedback?
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
                                    Have suggestions, bug reports, or want to partner with us?
                                </p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <button 
                                        onClick={openModal}
                                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer flex items-center gap-2"
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        Contact & Feedback Form
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                                    We value your input to make CricTrackerPro better!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default NewsletterSection;