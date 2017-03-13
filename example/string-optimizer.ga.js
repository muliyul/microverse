let {Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;

module.exports = function (target) {
    let population = [];

    for (let i = 0; i < 5; i++) {
        let a = 'a'.charCodeAt(0);
        let dna = [];
        for (let j = 0; j < target.length; j++) {
            let char = String.fromCodePoint(a + Math.floor(Math.random() * ('z'.charCodeAt(0) - a)));
            dna.push(char);
        }
        population.push(dna);
    }

    return new Algorithm({
        steadyState: true,
        population: population,
        crossover: Crossovers.Uniform,
        selector: Selectors.Elitism(2),
        mutator: function (dna, done) {
            if (Math.random() >= .1)
                return done();
            let i = Math.floor(Math.random() * dna.length);
            let char = dna[i];
            let step = -3 + Math.floor(Math.random() * 6);
            dna[i] = String.fromCharCode(
                Number(char.charCodeAt(0) + step)
            );
            return done(null, dna);
        },
        fitnessFn: function (dna, done) {
            let fitness = dna.map((c, i) => {
                return -Math.abs(target.charCodeAt(i) - c.charCodeAt(0))
            }).reduce((p, c) => p + c, 0);
            done(null, fitness);
        },
        stopCriteria: function (leader, population) {
            return leader.join('') == target;
        }
    });
};
