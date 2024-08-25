import {Component} from "react";
import styles from './header.module.scss';

export default class Header extends Component {

    render() {
        return (
            <header className={styles.header}>
                <div className={styles.logo}>
                    <div className={styles.logoCell}>
                        <div>X</div>
                        <div>/</div>
                        <div>O</div>
                    </div>
                    <div className={styles.logoText}>
                        Tic-Tac-Toe
                    </div>
                </div>
                <nav className={styles.nav}>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </header>
        );
    }
}