Promise = require('bluebird');
let assert = require('assert');
let {Chromosome, Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;
let exampleAlg = require('../example/string-optimizer.ga');

describe('Algorithm', function () {
    it('Constructor should throw an error if missing required options', function () {
        assert.throws(() => {
            new Algorithm({
                population: [],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        });

        assert.throws(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        });

        assert.throws(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                },
                fitnessFn: function (c) {
                }
            })
        });

        assert.throws(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                fitnessFn: function (c) {
                }
            })
        });

        assert.throws(() => {
            new Algorithm({
                population: [new Chromosome([1, 2, 3])],
                crossover: Crossovers.Uniform,
                selector: Selectors.Elitism(2),
                mutator: function (c, done) {
                }
            })
        });
    });


    it('Should converge on the example', function () {
        return exampleAlg.run().then(info => {
            let solution = info.solution.getDNA().join('');
            assert.equal(solution, 'wubba lubba dub dub');
        });
    });

    it('Should generate generations with the generator api', function () {
        let generation = exampleAlg.generator().next().value;
        return generation.then(info => {
            assert.notEqual(info);
        });
    });

    it('Should preserve the best solution after each generation', function () {
        let gen = exampleAlg.generator();
        let generation1 = gen.next().value;
        let generation2 = gen.next().value;

        let x = [];
        x._fitness = 0;

        return Promise.all([generation1, generation2]).spread((info1, info2) => {
            assert.equal(info2.population.contains(info1.parents), true);
        })
    })
});