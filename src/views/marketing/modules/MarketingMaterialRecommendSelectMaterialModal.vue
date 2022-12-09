<template>
<!--  :footer="null"-->
<!--  cancelText="关闭"-->
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    class="MarketingMaterialRecommendSelectMaterialModal"
  >
    <div class="search">
      <div>
        <div>
          素材编号：
        </div>
        <a-input v-model="querySearch.id">

        </a-input>
      </div>
      <div>
        <div>
          标题：
        </div>
        <a-input v-model="querySearch.title">

        </a-input>
      </div>
      <div>
        <div>
          作者：
        </div>
        <!--        v-model="queryParam.createTime"-->
        <!--        @change="onDateChange"-->
        <!--        @ok="onDateOk"-->
        <a-input v-model="querySearch.author"></a-input>
      </div>
      <div>
        <div>
          类型：
        </div>
        <a-select placeholder="请选择" style="width: 150px"  v-model="querySearch.materialType">
          <a-select-option value="">请选择</a-select-option>
          <a-select-option value="1">图文素材</a-select-option>
          <a-select-option value="2">视频素材</a-select-option>
        </a-select>
      </div>
      <a-button type="primary" @click="search" icon="search">查询</a-button>
    </div>
<!--    x:(selectMaterialColumns.length + 1) * columnsWidth-->
    <a-table :columns="selectMaterialColumns" :dataSource="selectMaterialData" :rowSelection="rowSelection" bordered
             :pagination="selectPagination" @change="handleSelectTableChange" style="margin-top: 10px;"
             :scroll="{  y: 500, x:columnsWidth}" :loading="tableLoading"
             :rowKey="record => record.id"
    >
      <template slot="surfacePlot" slot-scope="text">
        <img preview="1" :src="handleImage(text)" alt="" style="width: 40px;height: 40px;">
      </template>
      <template slot="materialType" slot-scope="text, record, index">
        <div class="anty-img-wrap">
          <span shape="square" v-if="record.materialType==1" >图文</span>
          <span shape="square" v-if="record.materialType==2" >视频</span>
        </div>
      </template>
      <template slot="dianzanCounts" slot-scope="text, record, index">
        <a @click="modalOpen(record,'thumbsUp')">{{text}}</a>
      </template>
      <template slot="browseCount" slot-scope="text, record, index">
        <a @click="modalOpen(record,'browse')">{{text}}</a>
      </template>
    </a-table>
    <member-info-modal ref="modalForm"  :type="infoModalType"></member-info-modal>
    </a-modal>
</template>

<script>
  const columnsWidth = 2200
  const selectMaterialColumns = [
      {
        title: '编号',
        align:"center",
        dataIndex: 'id',
        width:250
      },
      {
        title: '素材标题',
        align:"center",
        dataIndex: 'title',
        width:250
      },
      {
        title: '封面图片',
        align:"center",
        dataIndex: 'surfacePlot',
        scopedSlots: {customRender: "surfacePlot"},
        width:150
      },
      {
        title: '作者',
        align:"center",
        dataIndex: 'author',
        width:100
      },
      {
        title: '栏目',
        align:"center",
        dataIndex: 'marketingMaterialColumnName',
        width:100
      },
      {
        title: '素材类型',//；1：图文素材；2：视频素材
        align:"center",
        dataIndex: 'materialType',
        scopedSlots: {customRender: "materialType"},
        width:150
      },
      {
        title: '关联商品',
        align:"center",
        dataIndex: 'goodListCount',
        width:200
      },
      {
        title: '初始浏览量',
        align:"center",
        dataIndex: 'initialViews',
        width:200
      },  {
        title: '会员浏览量',
        align:"center",
        dataIndex: 'browseCount',
        scopedSlots: {customRender: "browseCount"},
      width:200
      },  {
        title: '初始赞数',
        align:"center",
        dataIndex: 'initialPraise',
      width:200
      },  {
        title: '会员点赞数',
        align:"center",
        dataIndex: 'dianzanCount',
        scopedSlots: {customRender: "dianzanCounts"},
      width:200
      },  {
        title: '评论',
        align:"center",
        dataIndex: 'commentCount',
      width:200
      },
    ]
  import { httpAction,getAction ,postAction} from '@/api/manage'
  import memberInfoModal from '@/components/popUp/memberInfoModal'
  export default {
    name: 'MarketingMaterialRecommendSelectMaterialModal',
    data(){
      return{
        title:'选择素材',
        visible:false,
        confirmLoading:false,
        columnsWidth,
        selectMaterialColumns,
        //选择商品表格
        selectMaterialData: [],
        //选择商品保存的id
        selectedRowKeys: [],
        //查询table分页配置
        selectPagination:{
          current:1,
          pageSize:10,
          total:1,
          pageNo:1
        },
        //查询数据
        querySearch:{
          id:'',
          title:'',
          author:'',
          materialType:''
        },
        //弹窗表加载
        tableLoading: false,
        infoModalType:'browse',
        url:{
          marketingMaterialList:"/marketingMaterialList/marketingMaterialList/list",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        }
      }
    },
    components:{
      memberInfoModal
    },
    computed: {
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          type:'radio',
          selections: [
            {
              key: 'all-data',
              text: 'Select All Data',
              onSelect: () => {
                this.selectedRowKeys = [...Array(46).keys()] // 0...45
              }
            }
          ],
          onSelection: this.onSelection
        }
      }
//      uploadAction: function () {
//        return this.url.fileUpload;
//      },
    },
    methods:{
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      handleOk(){

        console.log(this.selectedRowKeys)
        let info = {
          title:'',
          id:''
        }
        for(let item of this.selectMaterialData){
          if(item.id == this.selectedRowKeys[0]){
            info.title = item.title
            info.id = item.id
            break;
          }
        }
        this.$emit('close',info)
        this.close();
      },
      handleCancel(){
        this.close();
      },
      handleSelectTableChange(pagination){
        console.log(pagination);
        this.selectPagination.current = pagination.current;
        this.selectPagination.pageNo = pagination.current;
        this.search()
      },
      handleImage(image){
        if(image){
          return this.url.imgerver + '/' + Object.values(JSON.parse(image))
        }else{
          return ''
        }
      },
      open(id = ''){
        this.selectPagination.current = 1;
        this.selectPagination.pageNo = 1;
        this.querySearch = {
          id:'',
          title:'',
          author:'',
          materialType:''
        }
        if(id){
          this.onSelectChange([id])
        }else{
          this.onSelectChange([])
        }
        this.$nextTick(()=>{
          this.search()
          this.visible = true
        })
      },
      close(){
        this.visible = false
      },
      modalOpen(record = {},infoModalType){
        this.infoModalType = infoModalType
        this.$nextTick(()=>{
          this.$refs.modalForm.edit(record)
        })
      },
      search(){
        this.tableLoading = true
        let requestInfo = Object.assign({},{isPublish:"1"},this.querySearch,this.selectPagination)
          getAction(this.url.marketingMaterialList, requestInfo).then((res) => {
            console.log(res);
            let data = res.result
            this.tableLoading = false
            this.selectMaterialData = data.records
            this.selectPagination.total = data.total
          });
      }

    }
  }
</script>

<style lang="scss" scoped>
  .MarketingMaterialRecommendSelectMaterialModal{
    .search{
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 50px;
      width:100% ;
      >div{
        display: flex;
        align-items: center;
        input{
          margin-left: 10px;
          width: 150px;
        }
      }
    }

  }
</style>