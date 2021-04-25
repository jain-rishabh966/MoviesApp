import React from 'react';
import { Switch, Route } from 'react-router-dom'

import Header from '../common/header/Header';
import Home from './home/Home';
import Details from './details/Details';
import BookShow from './bookshow/BookShow';
import Confirmation from './confirmation/Confirmation';

export default function () {
    return (
        <div>
            <Header />
            <Switch>
                <Route
                    exact path='/'
                    component={Home}
                />
                <Route
                    path='/movie/:id'
                    render={(props) => <Details {...props} />}
                />
                <Route
                    path='/bookshow/:id'
                    render={(props) => <BookShow {...props} />}
                />
                <Route
                    path='/confirm/:id'
                    render={(props) => <Confirmation {...props} />}
                />
            </Switch>
        </div>
    )
}