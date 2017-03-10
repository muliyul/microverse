#microverse
microverse is a tiny library for quickly prototyping genetic algorithms.

####Install
`npm i -S microverse`

#####Usage (TL;DR):

    let {Chromosome, Algorithm, Operators} = require('microverse');
    let {Crossovers, Selectors} = Operators;
    
    let population = [];
    
    //Generate a random population somehow
    for (let i = 0; i < 5; i++) {
        let dna = [...];
        population.push(new Chromosome(dna));
    }
    
    let alg = new Algorithm({options});
    
    //Subscribe to events
    alg.on('evaluation', info => {...});
    alg.on('selection', info => {...});
    alg.on('generation', info => {...});
    alg.on('end', info => {...});
    
    //Run the algorithm
    alg.run();
    
    //Pipe the progress (will stream 'generation' events)
    alg.pipe(process.stdout);

#####Options:
    {
        population: [...new Chromosome([1,2,3])...], //Required
        crossover: function (parents, done) { ... }, //Required - callback accepts error and the offspring created.
        selector: function (population, done) { ... }, //Required - callback accepts error and an array of parent chromosomes.
        mutator: function (chromosome, done) { ... }, //Optional - callback accepts error and the mutated chromosome (falsey for unchanged).
        fitnessFn: function (chromosome, done) { ... }, //Required - callback accepts error and the fitness value for this chromosome.
        stopCriteria: function (leader, population) { ... } //Optional - a synchronous stop criteria. Will loop forever if omitted.
    }
    
All algorithm methods are available with `this` keyword and because of that
arrow functions are **NOT** supported since they cannot be bound.

##TODO
* Stream / Generator support as population input. √ 
* Proper stream output (as objects?).
* Add more crossover functions (Single Point, Double Point, Arithmetic). √
* Add more selector functions (Roulette Wheel, Rank, Steady-State).
* Add genetic programming example.
* Make it available to browsers.
* Benchmarks.

##Development
Install dependencies: `npm i`

Run tests: `npm test`