/*
 * Created by Artyom Manchenkov
 * artyom@manchenkoff.me
 * manchenkoff.me © 2019
 */

import Vue from 'vue'

// get Vue component files
const files = require.context(
    './components',
    true,
    /\.vue$/i
);

// register each component to the app
files
    .keys()
    .map(key => Vue.component(
        key
            .split('/')
            .pop()
            .split('.')[0],
        files(key).default)
    );

// create a new instance of Vue app
const app = new Vue({
    el: '#vue-app',
});

console.log('Webpack & Vue.js bundle loaded!');