let Chromosome = require('./chromosome');

module.exports = {
    Selectors: {
        Elitism: function (nParents) {
            return (population, done) => {
                done(null, population.slice(-nParents));
            }
        }
    },
    Crossovers: {
        Uniform: function (parents, done) {
            try {
                let dnaLength = parents[0].getDNA().length;
                let dna = [];
                for (let i = 0; i < dnaLength; i++) {
                    let idx = Math.floor(Math.random() * parents.length);
                    dna.push(parents[idx].getDNA()[i]);
                }
                done(null, new Chromosome(dna))
            } catch (e) {
                done(e)
            }
        }
    }
};