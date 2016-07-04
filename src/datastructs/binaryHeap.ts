/// <reference path="../../typings/tsd.d.ts" />


export enum BinaryHeapMode {
  MIN,
  MAX
}


export interface PositionHeapEntry {
  priority: number;
  position: number;
}


export interface IBinaryHeap {
  // Helper methods
  getMode()                     : BinaryHeapMode;
  getArray()                    : Array<any>;
  size()                        : number;
  getEvalPriorityFun()          : Function;
  evalInputPriority(obj: any)   : number;
  getEvalObjIDFun()             : Function;
  evalInputObjID(obj:any)       : any;

  // Actual heap operations
  insert(obj: any)                  : void;
  remove(obj: any)                  : any;
  peek()                            : any;
  pop()                             : any;
  find(obj: any)                    : any;
  // adjust(obj: any, new_val: number) : any;
  
  // Just temporarily, for debugging
  getPositions()                : any;
}


class BinaryHeap implements IBinaryHeap {
  private _array = [];
  private _positions : {[id: string]: PositionHeapEntry} | {[id: string]: Array<PositionHeapEntry>}= {};

  /**
   * Mode of a min heap should only be set upon
   * instantiation and never again afterwards...
   * @param _mode MIN or MAX heap
   * @param _evalPriority the evaluation function applied to
   * all incoming objects to determine it's score
   * @param _evalObjID function to determine the identity of
   * the object we are looking for at removal etc..
   */
  constructor( private _mode = BinaryHeapMode.MIN,
               private _evalPriority = (obj:any) : number => {
                 if ( typeof obj !== 'number' && typeof obj !== 'string') {
                   return NaN;
                 }
                 return parseInt(obj)
               },
               private _evalObjID = (obj:any) : any => {
                 return obj;
               }
             ) {}

  getMode() : BinaryHeapMode {
    return this._mode;
  }
  
  getArray() : Array<any> {
    return this._array;
  }
  
  getPositions() {
    return this._positions;
  }
  
  size() : number {
    return this._array.length;
  }

  getEvalPriorityFun(): Function {
    return this._evalPriority;
  }

  evalInputPriority(obj: any) : number {
    return this._evalPriority(obj);
  }

  getEvalObjIDFun() : Function {
    return this._evalObjID;
  }
  
  evalInputObjID(obj:any) : any {
    return this._evalObjID(obj);
  }

  peek() : any {
    return this._array[0];
  }

  pop() {
    if ( this.size() ) {
      return this.remove(this._array[0]);
    }
  }
  
  find(obj: any) : any {
    var pos = this.getNodePosition(obj);
    return this._array[pos];
  }

  /**
   * Insert - Adding an object to the heap
   * @param obj the obj to add to the heap
   * @returns {number} the objects index in the internal array
   */
  insert(obj: any) {
    if ( isNaN( this._evalPriority(obj) ) ) {
      throw new Error("Cannot insert object without numeric priority.")
    }

    this._array.push(obj);
    this.setNodePosition(obj, this.size() - 1, false);
    this.trickleUp(this.size() - 1);
  }
  
  
  /**
   * 
   */
  remove(obj: any) : any {
    if ( isNaN( this._evalPriority(obj) ) ) {
      throw new Error('Object invalid.');
    }

    /**
     * Search in O(1)
     */
    // var pos = this.getNodePosition(obj),
    //     found = this._array[pos];
        
    // if ( typeof found !== 'undefined' && found !== null ) {
    //   var last = this._array.pop();
    //   this.unsetNodePosition(found);
      
    //   if ( this.size() ) {
    //     this._array[pos] = last;
    //     // update node position before trickling
    //     this.setNodePosition(last, pos, true, this.size()); // old size after pop()..
    //     this.trickleUp(pos);
    //     this.trickleDown(pos);
    //   }
    //   return found;
    // }

    /**
     * OLD SEARCH in O(n) (but simpler)
     */
    var objID = this._evalObjID(obj),
        found = undefined;
    for (var pos = 0; pos < this._array.length; pos++) {
      if ( this._evalObjID(this._array[pos]) === objID ) {
        found = this._array[pos];
        // we pop the last element
        var last = this._array.pop();
        // we switch the last with the found element
        // and restore the heaps order, but only if the
        // heap size is not down to zero
        if ( this.size() ) {
          this._array[pos] = last;
          this.trickleUp(pos);
          this.trickleDown(pos);
        }
        return found;
      }
    }    
    
    // console.log("Found undefined object at position: " + pos);

    return found;
  }


  private trickleDown(i: number) {
    var parent = this._array[i];

    // run until we manually break
    while (true) {
      var right_child_idx = (i + 1) * 2,
          left_child_idx = right_child_idx - 1,
          right_child = this._array[right_child_idx],
          left_child = this._array[left_child_idx],
          swap = null;

      // check if left child exists
      if ( left_child_idx < this.size() && !this.orderCorrect( parent, left_child ) ) {
        swap = left_child_idx;
      }

      if ( right_child_idx < this.size() && !this.orderCorrect( parent, right_child )
                                         && !this.orderCorrect( left_child, right_child ) ) {
        swap = right_child_idx;
      }

      if ( swap === null ) {
        break;
      }

      // we only have to swap one child, doesn't matter which one
      this._array[i] = this._array[swap];
      this._array[swap] = parent;

      // correct position for later lookup in O(1)
      this.setNodePosition(this._array[i], i, true, swap);
      this.setNodePosition(this._array[swap], swap, true, i);

      i = swap;
    }
  }

