<!--礼包管理-->
<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="礼包名称">
              <a-input placeholder="请输入" v-model="queryParam.giftName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="购买人限制">
              <j-dict-select-tag v-model="queryParam.buyLimit" placeholder="请选择状态" dictCode="member_type" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
              <a-form-item label="礼包发行时间">
                <a-range-picker
                  style="width: 100%"
                  v-model="queryParam.bagTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange1"
                  @ok="onDateOk"
                />
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
      <!--<a-button type="primary" icon="download"  :loading="exportLoading"  @click="handleExportXls('礼包管理')">导出</a-button>
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
        :scroll="{ x: 3500 }"
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="startTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square">{{ record.startTime }}~{{ record.endTime }}</span>
          </div>
        </template>
        <!--        giftExplain-->
        <span slot="giftExplain" slot-scope="text, record">
          <a href="javascript:;" @click="showContentModal(record)">{{ text }}</a>
        </span>
        <template slot="viewScope" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.viewScope == 0">指定门店</span>
            <span v-if="record.viewScope == 1">全平台</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.status == 0">停用</span>
            <span v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="updateTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.updateTime != null">{{ record.updateTime }}</span>
            <span v-if="record.updateTime == null">{{ record.createTime }}</span>
          </div>
        </template>
        <template slot="updateBy" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span v-if="record.updateBy != null">{{ record.updateBy }}</span>
            <span v-if="record.updateBy == null">{{ record.createBy }}</span>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
          <a @click="addTemplate(2, record)">编辑</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status == 0" @click="updateStatus(record.id)">启用</a>


            <a-divider type="vertical" />
           <a-dropdown>
            <a class="ant-dropdown-link">
              更多 <a-icon type="down"/>
            </a>
             <a-menu slot="overlay">
                 <a-menu-item>
               <a @click="marketingGiftRoutingListClick(record)">分账设置</a>
              </a-menu-item>
                 <a-menu-item>
               <a @click="marketingGiftQrcodeClick(record)">礼包二维码</a>
              </a-menu-item>
                 <a-menu-item>
               <a v-if="record.status == 1" @click="copyAddress(record.id)">复制地址</a>
              </a-menu-item>
                  <a-menu-item v-if="record.status == 1">
                 <a @click="showDelExplain(record.id)">删除</a>
              </a-menu-item>
             </a-menu>
           </a-dropdown>

        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingGiftBag-modal ref="modalForm" @ok="modalFormOk"></marketingGiftBag-modal>
    <MarketingGiftPackageModal ref="MarketingGiftPackageModal"></MarketingGiftPackageModal>
    <marketing-gift-qrcode ref="marketingGiftQrcodeModal" @ok="modalFormOk"></marketing-gift-qrcode>
    <!--礼包分账-->
    <marketing-gift-routing-list ref="marketingGiftRoutingList"></marketing-gift-routing-list>
    <!--启动停用弹窗-->
    <div>
      <a-modal
        title="停用礼包后，买家之前领取的礼包，在可用时间内还能继续使用，买家无法购买。"
        v-model="visible"
        @ok="hideModal()"
        okText="确认"
        cancelText="取消"
      >
        <input style="display: none" :value="BagId" placeholder="id" />
        <p>您确定要停用吗？</p>
        <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
    <!--备注弹窗-->
    <div>
      <a-modal title="删除说明" v-model="visible1" @ok="deleteById()" okText="确定" cancelText="取消">
        <input style="display: none" :value="BagId" placeholder="id" />
        <a-textarea placeholder="删除说明" v-model="delExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a-modal>
      <br />
      <br />
    </div>
  </a-card>
</template>

