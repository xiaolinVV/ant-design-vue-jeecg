
<!--店铺优惠券记录-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="会员手机号">
              <a-input placeholder="请输入" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="请输入" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="券号">
              <a-input placeholder="请输入" v-model="queryParam.qqzixuangu"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="券名称">
                <a-input placeholder="请输入" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <!--下拉框-->
                <j-dict-select-tag v-model="queryParam.status" placeholder="请选择"
                                   dictCode="vouchers_status"/>
              </a-form-item>
            </a-col>
            <!--<a-col :md="6" :sm="8">
              <a-form-item label="领取渠道">
                &lt;!&ndash;下拉框&ndash;&gt;
                <a-select v-model = "queryParam.marketingChannelId" placeholder="请选择">
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option value="0">免费领取</a-select-option>
                  <a-select-option value="1">分享后领取</a-select-option>
                  <a-select-option value="2">下单后领取</a-select-option>
                  <a-select-option value="3">扫码领取</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="适用商品">
                <a-input placeholder="请选择" v-model="queryParam.goodName"></a-input>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="领取时间">
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
              <a-form-item label="使用时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.userTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="赠送时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.sendTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange2"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="店铺名称">
                <a-input placeholder="请输入" v-model="queryParam.storeName"></a-input>
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
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('优惠券记录')">导出</a-button>-->
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
    <div style="">
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a
        style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :scroll="{x:3000}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        bordered
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
            <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait" alt="">
        </template>
        <template slot="isNomal" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 1">活动券</span>
            <span v-if="record.isNomal == 0">普通券</span>
            <span v-if="record.isNomal == 2">折扣券</span>
          </div>
        </template>
        <template slot="preferentialContent" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 2">已使用{{record.discountUseAmount}}元</span>
            <span v-else>{{record.preferentialContent}}</span>
          </div>
        </template>
        <template slot="applyGood" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.marketingDiscountId)">{{record.applyGood}}</a>
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
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingDiscountCoupon-modal ref="modalForm" @ok="modalFormOk"></marketingDiscountCoupon-modal>
    <ApplicableCommodityModal ref="ApplicableCommodityModal"></ApplicableCommodityModal>
  </a-card>
</template>

<script>
  import MarketingDiscountCouponModal from './modules/MarketingDiscountCouponModal'
  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import {deleteAction, getAction, downFile} from '@/api/manage'
  import Vue from 'vue'
  import {filterObj} from '@/utils/util';
  import ApplicableCommodityModal from './modules/ApplicableCommodityModal'
  export default {
    name: "MarketingDiscountCouponList",
    mixins: [JeecgListMixin],
    components: {
      MarketingDiscountCouponModal,
      ApplicableCommodityModal
    },
    data () {
      return {
        description: '优惠券记录管理页面',
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
            title: '头像',
            align: "center",
            dataIndex: 'headPortrait',
            scopedSlots: {customRender: "headPortrait"}
          },
          {
            title: '会员手机号',
            align: "center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: "center",
            dataIndex: 'nickName'
          },
          {
            title: '券号',
            align: "center",
            dataIndex: 'qqzixuangu'
          },
          {
            title: '优惠券名称',
            align: "center",
            dataIndex: 'name'
          },
          {
            title: '券类型',
            align: 'center',
            dataIndex: 'isNomal',
            scopedSlots: { customRender: 'isNomal' }
          },
          {
            title: '优惠券状态',
            align: "center",
            dataIndex: 'status_dictText'
          },
          {
            title: '领取渠道',
            align: "center",
            dataIndex: 'theChannel'
          },
          {
            title: '使用门槛',
            align: "center",
            dataIndex: 'usingThreshold'
          },
          {
            title: '优惠内容',
            align: "center",
            dataIndex: 'preferentialContent',
            scopedSlots: {customRender: "preferentialContent"}
          },
          {
            title: '适用商品',
            align: "center",
            dataIndex: 'applyGood',
            scopedSlots: {customRender: "applyGood"}
          },
          {
            title: '有效期',
            align: "center",
            dataIndex: 'indate'
          },
          {
            title: '领取时间',
            align: "center",
            dataIndex: 'createTime'
          },

          {
            title: '赠送时间',
            align: "center",
            dataIndex: 'giveTime'
          },
          {
            title: '获赠人',
            align: "center",
            dataIndex: 'giveName'
          },
          {
            title: '使用时间',
            align: "center",
            dataIndex: 'userTimes'
          },
          {
            title: '实际抵扣',
            align: "center",
            dataIndex: 'practicalDeduction'
          },
          {
            title: '店铺名称',
            align: "center",
            dataIndex: 'storeName'
          },
         /* {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }*/
        ],
        url: {
          list: "/marketingDiscountCoupon/marketingDiscountCoupon/findDiscountCoupon",
          delete: "/marketingDiscountCoupon/marketingDiscountCoupon/delete",
          deleteBatch: "/marketingDiscountCoupon/marketingDiscountCoupon/deleteBatch",
          exportXlsUrl: "marketingDiscountCoupon/marketingDiscountCoupon/exportXls",
          importExcelUrl: "marketingDiscountCoupon/marketingDiscountCoupon/importExcel",
        },
      }
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      getQueryParams(){
        var param = Object.assign({}, this.queryParam,this.isorter);
        param.field = this.getQueryField();
        param.pageNo = this.ipagination.current;
        param.pageSize = this.ipagination.pageSize;
        delete param.createTime; // 时间参数不传递后台
        delete param.userTime; // 时间参数不传递后台
        delete param.sendTime; // 时间参数不传递后台
        return filterObj(param);
      },
      onDateChange: function (value, dateString) {
        this.queryParam.createTime_begin=dateString[0];
        this.queryParam.createTime_end=dateString[1];
      },
      onDateChange1: function (value, dateString) {
        this.queryParam.userTime_begin=dateString[0];
        this.queryParam.userTime_end=dateString[1];
      },
      onDateChange2: function (value, dateString) {
        this.queryParam.sendTime_begin=dateString[0];
        this.queryParam.sendTime_end=dateString[1];
      },
      getAvatarView: function (headPortrait) {
        return this.url.imgerver + "/" + headPortrait;
      },
      //适用商品弹窗
      showGoodInformation(id){
        this.$refs.ApplicableCommodityModal.showModalVisible(id);
      },
    }
  }
</script>
<style scoped lang="less">

</style>