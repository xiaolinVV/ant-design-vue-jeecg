<!--兑换券列表-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="兑换券id">
              <a-input placeholder="" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="兑换券名称">
              <a-input placeholder="" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <!--<a-col :md="8" :sm="8">
            <a-form-item label="核销门店">
              <a-input placeholder="" v-model="queryParam.year"></a-input>
            </a-form-item>
          </a-col>-->

          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">停用</a-select-option>
                <a-select-option value="1">启动</a-select-option>
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
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="兑换方式">
              <a-select v-model="queryParam.certificateType" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">可兑换的商品全部兑换</a-select-option>
                <a-select-option value="1">可兑换的商品任选一个</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <!-- <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addTemplate(1)" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset" icon="reload">重置</a-button>
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('兑换券')">导出</a-button>-->
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <!--<a-button type="primary" icon="import">导入</a-button>-->
      </a-upload>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel">
            <a-icon type="delete" />
            删除
          </a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作
          <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择
        <a style="font-weight: 600">{{ selectedRowKeys.length }}</a
        >项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :columns="columns"
        :scroll="{ x: 3000 }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="vouchersWay" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.vouchersWay == 0">{{ record.startTime }}~{{ record.endTime }}</span>
            <span shape="square" v-if="record.vouchersWay == 1"
              >领券当日起{{ record.disData }}{{ record.monad }}内</span
            >
            <span shape="square" v-if="record.vouchersWay == 2"
              >领券次日起{{ record.disData }}{{ record.monad }}内</span
            >
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启动</span>
          </div>
        </template>
        <template slot="isWarn" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isWarn == 0">不提醒</span>
            <span shape="square" v-if="record.isWarn == 1">过期前{{ record.warnDays }}提醒</span>
          </div>
        </template>
        <template slot="aboveBelowUse" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.aboveUse == 1">线上核销<br/></span>
            <span shape="square" v-if="record.belowUse == 1">线下核销</span>
          </div>
        </template>
        <template slot="isGive" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isGive == 0">不支持</span>
            <span shape="square" v-if="record.isGive == 1">支持</span>
          </div>
        </template>
        <template slot="goodQuantity" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.id)">{{ record.goodQuantity }}件</a>
          </div>
        </template>
        <template slot="certificateType" slot-scope="text, record, index">
          <div v-if="record.certificateType == 1">
            可兑换的商品任选一个
          </div>
          <div v-else>
            可兑换的商品全部兑换
          </div>
        </template>

        <template slot="storeQuantity" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a v-if="record.storeQuantity == 0">全平台</a>
            <a @click="showStoreInfo(record.id)" v-if="record.storeQuantity != 0">{{ record.storeQuantity }}</a>
          </div>
        </template>
        <template slot="isNomal" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 1">付费券</span>
            <span v-if="record.isNomal == 0">活动券</span>
          </div>
        </template>
        <template slot="certificateGet" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span>{{ record.certificateGet }}/{{ record.total - record.certificateGet }}</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">排序</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id)">启用</a>
          <a-divider type="vertical" />
          <a @click="addTemplate(2, record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="copyAddress(record.id)">复制地址</a>
          <a-divider v-if="record.status == 1" type="vertical" />

          <!-- <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a> -->
          <!-- <a-menu slot="overlay"> -->
          <!-- <a-menu-item> -->
          <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <!-- </a-menu-item> -->
          <!-- </a-menu> -->
          <!-- </a-dropdown> -->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingCertificate-modal ref="modalForm" @ok="modalFormOk"></marketingCertificate-modal>
    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingCertificateStoreModal ref="AppMarketingCertificateStoreModal"></AppMarketingCertificateStoreModal>
    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用券后，投放渠道将不再继续投放，但买家之前领取的优惠券，在可用时间内还能继续使用。"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="id" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="stopExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
  </a-card>
</template>

