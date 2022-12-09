<!--兑换券核销门店-->
<template>
  <div>
    <a-modal :title="title"
             :width="1200"
             :visible="visible"
             :confirmLoading="confirmLoading"
             @ok="handleOk"
             @cancel="handleCancel"
             cancelText="关闭"
             class="AppMarketingCertificateStoreModal"
    >
<!--      <a-form layout="inline">-->
<!--        <a-row :gutter="24">-->
<!--          <a-col :md="5" :sm="8">-->
<!--            <a-form-item label="门店名称">-->
<!--              <a-input placeholder="请输入门店名称" style="width: 120px;" v-model="queryParam.storeName"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :md="5" :sm="8">-->
<!--            <a-form-item label="分店名称">-->
<!--              <a-input placeholder="请输入分店名称" style="width: 120px;"></a-input>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :md="6" :sm="8" >-->
<!--            <a-form-item label="所属城市"-->
<!--                         style="width: 100%;display: flex;align-items: center">-->
<!--              &lt;!&ndash;下拉框&ndash;&gt;-->
<!--              <a-cascader :options="cityAllData" @change="cityAllDataChange" :loadData="cityAllDataLoad"-->
<!--                          changeOnSelect-->
<!--                          v-model="defaultCity"-->
<!--                          v-if="canShowDefaultCity" placeholder="请选择区域"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
<!--          <a-col :md="5" :sm="8" style="display: flex;align-items: center;justify-content: space-around;">-->
<!--            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>-->
<!--            <a-button type="primary" @click="search" icon="search">-->
<!--              查询-->
<!--            </a-button>-->
<!--          </a-col>-->

<!--        </a-row>-->
<!--      </a-form>-->
      <!--      :scroll="{y:600}"-->
      <a-table bordered :dataSource="dataSource" :columns="columns" :pagination="ipagination" :scroll="{y:600}"
               style="margin-top: 10px;" :loading="loading" @change="handleTableChange">

        <template slot="logoAddr" slot-scope="text, record, index">
<!--          {{text}}-->
          <img preview="1" :src="text" alt="" style="width: 50px;height: 50px">
        </template>

      </a-table>

    </a-modal>
  </div>
</template>

