<template>
  <div class="MarketingPrefectureRecommendGoodList">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both">
      </div>
      <a-card :bordered="false"
              style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入" @search="onSearch" enterButton/>
          <a-menu mode="inline" :open-keys="openKeys" style="width: 100%;margin-top: 10px" @openChange="onOpenChange" v-if="!isempty" v-model="menuKeys" >
<!--            @titleClick="getMarketingPrefectureRecommendList(index)"-->
<!--            'sub' + index-->
            <a-sub-menu v-for="(item,index) in listData" :key="item.id">
              <span slot="title" class="line-render-item">
                <img preview="1" :src="item['logoAddr']" alt="">
                <span> {{item.prefectureName}}</span>
              </span>
              <a-menu-item v-for="(item2,index2) in item.children" :key="item2.id" @click="loadData(item2)">
                {{item2.recommend_name}}
              </a-menu-item>
            </a-sub-menu>
          </a-menu>
          <div v-else class="line-render-item" style="justify-content: center;margin-top: 200px">
            很抱歉，暂无符合要求的专区
          </div>
        </a-spin>
      </a-card>
      <a-card :bordered="false" style="width: 79%;min-height: 700px;background: white;float: right">

        <!-- 查询区域 -->
        <div class="table-page-search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="24">

              <a-col :md="8" :sm="8">
                <a-form-item label="商品名称">
                  <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="专区分类">
                  <a-cascader :options="prefectureType"
                              :loadData="prefectureTypeDataLoad"
                              changeOnSelect
                              v-model="saerchMarketingPrefectureTypeId"
                              style="width: 100%"
                              placeholder="请选择专区分类" />
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="加入时间">
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange"
                    @ok="onDateOk"
                  />
                </a-form-item>
              </a-col>
              <a-col :md="6" :sm="8" >
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="loadData('')" icon="search">查询</a-button>
<!--              <a-button type="primary" @click="searchQuery" icon="reload" style="margin-left: 8px">重置</a-button>-->
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
            </span>
              </a-col>

            </a-row>
          </a-form>
        </div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="routerTo" type="primary" icon="plus">加入</a-button>
<!--          <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('专区推荐商品')">导出</a-button>-->
<!--          <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--            <a-button type="primary" icon="import">导入</a-button>-->
<!--          </a-upload>-->
<!--          <a-dropdown v-if="selectedRowKeys.length > 0">-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>-->
<!--            </a-menu>-->
<!--            <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>-->
<!--          </a-dropdown>-->
        </div>

        <!-- table区域-begin -->
        <div>
          <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
            <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
            <a style="margin-left: 24px" @click="onClearSelected">清空</a>
          </div>

          <a-table
            ref="table"
            size="middle"
            bordered
            rowKey="id"
            :columns="columns"
            :dataSource="dataSource"
            :pagination="ipagination"
            :loading="loading"
            :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
            @change="handleTableChange">
            <template slot="mainPicture" slot-scope="text,record,index">
              <img class="clickShowImage " :preview="'mainPicture' + index" :src="text" alt="" >
            </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">修改排序</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
          </a-popconfirm>

        </span>

          </a-table>
        </div>
        <!-- table区域-end -->


      </a-card>
      <div style="clear: both">
      </div>
    </div>
    <!-- 表单区域 -->
    <marketingPrefectureRecommendGood-modal ref="modalForm" @ok="modalFormOk"></marketingPrefectureRecommendGood-modal>
  </div>


</template>

