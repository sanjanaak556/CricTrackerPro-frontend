import React from 'react';
import aboutImage from "../assets/cric.jpg";
import { useNavigate } from 'react-router-dom';

const AboutSection = () => {
    const navigate = useNavigate();

    return (
        <section id="about" className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Column - Image */}
                    <div className="relative">
                        {/* Main Image */}
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src={aboutImage}
                                alt="Cricket Team Using CricTrackerPro"
                                className="w-full h-[500px] object-cover"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.innerHTML = `
                    <div class="w-full h-[500px] bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center rounded-3xl">
                      <div class="text-center p-8">
                        <div class="text-6xl mb-4">🏏</div>
                        <h3 class="text-2xl font-bold text-white mb-2">Our Cricket Family</h3>
                        <p class="text-blue-100">Add your team photo here</p>
                      </div>
                    </div>
                  `;
                                }}
                            />

                            {/* Floating Stats Card */}
                            <div className="absolute bottom-8 left-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl max-w-xs">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                        <span className="text-2xl text-white">🎯</span>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Clubs</div>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    United by the love of cricket & technology
                                </p>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-3xl -z-10"></div>
                        <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl -z-10"></div>
                    </div>

                    {/* Right Column - Content */}
                    <div className="lg:pl-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">OUR STORY</span>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            The Idea Behind
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                                CricTrackerPro
                            </span>
                        </h2>

                        <div className="space-y-6">
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                It all started in 2020 when our founder, a local club scorer, struggled with
                                manual scorebooks during a tense final over. The frustration of outdated
                                methods sparked a simple question:
                                <span className="font-semibold text-gray-900 dark:text-white"> "Why isn't there a better way?"</span>
                            </p>

                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                We realized that while professional cricket had advanced technology,
                                <span className="font-semibold text-gray-900 dark:text-white"> grassroots cricket was still stuck with pen and paper</span>.
                                Local clubs, schools, and amateur tournaments deserved professional-grade
                                tools without the complexity or cost.
                            </p>

                            <div className="bg-blue-50 dark:bg-gray-800/50 rounded-2xl p-6 my-8 border-l-4 border-blue-500">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 text-2xl">💡</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Our Mission</h4>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            To democratize cricket technology—making professional scoring and
                                            analytics accessible to every club, school, and cricket enthusiast.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                Today, CricTrackerPro bridges the gap between amateur passion and
                                professional precision. We've helped thousands of cricket communities
                                track matches, analyze performance, and grow their love for the game.
                            </p>
                        </div>

                        {/* Key Values */}
                        <div className="mt-12 grid sm:grid-cols-2 gap-6">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">🤝</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Community First</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Built with feedback from actual clubs and scorers
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4">
                                    <span className="text-2xl text-white">⚡</span>
                                </div>
                                <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">Simplicity</h4>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Powerful features without the complexity
                                </p>
                            </div>
                        </div>

                        {/* Founder Quote */}
                        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <span className="text-2xl text-white font-bold">S</span>
                                </div>
                                <div>
                                    <p className="text-lg italic text-gray-700 dark:text-gray-300 mb-2">
                                        "Cricket isn't just a sport—it's a community. Our goal is to strengthen
                                        that community through technology."
                                    </p>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">Sanjana Mahesh</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Founder & Club Scorer</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline Section */}
                <div className="mt-24 pt-16 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                        Our Journey
                    </h3>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            {
                                year: '2020',
                                title: 'The Spark',
                                description: 'First prototype built during local tournament frustrations'
                            },
                            {
                                year: '2021',
                                title: 'First Users',
                                description: '50+ local clubs adopted our scoring system'
                            },
                            {
                                year: '2022',
                                title: 'Growing Family',
                                description: 'Expanded to schools and college tournaments'
                            },
                            {
                                year: 'Today',
                                title: 'National Reach',
                                description: 'Serving cricket communities across the country'
                            }
                        ].map((milestone, index) => (
                            <div key={index} className="relative">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-xl font-bold mb-4">
                                        {milestone.year}
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                                        {milestone.title}
                                    </h4>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {milestone.description}
                                    </p>
                                </div>
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 translate-x-1/2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 max-w-4xl mx-auto">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Join Our Cricket Revolution
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                            Be part of the community that's changing how grassroots cricket is managed
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <button
                                onClick={() => navigate("/register")}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer">
                                Start Free
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;