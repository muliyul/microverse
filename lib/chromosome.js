function Chromosome(dna) {
    verifyDNA(dna);
    this._fitness = -Number.MAX_VALUE;
    this._evaluated = false;
    this._dna = dna.slice();
}

function verifyDNA(dna) {
    if (!Array.isArray(dna))
        throw new Error('An initial DNA must be provided!');
}

Chromosome.prototype.getDNA = function () {
    return this._dna.slice();
};

Chromosome.prototype.toString = function () {
    return `DNA: ${JSON.stringify(this._dna)}. Fitness: ${this._fitness}`;
};

Chromosome.prototype.toJSON = function () {
  return JSON.stringify({
      fitness: this._fitness,
      dna: this._dna
  })
};

module.exports = Chromosome;