<script>
  import MarketingPrefectureRecommendGoodModal from './modules/MarketingPrefectureRecommendGoodModal'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import {httpAction, getAction, postAction, putAction ,deleteAction} from '@/api/manage'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MarketingPrefectureRecommendGoodList",
    mixins:[JeecgListMixin],
    components: {
      MarketingPrefectureRecommendGoodModal
    },
    data () {
      return {
        saerchMarketingPrefectureTypeId:[],
        description: '专区推荐商品管理页面',
        rootSubmenuKeys: [],
        openKeys: [],
        menuKeys:[],
        cardLoading:false,
        listData: [],
        marketingPrefectureRecommendId: '',
        prefectureType:[],
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
           },
		   {
            title: '专区图片',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots: { customRender: 'mainPicture' },
           },
		   {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName',
            width:250
           }, {
            title: '专区分类',
            align:"center",
            dataIndex: 'typeName'
          },{
            title: '专区价格',
            align:"center",
            dataIndex: 'prefecturePrice'
          },{
            title: '库存',
            align:"center",
            dataIndex: 'repertory'
          },
		   {
            title: '排序',
            align:"center",
            dataIndex: 'sort'
           },{
            title: '加入时间',
            align:"center",
            dataIndex: 'createTime'
          },{
            title: '操作者',
            align:"center",
            dataIndex: 'createBy'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            scopedSlots: { customRender: 'action' },
          }
        ],
        recommendName:'',
        isempty:false,
		    url: {
          list: "/marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/list",
          delete: "/marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/delete",
          deleteBatch: "/marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/deleteBatch",
          exportXlsUrl: "marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/exportXls",
          importExcelUrl: "marketingPrefectureRecommendGood/marketingPrefectureRecommendGood/importExcel",
          //marketingPrefecture/marketingPrefecture/getMarketingPrefectureByRecommend
          getMarketingPrefecture: 'marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
          //获取下一级数据
          getMarketingPrefectureRecommendList:"marketingPrefectureRecommend/marketingPrefectureRecommend/getMarketingPrefectureRecommendList",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          //获取对应专区分类
          getMarketingPrefectureType: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType',
          //获取专区二级分类
          findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
       },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    created() {
      this.leftListMethods('',true);
    },
    watch:{
      saerchMarketingPrefectureTypeId(newVal){
        if(Array.isArray(newVal)){
          this.queryParam.marketingPrefectureTypeId = newVal.join(',')
        }
      }
    },


    methods: {
      getMarketingPrefectureType(id){
        let info = {
          marketingPrefectureId: id
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
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        return filterObj(param);
      },
      onDateChange: function(value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },
      routerTo() {
        if (!this.marketingPrefectureRecommendId) {
          this.$message.warn('请在左侧选择对应专区以及对应的推荐分类')
          return
        }
        this.$router.push({
          path: '/marketing/modules/AddMarketingCommodityRecommendModel', query: {
            marketingPrefectureId: this.openKeys[0],
            recommendName:this.recommendName,
            marketingPrefectureRecommendId:this.marketingPrefectureRecommendId
          }
        })
      },
      onSearch(value) {
        this.leftListMethods(value,true)
      },
      getMarketingPrefectureRecommendList(index,isRefresh = false){
        getAction(this.url.getMarketingPrefectureRecommendList,{marketingPrefectureId:this.listData[index].id}).then(res=>{
          if(res.success){
            this.$set(this.listData[index],'children',res.result)
            if(isRefresh){
              this.menuKeys = [res.result[0].id]
              this.$nextTick(()=>{
                this.loadData(res.result[0])
              })
            }
          }
        })
        this.getMarketingPrefectureType(this.listData[index].id)
      },
      handleTableChange(pagination, filters, sorter) {
        this.ipagination = pagination
        this.loadData({
          id: this.marketingPrefectureRecommendId
        }, true)
      },
      loadData(item = '', isMore = false) {
        if(!item){
          item = {
            id: this.marketingPrefectureRecommendId,
            recommend_name:this.recommendName
          }
        }else{
          this.recommendName = item.recommend_name || ''
        }
        if (!isMore) {
          this.ipagination.current = 1
        }
        let marketingPrefectureRecommendId = item.id
        this.loading = true
        this.marketingPrefectureRecommendId = marketingPrefectureRecommendId
        let info = Object.assign({}, { marketingPrefectureRecommendId }, this.queryParam, { pageNo: this.ipagination.current,pageSize:this.ipagination.pageSize})
        console.log(item,info)
        getAction(this.url.list, info).then(res => {
          if (res.success) {
            for (let item of res.result.records) {
              if (item.mainPicture) {
                item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              }
            }
            this.dataSource = res.result.records
            this.ipagination.total = res.result.total
          }
          this.loading = false
        })
      },
      // 分类左边方法封装
      leftListMethods(prefectureName = '',isRefresh = false) {
        this.cardLoading = true
        this.isempty = true
        getAction(this.url.getMarketingPrefecture, { prefectureName, isViewType: '' ,isViewPrefectureRecommended:1}).then(res => {
          if (res.success) {
            this.rootSubmenuKeys = [];
            let sz = []
            if (res.result.length > 0) {
              // this.marketingPrefectureRecommendId = res.result[0].id
              // this.loadData(res.result[0])
              let count = -1
              for (let item of res.result) {
                if(item.isViewRecommend == 1){
                  count ++
                  if(this.isempty){
                    this.isempty = false
                  }
                  if (item['logoAddr']) {
                    item['logoAddr'] = this.url.imgerver + '/' + Object.values(JSON.parse(item['logoAddr']))[0]
                  } else {
                    item['logoAddr'] = ''
                  }
                  item.children = []
                  this.rootSubmenuKeys.push( item.id )
                  sz.push(item)
                }
              }
            }
            if(isRefresh){

            }
            this.listData = sz
            this.$nextTick(()=>{
              this.onOpenChange([sz[0].id],true)
            })
          }
          this.cardLoading = false
        })
      },
      onOpenChange(openKeys,isRefresh = false) {
        const latestOpenKey = openKeys.find(key => this.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.openKeys = openKeys;
        } else {
          this.openKeys = latestOpenKey ? [latestOpenKey] : [];
        }
        if(this.openKeys.length > 0){
          let index = this.rootSubmenuKeys.indexOf(this.openKeys[0])
          console.log(index)
          if(index != -1){
            this.getMarketingPrefectureRecommendList(index,isRefresh)
          }
        }
        console.log(this.openKeys,this.rootSubmenuKeys)
      },
    }
  }
</script>
<style lang="less">
  .MarketingPrefectureRecommendGoodList {
  .select-color {
    color: #1890FF;
  }

  .spin-content {
    padding: 30px;
  }

  .line-render-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 14px;
    font-weight: 700;
    width: 100%;

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }
  }

  .line-render-item:hover {
    cursor: pointer;
    color: #1890FF;
  }

  }
</style>