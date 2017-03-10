let stream = require('stream');
let util = require('util');
let async = require('async');
let bluebird = require('bluebird');
bluebird.promisifyAll(async, {suffix: 'Promise'});


let noop = () => false;

function Algorithm(opts) {
    verifyOptions(opts);
    stream.Readable.call(this, {objectMode: true});

    this._population = opts.population.slice();
    this._populationSize = this._population.length;
    this._stopCriteria = opts.stopCriteria ? opts.stopCriteria.bind(this) : noop;
    this._fitnessFn = opts.fitnessFn.bind(this);
    this._selector = opts.selector.bind(this);
    this._crossover = opts.crossover.bind(this);
    this._mutator = opts.mutator ? opts.mutator.bind(this) : noop;

    this._generation = 0;
    this._currentLeader = null;
    this._leaders = [this._population[0]];

    this._emitError = (e, done) => {
        this.emit('error', e);
        if (done) done(e)
    }
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
            leaders: this._leaders,
            solution: this._currentLeader
        };
        this.emit('end', info);
        return info;
    }).catch(this._emitError);
};

function runAsync(generator, iterations) {
    let i = 0;
    return function () {
        let gen = generator.apply(this, arguments);

        function handle(result) {
            if (result.done || i++ > iterations)
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
    this._currentLeader = null;
    this._leaders = [this._population[0]];

    while (!this._stopCriteria(this._leaders[this._leaders.length - 1], this._population.slice()))
        yield async.filterPromise(this._population, (c, done) => {
            //Filter out the evaluated chromosomes
            done(null, !c._evaluated);
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
            let leader = this._currentLeader = sortedPopulation[sortedPopulation.length - 1];
            this._leaders.push(leader);
            this.emit('evaluation', {
                population: sortedPopulation,
                leader: leader
            });

            //Select new parents
            return async.nextTickPromise(this._selector, sortedPopulation);
        }).then(parents => {
            this.emit('selection', parents.slice());

            //Perform crossover and mutation
            return async.timesPromise(this._populationSize - parents.length, (i, done) => {
                async.nextTickPromise(this._crossover, parents).then(offspring => {
                    return async.nextTickPromise(this._mutator, offspring).then(mutatedOffspring => mutatedOffspring ? mutatedOffspring : offspring);
                }).then(offspring => done(null, offspring));
            }).then(offsprings => Promise.resolve(parents.concat(offsprings)));
        }).then(population => {
            this._population = population;
            this._generation++;

            let event = {
                population,
                generation: this._generation,
                leader: this._currentLeader
            };

            this.emit('generation', event);
            this.push(JSON.stringify(event));
        });
};


Algorithm.prototype.toString = function () {
    return `Leaders: ${JSON.stringify(this._leaders, null, 2)}`
};

Algorithm.prototype.toJSON = function () {
    return JSON.stringify({
        generation: this._generation,
        population: this._population,
        leader: this._leaders[this._leaders.length - 1]
    });
};


module.exports = Algorithm;