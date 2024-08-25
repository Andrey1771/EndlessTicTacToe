import "reflect-metadata";
import { Container } from "inversify";
import IDENTIFIERS from "./constants/identifiers";
import {FileService} from "./services/FileService";
import {IFileService} from "./interfaces/services/i-file-service";
import { IGame } from "./interfaces/game/i-game";
import { GameBasedOnBinaryTree } from "./game/GameBasedOnBinaryTree";
import { IGameState } from "./interfaces/game/i-game-state";
import {IGameVictoryLogic} from "./interfaces/game/i-game-victory-logic";
import { GameVictoryLogic } from "./game/GameVictoryLogic";

const container = new Container();
// Services
container.bind<IFileService>(IDENTIFIERS.IFileService).to(FileService);

// Logic
container.bind<IGame>(IDENTIFIERS.IGame).to(GameBasedOnBinaryTree).inSingletonScope();
container.bind<IGameState>(IDENTIFIERS.IGameState).to(GameBasedOnBinaryTree).inSingletonScope(); //TODO А не будут ли ошибки?
container.bind<IGameVictoryLogic>(IDENTIFIERS.IGameState).to(GameVictoryLogic).inSingletonScope(); //TODO А не будут ли ошибки?

export default container;