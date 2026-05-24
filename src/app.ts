import storage from './core/storage';
import aiBridge from './core/ai-bridge';
import finance from './services/finance';
import packing from './services/packing';
import crm from './modules/crm';
import dashboard from './modules/dashboard';

class TravelTechApp {
    private state: any;

    constructor() {
        this.state = storage.loadState() || this.createDefaultState();
        crm.initGroup(this.state);
    }

    private createDefaultState() {
        return {
            mode: 'ORGANIZER',
            destination: 'Toronto',
            duration: 3,
            budget: { total: 0, stayTotal: 0 },
            checklist: [],
            group: []
        };
    }

    async initTrip(destination: string, mode: string) {
        this.state.mode = mode;
        this.state.destination = destination;

        const discovery = await aiBridge.discover(destination, mode);
        this.state.budget = finance.calculateEstimatedCost(discovery, this.state.duration);
        this.state.checklist = packing.generateList(discovery.weather.advice, this.state.duration);

        storage.saveState(this.state);
    }

    switchMode(mode: string) {
        this.state.mode = mode;
        storage.saveState(this.state);
    }

    getDashboard() {
        switch(this.state.mode) {
            case 'SOLO':
                return dashboard.generateSoloReport(this.state);
            case 'FAMILY':
                return dashboard.generateFamilyReport(this.state);
            case 'ORGANIZER':
            default:
                return dashboard.generateOrganizerReport(this.state);
        }
    }

    getState() {
        return this.state;
    }
}

export default new TravelTechApp();
