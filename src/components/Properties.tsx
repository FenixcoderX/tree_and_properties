import { useSelector } from 'react-redux';
import { Tab, TabGroup, TabList, TabPanels, TabPanel } from '@headlessui/react';
import { RootState } from '../redux/store';
import PropertyEditor from '../components/PropertyEditor';

const Properties: React.FC = () => {
  const selectedNode = useSelector(
    (state: RootState) => state.tree.selectedNode
  );
  const generalProperties = useSelector((state: RootState) =>
    selectedNode
      ? state.properties.generalProperties[selectedNode.id]
      : undefined
  );
  const additionalProperties = useSelector((state: RootState) =>
    selectedNode
      ? state.properties.additionalProperties[selectedNode.id]
      : undefined
  );

  if (!selectedNode)
    return <div>Выберите элемент, чтобы увидеть его свойства.</div>;

  return (
    <div>
      <TabGroup>
        <TabList className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
          <Tab
            className={({ selected }) =>
              selected
                ? 'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg'
                : 'w-full py-2.5 text-sm leading-5 font-medium text-blue-100 rounded-lg'
            }
          >
            Общие свойства
          </Tab>
          <Tab
            className={({ selected }) =>
              selected
                ? 'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg'
                : 'w-full py-2.5 text-sm leading-5 font-medium text-blue-100 rounded-lg'
            }
          >
            Дополнительные свойства
          </Tab>
        </TabList>
        <TabPanels className="mt-2">
          <TabPanel className="p-3">
            <PropertyEditor type="general" properties={generalProperties} />
          </TabPanel>
          <TabPanel className="p-3">
            <PropertyEditor
              type="additional"
              properties={additionalProperties}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default Properties;
