let bluebird = require('bluebird');
let {Chromosome, Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;
let async = require('async');
bluebird.promisifyAll(async, {suffix: 'Promise'});

module.exports = function (target) {
    let dnaLength = 5;
    let population = [];

    for (let i = 0; i < 10; i++) {
        let dna = [];
        for (let j = 0; j < Math.ceil(Math.random() * dnaLength); j++) {
            dna.push(-3 + Math.floor(Math.random() * 6));
        }
        population.push(dna);
    }

    return new Algorithm({
        population,
        crossover: Crossovers.Uniform,
        selector: Selectors.Elitism(2),
        mutator: function (dna, done) {
            if (Math.random() >= .1)
                return done();
            let i = Math.floor(Math.random() * dna.length);
            if (Math.random() < .5)
                dna[i] += Math.random() < .5 ? 1 : -1;
            else
                dna.splice(i, 0, -3 + Math.floor(Math.random() * 6));
            return done(null, dna);
        },
        fitnessFn: function (dna, done) {
            let diffSum = target.map(p => p[0]).map(x => {
                return dna.reduce((p, n, i, dna) => {
                    return p + dna[i] * Math.pow(x, i);
                });
            }).map((fx, i) => {
                return Math.pow(fx - target[i][1], 2);
            }).reduce((s, n) => s + n);

            let rms = Math.sqrt(1 / dna.length * diffSum);

            done(null, -rms);
        },
        stopCriteria: function (leader, population) {
            return Math.abs(leader._fitness) < .5;
        }
    });

};