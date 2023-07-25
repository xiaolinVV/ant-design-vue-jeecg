<!--会员兑换券-->
<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="8" :sm="8">
            <a-form-item label="手机号">
              <a-input placeholder="" v-model="queryParam.phone"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="昵称">
              <a-input placeholder="" v-model="queryParam.nickName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="券号">
              <a-input placeholder="" v-model="queryParam.qqzixuangu"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="8" :sm="8">
              <a-form-item label="兑换券名称">
                <a-input placeholder="" v-model="queryParam.name"></a-input>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="核销门店">
                <a-input placeholder="" v-model="queryParam."></a-input>
              </a-form-item>
            </a-col>-->
            <a-col :md="8" :sm="8">
              <a-form-item label="状态">
                <j-dict-select-tag v-model="queryParam.status" placeholder="请选择"
                                   dictCode="vouchers_status"/>
              </a-form-item>
            </a-col>
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="获取渠道">
                <a-input placeholder="" v-model="queryParam."></a-input>
              </a-form-item>
            </a-col>-->
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="核销人">
                <a-input placeholder="" v-model="queryParam."></a-input>
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
            <!--<a-col :md="8" :sm="8">
              <a-form-item label="使用时间">
                <a-input placeholder="" v-model="queryParam."></a-input>
              </a-form-item>
            </a-col>-->
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
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
      <a-checkbox-group/>
      <!--<a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('发券渠道')">导出</a-button>
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
        :scroll="{x:2500}"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">
        <template slot="headPortrait" slot-scope="text, record, index">
            <img class="clickShowImage" :preview="'headPortrait' + index"  :src="record.headPortrait" alt="">
        </template>
        <template slot="applyGood" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showGoodInformation(record.marketingCertificateId)">{{record.applyGood}}</a>
          </div>
        </template>
        <template slot="storeQuantity" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <a @click="showStoreInfo(record.marketingCertificateId)" v-if="record.storeQuantity !=0 ">{{record.storeQuantity}}</a>
            <a v-if="record.storeQuantity ==0">全平台</a>
          </div>
        </template>
        <span slot="action" slot-scope="text, record">
           <a v-if="record.status==1" @click="showModal(record.id)">停用</a>
          <a v-if="record.status==0" @click="updateStatus(record.id)">启用</a>
          <a-divider type="vertical"/>
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

    <!--启动停用弹窗-->
    <div>
      <a-modal title="停止投放渠道后，用户将无法领取该渠道发放的券" v-model="visible" @ok="hideModal()" okText="确认"
               cancelText="取消">
        <input style="display: none" :value="marketingChannelId" placeholder="id"/>
        <p>您确定要停用吗？</p>
        <a-textarea
          placeholder="停用原因"
          v-model="statusExplain"
          :autosize="{ minRows: 3, maxRows: 6 }"
        />
      </a-modal>
      <br/>
      <br/>
    </div>
    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingCertificateStoreModal ref="AppMarketingCertificateStoreModal"></AppMarketingCertificateStoreModal>
  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { deleteAction, getAction, downFile } from '@/api/manage'
  import Vue from 'vue'
  import { filterObj } from '@/utils/util'
  import AppMarketingCertificateGoodModal from '../marketing/modules/AppMarketingCertificateGoodModal'
  import AppMarketingCertificateStoreModal from '../marketing/modules/AppMarketingCertificateStoreModal'

  export default {
    name: 'MemberCertifareList',
    mixins: [JeecgListMixin],
    components: {
      AppMarketingCertificateGoodModal,
      AppMarketingCertificateStoreModal
    },
    data() {
      return {
        description: '会员兑换券',
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
            title: '头像',
            align: 'center',
            dataIndex: 'headPortrait',
            scopedSlots: { customRender: 'headPortrait' }
          },
          {
            title: '手机号',
            align: 'center',
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align: 'center',
            dataIndex: 'nickName'
          },
          {
            title: '券号',
            align: 'center',
            dataIndex: 'qqzixuangu'
          },
          {
            title: '兑换券名称',
            align: 'center',
            dataIndex: 'name'
          },
          {
            title: '兑换商品',
            align: 'center',
            dataIndex: 'applyGood',
            scopedSlots: { customRender: 'applyGood' }
          },
          {
            title: '核销门店',
            align: 'center',
            dataIndex: 'storeQuantity',
            scopedSlots: { customRender: 'storeQuantity' }
          },
          {
            title: '状态',
            align: 'center',
            dataIndex: 'status_dictText'
          },
          /*{
            title: '获取渠道',
            align: 'center',
            dataIndex: 'theChannel'
          },*/
          {
            title: '有效期',
            align: 'center',
            dataIndex: 'indate'
          },
          {
            title: '领取时间',
            align: 'center',
            dataIndex: 'createTime'
          },
          {
            title: '使用时间',
            align: 'center',
            dataIndex: 'useTime'
          },
          {
            title: '核销人',
            align: 'center',
            dataIndex: 'cancel'
          }
        ],
        url: {
          list: 'memberList/memberList/findMemberCertificate'

        },
        visible: false,
        marketingChannelId: '',
        statusExplain: ''
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
      //核销门店
      showStoreInfo(id) {
        this.$refs.AppMarketingCertificateStoreModal.showModalVisible(id)
      },
      getAvatarView: function(headPortrait) {
        console.log(this.url.imgerver + '/' + headPortrait)
        return this.url.imgerver + '/' + headPortrait
      },
      //弹窗
      showModal(id) {
        this.marketingChannelId = id
        this.visible = true
        this.statusExplain = ''
      },
      //停用
      hideModal() {
        this.visible = false
        var that = this
        getAction(that.url.updateStatusById, {
          id: this.marketingChannelId,
          statusExplain: this.statusExplain
        }).then((res) => {
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
          title: '启用投放渠道后，用户可以通过该渠道领取到优惠券',
          content: '您确定要启用吗？',
          onOk: function() {
            getAction(that.url.updateStatusById, { id: id, statusExplain: '' }).then((res) => {
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
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime // 时间参数不传递后台
        return filterObj(param)
      },
      onDateChange: function(value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
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