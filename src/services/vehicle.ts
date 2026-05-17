export interface VehicleProfile {
    make: string;
    model: string;
    type: 'ICE' | 'EV';
    currentLevel: number;
    consumptionRate: number;
}

class VehicleService {
    private profile: VehicleProfile | null = null;
    private fuelThreshold = 0.15;

    setVehicleProfile(data: { make: string; model: string; type: 'ICE' | 'EV'; currentLevel?: number }): void {
        this.profile = {
            make: data.make,
            model: data.model,
            type: data.type,
            currentLevel: data.currentLevel || 100,
            consumptionRate: this._lookupConsumption(data.make, data.model)
        };
        console.log(`[Vehicle] Profile set: ${data.make} ${data.model} (${data.type})`);
    }

    private _lookupConsumption(make: string, model: string): number {
        const mockDb: { [key: string]: number } = {
            'Tesla_Model3': 15,
            'Toyota_Camry': 8.5
        };
        const key = `${make}_${model}`;
        return mockDb[key] || 10;
    }

    checkEnergyReserve(distanceKm: number): { status: string; type?: string; message?: string } {
        if (!this.profile) return { status: 'ok' };

        const consumption = (distanceKm / 100) * this.profile.consumptionRate;
        const remainingRange = (this.profile.currentLevel / 100) * 500;

        if (remainingRange - distanceKm < 50) {
            return {
                status: 'warning',
                type: this.profile.type === 'EV' ? 'CHARGER_REQUIRED' : 'FUEL_REQUIRED',
                message: `Warning: Range is ${remainingRange.toFixed(0)} km. Recommended to refuel/recharge.`
            };
        }
        return { status: 'ok' };
    }
}

export default new VehicleService();
