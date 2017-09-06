/// <reference path="../../typings/tsd.d.ts" />

/*
    This calculates the shortest path to all others, this is accomplished by using
    Dijkstra
 */
import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $SU from '../utils/structUtils'
import {NeighborEntry} from "../core/Nodes";

//Calculates all the shortest path's to all other nodes for all given nodes in the graph
class APSP{

  //These are persistent values needed for modification of the graph
  E  = {};
  L  = {}; // ij is the length of a path from node i to node j.
  D  = {}; // ij is the current shortest path length from node i to node j.
  edgesToAdd = [];
  nodes:String[] = [];
  graph:$G.IGraph;

  constructor(graph: $G.IGraph){

    this.graph = new $G.BaseGraph("2");
    /*$SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    this.graph = graph;

    //Fill L
    for(let n in graph.getNodes()) {
      this.L[n] = {};
      this.D[n] = {};
      for (let m in graph.getNodes()) {
        if(n==m){
          this.L[n][m] = 0;
          this.D[n][m] = 0;
        }else{
          this.L[n][m] = Number.MAX_VALUE;
          this.D[n][m] = 0;
        }
      }
    }

    let edges = $SU.mergeObjects([graph.getDirEdges(), graph.getUndEdges()]);
    for (let edge in edges){
      let a = edges[edge].getNodes().a.getID();
      let b = edges[edge].getNodes().b.getID();

      //if(this.L[a]==null)
      //  this.L[a] = {};
      this.L[a][b] = edges[edge].getWeight();
      if(!edges[edge].isDirected()){
        //if(this.L[b]==null)
        //  this.L[b] = {};
        this.L[b][a] = edges[edge].getWeight();
      }
    }
    //console.log("L:"+JSON.stringify(this.L));
    //console.log("D:"+JSON.stringify(this.D));
    */
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

    //Fill min arrays with high values

    let z = Z.getID();
    this.nodes.push(z);
    let nodes:String[] = this.nodes;

    nodes.forEach((v:string, index) => {
      minkinT1[v]  = Number.MAX_VALUE;
      minkoutT2[v] = Number.MAX_VALUE;
      for(let kin in T1){
        if(v!=T1[kin].node.getID()){
          this.L[v][z] = this.D[v][T1[kin].node.getID()] + T1[kin].edge.getWeight(); // Calculate path lengths from all nodes to node z.

          //console.log("V:"+v+" kin:"+T1[kin].node.getID());
          //console.log("L ingreds:"+this.D[v][T1[kin].node.getID()] +" + " + T1[kin].edge.getWeight());
          //console.log("L:"+this.L[v][z]+" other:"+minkinT1[v]);
          if(this.L[v][z]<minkinT1[v])  // v = i in this case
            minkinT1[v] = this.L[v][z]; // Update minimum path length between i and z.
        }
      }
      for(let kout in T2){
        if(v!=T2[kout].node.getID()){
          this.L[z][v] = T2[kout].edge.getWeight() + this.D[T2[kout].node.getID()][v]; // Calculate path lengths from node z to all other
          if(this.L[z][v] < minkoutT2[v]) // v = j in this case
            minkoutT2[v] = this.L[z][v];//Update minimum path length between z and j.
        }
      }
    });
    console.log(minkinT1);
    //console.log(minkoutT2);
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

  addEdge = (E: $E.IBaseEdge): {} => {
    let k1:string = E.getNodes().a.getID();
    let k2:string = E.getNodes().b.getID();
    if(this.nodes.indexOf(k1)<=-1) {
      this.graph.addNode(new $N.BaseNode(k1));
      this.nodes.push(k1);
      this.D[k1] = [];
      this.D[k1][k1] = 0;
    }
    if(this.nodes.indexOf(k2)<=-1) {
      this.graph.addNode(new $N.BaseNode(k2));
      this.nodes.push(k2);
      this.D[k2] = [];
      this.D[k2][k2] = 0;
    }

    this.graph.addEdgeByID(E.getID(),this.graph.getNodeById(k1),this.graph.getNodeById(k2),
        {weighted:true,weight:E.getWeight(),directed:true});


    if(this.D[k1][k2] == null){
      this.D[k1][k2] = E.getWeight();
      console.log("D <- W - " + E.getWeight() + " " + this.D[k1][k2]);
    }
    else
      if(this.D[k1][k2]<E.getWeight())
        return; //Shortest paths don't change

    //TODO: what to do when this.D[k1][k2] == E.getWeight() ??

    //For each node pair, check whether we have to update the SPs
    this.nodes.forEach((i:string, index) => {
      this.nodes.forEach((j:string, index) => {
        if(this.D[i][j]==null || this.D[i][k1] == null || this.D[k2][j]==null){

        }else{
          let pathLength = this.D[i][k1]+this.D[k1][k2]+this.D[k2][j];
          if(pathLength < this.D[i][j]){
            //Update the path length because it's shorter over k1 and k2
            this.D[i][j] = pathLength;
            console.log("D["+i+"]["+j+"] <- Pathlength - " + " " + this.D[i][j]);

          }
        }
      });
    });

    this.nodes.forEach((i:string, index) => {
      this.nodes.forEach((j:string, index) => {
        console.log("D["+i+"]["+j+"]="+this.D[i][j]);
      });
    });
    console.log("This is the new D:"+JSON.stringify(this.D));
    return {};
  };

  //Functions to retrieve centralities

  //Calculate the Closeness
  getCloseness():{[id: string]: number}{
    let ret:{[id:string]: number} = {};
    console.log("THIS IS D:" + JSON.stringify(this.D));
    for (let i in this.graph.getNodes()) {
      ret[i] = 0;
      for (let j in this.graph.getNodes()) {
        ret[i] = ret[i] + this.D[i][j];
      }
    }
    console.log("THIS IS RET:" + JSON.stringify(ret));
    return ret;
  }
}
export {
  APSP
};