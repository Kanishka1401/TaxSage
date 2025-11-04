/**
 * ITR Data Validation Utilities
 * Validates tax return data before submission to Income Tax Portal
 */

/**
 * Validate PAN Number
 * Format: ABCDE1234F (5 letters, 4 digits, 1 letter)
 */
export const validatePAN = (pan) => {
  if (!pan) {
    return { valid: false, error: 'PAN is required' };
  }
  
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  if (!panRegex.test(pan)) {
    return { valid: false, error: 'Invalid PAN format. Format should be: ABCDE1234F' };
  }
  
  return { valid: true };
};

/**
 * Validate Email Address
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
};

/**
 * Validate Phone Number (Indian format)
 * Format: 10 digits
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Invalid phone number. Should be 10 digits starting with 6-9' };
  }
  
  return { valid: true };
};

/**
 * Validate Pincode (Indian format)
 * Format: 6 digits
 */
export const validatePincode = (pincode) => {
  if (!pincode) {
    return { valid: false, error: 'Pincode is required' };
  }
  
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  if (!pincodeRegex.test(pincode)) {
    return { valid: false, error: 'Invalid pincode. Should be 6 digits' };
  }
  
  return { valid: true };
};

/**
 * Validate Date of Birth
 * Should be in the past and person should be at least 18 years old
 */
export const validateDateOfBirth = (dob) => {
  if (!dob) {
    return { valid: false, error: 'Date of birth is required' };
  }
  
  const dobDate = new Date(dob);
  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();
  
  if (dobDate > today) {
    return { valid: false, error: 'Date of birth cannot be in the future' };
  }
  
  if (age < 18) {
    return { valid: false, error: 'Must be at least 18 years old to file ITR' };
  }
  
  if (age > 120) {
    return { valid: false, error: 'Invalid date of birth' };
  }
  
  return { valid: true };
};

/**
 * Validate Complete ITR Data before submission
 */
export const validateITRData = (itrData) => {
  const allErrors = [];
  
  // Validate Personal Information
  if (!itrData.personalInfo) {
    allErrors.push('Personal information is required');
    return { valid: false, errors: allErrors };
  }

  const { personalInfo } = itrData;
  
  // Validate required fields
  if (!personalInfo.firstName || personalInfo.firstName.trim().length === 0) {
    allErrors.push('First name is required');
  }
  
  if (!personalInfo.lastName || personalInfo.lastName.trim().length === 0) {
    allErrors.push('Last name is required');
  }
  
  // Validate PAN
  const panValidation = validatePAN(personalInfo.pan);
  if (!panValidation.valid) {
    allErrors.push(panValidation.error);
  }
  
  // Validate Email
  const emailValidation = validateEmail(personalInfo.email);
  if (!emailValidation.valid) {
    allErrors.push(emailValidation.error);
  }
  
  // Validate Phone
  const phoneValidation = validatePhone(personalInfo.phone);
  if (!phoneValidation.valid) {
    allErrors.push(phoneValidation.error);
  }
  
  // Validate Date of Birth
  const dobValidation = validateDateOfBirth(personalInfo.dateOfBirth);
  if (!dobValidation.valid) {
    allErrors.push(dobValidation.error);
  }
  
  // Validate Address
  if (!personalInfo.address) {
    allErrors.push('Address is required');
  } else {
    if (!personalInfo.address.city || personalInfo.address.city.trim().length === 0) {
      allErrors.push('City is required');
    }
    
    if (!personalInfo.address.state || personalInfo.address.state.trim().length === 0) {
      allErrors.push('State is required');
    }
    
    if (personalInfo.address.pincode) {
      const pincodeValidation = validatePincode(personalInfo.address.pincode);
      if (!pincodeValidation.valid) {
        allErrors.push(pincodeValidation.error);
      }
    }
  }
  
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    errorCount: allErrors.length
  };
};

export default {
  validatePAN,
  validateEmail,
  validatePhone,
  validatePincode,
  validateDateOfBirth,
  validateITRData
};