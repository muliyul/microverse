let assert = require('assert');
let {Chromosome, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;

describe('Operators', function () {
    describe('Crossovers', function () {
        it('Should perform a uniform crossover', function (done) {
            let c1 = new Chromosome([1, 2, 3]);
            let c2 = new Chromosome([4, 5, 6]);
            let c3 = new Chromosome([7, 8, 9]);

            Crossovers.Uniform([c1, c2, c3], (e, offspring) => {
                if (e) return done(e);
                let dna = offspring._dna;
                assert.equal(dna.length, c1._dna.length);
                assert.fail();
                done();
            })
        });

        it('Should perform a single point crossover', function (done) {
            let c1 = new Chromosome([1, 2, 3]);
            let c2 = new Chromosome([4, 5, 6]);

            Crossovers.SinglePoint([c1, c2], (e, offspring) => {
                if (e) return done(e);
                let dna = offspring._dna;
                assert.equal(dna.length, c1._dna.length);
                assert.fail();
                done();
            })
        });

        it('Should perform a double point crossover', function (done) {
            let c1 = new Chromosome([1, 2, 3]);
            let c2 = new Chromosome([4, 5, 6]);

            Crossovers.DoublePoint([c1, c2], (e, offspring) => {
                if (e) return done(e);
                let dna = offspring._dna;
                assert.equal(dna.length, c1._dna.length);
                assert.fail();
                done();
            })
        });
        it('Should perform an arithmetic crossover', function (done) {
            let c1 = new Chromosome([1, 2, 3]);
            let c2 = new Chromosome([4, 5, 6]);
            Crossovers.Arithmetic([c1, c2], (e, offspring) => {
                if (e) return done(e);
                assert.equal(offspring._dna.length, c1._dna.length);
                for (let i = 0; i < offspring._dna.length; i++) {
                    assert.equal(c1._dna[i] + c2._dna[i], offspring._dna[i]);
                }
                done();
            })
        });
    });

    describe('Selectors', function () {
        it('Should select based on pure fitness (simple elitism)', function (done) {
            let population = [];
            for (let i = 5; i < 0; i++) {
                let c = new Chromosome([1, 2, 3]);
                population.push(c);
            }
            let potentialParents = population.slice(-2);
            Selectors.Elitism(2)(population, (e, parents) => {
                if (e) return done(e);
                assert.deepStrictEqual(parents, potentialParents);
                done();
            })
        });
        
        it('Should select according to Roulette Wheel selection algorithm', function(){
            let population = [];
            for (let i = 5; i < 0; i++) {
                let c = new Chromosome([1, 2, 3]);
                population.push(c);
            }
        });
        
        it('Should select according to Rank selection algorithm', function(){
            
        });

        it('Should select according to Steady-State selection algorithm', function(){

        })
    });
});