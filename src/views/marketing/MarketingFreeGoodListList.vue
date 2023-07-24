<template>
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
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="是否推荐">
              <a-select v-model="queryParam.isRecommend" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="加入时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
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
                v-model="queryParam2.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
            </a-form-item>
          </a-col>

          <a-col :md="24" :sm="8">
            <a-form-item style="display: flex;justify-content: space-between;width: 100%" label="商品分类">
              <a-select
                v-model="queryParam.goodTypeIdOne"
                placeholder="请选择"
                @change="chooseMedicine"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :key="item.id" v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdTwo"
                placeholder="请选择"
                @change="chooseMedicine1"
                style="width:100px;margin-right: 10px;"
                ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :key="item.id" v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdThree"
                placeholder="请选择"
                style="width:100px;margin-right: 10px;"
                @change="chooseMedicine2"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :key="item.id" v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </a-form-item>
          </a-col>
          <!-- <a-col :md="24" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
            </span>
          </a-col> -->
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="toAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
      <a-button type="primary" @click="searchReset2" icon="reload">重置</a-button>
      <!-- <a-button type="primary" icon="download" :loading="exportLoading" @click="handleExportXls('免单商品')">导出</a-button>
      <a-upload
        name="file"
        :showUploadList="false"
        :multiple="false"
        :headers="tokenHeader"
        :action="importExcelUrl"
        @change="handleImportExcel"
      >
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload> -->
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
        rowKey="id"
        :columns="columns"
        :scroll="{ x: 2500 }"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="isRecommend" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.isRecommend == 0">否</span>
            <span shape="square" v-if="record.isRecommend == 1">是</span>
          </div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
          </div>
        </template>
        <template slot="freePriceProportion" slot-scope="text, record">
          <div v-if="record.freePriceProportionStart == record.freePriceProportionEnd">
            {{ record.freePriceProportionStart }}
          </div>
          <div v-else>
            {{ record.freePriceProportionStart + '-' + record.freePriceProportionEnd }}
          </div>
        </template>
        <template slot="freePrice" slot-scope="text, record">
          <div v-if="record.freePriceStart == record.freePriceEnd">
            {{ record.freePriceStart }}
          </div>
          <div v-else>
            {{ record.freePriceStart + '-' + record.freePriceEnd }}
          </div>
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="getAvatarView(record.mainPicture)"
            icon="user"
          />
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record, 3)">排序</a>
          <a-divider type="vertical" />
          <a @click="changeCommand(record)" v-if="record.isRecommend == 1">取消推荐</a>
          <a @click="changeCommand(record)" v-else>设为推荐</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record, 1)">修改分类</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record, 2)">改价格</a>
          <a-divider type="vertical" />
          <a v-if="record.status == 1" @click="showTextareaModal(record, 1)">停用</a>
          <a v-else @click="showTextareaModal(record, 2)">启用</a>

          <a-divider type="vertical" />
          <a @click="showTextareaModal(record, 3)">删除</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 表单区域 -->
    <marketingFreeGoodList-modal ref="modalForm" @handleOk="modalFormOk"></marketingFreeGoodList-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
  </a-card>
</template>

