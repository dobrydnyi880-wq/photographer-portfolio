class DashboardService {
    generateOrganizerReport(state: any): any {
        if (!state || !state.group) {
            return { error: 'No trip or group data found' };
        }

        const group = state.group;
        let totalCollected = 0;
        let totalExpected = 0;
        let netProfit = 0;
        const debtors = { deposit: [] as string[], boarding: [] as string[], stay: [] as string[] };

        group.forEach((person: any) => {
            if (person.role === 'admin') return;

            const billing = person.billing || { deposit: {}, boarding: {}, stay: {} };
            const financialSummary = person.financialSummary || { totalDebt: 0, paidSoFar: 0, organizerMargin: 0 };

            totalExpected += financialSummary.totalDebt;
            totalCollected += financialSummary.paidSoFar;
            netProfit += financialSummary.organizerMargin || 0;

            if (!billing.deposit.isPaid) debtors.deposit.push(person.name);
            if (!billing.boarding.isPaid) debtors.boarding.push(person.name);
            if (!billing.stay.isPaid) debtors.stay.push(person.name);
        });

        const hotelCost = state.budget ? state.budget.stayTotal : 0;
        const cashDeficit = totalCollected < hotelCost;

        return {
            meta: {
                destination: state.destination,
                mode: state.mode,
                totalPeople: group.length
            },
            financials: {
                collected: totalCollected,
                expected: totalExpected,
                projectedProfit: netProfit,
                hotelCoverage: `${totalCollected}/${hotelCost} USD`,
                status: cashDeficit ? '⚠️ CRITICAL RISK: Not enough to cover hotel booking!' : '✅ Safe: Advance covers booking'
            },
            debtors: debtors
        };
    }

    generateFamilyReport(state: any): any {
        const group = state.group || [];
        const totalCost = (state.budget ? state.budget.total : 0) +
                          group.reduce((sum: number, p: any) => sum + (p.financialSummary?.paidSoFar || 0), 0);

        return {
            meta: { mode: 'FAMILY', destination: state.destination },
            financials: {
                sharedPot: totalCost,
                perPerson: totalCost / (group.length || 1)
            },
            group: group.map((p: any) => p.name)
        };
    }

    generateSoloReport(state: any): any {
        return {
            meta: { mode: 'SOLO', destination: state.destination },
            budget: state.budget ? state.budget.total : 0,
            vehicle: state.vehicleProfile || null
        };
    }
}

export default new DashboardService();
