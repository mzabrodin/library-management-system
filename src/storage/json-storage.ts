import {existsSync, mkdirSync, readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {Identifiable} from '../types';

export class JsonStorage<T extends Identifiable> {
    private readonly filePath: string;
    private readonly data: Map<string, T>;

    constructor(fileName: string) {
        const dataDir = path.join(process.cwd(), 'data');
        this.filePath = path.join(dataDir, `${fileName}.json`);
        this.data = new Map<string, T>();

        if (!existsSync(dataDir)) {
            mkdirSync(dataDir, {recursive: true});
        }

        this.loadSync();
    }

    private loadSync() {
        if (!existsSync(this.filePath)) {
            writeFileSync(this.filePath, JSON.stringify([]));
            return;
        }

        const fileContent = readFileSync(this.filePath, 'utf-8');

        const items = JSON.parse(fileContent) as T[];

        if (Array.isArray(items)) {
            items.forEach(item => this.data.set(item.id, item));
        }
    }

    public saveToFile() {
        const items = Array.from(this.data.values());
        writeFileSync(this.filePath, JSON.stringify(items, null, 2));
    }

    public getAll(): T[] {
        return Array.from(this.data.values());
    }

    public getById(id: string): T | undefined {
        return this.data.get(id);
    }

    public saveToMap(item: T) {
        this.data.set(item.id, item);
    }

    public deleteById(id: string): boolean {
        const result = this.data.delete(id);
        if (result) {
            this.saveToFile();
        }

        return result;
    }
}