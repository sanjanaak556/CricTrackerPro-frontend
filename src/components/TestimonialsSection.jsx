import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TestimonialsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const navigate = useNavigate();

    const testimonials = [
        {
            id: 1,
            name: 'Rajesh Kumar',
            role: 'Club Captain',
            club: 'Mumbai Cricket Club',
            rating: 5,
            description: 'CricTrackerPro has revolutionized how we manage our matches. The live scoring feature is so intuitive that even our newest members can use it without training.',
            image: '/api/placeholder/100/100'
        },
        {
            id: 2,
            name: 'Priya Sharma',
            role: 'Tournament Organizer',
            club: 'Delhi Premier League',
            rating: 5,
            description: 'Managing multiple matches simultaneously used to be chaotic. Now with CricTrackerPro, we can track 10+ matches live with perfect accuracy. A game-changer!',
            image: '/api/placeholder/100/100'
        },
        {
            id: 3,
            name: 'Arjun Patel',
            role: 'Coach',
            club: 'Bangalore Cricket Academy',
            rating: 4,
            description: 'The player statistics and match reports help me analyze performance better than ever. My players love seeing their progress tracked so professionally.',
            image: '/api/placeholder/100/100'
        },
        {
            id: 4,
            name: 'Sneha Verma',
            role: 'Scorer',
            club: 'Chennai Super Kings Fan Club',
            rating: 5,
            description: "As a volunteer scorer, I appreciate how simple yet powerful this app is. The mobile interface is perfect for scoring on-the-go during local matches.",
            image: '/api/placeholder/100/100'
        },
        {
            id: 5,
            name: 'Vikram Singh',
            role: 'Association President',
            club: 'Punjab Cricket Association',
            rating: 5,
            description: 'We migrated our entire league to CricTrackerPro. The team management features alone have saved us hundreds of hours in administrative work.',
            image: '/api/placeholder/100/100'
        },
        {
            id: 6,
            name: 'Ananya Reddy',
            role: 'Player',
            club: 'Hyderabad Strikers',
            rating: 4,
            description: 'Being able to check my match stats instantly after a game is amazing. The app has made our local cricket feel so much more professional.',
            image: '/api/placeholder/100/100'
        }
    ];

    // For sliding cards, 3 cards at a time on desktop
    const visibleCards = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    const totalSlides = Math.ceil(testimonials.length / visibleCards);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    // Auto slide every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, currentSlide]);

    // Get visible testimonials for current slide
    const startIndex = currentSlide * visibleCards;
    const visibleTestimonials = testimonials.slice(startIndex, startIndex + visibleCards);

    return (
        <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-4">
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">TESTIMONIALS</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        Loved by Cricket
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
                            Communities Everywhere
                        </span>
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        See what clubs, players, and organizers are saying about CricTrackerPro
                    </p>
                </div>

                {/* Testimonial Cards - Sliding Version */}
                <div className="relative">
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    <button
                        onClick={nextSlide}
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 z-10 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-xl flex items-center justify-center hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                    >
                        <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>

                    {/* Cards Container */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${currentSlide * (100 / visibleCards)}%)` }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className={`px-4 flex-shrink-0`}
                                    style={{ width: `${100 / visibleCards}%` }}
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                                        {/* Ratings */}
                                        <div className="flex mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < testimonial.rating
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                                                        }`}
                                                />
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <p className="text-gray-600 dark:text-gray-300 italic text-lg mb-8 leading-relaxed">
                                            "{testimonial.description}"
                                        </p>

                                        {/* User Info */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
                                                {testimonial.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                                    {testimonial.name}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                                    {testimonial.role}
                                                </p>
                                                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                                    {testimonial.club}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Dots Navigation */}
                <div className="flex justify-center gap-2 mt-12">
                    {[...Array(totalSlides)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                goToSlide(index);
                                setIsAutoPlaying(false);
                            }}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-blue-600 dark:bg-blue-400 w-8'
                                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                                }`}
                        />
                    ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-20 pt-12 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            Trusted by 500+ Cricket Clubs
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            From local clubs to professional academies
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                        {['Premier Clubs', 'School Teams', 'College Tournaments', 'Local Leagues'].map((type, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                    {index === 0 ? '150+' : index === 1 ? '200+' : index === 2 ? '100+' : '50+'}
                                </div>
                                <div className="text-gray-700 dark:text-gray-300 font-medium">
                                    {type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 max-w-3xl mx-auto">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to join our cricket community?
                        </h3>
                        {/* <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start your free trial and experience the difference today
            </p> */}
                        <button
                            onClick={() => navigate("/register")}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 cursor-pointer">
                            Start Free
                        </button>
                        {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
              No credit card required • Cancel anytime
            </p> */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;