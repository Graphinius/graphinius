/// <reference path="../../typings/tsd.d.ts" />

/*
    This calculates the shortest path to all others, this is accomplished by using
    Dijkstra
 */
import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $PFS from '../search/PFS';
import * as $ICentrality from "../centralities/ICentrality";
import * as $SU from '../utils/structUtils'

//Calculates all the shortest path's to all other nodes for all given nodes in the graph
class APSP{
/* //Do we need it? Incremental is pretty fast already...
  calculateAPSP(graph: $G.IGraph):{}{


  }*/


  //This algorithm is implemented after "Efficient algorithms for incremental all pairs shortest paths,
  //closeness and betweenness in social network analysis"
  //Call this method after inserting a node (z) with it's edges
  //To calculate all values for a new graph simply call it in a for loop with all nodes as Z
  addNode(graph: $G.IGraph, Z: $N.IBaseNode): {} {
    //These should be local members:
    let E  = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]),
        L  = {}, // ij is the length of a path from node i to node j.
        D  = {}, // ij is the current shortest path length from node i to node j.
        T1 = Z.prevNodes(), // a set of incoming neighbor nodes of the newly added node z.
        T2 = Z.nextNodes(); // a set of outgoing neighbor nodes of the newly added node z.
    let minkinT1  = []; //is the minimum path length between i and z, ∀i ∈ V // V is a set of all nodes.
    let minkoutT2 = []; //is the minimum path length between z and j, ∀j ∈ V

    let nodes = graph.getNodes();
    let z = Z.getID();

    for (let v in nodes) {
      for(let kin in T1){
        if(v!=kin){
          L[v][z] = D[v][kin] + graph.getEdgeByNodeIDs(kin,z); // Calculate path lengths from all nodes to node z.
          if(L[v][z]<minkinT1[v])  // v = i in this case
            minkinT1[v] = L[v][z]; // Update minimum path length between i and z.
        }
      }
      for(let kout in T2){
        if(v!=kout){
          L[z][v] = graph.getEdgeByNodeIDs(z,kout) + D[kout][v]; // Calculate path lengths from node z to all other
          if(L[z][v] < minkoutT2[v]) // v = j in this case
            minkoutT2[v] = L[z][v];//Update minimum path length between z and j.
        }
      }
    }
    for(let i in minkinT1){
      for(let j in minkoutT2){
        if(minkinT1[i]+minkoutT2[j] < D[i][j])
          D[i][j] = minkinT1[i]+minkoutT2[j]; // Compare the old shortest path with the new one and update it if
                                                    // the new shortest path is shorter.
      }
    }
    for(let i in minkinT1)
      D[i][z] = minkinT1[i];

    for(let j in minkoutT2)
      D[z][j] = minkoutT2[j];

    return {};
  }

  //Functions to retrieve centralities
  /*getCloseness():{[id: string]: number}{

    let ret:{[id:string]: number} = {};
  }*/
}
export {
  APSP
};