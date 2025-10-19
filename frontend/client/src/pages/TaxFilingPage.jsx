import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const TaxFilingPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [autoFillComplete, setAutoFillComplete] = useState(false);
  const [filingData, setFilingData] = useState({
    // Personal Information
    personalInfo: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      pan: user?.pan || '',
      dateOfBirth: '',
      phone: '',
      email: user?.email || '',
      address: {
        street: '',
        city: '',
        state: '',
        pincode: ''
      }
    },
    
    // Income Details
    income: {
      salary: {
        basicSalary: 0,
        allowances: 0,
        perquisites: 0,
        profitsInLie: 0,
        totalSalary: 0
      },
      houseProperty: {
        annualValue: 0,
        interest: 0,
        netIncome: 0
      },
      otherSources: {
        interest: 0,
        dividend: 0,
        other: 0,
        totalOther: 0
      },
      capitalGains: {
        shortTerm: 0,
        longTerm: 0,
        totalGains: 0
      }
    },
    
    // Deductions
    deductions: {
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section24: 0,
      section80E: 0,
      section80TTA: 0,
      totalDeductions: 0
    },
    
    // Tax Details
    taxPaid: {
      tds: 0,
      advanceTax: 0,
      selfAssessment: 0,
      totalTaxPaid: 0
    },
    
    taxRegime: 'new',
  });

  const steps = [
    { number: 1, title: 'Upload', description: 'Upload Form-16' },
    { number: 2, title: 'Personal', description: 'Basic details' },
    { number: 3, title: 'Income', description: 'Salary & income' },
    { number: 4, title: 'Deductions', description: 'Tax savings' },
    { number: 5, title: 'Tax', description: 'Tax calculation' },
    { number: 6, title: 'Review', description: 'Final check' },
  ];

  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    // Simulate file processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      uploadDate: new Date().toLocaleDateString(),
      status: 'processed'
    }));
    
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
    
    // Auto-fill data based on Form-16
    autoFillFromForm16();
  };

  const autoFillFromForm16 = () => {
    // Extract realistic data from Form-16 (simulated)
    const form16Data = {
      personal: {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        pan: 'ABCDE1234F',
        dateOfBirth: '1985-07-15',
        phone: '9876543210',
        address: {
          street: '123 Residential Area, Anna Nagar',
          city: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600040'
        }
      },
      income: {
        salary: {
          basicSalary: 850000,
          allowances: 490000, // HRA + Special Allowance
          perquisites: 120000,
          profitsInLie: 0,
          totalSalary: 1460000
        },
        houseProperty: {
          annualValue: 0,
          interest: 150000,
          netIncome: -150000
        },
        otherSources: {
          interest: 35000,
          dividend: 20000,
          other: 15000,
          totalOther: 70000
        }
      },
      deductions: {
        section80C: 150000,  // EPF, PPF, LIC
        section80D: 25000,   // Health Insurance
        section80G: 15000,   // Donations
        section24: 150000,   // Home Loan Interest
        section80E: 0,
        section80TTA: 10000,
        totalDeductions: 350000
      },
      tax: {
        tds: 185000,
        advanceTax: 25000,
        selfAssessment: 0,
        totalTaxPaid: 210000
      }
    };

    // Auto-fill all sections with Form-16 data
    setFilingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...form16Data.personal,
        email: user?.email || 'rajesh.kumar@email.com'
      },
      income: {
        ...prev.income,
        ...form16Data.income
      },
      deductions: {
        ...prev.deductions,
        ...form16Data.deductions
      },
      taxPaid: {
        ...prev.taxPaid,
        ...form16Data.tax
      }
    }));

    setAutoFillComplete(true);
    
    // Show success message and move to next step
    setTimeout(() => {
      alert('✅ Form-16 processed successfully! Your details have been auto-filled.');
      setCurrentStep(2);
    }, 500);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const handleInputChange = (section, field, value) => {
    setFilingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subSection, field, value) => {
    setFilingData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // New function to handle button actions
  const handleSaveAndInviteCA = () => {
    // Simulate saving and inviting CA
    alert('Your tax filing has been saved! A CA will review it and contact you shortly.');
    navigate('/dashboard?status=pending_review');
  };

  const handleSaveAndSubmit = () => {
    // Simulate direct submission
    alert('Your tax filing has been submitted successfully! You will receive confirmation shortly.');
    navigate('/dashboard?status=submitted');
  };

  const handleFileITR = () => {
    // Handle final ITR filing
    alert('Your Income Tax Return has been filed successfully!');
    navigate('/dashboard?status=filed');
  };

  const calculateTotals = () => {
    const salaryTotal = Object.values(filingData.income.salary).reduce((a, b) => a + b, 0);
    const housePropertyTotal = Math.max(0, filingData.income.houseProperty.annualValue - filingData.income.houseProperty.interest);
    const otherSourcesTotal = Object.values(filingData.income.otherSources).reduce((a, b) => a + b, 0);
    const capitalGainsTotal = Object.values(filingData.income.capitalGains).reduce((a, b) => a + b, 0);
    
    const totalIncome = salaryTotal + housePropertyTotal + otherSourcesTotal + capitalGainsTotal;
    const totalDeductions = Object.values(filingData.deductions).reduce((a, b) => a + b, 0);
    const totalTaxPaid = Object.values(filingData.taxPaid).reduce((a, b) => a + b, 0);
    
    const taxableIncome = Math.max(0, totalIncome - totalDeductions);
    
    return { 
      salaryTotal, 
      housePropertyTotal, 
      otherSourcesTotal, 
      capitalGainsTotal,
      totalIncome, 
      totalDeductions, 
      totalTaxPaid,
      taxableIncome
    };
  };

  const calculateTax = () => {
    const { taxableIncome } = calculateTotals();
    let tax = 0;
    
    if (filingData.taxRegime === 'old') {
      // Old regime tax calculation
      if (taxableIncome <= 250000) tax = 0;
      else if (taxableIncome <= 500000) tax = (taxableIncome - 250000) * 0.05;
      else if (taxableIncome <= 1000000) tax = 12500 + (taxableIncome - 500000) * 0.2;
      else tax = 112500 + (taxableIncome - 1000000) * 0.3;
    } else {
      // New regime tax calculation
      if (taxableIncome <= 300000) tax = 0;
      else if (taxableIncome <= 600000) tax = (taxableIncome - 300000) * 0.05;
      else if (taxableIncome <= 900000) tax = 15000 + (taxableIncome - 600000) * 0.1;
      else if (taxableIncome <= 1200000) tax = 45000 + (taxableIncome - 900000) * 0.15;
      else if (taxableIncome <= 1500000) tax = 90000 + (taxableIncome - 1200000) * 0.2;
      else tax = 150000 + (taxableIncome - 1500000) * 0.3;
    }
    
    return tax;
  };

  const totals = calculateTotals();
  const calculatedTax = calculateTax();
  const taxPayable = Math.max(0, calculatedTax - totals.totalTaxPaid);

  // Step 1: Document Upload
  const renderDocumentUpload = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Upload Your Form-16</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your Form-16 documents to automatically fill your details. You can upload multiple Form-16s if you've switched jobs during the financial year.
          <strong className="block mt-2 text-[#80A1BA]">
            We'll automatically extract data from all uploaded Form-16s
          </strong>
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-[#80A1BA] transition-colors">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#80A1BA]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#80A1BA]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {uploadedFiles.length > 0 ? 'Upload More Form-16s' : 'Upload Form-16 Documents'}
          </h4>
          <p className="text-gray-600 mb-4">
            {uploadedFiles.length > 0 
              ? 'Add more Form-16 documents if you have multiple employers'
              : 'Drag & drop your files here or click to browse'
            }
          </p>
          
          <label className="bg-[#80A1BA] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#6d8da4] transition-colors cursor-pointer inline-block">
            {uploadedFiles.length > 0 ? 'Add More Files' : 'Choose Files'}
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-gray-500 mt-3">Max file size: 10MB per file</p>
          {uploadedFiles.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              ✅ {uploadedFiles.length} Form-16(s) uploaded successfully
            </p>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-800">
              Uploaded Form-16 Documents ({uploadedFiles.length})
            </h4>
            {autoFillComplete && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                ✅ Data Auto-filled
              </span>
            )}
          </div>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Form-16 {uploadedFiles.length > 1 ? `#${index + 1}` : ''} - {file.name}
                    </p>
                    <p className="text-sm text-gray-500">{file.size} bytes • {file.uploadDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Multiple Form-16 Info */}
          {uploadedFiles.length > 1 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-blue-800">Multiple Form-16s Detected</p>
                  <p className="text-sm text-blue-700">
                    We've combined income and TDS data from all {uploadedFiles.length} Form-16 documents.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Auto-fill Status */}
      {autoFillComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800">
                Data Successfully Extracted from {uploadedFiles.length} Form-16(s)!
              </h4>
              <p className="text-green-700 text-sm">
                Your personal information, income details, deductions, and tax data have been auto-filled from all uploaded Form-16 documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Option */}
      <div className="text-center">
        <button
          onClick={nextStep}
          className="text-[#80A1BA] hover:text-[#6d8da4] font-medium transition-colors"
        >
          Prefer to enter details manually? Click here
        </button>
      </div>
    </div>
  );

  // Step 2: Personal Information
  const renderPersonalInfo = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h3>
        <p className="text-gray-600">
          {autoFillComplete ? 'Verify your auto-filled personal details' : 'Enter your personal details for tax filing'}
        </p>
      </div>

      {autoFillComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">Data auto-filled from {uploadedFiles.length} Form-16(s)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            value={filingData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            value={filingData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">PAN Number</label>
          <input
            type="text"
            value={filingData.personalInfo.pan}
            onChange={(e) => handleInputChange('personalInfo', 'pan', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors uppercase"
            placeholder="ABCDE1234F"
            maxLength="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={filingData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={filingData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          <input
            type="tel"
            value={filingData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            <input
              type="text"
              value={filingData.personalInfo.address.street}
              onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'street', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input
                type="text"
                value={filingData.personalInfo.address.city}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
              <input
                type="text"
                value={filingData.personalInfo.address.state}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
              <input
                type="text"
                value={filingData.personalInfo.address.pincode}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'pincode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3-5: Other steps remain the same...
  // (Income Details, Deductions, Tax Calculation - same as before)
  // Step 3: Income Details (same as before)
const renderIncomeDetails = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Income Details</h3>
      <p className="text-gray-600">
        {autoFillComplete ? 'Verify your auto-filled income details' : 'Enter your income from various sources'}
      </p>
    </div>

    {autoFillComplete && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Salary data auto-filled from {uploadedFiles.length} Form-16(s)</span>
        </div>
      </div>
    )}

    {/* Salary Income */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Salary Income</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(filingData.income.salary).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleNestedInputChange('income', 'salary', key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Other Income Sources */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Other Income Sources</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(filingData.income.otherSources).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key === 'other' ? 'Other Income' : key} Income
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleNestedInputChange('income', 'otherSources', key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Income Summary */}
    <div className="bg-gradient-to-r from-[#80A1BA]/10 to-[#91C4C3]/10 rounded-xl border border-[#80A1BA]/20 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Income Summary</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Salary Income</p>
          <p className="text-lg font-bold text-gray-800">₹{totals.salaryTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Other Income</p>
          <p className="text-lg font-bold text-gray-800">₹{totals.otherSourcesTotal.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Deductions</p>
          <p className="text-lg font-bold text-green-600">₹{totals.totalDeductions.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-sm text-gray-600">Taxable Income</p>
          <p className="text-lg font-bold text-[#80A1BA]">₹{totals.taxableIncome.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

// Step 4: Deductions (same as before)
const renderDeductions = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Tax Deductions</h3>
      <p className="text-gray-600">
        {autoFillComplete ? 'Verify your auto-filled deductions' : 'Claim eligible deductions to reduce your taxable income'}
      </p>
    </div>

    {autoFillComplete && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Deductions auto-filled from {uploadedFiles.length} Form-16(s)</span>
        </div>
      </div>
    )}

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(filingData.deductions).map(([key, value]) => (
        <div key={key} className="bg-white rounded-xl border border-gray-200 p-6">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            Section {key.replace('section', '')}
          </h4>
          <p className="text-sm text-gray-600 mb-4">
            {getDeductionDescription(key)}
          </p>
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange('deductions', key, parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
          />
        </div>
      ))}
    </div>

    {/* Tax Regime Selection */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Select Tax Regime</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleInputChange('taxRegime', 'new')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            filingData.taxRegime === 'new' 
              ? 'border-[#80A1BA] bg-[#80A1BA]/10' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-800">New Regime</span>
            {filingData.taxRegime === 'new' && (
              <div className="w-6 h-6 bg-[#80A1BA] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Lower tax rates with limited deductions</p>
          <p className="text-xs text-green-600">Recommended for most taxpayers</p>
        </button>

        <button
          onClick={() => handleInputChange('taxRegime', 'old')}
          className={`p-6 border-2 rounded-xl text-left transition-all ${
            filingData.taxRegime === 'old' 
              ? 'border-[#80A1BA] bg-[#80A1BA]/10' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-800">Old Regime</span>
            {filingData.taxRegime === 'old' && (
              <div className="w-6 h-6 bg-[#80A1BA] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">Higher tax rates with full deductions</p>
          <p className="text-xs text-gray-500">Choose if you have significant investments</p>
        </button>
      </div>
    </div>
  </div>
);

// Step 5: Tax Calculation (same as before)
const renderTaxCalculation = () => (
  <div className="space-y-8">
    <div>
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Tax Calculation</h3>
      <p className="text-gray-600">
        {autoFillComplete ? 'Verify your auto-filled tax payments' : 'Review your tax liability and payments'}
      </p>
    </div>

    {autoFillComplete && (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">TDS and tax payments auto-filled from {uploadedFiles.length} Form-16(s)</span>
        </div>
      </div>
    )}

    {/* Tax Paid Details */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Tax Already Paid</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(filingData.taxPaid).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleNestedInputChange('taxPaid', '', key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#80A1BA] focus:border-[#80A1BA] transition-colors"
            />
          </div>
        ))}
      </div>
    </div>

    {/* Tax Summary */}
    <div className="bg-gradient-to-r from-[#80A1BA]/10 to-[#91C4C3]/10 rounded-xl border border-[#80A1BA]/20 p-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-6">Tax Summary</h4>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Total Tax Calculated</span>
          <span className="text-lg font-bold text-gray-800">₹{calculatedTax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Tax Already Paid</span>
          <span className="text-lg font-bold text-green-600">₹{totals.totalTaxPaid.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-4 bg-white rounded-lg px-4">
          <span className="text-lg font-bold text-gray-800">Net Tax Payable/Refund</span>
          <span className={`text-xl font-bold ${taxPayable >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {taxPayable >= 0 ? '₹' + taxPayable.toLocaleString() : '₹' + Math.abs(taxPayable).toLocaleString() + ' (Refund)'}
          </span>
        </div>
      </div>
    </div>
  </div>
);

  // Step 6: Review
  const renderReview = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Review Your Filing</h3>
        <p className="text-gray-600">Verify all information before submission</p>
      </div>

      {autoFillComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-green-800">
                Form-16 Data Successfully Imported from {uploadedFiles.length} document(s)
              </h4>
              <p className="text-green-700 text-sm">
                All your data has been auto-filled from the uploaded Form-16 documents.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl mb-2">💰</div>
          <p className="text-sm text-gray-600">Total Income</p>
          <p className="text-lg font-bold text-gray-800">₹{totals.totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl mb-2">📉</div>
          <p className="text-sm text-gray-600">Deductions</p>
          <p className="text-lg font-bold text-green-600">₹{totals.totalDeductions.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <p className="text-sm text-gray-600">Tax Regime</p>
          <p className="text-lg font-bold text-[#80A1BA] capitalize">{filingData.taxRegime}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
          <div className="text-2xl mb-2">⚖️</div>
          <p className="text-sm text-gray-600">Tax Payable</p>
          <p className="text-lg font-bold text-red-600">₹{taxPayable.toLocaleString()}</p>
        </div>
      </div>

      {/* Final Submission */}
      <div className="bg-[#91C4C3]/10 rounded-xl border border-[#91C4C3] p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Ready to File Your ITR?</h4>
        <p className="text-sm text-gray-600 mb-6">
          Your tax filing will be saved and you can choose to get it reviewed by a CA or submit directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleSaveAndInviteCA}
            className="flex-1 bg-[#80A1BA] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors shadow-sm"
          >
            Save & Invite CA Review
          </button>
          <button 
            onClick={handleSaveAndSubmit}
            className="flex-1 bg-[#B4DEBD] text-gray-800 py-4 px-6 rounded-lg font-semibold hover:bg-[#a0c8a9] transition-colors shadow-sm"
          >
            Save & Submit Directly
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          By submitting, you agree to our terms and confirm that all information is accurate
        </p>
      </div>
    </div>
  );

  const getDeductionDescription = (section) => {
    const descriptions = {
      section80C: 'Life insurance, PPF, ELSS, EPF, etc. (Max: ₹1,50,000)',
      section80D: 'Health insurance premiums (Max: ₹25,000 - ₹75,000)',
      section80G: 'Donations to charitable institutions',
      section24: 'Interest on home loan (Max: ₹2,00,000)',
      section80E: 'Interest on education loan',
      section80TTA: 'Interest on savings account (Max: ₹10,000)'
    };
    return descriptions[section] || 'Tax deduction';
  };

  const renderStepContent = () => {
  switch (currentStep) {
    case 1: return renderDocumentUpload();
    case 2: return renderPersonalInfo();
    case 3: return renderIncomeDetails();
    case 4: return renderDeductions();
    case 5: return renderTaxCalculation();
    case 6: return renderReview();
    default: return renderDocumentUpload();
  }
};

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Income Tax Filing</h1>
                <p className="text-sm text-gray-500">Assessment Year 2024-2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Progress</p>
              <p className="text-sm font-semibold text-gray-800">{currentStep} of {steps.length} steps</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 -z-10"></div>
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  currentStep >= step.number
                    ? 'bg-[#80A1BA] text-white shadow-md'
                    : 'bg-white border-2 border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${
                  currentStep >= step.number ? 'text-[#80A1BA]' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              currentStep === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Previous
          </button>

          <button
            onClick={currentStep === steps.length ? handleFileITR : nextStep}
            className="bg-[#80A1BA] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6d8da4] transition-colors shadow-sm"
          >
            {currentStep === steps.length ? 'File ITR' : 'Continue'}
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 border-4 border-[#80A1BA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Processing {uploadedFiles.length > 0 ? 'Additional ' : ''}Form-16(s)
            </h3>
            <p className="text-gray-600">
              {uploadedFiles.length > 0 
                ? `We're extracting data from the new Form-16 document${uploadedFiles.length > 1 ? 's' : ''}...`
                : 'We\'re extracting your personal details, salary information, deductions, and tax data...'
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxFilingPage;