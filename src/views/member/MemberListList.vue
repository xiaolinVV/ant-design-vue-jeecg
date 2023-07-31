<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="用户编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="推广码">
              <a-input placeholder="请输入" v-model="queryParam.promotionCode"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="性别">
                <j-dict-select-tag  v-model="queryParam.sex"  placeholder="请选择性别"
                                    dictCode="sex"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员类型">
                <j-dict-select-tag  v-model="queryParam.memberType"  placeholder="请选择会员类型"
                                    dictCode="member_type"/>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="推广人">
                <a-input placeholder="请输入" v-model="queryParam.promoterName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="归属店铺">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="是否开店">
                &lt;!&ndash;下拉框&ndash;&gt;
                <a-select v-model = "queryParam.isOpenStore" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">否</a-select-option>
                  <a-select-option value="1">是</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="创建时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="开通vip时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.vipTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员等级">
                <a-select v-model="queryParam.memberGradeId" placeholder="请选择会员等级">
                  <a-select-option :value="item.id" v-for="(item,index) in membershipLevelOptions" :key="item.id">
                    {{item.gradeName}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="会员称号">
                <a-select v-model="queryParam.memberDesignationId" placeholder="请选择会员称号">
                  <a-select-option :value="item.memberDesignationId" v-for="(item,index) in membershipTitleOptions" :key="item.memberDesignationId">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="8">
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
      <!--<a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('会员列表')">导出</a-button>-->

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
    <div >

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:3500}"
        rowKey="id"
        :columns="columns"
        bordered
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="gradeName" slot-scope="text,record">
          <a @click="gradeClick(record)">【{{text}}】</a>
        </template>
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait">
        </template>
        <template slot="qrcodeAddr" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'qrcodeAddr' + index"  :src="ssAddressView(record.qrcodeAddr)" >
        </template>
        <span slot="action" slot-scope="text, record" v-if="record.isPlatform==1" style="display: flex;justify-content: space-around;align-items: center;">
          <a v-if="record.status==1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status==0" @click="updateStatus(record.id)">启用</a>
          <a @click="showModal2(record,'修改推广人')">修改推广人</a>
          <a @click="showModal2(record,'修改归属店铺')">修改归属店铺</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <memberList-modal ref="modalForm" @ok="modalFormOk"></memberList-modal>
    <member-list-list-action-modal ref="modalForm2"></member-list-list-action-modal>
    <!--启动停用弹窗-->
    <div>
      <a-modal title="停用用户后，用户将无法访问商城" v-model="visible" @ok="hideModal()" okText="确认" cancelText="取消">
        <input style="display: none" :value="memberId" placeholder="id"/>
        <p>您确定要停用吗？</p>
        <a-textarea
          placeholder="停用原因"
          v-model="stopRemark"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </a-modal>
      <br/>
      <br/>
    </div>
    <member-grade-settting-modal ref="memberGradeSetttingModal" @ok="modalFormOk"></member-grade-settting-modal>
  </a-card>
</template>

