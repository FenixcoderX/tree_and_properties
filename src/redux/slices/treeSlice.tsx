import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

export interface TreeState {
  tree: TreeNode[];
  selectedNode: TreeNode | null;
}

const initialTreeState: TreeState = {
  tree: [],
  selectedNode: null,
};

export const treeSlice = createSlice({
  name: 'tree',
  initialState: initialTreeState,
  reducers: {
    selectNode: (state, action: PayloadAction<string>) => {
      const findNode = (nodes: TreeNode[], id: string): TreeNode | null => {
        for (const node of nodes) {
          if (node.id === id) return node;
          if (node.children) {
            const result = findNode(node.children, id);
            if (result) return result;
          }
        }
        return null;
      };
      state.selectedNode = findNode(state.tree, action.payload);
    },
    setTree: (state, action: PayloadAction<TreeNode[]>) => {
      state.tree = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<TreeNode | null>) => {
      state.selectedNode = action.payload;
    },
  },
});
