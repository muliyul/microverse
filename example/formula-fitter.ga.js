let bluebird = require('bluebird');
let {Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;
let async = require('async');
bluebird.promisifyAll(async, {suffix: 'Promise'});

function derivative(poly, n = 1) {
    for (let i = 0; i < n; i++)
        poly = poly.map((c, i) => c * i).slice(1);
    return poly;
}

module.exports = function (target) {
    let dnaLength = 5;
    let population = [];

    for (let i = 0; i < 10; i++) {
        let dna = [];
        for (let j = 0; j < Math.ceil(Math.random() * dnaLength); j++) {
            let coeff = Math.random() > .5 ? 1 : -1 * Math.ceil(Math.random() * 3);
            dna.push(coeff);
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
                dna[i] += Math.random() > .5 ? Math.random() : -Math.random();
            else if (Math.random() < .5) {
                dna.push(Math.random() > .5 ? 1 : -1)
            } else {
                dna.splice(i, 1);
            }
            return done(null, dna);
        },
        fitnessFn: function (dna, done) {
            let diffSum = target.map(p => p[0]).map(x => {
                return dna.reduce((prev, c, i) => {
                    return prev + c * Math.pow(x, i);
                }, 0);
            }).map((fx, i) => {
                return Math.pow(fx - target[i][1], 2);
            }).reduce((s, n) => s + n, 0);

            let rms = Math.sqrt(1 / dna.length * diffSum);

            done(null, -rms);
        },
        stopCriteria: function (leader, population) {
            return Math.abs(leader._fitness) <= .005;
        }
    });

};