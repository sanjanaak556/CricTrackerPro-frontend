import React from 'react';

const FeaturesSection = () => {
  const features = [
    {
      title: 'Real-Time Scoring',
      description: 'Track live cricket scores with instant updates as the game progresses.',
      icon: '📊',
    },
    {
      title: 'Live Match Updates',
      description: 'Get real-time commentary and match statistics for ongoing games.',
      icon: '🏏',
    },
    {
      title: 'Advanced Analytics',
      description: 'Dive deep into player and team performance with detailed analytics.',
      icon: '📈',
    },
    {
      title: 'Multi-Role Access',
      description: 'Different dashboards for admins, scorers, and viewers.',
      icon: '👥',
    },
    {
      title: 'Secure Authentication',
      description: 'OTP-based password reset and secure login system.',
      icon: '🔒',
    },
    {
      title: 'Cloud Storage',
      description: 'Store match data and images securely in the cloud.',
      icon: '☁️',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Powerful Features for Cricket Enthusiasts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the tools that make CricTrackerPro the ultimate cricket tracking platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
