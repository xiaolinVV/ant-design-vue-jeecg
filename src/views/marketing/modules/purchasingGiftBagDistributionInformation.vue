<template>
  <div class="purchasingGiftBagDistributionInformation">
    <div class="title">
      配送信息
    </div>
      <a-card :bordered="false" class="wrap">
        <detail-list :col="4">
          <detail-list-item v-for='(item,index) in card2Cnt' :key="index" :term="item.term" style="height: 70px;">
            <img :src="item.content" alt="" v-if="index == 5" style="width: 32px;height: 32px;border-radius: 5px"/>
            <span v-else>
              {{item.content}}
            </span>
          </detail-list-item>
        </detail-list>
        <a-menu
          mode="horizontal"
          v-model="menuCurrent"
          :style="{ lineHeight: '50px',
         fontSize:'18px'}"
        >
          <a-menu-item style="width: 150px;text-align: center;"
                       v-for="(itemOp,indexOp) in menuLists"  :key="indexOp"
                       v-if="menuLists.length > 0"
          >
            {{itemOp.batchNumber}}
          </a-menu-item>
        </a-menu>
        <div class="table-operator">
          <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls">下载模板</a-button>
          <a-upload name="file" :data="{id:selectmenuId}" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
              <a-button type="primary" icon="import">导入配送信息</a-button>
          </a-upload>
        </div>
        <a-table
          bordered
          :rowKey="record => record.id"
          :columns="columns"
          :data-source="dataSource"
          :scroll="{x:2000}"
        >
        <span slot="action" slot-scope="text, record">
          <a @click="edit(record)">修改</a>
          <a-divider type="vertical"/>
          <!--           @confirm="() => handleDelete(record.id)"-->
          <a-popconfirm
            @confirm="() => onDelete(record.id)"
            title="确定要删除吗?"
          >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
        </span>

        </a-table>
      </a-card>
    <purchasing-gift-bag-distribution-information-modal ref="modalForm" @handleOk="modalHandleOk">

    </purchasing-gift-bag-distribution-information-modal>
  </div>

</template>

