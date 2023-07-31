<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="标题">
              <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="作者">
              <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="类型">
                <a-select v-model="queryParam.materialType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="1">图文素材</a-select-option>
                  <a-select-option :value="2">视频素材</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.isPublish" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option :value="0">未发布</a-select-option>
                  <a-select-option :value="1">已发布</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                  @ok="onDateOk"
                />
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item label="栏目">
                <a-select v-model="queryParam.marketingTextbookColumnId" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="(item,index) in marketingTextbookColumnLists" :value="item.id" :key="item.id">
                    {{item.name}}
                  </a-select-option>

                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>
              </a>
            </span>
          </a-col>

        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="routerTo(1)" type="primary" icon="plus">新增</a-button>
     <!-- <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('教程素材')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete"/>
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作
          <a-icon type="down"/>
        </a-button>
      </a-dropdown>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :scroll="{x:2000}"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="materialType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.materialType==1">图文素材</span>
            <span shape="square" v-if="record.materialType==2">视频素材</span>
          </div>
        </template>
        <template slot="isPublish" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isPublish==0">未发布</span>
            <span shape="square" v-if="record.isPublish==1">已发布</span>
          </div>
        </template>
<!--        <span slot="action" slot-scope="text, record">-->
<!--          <a @click="handleEdit(record)">编辑</a>-->

<!--          <a-divider type="vertical"/>-->
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
<!--        </span>-->
        <template slot="surfacePlot" slot-scope="text, record">
          <img class="clickShowImage" v-if="record.surfacePlot != undefined " :preview="'surfacePlot' + index" :src="getAvatarView(record.surfacePlot)" alt=""/>
          <a-avatar shape="square" v-if="record.surfacePlot == undefined || record.surfacePlot ==''  " :src="getAvatarView(record.surfacePlot)" icon="user"/>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="routerTo('2',record)">编辑</a>

          <a-divider type="vertical" />
         <a v-if="record.isPublish==1" @click="updateIsPublish(record.id,'0')">取消发布</a>
          <a v-if="record.isPublish==0" @click="updateIsPublish(record.id,'1')">发布</a>
           <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
          <a>删除</a>
                </a-popconfirm>


        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingTextbookList-modal ref="modalForm" @ok="modalFormOk"></marketingTextbookList-modal>
  </a-card>
</template>

<script>
  import MarketingTextbookListModal from './modules/MarketingTextbookListModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction ,postAction } from '@/api/manage'
  import { filterObj } from '@/utils/util'
  import Vue from 'vue'
  import {initDictOptions, filterDictText} from '@/components/dict/JDictSelectUtil'
  export default {
    name: "MarketingTextbookListList",
    mixins: [JeecgListMixin],
    components: {
      MarketingTextbookListModal
    },
    data () {
      return {
        description: '教程素材管理页面',
        marketingTextbookColumnLists:[],
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '标题',
            align: "center",
            dataIndex: 'title'
          },
          {
            title: '封面图片',
            align: "center",
            dataIndex: 'surfacePlot',
            scopedSlots: {customRender: "surfacePlot"}
          },
          {
            title: '作者',
            align: "center",
            dataIndex: 'realname'
          },
          {
            title: '栏目',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '类型',
            align: "center",
            dataIndex: 'materialType',
            scopedSlots: {customRender: "materialType"}
          },
          {
            title: '初始浏览量',
            align: "center",
            dataIndex: 'initialViews'
          },
          {
            title: '会员浏览量',
            align: "center",
            dataIndex: 'initialPraise'
          },
          {
            title: '排序',
            align: "center",
            dataIndex: 'sort'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'isPublish',
            scopedSlots: {customRender: "isPublish"}
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },


          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/marketingTextbookList/marketingTextbookList/list",
          delete: "/marketingTextbookList/marketingTextbookList/delete",
          deleteBatch: "/marketingTextbookList/marketingTextbookList/deleteBatch",
          exportXlsUrl: "marketingTextbookList/marketingTextbookList/exportXls",
          importExcelUrl: "marketingTextbookList/marketingTextbookList/importExcel",
          updateIsPublish:"/marketingMaterialList/marketingMaterialList/updateIsPublish",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          getMarketingMaterialColumnListMap:"/marketingMaterialColumn/marketingMaterialColumn/getMarketingMaterialColumnListMap",
          edit: "/marketingTextbookList/marketingTextbookList/edit",
          findMarketingTextbookColumn:'/marketingTextbookColumn/marketingTextbookColumn/findMarketingTextbookColumn'
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    created(){
      getAction(this.url.findMarketingTextbookColumn).then(res=>{
        if(res.success){
          this.marketingTextbookColumnLists = res.result
        }
      })
    },
    methods: {
      // /**查询栏时间区间查询*/
      getQueryParams(){
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
      getAvatarView: function (mainPicture) {
        if(mainPicture){
          return this.url.imgerver + "/" +  Object.values(JSON.parse(mainPicture))[0];
        }else{
          return ''
        }

      },
      routerTo(isEdit,record = {}){
        // AddMarketingMaterialModelData
        localStorage.setItem('AddMarketingTextbookModelData',JSON.stringify(record))
        this.$router.push({ path: '/marketing/modules/AddMarketingTextbookModel' ,query:{isEdit}})
      },
      //发布修改
      updateIsPublish(id, isPublish){
        postAction(this.url.edit, { id: id,  isPublish: isPublish }).then((res) => {
          if (res.success) {
            this.$message.success(res.message)
            this.loadData()
            this.onClearSelected()
          } else {
            this.$message.warning(res.message)
          }
        })
      },

    }
  }
</script>
<style scoped>

</style>