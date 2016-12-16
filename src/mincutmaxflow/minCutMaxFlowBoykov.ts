/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';


export interface MCMFConfig {
	directed: boolean; // do we
}


export interface MCMFResult {
  edges : Array<$E.IBaseEdge>;
  cost  : number;
}


export interface IMCMFBoykov {
  calculateCycle() : MCMFResult;

  prepareMCMFStandardConfig() : MCMFConfig;
}


export interface MCMFState {
  activeNodes : {[key:string] : $N.IBaseNode};
  orphans     : {[key:string] : $N.IBaseNode};
  treeS       : {[key:string] : $N.IBaseNode};
  treeT       : {[key:string] : $N.IBaseNode};
  path        : Array<$N.IBaseNode>
}



/**
 * 
 */
class MCMFBoykov implements IMCMFBoykov {

  private _config : MCMFConfig;
  private _state  : MCMFState = {
    activeNodes : {},
    orphans     : {},
    treeS       : {},
    treeT       : {},
    path        : []
  };
  
  constructor( private _graph 	 : $G.IGraph, 
						   private _source	 : $N.IBaseNode,
               private _sink     : $N.IBaseNode,
						   config?           : MCMFConfig ) 
  {
     this._config = config || this.prepareMCMFStandardConfig();
  } 


  calculateCycle() {
    var result: MCMFResult = {
      edges: [],
      cost: 0
    }


    return result;
  }



  prepareMCMFStandardConfig() : MCMFConfig {
    return {
      directed: true
    }
  }

}


export {
  MCMFBoykov 
};
