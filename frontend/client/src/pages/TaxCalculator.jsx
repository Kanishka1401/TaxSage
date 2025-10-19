import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      effectiveRate: (tax / taxableIncome * 100).toFixed(2)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tax Calculator</h1>
          <p className="text-gray-600 mb-8">Estimate your tax liability for the current financial year</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Income (₹)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA]"
                  placeholder="Enter your annual income"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tax Regime
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="new"
                      checked={regime === 'new'}
                      onChange={(e) => setRegime(e.target.value)}
                      className="text-[#80A1BA] focus:ring-[#80A1BA]"
                    />
                    <span className="ml-2">New Regime (Default)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="old"
                      checked={regime === 'old'}
                      onChange={(e) => setRegime(e.target.value)}
                      className="text-[#80A1BA] focus:ring-[#80A1BA]"
                    />
                    <span className="ml-2">Old Regime (with deductions)</span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateTax}
                className="w-full bg-[#80A1BA] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors"
              >
                Calculate Tax
              </button>
            </div>

            {taxResult && (
              <div className="bg-gradient-to-br from-[#80A1BA]/10 to-[#91C4C3]/10 rounded-xl p-6 border border-[#80A1BA]/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Tax Calculation Result</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxable Income:</span>
                    <span className="font-semibold">₹{taxResult.taxableIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax Amount:</span>
                    <span className="font-semibold text-red-600">₹{taxResult.taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effective Tax Rate:</span>
                    <span className="font-semibold">{taxResult.effectiveRate}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxCalculator;