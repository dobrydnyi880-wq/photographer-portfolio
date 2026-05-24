export interface PackingItem {
    id: string;
    name: string;
    category: string;
    verified: boolean;
    vision?: boolean;
    assignedTo?: string;
    lastCheck?: string;
}

class PackingService {
    private items: PackingItem[] = [];

    generateList(weatherAdvice: string, duration: number): PackingItem[] {
        const list: PackingItem[] = [
            { id: 'doc_id', name: 'ID Card / Passport', category: 'Documents', verified: false, vision: true },
            { id: 'powerbank', name: 'Powerbank', category: 'Tech', verified: false, vision: true }
        ];

        const adviceLower = weatherAdvice.toLowerCase();
        if (adviceLower.includes('jacket') || adviceLower.includes('куртку')) {
            list.push({ id: 'jacket', name: 'Light Jacket', category: 'Clothes', verified: false });
        }
        if (adviceLower.includes('umbrella') || adviceLower.includes('зонт')) {
            list.push({ id: 'umbrella', name: 'Compact Umbrella', category: 'Accessories', verified: false });
        }

        if (duration > 3) {
            list.push({ id: 'laundry', name: 'Extra Clothes', category: 'Clothes', verified: false });
        }

        this.items = list;
        return list;
    }

    assignItem(item: PackingItem, userId: string): PackingItem {
        item.assignedTo = userId;
        return item;
    }
}

export default new PackingService();
