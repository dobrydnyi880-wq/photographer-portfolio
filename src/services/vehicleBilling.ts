export interface CarConfig {
    consumption: number;
    fuelPrice: number;
    parking?: number;
    tolls?: number;
}

class VehicleBilling {
    calculateBoardingPass(carData: CarConfig, distance: number, passengers: number): any {
        const fuelCost = (distance / 100) * carData.consumption * carData.fuelPrice;
        const totalCarExpenses = fuelCost + (carData.parking || 0) + (carData.tolls || 0);

        const seatPrice = totalCarExpenses / passengers;

        return {
            type: 'BOARDING_BILL',
            item: 'Car Seat (Fuel + Parking)',
            total: totalCarExpenses,
            perPerson: seatPrice,
            details: `Route: ${distance}km, Consumption: ${carData.consumption}L/100km`
        };
    }
}

export default new VehicleBilling();
