<template>
  <a-modal
    title="选择商品"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    class=" AddMarketingCommoditySelectStoreRecommendModel popUp"
  >
    <a-spin  :spinning="confirmLoading">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="7" :sm="8">
              <a-form-item label="商品名称">
                <a-input placeholder="请输入商品名称" v-model="queryParam
              .goodName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="8">
              <a-form-item
                style="display: flex;justify-content: space-between;width: 100%"
                label="专区分类">
                <a-cascader :options="prefectureType"
                            :loadData="prefectureTypeDataLoad"
                            changeOnSelect
                            v-model="queryParam.marketingPrefectureTypeId"
                            style="width: 100%"
                            placeholder="请选择专区分类" />
              </a-form-item>
            </a-col>
            <a-col :md="24" :sm="8">
              <a-button type="primary"  icon="search" @click="loadData">查询</a-button>
            </a-col>
            <a-col :md="24" >
              <a-table
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                :columns="columns"
                :dataSource="dataSource"
                :scroll="{y:600}"
                rowKey="id"
                :pagination="pagination"
                @change="tableChange"
              >
                <template slot="picture" slot-scope="text, record, index">
                  <img preview="1" :src="text" alt="" style="width: 50px;height: 50px;display: inline-block;vertical-align: middle">
                </template>
              </a-table>
            </a-col>

          </a-row>
        </a-form>
      </div>
    </a-spin>



  </a-modal>
</template>

<script>
  const columns = [
    {
      title: '商品图片',
      dataIndex: 'mainPicture',
      align:'center',
      scopedSlots: {customRender: "picture"},
      width:150
    },
    {
      title: '商品名称',
      dataIndex: 'goodName',
      align:'center',
      width:300
    },
    {
      title: '专区分类',
      dataIndex: 'typeName',
      align:'center',
      width:250
    },{
      title: '专区价',
      dataIndex: 'prefecturePrice',
      align:'center'
    },{
      title: '库存',
      dataIndex: 'repertory',
      align:'center'
    }
  ];
  import { getAction,postAction  } from '@/api/manage'
  export default {
    name: 'AddMarketingCommoditySelectStoreRecommendModel',
    props:{
      marketingPrefectureId:{
        type:String,
        default:''
      },
      marketingPrefectureRecommendId:{
        type:String,
        default:''
      },
      selectedRowKeysFrom:{
        type:[String,Array],
        default:''
      }
    },
    data(){
      return{
        visible:false,
        confirmLoading:false,
        prefectureType:[],
        //查询
        queryParam:{
          goodName:'',
          marketingPrefectureTypeId:"",
        },
        pagination:{
          total:200,
          hideOnSinglePage:true
        },
        url:{
          getgoodTypeListcascade: 'goodType/goodType/getgoodTypeListcascade',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          //添加商品列表
          getMarketingPrefectureGood:'marketingPrefectureGood/marketingPrefectureGood/findMarketingPrefectureGoodList',
          //获取对应专区分类
          getMarketingPrefectureType: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType',
          //获取专区二级分类
          findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        },
        //table
        dataSource:[],
        columns,
        selectedRowKeys: [], // Check here to configure the default column
        loading: false,
        pageNo:1,
        selectedResultList:[],
        allData:[]
      }
    },
    watch:{
      selectedRowKeysFrom(newVal){
        console.log('--------------------------------------',newVal)
        if(newVal){
          if(Array.isArray(newVal)){
            this.selectedRowKeys = newVal
          }else{
            this.selectedRowKeys = newVal.split(',')
          }
        }else{
          this.selectedRowKeys = []
        }
      }
    },
    created(){
      let info = {
        marketingPrefectureId: this.marketingPrefectureId
      }
      getAction(this.url.getMarketingPrefectureType, info).then(res => {
        if (res.success) {
          let sz = []
          for(let item of res.result){
            sz.push({
              label: item.typeName,
              value: item.id,
              isLeaf: false,
            })
          }
          this.prefectureType = sz
        }
      })
    },
    methods:{
      prefectureTypeDataLoad(selectedOptions){
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(targetOption);
        getAction(this.url.findUnderlingListMap,{id:targetOption.value}).then((res)=>{
          targetOption.loading = false;
          if (res.success && res.result.length>0){
            let sz = []
            for(let item of res.result){
              sz.push( {
                label: item.type_name,
                value: item.id,
                // isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.prefectureType = [...this.prefectureType];
        });
      },
      handleOk(){
        //弹窗确定
        if(this.selectedRowKeys.length<=0){
          this.$message.warn('请选择商品');
          return ;
        }
        let sz = []
        let sort = 0
        for(let item of this.allData){
          for(let item2 of this.selectedRowKeys){
            if(item.id == item2){
              sz.push(item)
            }
          }
        }
        setTimeout(()=>{
          this.selectedResultList = sz
          for(let item of sz){
            item.sort = sort;
            sort++
          }
            let info = {
              marketingPrefectureId:this.marketingPrefectureId,
              ids:this.selectedRowKeys.join(','),
              selectedResultList:this.selectedResultList
            }
            this.$emit('handleOK',info);
            this.handleCancel()

        },150)

      },
      handleCancel(){
        //弹窗取消
        this.visible = false
        this.queryParam = {
          goodName:'',
          marketingPrefectureTypeId:''
        }
      },
      open(){
        this.visible = true
        this.loadData();
        // this.getMarketingPrefectureType()
      },
      onSelectChange(selectedRowKeys) {
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.selectedRowKeys = selectedRowKeys;
      },
      tableChange(pageNo){
        this.loadData(true,pageNo.current)
      },
      loadData(isLoadMore = false,pageNo = 1){
        if(!this.marketingPrefectureId){
          this.$message.warn('请重新在专区商品中新增分类')
          return;
        }
        this.confirmLoading = true
        this.pageNo = pageNo
        let info = {
          marketingPrefectureId:this.marketingPrefectureId,
          pageNo,
          marketingPrefectureRecommendId:this.marketingPrefectureRecommendId
        }
        info = Object.assign({},this.queryParam,info)
        if(Array.isArray(info.marketingPrefectureTypeId) && info.marketingPrefectureTypeId.length > 0){
          info.marketingPrefectureTypeId = info.marketingPrefectureTypeId.join(',')
        }
        getAction(this.url.getMarketingPrefectureGood,info).then(res=>{
          this.allData = [...this.allData,...res.result.records]
          this.$nextTick(()=>{
            let allId = [];
            let resultAllData = [];
            for(let item of this.allData){
              allId.push(item.id)
            }
            allId = Array.from(new Set(allId));
            for(let item2 of allId){
              for(let item of this.allData){
                if(item2 == item.id){
                  resultAllData.push(item);
                  break;
                }
              }
            }

            this.allData = resultAllData
          })
          if(res.success){
            for(let item of res.result.records){
              if(item.mainPicture){
                item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              }
            }
            this.dataSource = res.result.records
            this.pagination.total = res.result.pages * 10
          }
          this.confirmLoading = false
        })
      },


    }
  }
</script>

<style lang="less">

</style>