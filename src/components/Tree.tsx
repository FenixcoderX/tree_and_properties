import { useDispatch, useSelector } from 'react-redux';
import { treeSlice, TreeNode } from '../redux/slices/treeSlice';
import { RootState } from '../redux/store';

const Tree: React.FC<{ nodes: TreeNode[] }> = ({ nodes }) => {
  const { actions: treeActions } = treeSlice;

  const dispatch = useDispatch();
  const selectedNode = useSelector(
    (state: RootState) => state.tree.selectedNode
  );

  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <button
            onClick={() => dispatch(treeActions.selectNode(node.id))}
            className={`text-blue-500 ${
              selectedNode?.id === node.id ? 'font-bold' : ''
            }`}
          >
            {node.name}
          </button>
          {node.children && node.children.length > 0 && (
            <ul className="ml-4">
              <Tree nodes={node.children} />
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Tree;
