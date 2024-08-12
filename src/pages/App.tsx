import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { treeSlice } from '../redux/slices/treeSlice';
import { propertySlice } from '../redux/slices/propertySlice';
import store, { RootState } from '../redux/store';
import { saveAs } from 'file-saver';
import Tree from '../components/Tree';
import Properties from '../components/Properties';
import { fetchData } from '../api/fetchData';

const App: React.FC = () => {
  const { actions: treeActions } = treeSlice;
  const { actions: propertyActions } = propertySlice;

  const dispatch = useDispatch();
  const tree = useSelector((state: RootState) => state.tree.tree);

  useEffect(() => {
    /**
     * Fetches initial data and updates the state with the fetched data
     */
    const InitialData = async () => {
      try {
        const data = await fetchData();
        if (data.tree && data.properties) {
          dispatch(treeActions.setTree(data.tree.tree));
          dispatch(treeActions.setSelectedNode(data.tree.selectedNode));
          dispatch(propertyActions.setProperties(data.properties));
        } else {
          console.error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    InitialData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Save data to the JSON file
   */
  const handleSave = () => {
    const state = store.getState();
    const json = JSON.stringify(state);
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'data.json');
  };

  /**
   * Load data from the JSON file
   * @param event - The change event of the input element
   */
  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          const data = JSON.parse(result as string);
          if (data.tree && data.properties) {
            dispatch(treeActions.setTree(data.tree.tree));
            dispatch(treeActions.setSelectedNode(data.tree.selectedNode));
            dispatch(propertyActions.setProperties(data.properties));
          } else {
            console.error('Invalid data format');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/3 p-4">
        <Tree nodes={tree} />
      </div>
      <div className="w-2/3 p-4">
        <Properties />
      </div>
      <div className="absolute bottom-4 left-4">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Сохранить в JSON
        </button>
        <input type="file" onChange={handleLoad} className="ml-2" />
      </div>
    </div>
  );
};

export default App;
