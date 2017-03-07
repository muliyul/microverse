let assert = require('assert');
let {Chromosome, Algorithm, Operators} = require('../lib');
let {Crossovers, Selectors} = Operators;

describe('Chromosome', function () {
    it('Should throw an error if the DNA is not an array', function () {
        let dna = 'blah';
        assert.throws(() => new Chromosome(dna));
    });

    it('Should use a shallow copy of the DNA provided', function () {
        let dna = [1, 'test', false];
        let c = new Chromosome(dna);
        assert.notStrictEqual(dna, c._dna);
    });

    it('Should return a shallow copy of the DNA', function () {
        let dna = [1, 'test', false];
        let c = new Chromosome(dna);
        assert.notStrictEqual(dna, c.getDNA());
    })
});