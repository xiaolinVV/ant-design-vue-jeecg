<!--兑换券适用商品-->
<template>
  <div>
    <a-modal :title="title"
             :width="1200"
             :visible="visible"
             :confirmLoading="confirmLoading"
             @ok="handleOk"
             @cancel="handleCancel"
             cancelText="关闭"
             class="AppMarketingCertificateGoodModal"
    >
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
          <a-form-item label="商品名称">
          <a-input placeholder="请输入商品名称" style="width: 120px;" v-model="queryParam.goodName"></a-input>
          </a-form-item>
          </a-col>
          <a-col :md="11" :sm="8" >
          <a-form-item label="商品分类"
          style="width: 100%;display: flex;align-items: center">
          <!--下拉框-->
          <a-select placeholder="请选择" style="width: 120px;margin-right: 20px"  v-model="queryParam.goodTypeIdOne" @change="chooseMedicine">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
          <a-select placeholder="请选择" style="width: 120px;margin-right: 20px"  v-model="queryParam.goodTypeIdTwo" @change="chooseMedicine1">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
          </a-select>
            <a-select placeholder="请选择" style="width: 120px"  v-model="queryParam.goodTypeIdThree">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-item label="供应商">
              <a-input placeholder="请输入供应商" style="width: 120px;"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="8"  style="display: flex;align-items: center;margin-top: 10px">
            <a-button type="primary" @click="search" icon="search">
              查询
            </a-button>
            <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
          </a-col>

        </a-row>
      </a-form>
      <!--      :scroll="{y:600}"-->
      <a-table bordered :dataSource="dataSource"
               :columns="columns"
               :pagination="ipagination"
               :scroll="{y:600,x:1500}"
               style="margin-top: 10px;"
               :loading="loading"
               @change="handleTableChange">
        <template slot="mainPicture" slot-scope="text, record, index">
          <img preview="1" :src="text" alt="" style="width: 50px;height: 50px">
        </template>

      </a-table>

    </a-modal>
  </div>
</template>

<script>
  import { httpAction, postAction, getAction, putAction } from '@/api/manage'
  import AModal from 'ant-design-vue/es/modal/Modal'

  export default {
    components: { AModal },
    name: 'AppMarketingCertificateGoodModal',
    data() {
      return {
        title: '兑换商品',
        visible: false,  //弹窗显示隐藏
        confirmLoading: false,//是否正在加载
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
        //查询条件
        queryParam: {
          goodTypeIdOne:'',
          goodTypeIdTwo:'',
          goodTypeIdThree:'',
        },
        listGoodType: [],
        listGoodType1: [],
        listGoodType2: [],
        dataSource: [
          // {
          //   key: '0',
          //   mainPicture: 'http://b-ssl.duitang.com/uploads/item/201410/09/20141009224754_AswrQ.jpeg',
          //   goodName: '商品名称1',
          //   typeName: '商品分类1',
          //   price: '1.01',
          //   costPrice: '2.02',
          //   vipPrice: '3.03',
          //   repertory: '2'
          // }
        ],
        //接口
        url: {
          //适用商品返显
          findByMarketingDiscount: 'marketingCertificate/marketingCertificate/findGoodByCertificateId',
          getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
        },
        count: 2,
        columns: [
          {
            title: '商品图片',
            dataIndex: 'mainPicture',
            width: '15%',
            scopedSlots: { customRender: 'mainPicture' },
            align: 'center'
          },
          {
            title: '商品名称',
            dataIndex: 'goodName',
            textAlign: 'center',
            width: '15%',
            align: 'center'
          },
          {
            title: '商品分类',
            dataIndex: 'typeName',
            width: '15%',
            align: 'center'
          },
          {
            title: '规格',
            dataIndex: 'specifications',
            width: '5%',
            align: 'center'
          },
          {
            title: '市场价',
            dataIndex: 'marketPrice',
            width: '8%',
            align: 'center'
          },
          {
            title: '销售价',
            dataIndex: 'price',
            width: '8%',
            align: 'center'
          },
          {
            title: '成本价',
            dataIndex: 'costPrice',
            width: '8%',
            align: 'center'
          },
          {
            title: '会员价',
            dataIndex: 'vipPrice',
            width: '6%',
            align: 'center'
          },
          {
            title: '库存',
            dataIndex: 'repertory',
            width: '5%',
            align: 'center'
          },
          {
            title: '供应商',
            dataIndex: 'username',
            width: '5%',
            align: 'center'
          },
          {
            title: '可兑换月份',
            dataIndex: 'canMonth',
            width: '5%',
            align: 'center'
          },
          {
            title: '兑换数量',
            dataIndex: 'quantity',
            width: '5%',
            align: 'center'
          },
        ],
        loading: false
      }
    },
    mounted(){
      this.goodTypeListcascade('0')
    },
    methods: {
      goodTypeListcascade(parentId) {

        let that = this
        that.listGoodType1 = []
        that.listGoodType2 = []
        getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then((res) => {

          if (res.success) {
            that.listGoodType = res.result.listGoodType
            //that.$message.success(res.message);
            //  console.log("res.message===="+res.result.listGoodType[0].id)

          } else {
            that.$message.warning(res.message)
          }
        })
      },
      //弹窗确定事件
      handleOk() {
        this.hideModalVisible()
      },
      //弹窗取消事件
      handleCancel() {
        this.hideModalVisible()
      },
      chooseMedicine1: function(value) {
        console.log('parentId2222' + value)
        let that = this
        that.listGoodType2 = []
        //  that.queryParam.goodTypeIdThree = "";
        getAction(that.url.getgoodTypeListcascade, { parentId: value }).then((res) => {
          if (res.success) {
            that.listGoodType2 = res.result.listGoodType
            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message)
          }
        })

      },
      chooseMedicine: function(value) {
        console.log('parentId1111111111' + value)
        let that = this
        //console.log("parentId1111111111"+value)
        that.listGoodType1 = []
        that.listGoodType2 = []
        that.queryParam.goodTypeIdTwo = ''
        that.queryParam.goodTypeIdThree = ''
        getAction(that.url.getgoodTypeListcascade, { parentId: value }).then((res) => {
          if (res.success) {
            that.listGoodType1 = res.result.listGoodType

            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message)
          }
        })
        //  that.queryParam.goodTypeIdThree = "";
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
      showModalVisible(id) {
        this.marketingCertificateId = id
        this.$nextTick(()=>{
          this.searchReset();
        })
      },
      //隐藏弹窗
      hideModalVisible() {
        this.visible = false
      },
      //搜索
      search() {
        this.visible = true
        this.loading = true
        let that = this
        let info = {
          marketingCertificateId: this.marketingCertificateId
        }
        //参数  marketingDiscountId
        info = Object.assign({},info,this.queryParam)
        getAction(that.url.findByMarketingDiscount, info).then((res) => {
          if (res.success) {
            for (let item of res.result.records) {
              if (item.mainPicture) {
                item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
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
        })
      },
      searchReset(){
        this.queryParam = {
          goodTypeIdOne:'',
          goodTypeIdTwo:'',
          goodTypeIdThree:'',
        }
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