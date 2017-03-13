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
                population: [new Chromosome([1, 2, 3])],
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
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
                population: [new Chromosome([1, 2, 3])],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                fitnessFn: function (c) {
                }
            })
        }).to.throw(Error);

        expect(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
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
        let promises = [];
        for (let i = 0; i < 4; i++)
            promises.push(Promise.defer());
        alg.once('evaluation', info => {
            expect(info).to.exist;
            promises[0].resolve();
        });
        alg.once('selection', info => {
            expect(info).to.exist;
            promises[1].resolve();
        });
        alg.once('crossover', info => {
            expect(info).to.exist;
            promises[2].resolve();
        });
        alg.once('generation', info => {
            expect(info).to.exist;
            promises[3].resolve();
        });
        gen.next();
        return Promise.all(promises.map(p => p.promise));
    })
});