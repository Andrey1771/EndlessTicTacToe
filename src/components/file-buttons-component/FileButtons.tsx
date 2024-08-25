import {Component, createRef} from "react";
import styles from './fileButtons.module.scss';
import {IFileService} from "../../interfaces/services/i-file-service";
import IDENTIFIERS from "../../constants/identifiers";
import { IGameState } from "../../interfaces/game/i-game-state";
import {resolve} from "inversify-react";
import { IGameDataLoader } from "../../interfaces/game/i-game-json-loader";

export default class FileButtons extends Component {
    private _fileInputRef = createRef<HTMLInputElement>();
    private get fileInputElement(): HTMLInputElement {
        if (!this._fileInputRef.current) {
            throw new Error("No file input in the file buttons component");
        }
        return this._fileInputRef.current;
    }

    @resolve(IDENTIFIERS.IFileService) private readonly _fileService!: IFileService;
    @resolve(IDENTIFIERS.IGameState) private readonly _gameState!: IGameState
    @resolve(IDENTIFIERS.IGameDataLoader) private readonly _gameDataLoader!: IGameDataLoader

    constructor(props: any) {
        super(props);
    }

    render() {
        console.log(styles);
        return (
            <div className={`${styles.toggleButton} ${styles.rightCenteredElement}`}>
                <button id="save-button" className={styles.bar} onClick={this.onSaveButtonClick.bind(this)}>Сохранить</button>
                <button id="load-button" className={styles.bar} onClick={this.onLoadButtonClick.bind(this)}>Загрузить</button>
                <input type="file" id="file-input" ref={this._fileInputRef} className={styles.bar} style={{display: 'none'}} onChange={this.onFileInputClick.bind(this)}/>
            </div>
        );
    }

    onSaveButtonClick() {
        this._fileService.saveToFile('gameSaveFile.json', this._gameState.state)
    }

    onLoadButtonClick() {
        const fileInput = document.getElementById('file-input') as HTMLInputElement;
        fileInput.click();
    }

    onFileInputClick() {
        const input = this.fileInputElement;
        if (input.files && input.files[0]) {
            this._fileService.loadFromFile(input.files[0])
                .then((gameData) => {
                    this._gameDataLoader.load(gameData);
                })
                .catch(err => console.error("Ошибка загрузки данных:", err));
        }
    }
}