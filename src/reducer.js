import axios from 'axios';
import React from 'react';
import * as authService from './authService';

const LOGOUT = 'Log Out';
const SIGNIN = 'Sign IN';
const initialState = {
    login: false,
    email: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGOUT:
            // console.log('logout');
            authService.logout();
            return {
                ...state,
                profiles: [...state.profiles, {}],
            };
        case SIGNIN:
            return { ...state, login: true, email: action.data.email };
        // console.log('at redirect');
        default:
            return state;
    }
};


