class CRMService {
    private group: any[] = [];

    initGroup(state: any): void {
        if (state && state.group) {
            this.group = state.group;
        } else {
            this.group = [
                { id: 'org_1', name: 'You (Organizer)', role: 'admin', isPacked: true, balance: 0, billing: { deposit: { isPaid: true, amount: 0 }, boarding: { isPaid: true, amount: 0 }, stay: { isPaid: true, amount: 0 } }, financialSummary: { totalDebt: 0, paidSoFar: 0, organizerMargin: 0 } }
            ];
        }
    }

    addPassenger(userData: { name: string; source: string; handle: string }): any {
        const newPassenger = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: userData.name,
            platform: userData.source,
            handle: userData.handle,
            isPacked: false,
            balance: 0,
            billing: {
                deposit: { isPaid: false, amount: 50 },
                boarding: { isPaid: false, amount: 0 },
                stay: { isPaid: false, amount: 0 }
            },
            financialSummary: {
                totalDebt: 50,
                paidSoFar: 0,
                organizerMargin: 0
            }
        };

        this.group.push(newPassenger);
        console.log(`[CRM] Added participant: ${newPassenger.name} (${newPassenger.platform})`);
        return newPassenger;
    }

    getGroupStatus(): any {
        const total = this.group.length;
        const packed = this.group.filter(p => p.isPacked).length;

        return {
            totalCount: total,
            readyCount: packed,
            pendingList: this.group.filter(p => !p.isPacked).map(p => p.name)
        };
    }

    getRawGroupData(): any[] {
        return this.group;
    }
}

export default new CRMService();
