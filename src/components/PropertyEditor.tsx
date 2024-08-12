import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { propertySlice, Property } from '../redux/slices/propertySlice';
import { RootState } from '../redux/store';

const PropertyEditor: React.FC<{
  type: 'general' | 'additional';
  properties: Property | undefined;
}> = ({ type, properties }) => {
  const { actions: propertyActions } = propertySlice;
  const dispatch = useDispatch();

  const selectedNode = useSelector(
    (state: RootState) => state.tree.selectedNode
  );

  const [newPropertyKey, setNewPropertyKey] = useState('');
  const [newPropertyValue, setNewPropertyValue] = useState('');
  const [editingPropertyKey, setEditingPropertyKey] = useState<string | null>(
    null
  );
  const [newPropertyName, setNewPropertyName] = useState('');

  const [editError, setEditError] = useState<string | null>(null);
  const [addError, setAddError] = useState<string | null>(null);

  /**
   * Handles the change of a property value
   *
   * @param key - The key in the property object
   * @param value - The new value of the property
   */
  const handleChangeProperty = (
    key: string,
    value: string | number | boolean
  ) => {
    console.log('handleChangeProperty', key, value);
    if (selectedNode) {
      const action =
        type === 'general'
          ? propertyActions.updateGeneralProperty
          : propertyActions.updateAdditionalProperty;
      dispatch(action({ nodeId: selectedNode.id, key, value }));
    }
  };

  /**
   * Handles the deletion of a property
   * 
   * @param {string} key - The key in the property object to be deleted
   */
  const handleDeleteProperty = (key: string) => {
    if (selectedNode) {
      const action =
        type === 'general'
          ? propertyActions.deleteGeneralProperty
          : propertyActions.deleteAdditionalProperty;
      dispatch(action({ nodeId: selectedNode.id, key }));
    }
  };

  /**
   * Handles the addition of a new property
   */
  const handleAddProperty = () => {
    //check if the property with that name already exists
    if (properties && properties[newPropertyKey]) {
      setAddError('Свойство с таким названием уже существует.');
      return;
    }

    if (selectedNode) {
      const action =
        type === 'general'
          ? propertyActions.updateGeneralProperty
          : propertyActions.updateAdditionalProperty;
      dispatch(
        action({
          nodeId: selectedNode.id,
          key: newPropertyKey,
          value: newPropertyValue,
        })
      );
      setNewPropertyKey('');
      setNewPropertyValue('');
      setAddError(null);
    }
  };

  /**
   * Handles the editing of a property
   * 
   * @param key - The key in the property object to be edited
   */
  const handleEditProperty = (key: string) => {
    setEditingPropertyKey(key);
    setNewPropertyName(key);
  };

  /**
   * Checks if a property name is unique within a given set of properties
   * 
   * @param properties - The set of properties
   * @param newName - The new name to check for uniqueness
   * @param oldName - The old name to compare
   * @returns A boolean indicating that the new name is unique or not
   */
  const isPropertyNameUnique = (
    properties: Property,
    newName: string,
    oldName: string
  ): boolean => {
    return (
      newName === oldName ||
      !Object.prototype.hasOwnProperty.call(properties, newName)
    );
  };

  /**
   * Handles saving the edited property
   * 
   * @param {string} oldKey - The old key in the property object
   * @returns {void}
   */
  const handleSavePropertyEdit = (oldKey: string) => {
    if (!selectedNode) return;

    if (properties) {
      if (!isPropertyNameUnique(properties, newPropertyName, oldKey)) {
        setEditError('Свойство с таким названием уже существует.');
        return;
      }
      const value = properties[oldKey];
      const action =
        type === 'general'
          ? propertyActions.updateGeneralProperty
          : propertyActions.updateAdditionalProperty;
      dispatch(
        action({ nodeId: selectedNode.id, key: newPropertyName, value })
      );
      if (newPropertyName !== oldKey) {
        const deleteAction =
          type === 'general'
            ? propertyActions.deleteGeneralProperty
            : propertyActions.deleteAdditionalProperty;
        dispatch(deleteAction({ nodeId: selectedNode.id, key: oldKey }));
      }
      setEditingPropertyKey(null);
      setNewPropertyName('');
      setEditError(null);
    }
  };

  return (
    <div>
      {properties &&
        Object.keys(properties).map((key) => (
          <label key={key} className="block mb-2">
            {editingPropertyKey === key ? (
              <>
                <input
                  type="text"
                  value={newPropertyName}
                  onChange={(e) => setNewPropertyName(e.target.value)}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
                <button
                  onClick={() => handleSavePropertyEdit(key)}
                  className="ml-2 text-green-500"
                >
                  Сохранить
                </button>
                {editError && <div className="text-red-500">{editError}</div>}
              </>
            ) : (
              <>
                {key}:
                <input
                  type="text"
                  value={properties[key] as string}
                  onChange={(e) => handleChangeProperty(key, e.target.value)}
                  className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
                />
                <button
                  onClick={() => handleEditProperty(key)}
                  className="ml-2 text-blue-500"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDeleteProperty(key)}
                  className="ml-2 text-red-500"
                >
                  Удалить
                </button>
              </>
            )}
          </label>
        ))}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Новое свойство"
          value={newPropertyKey}
          onChange={(e) => setNewPropertyKey(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
        />
        <input
          type="text"
          placeholder="Значение"
          value={newPropertyValue}
          onChange={(e) => setNewPropertyValue(e.target.value)}
          className="block w-full mt-1 border border-gray-300 rounded-md shadow-sm"
        />
        <button
          onClick={handleAddProperty}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Добавить свойство
        </button>
        {addError && <div className="text-red-500">{addError}</div>}
      </div>
    </div>
  );
};

export default PropertyEditor;
