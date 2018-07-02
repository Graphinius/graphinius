import { IGraph } from '../core/Graph';
import { IBaseNode } from '../core/Nodes';
import { IBaseEdge } from '../core/Edges';


export interface GraphPartitioning {
  partitions: {[key:string]: Partition};
  nodePartMap: {[key:string]: string};
  nodeFrontMap: {[key:string]: boolean};
  // intraEdges: {[key:string]: IBaseEdge};
  // interEdges: {[key:string]: IBaseEdge};
  cut_cost: number;
}


export interface Partition {
  nodes: {[key:string]: IBaseNode};
}


export default class KCut {

  private _partitioning : GraphPartitioning;

  constructor(private _graph : IGraph) {
    this._partitioning = {
      partitions: {},
      nodePartMap: {},
      nodeFrontMap: {},
      cut_cost: 0
    };
  }


  cut(k: number, shuffle: boolean = false) : GraphPartitioning {
    const nodes = this._graph.getNodes(),
          n = Object.keys(nodes).length,
          nr_parts = Math.floor(n/k),
          nr_rest = n%k;
    
    for ( let i = 0; i < nr_parts; i++ ) {
      let partition : Partition = {
        nodes: {}
      }
      // this._partitioning.partitions.set( i, partition );
    }

    // for (let node in nodes) {
    //   let actualNode = nodes[node];
    //   if (i++ <= n / 2 - 1) {
    //     //now true is put in for all, later a change to false means deletion (but faster)
    //     part1[actualNode.getID()] = true;
    //   }
    //   else {
    //     part2[actualNode.getID()] = true;
    //   }
    // }

    // let partCount = 0;
    // result[partCount++] = part1;
    // result[partCount++] = part2;

    return this._partitioning;
  }

}