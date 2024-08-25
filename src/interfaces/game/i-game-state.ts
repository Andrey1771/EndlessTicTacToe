export interface GameData {
    currentPlayer: string;
    crosses: string;
    zeros: string;
}

export interface IGameState {
    get state(): GameData; // TODO Надо подумать и вынести или объединить? это же данные между игрой и сохранением, они нужны сохранению
}