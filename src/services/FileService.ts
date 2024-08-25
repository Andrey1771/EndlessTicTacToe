import { injectable } from "inversify";
import {GameData, IFileService} from "../interfaces/services/i-file-service";

@injectable()
export class FileService implements IFileService {
    public saveToFile(fileName: string, data: GameData): void {
        const jsonString = JSON.stringify(data);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    public loadFromFile(file: File): Promise<GameData> {
        return new Promise((resolve, reject): any => {//TODO
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const parsedData = JSON.parse(reader.result as string);
                    resolve(parsedData);
                } catch (err) {
                    reject(err);
                }
                return null;
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}