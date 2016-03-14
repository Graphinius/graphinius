/**
 * @param context this pointer to the DFS or DFSVisit function
 */
function execCallbacks(cbs, context) {
    cbs.forEach(function (cb) {
        if (typeof cb === 'function') {
            cb(context);
        }
    });
}
exports.execCallbacks = execCallbacks;
