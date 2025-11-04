import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Icon Components
const CalculatorIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const MoneyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const TaxCalculator = () => {
  const navigate = useNavigate();
  const [income, setIncome] = useState('');
  const [regime, setRegime] = useState('new');
  const [taxResult, setTaxResult] = useState(null);

  const calculateTax = () => {
    const taxableIncome = parseFloat(income) || 0;
    let tax = 0;

    if (regime === 'old') {
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
      else tax = 112500 + (taxableIncome - 1000000) * 0.3;
    } else {
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
      else tax = 150000 + (taxableIncome - 1500000) * 0.3;
    }

    setTaxResult({
      taxableIncome,
      taxAmount: tax,
      effectiveRate: taxableIncome > 0 ? (tax / taxableIncome * 100).toFixed(2) : '0.00'
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="h-6 w-px bg-[#98c1d9]"></div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-[#3d5a80] rounded-lg flex items-center justify-center">
                <CalculatorIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#293241]">Tax Calculator</h1>
                <p className="text-sm text-[#3d5a80]">Assessment Year 2024-2025</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-xl shadow-sm border border-[#98c1d9] p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#3d5a80]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalculatorIcon className="w-8 h-8 text-[#3d5a80]" />
            </div>
            <h1 className="text-3xl font-bold text-[#293241] mb-2">Tax Calculator</h1>
            <p className="text-[#3d5a80]">Estimate your tax liability for the current financial year</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-2">
                  Annual Income (₹)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MoneyIcon className="w-5 h-5 text-[#3d5a80]" />
                  </div>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
                    placeholder="Enter your annual income"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3d5a80] mb-3">
                  Tax Regime
                </label>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-[#98c1d9] rounded-lg hover:border-[#3d5a80] transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="new"
                      checked={regime === 'new'}
                      onChange={(e) => setRegime(e.target.value)}
                      className="text-[#3d5a80] focus:ring-[#3d5a80] border-[#98c1d9]"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-[#293241]">New Regime</span>
                      <p className="text-sm text-[#3d5a80]">Lower tax rates with limited deductions</p>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-[#98c1d9] rounded-lg hover:border-[#3d5a80] transition-colors cursor-pointer">
                    <input
                      type="radio"
                      value="old"
                      checked={regime === 'old'}
                      onChange={(e) => setRegime(e.target.value)}
                      className="text-[#3d5a80] focus:ring-[#3d5a80] border-[#98c1d9]"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-[#293241]">Old Regime</span>
                      <p className="text-sm text-[#3d5a80]">Higher tax rates with full deductions</p>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateTax}
                disabled={!income}
                className="w-full bg-[#3d5a80] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#3d5a80]"
              >
                Calculate Tax
              </button>
            </div>

            {/* Results Section */}
            {taxResult && (
              <div className="bg-gradient-to-br from-[#3d5a80]/10 to-[#98c1d9]/10 rounded-xl p-6 border border-[#3d5a80]/20">
                <h3 className="text-lg font-semibold text-[#293241] mb-6 flex items-center">
                  <CalculatorIcon className="w-5 h-5 mr-2 text-[#3d5a80]" />
                  Tax Calculation Result
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#98c1d9]">
                    <span className="text-[#3d5a80]">Taxable Income:</span>
                    <span className="font-semibold text-[#293241]">₹{taxResult.taxableIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#98c1d9]">
                    <span className="text-[#3d5a80]">Tax Amount:</span>
                    <span className="font-semibold text-red-600">₹{taxResult.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[#3d5a80]">Effective Tax Rate:</span>
                    <span className="font-semibold text-[#3d5a80]">{taxResult.effectiveRate}%</span>
                  </div>
                  
                  {/* Additional Info */}
                  <div className="mt-6 p-4 bg-white rounded-lg border border-[#98c1d9]">
                    <h4 className="font-medium text-[#293241] mb-2">Key Points</h4>
                    <ul className="text-sm text-[#3d5a80] space-y-1">
                      <li>• Based on {regime === 'new' ? 'New' : 'Old'} Tax Regime</li>
                      <li>• Excludes cess and surcharge</li>
                      <li>• For individuals below 60 years</li>
                      <li>• Consult a CA for exact calculation</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder when no results */}
            {!taxResult && (
              <div className="bg-[#e0fbfc] rounded-xl p-8 border border-[#98c1d9] flex items-center justify-center">
                <div className="text-center">
                  <CalculatorIcon className="w-12 h-12 text-[#98c1d9] mx-auto mb-4" />
                  <p className="text-[#3d5a80]">Enter your income and select tax regime to see calculation results</p>
                </div>
              </div>
            )}
          </div>

          {/* Tax Slabs Information */}
          <div className="mt-8 bg-[#f8fafc] rounded-xl p-6 border border-[#98c1d9]">
            <h3 className="text-lg font-semibold text-[#293241] mb-4">Current Tax Slabs (AY 2024-25)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-[#3d5a80] mb-3">New Regime</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Up to ₹3,00,000</span><span>Nil</span></div>
                  <div className="flex justify-between"><span>₹3,00,001 - ₹6,00,000</span><span>5%</span></div>
                  <div className="flex justify-between"><span>₹6,00,001 - ₹9,00,000</span><span>10%</span></div>
                  <div className="flex justify-between"><span>₹9,00,001 - ₹12,00,000</span><span>15%</span></div>
                  <div className="flex justify-between"><span>₹12,00,001 - ₹15,00,000</span><span>20%</span></div>
                  <div className="flex justify-between"><span>Above ₹15,00,000</span><span>30%</span></div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-[#3d5a80] mb-3">Old Regime</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span>Up to ₹2,50,000</span><span>Nil</span></div>
                  <div className="flex justify-between"><span>₹2,50,001 - ₹5,00,000</span><span>5%</span></div>
                  <div className="flex justify-between"><span>₹5,00,001 - ₹10,00,000</span><span>20%</span></div>
                  <div className="flex justify-between"><span>Above ₹10,00,000</span><span>30%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;