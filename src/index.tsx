import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './app/endless-tic-tac-toe/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'inversify-react';
import container from './inversify.config';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <Provider container={container}>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
