import * as $N from '../core/base/BaseNode';
import * as $G from '../core/base/BaseGraph';
import * as $SU from '../utils/StructUtils'

export enum DegreeMode {
  in,
  out,
  und,
  dir,
  all
}

/**
 * @todo per edge type ???
 */
export interface DegreeDistribution {
	in	: Uint32Array;
	out	: Uint32Array;
	dir	: Uint32Array;
	und	: Uint32Array;
	all	: Uint32Array;
}


class DegreeCentrality {

  constructor(){}

  getCentralityMap( graph: $G.IGraph, weighted?: boolean, conf?: DegreeMode):{[id:string]: number} {
    weighted = ( weighted != null ) ? !!weighted : true;
    conf = ( conf == null ) ? DegreeMode.all : conf;
    
    let ret:{[id:string]: number} = {}; //Will be a map of [nodeID] = centrality

    switch(conf){ //Switch on the outside for faster loops
      case DegreeMode.in:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.in_deg;
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.inEdges()) {
                ret[key] += node.inEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.out:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.out_deg;
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.outEdges()) {
                ret[key] += node.outEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.und:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.deg;
            }
            else {
              ret[key] = ret[key]||0;
              for(let k in node.undEdges()) {
                ret[key] += node.undEdges()[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.dir:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.in_deg + node.out_deg;
            }
            else {
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges()]);
              for(let k in comb) {
                ret[key] += comb[k].getWeight();
              }
            }
          }
        }
        break;

      case DegreeMode.all:
        for(let key in graph.getNodes()) {
          let node = graph.getNodeById(key);
          if(node!=null) {
            if(!weighted) {
              ret[key] = node.deg + node.in_deg + node.out_deg;
            }
            else {
              ret[key] = ret[key]||0;
              let comb = $SU.mergeObjects([node.inEdges(), node.outEdges(), node.undEdges()]);
              for(let k in comb) {
                ret[key] += comb[k].getWeight();
              }
            }
          }
        }
        break;
    }
    return ret;
  }

  
	/**
	 * @TODO Weighted version !
   * @TODO per edge type !
	 */
  degreeDistribution(graph: $G.IGraph) {
		let max_deg : number = 0,
        key			: string,
        nodes   : {[id: string] : $N.IBaseNode} = graph.getNodes(),
				node 		: $N.IBaseNode,
				all_deg : number;

		for ( key in nodes ) {
			node = nodes[key];
			all_deg = node.in_deg + node.out_deg + node.deg + 1;
			max_deg =  all_deg > max_deg ? all_deg : max_deg;
		}

		let deg_dist : DegreeDistribution = {
			in: new Uint32Array(max_deg),
			out: new Uint32Array(max_deg),
			dir: new Uint32Array(max_deg),
			und: new Uint32Array(max_deg),
			all: new Uint32Array(max_deg)
		};

		for ( key in nodes ) {
			node = nodes[key];
			deg_dist.in[node.in_deg]++;
			deg_dist.out[node.out_deg]++;
			deg_dist.dir[node.in_deg + node.out_deg]++;
			deg_dist.und[node.deg]++;
			deg_dist.all[node.in_deg + node.out_deg + node.deg]++;
		}
		// console.dir(deg_dist);
		return deg_dist;
	}
}

export {
  DegreeCentrality
};