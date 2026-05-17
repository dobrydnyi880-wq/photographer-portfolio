import FormData from 'form-data';
import mime from 'mime-types';
import { Readable } from 'stream';

export class DataTransportService {
    private boundary: string;

    constructor() {
        this.boundary = '--------------------------TravelTech' + Date.now().toString(16);
    }

    createTravelPackage(metadata: any, mediaStream: Readable | null, fileName: string): FormData {
        const form = new FormData();
        form.setBoundary(this.boundary);

        form.append('context', JSON.stringify(metadata), {
            contentType: 'application/json'
        });

        if (mediaStream) {
            const contentType = mime.lookup(fileName) || 'application/octet-stream';
            form.append('artifact', mediaStream, {
                filename: fileName,
                contentType: contentType
            });
        }

        return form;
    }

    calculatePackageSize(form: FormData, callback: (err: Error | null, length: number) => void): void {
        form.getLength((err, length) => {
            if (err) return callback(err, 0);
            callback(null, length);
        });
    }

    dispatch(form: FormData, endpoint: string, callback?: (err: Error | null, res: any) => void): void {
        console.log(`[Transport] Dispatching package to: ${endpoint}`);

        // Mock dispatch
        setTimeout(() => {
            console.log(`[Transport] Transfer successful to ${endpoint}`);
            if (callback) {
                callback(null, { statusCode: 200, resume: () => {} });
            }
        }, 500);
    }
}

export default new DataTransportService();
