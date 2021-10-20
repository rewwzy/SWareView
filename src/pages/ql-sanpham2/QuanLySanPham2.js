import React, { PureComponent } from "react";
import ControlBar from "../../components/control-bar/ControlBar";
import { ktApi } from "../../services/http";
import DataGrid, {

  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";

import PageTitle from "../../components/page-title/PageTitle";


export class QuanLySanPham2 extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      gridData: [],
    
    };
  }
  componentDidMount() {
    this.getgridDataSource();
  }
  getgridDataSource = () => {
    ktApi.get("/Product/GetAll").then(({ data }) => {
      this.setState({
        gridData: data,
      
      });
    });
  };

 
  render() {
    return (
      <>
   
        {/* <div className="loading-wrapper">
          <LoadPanel visible={this.state.visibleLoading} />
        </div> */}
        <div className="control-button-wrapper">
          <ControlBar phanHe="QuanLySanPham" onClick={this.onClickControlBar} />
       
        </div>
        <PageTitle title="Quản lý sản phẩm" />
        <div className="data-grid-wrapper">
          <DataGrid
            dataSource={this.state.gridData}
            keyExpr="Id"
            showBorders
            showRowLines
            showColumnLines
            wordWrapEnabled
            focusedRowEnabled
            height={window.innerHeight - 200}
     
          >
            <SearchPanel visible placeholder="Tìm kiếm..." />
          
            <Paging defaultPageSize={50} />
            <Pager
              showPageSizeSelector
              allowedPageSizes={[50, 100, 200]}
              visible
              showInfo
            />
          </DataGrid>
        </div>
       
      </>
    );
  }
}

export default QuanLySanPham2;



