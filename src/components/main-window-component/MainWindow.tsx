import GameBoard from "../game-board-component/GameBoard";
import styles from './mainwindow.module.scss';
import Header from "../header-component/Header";
import Footer from "../footer/Footer";

export default function MainWindow() {
    return (
        <div className={styles.mainContainer}>
            <Header/>
            <GameBoard/>
            <Footer/>
        </div>
    );
}