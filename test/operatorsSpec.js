let expect = require('chai').expect;
let {Operators} = require('../src');
let {Crossovers, Selectors} = Operators;

describe('Operators', function () {
    describe('Crossovers', function () {
        it('Should perform a uniform crossover', function (done) {
            let c1 = [1, 2, 3];
            let c2 = [4, 5, 6];
            let c3 = [7, 8, 9];

            Crossovers.Uniform([c1, c2, c3], (e, offspring) => {
                if (e) return done(e);
                let allPossibilities = c1.concat(c2).concat(c3);
                expect(offspring.length).to.equal(c1.length);
                for (let i = 0; i < offspring.length; i++)
                    expect(allPossibilities).to.include(offspring[i]);
                done();
            })
        });

        it('Should perform a single point crossover', function (done) {
            let c1 = [1, 2, 3];
            let c2 = [4, 5, 6];

            Crossovers.SinglePoint([c1, c2], (e, offspring) => {
                if (e) return done(e);
                let allPossibilities = c1.concat(c2);
                expect(offspring.length).to.equal(c1.length);
                for (let i = 0; i < offspring.length; i++)
                    expect(allPossibilities).to.include(offspring[i]);
                done();
            })
        });

        it('Should perform a double point crossover', function (done) {
            let c1 = [1, 2, 3];
            let c2 = [4, 5, 6];

            Crossovers.DoublePoint([c1, c2], (e, offspring) => {
                if (e) return done(e);
                let allPossibilities = c1.concat(c2);
                expect(offspring.length).to.equal(c1.length);
                for (let i = 0; i < offspring.length; i++)
                    expect(allPossibilities).to.include(offspring[i]);
                done();
            })
        });
        it('Should perform an arithmetic crossover', function (done) {
            let c1 = [1, 2, 3];
            let c2 = [4, 5, 6];
            Crossovers.Arithmetic([c1, c2], (e, offspring) => {
                if (e) return done(e);
                expect(offspring.length).to.equal(c1.length);
                for (let i = 0; i < offspring.length; i++) {
                    expect(c1[i] + c2[i]).to.equal(offspring[i]);
                }
                done();
            })
        });
    });

    describe('Selectors', function () {
        it('Should select based on pure fitness score', function (done) {
            let population = [];
            for (let i = 0; i < 5; i++) {
                let x = [1, 2, 3];
                population.push(x);
            }
            let potentialParents = population.slice(-2);
            Selectors.Elitism(2)(population, (e, parents) => {
                if (e) return done(e);
                expect(parents).to.deep.equal(potentialParents);
                done();
            })
        });

        it('Should select according to Roulette Wheel selection algorithm', function (done) {
            let population = [];
            for (let i = 0; i < 5; i++) {
                let x = [1, 2, 3];
                x._fitness = i;
                population.push(x);
            }
            let nParents = 2;
            Selectors.Roulette(nParents)(population, (e, parents) => {
                if (e) return done(e);
                expect(parents.length).to.equal(nParents);
                done();
            })
        });

        it('Should select according to Rank selection algorithm', function (done) {
            let population = [];
            for (let i = 0; i < 5; i++) {
                let x = [1, 2, 3];
                x._fitness = i;
                population.push(x);
            }
            let nParents = 2;
            Selectors.Rank(nParents)(population, (e, parents) => {
                if (e) return done(e);
                expect(parents.length).to.equal(nParents);
                done();
            });
        });
    });
});