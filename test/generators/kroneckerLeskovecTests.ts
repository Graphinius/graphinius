/// <reference path="../../typings/tsd.d.ts" />

import * as chai from 'chai';
import * as $N from '../../src/core/Nodes';
import * as $E from '../../src/core/Edges';
import * as $G from '../../src/core/Graph';
import * as $KRON from '../../src/generators/kroneckerLeskovec';

var expect = chai.expect;

// describe('Kronecker Grpah generator Tests - ', () => {
    describe("Base Tes", () => {
        it('should generate a graph', () => {
            var gen = new $KRON.KROL();
            var synGraph = gen.generate().graph;
            expect(synGraph.nrNodes() ).to.equal(8);
            // console.log(synGraph);
            // expect(1).to.equal(1);
        })
    });
// });