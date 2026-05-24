class RiskAndCancellationService {
    handleCancellation(state: any, passengerId: string): any {
        state.group = state.group.map((person: any) => {
            if (person.id === passengerId) {
                person.status = 'cancelled';
                console.log(`[Risk] Participant ${person.name} cancelled. Deposit remains with the organizer.`);
            }
            return person;
        });

        if (state.mode === 'FAMILY') {
            this._recalculateFamilyVehicleCosts(state);
        }
        return state;
    }

    handleForceMajeure(state: any, expenseAmount: number): any {
        if (state.mode === 'ORGANIZER') {
            console.log(`[Risk] Force majeure of $${expenseAmount}. Deducted from organizer profit.`);
            if (state.budget && state.budget.projectedProfit !== undefined) {
                state.budget.projectedProfit -= expenseAmount;
            }
        } else if (state.mode === 'FAMILY') {
            const activePeople = state.group.filter((p: any) => p.status !== 'cancelled').length;
            const share = expenseAmount / activePeople;
            console.log(`[Risk] Family force majeure. Extra $${share.toFixed(2)} per person.`);
        }
        return state;
    }

    private _recalculateFamilyVehicleCosts(state: any) {
        console.log(`[Risk] Recalculating family vehicle costs for remaining members.`);
    }
}

export default new RiskAndCancellationService();
