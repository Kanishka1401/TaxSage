import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chat = null;
    this.initializeAI();
  }

  initializeAI() {
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  console.log('🔑 API Key Debug:', {
    hasKey: !!apiKey,
    keyLength: apiKey ? apiKey.length : 0,
    keyStartsWith: apiKey ? apiKey.substring(0, 10) : 'none',
    fullKey: apiKey // Remove this line after testing for security
  });
  
  if (!apiKey) {
    console.warn('Gemini API key not configured. Using fallback mode.');
    return;
  }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      });
      
      this.startNewChat();
      console.log('Gemini AI initialized successfully - FREE TIER');
    } catch (error) {
      console.error('Error initializing Gemini AI:', error);
      // Even if there's an error, we can still use fallback mode
    }
  }

  startNewChat() {
    if (this.model) {
      this.chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: "You are TaxSage AI, an expert Indian tax assistant. Keep responses under 500 words and focus on Indian tax laws, deductions, Form-16, ITR filing, and tax planning." }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'm TaxSage AI, your Indian tax expert. I'll provide clear, helpful guidance on income tax filing, deductions (80C, 80D, etc.), tax regimes, Form-16, and compliance. How can I help with your taxes today?" }],
          },
        ],
      });
    }
  }

  async sendMessage(message) {
    // If API is not configured, use smart fallback
    if (!this.model || !this.chat) {
      return this.getSmartFallback(message);
    }

    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Chat error (free tier limit?):', error);
      return this.getSmartFallback(message);
    }
  }
getSmartFallback(message) {
  if (!message) return "Please ask a tax-related question.";
  
  const lowerMessage = message.toLowerCase();
  console.log('Fallback triggered for:', lowerMessage);
  
  // Smart tax-related fallbacks
  if (lowerMessage.includes('form-16') || lowerMessage.includes('form16') || lowerMessage.includes('form 16')) {
    return "Form-16 is a TDS certificate issued by your employer. It contains details of your salary income and tax deducted at source. You need it to file your Income Tax Return (ITR) accurately. Make sure all details in Form-16 match your actual income and deductions.";
  }
  else if (lowerMessage.includes('tax regime') || lowerMessage.includes('old regime') || lowerMessage.includes('new regime')) {
    return "Choose tax regime based on your investments:\n• NEW REGIME: Lower tax rates but very limited deductions\n• OLD REGIME: Higher tax rates but allows full deductions (80C, 80D, HRA, home loan interest, etc.)\n\nGenerally, if you have investments and deductions exceeding ₹2 lakhs annually, the old regime is better. If you have minimal investments, the new regime might save you more tax.";
  }
  else if (lowerMessage.includes('80c') || lowerMessage.includes('deduction') || lowerMessage.includes('tax saving')) {
    return "Section 80C deductions (up to ₹1.5 lakhs per year):\n• PPF (Public Provident Fund)\n• ELSS Mutual Funds\n• Life Insurance Premiums\n• NSC (National Savings Certificate)\n• Tax-saving Fixed Deposits (5-year lock-in)\n• Home Loan Principal Repayment\n• Children's Tuition Fees\n• EPF contributions\n• Sukanya Samriddhi Yojana (SSY)\n• Senior Citizens Savings Scheme";
  }
  else if (lowerMessage.includes('hra') || lowerMessage.includes('house rent') || lowerMessage.includes('rent allowance')) {
    return "HRA (House Rent Allowance) exemption requires rent receipts and actual rent payment. The exempt amount is the minimum of:\n1. Actual HRA received from employer\n2. 50% of salary if living in metro city (40% for non-metro)\n3. Rent paid minus 10% of salary\n\nYou need PAN of landlord if rent exceeds ₹1 lakh per year.";
  }
  else if (lowerMessage.includes('deadline') || lowerMessage.includes('last date') || lowerMessage.includes('due date')) {
    return "For individual taxpayers, the ITR filing deadline is typically July 31st of the assessment year. However, always check the official Income Tax Department website for current year deadlines as they may be extended sometimes.";
  }
  else if (lowerMessage.includes('investment') || lowerMessage.includes('save tax') || lowerMessage.includes('tax plan')) {
    return "Popular tax-saving options:\n• 80C: Up to ₹1.5L (investments listed above)\n• 80D: Health insurance (₹25,000 for self/family, additional for parents)\n• 80CCD(1B): NPS additional ₹50,000\n• 24(b): Home loan interest up to ₹2L\n• HRA: House rent allowance exemption\n• LTA: Leave travel allowance (actual travel costs)";
  }
  else if (lowerMessage.includes('name') || lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    return "Hello Kanishka! I'm TaxSage AI assistant. I can help you with Indian income tax questions about Form-16, tax regimes, deductions (80C, 80D), HRA, investments, filing procedures, and more. What specific tax doubt would you like to discuss?";
  }
  else {
    return "I can help you with various Indian tax topics:\n\n• Form-16 and documents needed\n• Old vs New tax regime selection\n• Section 80C deductions and investments\n• HRA exemption and calculations\n• Home loan benefits\n• Capital gains tax\n• ITR filing process and deadlines\n• Tax saving strategies\n\nWhat specific area would you like to know about?";
  }
}

  clearChat() {
    this.startNewChat();
  }
}

export default new GeminiService();