<script>
  import DetailList from '@/components/tools/DetailList'
  import purchasingGiftBagDistributionInformationModal from './purchasingGiftBagDistributionInformationModal'
  import { getAction,postAction ,downFile} from '@/api/manage'
  import Vue from 'vue'
  import { ACCESS_TOKEN } from "@/store/mutation-types"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  const DetailListItem = DetailList.Item
  const columns = [
    {
      title: '序号',
      dataIndex: '',
      key: 'rowIndex',
      width: 100,
      align: "center",
      customRender: function (t, r, index) {
        return parseInt(index) + 1;
      }
    },
    {
      title: '批次号',
      dataIndex: 'id',
      align: 'center'
    },
    {
      title: '收件人',
      dataIndex: 'addressee',
      align: 'center'
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      align: 'center'
    }, {
      title: '所在城市',
      dataIndex: 'city',
      align: 'center'
    },{
      title: '详细收货地址',
      dataIndex: 'detailedDeliveryAddress',
      align: 'center'
    },{
      title: '备注',
      dataIndex: 'remarks',
      align: 'center'
    },{
      title: '快递公司',
      dataIndex: 'courierServicesCompany',
      align: 'center'
    },{
      title: '快递单号',
      dataIndex: 'courierNumber',
      align: 'center'
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      align: 'center'
    },{
      title: '更新时间',
      dataIndex: 'updateTime',
      align: 'center'
    },{
      title: '操作',
      dataIndex: 'action',
      align: 'center',
      scopedSlots: { customRender: 'action' },
    },
  ]
  export default {
    name: 'purchasingGiftBagDistributionInformation',
    components: {
      DetailList,
      DetailListItem,
      purchasingGiftBagDistributionInformationModal
    },
    data(){
      return{
        tokenHeader: {'X-Access-Token': Vue.ls.get(ACCESS_TOKEN)},
        menuCurrent:[0],
        menuLists:[],
        //信息
        card2Cnt: [
          {
            term: '流水号',
            content: ''
          }, {
            term: '采购礼包编号',
            content: ''
          }, {
            term: '采购礼包名称',
            content: ''
          }, {
            term: '发货次数',
            content: ''
          },
          {
            term: '购买数量',
            content: ''
          },
          {
            term: '头像',
            content: ''
          },
          {
            term: '手机号',
            content: ''
          },
          {
            term: '昵称',
            content: ''
          },{
            term: '联系人',
            content: ''
          }
        ],
        dataSource:[
          // {
          //   id:'pc01',
          //   addressee:'颜序文',
          //   phone:'18750202107',
          //   city:'福建省厦门市思明区',
          //   detailedDeliveryAddress:'福建省厦门市思明区软件园二期望海路10号之二601',
          //   remarks:'商品名称商品名称商品名称',
          //   courierServicesCompany:'顺丰',
          //   courierNumber:'123456789123',
          //   createTime:'2020-09-01 10:11:00',
          //   updateTime:'-'
          // }
        ],
        columns,
        url:{
          //配送信息批次号数据
          findMarketingGiftBagRecordBatchDeliveryMap:"/marketingGiftBagRecordBatchDelivery/marketingGiftBagRecordBatchDelivery/findMarketingGiftBagRecordBatchDeliveryMap",
          //导入
          importExcelUrl:"/marketingGiftBagRecordBatchDelivery/marketingGiftBagRecordBatchDelivery/importExcel",
          //导出
          exportXlsUrl:"",
          //列表
          list:"marketingGiftBagRecordBatchDelivery/marketingGiftBagRecordBatchDelivery/list"
        }
      }
    },
    computed:{
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
       selectmenuId(){
         return  this.menuLists[this.menuCurrent[0]].id
      }
    },
    created(){
      let purchasingGiftBagDistributionInformation = localStorage.getItem('purchasingGiftBagDistributionInformation')
      if(purchasingGiftBagDistributionInformation){
        purchasingGiftBagDistributionInformation =  JSON.parse(purchasingGiftBagDistributionInformation)
        this.card2Cnt[0].content = purchasingGiftBagDistributionInformation.id
        this.card2Cnt[1].content = purchasingGiftBagDistributionInformation.marketingGiftBagBatchId
        this.card2Cnt[2].content = purchasingGiftBagDistributionInformation.giftName
        this.card2Cnt[3].content = purchasingGiftBagDistributionInformation.sendTimes
        this.card2Cnt[4].content = purchasingGiftBagDistributionInformation.buyCount
        this.card2Cnt[5].content = purchasingGiftBagDistributionInformation.headPortrait
        this.card2Cnt[6].content = purchasingGiftBagDistributionInformation.mlPhone
        this.card2Cnt[7].content = purchasingGiftBagDistributionInformation.nickName
        this.card2Cnt[8].content = purchasingGiftBagDistributionInformation.linkman
        getAction(this.url.findMarketingGiftBagRecordBatchDeliveryMap,{marketingGiftBagRecordBatchId:purchasingGiftBagDistributionInformation.id}).then(res=>{
          this.menuLists = res.result
          this.$nextTick(()=>{
            this.getList()
          })
        })

      }

    },
    watch:{
      menuCurrent(newVal){
        this.getList();
      },
    },
    methods:{
      //列表数据
      getList(){
        return new Promise(resolve => {
          getAction(this.url.list,{pid:this.menuLists[this.menuCurrent[0]].id}).then(res=>{
            if(res.success){
              this.dataSource = res.result.records
              resolve()
            }
          })
        })
      },
      handleExportXls(){
        let fileName = this.menuLists[this.menuCurrent[0]].batchNumber
        if(!fileName || typeof fileName != "string"){
          fileName = "导出文件"
        }
        let param = {...this.queryParam};
        if(this.selectedRowKeys && this.selectedRowKeys.length>0){
          param['selections'] = this.selectedRowKeys.join(",")
        }
        console.log("导出参数",param)
        downFile(this.url.exportXlsUrl,param).then((data)=>{
          if (!data) {
            this.$message.warning("文件下载失败")
            return
          }
          if (typeof window.navigator.msSaveBlob !== 'undefined') {
            window.navigator.msSaveBlob(new Blob([data]), fileName+'.xls')
          }else{
            let url = window.URL.createObjectURL(new Blob([data]))
            let link = document.createElement('a')
            link.style.display = 'none'
            link.href = url
            link.setAttribute('download', fileName+'.xls')
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link); //下载完成移除元素
            window.URL.revokeObjectURL(url); //释放掉blob对象
          }
        })
      },
      handleImportExcel(info){
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          if(info.file.response.success){
            this.$message.success(`${info.file.name} 文件上传成功`);
            // this.loadData();
            this.getList();
          } else {
            this.$message.error(`${info.file.name} ${info.file.response.message}.`);
          }
        } else if (info.file.status === 'error') {
          this.$message.error(`文件上传失败: ${info.file.msg} `);
        }
      },
      onDelete(id) {
        const dataSource = [...this.dataSource]
        // const selectedRowKeys = [...this.selectedRowKeys]
        // this.selectedRowKeys = selectedRowKeys.filter(item => item !== id)
        this.dataSource = dataSource.filter(item =>  item.id !== id)
      },
      edit(record){
        this.$refs.modalForm.edit(record)
      },
      modalHandleOk(record){
        let dataSource = [...this.dataSource];
        let result = dataSource.map(item=>{
          if(item.id == record.id){
            return record
          }else{
            return item
          }
        })
        console.log(result,dataSource,record);
        this.dataSource = result
      }
    }
  }
</script>

<style lang="less">
  .purchasingGiftBagDistributionInformation{

    background: white;
  .wrap{
    margin-top: 30px;
  }
    .table-operator{
      margin-top: 10px;
    }
  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 25px;
  }
  }
</style>