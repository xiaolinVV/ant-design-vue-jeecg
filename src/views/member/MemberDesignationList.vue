<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="称号编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="团队名称">
              <a-input placeholder="请输入" v-model="queryParam.groupName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="称号名称">
              <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status"    placeholder="请选择"     style="margin-right: 10px;">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option  :value="0">停用</a-select-option>
                  <a-select-option  :value="1">启用</a-select-option>
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
              <a-form-item label="更新时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.updateTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk"
                />
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
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('称号管理')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
      </a-dropdown>
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
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        :scroll='{x:2800}'
        @change="handleTableChange">
        <template slot="logoAddr" slot-scope="text, record,index">
          <div class="anty-img-wrap">
            <img v-if="record.logoAddr" class="clickShowImage" :preview="'logoAddr' + index"  :src="getAvatarView(record.logoAddr)" alt="">
            <a-avatar shape="square" v-else :src="getAvatarView(record.logoAddr)" icon="user"/>
          </div>
        </template>
        <template slot="recommendedType" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.recommendedType==0">普通会员和vip会员</span>
            <span shape="square" v-if="record.recommendedType==1">仅vip会员</span>
            <span shape="square" v-if="record.recommendedType==2">仅买礼包成为vip的会员</span>
          </div>
        </template>
        <template slot="isOpenMoney" slot-scope="text,record">
          <div v-if="record.isOpenMoney == 1 ">
            开启
          </div>
          <div v-else>
            关闭
          </div>
<!--          <a-switch checked-children="开" un-checked-children="关"  :checked="record.isOpenMoney == 1 ? true : false" @change="value =>switchChange(value,record)" />-->
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>
        <template slot="isDefault" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isDefault==0">否</span>
            <span shape="square" v-if="record.isDefault==1">是</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a v-if="record.isOpenMoney == 1" @click="switchChange(false,record)">称号资金关闭</a>
          <a v-else @click="switchChange(true,record)">称号资金开启</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                 <a @click="showDelete(record)">删除</a>
<!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
<!--                  <a>删除</a>-->
<!--                </a-popconfirm>-->
              </a-menu-item>
              <a-menu-item>
                <a v-if="record.status != 1" @click="showStartStatus(record)">启用</a>
                <a v-else  @click="showStopStatus(record)">停用</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberDesignation-modal ref="modalForm" @ok="modalFormOk"></memberDesignation-modal>
    <memberDesignationListStopOrStartModal ref="modalForm2" @ok="stuatusChangeOk">

    </memberDesignationListStopOrStartModal>
  </a-card>
</template>

<script>
  import MemberDesignationModal from './modules/MemberDesignationModal'
  import memberDesignationListStopOrStartModal from './modules/memberDesignationListStopOrStartModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MemberDesignationList",
    mixins: [JeecgListMixin],
    components: {
      MemberDesignationModal,
      memberDesignationListStopOrStartModal
    },
    data () {
      return {
        description: '称号管理管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            fixed: 'left',
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '称号编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '团队名称',
            align: "center",
            dataIndex: 'groupName'
          },
          {
            title: ' 称号名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: ' 级别',
            align: "center",
            dataIndex: 'sort'
          },
          {
            title: ' 是否为默认',
            align: "center",
            dataIndex: 'isDefault',
            scopedSlots: {customRender: 'isDefault'},
          },
          {
            title: '图标',
            align: "center",
            dataIndex: 'logoAddr',
            scopedSlots: {customRender: 'logoAddr'},
          },
          {
            title: '升级条件',
            align: "center",
            dataIndex: 'upgradeCondition'
          },
          {
            title: '分红资金占比%',
            align: "center",
            dataIndex: 'participation'
          },
          {
            title: '称号特权',
            align: "center",
            dataIndex: 'privilege'
          },
          {
            title: '称号资金开关',
            align: "center",
            dataIndex: 'isOpenMoney',
            scopedSlots: {customRender: 'isOpenMoney'},
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: 'status'},
          },
          {
            title: '停用说明',
            align: "center",
            dataIndex: 'closeExplain'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '创建者',
            align: "center",
            dataIndex: 'createBy'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '更新者',
            align: "center",
            dataIndex: 'updateBy'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: 'right',
            width: 230,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/memberDesignation/memberDesignation/list",
          delete: "/memberDesignation/memberDesignation/delete",
          deleteBatch: "/memberDesignation/memberDesignation/deleteBatch",
          exportXlsUrl: "memberDesignation/memberDesignation/exportXls",
          importExcelUrl: "memberDesignation/memberDesignation/importExcel",
          deleteAndExplain: "memberDesignation/memberDesignation/deleteAndExplain",//删除and说明(id,delExplain)
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getAvatarView: function (mainPicture) {
        if (mainPicture) {
          return this.url.imgerver + "/" + Object.values(JSON.parse(mainPicture))[0];
        } else {
          return ''
        }
      },
      switchChange(value,record){
       if(value){
         //开
         this.$refs.modalForm2.showStartTitleFund(record);
       }else{
         //关
         this.$refs.modalForm2.showStopTitleFund(record);
       }
      },
      //展示停用
      showStopStatus(record = {}){
        this.$refs.modalForm2.showModalStopStatus(record);
      },
      showStartStatus(record = {}){
        this.$refs.modalForm2.showStartStatus(record);
      },
      showDelete(record = {}){
        this.$refs.modalForm2.showDelete(record);
      },
      stuatusChangeOk(){
        this.loadData()
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam, this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime;
        delete param.updateTime;
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin = dateString[0];
        this.queryParam.createTime_end = dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.updateTime_begin = dateString[0];
        this.queryParam.updateTime_end = dateString[1];
      },
    }
  }
</script>
<style scoped>

</style>