<!--平台优惠券-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="优惠券id">
              <a-input placeholder="" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="优惠券名称">
              <a-input placeholder="" v-model="queryParam.name"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="投放渠道">
              <!--下拉框-->
              <a-select v-model="queryParam.marketingChannelId" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">免费领取</a-select-option>
                <a-select-option value="1">分享后领取</a-select-option>
                <a-select-option value="2">下单后领取</a-select-option>
                <a-select-option value="3">扫码领取</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <!--下拉框-->
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
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="addTemplate(1)" type="primary" icon="plus">添加</a-button>
      <!--<a-button type="primary" icon="download" @click="handleExportXls('优惠券')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl"
                @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>-->
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
        bordered
        :scroll="{ x: 2600 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="mainPicture" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(text)" icon="user" />
          </div>
        </template>
        <template slot="isThreshold" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isThreshold == 0">无门槛</span>
            <span shape="square" v-if="record.isThreshold == 1">满{{ record.completely }}元</span>
          </div>
        </template>
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
        <template slot="isGive" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isGive == 0">不支持</span>
            <span shape="square" v-if="record.isGive == 1">支持</span>
          </div>
        </template>
        <template slot="isWarn" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isWarn == 0">不提醒</span>
            <span shape="square" v-if="record.isWarn == 1">过期前{{ record.warnDays }}天提醒</span>
          </div>
        </template>
        <template slot="isGetThe" slot-scope="text, record, index">
          <div class="anty-img-wrap" v-if="record.isNomal == 0">
            <span shape="square" v-if="record.isGetThe == 0">不支持</span>
            <span shape="square" v-if="record.isGetThe == 1">支持</span>
          </div>
          <div class="anty-img-wrap" v-if="record.isNomal == 1">
            <span shape="square">-</span>
          </div>
        </template>
        <template slot="total" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{ record.statusGet }}/{{ record.total - record.statusGet }}</span>
          </div>
        </template>
        <template slot="isUniqueness" slot-scope="text, record, index">
          <div v-if="text == 1">
            唯一选项
          </div>
          <div v-else>
            -
          </div>
        </template>
        <template slot="isDistribution" slot-scope="text, record, index">
          <div v-if="text == 1">
            参与分销
          </div>
          <div v-else>
            不参与分销
          </div>
        </template>
        <template slot="shopTotal" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.id)">适用商品{{ record.shopTotal }}件</a>
          </div>
        </template>
        <template slot="subtract" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">减{{ record.subtract }}元</span>
          </div>
        </template>
        <template slot="channelInfo" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a v-if="record.isNomal == 0">{{ record.channelInfo }}</a>
            <a v-if="record.isNomal == 1">-</a>
          </div>
        </template>
        <template slot="getRestrict_dictText" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 1">-</span>
            <span v-if="record.isNomal == 0">{{ record.getRestrict_dictText }}</span>
          </div>
        </template>
        <template slot="againGet_dictText" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 1">-</span>
            <span v-if="record.isNomal == 0">{{ record.againGet_dictText }}</span>
          </div>
        </template>
        <template slot="isNomal" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.isNomal == 1">活动券</span>
            <span v-if="record.isNomal == 0">普通券</span>
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
          <a @click="showDelExplain(record.id)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingDiscount-modal ref="modalForm" @ok="modalFormOk"></marketingDiscount-modal>
    <AppMarketingGoodModal ref="AppMarketingGoodModal"></AppMarketingGoodModal>
    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用券后，投放渠道将不再继续投放，但买家之前领取的优惠券，在可用时间内还能继续使用。"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="MarketingDiscountStoreId" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="stopExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
    <!--备注弹窗-->
    <div>
      <a-modal title="删除说明" v-model="visible1" @ok="deleteById()" okText="确定" cancelText="取消">
        <input style="display: none" :value="MarketingDiscountStoreId" placeholder="id" />
        <a-textarea placeholder="删除说明" v-model="delExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
  </a-card>
</template>

