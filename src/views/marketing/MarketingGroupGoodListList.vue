<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="商品编号">
              <a-input placeholder="请输入" v-model="queryParam.goodNo"></a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-item label="状态">
              <a-select v-model="queryParam.status" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">停用</a-select-option>
                <a-select-option :value="1">启用</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="是否推荐">
              <a-select v-model="queryParam.isRecommend" placeholder="请选择">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option :value="0">否</a-select-option>
                <a-select-option :value="1">是</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="开始时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.createTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="结束时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.updateTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange1"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="加入时间">
              <a-range-picker
                style="width: 100%"
                v-model="queryParam2.joinTime"
                format="YYYY-MM-DD"
                :placeholder="['开始时间', '结束时间']"
                @change="onDateChange2"
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
                <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdTwo"
                placeholder="请选择"
                @change="chooseMedicine1"
                style="width:100px;margin-right: 10px;"
                ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdThree"
                placeholder="请选择"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset2" icon="reload" style="margin-left: 8px">重置</a-button>
              <!-- <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a> -->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="toAdd" type="primary" icon="plus">新增</a-button>
      <a-button @click="allOperation(2)" type="primary" icon="check">批量启用</a-button>
      <a-button @click="allOperation(1)" type="primary" icon="pause">批量停用</a-button>
      <!-- <a-button type="primary" icon="download" @click="handleExportXls('拼团商品')">导出</a-button>
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
      <!-- <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete" />删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down"/></a-button>
      </a-dropdown> -->
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
        :dataSource="dataSource"
        :pagination="ipagination"
        :scroll="{ x: 3500 }"
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
        <template slot="activityTime" slot-scope="text, record, index">
          <div class="anty-img-wrap">{{ text }}{{ record.activityUnit == 1 ? '时' : '天' }}</div>
        </template>
        <template slot="status" slot-scope="text, record, index">
          <div class="anty-img-wrap">
            <span shape="square" v-if="record.status == 0">停用</span>
            <span shape="square" v-if="record.status == 1">启用</span>
            <span shape="square" v-if="record.status == 2">结束</span>
          </div>
        </template>
        <template slot="groupPriceProportion" slot-scope="text, record">
          {{ text }}
        </template>
        <template slot="groupPrice" slot-scope="text, record">
          {{ text }}
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
    <marketingGroupGoodList-modal ref="modalForm" @handleOk="modalFormOk"></marketingGroupGoodList-modal>
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      :okBtnDisabled="okBtnDisabled"
      @ok="modalForm2Ok"
    >
      <div
        slot="other"
        v-if="modalForm2Infos.title == '启用后，该商品将会在活动中展示'"
        style="display:flex;flex-direction:column;margin-bottom:15px"
      >
        <a-radio-group v-model="pattern" style="margin-bottom:15px">
          <a-radio :value="0">原开始时间</a-radio>
          <a-radio :value="1">新的开始时间</a-radio>
        </a-radio-group>
        <a-date-picker
          :mode="datePickerMode"
          format="YYYY-MM-DD HH:mm:ss"
          showTime
          :disabled="pattern != 1"
          v-model="startTime"
          @openChange="handleOpenChange1"
          @panelChange="handlePanelChange1"
        />
      </div>
    </textAreaModal>
  </a-card>
</template>

