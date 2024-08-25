import {GameData} from "./i-game-state";

export interface IGameDataLoader {
    load(gameData: GameData): void;
}
