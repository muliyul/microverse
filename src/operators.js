let selectors = {
    Elitism: function (nParents) {
        return (population, done) => {
            done(null, population.slice(-nParents));
        }
    },
    Roulette: function (nParents) {
        return function (population, done) {
            let totFit = population.reduce((prev, c) => prev + c._fitness, 0);
            let parents = [];
            for (let i = 0; i < nParents; i++) {
                let sum = 0;
                let rFit = Math.random() * totFit;
                for (let j = 0; j < population.length; j++) {
                    sum += population[j]._fitness;
                    if (sum > rFit) {
                        parents.push(population[j]);
                        //population = population.splice(j, 1);
                        break;
                    }
                }
            }
            done(null, parents);
        }
    },
    Rank: function (nParents) {
        return function (population, done) {
            for (let i = 0; i < population.length; i++) {
                population[i]._fitness = i + 1;
            }

            this.Roulette(nParents)(population, done);
        }.bind(selectors);
    }
};

let crossovers = {
    SinglePoint: function (parents, done) {
        try {
            let dnaLength = parents[0].length;
            //Select 2 distinct parents at random
            let p1 = parents[Math.floor(Math.random() * parents.length)];
            let p2;
            do {
                p2 = parents[Math.floor(Math.random() * parents.length)];
            } while (p1 === p2);
            let dna = [];
            let singlePoint = Math.floor(Math.random() * dnaLength);
            for (let i = 0; i < singlePoint; i++) {
                dna.push(p1[i]);
            }
            for (let i = singlePoint; i < dnaLength; i++) {
                dna.push(p2[i]);
            }
            done(null, dna)
        } catch (e) {
            done(e);
        }
    },
    DoublePoint: function (parents, done) {
        try {
            let dnaLength = parents[0].length;
            //Select 2 distinct parents at random
            let p1 = parents[Math.floor(Math.random() * parents.length)];
            let p2;
            do {
                p2 = parents[Math.floor(Math.random() * parents.length)];
            } while (p1 === p2);
            let dna = [];
            let firstPoint = Math.floor(Math.random() * (dnaLength - 2));
            let secondPoint = Math.floor(Math.random() * (dnaLength - firstPoint + 1));
            for (let i = 0; i < firstPoint; i++) {
                dna.push(p1[i]);
            }
            for (let i = firstPoint; i < secondPoint; i++) {
                dna.push(p2[i]);
            }
            for (let i = secondPoint; i < dnaLength; i++) {
                dna.push(p1[i]);
            }
            done(null, dna)
        } catch (e) {
            done(e);
        }
    },
    Uniform: function (parents, done) {
        try {
            let dnaLength = parents[0].length;
            let dna = [];
            for (let i = 0; i < dnaLength; i++) {
                let idx = Math.floor(Math.random() * parents.length);
                dna.push(parents[idx][i]);
            }
            done(null, dna)
        } catch (e) {
            done(e)
        }
    },
    Arithmetic: function (parents, done) {
        try {
            //Select 2 distinct parents at random
            let p1 = parents[Math.floor(Math.random() * parents.length)];
            let p2;
            do {
                p2 = parents[Math.floor(Math.random() * parents.length)];
            } while (p1 === p2);

            let dna = p1.map((x, i) => {
                return p2[i] ? x + p2[i] : x;
            });

            done(null, dna);
        } catch (e) {
            done(e);
        }
    },
    Variable: function (parents, done) {
        try {
            let dnaLength = parents[0].length + Math.floor(Math.random() * parents[0].length);
            let dna = [];
            for (let i = 0; i < dnaLength; i++) {
                let idx = Math.floor(Math.random() * parents.length);
                dna.push(parents[idx][i]);
            }
            done(null, dna);
        } catch (e) {
            done(e);
        }
    }
};

module.exports = {
    Selectors: selectors,
    Crossovers: crossovers
};