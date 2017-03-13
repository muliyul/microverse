Promise = require('bluebird');
let expect = require('chai').expect;
let {StringOptimizer, FormulaFitter} = require('../example');

describe('Examples', function () {
    describe('StringOptimizer', function () {
        it('Should converge', function () {
            return StringOptimizer('wubba lubba dub dub').run().then(info => {
                let solution = info.solution.join('');
                expect(solution).to.equal('wubba lubba dub dub');
            });
        });
    });

    describe('FormulaFitter', function () {
        it('Should converge', function () {
            let firstLeader;
            let target = [[-2, 4], [-1, 1], [0, 0], [1, 1], [2, 4]];
            let alg = FormulaFitter(target);
            alg.once('generation', info => {
                //Recording the first population's leader
                firstLeader = info.leader;
            });
            return alg.run().then(info => {
                expect(info.solution._fitness).to.be.at.least(firstLeader._fitness);
            });
        });
    });
});