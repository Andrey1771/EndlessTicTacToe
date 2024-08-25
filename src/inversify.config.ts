import "reflect-metadata";
import { Container } from "inversify";
import IDENTIFIERS from "./constants/identifiers";
import {FileService} from "./services/FileService";
import {IFileService} from "./interfaces/services/i-file-service";
import { IGame } from "./interfaces/game/i-game";
import { IGameState } from "./interfaces/game/i-game-state";
import {IGameVictoryLogic} from "./interfaces/game/i-game-victory-logic";
import { GameVictoryLogic } from "./game/GameVictoryLogic";
import {GameBasedOnMap} from "./game/GameBasedOnMap";
import {IGameDataLoader} from "./interfaces/game/i-game-json-loader";

const container = new Container();
// Services
container.bind<IFileService>(IDENTIFIERS.IFileService).to(FileService);

// Logic
container.bind<IGameVictoryLogic>(IDENTIFIERS.IGameVictoryLogic).to(GameVictoryLogic);
container.bind<IGame>(IDENTIFIERS.IGame).to(GameBasedOnMap).inSingletonScope();
container.bind<IGameState>(IDENTIFIERS.IGameState).toService(IDENTIFIERS.IGame);
container.bind<IGameDataLoader>(IDENTIFIERS.IGameDataLoader).toService(IDENTIFIERS.IGame);
//container.bind<IGame>(IDENTIFIERS.IGame).to(GameBasedOnBinaryTree).inSingletonScope();
//container.bind<IGameState>(IDENTIFIERS.IGameState).to(GameBasedOnBinaryTree).inSingletonScope(); // TODO А не будут ли ошибки?
export default container;