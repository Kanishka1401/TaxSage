import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import { encryptData } from '../../utils/encryption';
import { ITR_API_CONFIG } from '../../config/apiConfig';
import { validateITRData } from '../../utils/itrValidation';

// Icon Components
const MoneyIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ScaleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UploadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

// --- MODIFICATION START ---
// Added DownloadIcon for the new button
const DownloadIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);
// --- MODIFICATION END ---


const TaxFilingPage = () => {
  const { user } = useContext(AuthContext);
  const { createTaxFiling, submitTaxFiling, completeTaxFiling } = useData();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [autoFillComplete, setAutoFillComplete] = useState(false);
  const [currentFilingId, setCurrentFilingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [efilingStatus, setEfilingStatus] = useState(null);
  
  const [filingData, setFilingData] = useState({
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
    deductions: {
      section80C: 0,
      section80D: 0,
      section80G: 0,
      section24: 0,
      section80E: 0,
      section80TTA: 0,
      totalDeductions: 0
    },
    taxPaid: {
      tds: 0,
      advanceTax: 0,
      selfAssessment: 0,
      totalTaxPaid: 0
    },
    taxRegime: 'new',
  });
  const [serverFiling, setServerFiling] = useState(null);

  // Memoize calculated totals to avoid recalculation on every render
  const totals = useMemo(() => {
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
  }, [filingData.income, filingData.deductions, filingData.taxPaid]);

  // Memoize tax calculation
  const calculatedTax = useMemo(() => {
    const { taxableIncome } = totals;
    let tax = 0;
    
    if (filingData.taxRegime === 'old') {
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
    
    return tax;
  }, [filingData.taxRegime, totals]);

  const steps = [
    { number: 1, title: 'Upload', description: 'Upload Form-16' },
    { number: 2, title: 'Personal', description: 'Basic details' },
    { number: 3, title: 'Income', description: 'Salary & income' },
    { number: 4, title: 'Deductions', description: 'Tax savings' },
    { number: 5, title: 'Tax', description: 'Tax calculation' },
    { number: 6, title: 'Review', description: 'Final check' },
  ];

  // Create filing handler with proper async/await
  const handleCreateFiling = useCallback(async () => {
    if (!currentFilingId && currentStep > 1) {
      try {
        const newFiling = await createTaxFiling({
          personalInfo: filingData.personalInfo,
          taxableIncome: totals.taxableIncome,
          taxLiability: calculatedTax,
          status: 'draft'
        });
        setCurrentFilingId(newFiling.id);
      } catch (error) {
        console.error('Error creating filing:', error);
      }
    }
  }, [currentStep, currentFilingId, calculatedTax, totals.taxableIncome, createTaxFiling, filingData.personalInfo]);

  useEffect(() => {
    handleCreateFiling();
  }, [handleCreateFiling]);

  // Fetch filing from backend
  useEffect(() => {
    const fetchServerFiling = async () => {
      try {
        const res = await fetch('/api/tax/filing', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await res.json();
        if (res.ok) setServerFiling(data);
      } catch (err) {
        console.error('Error fetching server filing:', err);
      }
    };

    fetchServerFiling();
  }, [currentFilingId]);

  // ============ E-FILING API INTEGRATION ============
  
  /**
   * Transform internal filing data to Income Tax Department JSON format
   * Based on official ITR JSON schema specifications
   */
  const transformToITRJSON = useCallback(() => {
    const assessmentYear = '2024-25';
    const financialYear = '2023-24';
    
    return {
      // ITR Form Identification
      ITRType: 'ITR1', // ITR-1 for salary income
      FormName: 'ITR-1',
      Description: 'For individuals having Income from Salaries, one house property, other sources',
      AssessmentYear: assessmentYear,
      SchemaVer: 'Ver1.0',
      FormVer: 'Ver1.0',
      
      // Personal Information
      PersonalInfo: {
        AssesseeName: {
          FirstName: filingData.personalInfo.firstName,
          MiddleName: '',
          SurNameOrOrgName: filingData.personalInfo.lastName
        },
        PAN: filingData.personalInfo.pan,
        DOB: filingData.personalInfo.dateOfBirth,
        Status: 'I', // Individual
        ResidentialStatus: 'R', // Resident
        Address: {
          ResidenceNo: '',
          ResidenceName: '',
          RoadOrStreet: filingData.personalInfo.address.street,
          LocalityOrArea: '',
          CityOrTownOrDistrict: filingData.personalInfo.address.city,
          StateCode: getStateCode(filingData.personalInfo.address.state),
          CountryCode: '91',
          PinCode: filingData.personalInfo.address.pincode,
          Phone: {
            STDcode: '',
            PhoneNo: filingData.personalInfo.phone
          },
          EmailAddress: filingData.personalInfo.email
        }
      },
      
      // Filing Status
      FilingStatus: {
        ReturnFiledFlg: '1',
        SeventhProviso139: '0',
        FilingDate: new Date().toISOString().split('T')[0],
        OriginalOrRevised: 'O', // Original return
        ReceiptNo: '', // Will be populated after submission
        AckNum: '' // Will be populated after e-verification
      },
      
      // Income Details
      ITR1_IncomeDeductions: {
        // Salary Income
        Salaries: {
          Salary: {
            NatureOfEmployment: 'S', // Salaried
            NameOfEmployer: 'As per Form-16',
            AddressOfEmployer: '',
            TAN: '',
            Salary: filingData.income.salary.basicSalary,
            PerquisitesValue: filingData.income.salary.perquisites,
            ProfitsInLieuOfSalary: filingData.income.salary.profitsInLie,
            AllowanceExemptUs10: filingData.income.salary.allowances,
            TotalGrossSalary: totals.salaryTotal,
            DeductionUs16: Math.min(50000, totals.salaryTotal * 0.4), // Standard deduction
            NetSalary: totals.salaryTotal - Math.min(50000, totals.salaryTotal * 0.4)
          }
        },
        
        // House Property Income
        HouseProperty: filingData.income.houseProperty.annualValue > 0 ? {
          PropertyDetails: {
            Address: filingData.personalInfo.address,
            AnnualLetableValue: filingData.income.houseProperty.annualValue,
            TaxPaidToLocalAuth: 0,
            AnnualValue: filingData.income.houseProperty.annualValue,
            ThirtyPercentAnnualValue: filingData.income.houseProperty.annualValue * 0.3,
            InterestPayable: filingData.income.houseProperty.interest,
            IncomeFromHP: totals.housePropertyTotal
          }
        } : null,
        
        // Other Sources
        IncomeOthSrc: {
          InterestFromSavingsBank: filingData.income.otherSources.interest,
          InterestFromDeposits: 0,
          DividendIncome: filingData.income.otherSources.dividend,
          OthersGross: filingData.income.otherSources.other,
          TotalOthSrcGross: totals.otherSourcesTotal,
          Deductions: filingData.deductions.section80TTA || 0,
          TotalOthSrcNet: totals.otherSourcesTotal - (filingData.deductions.section80TTA || 0)
        },
        
        // Gross Total Income
        GrossTotalIncome: totals.totalIncome
      },
      
      // Deductions (Chapter VI-A)
      ITR1_Deductions: {
        Section80C: filingData.deductions.section80C || 0,
        Section80CCC: 0,
        Section80CCDEmployeeOrSE: 0,
        Section80CCD1B: 0,
        Section80D: filingData.deductions.section80D || 0,
        Section80DD: 0,
        Section80DDB: 0,
        Section80E: filingData.deductions.section80E || 0,
        Section80EE: 0,
        Section80EEA: 0,
        Section80EEB: 0,
        Section80G: filingData.deductions.section80G || 0,
        Section80GG: 0,
        Section80GGA: 0,
        Section80GGC: 0,
        Section80U: 0,
        Section80TTA: filingData.deductions.section80TTA || 0,
        Section80TTB: 0,
        TotalChapterVIA: totals.totalDeductions,
        TotalIncome: totals.taxableIncome
      },
      
      // Tax Computation
      ITR1_TaxComputation: {
        TotalTaxPayable: calculatedTax,
        Rebate87A: totals.taxableIncome <= 700000 ? Math.min(25000, calculatedTax) : 0,
        TaxPayableAfterRebate: totals.taxableIncome <= 700000 
          ? Math.max(0, calculatedTax - Math.min(25000, calculatedTax))
          : calculatedTax,
        EducationCess: (calculatedTax * 0.04),
        TotalTaxAndCess: calculatedTax + (calculatedTax * 0.04),
        Relief: 0,
        TotalTaxLiability: calculatedTax + (calculatedTax * 0.04)
      },
      
      // Tax Paid
      TaxPaid: {
        TDS: {
          TDSOnSalary: filingData.taxPaid.tds || 0,
          TDSOnOtherThanSalary: 0,
          TotalTDS: filingData.taxPaid.tds || 0
        },
        AdvanceTax: filingData.taxPaid.advanceTax || 0,
        SelfAssessmentTax: filingData.taxPaid.selfAssessment || 0,
        TotalTaxesPaid: totals.totalTaxPaid
      },
      
      // Refund or Tax Payable
      Refund: {
        RefundDue: Math.max(0, totals.totalTaxPaid - calculatedTax),
        BankAccountDtls: {
          AddressOfBank: '',
          BankAccountNo: '', // User should provide
          IFSCCode: '' // User should provide
        }
      },
      
      TaxPayable: Math.max(0, calculatedTax - totals.totalTaxPaid),
      
      // Verification
      Verification: {
        Declaration: {
          AssesseeVerName: `${filingData.personalInfo.firstName} ${filingData.personalInfo.lastName}`,
          FatherName: '',
          Place: filingData.personalInfo.address.city,
          Date: new Date().toISOString().split('T')[0]
        },
        Capacity: 'S', // Self
        VerificationDate: new Date().toISOString().split('T')[0]
      },
      
      // Schedule for selecting tax regime
      Schedule: {
        ScheduleIT: {
          TaxRegime: filingData.taxRegime === 'new' ? 'N' : 'O'
        }
      }
    };
  }, [filingData, totals, calculatedTax]);

  /**
   * Helper function to get state code for ITR
   */
  const getStateCode = (stateName) => {
    const stateCodes = {
      'Andhra Pradesh': '28', 'Arunachal Pradesh': '12', 'Assam': '18',
      'Bihar': '10', 'Chhattisgarh': '22', 'Goa': '30', 'Gujarat': '24',
      'Haryana': '06', 'Himachal Pradesh': '02', 'Jharkhand': '20',
      'Karnataka': '29', 'Kerala': '32', 'Madhya Pradesh': '23',
      'Maharashtra': '27', 'Manipur': '14', 'Meghalaya': '17',
      'Mizoram': '15', 'Nagaland': '13', 'Odisha': '21', 'Punjab': '03',
      'Rajasthan': '08', 'Sikkim': '11', 'Tamil Nadu': '33',
      'Telangana': '36', 'Tripura': '16', 'Uttar Pradesh': '09',
      'Uttarakhand': '05', 'West Bengal': '19', 'Delhi': '07'
    };
    return stateCodes[stateName] || '99';
  };

  /**
   * Validate ITR data before submission
   */
  const validateITRBeforeSubmission = () => {
    const errors = [];
    
    // PAN validation
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(filingData.personalInfo.pan)) {
      errors.push('Invalid PAN format');
    }
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(filingData.personalInfo.email)) {
      errors.push('Invalid email format');
    }
    
    // Phone validation
    if (!/^[0-9]{10}$/.test(filingData.personalInfo.phone)) {
      errors.push('Invalid phone number');
    }
    
    // Date of birth validation
    if (!filingData.personalInfo.dateOfBirth) {
      errors.push('Date of birth is required');
    }
    
    // Address validation
    if (!filingData.personalInfo.address.city || !filingData.personalInfo.address.state) {
      errors.push('Complete address is required');
    }
    
    return errors;
  };

  /**
   * Submit ITR to Income Tax Department E-Filing Portal
   * This integrates with the official government API
   */
  const submitToEFilingPortal = async () => {
    setIsSubmitting(true);
    setEfilingStatus({ stage: 'validating', message: 'Validating your tax return data...' });
    
    try {
      // Step 1: Validate data
      const validationErrors = validateITRBeforeSubmission();
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Step 2: Transform to ITR JSON format
      setEfilingStatus({ stage: 'transforming', message: 'Preparing ITR JSON in government format...' });
      const itrJSON = transformToITRJSON();
      
      // Step 3: Encrypt sensitive data
      setEfilingStatus({ stage: 'encrypting', message: 'Encrypting sensitive information...' });
      const encryptedData = await encryptData(JSON.stringify(itrJSON));
      
      // Step 4: Save to our backend first
      setEfilingStatus({ stage: 'saving', message: 'Saving to secure database...' });
      const saveResponse = await fetch('/api/tax/save-itr-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          filingId: currentFilingId,
          itrJSON: itrJSON,
          encryptedData: encryptedData
        })
      });
      
      if (!saveResponse.ok) {
        throw new Error('Failed to save ITR data');
      }
      
      // Step 5: Authenticate with Income Tax Portal
      setEfilingStatus({ stage: 'authenticating', message: 'Connecting to Income Tax E-Filing Portal...' });
      const authResponse = await fetch('/api/tax/efiling/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          pan: filingData.personalInfo.pan,
          password: '', // User should be prompted for this separately
          // OTP will be sent to registered mobile/email
        })
      });
      
      if (!authResponse.ok) {
        throw new Error('Authentication with Income Tax Portal failed');
      }
      
      const authData = await authResponse.json();
      
      // Step 6: Submit ITR JSON to government portal
      setEfilingStatus({ stage: 'submitting', message: 'Submitting your return to Income Tax Department...' });
      const submissionResponse = await fetch('/api/tax/efiling/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'X-EFiling-Session': authData.sessionToken
        },
        body: JSON.stringify({
          itrJSON: itrJSON,
          pan: filingData.personalInfo.pan,
          assessmentYear: '2024-25',
          returnType: 'ITR1',
          filingId: currentFilingId
        })
      });
      
      if (!submissionResponse.ok) {
        const errorData = await submissionResponse.json();
        throw new Error(errorData.message || 'Submission to Income Tax Portal failed');
      }
      
      const submissionData = await submissionResponse.json();
      
      // Step 7: Process response from Income Tax Portal
      setEfilingStatus({ 
        stage: 'processing', 
        message: 'Processing acknowledgment from Income Tax Department...' 
      });
      
      if (submissionData.status === 'success') {
        // Step 8: Update our database with acknowledgment details
        await fetch('/api/tax/filing/update-acknowledgment', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            filingId: currentFilingId,
            acknowledgmentNumber: submissionData.acknowledgmentNumber,
            acknowledgmentDate: submissionData.acknowledgmentDate,
            itrv: submissionData.itrv, // ITR-V form
            status: 'submitted_to_income_tax',
            submissionTimestamp: new Date().toISOString()
          })
        });
        
        setEfilingStatus({ 
          stage: 'success', 
          message: 'ITR successfully submitted!',
          acknowledgmentNumber: submissionData.acknowledgmentNumber,
          itrv: submissionData.itrv
        });
        
        // Show success message
        setTimeout(() => {
          navigate('/dashboard?status=filed&ack=' + submissionData.acknowledgmentNumber);
        }, 3000);
        
      } else {
        throw new Error(submissionData.message || 'Submission failed');
      }
      
    } catch (error) {
      console.error('E-Filing error:', error);
      setEfilingStatus({ 
        stage: 'error', 
        message: error.message || 'Failed to submit to Income Tax Portal. Please try again.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle e-verification after submission
   */
  const handleEVerification = async (acknowledgmentNumber) => {
    try {
      // User can choose between:
      // 1. Net Banking
      // 2. Aadhaar OTP
      // 3. EVC through bank account
      // 4. Send ITR-V physically to CPC Bangalore
      
      const response = await fetch('/api/tax/efiling/e-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          acknowledgmentNumber: acknowledgmentNumber,
          verificationType: 'aadhaar-otp', // or 'netbanking', 'evc', 'itrv'
          pan: filingData.personalInfo.pan
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Your ITR has been e-verified successfully!');
        navigate('/dashboard?status=verified');
      }
    } catch (error) {
      console.error('E-Verification error:', error);
      alert('E-Verification failed. You can try again or send ITR-V physically.');
    }
  };

  // ============ END E-FILING API INTEGRATION ============

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
    // Simulate data extraction from Form-16
    const form16Data = {
      personal: {
        firstName: user?.firstName || 'Rajesh',
        lastName: user?.lastName || 'Kumar',
        pan: user?.pan || 'ABCDE1234F',
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
          allowances: 490000,
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
        section80C: 150000,
        section80D: 25000,
        section80G: 15000,
        section24: 150000,
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

    setFilingData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        ...form16Data.personal,
        email: user?.email || prev.personalInfo.email
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
    
    setTimeout(() => {
      alert('Form-16 processed successfully! Your details have been auto-filled.');
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

  const handleSaveAndInviteCA = async () => {
    try {
      setIsSubmitting(true);
      let filingId = currentFilingId;
      
      // If no filing exists on server, create one
      if (!filingId) {
        const startRes = await fetch('/api/tax/start-filing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ itrFormType: 'ITR-1' })
        });
        const startData = await startRes.json();
        if (!startRes.ok) throw new Error(startData.message || 'Failed to start filing');
        filingId = startData._id;
        setCurrentFilingId(filingId);

        // Save full filing data
        await fetch('/api/tax/filing', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ 
            filingData: {
              personalInfo: filingData.personalInfo,
              income: filingData.income,
              deductions: filingData.deductions,
              taxPaid: filingData.taxPaid,
              taxRegime: filingData.taxRegime,
              taxableIncome: totals.taxableIncome,
              taxLiability: calculatedTax,
              status: 'pending_review'
            }
          })
        });
      }

      // Invite CA
      const inviteRes = await fetch(`/api/tax/${filingId}/invite-ca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({})
      });
      const inviteData = await inviteRes.json();
      if (!inviteRes.ok) throw new Error(inviteData.message || 'Failed to invite CA');

      alert('Your tax filing has been saved! A CA will review it and contact you shortly.');
      navigate('/dashboard?status=pending_review');
    } catch (err) {
      console.error('Error saving and inviting CA:', err);
      alert('Failed to save and invite CA. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      if (currentFilingId) {
        await submitTaxFiling(currentFilingId);
      } else {
        // Create filing if it doesn't exist
        const newFiling = await createTaxFiling({
          personalInfo: filingData.personalInfo,
          income: filingData.income,
          deductions: filingData.deductions,
          taxPaid: filingData.taxPaid,
          taxRegime: filingData.taxRegime,
          taxableIncome: totals.taxableIncome,
          taxLiability: calculatedTax,
          status: 'submitted'
        });
        setCurrentFilingId(newFiling.id);
      }
      
      alert('Your tax filing has been submitted successfully! You will receive confirmation shortly.');
      navigate('/dashboard?status=submitted');
    } catch (err) {
      console.error('Error submitting:', err);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MODIFICATION START ---
  /**
   * Main handler for downloading the ITR JSON file
   * This is called when user clicks "Download ITR JSON File"
   */
  const handleFileITR = () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'This will generate a JSON file for manual upload to the Income Tax Portal.\n\n' +
      'Please ensure all information is correct. You will be responsible for uploading this file to the official government e-filing website.'
    );
    
    if (!confirmed) return;
    
    setIsSubmitting(true); // Show "Generating..."
    
    try {
      // Step 1: Validate data
      setEfilingStatus({ stage: 'validating', message: 'Validating your tax return data...' });
      const validationErrors = validateITRBeforeSubmission();
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(', ')}`);
      }
      
      // Step 2: Transform to ITR JSON format
      setEfilingStatus({ stage: 'transforming', message: 'Preparing ITR JSON in government format...' });
      const itrJSON = transformToITRJSON();
      
      // Step 3: Create JSON string
      const jsonString = JSON.stringify(itrJSON, null, 2); // Pretty-print for readability
      
      // Step 4: Create Blob and download link
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      
      // Create a dynamic filename
      const pan = filingData.personalInfo.pan || 'YOUR_PAN';
      const ay = '2024-25';
      a.href = url;
      a.download = `ITR1_AY${ay}_${pan}.json`;
      
      // Step 5: Trigger download
      document.body.appendChild(a); // Append to body (required for Firefox)
      a.click();
      
      // Step 6: Cleanup
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Step 7: Show success
      setEfilingStatus({ 
        stage: 'success', 
        message: 'JSON file generated successfully! You can now upload it to the e-filing portal.',
        acknowledgmentNumber: null // Set to null to indicate download, not submission
      });
      
      // Note: The success modal has its own close/navigation buttons.
      // We don't reset isSubmitting here so the modal stays open.
      
    } catch (error) {
      console.error('ITR JSON Generation error:', error);
      setEfilingStatus({ 
        stage: 'error', 
        message: error.message || 'Failed to generate ITR JSON file. Please check your data.' 
      });
      // isSubmitting will be reset when the user closes the error modal
    }
  };
  // --- MODIFICATION END ---

  const taxPayable = Math.max(0, calculatedTax - totals.totalTaxPaid);

  // Step 1: Document Upload
  const renderDocumentUpload = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Upload Your Form-16</h3>
        <p className="text-[#3d5a80] max-w-2xl mx-auto">
          Upload your Form-16 documents to automatically fill your details. You can upload multiple Form-16s if you've switched jobs during the financial year.
          <strong className="block mt-2 text-[#3d5a80]">
            We'll automatically extract data from all uploaded Form-16s
          </strong>
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-[#98c1d9] rounded-xl p-8 text-center hover:border-[#3d5a80] transition-colors bg-[#e0fbfc]">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#3d5a80]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadIcon />
          </div>
          <h4 className="text-lg font-semibold text-[#293241] mb-2">
            {uploadedFiles.length > 0 ? 'Upload More Form-16s' : 'Upload Form-16 Documents'}
          </h4>
          <p className="text-[#3d5a80] mb-4">
            {uploadedFiles.length > 0 
              ? 'Add more Form-16 documents if you have multiple employers'
              : 'Drag & drop your files here or click to browse'
            }
          </p>
          
          <label className="bg-[#3d5a80] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#2d4566] transition-colors cursor-pointer inline-block border border-[#3d5a80]">
            {uploadedFiles.length > 0 ? 'Add More Files' : 'Choose Files'}
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
          <p className="text-sm text-[#3d5a80] mt-3">Max file size: 10MB per file</p>
          {uploadedFiles.length > 0 && (
            <p className="text-sm text-green-600 mt-2 flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              {uploadedFiles.length} Form-16(s) uploaded successfully
            </p>
          )}
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-[#293241]">
              Uploaded Form-16 Documents ({uploadedFiles.length})
            </h4>
            {autoFillComplete && (
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium border border-green-200 flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Data Auto-filled
              </span>
            )}
          </div>
          <div className="space-y-3">
            {uploadedFiles.map((file, index) => (
              <div key={file.id} className="flex items-center justify-between p-3 bg-[#e0fbfc] rounded-lg border border-[#98c1d9]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
                    <CheckCircleIcon />
                  </div>
                  <div>
                    <p className="font-medium text-[#293241]">
                      Form-16 {uploadedFiles.length > 1 ? `#${index + 1}` : ''} - {file.name}
                    </p>
                    <p className="text-sm text-[#3d5a80]">{file.size} bytes • {file.uploadDate}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-[#3d5a80] hover:text-red-500 transition-colors"
                >
                  <XIcon />
                </button>
              </div>
            ))}
          </div>
          
          {/* Multiple Form-16 Info */}
          {uploadedFiles.length > 1 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <InfoIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
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
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
              <CheckCircleIcon />
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

      {/* CA Review (if available) */}
      {serverFiling && serverFiling.caReview && serverFiling.caReview.comments && serverFiling.caReview.comments.length > 0 && (
        <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
          <h4 className="text-lg font-semibold text-[#293241] mb-4">CA Review</h4>
          <p className="text-sm text-[#3d5a80] mb-4">Status: <span className="font-semibold">{serverFiling.status}</span></p>
          <div className="space-y-3">
            {serverFiling.caReview.comments.map((c, idx) => (
              <div key={idx} className="p-3 border border-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">{c.comment}</p>
                <p className="text-xs text-gray-500 mt-2">{c.section ? `Section: ${c.section}` : ''} {c.createdAt ? ` • ${new Date(c.createdAt).toLocaleString()}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual Entry Option */}
      <div className="text-center">
        <button
          onClick={nextStep}
          className="text-[#3d5a80] hover:text-[#2d4566] font-medium transition-colors"
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
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Personal Information</h3>
        <p className="text-[#3d5a80]">
          {autoFillComplete ? 'Verify your auto-filled personal details' : 'Enter your personal details for tax filing'}
        </p>
      </div>

      {autoFillComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <InfoIcon />
            <span className="text-sm font-medium">Data auto-filled from {uploadedFiles.length} Form-16(s)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">First Name</label>
          <input
            type="text"
            value={filingData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">Last Name</label>
          <input
            type="text"
            value={filingData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">PAN Number</label>
          <input
            type="text"
            value={filingData.personalInfo.pan}
            onChange={(e) => handleInputChange('personalInfo', 'pan', e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors uppercase"
            placeholder="ABCDE1234F"
            maxLength="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">Date of Birth</label>
          <input
            type="date"
            value={filingData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">Email</label>
          <input
            type="email"
            value={filingData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#3d5a80] mb-2">Phone Number</label>
          <input
            type="tel"
            value={filingData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
          />
        </div>
      </div>

      <div className="border-t border-[#98c1d9] pt-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Address Information</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#3d5a80] mb-2">Street Address</label>
            <input
              type="text"
              value={filingData.personalInfo.address.street}
              onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'street', e.target.value)}
              className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">City</label>
              <input
                type="text"
                value={filingData.personalInfo.address.city}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'city', e.target.value)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">State</label>
              <input
                type="text"
                value={filingData.personalInfo.address.state}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'state', e.target.value)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2">Pincode</label>
              <input
                type="text"
                value={filingData.personalInfo.address.pincode}
                onChange={(e) => handleNestedInputChange('personalInfo', 'address', 'pincode', e.target.value)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 3: Income Details
  const renderIncomeDetails = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Income Details</h3>
        <p className="text-[#3d5a80]">
          {autoFillComplete ? 'Verify your auto-filled income details' : 'Enter your income from various sources'}
        </p>
      </div>

      {autoFillComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <InfoIcon />
            <span className="text-sm font-medium">Salary data auto-filled from {uploadedFiles.length} Form-16(s)</span>
          </div>
        </div>
      )}

      {/* Salary Income */}
      <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Salary Income</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(filingData.income.salary).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleNestedInputChange('income', 'salary', key, parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Other Income Sources */}
      <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Other Income Sources</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(filingData.income.otherSources).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2 capitalize">
                {key === 'other' ? 'Other Income' : key} Income
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleNestedInputChange('income', 'otherSources', key, parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Income Summary */}
      <div className="bg-gradient-to-r from-[#3d5a80]/10 to-[#98c1d9]/10 rounded-xl border border-[#3d5a80]/20 p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Income Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#98c1d9]">
            <div className="flex justify-center mb-2">
              <MoneyIcon className="w-6 h-6 text-[#3d5a80]" />
            </div>
            <p className="text-sm text-[#3d5a80]">Salary Income</p>
            <p className="text-lg font-bold text-[#293241]">₹{totals.salaryTotal.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#98c1d9]">
            <div className="flex justify-center mb-2">
              <ChartIcon className="w-6 h-6 text-[#3d5a80]" />
            </div>
            <p className="text-sm text-[#3d5a80]">Other Income</p>
            <p className="text-lg font-bold text-[#293241]">₹{totals.otherSourcesTotal.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#98c1d9]">
            <div className="flex justify-center mb-2">
              <TrendingDownIcon className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm text-[#3d5a80]">Deductions</p>
            <p className="text-lg font-bold text-green-600">₹{totals.totalDeductions.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-[#98c1d9]">
            <div className="flex justify-center mb-2">
              <ScaleIcon className="w-6 h-6 text-[#3d5a80]" />
            </div>
            <p className="text-sm text-[#3d5a80]">Taxable Income</p>
            <p className="text-lg font-bold text-[#3d5a80]">₹{totals.taxableIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Deductions
  const renderDeductions = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Tax Deductions</h3>
        <p className="text-[#3d5a80]">
          {autoFillComplete ? 'Verify your auto-filled deductions' : 'Claim eligible deductions to reduce your taxable income'}
        </p>
      </div>

      {autoFillComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <InfoIcon />
            <span className="text-sm font-medium">Deductions auto-filled from {uploadedFiles.length} Form-16(s)</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(filingData.deductions).map(([key, value]) => (
          <div key={key} className="bg-white rounded-xl border border-[#98c1d9] p-6">
            <h4 className="text-md font-semibold text-[#293241] mb-2">
              Section {key.replace('section', '')}
            </h4>
            <p className="text-sm text-[#3d5a80] mb-4">
              {getDeductionDescription(key)}
            </p>
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange('deductions', key, parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
            />
          </div>
        ))}
      </div>

      {/* Tax Regime Selection */}
      <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Select Tax Regime</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleInputChange('taxRegime', 'new')}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              filingData.taxRegime === 'new' 
                ? 'border-[#3d5a80] bg-[#3d5a80]/10' 
                : 'border-[#98c1d9] hover:border-[#3d5a80]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[#293241]">New Regime</span>
              {filingData.taxRegime === 'new' && (
                <div className="w-6 h-6 bg-[#3d5a80] rounded-full flex items-center justify-center border border-[#3d5a80]">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-[#3d5a80] mb-2">Lower tax rates with limited deductions</p>
            <p className="text-xs text-green-600">Recommended for most taxpayers</p>
          </button>

          <button
            onClick={() => handleInputChange('taxRegime', 'old')}
            className={`p-6 border-2 rounded-xl text-left transition-all ${
              filingData.taxRegime === 'old' 
                ? 'border-[#3d5a80] bg-[#3d5a80]/10' 
                : 'border-[#98c1d9] hover:border-[#3d5a80]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-[#293241]">Old Regime</span>
              {filingData.taxRegime === 'old' && (
                <div className="w-6 h-6 bg-[#3d5a80] rounded-full flex items-center justify-center border border-[#3d5a80]">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-[#3d5a80] mb-2">Higher tax rates with full deductions</p>
            <p className="text-xs text-[#3d5a80]">Choose if you have significant investments</p>
          </button>
        </div>
      </div>
    </div>
  );

  // Step 5: Tax Calculation
  const renderTaxCalculation = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Tax Calculation</h3>
        <p className="text-[#3d5a80]">
          {autoFillComplete ? 'Verify your auto-filled tax payments' : 'Review your tax liability and payments'}
        </p>
      </div>

      {autoFillComplete && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800">
            <InfoIcon />
            <span className="text-sm font-medium">TDS and tax payments auto-filled from {uploadedFiles.length} Form-16(s)</span>
          </div>
        </div>
      )}

      {/* Tax Paid Details */}
      <div className="bg-white rounded-xl border border-[#98c1d9] p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-4">Tax Already Paid</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(filingData.taxPaid).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-[#3d5a80] mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => handleNestedInputChange('taxPaid', '', key, parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-[#98c1d9] rounded-lg focus:ring-2 focus:ring-[#3d5a80] focus:border-[#3d5a80] transition-colors"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Tax Summary */}
      <div className="bg-gradient-to-r from-[#3d5a80]/10 to-[#98c1d9]/10 rounded-xl border border-[#3d5a80]/20 p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-6">Tax Summary</h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-[#98c1d9]">
            <span className="text-[#3d5a80]">Total Tax Calculated</span>
            <span className="text-lg font-bold text-[#293241]">₹{calculatedTax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-[#98c1d9]">
            <span className="text-[#3d5a80]">Tax Already Paid</span>
            <span className="text-lg font-bold text-green-600">₹{totals.totalTaxPaid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-4 bg-white rounded-lg px-4 border border-[#98c1d9]">
            <span className="text-lg font-bold text-[#293241]">Net Tax Payable/Refund</span>
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
        <h3 className="text-2xl font-bold text-[#293241] mb-4">Review Your Filing</h3>
        <p className="text-[#3d5a80]">Verify all information before submission</p>
      </div>

      {autoFillComplete && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center border border-green-200">
              <CheckCircleIcon />
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
        <div className="bg-white rounded-xl border border-[#98c1d9] p-4 text-center">
          <div className="flex justify-center mb-2">
            <MoneyIcon className="w-6 h-6 text-[#3d5a80]" />
          </div>
          <p className="text-sm text-[#3d5a80]">Total Income</p>
          <p className="text-lg font-bold text-[#293241]">₹{totals.totalIncome.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#98c1d9] p-4 text-center">
          <div className="flex justify-center mb-2">
            <TrendingDownIcon className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-sm text-[#3d5a80]">Deductions</p>
          <p className="text-lg font-bold text-green-600">₹{totals.totalDeductions.toLocaleString()}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#98c1d9] p-4 text-center">
          <div className="flex justify-center mb-2">
            <ChartIcon className="w-6 h-6 text-[#3d5a80]" />
          </div>
          <p className="text-sm text-[#3d5a80]">Tax Regime</p>
          <p className="text-lg font-bold text-[#3d5a80] capitalize">{filingData.taxRegime}</p>
        </div>

        <div className="bg-white rounded-xl border border-[#98c1d9] p-4 text-center">
          <div className="flex justify-center mb-2">
            <ScaleIcon className="w-6 h-6 text-red-600" />
          </div>
          <p className="text-sm text-[#3d5a80]">Tax Payable</p>
          <p className="text-lg font-bold text-red-600">₹{taxPayable.toLocaleString()}</p>
        </div>
      </div>

      {/* E-Filing Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <InfoIcon className="w-5 h-5 mr-2" />
          About E-Filing with Income Tax Department
        </h4>
        <div className="space-y-3 text-sm text-blue-800">
          <p>• Your return will be submitted directly to the Income Tax Department's e-filing portal</p>
          <p>• You will receive an acknowledgment number (ITR-V) after successful submission</p>
          <p>• E-verification is mandatory within 120 days of filing</p>
          <p>• You can e-verify using Aadhaar OTP, Net Banking, or Bank Account EVC</p>
          <p>• All data is encrypted and transmitted securely to the government portal</p>
        </div>
      </div>

      {/* Final Submission */}
      <div className="bg-[#98c1d9]/10 rounded-xl border border-[#98c1d9] p-6">
        <h4 className="text-lg font-semibold text-[#293241] mb-2">Ready to File Your ITR?</h4>
        <p className="text-sm text-[#3d5a80] mb-6">
          Your tax filing will be saved and you can choose to get it reviewed by a CA or submit directly to Income Tax Department.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={handleSaveAndInviteCA}
            disabled={isSubmitting}
            className="flex-1 bg-[#3d5a80] text-white py-4 px-6 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors shadow-sm border border-[#3d5a80] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Save & Invite CA Review'}
          </button>
          <button 
            onClick={handleSaveAndSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-[#e0fbfc] text-[#293241] py-4 px-6 rounded-lg font-semibold hover:bg-[#98c1d9] transition-colors shadow-sm border border-[#98c1d9] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Save & Submit Directly'}
          </button>
        </div>
        <p className="text-xs text-[#3d5a80] mt-4 text-center">
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
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-[#98c1d9]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-[#3d5a80] hover:text-[#293241] transition-colors"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="h-6 w-px bg-[#98c1d9]"></div>
              <div>
                <h1 className="text-xl font-bold text-[#293241]">Income Tax Filing</h1>
                <p className="text-sm text-[#3d5a80]">Assessment Year 2024-2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#3d5a80]">Progress</p>
              <p className="text-sm font-semibold text-[#293241]">{currentStep} of {steps.length} steps</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-[#e0fbfc] -z-10"></div>
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all border-2 ${
                  currentStep >= step.number
                    ? 'bg-[#3d5a80] text-white shadow-md border-[#3d5a80]'
                    : 'bg-white border-[#98c1d9] text-[#3d5a80]'
                }`}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold ${
                  currentStep >= step.number ? 'text-[#3d5a80]' : 'text-[#3d5a80]'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-[#3d5a80] mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-sm border border-[#98c1d9] p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-8 py-3 rounded-lg font-semibold transition-all border ${
              currentStep === 1
                ? 'text-[#98c1d9] cursor-not-allowed border-[#e0fbfc]'
                : 'text-[#293241] hover:bg-[#e0fbfc] border-[#98c1d9]'
            }`}
          >
            Previous
          </button>

          {/* --- MODIFICATION START --- */}
          {/* Updated button to call handleFileITR (download) instead of direct submit */}
          <button
            onClick={currentStep === steps.length ? handleFileITR : nextStep}
            disabled={isSubmitting}
            className="bg-[#3d5a80] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2d4566] transition-colors shadow-sm border border-[#3d5a80] disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {currentStep === steps.length && (
              <DownloadIcon className="w-5 h-5 mr-2" />
            )}
            {isSubmitting ? 'Generating...' : currentStep === steps.length ? 'Download ITR JSON File' : 'Continue'}
          </button>
          {/* --- MODIFICATION END --- */}

        </div>
      </div>

      {/* Loading Overlay */}
      {isUploading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center border border-[#98c1d9]">
            <div className="w-16 h-16 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-[#293241] mb-2">
              Processing {uploadedFiles.length > 0 ? 'Additional ' : ''}Form-16(s)
            </h3>
            <p className="text-[#3d5a80]">
              {uploadedFiles.length > 0 
                ? `We're extracting data from the new Form-16 document${uploadedFiles.length > 1 ? 's' : ''}...`
                : 'We\'re extracting your personal details, salary information, deductions, and tax data...'
              }
            </p>
          </div>
        </div>
      )}

      {/* E-Filing Status Overlay */}
      {isSubmitting && efilingStatus && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center border border-[#98c1d9]">
            {efilingStatus.stage === 'error' ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Submission Failed</h3>
                <p className="text-red-600 mb-4">{efilingStatus.message}</p>
                <button
                  onClick={() => {
                    setIsSubmitting(false);
                    setEfilingStatus(null);
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </>
            // --- MODIFICATION START ---
            // Updated success modal to handle both API submission and manual download
            ) : efilingStatus.stage === 'success' ? (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  {efilingStatus.acknowledgmentNumber ? 'ITR Filed Successfully!' : 'File Generated!'}
                </h3>
                <p className="text-green-700 mb-2">{efilingStatus.message}</p>
                
                {efilingStatus.acknowledgmentNumber ? (
                  // Case 1: Successful API submission
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                      <p className="text-sm font-semibold text-green-900">Acknowledgment Number:</p>
                      <p className="text-lg font-bold text-green-800">{efilingStatus.acknowledgmentNumber}</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Please e-verify your return within 120 days using Aadhaar OTP, Net Banking, or send ITR-V to CPC Bangalore.
                    </p>
                    <button
                      onClick={() => handleEVerification(efilingStatus.acknowledgmentNumber)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      E-Verify Now
                    </button>
                  </>
                ) : (
                  // Case 2: Successful JSON download
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                      <p className="text-sm font-semibold text-green-900">Download Started</p>
                      <p className="text-sm text-green-800">Your ITR JSON file is downloading.</p>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      You can now manually upload this file to the official Income Tax e-filing portal.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitting(false);
                        setEfilingStatus(null);
                        navigate('/dashboard?status=downloaded');
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Go to Dashboard
                    </button>
                  </>
                )}
              </>
            // --- MODIFICATION END ---
            ) : (
              <>
                <div className="w-16 h-16 border-4 border-[#3d5a80] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-[#293241] mb-2">
                  {efilingStatus.stage === 'validating' && 'Validating Data'}
                  {efilingStatus.stage === 'transforming' && 'Preparing ITR JSON'}
                  {efilingStatus.stage === 'encrypting' && 'Encrypting Data'}
                  {efilingStatus.stage === 'saving' && 'Saving to Database'}
                  {efilingStatus.stage === 'authenticating' && 'Authenticating'}
                  {efilingStatus.stage === 'submitting' && 'Submitting to Income Tax Dept'}
                  {efilingStatus.stage === 'processing' && 'Processing Response'}
                </h3>
                <p className="text-[#3d5a80]">{efilingStatus.message}</p>
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    Please do not close this window or refresh the page
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaxFilingPage;