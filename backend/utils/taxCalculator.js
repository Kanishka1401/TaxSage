class TaxCalculator {
    static calculateTax(income, deductions, regime = 'new') {
        const taxableIncome = income - deductions;
        
        if (regime === 'new') {
            return this.calculateNewRegimeTax(taxableIncome);
        } else {
            return this.calculateOldRegimeTax(taxableIncome, deductions);
        }
    }
    
    static calculateNewRegimeTax(income) {
        let tax = 0;
        
        if (income <= 300000) {
            tax = 0;
        } else if (income <= 600000) {
            tax = (income - 300000) * 0.05;
        } else if (income <= 900000) {
            tax = 15000 + (income - 600000) * 0.10;
        } else if (income <= 1200000) {
            tax = 45000 + (income - 900000) * 0.15;
        } else if (income <= 1500000) {
            tax = 90000 + (income - 1200000) * 0.20;
        } else {
            tax = 150000 + (income - 1500000) * 0.30;
        }
        
        return tax;
    }
    
    static calculateOldRegimeTax(income, deductions) {
        // Simplified old regime calculation
        let tax = 0;
        
        if (income <= 250000) {
            tax = 0;
        } else if (income <= 500000) {
            tax = (income - 250000) * 0.05;
        } else if (income <= 1000000) {
            tax = 12500 + (income - 500000) * 0.20;
        } else {
            tax = 112500 + (income - 1000000) * 0.30;
        }
        
        return tax;
    }
    
    static compareRegimes(income, deductions) {
        const newRegimeTax = this.calculateNewRegimeTax(income - deductions);
        const oldRegimeTax = this.calculateOldRegimeTax(income, deductions);
        
        return {
            newRegime: newRegimeTax,
            oldRegime: oldRegimeTax,
            recommended: newRegimeTax <= oldRegimeTax ? 'new' : 'old',
            savings: Math.abs(newRegimeTax - oldRegimeTax)
        };
    }
}

module.exports = TaxCalculator;