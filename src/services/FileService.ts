import { injectable } from "inversify";
import {GameData, IFileService} from "../interfaces/services/i-file-service";

@injectable()
export class FileService implements IFileService {
    // TODO разделить логику, получился какой-то менеджер
    public saveToFile(fileName: string, data: GameData): void {
        //const dataStr = JSON.stringify(this._crossBinaryTree?.toJSON());
        // TODO Придумать, как сохранять
        const blob = new Blob([data.currentPlayer, data.crosses, data.zeros], { type: "application/json" });
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
                    const data = JSON.parse(reader.result as string) as GameData;
                    //this._crossBinaryTree?.fromJSON(data); // TODO данные нужно разделить на два в файле при сохранении и загрузки :)
                    resolve(data);
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