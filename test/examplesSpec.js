Promise = require('bluebird');
let expect = require('chai').expect;
let {StringOptimizer, FormulaFitter} = require('../example');

describe('Examples', function () {
    describe('StringOptimizer', function () {
        it('Should converge', function () {
            let alg = StringOptimizer('wubba lubba dub dub');
            let firstLeader;
            alg.once('generation', info => {
                //Recording the first population's leader
                firstLeader = info.leader;
            });
            return alg.run(2500).then(info => {
                expect(info.solution._fitness).to.be.at.above(firstLeader._fitness);
                //console.log(info.solution.join(''))
            });
        });
    });

    describe('FormulaFitter', function () {
        it('Should converge', function () {
            let firstLeader;
            let target = [];
            let range = 20;
            for (let x = 0; x < range; x++) {
                target.push([x, Math.pow(x, 2) + 3])
            }
            let alg = FormulaFitter(target);
            alg.once('generation', info => {
                //Recording the first population's leader
                firstLeader = info.leader;
            });
            return alg.run(2000).then(info => {
                expect(info.solution._fitness).to.be.at.above(firstLeader._fitness);
                let str = info.solution.map((c, i) => {
                    if (c) {
                        if (c !== 1)
                            if (i > 1)
                                return `${c}x^${i}`;
                            else if (i === 1)
                                return `${c}x`;
                            else
                                return `${c}`;
                        else if (i > 1)
                            return `x^${i}`;
                        else if (i === 1)
                            return `x`;
                        else
                            return `${c}`;
                    }
                    else {
                        return '';
                    }
                })
                    .filter(s => s).reverse().join(' + ');
                console.log(str);
            });
        });
    });
});