<script>
import MarketingGiftBagModal from './modules/MarketingGiftBagModal'
import MarketingGiftPackageModal from './modules/MarketingGiftPackageModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
import MarketingGiftQrcode from './modules/MarketingGiftQrcode'
import MarketingGiftRoutingList from './MarketingGiftRoutingList'
export default {
  name: 'MarketingGiftBagList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGiftBagModal,
    MarketingGiftPackageModal,
    MarketingGiftQrcode,
    MarketingGiftRoutingList
  },
  data() {
    return {
      description: '礼包管理管理页面',
      marketingGiftBagUrl: '',
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          fixed: 'left',
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '礼包名称',
          align: 'center',
          dataIndex: 'giftName'
        },
        {
          title: '礼包价格',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '礼包内容',
          align: 'center',
          dataIndex: 'giftExplain',
          scopedSlots: { customRender: 'giftExplain' }
        },
        {
          title: '分销佣金',
          align: 'center',
          dataIndex: 'distributionCommission'
        },
        {
          title: '分销福利金',
          align: 'center',
          dataIndex: 'promoterWelfarePayments'
        },
        {
          title: '推广奖励',
          align: 'center',
          dataIndex: 'promoterReward'
        },
        {
          title: '二级推广人奖励',
          align: 'center',
          dataIndex: 'promoterRewardTwo'
        },
        {
          title: '归属店铺奖励',
          align: 'center',
          dataIndex: 'ownershipShopsReward'
        },
        {
          title: '渠道店铺奖励',
          align: 'center',
          dataIndex: 'channelShopsReward'
        },
        {
          title: '礼包可见范围',
          align: 'center',
          dataIndex: 'viewScope',
          scopedSlots: { customRender: 'viewScope' }
        },
        {
          title: '发行量',
          align: 'center',
          dataIndex: 'repertory'
        },
        {
          title: '购买人限制',
          align: 'center',
          dataIndex: 'buyLimit_dictText'
        },
        {
          title: '每人限购买次数',
          align: 'center',
          dataIndex: 'limitTimes'
        },
        {
          title: '礼包发行时间',
          align: 'center',
          dataIndex: 'startTime',
          scopedSlots: { customRender: 'startTime' }
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '停用说明',
          align: 'center',
          dataIndex: 'closeExplain'
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
          dataIndex: 'updateBy',
          scopedSlots: { customRender: 'updateBy' }
        },
        {
          title: '更新时间',
          align: 'center',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 180,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        list: '/marketingGiftBag/marketingGiftBag/findMarketingGifiBagPageList',
        deleteAndDelExplain: '/marketingGiftBag/marketingGiftBag/deleteAndDelExplain',
        deleteBatch: '/marketingGiftBag/marketingGiftBag/deleteBatch',
        exportXlsUrl: 'marketingGiftBag/marketingGiftBag/exportXls',
        importExcelUrl: 'marketingGiftBag/marketingGiftBag/importExcel',
        updateStatus: '/marketingGiftBag/marketingGiftBag/updateStatus',
        getMarketingGiftBagUrl: '/marketingGiftBag/marketingGiftBag/getMarketingGiftBagUrl'

        // giftContent:"/marketingGiftBag/marketingGiftBag/updateStatus/giftContent",//礼包弹窗接口 传入数据(marketingGiftBagId)
      },
      visible: false,
      visible1: false,
      BagId: '', //传递id
      closeExplain: '', //停用说明
      delExplain: ''
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    getAction(this.url.list).then(res => {
      if (res.success) {
      }
    })
  },
  methods: {
    /**查询栏时间区间查询*/
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter)
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      delete param.createTime // 时间参数不传递后台
      delete param.bagTime // 时间参数不传递后台
      return filterObj(param)
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.startTime_begin = dateString[0]
      this.queryParam.endTime_end = dateString[1]
    },
    getAvatarView: function(headPortrait) {
      return this.url.imgerver + '/' + headPortrait
    },
    //弹窗
    showModal(id) {
      this.BagId = id
      this.visible = true
      this.stopExplain = ''
    },
    showContentModal(record) {
      this.$refs.MarketingGiftPackageModal.totalModal(record)
    },
    showDelExplain(id) {
      this.BagId = id
      this.visible1 = true
      this.delExplain = ''
    },
    //删除说明弹窗
    deleteById() {
      this.visible1 = false
      var that = this
      deleteAction(that.url.deleteAndDelExplain, {
        id: this.BagId,
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
      postAction(that.url.updateStatus, {
        id: this.BagId,
        closeExplain: this.closeExplain,
        status: '0'
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
      if (!this.url.updateStatus) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      var that = this
      this.$confirm({
        title: '有效期启用券，将继续在投放渠道发放，未领取过的用户可以领取',
        content: '您确定要启用吗？',
        onOk: function() {
          postAction(that.url.updateStatus, { id: id, closeExplain: '', status: '1' }).then(res => {
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
    addTemplate(part, item = '') {
      //part 2 编辑  1 添加
      if (part == 2) {
        localStorage.setItem('marketingGiftbagData', JSON.stringify(item))
      } else {
        localStorage.removeItem('marketingGiftbagData')
      }
      this.$router.push({ path: '/marketing/modules/AddMarketingGiftbagModel', query: { part } })
    },

    //复制地址
    copyAddress(id) {
      let that = this
      that.marketingGiftBagUrl = ''
      let clipBoardContent = ''
      that.getGoodUrlss(id)
    },
    //复制地址调用方法
    getGoodUrlss(id) {
      let that = this
      that.marketingGiftBagUrl = ''
      getAction(this.url.getMarketingGiftBagUrl, { marketingGiftBagId: id }).then(res => {
        if (res.success) {
          // debugger
          that.marketingGiftBagUrl = res.result
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
            textArea.value = that.marketingGiftBagUrl
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
    },
    marketingGiftQrcodeClick(record){
      this.$refs.marketingGiftQrcodeModal.showMarketingGiftQrcodeModal(record);
    },
    marketingGiftRoutingListClick(record){
      this.$refs.marketingGiftRoutingList.show(record);
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