<script>
  import MemberListModal from './modules/MemberListModal'
  import MemberListListActionModal from './modules/MemberListListActionModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {filterObj} from '@/utils/util';
  import {getAction} from '@/api/manage'
  import MemberGradeSetttingModal from'./modules/MemberGradeSetttingModal'
  export default {
    name: "MemberListList",
    mixins: [JeecgListMixin],
    components: {
      MemberListModal,
      MemberListListActionModal,
      MemberGradeSetttingModal
    },
    data () {
      return {
        description: '会员列表管理页面',
        queryParam: {
          createTime: [],
          vipTime: [],
        },
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
            title: '会员编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
          {
            title: '手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '性别',
            align: "center",
            dataIndex: 'sex_dictText',
          },
          {
            title: '地区',
            align: "center",
            dataIndex: 'areaAddr'
          },
          {
            title: '会员类型',
            align: "center",
            dataIndex: 'memberType_dictText',
          },
          {
            title: '会员等级',
            align: "center",
            dataIndex: 'gradeName',
            scopedSlots:{customRender:'gradeName'}
          },
          {
            title: '会员称号',
            align: "center",
            width: 300,
            dataIndex: 'designationName',
          },
          {
            title: '福利金',
            align: "center",
            dataIndex: 'welfarePayments'
          },
          {
            title: '钱包余额',
            align: "center",
            dataIndex: 'balance'
          },
          {
            title: '可用券',
            align: "center",
            dataIndex: 'discount'
          },
          {
            title: '商品收藏',
            align: "center",
            dataIndex: 'goodsCollection'
          },
          {
            title: '店铺关注',
            align: "center",
            dataIndex: 'attentionStore'
          },
          {
            title: '浏览记录',
            align: "center",
            dataIndex: 'browsingHistory'
          },
          {
            title: '推广码',
            align: "center",
            dataIndex: 'promotionCode'
          },
          {
            title: '推广人',
            align: "center",
            dataIndex: 'promoterName'
          },
          {
            title: '归属店铺',
            align: "center",
            dataIndex: 'storeName'
          },
          {
            title: '二维码',
            align: "center",
            dataIndex: 'qrcodeAddr',
            scopedSlots: {customRender: "qrcodeAddr"}
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '开通vip的时间',
            align: "center",
            dataIndex: 'vipTime'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'statusName',
          },
          {
            title: '停用说明',
            align: "center",
            dataIndex: 'stopRemark'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            // fixed: 'right',
            width:250,
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          list: "/memberList/memberList/findMemberList",
          delete: "/memberList/memberList/delete",
          deleteBatch: "/memberList/memberList/deleteBatch",
          exportXlsUrl: "memberList/memberList/exportXls",
          importExcelUrl: "memberList/memberList/importExcel",
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
          updateStatusById: "memberList/memberList/updateStatusById",
          findMemberGradeList:"memberGrade/memberGrade/findMemberGradeList",//会员等级(memberGradeId)
          memberDesignationNameList:"memberDesignation/memberDesignation/memberDesignationNameList",//会员称号(memberDesignationId)
        },
        visible: false,
        memberId: "",
        stopRemark: "",
        membershipLevelOptions:[], //会员等级
        membershipTitleOptions:[]  //会员称号
      }
    },
    created(){
      getAction(this.url.findMemberGradeList).then(res=>{
        this.membershipLevelOptions = res.result
      })
      getAction(this.url.memberDesignationNameList).then(res=>{
        this.membershipTitleOptions = res.result
      })
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      gradeClick(param){
        console.log(param);
        this.$refs.memberGradeSetttingModal.show({
          memberId:param.id,
          memberGradeId:param.memberGradeId
        });
      },
      //启动停用弹窗
      showModal(id) {
        this.memberId = id;
        this.visible = true;
        this.stopRemark = '';
      },
      //停用
      hideModal() {
        this.visible = false;
        console.log("this.stopRemark=", this.stopRemark)
        var that = this;
        getAction(that.url.updateStatusById, {
          id: this.memberId,
          stopRemark: this.stopRemark
        }).then((res) => {
          if (res.code == 200) {
            that.$message.success(res.message);
            that.loadData();
          } else {

            that.$message.success("修改失败");
          }
        });
      },
      //启用
      updateStatus: function (id) {

        if (!this.url.updateStatusById) {
          this.$message.error("请设置url.updateStatusById!")
          return
        }
        var that = this;
        this.$confirm({
          title: "启用用户后，用户将可以访问商城",
          content: "您确定要启用吗？",
          onOk: function () {
            getAction(that.url.updateStatusById, {id: id, stopRemark: ""}).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.loadData();
                that.onClearSelected();
              } else {
                that.$message.warning(res.message);
              }
            });
          }
        });
      },
      ssAddressView: function (qrcodeAddr) {
        return this.url.imgerver + "/" + qrcodeAddr;
      },
      showModal2(value,title = ''){
        value.modalTitle = title
        this.$refs.modalForm2.open(value)
      },
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        delete param.vipTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.vipTime_begin=dateString[0];
        this.queryParam.vipTime_end=dateString[1];
      },
      onDateOk(value) {
        console.log(value);
      },
    },
  }
</script>
<style>
  /*.ant-modal-content{*/
  /*  height: 40vh;*/
  /*  overflow: scroll;*/
  /*}*/

</style>