import Lottie from "lottie-react";
import ballAnimation from "../assets/lottie/Cricket bowled out.json";
import banner from "../assets/banner.jpg";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section id="home" className="w-full">
            {/* Banner Section */}
            <div
                className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center"
                style={{ backgroundImage: `url(${banner})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/50"></div>

                {/* Text Content */}
                <div className="relative text-center text-white px-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-xl">
                        Track Cricket Like Never Before
                    </h1>

                    <p className="text-lg md:text-xl mt-4 max-w-2xl mx-auto opacity-90">
                        Real-time scoring, live match updates & advanced analytics.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-6 mt-8 justify-center">
                        <button
                            onClick={() => navigate("/register")}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg cursor-pointer"
                        >
                            Start Scoring
                        </button>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("live-matches")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="px-8 py-3 border border-white text-white rounded-lg text-lg hover:bg-white hover:text-black transition shadow-lg cursor-pointer"
                        >
                            Watch Live Matches
                        </button>

                    </div>
                </div>
            </div>

            {/* Enhanced Lottie Animation Section */}
            <div className="py-16 bg-gray-50 dark:bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            How CricTrackerPro Works
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Simple, accurate cricket scoring made accessible for everyone
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side - Animation */}
                        <div className="relative">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                                <div className="w-full max-w-md mx-auto">
                                    <Lottie
                                        animationData={ballAnimation}
                                        loop={true}
                                    />
                                </div>

                                {/* Simple Scoring Demo */}
                                <div className="mt-8 bg-blue-50 dark:bg-gray-700 rounded-xl p-6">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-3">
                                        Live Scoring Example
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Current Over</div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">15.3</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">125/3</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">RR</div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">8.12</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Features */}
                        <div>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📊</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            Easy Score Entry
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Tap to record runs, wickets, extras. Our intuitive interface makes scoring simple for volunteers and enthusiasts.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">📱</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            Live Updates
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Share live scores with fans, players, and coaches. Updates appear instantly on the app.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">🏆</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            Match Reports
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Auto-generated scorecards, batting/bowling stats, and match summaries after every game.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                                        <span className="text-2xl">👥</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                            Team Management
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Manage squads, player profiles, and match schedules all in one place.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Catchy CTA */}
                            <div className="mt-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-center">
                                <h3 className="text-2xl font-bold text-white mb-3">
                                    Ready to Transform Your Cricket Scoring?
                                </h3>
                                <p className="text-blue-100 mb-6">
                                    Join hundreds of clubs already using CricTrackerPro
                                </p>
                                <button
                                    onClick={() => navigate("/register")}
                                    className="px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg cursor-pointer">
                                    Get Started Free
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Simple Stats */}
                    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                                <div className="text-gray-600 dark:text-gray-400">Clubs Registered</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-green-600 dark:text-green-400">10,000+</div>
                                <div className="text-gray-600 dark:text-gray-400">Matches Scored</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">99%</div>
                                <div className="text-gray-600 dark:text-gray-400">Accuracy Rate</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
                                <div className="text-gray-600 dark:text-gray-400">Support Available</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}