<script>
import MarketingFreeGoodListModal from './modules/MarketingFreeGoodListModal'
import textAreaModal from '@/components/popUp/textAreaModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { httpAction, getAction, postAction, putAction, deleteAction } from '@/api/manage'
export default {
  name: 'MarketingFreeGoodListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingFreeGoodListModal,
    textAreaModal
  },
  data() {
    return {
      description: '免单商品管理页面',
      queryParam2: {},
      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: ''
      },
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
          dataIndex: 'goodListId'
        },

        {
          title: '商品图片',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName',
          width: 250
        },
        {
          title: '商品分类',
          align: 'center',
          dataIndex: 'goodTypeName'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '活动商品分类',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '活动折扣',
          align: 'center',
          dataIndex: 'freePriceProportion',
          scopedSlots: { customRender: 'freePriceProportion' }
        },
        {
          title: '活动价格',
          align: 'center',
          dataIndex: 'freePrice',
          scopedSlots: { customRender: 'freePrice' },
          sorter: (a, b) => a.freePriceEnd - b.freePriceEnd
        },
        {
          title: '商品销售价',
          align: 'center',
          dataIndex: 'price',
          sorter: (a, b) => a.price - b.price
        },
        {
          title: '库存',
          align: 'center',
          dataIndex: 'repertory'
        },

        {
          // ；0：否；1：是'
          title: '是否推荐',
          align: 'center',
          dataIndex: 'isRecommend',
          scopedSlots: { customRender: 'isRecommend' }
        },

        {
          // ：0：停用；1：启用
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'statusExplain'
        },
        {
          title: '加入者',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '加入时间',
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
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 350
        }
      ],
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      url: {
        list: '/marketing/marketingFreeGoodList/selectMarketingFreeGoodList',
        delete: '/marketing/marketingFreeGoodList/delete',
        deleteBatch: '/marketing/marketingFreeGoodList/deleteBatch',
        exportXlsUrl: 'marketing/marketingFreeGoodList/exportXls',
        importExcelUrl: 'marketing/marketingFreeGoodList/importExcel',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        edit: '/marketing/marketingFreeGoodList/edit',
        getgoodTypeListcascade: 'goodType/goodType/getgoodTypeListcascade'
      },
      modalForm2Record: {},
      modalForm2Infos: {}
    }
  },
  watch: {
    queryParam: {
      handler(newVal) {
        console.log(newVal)
        if (newVal.goodTypeIdThree) {
          this.queryParam.goodTypeId = newVal.goodTypeIdThree
        } else if (newVal.goodTypeIdTwo) {
          this.queryParam.goodTypeId = newVal.goodTypeIdTwo
        } else {
          this.queryParam.goodTypeId = newVal.goodTypeIdOne
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.goodTypeListcascade('0')
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  methods: {
    modalFormOk() {
      this.loadData()
    },
    searchReset2() {
      this.queryParam2 = {}
      this.searchReset()
      this.$nextTick(() => {
        this.queryParam = {
          goodTypeIdOne: '',
          goodTypeIdTwo: '',
          goodTypeIdThree: ''
        }
      })
    },
    onDateChange: function(value, dateString) {
      this.queryParam.createTimeStart = dateString[0]
      this.queryParam.createTimeEnd = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.updateTimeStart = dateString[0]
      this.queryParam.updateTimeEnd = dateString[1]
    },
    //查询
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = []
      that.listGoodType2 = []
      that.$set(that.queryParam, 'goodTypeIdOne', value)
      that.queryParam.goodTypeIdTwo = ''
      that.queryParam.goodTypeIdThree = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodType

          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
      //  that.queryParam.goodTypeIdThree = "";
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.$set(that.queryParam, 'goodTypeIdTwo', value)

      that.listGoodType2 = []
      //  that.queryParam.goodTypeIdThree = "";
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType
          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    chooseMedicine2: function(value) {
      this.$set(this.queryParam, 'goodTypeIdThree', value)
    },
    goodTypeListcascade(parentId) {
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
        if (res.success) {
          that.listGoodType = res.result.listGoodType
          //that.$message.success(res.message);
          //  console.log("res.message===="+res.result.listGoodType[0].id)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该商品将不在活动中展示',
          explainSureText: '您确定要停用吗'
        },
        {
          title: '启用',
          mainText: '启用后，该商品将会在活动中展示',
          explainSureText: '您确定要启用吗'
        },
        {
          title: '删除',
          mainText: '删除后，该商品将不在活动中展示',
          explainSureText: '您确定要删除吗'
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      let url = this.url.edit
      let method = putAction
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      if (title == '删除') {
        url = this.url.delete
        method = deleteAction
      }
      infos.statusExplain = infos.modalExplain
      method(url, infos).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(infos)
    },
    toAdd() {
      this.$router.push({
        path: '/marketing/modules/AddMarketingFreeChargeModel'
      })
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    changeCommand(record) {
      let modelInfo = {
        title: '点击确定将取消该商品推荐',
        content: '您确定要这么设定吗',
        isRecommend: 0
      }
      let num = 9
      if (record.isRecommend == 1) {
        modelInfo = {
          title: '点击确定将取消该商品推荐',
          content: '您确定要这么设定吗',
          isRecommend: 0
        }
      } else {
        if (num <= 10) {
          modelInfo = {
            title: '点击确定将该商品设为推荐',
            content: '您确定要这么设定吗',
            isRecommend: 1
          }
        } else {
          modelInfo = {
            title: '当前商品推荐数量已经超过10个，确定推荐将移除最早一个推荐商品？',
            content: '您确定要这么设定吗',
            isRecommend: 1
          }
        }
      }
      this.$confirm({
        title: modelInfo.title,
        content: modelInfo.content,
        onOk: () => {
          putAction(this.url.edit, {
            // ...record,
            id: record.id,
            isRecommend: modelInfo.isRecommend
          }).then(res => {
            if (res.success) {
              this.$message.success(res.message)
              this.loadData()
            } else {
              this.$message.warning(res.message)
            }
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style scoped></style>
