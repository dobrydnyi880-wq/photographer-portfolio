import { PackingItem } from './packing';

export interface MicroQuery {
    id: string;
    question: string;
    triggerItems: PackingItem[];
}

class SmartPackingService {
    getMicroQueries(hotelData: any): MicroQuery[] {
        const queries: MicroQuery[] = [];

        const description = hotelData.description ? hotelData.description.toLowerCase() : '';
        const amenities = hotelData.amenities || [];

        if (amenities.includes('pool') || description.includes('pool') || description.includes('бассейн')) {
            queries.push({
                id: 'q_swim',
                question: 'The hotel has a pool. Do you plan to swim?',
                triggerItems: [
                    { id: 'swimwear', name: 'Swimwear', category: 'Clothes', verified: false },
                    { id: 'flipflops', name: 'Flip Flops', category: 'Shoes', verified: false }
                ]
            });
        }

        if (amenities.includes('gym') || description.includes('gym')) {
            queries.push({
                id: 'q_gym',
                question: 'The hotel has a gym. Will you train?',
                triggerItems: [
                    { id: 'sportswear', name: 'Sportswear', category: 'Clothes', verified: false },
                    { id: 'sneakers', name: 'Sneakers', category: 'Shoes', verified: false }
                ]
            });
        }

        return queries;
    }

    applyUserAnswers(baseList: PackingItem[], queryId: string, userConfirmed: boolean, microQueries: MicroQuery[]): PackingItem[] {
        if (!userConfirmed) return baseList;

        const query = microQueries.find(q => q.id === queryId);
        if (query) {
            console.log(`[Packing] User confirmed intent [${queryId}]. Adding special items.`);
            return baseList.concat(query.triggerItems);
        }
        return baseList;
    }
}

export default new SmartPackingService();
