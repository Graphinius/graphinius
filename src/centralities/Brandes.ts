/**
 * Created by ru on 14.09.17.
 */



import * as $G from '../core/Graph';
import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
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


    let N = graph.nrNodes();
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
            let neighbors = [];
            let edges = $SU.mergeObjects([v.undEdges(),v.outEdges()]);
            for(let e in edges){
                let edge_nodes = edges[e].getNodes();
                if(edge_nodes.a.getID() == v.getID()){
                    neighbors.push(edge_nodes.b);
                }else{
                    neighbors.push(edge_nodes.a);
                }
            }
            //console.log("neighbors:"+JSON.stringify(neighbors));
            for(let ne in neighbors){
                w = neighbors[ne];
                //Path discovery: w found for the first time?
                if(dist[w.getID()] == Number.POSITIVE_INFINITY){
                    Q.push(w);
                    dist[w.getID()] = dist[v.getID()] + 1;
                }
                //Path counting: edge (v,w) on shortest path?
                if(dist[w.getID()] == dist[v.getID()]+1){
                    sigma[w.getID()] += sigma[v.getID()];
                    Pred[w.getID()].push(v.getID());
                    console.log("PUSHED V:" + v.getID() + " now is:"+JSON.stringify(Pred[w.getID()]));
                }
            }
        }
        //Accumulation: back-propagation of dependencies
        //delta = {};

        console.log("Pred: " + JSON.stringify(Pred));
        while(S.length >= 1){
            w = S.pop();
            console.log("Popping: "+w.getID());
            console.log("Pred on w:"+JSON.stringify(Pred[w.getID()]));
            for(let key in Pred[w.getID()]){
                let lvKey = Pred[w.getID()][key];
                console.log("Values: sigma[v]:" + sigma[lvKey]+" sigma[w]:"+sigma[w.getID()] + " delta[w]:" + delta[w.getID()]);
                delta[lvKey] = delta[lvKey] + (sigma[lvKey]/sigma[w.getID()]*(1+delta[w.getID()]));
            }
            if(w.getID()!=s.getID()){
                CB[w.getID()] = (CB[w.getID()] | 0 ) + delta[w.getID()];
                CB[w.getID()] /= 2;
                console.log("CB:"+CB[w.getID()]);
            }
        }
    }
    return CB;
}
export {Brandes}