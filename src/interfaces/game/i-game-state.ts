import { Observable } from "rxjs";

export interface GameData {
    currentPlayer: string;
    values: any;
}

export interface GameStateChanged {

}

export interface IGameState {
    get state(): GameData; // TODO Надо подумать и вынести или объединить? это же данные между игрой и сохранением, они нужны сохранению
    get gameStateChanges(): Observable<GameStateChanged>;
}