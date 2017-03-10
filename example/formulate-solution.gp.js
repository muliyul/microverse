let {Chromosome, Algorithm, Operators} = require('../src');
let {Crossovers, Selectors} = Operators;

let target = 20;

let functions = {
    add: function (a, b) {
        return a + b
    },
    subtract: function (a, b) {
        return a - b
    },
    multiply: function (a, b) {
        return a * b
    },
    divide: function (a, b) {
        return a / b
    },
    pow: function (a, b) {
        return Math.pow(a, b);
    },
    log: function (a, b) {
        if (b === 1) throw new Error('Invalid log');
        return Math.log2(a) / Math.log2(b);
    }
};
let fnNames = Object.keys(functions);

let population = [];
let inputs = [(Math.random() < .5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5)), (Math.random() < .5 ? -1 : 1) * (1 + Math.floor(Math.random() * 5))];
for (let i = 0; i < 30; i++) {
    let dna = [];
    let dnaLength = 1 + Math.floor(Math.random() * 2);
    for (let j = 0; j < dnaLength; j++) {
        let rFnName = fnNames[Math.floor(Math.random() * fnNames.length)];
        dna.push(rFnName);
    }
    population.push(new Chromosome(dna));
}

let alg = new Algorithm({
    population: population,
    crossover: Crossovers.Variable,
    selector: Selectors.Elitism(2),
    mutator: function (c, done) {
        if (Math.random() < .1) {
            let dna = c.getDNA();
            if (Math.random() < .5 && dna.length > 1) {
                let i = Math.floor(Math.random() * dna.length);
                dna = dna.splice(i, 1);
                return done(null, new Chromosome(dna));
            } else if (Math.random() < .5) {
                let j = Math.floor(Math.random() * fnNames.length);
                dna.push(fnNames[j]);
                return done(null, new Chromosome(dna));
            }
            else if (Math.random() < .5 && dna.length > 2) {
                let i = Math.floor(Math.random() * dna.length);
                let j = Math.floor(Math.random() * dna.length);
                let temp = dna[i];
                dna[i] = dna[j];
                dna[j] = temp;
                return done(null, new Chromosome(dna));
            }
        }
        done();
    },
    fitnessFn: function (c, done) {
        try {
            let dna = c.getDNA();
            let fitness = 0;
            for (let i = 0; i < dna.length; i++)
                fitness += functions[dna[i]].apply(this, inputs)
            //Illegal math op - penalize
            if (isNaN(fitness))
                return done(null, -Number.MAX_VALUE);
            done(null, target - fitness + (Math.log2(dna.length) - 1));
        } catch (e) {
            //Illegal math op - penalize
            done(e, -Number.MAX_VALUE);
        }
    },
    /*stopCriteria: function (leader, population) {
     //return Math.max(Math.abs(target - leader._fitness), -Number.MAX_VALUE) <= 3;
     return target === leader._fitness;
     }*/
});


console.log(`Inputs: ${JSON.stringify(inputs, null)}\n`);
alg.on('generation', info => {
    console.log(`Leader:\n${info.leader}`);
});

alg.on('end', info => {
    console.log(`Inputs: ${JSON.stringify(inputs, null)}\n`);
});

alg.run(500);