<script>
import MarketingCertificateModal from './modules/MarketingCertificateModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import AppMarketingCertificateGoodModal from './modules/AppMarketingCertificateGoodModal'
import AppMarketingCertificateStoreModal from './modules/AppMarketingCertificateStoreModal'
export default {
  name: 'MarketingCertificateList',
  mixins: [JeecgListMixin],
  inject: ['rush'],
  components: {
    MarketingCertificateModal,
    AppMarketingCertificateGoodModal,
    AppMarketingCertificateStoreModal
  },
  data() {
    return {
      description: '兑换券管理页面',
      marketingCertificateUrl: '',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '兑换券id',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '兑换券名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '用券时间',
          align: 'center',
          dataIndex: 'vouchersWay',
          scopedSlots: { customRender: 'vouchersWay' }
        },
        {
          title: '兑换商品',
          align: 'center',
          dataIndex: 'goodQuantity',
          scopedSlots: { customRender: 'goodQuantity' }
        },
        {
          title: '兑换方式',
          align: 'center',
          dataIndex: 'certificateType',
          scopedSlots: { customRender: 'certificateType' }
        },
        {
          title: '核销门店',
          align: 'center',
          dataIndex: 'storeQuantity',
          scopedSlots: { customRender: 'storeQuantity' }
        },
        {
          title: '券类型',
          align: 'center',
          dataIndex: 'isNomal',
          scopedSlots: { customRender: 'isNomal' }
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        },
        {
          title: '推广佣金',
          align: 'center',
          dataIndex: 'promoteCommission'
        },
        {
          title: '核销方式',
          align: 'center',
          dataIndex: 'aboveBelowUse',
          scopedSlots: { customRender: 'aboveBelowUse' }
        },

        {
          title: '核销奖励',
          align: 'center',
          dataIndex: 'theReward'
        },
        {
          title: '使用人限制',
          align: 'center',
          dataIndex: 'userRestrict_dictText'
        },
        {
          title: '赠送设置',
          align: 'center',
          dataIndex: 'isGive',
          scopedSlots: { customRender: 'isGive' }
        },
        {
          title: '过期提醒',
          align: 'center',
          dataIndex: 'isWarn',
          scopedSlots: { customRender: 'isWarn' }
        },
        {
          title: '已领取/剩余',
          align: 'center',
          dataIndex: 'certificateGet',
          scopedSlots: { customRender: 'certificateGet' }
        },
        {
          title: '已使用',
          align: 'center',
          dataIndex: 'certificateUse'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '更新者',
          align: 'center',
          dataIndex: 'updateBy'
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 300,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingCertificate/marketingCertificate/findMarketingCertificate',
        delete: '/marketingCertificate/marketingCertificate/delete',
        deleteBatch: '/marketingCertificate/marketingCertificate/deleteBatch',
        exportXlsUrl: 'marketingCertificate/marketingCertificate/exportXls',
        importExcelUrl: 'marketingCertificate/marketingCertificate/importExcel',
        updateStatusById: 'marketingCertificate/marketingCertificate/updateStatusById',
        getMarketingCertificateUrl: '/marketingCertificate/marketingCertificate/getMarketingCertificateUrl'
      },
      visible: false,
      MarketingDiscountStoreId: '',
      id: '',
      stopExplain: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    //适用商品弹窗
    showGoodInformation(id) {
      this.$refs.AppMarketingCertificateGoodModal.showModalVisible(id)
    },
    showStoreInfo(id) {
      this.$refs.AppMarketingCertificateStoreModal.showModalVisible(id)
    },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.updateTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    },
    //弹窗
    showModal(id) {
      this.id = id
      this.visible = true
      this.stopExplain = ''
    },
    //停用
    hideModal() {
      this.visible = false
      var that = this
      postAction(that.url.updateStatusById, {
        id: this.id,
        stopExplain: this.stopExplain,
        status: '0'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success(res.message)
        }
        this.rush()
      })
    },
    //启用
    updateStatus: function(id) {
      if (!this.url.updateStatusById) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '有效期启用券，将继续在投放渠道发放，未领取过的用户可以领取',
        content: '您确定要启用吗？',
        onOk: function() {
          postAction(that.url.updateStatusById, { id: id, stopExplain: '', status: '1' }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
            that.rush()
          })
        }
      })
    },
    addTemplate(part, item = '') {
      //part 2 编辑  1 添加
      if (part == 2) {
        localStorage.setItem('marketingCertificateData', JSON.stringify(item))
      } else {
        localStorage.removeItem('marketingCertificateData')
      }
      this.$router.push({ path: '/marketing/modules/AddMarketingCertificateModel', query: { part } })
    },
    //复制地址
    copyAddress(id) {
      let that = this
      that.marketingCertificateUrl = ''
      let clipBoardContent = ''
      that.getMarketingDiscountUrl(id)
    },
    //复制地址调用方法
    getMarketingDiscountUrl(id) {
      let that = this
      that.marketingCertificateUrl = ''
      getAction(this.url.getMarketingCertificateUrl, { marketingCertificateId: id }).then(res => {
        if (res.success) {
          // debugger
          that.marketingCertificateUrl = res.result
          that.$nextTick(() => {
            var textArea = document.createElement('textarea')
            textArea.style.position = 'fixed'
            textArea.style.top = '0'
            textArea.style.left = '0'
            textArea.style.width = '2em'
            textArea.style.height = '2em'
            textArea.style.padding = '0'
            textArea.style.border = 'none'
            textArea.style.outline = 'none'
            textArea.style.boxShadow = 'none'
            textArea.style.background = 'transparent'
            textArea.value = that.marketingCertificateUrl
            document.body.appendChild(textArea)
            textArea.select()
            try {
              var successful = document.execCommand('copy')
              var msg = successful ? '成功复制到剪贴板' : '该浏览器不支持点击复制到剪贴板'
              this.$message.success(msg)
            } catch (err) {
              // alert('该浏览器不支持点击复制到剪贴板');
              this.$message.success('该浏览器不支持点击复制到剪贴板')
            }
            document.body.removeChild(textArea)
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
.table-operator {
  margin-bottom: 10px;
  button {
    margin-right: 8px;
  }
}
</style>
