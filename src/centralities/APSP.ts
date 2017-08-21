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
import {NeighborEntry} from "../core/Nodes";

//Calculates all the shortest path's to all other nodes for all given nodes in the graph
class APSP{

  //These are persistent values needed for modification of the graph
  E  = {};
  L  = {}; // ij is the length of a path from node i to node j.
  D  = {}; // ij is the current shortest path length from node i to node j.
  graph:$G.IGraph;

  constructor(graph: $G.IGraph){
    $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    this.graph = graph;

    //Fill L
    for(let n in graph.getNodes()) {
      this.L[n] = {};
      this.D[n] = {};
      for (let m in graph.getNodes()) {
        this.L[n][m] = Number.MAX_VALUE;
        this.D[n][m] = Number.MAX_VALUE;
      }
    }

    let edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (let edge in edges){
      let a = edges[edge].getNodes().a.getID();
      let b = edges[edge].getNodes().b.getID();

      if(this.L[a]==null)
        this.L[a] = {};
      this.L[a][b] = edges[edge].getWeight();
      if(!edges[edge].isDirected()){
        if(this.L[b]==null)
          this.L[b] = {};
        this.L[b][a] = edges[edge].getWeight();
      }
    }
  }

  //This algorithm is implemented after "Efficient algorithms for incremental all pairs shortest paths,
  //closeness and betweenness in social network analysis"
  //Call this method after inserting a node (z) with it's edges
  //To calculate all values for a new graph simply call it in a for loop with all nodes as Z
  addNode = (Z: $N.IBaseNode): {} => {
    let T1:NeighborEntry[] = Z.prevNodes(), // a set of incoming neighbor nodes of the newly added node z.
        T2:NeighborEntry[] = Z.nextNodes(); // a set of outgoing neighbor nodes of the newly added node z.
    let minkinT1  = []; //is the minimum path length between i and z, ∀i ∈ V // V is a set of all nodes.
    let minkoutT2 = []; //is the minimum path length between z and j, ∀j ∈ V

    let nodes = this.graph.getNodes();
    let z = Z.getID();

    if(this.L[z] == null)
      this.L[z] = [];
    if(this.D[z] == null)
      this.D[z] = [];

    for (let v in nodes) {
      if(this.L[v] == null)
        this.L[v] = [];
      if(this.D[v] == null)
        this.D[v] = [];

      for(let kin in T1){
        if(v!=T1[kin].node.getID()){           //This was: this.graph.getEdgeByNodeIDs(kin,z); before
          if(this.D[T1[kin].node.getID()] == null)
            this.D[T1[kin].node.getID()] = [];
          this.L[v][z] = this.D[v][T1[kin].node.getID()] + T1[kin].edge.getWeight(); // Calculate path lengths from all nodes to node z.
          if(this.L[v][z]<minkinT1[v])  // v = i in this case
            minkinT1[v] = this.L[v][z]; // Update minimum path length between i and z.
        }
      }
      for(let kout in T2){
        if(v!=T2[kout].node.getID()){
          if(this.D[T2[kout].node.getID()] == null)
            this.D[T2[kout].node.getID()] = [];
          this.L[z][v] = T2[kout].edge.getWeight() + this.D[T2[kout].node.getID()][v]; // Calculate path lengths from node z to all other
          if(this.L[z][v] < minkoutT2[v]) // v = j in this case
            minkoutT2[v] = this.L[z][v];//Update minimum path length between z and j.
        }
      }
    }
    console.log(minkinT1);
    console.log(minkoutT2);
    for(let i in minkinT1){
      for(let j in minkoutT2){
        if(minkinT1[i]+minkoutT2[j] < this.D[i][j])
          this.D[i][j] = minkinT1[i]+minkoutT2[j]; // Compare the old shortest path with the new one and update it if
                                                    // the new shortest path is shorter.
      }
    }
    for(let i in minkinT1)
      this.D[i][z] = minkinT1[i];

    for(let j in minkoutT2)
      this.D[z][j] = minkoutT2[j];

    return {};
  };

  //Functions to retrieve centralities
  getCloseness():{[id: string]: number}{
    let ret:{[id:string]: number} = {};
    for (let i in this.graph.getNodes())
      console.log(JSON.stringify(this.D[i]));
    for (let i in this.graph.getNodes())
      for (let j in this.graph.getNodes())
        ret[i] = ret!=null ? ret[i] + this.D[i][j] : this.D[i][j];
    console.log(ret);
    return ret;
  }
}
export {
  APSP
};