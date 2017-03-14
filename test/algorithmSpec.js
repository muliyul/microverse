Promise = require('bluebird');
let {Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;
let StringOptimizer = require('../example').StringOptimizer;
let expect = require('chai').expect;

describe('Algorithm', function () {
    it('Constructor should throw an error if missing required options', function () {
        expect(() => {
            new Algorithm({
                population: [],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [[1, 2, 3]],
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [[1, 2, 3]],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [[1, 2, 3]],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [[1, 2, 3]],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                }
            })
        }).to.throw(Error);
    });

    it('Should generate generations with the generator api', function () {
        let generation = StringOptimizer('wubba lubba dub dub').generator().next().value;
        return generation.then(info => {
            expect(info).to.have.all.keys('generation', 'leader', 'parents', 'population');
        });
    });

    it('Should copy the best solutions to the next generation', function () {
        let gen = StringOptimizer('wubba lubba dub dub').generator();
        return gen.next().value.then(info1 => {
            for (let i = 0; i < info1.parents.length; i++)
                expect(info1.population).to.deep.include(info1.parents[i]);
        });
    });

    it('Should emit evaluation, selection, crossover, generation events', function () {
        let alg = StringOptimizer('wubba lubba dub dub');
        let gen = alg.generator();
        let defers = [];
        for (let i = 0; i < 4; i++)
            defers.push(Promise.defer());
        alg.once('evaluation', info=>defers[0].resolve(info));
        alg.once('selection', info=>defers[1].resolve(info));
        alg.once('crossover', info=>defers[2].resolve(info));
        alg.once('generation', info=>defers[3].resolve(info));
        gen.next();
        return Promise.all(defers.map(p => p.promise)).then(results => {
            for (let i = 0; i < results.length; i++) {
                expect(results[i]).to.exist
            }
        });
    })
});