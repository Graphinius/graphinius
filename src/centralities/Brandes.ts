/**
 * Created by ru on 14.09.17.
 */



import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $SU from '../utils/structUtils'

function Brandes(graph: $G.IGraph): {} {
    //Information taken from graph
    let adj_array = graph.adjListArray(),
        nodes = graph.getNodes();
    //Variables for Brandes algorithm
    let s,     //current node of outer loop
        v : $N.IBaseNode,     //current node of inner loop
        w : $N.IBaseNode,     //neighbour of v
        Pred : { [key: string] : string[]} = {},     //list of Predecessors
        sigma : {[key:string] : number} = {}, //number of shortest paths from source to v
        delta : {[key:string] : number} = {}, //dependency of source on v
        dist  : {[key:string] : number} = {},  //distances
        Q : $N.IBaseNode[] = [],     //Queue of nodes
        S : $N.IBaseNode[] = [],     //stack of nodes
        CB: {[key:string] : number} = {};    //Betweenness values

    for(let n in nodes){
        CB[nodes[n].getID()] = 0;
    }
    let sum = 0;    //The sum of betweennesses
    //let N = graph.nrNodes();
    for(let i in nodes){
        s = nodes[i];

        //Initialization
        for(let n in nodes){
            Pred[nodes[n].getID()] = [];
        }
        for(let n in nodes){
            dist[nodes[n].getID()]  = Number.POSITIVE_INFINITY;
            sigma[nodes[n].getID()] = 0;
            delta[nodes[n].getID()] = 0;
        }
        dist[s.getID()]  = 0;
        sigma[s.getID()] = 1;
        Q.push(s);

        while(Q.length >= 1){ //Queue not empty
            v = Q.shift();
            S.push(v);
            let neighbors = v.reachNodes();
            //console.log("neighbors:"+JSON.stringify(neighbors));
            for(let ne in neighbors){
                w = neighbors[ne].node;
                //Path discovery: w found for the first time?
                if(dist[w.getID()] == Number.POSITIVE_INFINITY){
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                //Path counting: edge (v,w) on shortest path?
                if(dist[w.getID()] == dist[v.getID()]+1){
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v.getID());
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        while(S.length >= 1){
            w = S.pop();
            for(let key in Pred[w.getID()]){
                let lvKey = Pred[w.getID()][key];
                delta[lvKey] = delta[lvKey] + (sigma[lvKey]*(1+delta[w.getID()]));
            }
            if(w.getID()!=s.getID()){
                CB[w.getID()] += delta[w.getID()];
                sum += delta[w.getID()];
            }
            sigma[w.getID()] = 0;
            delta[w.getID()] = 0;
            dist[w.getID()] = Number.POSITIVE_INFINITY;
        }
    }
    for(let n in nodes){
        CB[nodes[n].getID()] /= sum;
    }
    return CB;
}
export {Brandes}