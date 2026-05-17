class GroupFinanceService {
    calculateEstimatedCost(deals: any, days: number): any {
        const flightPrice = parseFloat(deals.flights[0].price.replace('$', ''));
        const stayPricePerNight = parseFloat(deals.stay[0].price.replace('$', ''));

        const nights = days > 1 ? days - 1 : 1;
        const totalStay = stayPricePerNight * nights;

        const currentBudget = flightPrice + totalStay;

        return {
            flight: flightPrice,
            stayTotal: totalStay,
            total: currentBudget,
            currency: 'USD',
            breakdown: `Flight: $${flightPrice} + Stay (${nights} nights): $${totalStay}`
        };
    }

    splitAccommodation(totalCost: number, group: any[], margin: number = 0, isFamily: boolean = false): any[] {
        const participantCount = group.length;
        if (participantCount === 0) return [];

        const activeMargin = isFamily ? 0 : margin;
        const finalPrice = totalCost * (1 + activeMargin);
        const sharePerPerson = finalPrice / participantCount;

        console.log(`[Finance] Accommodation split: $${totalCost} + ${activeMargin * 100}% margin = $${finalPrice}`);
        console.log(`[Finance] Share per participant: $${sharePerPerson.toFixed(2)}`);

        return group.map(person => {
            return {
                id: person.id,
                name: person.name,
                debt: sharePerPerson,
                isPaid: person.role === 'admin'
            };
        });
    }

    splitEqually(totalAmount: number, description: string, group: any[]): any {
        const count = group.length || 2;
        const share = totalAmount / count;

        console.log(`[Family] Expense: ${description}. Split by ${count}. Share: ${share.toFixed(2)}`);

        return {
            description,
            perPerson: share,
            members: group
        };
    }
}

export default new GroupFinanceService();
