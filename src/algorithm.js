let stream = require('stream');
let util = require('util');
let async = require('async');
Promise = require('bluebird');
Promise.promisifyAll(async, {suffix: 'Promise'});

let noop = () => false;

function Algorithm(opts) {
    verifyOptions(opts);
    stream.Readable.call(this, {objectMode: true});

    this._population = opts.population.slice();
    this._populationSize = this._population.length;
    this._stopCriteria = opts.stopCriteria ? opts.stopCriteria : noop;
    this._fitnessFn = opts.fitnessFn;
    this._selector = opts.selector;
    this._crossover = opts.crossover;
    this._mutator = opts.mutator ? opts.mutator : noop;
    this._lazyEval = opts.lazyEval;
    this._steadyState = opts.steadyState;

    this._generation = 0;
    this._memo = [this._population[0]];
    this._currentLeader = this._population[0];
}

function verifyOptions(opts) {
    if (!util.isArray(opts.population)) {
        throw new Error('Population must be non-empty array');
    } else if (opts.population.length <= 2) {
        throw new Error('Population size must be greater than 2');
    }
    if (!opts.fitnessFn)
        throw new Error('An evaluation function must be provided!');
    if (!opts.selector)
        throw new Error('A selector function must be provided!');
    if (!opts.crossover)
        throw new Error('A crossover function must be provided!');
}

util.inherits(Algorithm, stream.Readable);

Algorithm.prototype._read = function (size) {
    //TODO: figure out what this is for
};

Algorithm.prototype.run = function (iterations) {
    return runAsync(this.generator.bind(this), iterations)().then(() => {
        let info = {
            leaders: this._memo,
            solution: this._currentLeader
        };
        this.emit('end', info);
        return info;
    }).catch(e => this.emit('error', e));
};

function runAsync(generator, iterations) {
    let i = 0;
    return function () {
        let gen = generator.apply(this, arguments);

        function handle(result) {
            if (result.done || (iterations && i++ > iterations))
                return Promise.resolve(result.value);

            return Promise.resolve(result.value).then(function (res) {
                return handle(gen.next(res));
            }, function (err) {
                return handle(gen.throw(err));
            });
        }

        try {
            return handle(gen.next());
        } catch (ex) {
            return Promise.reject(ex);
        }
    }
}

Algorithm.prototype.generator = function*() {

    this._generation = 0;
    this._currentLeader = [this._population[0]];
    this._memo = [this._population[0]];

    //This is to allow asynchronous generations in a synchronous pattern
    let lastPromise = Promise.resolve();

    do {
        yield lastPromise = lastPromise.then(() => {
            return async.filterPromise(this._population, (c, done) => {
                //Filter out the evaluated chromosomes
                done(null, this._lazyEval ? !c._evaluated : true);
            });
        }).then(unevaluated => {
            //Evaluate the rest
            return async.eachPromise(unevaluated, (c, done) => {
                this._fitnessFn(c, (e, fitness) => {
                    if (e) return done(e);
                    c._evaluated = true;
                    done(null, c._fitness = fitness)
                });
            })
        }).then(() => {
            //Sort the population
            return async.sortByPromise(this._population, (c, done) => done(null, c._fitness));
        }).then(sortedPopulation => {
            this._currentLeader = sortedPopulation[sortedPopulation.length - 1];
            this._memo.push(this._currentLeader);
            this._population = sortedPopulation;
            this.emit('evaluation', {
                leader: this._currentLeader,
                population: this._population
            });

            //Select new parents
            return async.nextTickPromise(this._selector, this._population);
        }).tap(parents => {
            this.emit('selection', {parents});

            let nOffsprings = this._steadyState ? parents.length : this._populationSize - parents.length;
            //Perform crossover and mutation
            return async.timesPromise(nOffsprings, (i, done) => {
                async.nextTickPromise(this._crossover, parents).then(offspring => {
                    this.emit('crossover', {parents, offspring});
                    return async.nextTickPromise(this._mutator, offspring)
                        .then(mutatedOffspring => mutatedOffspring ? mutatedOffspring : offspring);
                }).then(offsprings => done(null, offsprings));
            }).then(offsprings => {
                if (this._steadyState) {
                    //Remove the worst individuals from the population
                    this._population.splice(0, parents.length);
                    this._population = this._population.concat(offsprings);
                } else
                    this._population = parents.concat(offsprings)
            });
        }).then(parents => {
            let event = {
                generation: this._generation++,
                leader: this._currentLeader,
                parents: parents,
                population: this._population
            };

            this.emit('generation', event);
            this.push(event);
            return event;
        });
    } while (!this._stopCriteria(this._currentLeader, this._population.slice()));
};


Algorithm.prototype.toString = function () {
    return `Leaders: ${JSON.stringify(this._memo, null, 2)}`
};

module.exports = Algorithm;