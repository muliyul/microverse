let stream = require('stream');
let util = require('util');
let async = require('async');

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

    this._evaluate = done => {
        async.filter(this._population, (c, done) => {
            done(null, !c._evaluated);
        }, (e, unevaluated) => {
            //Evaluate the rest
            async.each(unevaluated, (c, done) => {
                this._fitnessFn(c, (e, fitness) => {
                    if (e) return done(e);
                    c._evaluated = true;
                    done(null, c._fitness = fitness)
                });
            }, e => {
                if (e) return done(e);
                async.sortBy(this._population, (c, done) => done(null, c._fitness), done);
            })
        });

    };

    this._breed = (parents, done) => {
        async.times(this._populationSize - parents.length, (i, done) => {
            async.nextTick(this._crossover, parents, (e, offspring) => {
                async.nextTick(this._mutator, offspring, (e, mutatedOffspring) => {
                    done(e, mutatedOffspring ? mutatedOffspring : offspring)
                });
            });
        }, done);
    };

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

Algorithm.prototype.run = function () {
    let generation = 0;
    this._leaders = [this._population[0]];
    async.until(() => this._stopCriteria(this._leaders[this._leaders.length - 1], this._population.slice()), done => {
        this._evaluate((e, sortedPopulation) => {
            if (e) return this._emitError(e, done);
            let currentLeader = sortedPopulation[sortedPopulation.length - 1];
            this._leaders.push(currentLeader);
            this.emit('evaluation', {
                population: sortedPopulation,
                leader: currentLeader
            });

            async.nextTick(this._selector, sortedPopulation, (e, parents) => {
                if (e) return this._emitError(e, done);
                this.emit('selection', parents.slice());

                this._breed(parents, (e, population) => {
                    if (e) return this._emitError(e, done);
                    this._population = population.concat(parents);
                    let info = {
                        generation: generation++,
                        population: this._population,
                        leader: currentLeader
                    };
                    this.emit('generation', info);

                    this.push(JSON.stringify(info));

                    done(null, currentLeader);
                });
            });
        });
    }, (e, leader) => {
        if (e) return this._emitError(e);
        this.emit('end', {
            leaders: this._leaders,
            solution: leader
        });
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