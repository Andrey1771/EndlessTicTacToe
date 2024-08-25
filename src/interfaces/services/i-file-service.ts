import { GameData } from "../game/i-game-state";

export interface IFileService {
    saveToFile(fileName: string, data: GameData): void;
    loadFromFile(file: File): Promise<GameData>;
}

export { GameData };
