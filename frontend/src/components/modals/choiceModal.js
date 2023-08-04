import Add from './Add.jsx';
import Delete from './Delete.jsx';
import Rename from './Rename.jsx';

const modal = {
  adding: Add,
  delete: Delete,
  renaming: Rename,
};

export default (modalName) => modal[modalName];
