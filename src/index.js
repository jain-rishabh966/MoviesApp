import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'typeface-roboto';
import { BrowserRouter } from 'react-router-dom';

import registerServiceWorker from './registerServiceWorker';
import Controller from './screens/Controller';

ReactDOM.render(
    <BrowserRouter>
        <Controller />
    </BrowserRouter>, document.getElementById('root'));

registerServiceWorker();
