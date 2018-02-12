/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';

export interface KROLConfig {
    genMat: Array<Array<number> >;
    // generator: $G.IGraph;
    cycles: number;
}

export interface KROLResult {
    graph: $G.IGraph;
}

export interface IKROL {
    generate()  : KROLResult;
    prepareKROLStandardConfig() :  KROLConfig;
}

class KROL implements IKROL {

    private _config    :   KROLConfig;
    // private _generator :   $G.IGraph;
    private _genMat    :   number[][];
    private _cycles    :   number;
    private _graph     :   $G.IGraph;

    constructor( config? : KROLConfig )
    {
        this._config = config || this.prepareKROLStandardConfig();
        // this._generator = this._config.generator;
        // TODO: use the adjacency matrix form the generator graph
        // as soon as the issues from computing the adjacency matrix are fixe
        // this._genMat = this._generator.adjListArray();
        this._genMat = this._config.genMat;
        this._cycles = this._config.cycles;
        this._graph = new $G.BaseGraph('synth');
    }

    generate() {
        // var gen_dims = this._generator.nrNodes();
        var gen_dims = this._genMat[0].length;
        var res_dims = Math.pow(gen_dims, this._cycles+1);

        for (let index = 0; index < res_dims; index++) {
            this._graph.addNodeByID(index.toString());
        }

        var nr_edges: number = 0;
        for (let node1 = 0; node1 < res_dims; node1++) {
            for (let node2 = 0; node2 < res_dims; node2++) {
                if (this.addEdge(node1, node2, gen_dims)) {
                    this._graph.addEdgeByNodeIDs(node1 + '_' + node2, node1.toString(), node2.toString());
                    ++nr_edges;
                }
            }
        }

        var result : KROLResult = {
            graph : this._graph
        };
        return result;
    }

    addEdge(node1: number, node2: number, dims: number) : boolean {
        var rprob: number = Math.random();
        var prob: number = 1.0;
        for (let level = 0; level < this._cycles; level++) {
            var id_1 = Math.floor(node1 / Math.pow(dims, level+1)) % dims;
            var id_2 = Math.floor(node2 / Math.pow(dims, level+1)) % dims;            
            prob *= this._genMat[id_1][id_2];
            if (rprob > prob) { return false; }
        }
        return true;
    }

    prepareKROLStandardConfig() : KROLConfig {
        // var generator: $G.IGraph = new $G.BaseGraph('generator');
        // var node_a = generator.addNodeByID('a');
        // var node_b = generator.addNodeByID('b');

        // var edge_ab_id: string = node_a.getID() + '_' + node_b.getID();
        // var edge_ba_id: string = node_b.getID() + '_' + node_a.getID();
        // var edge_aa_id: string = node_a.getID() + '_' + node_a.getID();
        // var edge_bb_id: string = node_b.getID() + '_' + node_b.getID();
        
        // generator.addEdgeByID(edge_ab_id, node_a, node_b, {weighted: true, weight: 0.9});
        // generator.addEdgeByID(edge_ba_id, node_b, node_a, {weighted: true, weight: 0.5});
        // generator.addEdgeByID(edge_aa_id, node_a, node_a, {weighted: true, weight: 0.5});
        // generator.addEdgeByID(edge_bb_id, node_b, node_b, {weighted: true, weight: 0.1});
        
        var genMat = [[0.9, 0.5], [0.5, 0.1]];
        
        return {
            // generator: generator,
            genMat: genMat,
            cycles: 5
        }

    }
}


export {
    KROL
  };