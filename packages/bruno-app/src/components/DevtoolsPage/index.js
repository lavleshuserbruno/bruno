import { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { openCollection, importCollection } from 'providers/ReduxStore/slices/collections/actions';
import { IconBrandGithub, IconPlus, IconDownload, IconFolders, IconSpeakerphone, IconBook } from '@tabler/icons';
import CodeEditor from 'components/CodeEditor';
import { useTheme } from 'providers/Theme';
import get from 'lodash/get';

import Bruno from 'components/Bruno';
import CreateCollection from 'components/Sidebar/CreateCollection';
import ImportCollection from 'components/Sidebar/ImportCollection';
import ImportCollectionLocation from 'components/Sidebar/ImportCollectionLocation';
import StyledWrapper from './StyledWrapper';

const DevtoolsPage = () => {
  const dispatch = useDispatch();
  const [importedCollection, setImportedCollection] = useState(null);
  const [createCollectionModalOpen, setCreateCollectionModalOpen] = useState(false);
  const [importCollectionModalOpen, setImportCollectionModalOpen] = useState(false);
  const [importCollectionLocationModalOpen, setImportCollectionLocationModalOpen] = useState(false);
  const [jsonBodyData, setJsonBodyData] = useState('');

  const { storedTheme } = useTheme();
  const bodyMode = 'json';
  const body = '';
  const preferences = useSelector((state) => state.app.preferences);

  const handleOpenCollection = () => {
    dispatch(openCollection()).catch(
      (err) => console.log(err) && toast.error('An error occurred while opening the collection')
    );
  };

  const handleImportCollection = (collection) => {
    setImportedCollection(collection);
    setImportCollectionModalOpen(false);
    setImportCollectionLocationModalOpen(true);
  };

  const handleImportCollectionLocation = (collectionLocation) => {
    dispatch(importCollection(importedCollection, collectionLocation));
    setImportCollectionLocationModalOpen(false);
    setImportedCollection(null);
    toast.success('Collection imported successfully');
  };

  const onPrettify = () => {
    console.log('body?.json', jsonBodyData);
    if (jsonBodyData != '') {
      try {
        const bodyJson = JSON.parse(jsonBodyData);
        const prettyBodyJson = JSON.stringify(bodyJson, null, 2);
        setJsonBodyData(prettyBodyJson);
      } catch (e) {
        toastError(new Error('Unable to prettify. Invalid JSON format.'));
      }
    }
  };

  const onEdit = (value) => {
    setJsonBodyData(value);
  };

  let codeMirrorMode = {
    json: 'application/ld+json'
  };

  return (
    <StyledWrapper className="pb-4 px-6 mt-6">
      {createCollectionModalOpen ? <CreateCollection onClose={() => setCreateCollectionModalOpen(false)} /> : null}
      {importCollectionModalOpen ? (
        <ImportCollection onClose={() => setImportCollectionModalOpen(false)} handleSubmit={handleImportCollection} />
      ) : null}
      {importCollectionLocationModalOpen ? (
        <ImportCollectionLocation
          collectionName={importedCollection.name}
          onClose={() => setImportCollectionLocationModalOpen(false)}
          handleSubmit={handleImportCollectionLocation}
        />
      ) : null}

      <div className="">
        <Bruno width={50} />
      </div>
      <div className="text-xl font-semibold select-none">bruno</div>
      <div className="mt-4">JSON Prettify </div>

      <div style={{ float: 'right', marginTop: '-40px' }}>
        <button className="submit btn btn-md btn-secondary" onClick={onPrettify}>
          Prettify
        </button>
      </div>

      <CodeEditor
        theme={storedTheme}
        font={get(preferences, 'font.codeFont', 'default')}
        value={jsonBodyData}
        onEdit={onEdit}
        mode={codeMirrorMode[bodyMode]}
      />
    </StyledWrapper>
  );
};

export default DevtoolsPage;
