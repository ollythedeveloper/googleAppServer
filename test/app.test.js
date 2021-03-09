const supertest = require('supertest');
const app = require('../app');
const { expect } = require('chai');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
            .get('/apps')
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array')
                expect(res.body).to.have.lengthOf.at.least(1);
                const gApp = res.body[0];
                expect(gApp).to.include.all.keys(
                    'App', 'Category', 'Rating', 'Genres'
                )
            });
    });

    it('should be 400 if sort is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'WRONG' })
            .expect(400, 'Sort must be one of App or Rating')
    });

    it('should be 400 if genre is incorrect', () => {
        return supertest(app)
            .get('/apps')
            .query({ genre: 'WRONG'})
            .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade or Card')
    });

    it('should sort by app', () => {
        return supertest(app)
            .get('/apps')
            .query({ sort: 'App' })
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
                expect(res.body).to.be.an('array');
                let sorted = true;

                let i = 0;
                while(i < res.body.length - 1){
                    const appAtI = res.body[i];
                    const appAtIPlus1 = res.body[i + 1];
                    if(appAtIPlus1.App < appAtI.App) {
                        sorted = false;
                        break;
                    }
                    i++;
                }
                expect(sorted).to.be.true;
            })
    })

})