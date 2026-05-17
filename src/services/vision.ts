import transport from '../core/transport';
import { Readable } from 'stream';

class VisionService {
    verifyItem(itemId: string, imageStream: Readable): Promise<any> {
        console.log(`[Vision] Starting verification for item: ${itemId}...`);

        const metadata = {
            action: 'VISION_CHECK',
            params: {
                itemId: itemId,
                expected: itemId === 'doc_id' ? 'Passport/ID' : 'Object',
                timestamp: Date.now()
            }
        };

        const form = transport.createTravelPackage(metadata, imageStream, `verify_${itemId}.jpg`);

        return new Promise((resolve, reject) => {
            transport.dispatch(form, 'https://api.traveltech.ai/v1/vision/verify', (err, res) => {
                if (err) return reject(err);
                this._mockVisionResponse(resolve);
            });
        });
    }

    private _mockVisionResponse(resolve: (value: any) => void): void {
        setTimeout(() => {
            resolve({
                verified: true,
                confidence: 0.98,
                message: "Item successfully recognized and verified."
            });
        }, 1500);
    }
}

export default new VisionService();
