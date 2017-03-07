let {Chromosome, Algorithm, operators} = require('../lib');
let {Crossovers, Selectors} = operators;

let population = [];
let target = 'wubba lubba dub dub';

for (let i = 0; i < 5; i++) {
    let a = 'a'.charCodeAt(0);
    let char = String.fromCodePoint(a + Math.floor(Math.random() * ('z'.charCodeAt(0) - a)));
    let dna = [];
    for (let j = 0; j < target.length; j++) {
        dna.push(char);
    }
    population.push(new Chromosome(dna));
}

let alg = new Algorithm({
    population: population,
    crossover: Crossovers.Uniform,
    selector: Selectors.Elitism(2),
    mutator: function (c, done) {
        if (Math.random() < .1) {
            let dna = c.getDNA();
            let i = Math.floor(Math.random() * dna.length);
            let char = dna[i];
            let step = -3 + Math.floor(Math.random() * 6);
            dna[i] = String.fromCharCode(
                Number(char.charCodeAt(0) + step)
                    //.clamp('a'.charCodeAt(0), 'z'.charCodeAt(0))
            );
            return done(null, new Chromosome(dna));
        }
        done();
    },
    fitnessFn: function (c, done) {
        let dna = c.getDNA();
        let fitness = dna.map((c, i) => {
            return -Math.abs(target.charCodeAt(i) - c.charCodeAt(0))
        }).reduce((p, c) => p + c, 0);
        done(null, fitness);
    },
    stopCriteria: function (leader, population) {
        return leader.getDNA().join('') == target;
    }
});

module.exports = alg;
