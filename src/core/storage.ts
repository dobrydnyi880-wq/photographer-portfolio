import fs from 'fs';
import path from 'path';

class StorageService {
    private statePath: string;

    constructor() {
        this.statePath = path.join(__dirname, '../../session.json');
    }

    saveState(data: any): void {
        try {
            const snapshot = JSON.stringify(data, null, 2);
            fs.writeFileSync(this.statePath, snapshot, 'utf8');
            console.log('[Storage] State successfully saved to session.json');
        } catch (err: any) {
            console.error('[Storage] Error during save:', err.message);
        }
    }

    loadState(): any | null {
        if (!fs.existsSync(this.statePath)) {
            return null;
        }
        try {
            const data = fs.readFileSync(this.statePath, 'utf8');
            return JSON.parse(data);
        } catch (err: any) {
            console.error('[Storage] Error reading state:', err.message);
            return null;
        }
    }

    clear(): void {
        if (fs.existsSync(this.statePath)) {
            fs.unlinkSync(this.statePath);
            console.log('[Storage] State cleared');
        }
    }
}

export default new StorageService();
