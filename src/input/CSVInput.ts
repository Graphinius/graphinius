/// <reference path="../../typings/tsd.d.ts" />

import _ = require('lodash');

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';

interface ICSVInput {
	_separator: string;
	// setSeparator(sep: string) : void;
	
	readFromAdjacenyList(file : string) : $G.IGraph;
}

class CSVInput implements ICSVInput {
	
	constructor(public _separator : string = ',') {		
	}
	
	
	readFromAdjacenyList(file : string) : $G.IGraph {
		var graph = new $G.BaseGraph(file);
		
		
		
		return graph;
	}
	
}

export {ICSVInput, CSVInput};