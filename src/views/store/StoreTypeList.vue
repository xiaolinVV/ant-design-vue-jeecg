<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
        @expand="handleExpand"
        v-bind="tableProps">

        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleAddChild(record)">添加子分类</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status==='1'" @click="showStopStatus(record)">停用</a>
          <a v-else @click="showStartStatus(record)">启用</a>
          <a-divider type="vertical" />
            <a @click='showDelete(record)'>删除</a>
        </span>

      </a-table>
    </div>

    <storeType-modal ref="modalForm" @ok="modalFormOk"></storeType-modal>
    <StoreTypeListStopOrStartModal ref="storeTypeListStopOrStartModal" @ok="modalFormOk"/>
  </a-card>
</template>

<script>

  import { getAction, deleteAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import StoreTypeModal from './modules/StoreTypeModal'
  import StoreTypeListStopOrStartModal from './modules/StoreTypeListStopOrStartModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { filterObj } from '@/utils/util';

  export default {
    name: "StoreTypeList",
    mixins:[JeecgListMixin],
    components: {
      StoreTypeModal,
      StoreTypeListStopOrStartModal
    },
    data () {
      return {
        description: '店铺分类管理页面',
        /* 排序参数 */
        isorter:{
          column: 'rank,createTime',
          order: 'desc',
        },
        // 表头
        columns: [
          {
            title:'分类名称',
            align:"left",
            dataIndex: 'typeName'
          },
          {
            title:'分类级别',
            align:"left",
            dataIndex: 'level_dictText'
          },
          {
            title:'分类图片',
            align:"left",
            dataIndex: 'logoAddr',
            scopedSlots: {customRender: 'imgSlot'}
          },
          {
            title:'排序',
            align:"left",
            sorter: true,
            dataIndex: 'rank'
          },
          {
            title:'福利金抵扣最低值',
            align:"left",
            dataIndex: 'smallWelfarePayments',
            customRender:function (text) {
              if (text){
                return text + '%'
              }else {
                return text
              }
            }
          },
          {
            title:'状态',
            align:"left",
            dataIndex: 'status_dictText'
          },
          {
            title:'停用说明',
            align:"center",
            dataIndex: 'closeExplain',
            customRender:function (text) {
              if (text){
                return text
              }else {
                return '-'
              }
            }
          },
          {
            title:'创建者',
            align:"left",
            dataIndex: 'createBy_dictText'
          },
          {
            title:'创建时间',
            align:"left",
            sorter: true,
            dataIndex: 'createTime'
          },
          {
            title:'更新者',
            align:"left",
            dataIndex: 'updateBy_dictText'
          },
          {
            title:'更新时间',
            align:"left",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:250,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url: {
          list: "/storeType/storeType/rootList",
          childList: "/storeType/storeType/childList",
          getChildListBatch: "/storeType/storeType/getChildListBatch",
          delete: "/storeType/storeType/delete",
          deleteBatch: "/storeType/storeType/deleteBatch",
          exportXlsUrl: "/storeType/storeType/exportXls",
          importExcelUrl: "storeType/storeType/importExcel",
        },
        expandedRowKeys:[],
        hasChildrenField:"hasChild",
        pidField:"pid",
        dictOptions: {},
        loadParent: false,
        superFieldList:[],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
      tableProps() {
        let _this = this
        return {
          // 列表项是否可选择
          rowSelection: {
            selectedRowKeys: _this.selectedRowKeys,
            onChange: (selectedRowKeys) => _this.selectedRowKeys = selectedRowKeys
          }
        }
      }
    },
    methods: {
      handleAdd: function () {
        this.$refs.modalForm.add();
        this.$refs.modalForm.title = "添加分类";
        this.$refs.modalForm.disableSubmit = false;
      },
      showStopStatus(record = {}) {
        this.$refs.storeTypeListStopOrStartModal.showModalStopStatus(record)
      },
      showStartStatus(record = {}) {
        this.$refs.storeTypeListStopOrStartModal.showStartStatus(record)
      },
      showDelete(record = {}) {
        // todo 添加删除拦截校验 @zhangshaolin
        // if (record.level == 1 && record.isDel == 1) {
        //   this.$error({
        //     title: '该分类底下存在子分类或者商户，无法删除',
        //     content: '您若要删除该分类，请先移除子分类或者商户'
        //   })
        //   return
        // }
        this.$refs.storeTypeListStopOrStartModal.showDelete(record)
      },
      loadData(arg){
        if(arg==1){
          this.ipagination.current=1
        }
        this.loading = true
        let params = this.getQueryParams()
        params.hasQuery = 'true'
        getAction(this.url.list,params).then(res=>{
          if(res.success){
            let result = res.result
            if(Number(result.total)>0){
              this.ipagination.total = Number(result.total)
              this.dataSource = this.getDataByResult(res.result.records)
              return this.loadDataByExpandedRows(this.dataSource)
            }else{
              this.ipagination.total=0
              this.dataSource=[]
            }
          }else{
            this.$message.warning(res.message)
          }
        }).finally(()=>{
          this.loading = false
        })
      },
      // 根据已展开的行查询数据（用于保存后刷新时异步加载子级的数据）
      loadDataByExpandedRows(dataList) {
        if (this.expandedRowKeys.length > 0) {
          return getAction(this.url.getChildListBatch,{ parentIds: this.expandedRowKeys.join(',') }).then(res=>{
            if (res.success && res.result.records.length>0) {
              //已展开的数据批量子节点
              let records = res.result.records
              const listMap = new Map();
              for (let item of records) {
                let pid = item[this.pidField];
                if (this.expandedRowKeys.join(',').includes(pid)) {
                 let mapList = listMap.get(pid);
                  if (mapList == null) {
                    mapList = [];
                  }
                  mapList.push(item);
                  listMap.set(pid, mapList);
                }
              }
              let childrenMap = listMap;
              let fn = (list) => {
                if(list) {
                  list.forEach(data => {
                    if (this.expandedRowKeys.includes(data.id)) {
                      data.children = this.getDataByResult(childrenMap.get(data.id))
                      fn(data.children)
                    }
                  })
                }
              }
              fn(dataList)
            }
          })
        } else {
          return Promise.resolve()
        }
      },
      getQueryParams(arg) {
        //获取查询条件
        let sqp = {}
        let param = {}
        if(this.superQueryParams){
          sqp['superQueryParams']=encodeURI(this.superQueryParams)
          sqp['superQueryMatchType'] = this.superQueryMatchType
        }
        if(arg){
          param = Object.assign(sqp, this.isorter ,this.filters);
        }else{
          param = Object.assign(sqp, this.queryParam, this.isorter ,this.filters);
        }
        if(JSON.stringify(this.queryParam) === "{}" || arg){
          param.hasQuery = 'false'
        }else{
          param.hasQuery = 'true'
        }
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        return filterObj(param);
      },
      searchReset() {
        //重置
        this.expandedRowKeys = []
        this.queryParam = {}
        this.loadData(1);
      },
      getDataByResult(result){
        if(result){
          return result.map(item=>{
            //判断是否标记了带有子节点
            if(item[this.hasChildrenField]=='1'){
              let loadChild = { id: item.id+'_loadChild', name: 'loading...', isLoading: true }
              item.children = [loadChild]
            }
            return item
          })
        }
      },
      handleExpand(expanded, record){
        // 判断是否是展开状态
        if (expanded) {
          this.expandedRowKeys.push(record.id)
          if (record.children.length>0 && record.children[0].isLoading === true) {
            let params = this.getQueryParams(1);//查询条件
            params[this.pidField] = record.id
            params.hasQuery = 'false'
            params.superQueryParams=""
            getAction(this.url.childList,params).then((res)=>{
              if(res.success){
                if(res.result.records){
                  record.children = this.getDataByResult(res.result.records)
                  this.dataSource = [...this.dataSource]
                }else{
                  record.children=''
                  record.hasChildrenField='0'
                }
              }else{
                this.$message.warning(res.message)
              }
            })
          }
        }else{
          let keyIndex = this.expandedRowKeys.indexOf(record.id)
          if(keyIndex>=0){
            this.expandedRowKeys.splice(keyIndex, 1);
          }
        }
      },
      handleAddChild(record){
        this.loadParent = true
        let obj = {}
        obj[this.pidField] = record['id']
        this.$refs.modalForm.title = "添加子分类";
        this.$refs.modalForm.add(obj);
      },
      handleDeleteNode(id) {
        if(!this.url.delete){
          this.$message.error("请设置url.delete属性!")
          return
        }
        var that = this;
        deleteAction(that.url.delete, {id: id}).then((res) => {
          if (res.success) {
             that.loadData(1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      batchDel(){
        if(this.selectedRowKeys.length<=0){
          this.$message.warning('请选择一条记录！');
          return false;
        }else{
          let ids = "";
          let that = this;
          that.selectedRowKeys.forEach(function(val) {
            ids+=val+",";
          });
          that.$confirm({
            title:"确认删除",
            content:"是否删除选中数据?",
            onOk: function(){
              that.handleDeleteNode(ids)
              that.onClearSelected();
            }
          });
        }
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'typeName',text:'分类名称',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'level',text:'分类级别',dictCode:'store_type_level'})
        fieldList.push({type:'string',value:'logoAddr',text:'分类图片',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'sort',text:'排序',dictCode:''})
        fieldList.push({type:'BigDecimal',value:'smallWelfarePayments',text:'福利金抵扣最低值',dictCode:''})
        fieldList.push({type:'string',value:'status',text:'状态；0：停用；1：启用',dictCode:'store_type_status'})
        fieldList.push({type:'string',value:'closeExplain',text:'停用说明',dictCode:''})
        fieldList.push({type:'string',value:'createBy',text:'创建者',dictCode:"sys_user,realname,username"})
        fieldList.push({type:'datetime',value:'createTime',text:'创建时间'})
        fieldList.push({type:'string',value:'updateBy',text:'更新者',dictCode:"sys_user,realname,username"})
        fieldList.push({type:'datetime',value:'updateTime',text:'更新时间'})
        fieldList.push({type:'string',value:'pid',text:'父级分类id，0为一级',dictCode:''})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>