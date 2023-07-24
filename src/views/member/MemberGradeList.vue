<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="等级编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="等级名称">
              <a-input placeholder="请输入" v-model="queryParam.gradeName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status"    placeholder="请选择"     style="margin-right: 10px;">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option  :value="0">停用</a-select-option>
                <a-select-option  :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('会员等级')">导出</a-button>
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
        :scroll="{x:1500}"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="gradeLogo" slot-scope="text, record,index">
            <img class="clickShowImage" :preview="'gradeLogo' + index" v-if="record.gradeLogo " :src="getAvatarView(record.gradeLogo)" alt="">
            <a-avatar shape="square" v-else="!record.gradeLogo" :src="getAvatarView(record.gradeLogo)" icon="user"/>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status==0">停用</span>
            <span shape="square" v-if="record.status==1">启用</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical"/>
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
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
    <memberGrade-modal ref="modalForm" @ok="modalFormOk"></memberGrade-modal>
    <member-grade-list-stop-or-start-modal ref="modalForm2" @ok="stuatusChangeOk">

    </member-grade-list-stop-or-start-modal>
  </a-card>
</template>

<script>
  import MemberGradeModal from './modules/MemberGradeModal'
  import memberGradeListStopOrStartModal from './modules/memberGradeListStopOrStartModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  export default {
    name: "MemberGradeList",
    mixins: [JeecgListMixin],
    components: {
      MemberGradeModal,
      memberGradeListStopOrStartModal
    },
    data () {
      return {
        description: '会员等级管理页面',
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
            title: '等级编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '等级名称',
            align: "center",
            dataIndex: 'gradeName'
          },
          {
            title: '等级图标',
            align: "center",
            dataIndex: 'gradeLogo',
            scopedSlots: {customRender: 'gradeLogo'},
          },
          {
            title: '级别',
            align: "center",
            dataIndex: 'sort'
          },
          {
            title: '升级条件',
            align: "center",
            dataIndex: 'gradeCondition'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            scopedSlots: {customRender: "status"}
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
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/memberGrade/memberGrade/list",
          delete: "/memberGrade/memberGrade/delete",
          deleteBatch: "/memberGrade/memberGrade/deleteBatch",
          exportXlsUrl: "memberGrade/memberGrade/exportXls",
          importExcelUrl: "memberGrade/memberGrade/importExcel",
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
      //展示停用
      showStopStatus(record = {}){
        this.$refs.modalForm2.showModalStopStatus(record);
      },
      showStartStatus(record = {}){
        this.$refs.modalForm2.showStartStatus(record);
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