  private trickleUp(i: number) {
    var child = this._array[i];

    // Can only trickle up from positive levels
    while ( i ) {
      var parent_idx = Math.floor((i + 1) / 2) - 1,
          parent = this._array[parent_idx];
      if ( this.orderCorrect( parent, child ) ) {
        break;
      }
      else {
        this._array[parent_idx] = child;
        this._array[i] = parent;

        // correct position for later lookup in O(1)
        this.setNodePosition(child, parent_idx, true, i);
        this.setNodePosition(parent, i, true, parent_idx);

        // next round...
        i = parent_idx;
      }
    }
  }

  private orderCorrect(obj_a, obj_b) {
    var obj_a_pr = this._evalPriority(obj_a);
    var obj_b_pr = this._evalPriority(obj_b);
    if ( this._mode === BinaryHeapMode.MIN ) {
      return obj_a_pr <= obj_b_pr;
    }
    else {
      return obj_a_pr >= obj_b_pr;
    }
  }

  /**
   * Superstructure to enable search in BinHeap in O(1)
   * @param obj
   * @param pos
   */
  private setNodePosition(obj: any, new_pos: number, replace = true, old_pos?: number) : void {
    if ( typeof obj === 'undefined' || obj === null || typeof new_pos === 'undefined' || new_pos === null ) {
      throw new Error('minium required arguments are ojb and new_pos');
    }
    if ( replace === true && ( typeof old_pos === 'undefined' || old_pos === null ) ) {
      throw new Error('replacing a node position requires an old_pos');
    }
    
    // First we create a new entry object
    var pos_obj : PositionHeapEntry = {
      priority: this.evalInputPriority(obj),
      position: new_pos
    };
    var obj_key = this.evalInputObjID(obj);
    var occurrence : PositionHeapEntry | Array<PositionHeapEntry> = this._positions[obj_key];

    if ( !occurrence ) {
      // we can simply add the object to the hash...
      this._positions[obj_key] = pos_obj;
    }
    else if ( Array.isArray(occurrence) ) {
      // if we replace, we add the position object to the array
      if ( replace ) {
        for ( var i = 0; i < occurrence.length; i++ ) {
          if ( occurrence[i].position === old_pos ) {
            occurrence[i].position = new_pos;
            return;
          }
        }
      }
      else {
        occurrence.push(pos_obj);
      }
    }
    else {
      // we have a single object at this place...
      // either we replace the droid or we give it some company ;)
      if ( replace ) {
        this._positions[obj_key] = pos_obj; 
      } 
      else {
        this._positions[obj_key] = [occurrence, pos_obj];
      }
    }
  }


  /**
   *
   */
  private getNodePosition(obj: any) : number {
    var obj_key = this.evalInputObjID(obj);
    var occurrence : PositionHeapEntry | Array<PositionHeapEntry> = this._positions[obj_key];

    if ( !occurrence ) {
      console.log("getNodePosition: no occurrence found");
      console.log("Neighborhood entry: ");
      console.dir(obj);
      console.log("Object KEY: " + obj_key);
      return undefined;
    }
    else if ( Array.isArray(occurrence) ) {
      // lets find the droid we are looking for...
      // we are of course looking for the smallest one ;)
      var node : PositionHeapEntry = null,
          min = Number.POSITIVE_INFINITY;
          
      for ( var i = 0; i < occurrence.length; i++ ) {
        if ( occurrence[i].position < min ) {          
          node = occurrence[i];
        }
      }
      if ( node ) {
        if ( typeof node.position === 'undefined' ) console.log('Node position: undefined!');
        return node.position;
      }
    }
    else {
      // we have a single object at this place
      if ( typeof occurrence.position === 'undefined' ) console.log('Occurrence position: undefined!');
      return occurrence.position;
    }
  }
  
  
  /**
   * @param obj
   * @returns {number}
   */
  private unsetNodePosition(obj: any) {
    var obj_key = this.evalInputObjID(obj);
    var occurrence : PositionHeapEntry | Array<PositionHeapEntry> = this._positions[obj_key];

    if ( !occurrence ) {
      console.log("Neighborhood entry: ");
      console.log("Object: ");
      console.dir(obj);
      console.log("Object KEY: " + obj_key);
      return undefined;
    }
    else if ( Array.isArray(occurrence) ) {
      // lets find the droid we are looking for...
      // we are of course looking for the smallest one ;)
      var node_idx : number = null,
          node : PositionHeapEntry = null,
          min : number = Number.POSITIVE_INFINITY;
                              
      for ( var i = 0; i < occurrence.length; i++ ) {
        if ( occurrence[i].position < min ) {
          node_idx = i;
          node = occurrence[i];
        }
      }
      
      if ( node ) { // necessary?
        // remove the wanted droid (it's become useless...)
        occurrence.splice(node_idx, 1);
        // if only 1 droid remains, make him officially single!
        if ( occurrence.length === 1 ) {
          this._positions[obj_key] = occurrence[0];
        }
        
        
        if ( typeof node.position === 'undefined' ) console.log('Node position: undefined!');
        return node.position;
      }   
    }
    else {
      // we have a single object at this place
      delete this._positions[obj_key];
      return occurrence.position;
    }
  }
  
  
}


export { BinaryHeap };