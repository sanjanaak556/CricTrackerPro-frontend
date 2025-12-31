import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Real-Time Scoring',
      description: 'Track live cricket scores with instant updates as the game progresses.',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Live Match Updates',
      description: 'Get real-time commentary and match statistics for ongoing games.',
      icon: '🏏',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Advanced Analytics',
      description: 'Dive deep into player and team performance with detailed analytics.',
      icon: '📈',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Multi-Role Access',
      description: 'Different dashboards for admins, scorers, and viewers.',
      icon: '👥',
      color: 'from-orange-500 to-amber-500',
    },
    {
      title: 'Secure Authentication',
      description: 'OTP-based password reset and secure login system.',
      icon: '🔒',
      color: 'from-red-500 to-rose-500',
    },
    {
      title: 'Cloud Storage',
      description: 'Store match data and images securely in the cloud.',
      icon: '☁️',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 mb-4 rounded-full bg-blue-100 dark:bg-blue-900/30">
            <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400">
              Cricket Enthusiasts
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover comprehensive tools that make CricTrackerPro the ultimate cricket tracking platform.
            Everything you need in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                   style={{
                     background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                     backgroundImage: `linear-gradient(135deg, ${feature.color.replace('from-', '').replace('to-', '').split(' ')[0]}, ${feature.color.replace('from-', '').replace('to-', '').split(' ')[1]})`
                   }}
              />
              <div className="relative bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:-translate-y-2">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${feature.color} text-white text-2xl shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            All features available across all devices with seamless synchronization
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
              🚀 Lightning Fast
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
              📱 Mobile Optimized
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300">
              🔄 Auto Updates
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;