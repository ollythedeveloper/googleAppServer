const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

const googleApps = require('./playstore.js');

app.get('/apps', (req, res) => {
    const { sort, genre } = req.query;

    if(sort) {
        if(!['Rating', 'App'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be one of App or Rating');
        }
    }
    if(genre) {
        if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genre)) {
            return res
                .status(400)
                .send('Genre must be one of Action, Puzzle, Strategy, Casual, Arcade or Card');
        }
    }

    results = googleApps

    if (sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
            });
    }

    if(genre) {
        results = googleApps
            .filter(gApp =>
                gApp
                    .Genres
                    .includes(genre));
    }

    res.json(results);
});

module.exports = app;