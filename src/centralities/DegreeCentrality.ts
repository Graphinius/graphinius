/// <reference path="../../typings/tsd.d.ts" />

import * as $G from '../core/Graph';
import * as $ICentrality from "../centralities/ICentrality";

export enum DegreeMode{
  in,
  out,
  und,
  dir,
  all
}

class degreeCentrality implements $ICentrality.ICentrality{

  getCentralityMap( graph: $G.IGraph, conf?: DegreeMode):{[id:string]: number}{
    if(conf == null)
      conf = DegreeMode.all;
    let ret:{[id:string]: number} = {}; //Will be a map of [nodeID] = centrality

    switch(conf){ //Switch on the outside for faster loops
      case DegreeMode.in:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            ret[key] = node.inDegree(); console.log("::" + key + " " + ret[key]);
        }
        break;
      case DegreeMode.out:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            ret[key] = node.outDegree();
        }
        break;
      case DegreeMode.und:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            ret[key] = node.degree();
        }
        break;
      case DegreeMode.dir:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            ret[key] = node.inDegree() + node.outDegree();
        }
        break;
      case DegreeMode.all:
        for(let key in graph.getNodes()){
          let node = graph.getNodeById(key);
          if(node!=null)
            ret[key] = node.degree() + node.inDegree() + node.outDegree();
        }
        break;
    }
    return ret;
  }

  getHistorgram(graph: $G.IGraph){
    return graph.degreeDistribution();
  }
}

export {
  degreeCentrality
};