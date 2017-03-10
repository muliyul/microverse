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
        SinglePoint: function (parents, done) {
            try {
                let dnaLength = parents[0]._dna.length;
                //Select 2 distinct parents at random
                let p1 = parents[Math.floor(Math.random() * parents.length)];
                let p2;
                do {
                    p2 = parents[Math.floor(Math.random() * parents.length)];
                } while (p1 === p2);
                let dna = [];
                let singlePoint = Math.floor(Math.random() * dnaLength);
                for (let i = 0; i < singlePoint; i++) {
                    dna.push(p1._dna[i]);
                }
                for (let i = singlePoint; i < dnaLength; i++) {
                    dna.push(p2._dna[i]);
                }
                done(null, new Chromosome(dna))
            } catch (e) {
                done(e);
            }
        },
        DoublePoint: function (parents, done) {
            try {
                let dnaLength = parents[0]._dna.length;
                //Select 2 distinct parents at random
                let p1 = parents[Math.floor(Math.random() * parents.length)];
                let p2;
                do {
                    p2 = parents[Math.floor(Math.random() * parents.length)];
                } while (p1 === p2);
                let dna = [];
                let firstPoint = Math.floor(Math.random() * (dnaLength - 2));
                let secondPoint = Math.floor(Math.random() * (dnaLength - firstPoint + 1));
                for (let i = 0; i <= firstPoint; i++) {
                    dna.push(p1._dna[i]);
                }
                for (let i = firstPoint + 1; i <= secondPoint; i++) {
                    dna.push(p2._dna[i]);
                }
                for (let i = secondPoint + 1; i < dnaLength; i++) {
                    dna.push(p1._dna[i]);
                }
                done(null, new Chromosome(dna))
            } catch (e) {
                done(e);
            }
        },
        Uniform: function (parents, done) {
            try {
                let dnaLength = parents[0]._dna.length;
                let dna = [];
                for (let i = 0; i < dnaLength; i++) {
                    let idx = Math.floor(Math.random() * parents.length);
                    dna.push(parents[idx]._dna[i]);
                }
                done(null, new Chromosome(dna))
            } catch (e) {
                done(e)
            }
        },
        Arithmetic: function (parents, done) {
            try {
                let dnaLength = parents[0]._dna.length;
                //Select 2 distinct parents at random
                let p1 = parents[Math.floor(Math.random() * parents.length)];
                let p2;
                do {
                    p2 = parents[Math.floor(Math.random() * parents.length)];
                } while (p1 === p2);

                let dna = [];
                for (let i = 0; i < dnaLength; i++) {
                    dna.push(p1._dna[i] + p2._dna[i]);
                }
                done(null, new Chromosome(dna));
            } catch (e) {
                done(e);
            }
        },
        Variable: function (parents, done) {
            try {
                let dnaLength = Math.floor(1 + Math.random() * parents[0]._dna.length);
                let dna = [];
                for (let i = 0; i < dnaLength; i++) {
                    let idx = Math.floor(Math.random() * parents.length);
                    dna.push(parents[idx]._dna[i]);
                }
                done(null, new Chromosome(dna));
            } catch (e) {
                done(e);
            }
        }
    }
};