<script>
import MarketingDiscountModal from './modules/MarketingDiscountModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { deleteAction, getAction, downFile } from '@/api/manage'
import Vue from 'vue'
import { filterObj } from '@/utils/util'
import AppMarketingGoodModal from './modules/AppMarketingGoodModal'
export default {
  name: 'MarketingDiscountListTerrace',
  mixins: [JeecgListMixin],
  components: {
    MarketingDiscountModal,
    AppMarketingGoodModal
  },
  data() {
    return {
      description: '优惠券管理页面',
      marketingDiscountUrl: '',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 30,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '优惠券id',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '优惠券名称',
          align: 'center',
          dataIndex: 'name'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '使用门槛',
          align: 'center',
          dataIndex: 'isThreshold',
          scopedSlots: { customRender: 'isThreshold' }
        },
        {
          title: '优惠内容',
          align: 'center',
          dataIndex: 'subtract',
          scopedSlots: { customRender: 'subtract' }
        },
        {
          title: '用券时间',
          align: 'center',
          dataIndex: 'vouchersWay',
          scopedSlots: { customRender: 'vouchersWay' }
        },
        {
          title: '适用商品',
          align: 'center',
          dataIndex: 'shopTotal',
          scopedSlots: { customRender: 'shopTotal' }
        },
        {
          title: '券类型',
          align: 'center',
          dataIndex: 'isNomal',
          scopedSlots: { customRender: 'isNomal' }
        },
        {
          title: '使用人限制',
          align: 'center',
          dataIndex: 'userRestrict_dictText'
        },
        {
          title: '领取人限制',
          align: 'center',
          dataIndex: 'getRestrict_dictText',
          scopedSlots: { customRender: 'getRestrict_dictText' }
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
          title: '投放渠道',
          align: 'center',
          dataIndex: 'channelInfo',
          scopedSlots: { customRender: 'channelInfo' }
        },
        {
          title: '无券可再领取',
          align: 'center',
          dataIndex: 'isGetThe',
          scopedSlots: { customRender: 'isGetThe' }
        },
        {
          title: '再次领取条件',
          align: 'center',
          dataIndex: 'againGet_dictText',
          scopedSlots: { customRender: 'againGet_dictText' }
        },
        {
          title: '已领取/剩余',
          align: 'center',
          dataIndex: 'total',
          scopedSlots: { customRender: 'total' }
        },
        {
          title: '已使用',
          align: 'center',
          dataIndex: 'statusUse'
        },
        {
          title: '使用方式',
          align: 'center',
          dataIndex: 'isUniqueness',
          scopedSlots: { customRender: 'isUniqueness' }
        },
        {
          title: '适用商品分销',
          align: 'center',
          dataIndex: 'isDistribution',
          scopedSlots: { customRender: 'isDistribution' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
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
        list: '/marketingDiscount/marketingDiscount/getMarketingDiscountList',
        delete: '/marketingDiscount/marketingDiscount/delete',
        deleteBatch: '/marketingDiscount/marketingDiscount/deleteBatch',
        exportXlsUrl: 'marketingDiscount/marketingDiscount/exportXls',
        importExcelUrl: 'marketingDiscount/marketingDiscount/importExcel',
        updateStatusById: 'marketingDiscount/marketingDiscount/updateStatusById',
        delEXplainById: 'marketingDiscount/marketingDiscount/delEXplainById',
        getMarketingDiscountUrl: '/marketingDiscount/marketingDiscount/getMarketingDiscountUrl',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      visible: false,
      visible1: false,
      MarketingDiscountStoreId: '',
      stopExplain: '',
      delExplain: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    getAvatarView: function(mainPicture) {
      if (mainPicture) {
        return this.url.imgerver + '/' + JSON.parse(mainPicture)[0]
      }
      return ''
    },
    // /**查询栏时间区间查询*/
    getQueryParams() {
      console.log(this.queryParam.createTime)
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
    onDateOk(value) {
      console.log(value)
    },

    //弹窗
    showModal(id) {
      this.MarketingDiscountStoreId = id
      this.visible = true
      this.stopExplain = ''
    },
    showDelExplain(id) {
      this.MarketingDiscountStoreId = id
      this.visible1 = true
      this.delExplain = ''
    },
    addTemplate(part, item = '') {
      //part 2 编辑  1 添加
      console.log(item)
      // debugger;
      if (part == 2) {
        localStorage.setItem('marketingDiscountListTerraceData', JSON.stringify(item))
      } else {
        localStorage.removeItem('marketingDiscountListTerraceData')
      }
      this.$router.push({ path: '/marketing/modules/AddMarketingDiscountModel', query: { part } })
    },

    //删除说明弹窗
    deleteById() {
      this.visible1 = false
      var that = this
      deleteAction(that.url.delEXplainById, {
        id: this.MarketingDiscountStoreId,
        delExplain: this.delExplain
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },

    //停用
    hideModal() {
      this.visible = false
      var that = this
      getAction(that.url.updateStatusById, {
        id: this.MarketingDiscountStoreId,
        stopExplain: this.stopExplain
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
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
          getAction(that.url.updateStatusById, { id: id, stopExplain: '' }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData()
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    /**
     * 弹窗
     */
    //适用商品弹窗
    showGoodInformation(id) {
      this.$refs.AppMarketingGoodModal.showModalVisible(id)
    },

    //复制地址
    copyAddress(id) {
      let that = this
      that.marketingDiscountUrl = ''
      let clipBoardContent = ''
      that.getMarketingDiscountUrl(id)
    },
    //复制地址调用方法
    getMarketingDiscountUrl(id) {
      let that = this
      that.marketingDiscountUrl = ''
      getAction(this.url.getMarketingDiscountUrl, { marketingDiscountId: id }).then(res => {
        if (res.success) {
          // debugger
          that.marketingDiscountUrl = res.result
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
            textArea.value = that.marketingDiscountUrl
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
.operation {
	display: flex;
	justify-content: space-around;

/*字体大小*/
	font-size: 12px;
}
.table-operator {
	margin-bottom: 10px;
	button {
		margin-right: 8px;
	}
}

</style>
