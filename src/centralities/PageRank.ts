/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $ICentrality from "../centralities/ICentrality";
import * as $SU from "../utils/structUtils";


//Calculates the page rank for a given graph
class pageRankCentrality implements $ICentrality.ICentrality {

  getCentralityMap(graph: $G.IGraph, alpha?:number, conv?:number, iterations?:number):{[id:string]: number}{
    if(alpha == null)
      alpha = 0.10;
    if(iterations == null)
      iterations = 1000;
    if(conv == null)
      conv = 0.000125;
    //First initialize the values for all nodes
    let curr:{[id:string]: number} = {};
    let old:{[id:string]: number} = {};
    let nrNodes = graph.nrNodes();
    let structure = {};
    for(let key in graph.getNodes()){
      let node = graph.getNodeById(key);
      structure[key] = {};
      structure[key]['deg'] = node.outDegree()+node.degree();
      structure[key]['inc'] = [];
      let incomingEdges = $SU.mergeObjects([node.inEdges(), node.undEdges()]);
      for(let edge in incomingEdges){
        let edgeNode = incomingEdges[edge];
        let parent = edgeNode.getNodes().a;
        if(edgeNode.getNodes().a.getID() == node.getID())
          parent = edgeNode.getNodes().b;
        structure[key]['inc'].push(parent.getID());
      }
    }
    //console.log(JSON.stringify(structure));
    for(let key in graph.getNodes()) {
      curr[key] = 1/nrNodes;
      old[key] = 1/nrNodes;
    }
    for(let i = 0; i < iterations; i++) {
      /*let all = 0; //Check sum of PageRanks
      for(let k in curr)
        all += curr[k];
      console.log("All:" + all);*/
      let me = 0.0;
      for(let key in graph.getNodes()) { //Run through all nodes in graph
        //console.log(structure[key]);
        let total = 0;
        let parents = structure[key]['inc'];
        for(let k in parents){
          let p = parents[k];
          total += old[p]/structure[p]['deg'];
        }
        //console.log("o:"+old[key] + " n:"+curr[key]);
        curr[key] = total*(1-alpha) + alpha/nrNodes;
        me += Math.abs(curr[key]-old[key]);

      }
      //console.log("Error:"+me);
      if(me <= conv){
        //console.log("Iterations:"+i);
        return curr;
      }
      //console.log("Error:"+me/nrNodes);
      old = $SU.clone(curr);
    }
    return curr;
  }

}

export {
  pageRankCentrality
};