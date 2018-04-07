import * as fs from 'fs';

const scc20K_path = '../social_network_edges_20K.csv';
let scc20K_weighted_path = '../social_network_edges_20K_weighted.csv';

let graph_string = fs.readFileSync( scc20K_path ).toString();
let result_graph = "";
let line_arr : Array<string|number>;

graph_string.split("\n").forEach( line => {
  line_arr = line.trim().split(" ");
  if ( line_arr.length < 2 ) {
    return;
  }
  line_arr.push( 1 + parseFloat( (Math.random()*20 ).toFixed(2) ) );
  result_graph += line_arr.join(' ') + '\n';
});
fs.writeFileSync(scc20K_weighted_path, result_graph);
