<img src="https://travis-ci.org/muliyul/microverse.svg?branch=master">
<p align="center">
  <img src="logo.png" width="85" height="85"/>
</p>

#microverse
microverse is a tiny library for quickly prototyping genetic algorithms. currently only compatible with node.

####Install
`npm i -S microverse`

#####Breaking Changes (v1.1.0):
* Chromosomes are now instances of `Array`.

#####Usage (TL;DR):

```javascript
    let {Algorithm, Operators} = require('microverse');
    let {Crossovers, Selectors} = Operators;
    
    let population = [];
    
    //Generate a random population somehow
    for (let i = 0; i < 5; i++) {
        let chromosome = [...];
        population.push(chromosome);
    }
    
    let opts = {...};
    let alg = new Algorithm(opts);
    
    //Subscribe to events
    alg.on('evaluation', info => {...});
    alg.on('selection', info => {...});
    alg.on('crossover', info => {...});
    alg.on('generation', info => {...});
    alg.on('end', info => {...});
    
    //Run the algorithm indefinitely or until the criteria has met
    alg.run().then(info => {...});
    
    //Run the algorithm for 100 iterations or until the criteria has met
    alg.run(100).then(info => {...});
    
    //Pipe the progress (will stream json string 'generation' events)
    alg.pipe(process.stdout); 
```

#####Options:
* lazyEval: `Boolean` (optional, default: `true`) - will evaluate each solution only once.
* population: `Array` (required) - an array of chromosomes.
* crossover: `function (parents, done)` (required) - errback accepts the offspring created.
* selector: `function (population, done)` (required) - errback accepts the selected parents from the population created.
* mutator: `function (chromosome, done)` (optional, default: `(chromosome, done) => done()`). errback accepts the mutated chromosome (falsely for unchanged).
* fitnessFn: `function (chromosome, done)` (required) - errback accepts the fitness value for this chromosome.
* stopCriteria: `function (leader, population)` (optional, default: `(leader, population) => false`) - A synchronous stop criteria to evaluate for each generation (truthy or falsely).
* steadyState: (optional, default: `false`) - will determine if the algorithm should use the [steady-state](http://www.obitko.com/tutorials/genetic-algorithms/crossover-mutation.php) concept.

####Factories:
```javascript
    let {Crossovers, Selectors} = require('microverse').Operators;
    let {SinglePoint, DoublePoint, Uniform, Arithmetic} = Crossovers;
    let {Elitism, Roulette, Rank} = Selectors;
    
    //Returns a selector function that selects 
    //2 parents based on the Roulette Wheel algorithm.
    let rws = Roulette(2);
    
    //Returns a crossover function that spreads
    //parents traits evenly across a new 
    let uxo = Uniform;
```
Note: unless specified manually, all

Read more about [crossovers](http://www.obitko.com/tutorials/genetic-algorithms/crossover-mutation.php) and [selectors](http://www.obitko.com/tutorials/genetic-algorithms/selection.php). 

##TODO
-[x] Stream / Generator support as population output. 
-[x] Add more crossover functions (Single Point, Double Point, Arithmetic).
-[x] Add more selector functions (Roulette Wheel, Rank, Steady-State).
-[ ] Proper object stream output.
-[ ] Add genetic programming example.
-[ ] Make it available to browsers.
-[ ] Benchmarks.

##Development
Install dependencies: `npm i`

Run tests: `npm test`