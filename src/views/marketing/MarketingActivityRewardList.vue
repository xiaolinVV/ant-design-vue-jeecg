<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="奖励流水号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动id">
              <a-input placeholder="请输入" v-model="queryParam.marketingCommingStoreId"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="活动名称">
              <a-input placeholder="请输入" v-model="queryParam.title"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="活动店铺">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员账号">
                <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员昵称">
                <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="获奖时间">
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
              <a-form-item label="奖品类型">
                <!--下拉框-->
                <a-select v-model="queryParam.awardType" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">福利金</a-select-option>
                  <a-select-option value="1">优惠券</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="发放状态">
                <!--下拉框-->
                <a-select v-model="queryParam.status" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">发放失败</a-select-option>
                  <a-select-option value="1">发放成功</a-select-option>
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('活动奖励')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
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
        :scroll="{x:2500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="reissueCertificate" slot-scope="text,record">
          <div  class="imgShow">

            <img v-for="(item,index) in handlePreviewImage(record.reissueCertificate)" class="clickShowImage" :preview="'reissueCertificate' + index"  :key="index" :src="item" alt="" >
          </div>
        </template>
        <template slot="awardType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.awardType==0" >福利金</span>
            <span shape="square" v-if="record.awardType==1" >优惠券</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0" >发放失败</span>
            <span shape="square" v-if="record.status==1" >发放成功</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">补发登记</a>

<!--          <a-divider type="vertical" />-->
<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
<!--            <a-menu slot="overlay">-->
<!--              <a-menu-item>-->
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
<!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingActivityReward-modal ref="modalForm" @ok="modalFormOk"></marketingActivityReward-modal>
  </a-card>
</template>

<script>
  import MarketingActivityRewardModal from './modules/MarketingActivityRewardModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util';
  export default {
    name: "MarketingActivityRewardList",
    mixins: [JeecgListMixin],
    components: {
      MarketingActivityRewardModal
    },
    data () {
      return {
        description: '活动奖励管理页面',
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
            title: '奖励流水号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '活动id',
            align: "center",
            dataIndex: 'marketingCommingStoreId'
          },
          {
            title: '活动名称',
            align: "center",
            dataIndex: 'title'
          },
          {
            title: '活动店铺',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '会员账号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '会员昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '获奖时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '奖品类型',
            align: "center",
            dataIndex: 'awardType',
            scopedSlots: {customRender: "awardType"}
          },
          {
            title: '奖品',
            align: "center",
            dataIndex: 'award'
          },
          {
            title: '发放状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
          },
          {
            title: '失败原因',
            align: "center",
            dataIndex: 'failureExplain'
          },
          {
            title: '补发说明',
            align: "center",
            dataIndex: 'reissueExplain'
          },
          {
            title: '补发凭证',
            align: "center",
            dataIndex: 'reissueCertificate',
            scopedSlots: { customRender: 'reissueCertificate' },
          },
          {
            title: '补发登记时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '补发记录人',
            align: "center",
            dataIndex: 'updateBy'
          },

          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
            align:"center",
            scopedSlots: { customRender: 'action' },
            width:100
          }
        ],
        url: {
          list: "/marketingActivityReward/marketingActivityReward/list",
          delete: "/marketingActivityReward/marketingActivityReward/delete",
          deleteBatch: "/marketingActivityReward/marketingActivityReward/deleteBatch",
          exportXlsUrl: "marketingActivityReward/marketingActivityReward/exportXls",
          importExcelUrl: "marketingActivityReward/marketingActivityReward/importExcel",
       },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
    }
  },
  computed: {
    importExcelUrl: function(){
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
    }
  },
    methods: {
      handlePreviewImage(image){
        if(image){
          let sz = []
          image = Object.values(JSON.parse(image))
          for(let item of image){
            sz.push(this.configure.imgErver + '/' + item)
          }
        return sz
        }
        return ''
      },
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
    }
  }
</script>
<style scoped lang="scss">
  .imgShow{
    display: flex;
    align-items: center;
    justify-content: space-around;
    img{
      margin-right: 10px;
    }
    img:last-child{
      margin: 0;
    }
  }
</style>