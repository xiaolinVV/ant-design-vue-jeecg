<template>
  <a-modal :title="title" :width="1200" :visible="visible" cancelText="关闭" :footer="null" @cancel="handleCancel">
    <a-card :bordered="false">
      <!-- 查询区域 -->
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="24">
            <a-col :md="8" :sm="8">
              <a-form-item label="商品名称">
                <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
              </a-form-item>
            </a-col>

            <a-col :md="8" :sm="8">
              <a-form-item style="display: flex;" label="商品分类">
                <a-select
                  v-model="queryParam.goodStoreTypeIdOne"
                  placeholder="请选择"
                  @change="chooseMedicine"
                  style="width:100px;margin-right: 10px;"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>

                <a-select
                  v-model="queryParam.goodStoreTypeIdTwo"
                  placeholder="请选择"
                  style="width:100px;margin-right: 10px;"
                >
                  <a-select-option value="">请选择</a-select-option>
                  <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>

            <!-- <a-col :md="8" :sm="8">
              <a-form-item label="交易时间">
                <a-range-picker
                  style="min-width: 210px"
                  v-model="queryParam.createTime"
                  format="YYYY-MM-DD"
                  :placeholder="['开始时间', '结束时间']"
                  @change="onDateChange"
                />
              </a-form-item>
            </a-col> -->

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
          <img :src="handleImage(text)" style="width: 40px;height: 40px;" />
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
import { getAction } from '@/api/manage'
import JInput from '@/components/jeecg/JInput.vue'
export default {
  name: 'MarketingStoreGiftCardCanSelectGoods',
  mixins: [JeecgListMixin],
  components: {
    JInput
  },
  data() {
    return {
      model: {},
      visible: false,
      title: '可选商品',
      listGoodType: [],
      listGoodType1: [],
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
          title: '商品图片',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' },
          align: 'center'
        },
        {
          title: '商品名称',
          className: 'column-money',
          dataIndex: 'goodName',
          align: 'center'
        },
        {
          title: '商品分类',
          dataIndex: 'goodStoreTypeNames',
          align: 'center'
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          align: 'center'
        },

        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center'
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center'
        },
        {
          title: '会员价',
          dataIndex: 'vipPrice',
          align: 'center'
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          align: 'center'
        }
      ],
      isSetPageNo: false,
      url: {
        list: '/marketing/marketingStoreGiftCardList/getSelectGoods',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        getgoodTypeListcascade: '/GoodStoreType/goodStoreType/getgoodStorTypeListcascade'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.goodTypeListcascade('0')
  },
  methods: {
    //分类搜索
    goodTypeListcascade(parentId) {
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
        if (res.success) {
          that.listGoodType = res.result.listGoodStorType
          //that.$message.success(res.message);
          //  console.log("res.message===="+res.result.listGoodType[0].id)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = ''
      that.listGoodType2 = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodStorType

          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodStorType

          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    handleImage(url) {
      if (url) {
        url = this.url.imgerver + '/' + Object.values(JSON.parse(url))[0]
      } else {
        url = ''
      }
      return url
    },
    // onDateChange: function(value, dateString) {
    //   this.queryParam.createTime_begin = dateString[0]
    //   this.queryParam.createTime_end = dateString[1]
    // },
    getQueryParams() {
      var param = Object.assign({}, this.queryParam, this.isorter, { memberListId: this.model.id })
      param.field = this.getQueryField()
      param.pageNo = this.ipagination.current
      param.pageSize = this.ipagination.pageSize
      param.marketingStoreGiftCardListId = this.model.marketingStoreGiftCardListId || this.model.id
      // delete param.createTime // 时间参数不传递后台
      return filterObj(param)
    },
    async showModal(record) {
      this.model = Object.assign({}, record)
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
