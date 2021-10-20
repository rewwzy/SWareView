import React, { Component } from "react";
import ControlBar from "../../components/control-bar/ControlBar";
import PopupTemplate from "../../components/popup-template/PopupTemplate";
import { ktApi } from "../../services/http";
import { NotificationManager as Toast } from "react-notifications";
import moment from "moment";
import _ from "lodash";
import qS from "query-string";
import {
  TreeList,
  Scrolling,
  Paging,
  Pager,
  Column,
  FilterRow,
  Selection,
  SearchPanel,
  Lookup,
} from "devextreme-react/tree-list";
import { Popup, ToolbarItem } from "devextreme-react/popup";
import Form, { SimpleItem, GroupItem, Label } from "devextreme-react/form";
import {
  DateBox,
  DropDownBox,
  TextBox,
  LoadPanel,
  CheckBox,
  RadioGroup,
} from "devextreme-react";
import { delayTyping } from "../../utils/common";
import { stubString } from "lodash";
import PageTitle from "../../components/page-title/PageTitle";
import ValidMessage from "../../components/valid-message/ValidMessage";
import DropDown from "../../components/drop-down/DropDown";
import "./style.scss";

export class DmDonVi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeListData: [],
      visiblePopup: false,
      selectedRowData: null,
      visibleDeletePopup: false,
      diaBanLookupData: null,
      //linhVucLookupData: null,
      loading: false,
    };
  }

  getDataSource = () => {
    this.setState({ loading: true });
    ktApi.get("/Dm_DonVi/GetAll").then((res) => {
      this.setState({ treeListData: res.data });
      this.setState({ loading: false });
    });
  };

  getLookupData = () => {
    ktApi.get("/Dm_DiaBan/GetAll").then((res) => {
      const diaBanFilter = res.data.filter(
        (item) =>
          new Date(item.NgayHieuLuc) <= new Date() &&
          new Date(item.NgayHetHieuLuc) >= new Date()
      );
      this.setState({ diaBanLookupData: diaBanFilter });
    });

    // ktApi.get("/Dm_LinhVuc/GetAll").then((res) => {
    //   this.setState({ linhVucLookupData: res.data });
    // });
  };

  // get dữ liệu
  componentDidMount() {
    this.getDataSource();
    this.getLookupData();
  }

  onControlBarClick = (e) => {
    const { selectedRowData } = this.state;
    if (e.mode === "CREATE") {
      this.setState({
        mode: e.mode,
      });
      this.togglePopup(true);
    } else if (e.mode === "DELETE") {
      if (!selectedRowData || !selectedRowData?.Id) {
        Toast.warning(
          "Vui lòng chọn bản ghi trước khi xoá",
          "Cảnh báo !",
          1000
        );
        return;
      }
      const { treeListData } = this.state;
      const isHadChildren =
        treeListData.filter((item) => item.IdCha === selectedRowData?.Id)
          .length > 0;
      if (isHadChildren) {
        Toast.warning("Vui lòng xoá hết dữ liệu con", "Cảnh báo !", 1000);
        return;
      }
      this.setState({ visibleDeletePopup: true });
    } else if (e.mode === "EDIT") {
      if (selectedRowData && selectedRowData.Id) {
        this.setState({ mode: e.mode });
        this.togglePopup(true);
      } else {
        //thong bao chua chon
        Toast.warning("Vui lòng chọn bản ghi", "Cảnh báo !", 1000);
      }
    }
  };

  togglePopup = (isOpen) => {
    this.setState({ visiblePopup: isOpen });
  };
  // Click vào row
  onTreeListRowClick = (e) => {
    const data = {
      ...e.data,
      // LinhVuc: e.data.LinhVuc.split(","),
      DonViQuanLyKhac: e.data.DonViQuanLyKhac?.split(","),
    };
    this.setState({ selectedRowData: data });
  };

  onDeleteOk = () => {
    const { selectedRowData } = this.state;

    ktApi
      .delete("/Dm_DonVi/Delete?" + qS.stringify({ key: selectedRowData.Id }))
      .then((res) => {
        this.setState({ visibleDeletePopup: false });
        if (res.data.success) {
          this.getDataSource();
          //thong bao thanh cong
          Toast.success(res.data.message, "Thông báo !", 1000);
          this.setState({ selectedRowData: null });
          return;
        }
        //thong bao that bai
        Toast.error(res.data.message, "Thông báo !", 1000);
      });
  };

  onDeleteCancel = () => {
    this.setState({ visibleDeletePopup: false });
  };

  //bôi đậm row cha
  onRowPrepared = (e) => {
    if (e.rowType === "data" && e.node.hasChildren === true) {
      e.rowElement.style.fontWeight = "600";
    }
  };

  render() {
    const {
      treeListData,
      visiblePopup,
      visibleDeletePopup,
      mode,
      selectedRowData,
      loading,
    } = this.state;
    return (
      <>
        {/* tạo nơi chứa control button */}
        <div className="control-button-wrapper">
          <ControlBar phanHe="Dm_DonVi" onClick={this.onControlBarClick} />
        </div>
        {/* Vẽ treeliss hiển thị */}
        <PageTitle title="Danh mục đơn vị" />
        <div className="tree-list-wrapper">
          <LoadPanel visible={loading} />
          <TreeList
            dataSource={treeListData || []}
            keyExpr="Id"
            parentIdExpr="IdCha"
            autoExpandAll={false}
            showBorders
            showRowLines
            wordWrapEnabled
            focusedRowEnabled
            height={window.innerHeight - 200}
            onRowClick={this.onTreeListRowClick}
            onRowPrepared={this.onRowPrepared}
          >
            <SearchPanel visible />
            <Scrolling mode="standard" />
            <Paging enabled={true} defaultPageSize={50} />
            <Pager
              showPageSizeSelector={true}
              allowedPageSizes={[50, 100, 200]}
              showInfo={true}
              visible={true}
            />

            <Column dataField="Ma" caption="Mã đơn vị" width="10%" />
            <Column dataField="Ten" caption="Tên đơn vị" width="25%" />
            <Column
              dataField="DiaBan"
              caption="Địa bàn"
              defaultFilterValues={false}
              width="15%"
            >
              <Lookup
                dataSource={this.state.diaBanLookupData}
                valueExpr="Id"
                displayExpr="TenDB"
              />
            </Column>
            <Column dataField="DiaChi" caption="Địa chỉ" width="20%" />
            <Column
              dataField="Sdt"
              caption="Số điện thoại"
              alignment="center"
              width="15%"
            />
            <Column
              dataField="LaDonViDATN"
              caption="Là đơn vị kiểm toán"
              visible={false}
            />
            <Column
              dataField="LaDonViThanhTra"
              caption="Là đơn vị thanh tra"
              visible={false}
            />
            <Column dataField="GhiChu" caption="Ghi chú" />
            <Column dataField="Icha" visible={false} />

            <Column dataField="LinhVuc" visible={false} />
            <Column dataField="NgayBatDau" visible={false} />
            <Column dataField="NgayKetThuc" visible={false} />
            <Column dataField="DonViQuanLyKhac" visible={false} />
            <Column dataField="LaDonViCha" visible={false} />
          </TreeList>
        </div>
        {/* Tạo popup */}
        <div className="popup-wrapper">
          {visiblePopup && (
            <Popup
              visible={visiblePopup}
              title="Danh mục đơn vị"
              onHiding={() => this.togglePopup(false)}
            >
              <FormDmDonVi
                ref={(ref) => (this.formRef = ref)}
                visible={visiblePopup}
                onHiding={() => this.setState({ visiblePopup: false })}
                dataDonViCha={
                  mode === "EDIT"
                    ? treeListData.filter(
                        (item) =>
                          item.IdCha?.toString() !== selectedRowData?.Id &&
                          item.Id !== selectedRowData?.Id
                      ) || []
                    : treeListData
                }
                dataDiaBan={this.state.diaBanLookupData}
                dataLinhVuc={this.state.linhVucLookupData}
                mode={mode}
                formData={mode === "CREATE" ? null : selectedRowData}
                tooglePopup={this.togglePopup}
                reloadData={this.getDataSource}
                setSelectedRowData={(row) =>
                  this.setState({ selectedRowData: row })
                }
              />
              <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                  text: "Lưu",
                  onClick: (e) => this.formRef.handleSaveData(e),
                }}
              />
              <ToolbarItem
                widget="dxButton"
                toolbar="bottom"
                location="after"
                options={{
                  text: "Huỷ",
                  onClick: () => this.setState({ visiblePopup: false }),
                }}
              />
            </Popup>
          )}
        </div>
        <PopupTemplate
          visible={visibleDeletePopup}
          onOk={this.onDeleteOk}
          onCancel={this.onDeleteCancel}
        />
      </>
    );
  }
}

