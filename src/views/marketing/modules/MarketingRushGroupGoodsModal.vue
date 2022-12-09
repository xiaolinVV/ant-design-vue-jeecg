<template>
  <a-modal :title="title" :width="1200" :visible="visible" cancelText="关闭" :footer="null" @cancel="handleCancel">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="商品编号">
                <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="商品名称">
                <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="8">
              <a-form-item label="抢购时间">
                <a-range-picker
                  style="min-width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="24" :sm="8">
              <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
                <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
                <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 操作按钮区域 -->
      <div class="table-operator">
        <!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
        <!--<a-button type="primary" icon="download" @click="handleExportXls('收货地址')">导出</a-button>-->
      </div>
      <!-- table区域-begin -->
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        bordered
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="mainPicture" slot-scope="text">
          <div class="anty-img-wrap">
            <a-avatar shape="square" :src="getAvatarView(text)" icon="user" />
          </div>
        </template>
      </a-table>

      <!-- table区域-end -->

      <!-- 表单区域 -->
    </a-card>
  </a-modal>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { filterObj } from '@/utils/util'
  import JInput from '@/components/jeecg/JInput.vue'
  export default {
    name: 'MarketingRushGroupGoodsModal',
    mixins: [JeecgListMixin],
    components: {
      JInput
    },
    data() {
      return {
        model: {},
        visible: false,
        title: '寄售商品',
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
            title: '商品编号',
            align: 'center',
            dataIndex: 'goodNo'
          },
          {
            title: '商品主图',
            align: 'center',
            dataIndex: 'mainPicture',
            scopedSlots: { customRender: 'mainPicture' }
          },
          {
            title: '商品名称',
            align: 'center',
            dataIndex: 'goodName'
          },
          {
            title: '商品规格',
            align: 'center',
            dataIndex: 'specification'
          },
          {
            title: '数量',
            align: 'center',
            dataIndex: 'amount'
          },
          {
            title: '活动价格',
            align: 'center',
            dataIndex: 'rushPrice'
          },
          {
            title: '抢购时间',
            align: 'center',
            dataIndex: 'createTime'
          }
        ],
        url: {
          //寄售商品
          list: 'marketingRushRecord/marketingRushRecord/list',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
        }
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
      onDateChange: function(value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
      },
      getQueryParams() {
        var param = Object.assign({}, this.queryParam, this.isorter, { marketingRushGroupId: this.model.id ,memberListId: this.model.memberListId , status: 1})
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime // 时间参数不传递后台
        return filterObj(param)
      },
      async showModal(record) {
        this.model = Object.assign({}, record)
          //寄售商品
          this.title = '寄售商品'
          this.url.list = 'marketingRushRecord/marketingRushRecord/list'
        this.visible = true
        await this.$nextTick()
        this.loadData()
      },
      handleCancel() {
        this.visible = false
      }
    }
  }
</script>
<style lang="sass" scoped></style>
