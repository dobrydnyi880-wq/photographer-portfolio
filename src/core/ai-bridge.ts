import transport from './transport';

class AIBridge {
    private apiEndpoint: string;

    constructor(apiEndpoint?: string) {
        this.apiEndpoint = apiEndpoint || 'https://api.traveltech.ai/v1/discovery';
    }

    async discover(destination: string, mode: string): Promise<any> {
        console.log(`[AI-Bridge] Initiating search for: ${destination} (Mode: ${mode})`);

        const query = {
            action: 'DISCOVER_DESTINATION',
            params: {
                city: destination,
                context: mode,
                timestamp: Date.now()
            }
        };

        const form = transport.createTravelPackage(query, null, 'search_intent.json');

        return new Promise((resolve, reject) => {
            transport.dispatch(form, this.apiEndpoint, (err, res) => {
                if (err) {
                    console.error('[AI-Bridge] Connection error:', err.message);
                    return reject(err);
                }
                this._mockJulesResponse(destination, resolve);
            });
        });
    }

    private _mockJulesResponse(city: string, resolve: (value: any) => void): void {
        setTimeout(() => {
            resolve({
                destination: city,
                weather: {
                    temp: '15°C',
                    status: 'Cloudy',
                    advice: 'Take a light jacket and an umbrella'
                },
                flights: [
                    { provider: 'AirLine X', price: '450$', date: '2026-05-20', deals: 'Best Price' }
                ],
                stay: [
                    { name: 'Sandbox Loft', price: '85$/night', vibe: 'Urban', amenities: ['pool', 'gym'], description: 'Great loft with a pool' }
                ]
            });
        }, 1000);
    }
}

export default new AIBridge();