export default DmDonVi;

class FormDmDonVi extends Component {
  constructor(props) {
    super(props);
    this.hinhThuc = ["Tổ chức", "Cá nhân"];
    this.initFormData = {
      NgayBatDau: moment()._d,
      NgayKetThuc: moment().add("year", 10)._d,
      LaDonViCha: false,
      LaDonViDATN: false,
      LaDonViThanhTra: false,
    };
    this.state = {
      formData: props.formData || this.initFormData,
      IdCha: [],
      validate: {},
      focus: "ma",
    };
  }

  dropDownBoxValueChanged = (e, name) => {
    const { formData } = this.state;

    if (name === "IdCha") {
      this.setState({
        formData: { ...formData, [name]: [e.key], DonViQuanLyKhac: null },
      });
    } else {
      this.setState({ formData: { ...formData, [name]: [e.key] } });
    }
  };

  onFormInputChange = ({ name, value }) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, [name]: value } });
  };

  checkValidate = (data) => {
    let errors = 0;
    let brokenItems = {};
    //validate ma
    if (!data.Ma) {
      brokenItems = {
        ...brokenItems,
        Ma: {
          isValid: false,
          message: "Mã đơn vị là trường bắt buộc",
        },
      };
      errors++;
      if (this.state.focus === "ma") {
        this.refs.maRef.instance.focus();
      }
    } else {
      this.setState({ focus: "ten" });
    }
    //validate ten
    if (!data.Ten?.trim()) {
      brokenItems = {
        ...brokenItems,
        Ten: {
          isValid: false,
          message: "Tên đơn vị trường bắt buộc",
        },
      };
      errors++;
      if (this.state.focus === "ten") {
        this.refs.tenRef.instance.focus();
      }
    } else {
      this.setState({ focus: "sdt" });
    }

    if (!data.NgayKetThuc) {
      brokenItems = {
        ...brokenItems,
        NgayKetThuc: {
          isValid: false,
          message: "Ngày hết hiệu lực là trường bắt buộc",
        },
      };
      errors++;
    } else {
      if (data.NgayBatDau) {
        const NgayBatDau = moment(data.NgayBatDau).format("YYYY/MM/DD");
        const NgayKetThuc = moment(data.NgayKetThuc).format("YYYY/MM/DD");
        if (NgayBatDau > NgayKetThuc) {
          brokenItems = {
            ...brokenItems,
            NgayKetThuc: {
              isValid: false,
              message: "Ngày hết hiệu lực phải lớn hơn ngày hiệu lực",
            },
          };
          errors++;
        }
      }
    }

    if (!data.NgayBatDau) {
      brokenItems = {
        ...brokenItems,
        NgayBatDau: {
          isValid: false,
          message: "Ngày hiệu lực là trường bắt buộc",
        },
      };
      errors++;
    } else {
      if (data.NgayKetThuc) {
        const NgayBatDau = moment(data.NgayBatDau).format("YYYY/MM/DD");
        const NgayKetThuc = moment(data.NgayKetThuc).format("YYYY/MM/DD");
        if (NgayBatDau > NgayKetThuc) {
          brokenItems = {
            ...brokenItems,
            NgayBatDau: {
              isValid: false,
              message: "Ngày hiệu lực phải nhỏ hơn ngày hết hiệu lực",
            },
          };
          errors++;
        }
      }
    }
    // if (!data?.LinhVuc) {
    //   brokenItems = {
    //     ...brokenItems,
    //     LinhVuc: {
    //       isValid: false,
    //       message: "Lĩnh vực là trường bắt buộc",
    //     },
    //   };
    //   errors++;
    // }

    if (!data?.DiaBan) {
      brokenItems = {
        ...brokenItems,
        DiaBan: {
          isValid: false,
          message: "Địa bàn là trường bắt buộc",
        },
      };
      errors++;
    }

    // if (data.Sdt) {
    //   const regex =
    //     /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
    //   if (!regex.test(data.Sdt)) {
    //     brokenItems = {
    //       ...brokenItems,
    //       Sdt: {
    //         isValid: false,
    //         message: "Số điện thoại không hợp lệ",
    //       },
    //     };
    //     errors++;
    //     if (this.state.focus === "sdt") {
    //       this.refs.sdtRef.instance.focus();
    //     }
    //   }
    // }

    if (errors) this.setState({ validate: brokenItems });
    return !errors;
  };

  handleSaveData = (e) => {
    e.component.option("disabled", true);
    const { mode } = this.props;
    const { formData } = this.state;
    const isValid = this.checkValidate(formData);
    if (!isValid) {
      e.component.option("disabled", false);
      return;
    }
    if (formData) {
      if (mode === "CREATE") {
        ktApi
          .get(
            "/Validate/CheckMa?" +
              qS.stringify({
                value: formData.Ma.toString().trim(),
                key: "Ma",
                table: "Dm_DonVi",
              })
          )
          .then((res) => {
            if (res.data.duplicate) {
              var brokenItems = {
                ...brokenItems,
                Ma: {
                  isValid: false,
                  message: "Mã đơn vị đã tồn tại",
                },
              };
              this.refs.maRef?.instance?.focus();
              this.setState({ validate: brokenItems });
              e.component.option("disabled", false);
            } else {
              ktApi
                .post(
                  "/Dm_DonVi/Insert?" +
                    qS.stringify({
                      values: JSON.stringify({
                        ...formData,
                        IdCha: formData.IdCha?.toString(),
                        Ten: formData.Ten?.trim(),
                        GhiChu: formData.GhiChu?.trim(),
                        DiaBan: formData.DiaBan?.toString(),
                        LinhVuc: formData.LinhVuc?.toString() || null,
                        DonViQuanLyKhac:
                          formData.DonViQuanLyKhac?.toString() || null,
                        HinhThuc: formData.HinhThuc
                          ? formData.HinhThuc
                          : this.hinhThuc[0],
                      }),
                    })
                )
                .then(({ data }) => {
                  if (data.success) {
                    Toast.success(data.message, "Thông báo !", 1000);
                  }
                  this.props.tooglePopup(false);
                  this.props.reloadData();
                });
            }
          });
      } else {
        ktApi
          .get(
            "/Validate/CheckMa?" +
              qS.stringify({
                value: formData.Ma.toString().trim(),
                key: "Ma",
                table: "Dm_DonVi",
                id: formData.Id,
              })
          )
          .then((res) => {
            if (res.data.duplicate) {
              var brokenItems = {
                ...brokenItems,
                Ma: {
                  isValid: false,
                  message: "Mã đơn vị đã tồn tại",
                },
              };
              this.refs.maRef?.instance?.focus();
              this.setState({ validate: brokenItems });
              e.component.option("disabled", false);
            } else {
              this.setState({
                formData: {
                  ...formData,
                  IdCha: formData.IdCha ? formData.IdCha?.toString() : null,
                  Ten: formData.Ten?.trim(),
                  GhiChu: formData.GhiChu?.trim(),
                  DiaBan: formData.DiaBan?.toString(),
                  LinhVuc: formData.LinhVuc?.toString() || null,
                  DonViQuanLyKhac: formData.DonViQuanLyKhac?.toString() || null,
                },
              });
              ktApi
                .put(
                  "/Dm_DonVi/Update?" +
                    qS.stringify({
                      values: JSON.stringify(this.state.formData),
                      key: formData.Id,
                    })
                )
                .then(({ data }) => {
                  if (data.success) {
                    Toast.success(data.message, "Thông báo !", 1000);
                    this.props.tooglePopup(false);
                    this.props.reloadData();
                    this.props.setSelectedRowData(this.state.formData);
                  }
                });
            }
          });
      }
    }
  };

  getDataLookup = () => {
    const {
      formData: { IdCha, Id },
    } = this.state;
    const { dataDonViCha } = this.props;
    const filterd = dataDonViCha.filter(
      (dv) => dv.Id !== IdCha?.toString() && dv.Id !== Id && dv.IdCha !== Id
    );

    return filterd;
  };

  onChangedDVCha = (e) => {
    const { formData } = this.state;
    this.setState({ formData: { ...formData, LaDonViCha: e.value } });
  };
  render() {
    const { dataDonViCha, dataDiaBan, dataLinhVuc } = this.props;
    const { formData, validate } = this.state;
    return (
      <Form formData={formData} colCount={12}>
        <SimpleItem colSpan={4}>
          <Label text="Chọn ĐV cha" />
          <DropDown
            showClearButton={true}
            valueExpr="Id"
            dataSource={dataDonViCha}
            value={formData.IdCha}
            displayExpr="Ten"
            columns={[
              {
                dataField: "Ma",
                caption: "Mã",
              },
              {
                dataField: "Ten",
                caption: "Tên",
              },
            ]}
            onValueChanged={(value) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, IdCha: value },
              });
            }}
            parentExpr="IdCha"
            pickAndClose={true}
          />
          <ValidMessage message="" />
        </SimpleItem>

        <SimpleItem colSpan={8}>
          <Label text="Đơn vị quản lý khác" />
          <DropDownBox
            dropDownOptions={{ minWidth: "500px" }}
            dataSource={this.getDataLookup() || []}
            valueExpr="Id"
            displayExpr="Ten"
            value={
              formData.DonViQuanLyKhac
              // _.isArray(formData.DonViQuanLyKhac)
              //   ? formData.DonViQuanLyKhac
              //   : formData.DonViQuanLyKhac?.split(",")
            }
            deferRendering={false}
            showClearButton
            onValueChanged={(e) => {
              if (!e.value) {
                const { formData } = this.state;
                this.setState({
                  formData: { ...formData, DonViQuanLyKhac: null },
                });
              }
            }}
            contentRender={(props) => (
              <TreeList
                dataSource={this.getDataLookup() || []}
                keyExpr="Id"
                showBorders
                showRowLines
                selectedRowKeys={
                  formData.DonViQuanLyKhac
                  // _.isArray(formData.DonViQuanLyKhac)
                  //   ? formData.DonViQuanLyKhac
                  //   : formData.DonViQuanLyKhac?.split(",")
                }
                onSelectionChanged={(e) => {
                  const { formData } = this.state;
                  this.setState({
                    formData: {
                      ...formData,
                      DonViQuanLyKhac: e.selectedRowKeys,
                    },
                  });
                }}
                focusedRowEnabled
                height={360}
              >
                <Selection mode="multiple" />

                <Column dataField="Ma" caption="Mã" />
                <Column dataField="Ten" caption="Tên" />
                <FilterRow visible />
              </TreeList>
            )}
          ></DropDownBox>
          <ValidMessage message="" />
        </SimpleItem>

        <SimpleItem isRequired colSpan={4}>
          <Label text="Mã đơn vị" />
          <TextBox
            maxLength={20}
            ref={"maRef"}
            value={formData.Ma}
            onKeyUp={(e) => {
              const { validate } = this.state;
              !validate.Ma?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    Ma: { isValid: true, message: "" },
                  },
                });

              delayTyping(() => {
                const { formData } = this.state;
                this.setState({
                  formData: { ...formData, Ma: e.event.target.value },
                });
              }, this);
            }}
            onKeyDown={(evt) => {
              if (
                !(
                  /^[a-zA-Z0-9]*$/gm.test(evt.event.key) ||
                  evt.event.keyCode === 8
                )
              ) {
                evt.event.preventDefault();
              }
            }}
          />
          <ValidMessage message={validate.Ma?.message} />
        </SimpleItem>

        <SimpleItem isRequired colSpan={8}>
          <Label text="Tên đơn vị" maxLength={250} />
          <TextBox
            ref={"tenRef"}
            id="Ten"
            value={formData.Ten}
            onKeyUp={(e) => {
              const { validate } = this.state;
              !validate.Ten?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    Ten: { isValid: true, message: "" },
                  },
                });

              delayTyping(() => {
                const { formData } = this.state;
                this.setState({
                  formData: { ...formData, Ten: e.event.target.value },
                });
              }, this);
            }}
          />
          <ValidMessage message={validate.Ten?.message} />
        </SimpleItem>

        {/* <SimpleItem colSpan={4} isRequired>
          <Label text="Địa bàn" />
          <DropDownBox
            dropDownOptions={{ minWidth: "500px" }}
            dataSource={dataDiaBan}
            valueExpr="Id"
            displayExpr="TenDB"
            value={formData.DiaBan}
            isValid={validate.DiaBan ? validate.DiaBan.isValid : true}
            onFocusIn={(e) => {
              !validate.DiaBan?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    DiaBan: { isValid: true, message: "" },
                  },
                });
            }}
            showClearButton
            onValueChanged={(e) => {
              if (!e.value) {
                const { formData } = this.state;
                this.setState({ formData: { ...formData, DiaBan: null } });
              }
            }}
            contentRender={(props) => {
              return (
                <TreeList
                  dataSource={dataDiaBan}
                  keyExpr="Id"
                  parentIdExpr="DBCha"
                  showBorders
                  showRowLines
                  selectedRowKeys={props.value?.length && [props.value]}
                  onRowClick={(e) => this.dropDownBoxValueChanged(e, "DiaBan")}
                  focusedRowEnabled
                  height={360}
                >
                  <Column dataField="MaDB" caption="Mã địa bàn" />
                  <Column dataField="TenDB" caption="Tên địa bàn" />
                  <FilterRow visible />
                </TreeList>
              );
            }}
          ></DropDownBox>
          <ValidMessage message={validate.DiaBan?.message} />
        </SimpleItem> */}

        <SimpleItem colSpan={4} isRequired>
          <Label text="Địa bàn" />
          <DropDown
            showClearButton={true}
            valueExpr="Id"
            dataSource={dataDiaBan}
            value={formData.DiaBan}
            displayExpr="TenDB"
            columns={[
              {
                dataField: "MaDB",
                caption: "Mã",
              },
              {
                dataField: "TenDB",
                caption: "Tên",
              },
            ]}
            onValueChanged={(value) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, DiaBan: value },
              });
            }}
            parentExpr="DBCha"
            pickAndClose={true}
          />
          <ValidMessage message={validate.DiaBan?.message} />
        </SimpleItem>

        {/* <SimpleItem colSpan={8} isRequired>
          <Label text="Lĩnh vực" />
          <DropDownBox
            dataSource={dataLinhVuc}
            valueExpr="Id"
            displayExpr="Ten"
            value={formData.LinhVuc}
            deferRendering={false}
            showClearButton
            onValueChanged={(e) => {
              if (!e.value) {
                const { formData } = this.state;
                this.setState({
                  formData: { ...formData, LinhVuc: null },
                });
              }
            }}
            isValid={validate.LinhVuc ? validate.LinhVuc.isValid : true}
            onFocusIn={(e) => {
              !validate.LinhVuc?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    LinhVuc: { isValid: true, message: "" },
                  },
                });
            }}
            contentRender={(props) => (
              <TreeList
                dataSource={dataLinhVuc}
                keyExpr="Id"
                parentIdExpr="IdCha"
                showBorders
                showRowLines
                selectedRowKeys={formData.LinhVuc}
                onSelectionChanged={(e) => {
                  const { formData } = this.state;
                  this.setState({
                    formData: { ...formData, LinhVuc: e.selectedRowKeys },
                  });
                }}
                focusedRowEnabled
                height={360}
              >
                <Selection mode="multiple" />

                <Column dataField="Ma" caption="Mã lĩnh vực" />
                <Column dataField="Ten" caption="Tên lĩnh vực" />
                <FilterRow visible />
              </TreeList>
            )}
          ></DropDownBox>
          <ValidMessage message={validate.LinhVuc?.message} />
        </SimpleItem> */}

        <SimpleItem colSpan={8}>
          <Label text="Địa chỉ" maxLength={500} />
          <TextBox
            value={formData.DiaChi}
            onKeyUp={(e) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, DiaChi: e.event.target.value },
              });
            }}
          ></TextBox>
          <ValidMessage message="" />
        </SimpleItem>

        <SimpleItem colSpan={4}>
          <Label text="Số điện thoại" />
          <TextBox
            ref={"sdtRef"}
            name="Sdt"
            maxLength={11}
            value={formData.Sdt}
            //isValid={validate.Sdt ? validate.Sdt.isValid : true}
            onKeyUp={(e) => {
              !validate.Sdt?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    Sdt: { isValid: true, message: "" },
                  },
                });
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, Sdt: e.event.target.value },
              });
            }}
            onKeyDown={(evt) => {
              if (
                !(/^[0-9]*$/gm.test(evt.event.key) || evt.event.keyCode === 8)
              ) {
                evt.event.preventDefault();
              }
            }}
          ></TextBox>
          <ValidMessage message="" />
        </SimpleItem>

        {/* <SimpleItem colSpan={4}>
          <Label text="Là ĐV cha" />
          <CheckBox
            value={formData.LaDonViCha}
            onValueChanged={this.onChangedDVCha}
          />
          <ValidMessage message="" />
        </SimpleItem> */}
        <SimpleItem colSpan={2}>
          <Label text="Đơn vị kiểm toán" />
          <CheckBox
            value={formData.LaDonViDATN}
            onValueChanged={(e) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, LaDonViDATN: e.value },
              });
            }}
          />
          <ValidMessage message="" />
        </SimpleItem>

        <SimpleItem colSpan={2}>
          <Label text="Đơn vị thanh tra" />
          <CheckBox
            value={formData.LaDonViThanhTra}
            onValueChanged={(e) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, LaDonViThanhTra: e.value },
              });
            }}
          />
          <ValidMessage message="" />
        </SimpleItem>

        <SimpleItem colSpan={4}>
          <div className="HTRadioContainer">
            <RadioGroup
              className="HTRadio"
              items={this.hinhThuc}
              layout="horizontal"
              value={formData.HinhThuc || this.hinhThuc[0]}
              onValueChanged={(e) => {
                const { formData } = this.state;
                this.setState({ formData: { ...formData, HinhThuc: e.value } });
              }}
            ></RadioGroup>
          </div>
        </SimpleItem>

        <SimpleItem colSpan={4}>
          <Label text="Ghi chú" />
          <TextBox
            value={formData.GhiChu}
            onKeyUp={(e) => {
              const { formData } = this.state;
              this.setState({
                formData: { ...formData, GhiChu: e.event.target.value },
              });
            }}
          ></TextBox>
        </SimpleItem>

        <SimpleItem isRequired colSpan={4}>
          <Label text="Ngày hiệu lực" />
          <DateBox
            id="NgayHieuLuc"
            showClearButton
            displayFormat="dd/MM/yyyy"
            useMaskBehavior={true}
            placeholder="__/__/____"
            value={formData.NgayBatDau}
            isValid={validate.NgayBatDau ? validate.NgayBatDau.isValid : true}
            onValueChanged={(e) => {
              !validate.NgayBatDau?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    NgayBatDau: { isValid: true, message: "" },
                  },
                });

              this.onFormInputChange({
                value: e.value,
                name: "NgayBatDau",
              });
            }}
          ></DateBox>
          <ValidMessage message={validate.NgayBatDau?.message} />
        </SimpleItem>

        <SimpleItem isRequired colSpan={4}>
          <Label text="Ngày hết hiệu lực" />
          <DateBox
            useMaskBehavior
            showClearButton
            displayFormat={"dd/MM/yyyy"}
            placeholder="__/__/____"
            value={formData.NgayKetThuc}
            isValid={validate.NgayKetThuc ? validate.NgayKetThuc.isValid : true}
            onValueChanged={(e) => {
              !validate.NgayKetThuc?.isValid &&
                this.setState({
                  validate: {
                    ...this.state.validate,
                    NgayKetThuc: { isValid: true, message: "" },
                  },
                });
              this.onFormInputChange({
                value: e.value,
                name: "NgayKetThuc",
              });
            }}
          />
          <ValidMessage message={validate.NgayKetThuc?.message} />
        </SimpleItem>
      </Form>
      // <ToolbarItem
      //   widget="dxButton"
      //   toolbar="bottom"
      //   location="after"
      //   options={{
      //     text: "Lưu",
      //     onClick: this.handleSaveData,
      //     //lưu du lieu
      //   }}
      // />
    );
  }
}
