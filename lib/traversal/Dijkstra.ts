import * as $N from '@/core/base/BaseNode';
import * as $G from '@/core/base/BaseGraph';
import * as $PFS from '@/traversal/PFS';


/**
 * @todo Consider target node callbacks / messages
 * @param graph
 * @param source
 * @param target
 */
function Dijkstra( graph   : $G.IGraph,
                   source  : $N.IBaseNode,
                   target? : $N.IBaseNode ) : {[id: string] : $PFS.PFS_ResultEntry} 
{
  let config = $PFS.preparePFSStandardConfig();

  if ( target ) {
    config.goal_node = target;
  }

  return $PFS.PFS( graph, source, config );
}

export {
  Dijkstra
};