<script>
  import {httpAction, postAction, getAction, putAction} from '@/api/manage'
  import AModal from "ant-design-vue/es/modal/Modal";
  export default {
    components: {AModal},
    name: 'AppMarketingCertificateStoreModal',
    data(){
      return {
        title: '核销门店',
        visible: false,  //弹窗显示隐藏
        confirmLoading: false,//是否正在加载
        dataSource: [
          {
            // key: '0',
            // mainPicture: 'http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg',
            // goodName: '商品名称1',
            // typeName: '商品分类1',
            // price: '1.01',
            // costPrice: '2.02',
            // vipPrice: '3.03',
            // repertory: '2'
          },
        ],
        //接口
        url: {
          //适用商品返显
          findByMarketingDiscount: 'marketingCertificate/marketingCertificate/findStoreByCertificateId',
          getList: '/sysArea/sysArea/getList',
          findByParentId: '/sysArea/sysArea/findByParentId',
        },
        queryParam:{},
        //所在城市联想
        cityAllData: [],
        areaAddressList:[],
        //编辑回显的默认地址
        defaultCity: '',
        //可以显示回显默认地址
        canShowDefaultCity: false,
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        count: 2,
        columns: [
          {
            title: 'logo',
            dataIndex: 'logoAddr',
            width: '15%',
            scopedSlots: {customRender: 'logoAddr'},
            align:'center'
          },
          {
            title: '门店名称',
            dataIndex: 'storeName',
            textAlign: 'center',
            width: '15%',
            align:'center'
          },
          {
            title: '分店名称',
            dataIndex: 'subStoreName',
            width: '15%',
            align:'center'
          },
          {
            title: '所属城市',
            dataIndex: 'areaAddress',
            width: '10%',
            align:'center'
          },
          {
            title: '门店地址',
            dataIndex: 'storeAddress',
            width: '15%',
            align:'center'
          },
        ],
        loading: false,
      }
    },
    mounted(){
      this.getList(()=>{
        this.canShowDefaultCity = true
      })
    },
    methods: {
      //所在城市地址选择完成事件
      cityAllDataChange(value, selectedOptions) {
        let sz = []
        for (let item of selectedOptions) {
          sz.push(item.label)
        }
        this.queryParam.sysAreaId = value.join(',')
        this.areaAddressList = sz
      },
      //所在城市点击一级，二级，三级分类动态展示数据
      cityAllDataLoad(selectedOptions) {
        const targetOption = selectedOptions[selectedOptions.length - 1]
        targetOption.loading = true
        getAction(this.url.findByParentId, { id: targetOption.value }).then((res) => {
          targetOption.loading = false
          if (res.success && res.result.length > 0) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.cityAllData = [...this.cityAllData]
        })
      },
      //所在城市回显
      cityEchoDisplay(info) {
        let sz = info.sysAreaId.split(',')
        let cityAllData = this.cityAllData
        this.defaultCity = info.sysAreaId.split(',').map(item => {
          return item * 1
        })
        // this.$nextTick(()=>{
        //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
        // })
        // console.log();
        // debugger;
        if (this.areaAddressList.length <= 1) {
          this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
          this.canShowDefaultCity = true
        } else {
          //第一个id请求其对应的子地址
          getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
            if (res.success && res.result.length > 0) {
              let sz2 = [] //子地址
              for (let item of res.result) {
                sz2.push({
                  label: item.name,
                  value: item.id,
                  isLeaf: false
                })
              }
              for (let item of cityAllData) {
                //找到对应的label添加children
                if (this.areaAddressList[0] == item.label) {
                  item.children = sz2
                  getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
                    if (res2.success && res2.result.length > 0) {
                      let sz3 = []
                      for (let item of res2.result) {
                        sz3.push({
                          label: item.name,
                          value: item.id,
                          isLeaf: false
                        })
                      }
                      for (let item2 of sz2) {
                        if (this.areaAddressList[1] == item2.label) {
                          item2.children = sz3
                          this.$nextTick(() => {
                            this.canShowDefaultCity = true
                          })
                          break
                        }
                      }
                    } else {
                      this.canShowDefaultCity = true
                      console.log('没有第三季地址')
                    }
                  })
                  break
                }
              }
            } else {
              this.canShowDefaultCity = true
              console.log('空值')
            }
          })
        }
      },
      //获取包邮配送区域地址和所在城市一级options联想地址
      getList(callback) {
        getAction(this.url.getList).then((res) => {
          if (res.success) {
            let sz3 = []
            for (let item of res.result) {
              sz3.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            //所在城市
            this.cityAllData = sz3
            this.$nextTick(() => {
              callback()
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      },
      //弹窗确定事件
      handleOk(){
        this.hideModalVisible()
      },
      //弹窗取消事件
      handleCancel(){
        this.hideModalVisible()
      },
      handleTableChange(pagination, filters, sorter) {
        //分页、排序、筛选变化时触发
        //TODO 筛选
        // if (Object.keys(sorter).length > 0) {
        //   this.isorter.column = sorter.field;
        //   this.isorter.order = "ascend" == sorter.order ? "asc" : "desc"
        // }
        this.ipagination = pagination;
        // this.loadData();
      },
      //显示弹窗
      showModalVisible(id){
        this.marketingCertificateId = id
        this.$nextTick(()=>{
          this.searchReset()
        })
      },
      //隐藏弹窗
      hideModalVisible(){
        this.visible = false
      },
      //搜索
      search(){
        let that = this;
        this.visible = true
        this.loading = true
        let info = {
          marketingCertificateId: this.marketingCertificateId,
        }
        info = Object.assign({},info,this.queryParam)
        //参数  marketingDiscountId
        getAction(that.url.findByMarketingDiscount, info).then((res) => {
          if (res.success) {
            for (let item of res.result.records) {
              if (item.logoAddr) {
                item.logoAddr = this.configure.imgErver + '/' + item.logoAddr
              }
            }
            this.dataSource = res.result.records
            // for(let item of res.result.records){
            //   item.operation = '删除'
            //   this.selectedRowKeys.push(item.id);
            // }
          }
          setTimeout(() => {
            this.loading = false
          }, 500)
        });
      },
      searchReset(){
        this.queryParam = {}
        this.$nextTick(()=>{
          this.search()
        })
      }
    }
  }
</script>

<style lang="less">
  .ApplicableCommodityModal {
    .ant-modal-body {
      vertical-align: center;
    }
    .ant-form-item-control-wrapper {
      width: 80% !important;
    }
    .ant-form-inline .ant-form-item {
      display: flex;
    }
    .ant-form-item-control {
      width: 100% !important;
    }
  }

</style>