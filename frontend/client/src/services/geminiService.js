import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini AI with your API key
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyAH1EskBG1ZQ-fLxo6KY7NtEQdbZmfeeLo');

// Tax-specific context to make Gemini more helpful for tax queries
const TAX_CONTEXT = `
You are TaxSage AI, an expert tax assistant for Indian income tax filing. Your role is to help users with:

1. Income Tax Filing Process and Steps
2. Form-16 Understanding and Upload
3. Tax Deductions (80C, 80D, 24, 80G, etc.)
4. Tax Regimes (Old vs New)
5. Tax Saving Investments
6. ITR Forms and Deadlines
7. TDS and Tax Calculations
8. Document Requirements
9. Common Tax Issues and Solutions

Always provide accurate, helpful information specific to Indian tax laws. If you're unsure about something, suggest consulting a CA for professional advice.

Keep responses concise, practical, and easy to understand. Use bullet points when helpful. Be friendly and professional.
`;

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      systemInstruction: TAX_CONTEXT
    });
    this.chat = null;
  }

  // Initialize a new chat session
  startNewChat() {
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: TAX_CONTEXT }]
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm TaxSage AI, ready to help with Indian income tax queries. How can I assist you with your tax filing today?" }]
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });
  }

  // Send message to Gemini
  async sendMessage(message) {
    try {
      if (!this.chat) {
        this.startNewChat();
      }

      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Fallback responses if API fails
      const fallbackResponses = {
        'form16': 'Form-16 is a certificate issued by your employer showing your salary details and TDS deducted. You can upload it in Step 1 of tax filing to auto-fill your income details.',
        'deduction': 'Common deductions include: 80C (₹1.5L for investments), 80D (health insurance), 24 (home loan interest), 80G (donations).',
        'deadline': 'ITR filing deadline is usually July 31st, but check the official website for updates.',
        'default': 'I apologize, but I\'m having trouble connecting right now. Please try again or contact our support team for immediate assistance.'
      };

      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes('form16')) return fallbackResponses.form16;
      if (lowerMessage.includes('deduction')) return fallbackResponses.deduction;
      if (lowerMessage.includes('deadline')) return fallbackResponses.deadline;
      
      return fallbackResponses.default;
    }
  }

  // Clear chat history
  clearChat() {
    this.chat = null;
  }
}

export default new GeminiService();