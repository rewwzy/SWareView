import React from 'react';
import DataGrid from 'devextreme-react/data-grid';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'http://localhost:5001/api/quanlythuaphatlaidetail';

class MasterDetailGrid extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = getMasterDetailGridDataSource(props.data.key);
  }
  render() {
    return (
      <DataGrid
        dataSource={this.dataSource}
        showBorders={true}
      />
    );
  }
}

function getMasterDetailGridDataSource(Id) {
  return {
    store: createStore({
      loadUrl: `${url}/GetAll`,
      loadParams: { SoThe: Id },
      onBeforeSend: (method, ajaxOptions) => {
        ajaxOptions.xhrFields = { withCredentials: true };
      }
    })
  };
}

export default MasterDetailGrid;
