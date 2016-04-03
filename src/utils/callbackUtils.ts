/**
 * @param context this pointer to the DFS or DFSVisit function
 */
function execCallbacks(cbs : Array<Function>, context?) {
  cbs.forEach( function(cb) {
    if ( typeof cb === 'function' ) {
      cb(context);
    }
    else {
      throw new Error('Provided callback is not a function.');
    }
  });
}

export { execCallbacks };