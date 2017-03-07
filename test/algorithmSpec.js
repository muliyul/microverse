let assert = require('assert');
let {Chromosome, Algorithm, Operators} = require('../lib');
let {Crossovers, Selectors} = Operators;

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


    it('Should converge on the example', function (done) {
        let alg = require('../example');
        alg.on('error', done);
        alg.on('end', info => {
            let solution = info.solution.getDNA().join('');
            assert.equal(solution, 'wubba lubba dub dub');
            done()
        });
        alg.run();
    });
});