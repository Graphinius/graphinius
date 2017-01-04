/// <reference path="../../typings/tsd.d.ts" />

import * as $N from '../core/Nodes';
import * as $E from '../core/Edges';
import * as $G from '../core/Graph';
import * as $CB from '../utils/callbackUtils';
import * as $MC from '../mincutmaxflow/minCutMaxFlowBoykov';


export interface EMEConfig {
	directed: boolean; // do we
  labeled: boolean;
}


export interface EMEResult {
  graph : $G.IGraph;
}


export interface IEMEBoykov {
  calculateCycle() : EMEResult;

  prepareEMEStandardConfig() : EMEConfig;
}


export interface EMEState {
	expansionGraph	: $G.IGraph;
  activeLabel     : string;
}



/**
 *
 */
class EMEBoykov implements IEMEBoykov {

  private _config : EMEConfig;
  private _state  : EMEState = {
		expansionGraph 	: null,
    activeLabel     : ''
  };

  constructor( private _graph 	 : $G.IGraph,
               private _labels   : Array<string>,
						   config?           : EMEConfig )
  {
     this._config = config || this.prepareEMEStandardConfig();
     this._labels = _labels;
  }


  calculateCycle() {
    var success : boolean = false;

    if (success) {
      this.calculateCycle();
    }

    var result: EMEResult = {
			graph : null
    }

    result.graph = this._state.expansionGraph;
    return result;
  }



  prepareEMEStandardConfig() : EMEConfig {
    return {
      directed: true,
      labeled: false
    }
  }

}


export {
  EMEBoykov
};
