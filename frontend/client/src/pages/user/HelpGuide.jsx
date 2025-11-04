import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import geminiService from '../../services/geminiService.js';

// Icon Components (same as dashboard)
const HelpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CalculatorIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const SavingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);



const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ToolsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LightBulbIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const HelpGuide = () => {
  const navigate = useNavigate();
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [contactMethod, setContactMethod] = useState('');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);

  useEffect(() => {
    setApiKeyConfigured(true);
  }, []);

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: <RocketIcon />,
      questions: [
        {
          question: 'How to create your first tax filing?',
          answer: 'To create your first tax filing, click on "Start New Filing" from your dashboard. Follow the step-by-step process to enter your personal information, income details, deductions, and review your filing before submission. You can save your progress at any step and return later.'
        },
        {
          question: 'What documents do I need?',
          answer: 'You will need Form-16 from your employer, bank statements, investment proofs (PPF, ELSS, insurance premiums), home loan interest certificate, and any other income-related documents. For salaried employees, Form-16 is the most important document.'
        },
        {
          question: 'Understanding the tax filing process',
          answer: 'The tax filing process involves 6 steps: 1) Upload Form-16, 2) Personal Information, 3) Income Details, 4) Deductions, 5) Tax Calculation, 6) Review & Submit. You can navigate between steps and your data is auto-saved.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use bank-level encryption and comply with all data protection regulations. Your financial data is never shared with third parties without your consent.'
        }
      ]
    },
    {
      title: 'Form-16 & Documents',
      icon: <DocumentIcon />,
      questions: [
        {
          question: 'How to upload Form-16?',
          answer: 'Go to the tax filing page and click "Upload Form-16" in step 1. You can drag & drop your Form-16 PDF or click to browse. We support PDF, JPG, and PNG formats up to 10MB. The system will automatically extract relevant data.'
        },
        {
          question: 'What if I have multiple Form-16s?',
          answer: 'You can upload multiple Form-16 documents if you have switched jobs during the financial year. The system will automatically combine income and TDS data from all uploaded Form-16s. Make sure to upload all Form-16s you received.'
        },
        {
          question: 'Supported document formats',
          answer: 'We support PDF, JPG, JPEG, and PNG formats for document upload. Maximum file size is 10MB per document. For best results, use PDF format for Form-16 documents as it provides the best text extraction accuracy.'
        },
        {
          question: 'What if Form-16 data is not auto-filling correctly?',
          answer: 'If the auto-fill doesn\'t work perfectly, you can manually edit all fields. The auto-fill is meant to save time, but you should verify all extracted data for accuracy before proceeding.'
        }
      ]
    },
    {
      title: 'Income Details',
      icon: <MoneyIcon />,
      questions: [
        {
          question: 'What income sources should I declare?',
          answer: 'You should declare all income sources: Salary, House Property, Capital Gains, Business/Profession, and Other Sources (interest, dividends, etc.). Full disclosure is mandatory under income tax laws.'
        },
        {
          question: 'How to report rental income?',
          answer: 'Report rental income under "Income from House Property". You can claim deductions for municipal taxes, standard deduction (30%), and interest on home loan. Maintain proper documentation of rent agreements and receipts.'
        },
        {
          question: 'What about foreign income?',
          answer: 'All foreign income must be declared in your Indian tax return. This includes foreign investments, rental income from overseas properties, and any other foreign-sourced income. Different rules may apply for NRIs.'
        }
      ]
    },
    {
      title: 'Tax Calculation',
      icon: <CalculatorIcon />,
      questions: [
        {
          question: 'New vs Old tax regime',
          answer: 'New regime offers lower tax rates but limited deductions. Old regime offers higher tax rates but allows full deductions. Choose based on your investment patterns - new regime is better if you have few deductions, old regime if you have significant investments.'
        },
        {
          question: 'How deductions are calculated?',
          answer: 'Deductions are calculated under various sections: 80C (₹1.5L for investments), 80D (health insurance), 24 (home loan interest), 80G (donations), etc. The system automatically calculates eligible deductions based on your inputs and shows the impact on your tax liability.'
        },
        {
          question: 'Understanding tax slabs',
          answer: 'Tax slabs vary between regimes. In new regime: 0% up to ₹3L, 5% for ₹3-6L, 10% for ₹6-9L, 15% for ₹9-12L, 20% for ₹12-15L, 30% above ₹15L. Old regime has different slabs with more exemption limits.'
        },
        {
          question: 'What is advance tax and when to pay?',
          answer: 'Advance tax is paid in installments if your tax liability exceeds ₹10,000. Due dates: 15% by June 15, 45% by Sept 15, 75% by Dec 15, 100% by March 15. Salaried employees usually don\'t need to pay advance tax as TDS covers their liability.'
        }
      ]
    },
    {
      title: 'Deductions & Savings',
      icon: <SavingsIcon />,
      questions: [
        {
          question: 'What investments qualify under Section 80C?',
          answer: 'PPF, ELSS mutual funds, NSC, Tax-saving FDs, Life Insurance premiums, EPF contributions, home loan principal repayment, Sukanya Samriddhi Yojana, and tuition fees for children education.'
        },
        {
          question: 'How much can I save with health insurance?',
          answer: 'Under Section 80D: ₹25,000 for self, spouse, and children. Additional ₹25,000 for parents (₹50,000 if parents are senior citizens). Total up to ₹75,000 can be claimed for health insurance premiums.'
        },
        {
          question: 'Can I claim HRA and home loan interest together?',
          answer: 'Yes, you can claim both HRA (if you live in rented accommodation) and home loan interest (for a house you own but don\'t occupy). However, you cannot claim HRA for the same house where you\'re claiming home loan interest.'
        }
      ]
    },
    {
      title: 'Troubleshooting',
      icon: <ToolsIcon />,
      questions: [
        {
          question: 'File upload issues',
          answer: 'Ensure file size is under 10MB and format is supported. Check your internet connection. Try refreshing the page or uploading a different file. Clear browser cache if problems persist. Contact support if issues continue.'
        },
        {
          question: 'Data not auto-filling correctly',
          answer: 'Ensure your Form-16 is clear and readable. Manual correction might be needed for some fields. You can always edit auto-filled data in subsequent steps. The auto-fill is an assistance feature, not a replacement for verification.'
        },
        {
          question: 'Cannot proceed to next step',
          answer: 'Check if all required fields in the current step are filled. Look for validation errors highlighted in red. Ensure all inputs are in correct format. Some steps require minimum information before proceeding.'
        },
        {
          question: 'Website is slow or not loading',
          answer: 'Check your internet connection. Try refreshing the page. Clear browser cache and cookies. Use the latest version of Chrome, Firefox, or Safari. If problems continue, contact our technical support team.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setExpandedQuestion(expandedQuestion === key ? null : key);
  };

  const handleAIChat = async () => {
  if (!chatMessage.trim()) return;

  const userMessage = chatMessage;
  setChatMessage('');
  setIsChatting(true);

  setChatHistory(prev => [...prev, { type: 'user', message: userMessage }]);

  try {
    // Use Gemini API for response - updated function call
    const aiResponse = await geminiService.sendMessage(userMessage);
    
    setChatHistory(prev => [...prev, { type: 'ai', message: aiResponse }]);
  } catch (error) {
    console.error('Chat error:', error);
    setChatHistory(prev => [...prev, { 
      type: 'ai', 
      message: 'I apologize, but I\'m having trouble responding right now. Please try again or contact our support team for assistance.' 
    }]);
  } finally {
    setIsChatting(false);
  }
};

  const handleContactSupport = () => {
    if (contactMethod === 'email') {
      window.open('mailto:support@taxsage.com?subject=Help Request&body=Hello TaxSage Support,', '_self');
    } else if (contactMethod === 'chat') {
      setChatHistory([{ 
        type: 'ai', 
        message: 'Hello! I\'m TaxSage AI, your intelligent tax assistant. I can help you with:\n\n• Income Tax Filing Process\n• Form-16 and Documents\n• Tax Deductions & Savings\n• Tax Regime Selection\n• ITR Deadlines & Procedures\n• Common Tax Issues\n\nWhat would you like to know about your tax filing today?' 
      }]);
    } else {
      alert('Please select a contact method first.');
    }
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const quickQuestions = [
    "What is Form-16 and why do I need it?",
    "Should I choose old or new tax regime?",
    "What documents do I need for ITR filing?",
    "How to claim HRA exemption?",
    "What are the tax saving options under 80C?",
    "When is the last date for ITR filing?",
    "How to calculate capital gains tax?",
    "Can I revise my ITR after filing?"
  ];

  const handleQuickQuestion = async (question) => {
    setChatMessage(question);
    setTimeout(() => {
      handleAIChat();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#293241] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors mr-6"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <div>
                <h1 className="text-xl font-semibold text-[#293241]">Help & Guide</h1>
                <p className="text-[#3d5a80] text-sm">Get answers and AI-powered tax assistance</p>
              </div>
            </div>
            {!apiKeyConfigured && (
              <span className="bg-[#e0fbfc] text-[#3d5a80] px-3 py-1 rounded-full text-sm font-medium border border-[#98c1d9]">
                Demo Mode
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-[#98c1d9] p-6">
          {/* API Key Warning */}
          {!apiKeyConfigured && (
            <div className="bg-[#e0fbfc] border border-[#98c1d9] rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#3d5a80] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-[#3d5a80] font-medium">Gemini API Key Not Configured</p>
                  <p className="text-[#3d5a80] text-sm">
                    To enable AI chat, add your Gemini API key to the .env file as REACT_APP_GEMINI_API_KEY
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {helpCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="border border-[#98c1d9] rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#e0fbfc] rounded-lg flex items-center justify-center text-[#3d5a80]">
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#293241]">{category.title}</h3>
                </div>
                <div className="space-y-2">
                  {category.questions.map((item, questionIndex) => (
                    <div key={questionIndex} className="border-b border-[#e0fbfc] last:border-b-0">
                      <button 
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="flex items-center justify-between w-full text-left py-3 px-2 rounded hover:bg-[#e0fbfc] transition-colors"
                      >
                        <span className="text-[#3d5a80] font-medium pr-4 text-sm">{item.question}</span>
                        <svg 
                          className={`w-4 h-4 text-[#98c1d9] transform transition-transform ${
                            expandedQuestion === `${categoryIndex}-${questionIndex}` ? 'rotate-180' : ''
                          }`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedQuestion === `${categoryIndex}-${questionIndex}` && (
                        <div className="px-2 pb-3">
                          <p className="text-[#3d5a80] text-sm leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* AI Chat Section */}
          <div className="border-t border-[#98c1d9] pt-8 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#293241] flex items-center">
                <HelpIcon />
                <span className="ml-2">AI Tax Assistant {apiKeyConfigured ? '' : ''}</span>
              </h3>
              {chatHistory.length > 0 && (
                <button 
                  onClick={clearChat}
                  className="text-sm text-[#ee6c4d] hover:text-[#d45a3d] transition-colors"
                >
                  Clear Chat
                </button>
              )}
            </div>

            {/* Quick Questions */}
            {chatHistory.length === 0 && (
              <div className="mb-6">
                <p className="text-[#3d5a80] mb-3">Quick questions you can ask:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(question)}
                      className="bg-[#e0fbfc] hover:bg-[#98c1d9] text-[#3d5a80] px-3 py-2 rounded-lg text-sm transition-colors border border-[#98c1d9]"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div className="bg-[#e0fbfc] rounded-lg p-4 max-h-80 overflow-y-auto mb-3 border border-[#98c1d9]">
                {chatHistory.map((chat, index) => (
                  <div key={index} className={`mb-4 ${chat.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block px-4 py-3 rounded-2xl max-w-xs lg:max-w-2xl text-left ${
                      chat.type === 'user' 
                        ? 'bg-[#3d5a80] text-white' 
                        : 'bg-white border border-[#98c1d9] text-[#293241]'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm">{chat.message}</div>
                    </div>
                  </div>
                ))}
                {isChatting && (
                  <div className="text-left">
                    <div className="inline-block px-4 py-3 rounded-2xl bg-white border border-[#98c1d9]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#98c1d9] rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-[#98c1d9] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-[#98c1d9] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIChat()}
                placeholder="Ask me anything about Indian income tax..."
                className="flex-1 px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors text-[#293241]"
                disabled={isChatting}
              />
              <button
                onClick={handleAIChat}
                disabled={isChatting || !chatMessage.trim()}
                className="bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isChatting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Thinking...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">Send</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Contact Section */}
          <div className="border-t border-[#98c1d9] pt-8">
            <h3 className="text-lg font-semibold text-[#293241] mb-4 flex items-center">
              <UserIcon />
              <span className="ml-2">Still need human help?</span>
            </h3>
            <div className="bg-[#e0fbfc] rounded-lg p-6 border border-[#98c1d9]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-[#293241] mb-3">Contact Options</h4>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="email"
                        checked={contactMethod === 'email'}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="text-[#3d5a80] focus:ring-[#3d5a80]"
                      />
                      <div>
                        <span className="font-medium text-[#293241]">Email Support</span>
                        <p className="text-sm text-[#3d5a80]">Detailed queries, response within 24 hours</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="contactMethod"
                        value="chat"
                        checked={contactMethod === 'chat'}
                        onChange={(e) => setContactMethod(e.target.value)}
                        className="text-[#3d5a80] focus:ring-[#3d5a80]"
                      />
                      <div>
                        <span className="font-medium text-[#293241]">AI Chat Support</span>
                        <p className="text-sm text-[#3d5a80]">Instant answers 24/7 for quick questions</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-[#293241] mb-3">Direct Contact</h4>
                  <div className="space-y-3 text-[#3d5a80]">
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-8 h-8 bg-[#98c1d9] rounded-lg flex items-center justify-center">
                        <PhoneIcon />
                      </div>
                      <div>
                        <p className="font-medium text-[#293241]">Support Helpline</p>
                        <p className="text-sm">+91 1800-123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-8 h-8 bg-[#98c1d9] rounded-lg flex items-center justify-center">
                        <MailIcon />
                      </div>
                      <div>
                        <p className="font-medium text-[#293241]">Email</p>
                        <p className="text-sm">support@taxsage.com</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-8 h-8 bg-[#98c1d9] rounded-lg flex items-center justify-center">
                        <ClockIcon />
                      </div>
                      <div>
                        <p className="font-medium text-[#293241]">Business Hours</p>
                        <p className="text-sm">Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button 
                  onClick={handleContactSupport}
                  className="bg-[#3d5a80] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors flex items-center justify-center space-x-2"
                >
                  {contactMethod === 'chat' ? (
                    <>
                      <HelpIcon />
                      <span>Start AI Chat</span>
                    </>
                  ) : (
                    <>
                      <MailIcon />
                      <span>Send Email</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => window.open('tel:+9118001234567', '_self')}
                  className="border border-[#3d5a80] text-[#3d5a80] py-3 px-6 rounded-lg font-semibold hover:bg-[#3d5a80] hover:text-white transition-colors flex items-center justify-center space-x-2"
                >
                  <PhoneIcon />
                  <span>Call Support</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 p-6 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
            <h4 className="text-lg font-semibold text-[#293241] mb-3 flex items-center">
              <LightBulbIcon />
              <span className="ml-2">Quick Tax Tips</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#3d5a80]">
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>Keep all financial documents organized before starting tax filing</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>Verify your Form-16 details match your salary slips exactly</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>Choose tax regime based on your actual investment patterns</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>File ITR early to avoid last-minute rush and potential penalties</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>Keep digital copies of all submitted documents for 6 years</span>
              </div>
              <div className="flex items-start space-x-2">
                <span>•</span>
                <span>Review all auto-filled data carefully before submission</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide;