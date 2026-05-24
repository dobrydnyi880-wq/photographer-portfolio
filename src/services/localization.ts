class LocalizationService {
    private baseCurrency: string;

    constructor() {
        this.baseCurrency = 'USD';
    }

    getCurrencyByCountry(countryCode: string): string {
        const map: { [key: string]: string } = {
            'CA': 'CAD',
            'US': 'USD',
            'PL': 'PLN',
            'DE': 'EUR'
        };
        return map[countryCode] || this.baseCurrency;
    }

    formatPrice(amountInUSD: number, userCurrency: string): { amount: string; currency: string } {
        const rates: { [key: string]: number } = { 'CAD': 1.35, 'PLN': 4.02, 'USD': 1.0, 'EUR': 0.92 };
        const rate = rates[userCurrency] || 1.0;

        return {
            amount: (amountInUSD * rate).toFixed(2),
            currency: userCurrency
        };
    }
}

export default new LocalizationService();