<script>
import MarketingGroupGoodListModal from './modules/MarketingGroupGoodListModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import textAreaModal from '@/components/popUp/textAreaModal'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import { deleteAction } from '../../api/manage'
export default {
  name: 'MarketingGroupGoodListList',
  mixins: [JeecgListMixin],
  components: {
    MarketingGroupGoodListModal,
    textAreaModal
  },
  data() {
    return {
      description: '拼团基础设置管理页面',
      // 表头
      queryParam2: {},
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      modalForm2Record: {},
      modalForm2Infos: {},
      datePickerMode: 'time',
      pattern: 0,
      startTime: '',
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
          title: '活动商品分类',
          align: 'center',
          dataIndex: 'typeName'
        },
        {
          title: '活动折扣',
          align: 'center',
          dataIndex: 'groupPriceProportion',
          scopedSlots: { customRender: 'groupPriceProportion' }
        },
        {
          title: '活动价格',
          align: 'center',
          dataIndex: 'groupPrice',
          scopedSlots: { customRender: 'groupPrice' },
          sorter: (a, b) => a.groupPrice - b.groupPrice
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
          title: '成团人数',
          align: 'center',
          dataIndex: 'numberTuxedo'
        },
        {
          title: '参团积分',
          align: 'center',
          dataIndex: 'tuxedoWelfarePayments'
        },
        {
          title: '返还比例(%)',
          align: 'center',
          dataIndex: 'returnProportion'
        },
        {
          title: '活动时间',
          align: 'center',
          dataIndex: 'activityTime',
          scopedSlots: { customRender: 'activityTime' }
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },

        {
          // ：0：停用；1：启用 2:结束
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
          title: '开始时间',
          align: 'center',
          dataIndex: 'startTime'
        },
        {
          title: '结束时间',
          align: 'center',
          dataIndex: 'endTime'
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
      url: {
        list: '/marketing/marketingGroupGoodList/selectMarketingGroupGoodList',
        delete: '/marketing/marketingGroupGoodList/delete',
        deleteBatch: '/marketing/marketingGroupGoodList/deleteBatch',
        exportXlsUrl: 'marketing/marketingGroupGoodList/exportXls',
        importExcelUrl: 'marketing/marketingGroupGoodList/importExcel',
        edit: '/marketing/marketingGroupGoodList/edit',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        selectMarketingGroupGoodByIsRecommendCount:
          'marketing/marketingGroupGoodList/updateMarketingGroupGoodByIsRecommend',
        //拼团商品停用
        blockUpMarketingGroupGood: 'marketing/marketingGroupGoodList/blockUpMarketingGroupGood',
        //拼团商品启用
        startUsingMarketingGroupGood: 'marketing/marketingGroupGoodList/startUsingMarketingGroupGood'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    },
    okBtnDisabled({ modalForm2Infos, pattern, startTime }) {
      if (modalForm2Infos.title && modalForm2Infos.title.indexOf('启用') != -1 && pattern == 1 && !startTime) {
        return true
      }
      return false
    }
  },
  methods: {
    handlePanelChange1(value, mode) {
      this.datePickerMode = mode
    },
    handleOpenChange1(open) {
      if (open) {
        this.datePickerMode = 'time'
      }
    },
    modalFormOk() {
      this.loadData()
    },
    allOperation(type) {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warning('请选择一条记录！')
        return
      }
      this.showTextareaModal(
        {
          id: this.selectedRowKeys.join(',')
        },
        type
      )
    },
    async showTextareaModal(record, type) {
      const allInfos = [
        {
          title: '停用',
          mainText: '停用后，该商品将不在活动中展示',
          explainSureText: '您确定要停用吗',
          url: this.url.blockUpMarketingGroupGood
        },
        {
          title: '启用后，该商品将会在活动中展示',
          mainText:
            '未设定过开始时间的活动，请选择设置新的开始时间，否则启用不生效已设置过开始时间的活动，可选择原开始时间或新的开始时间进行启用',
          explainSureText: '您确定要启用吗',
          url: this.url.startUsingMarketingGroupGood
        },
        {
          title: '删除',
          mainText: '删除后，该商品将不在活动中展示',
          explainSureText: '您确定要删除吗',
          url: this.url.delete
        }
      ]
      this.modalForm2Record = record
      this.modalForm2Infos = allInfos[type - 1]
      await this.$nextTick()
      this.$refs.modalForm2.show()
    },
    modalForm2Ok(infos) {
      const methods = this.modalForm2Infos.title == '删除' ? deleteAction : getAction
      let result = {
        [this.modalForm2Infos.title == '删除' ? 'id' : 'marketingGroupGoodIds']: infos.id,
        explain: infos.modalExplain
      }

      if (this.modalForm2Infos.title.indexOf('启用') != -1) {
        result = {
          ...result,
          pattern: this.pattern //0：原开始时间；1：新的开始时间
        }
        if (result.pattern == 1 && this.startTime) {
          result.startTime = this.startTime.format('YYYY-MM-DD HH:mm:ss')
        }
      }
      methods(this.modalForm2Infos.url, result).then(res => {
        if (res.success) {
          this.$message.success(res.message)
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
      })
      console.log(infos)
    },

    // selectMarketingGroupGoodByIsRecommendCount(record) {
    //   console.log(record)
    //   return new Promise(resolve => {
    //     getAction(this.url.selectMarketingGroupGoodByIsRecommendCount, {
    //       marketingGroupGoodListId: record.id
    //     }).then(res => {
    //       if (res.success) {
    //         resolve(res.result)
    //       } else {
    //         resolve(-1)
    //         this.$message.error(res.message)
    //       }
    //     })
    //   })
    // },
    async changeCommand(record) {
      // 点击确定将取消该商品推荐
      let modelInfo = {
        title: '点击确定将取消该商品推荐',
        content: '您确定要这么设定吗',
        isRecommend: 0
      }
      let num = 9
      // num = await this.selectMarketingGroupGoodByIsRecommendCount(record)
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
            isRecommend: 0
          }
        } else {
          modelInfo = {
            title: '当前商品推荐数量已经超过10个，确定推荐将移除最早一个推荐商品？',
            content: '您确定要这么设定吗',
            isRecommend: 0
          }
        }
      }
      this.$confirm({
        title: modelInfo.title,
        content: modelInfo.content,
        onOk: () => {
          getAction(this.url.selectMarketingGroupGoodByIsRecommendCount, {
            marketingGroupGoodListId: record.id
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
    },
    toAdd() {
      this.$router.push({
        path: '/marketing/modules/AddMarketingGroupGoodsModel'
      })
    },
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = []
      that.listGoodType2 = []
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
    searchReset2() {
      this.queryParam2 = {}
      this.searchReset()
    },
    onDateChange: function(value, dateString) {
      this.queryParam.startTimeStart = dateString[0]
      this.queryParam.startTimeEnd = dateString[1]
    },
    onDateChange1: function(value, dateString) {
      this.queryParam.endTimeStart = dateString[0]
      this.queryParam.endTimeEnd = dateString[1]
    },
    onDateChange2: function(value, dateString) {
      this.queryParam.joinTimeStart = dateString[0]
      this.queryParam.joinTimeEnd = dateString[1]
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>
