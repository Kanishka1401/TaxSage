import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

// Icon Components
const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SavingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SecurityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DocumentIcon />,
      title: 'Easy Tax Filing',
      description: 'File your income tax returns in minutes with our guided process'
    },
    {
      icon: <CheckIcon />,
      title: 'CA Verified',
      description: 'All filings are reviewed and verified by certified Chartered Accountants'
    },
    {
      icon: <SavingsIcon />,
      title: 'Maximize Savings',
      description: 'Discover deductions and save more on your taxes'
    },
    {
      icon: <SecurityIcon />,
      title: 'Bank-Grade Security',
      description: 'Your financial data is protected with enterprise-level security'
    }
  ];

  const stats = [
    { number: '50,000+', label: 'Happy Users' },
    { number: '₹250Cr+', label: 'Tax Saved' },
    { number: '99.8%', label: 'Success Rate' },
    { number: '24/7', label: 'Expert Support' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src={logo} alt="TaxSage Logo" className="h-10 w-10 mr-3" />
              <span className="text-xl font-semibold text-[#293241]">TaxSage</span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-[#3d5a80] hover:text-[#293241] font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-[#3d5a80] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-white">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#293241] mb-6">
                Tax Filing Made{' '}
                <span className="text-[#3d5a80]">Simple & Secure</span>
              </h1>
              <p className="text-lg text-[#3d5a80] mb-8">
                File your income tax returns with expert CA guidance. Maximize your savings 
                with AI-powered deductions and bank-grade security.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-[#3d5a80]">{stat.number}</div>
                    <div className="text-sm text-[#98c1d9]">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-[#3d5a80] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors"
                >
                  Start Filing Now
                </button>
                <button className="border border-[#3d5a80] text-[#3d5a80] px-8 py-3 rounded-lg font-medium hover:bg-[#e0fbfc] transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-full max-w-md aspect-square bg-gradient-to-br from-[#3d5a80] to-[#98c1d9] rounded-2xl shadow-2xl flex items-center justify-center">
                  <img 
                    src={logo} 
                    alt="TaxSage Hero" 
                    className="w-64 h-64 object-contain opacity-90"
                  />
                </div>
                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 border border-[#98c1d9]">
                  <div className="text-2xl font-bold text-[#3d5a80]">99.8%</div>
                  <div className="text-xs text-[#98c1d9]">Success Rate</div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-[#98c1d9]">
                  <div className="text-2xl font-bold text-[#3d5a80]">50K+</div>
                  <div className="text-xs text-[#98c1d9]">Users</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#e0fbfc] py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#293241] mb-4">
              Why Choose TaxSage?
            </h2>
            <p className="text-lg text-[#3d5a80]">
              Everything you need for stress-free tax filing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#3d5a80] rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-[#293241] mb-2">{feature.title}</h3>
                <p className="text-[#3d5a80] text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#293241] mb-4">
              How TaxSage Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Documents', desc: 'Upload Form-16 and investment proofs' },
              { step: '02', title: 'Auto Data Extraction', desc: 'AI extracts data automatically' },
              { step: '03', title: 'CA Review', desc: 'Expert CA verifies your filing' },
              { step: '04', title: 'File & Track', desc: 'Submit ITR and track status' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#3d5a80] rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-semibold text-[#293241] mb-2">{item.title}</h3>
                <p className="text-[#3d5a80] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#3d5a80] text-white py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Simplify Your Tax Filing?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join 50,000+ users who trust TaxSage for their tax needs
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="bg-white text-[#3d5a80] px-8 py-3 rounded-lg font-medium hover:bg-[#e0fbfc] transition-colors"
          >
            Get Started Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#293241] text-white py-8">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="TaxSage Logo" className="h-8 w-8 mr-3" />
            <span className="text-xl font-semibold">TaxSage</span>
          </div>
          <p className="text-[#98c1d9] text-sm">
            © 2024 TaxSage. All rights reserved. | Secure • Reliable • Trusted
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;