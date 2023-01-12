<template>
  <a-card :bordered="false">

    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">

          <a-col :md="8" :sm="8">
            <a-form-item label="分类编号">
              <a-input placeholder="请输入" v-model="queryParam.id"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
            <a-form-item label="分类名称">
              <a-input placeholder="请输入" v-model="queryParam.rushName"></a-input>
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
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
      <a-button @click="handleAdd" type="primary" icon="plus">添加</a-button>

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
        :scroll="{ x: true }"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        @change="handleTableChange">


        <span slot="action" slot-scope="text, record">
          <a @click="handleSort(record)">排序</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
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
    <textAreaModal
      ref="modalForm2"
      :infos="modalForm2Infos"
      :record="modalForm2Record"
      @ok="modalForm2Ok"
    ></textAreaModal>
    <!-- 表单区域 -->
    <marketingRushType-modal ref="modalForm" @ok="modalFormOk"></marketingRushType-modal>
    <MarketingRushGroupTypeModal ref="modalForm1" @ok="modalFormOk"></MarketingRushGroupTypeModal>
    <div style="clear: both"></div>
  </a-card>
</template>

<script>
  import MarketingRushTypeModal from './modules/MarketingRushTypeModal'//编辑添加框
  import MarketingRushGroupTypeModal from './modules/MarketingRushGroupTypeModal' //排序

  import {JeecgListMixin} from '@/mixins/JeecgListMixin'
  import { getAction } from '@/api/manage'
  import { filterObj } from '@/utils/util'
  import textAreaModal from '@/components/popUp/textAreaModal'
  import { postAction } from '@/api/manage'

  export default {
    name: "MarketingRushTypeList",
    mixins: [JeecgListMixin],
    components: {
      textAreaModal,
      MarketingRushTypeModal,
      MarketingRushGroupTypeModal
    },
    data () {
      return {
        modalForm2Record: {},
        modalForm2Infos: {},
        marketingPrefectureTypeIds: [], //当前选择分类id
        classifactionList: '', //专区分类列表
         listData: [],
        //卡片加载
        cardLoading: false,
        marketingZoneGroupId: '',
        listGoodType: [],
        listGoodType1: [],
        listGoodType2: [],
        goodUrl: '', //复制链接
        //供应链接口用
        page: '',
        count: '',

        queryParam: {
          gtOneId: '',
          gtTwoId: '',
          gtThreeId: '',
          createTime: []
        },
        description: '抢购活动-分类管理管理页面',
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
            title: '分类编号',
            align: "center",
            dataIndex: 'id'
          },
          {
            title: '分类名称',
            align: "center",
            dataIndex: 'rushName'
          },
          {
            title: '活动价格',
            align: "center",
            dataIndex: 'price'
          },
          {
            title: '每日限购',
            align: "center",
            dataIndex: 'purchaseLimitation'
          },
          {
            title: '参与奖励',
            align: "center",
            dataIndex: 'groupRewards'
          },
          {
            title: '参与奖励类型',
            align: "center",
            dataIndex: 'groupRewardsType',
            customRender: function (text) {
              if (text == 0) {
                return '余额'
              }
            },
          },
          {
            title: '推荐奖励',
            align: "center",
            dataIndex: 'recommendGroupRewards'
          },
          {
            title: '推荐奖励类型',
            align: "center",
            dataIndex: 'recommendGroupRewardsType',
            customRender: function (text) {
              if (text == 0) {
                return '余额'
              }
            },
          },
          {
            title: '寄售阀值',
            align: "center",
            dataIndex: 'transformationThreshold'
          },
          {
            title: '寄售条件',
            align: "center",
            dataIndex: 'consignmentCondition'
          },
          {
            title: '可寄售',
            align: "center",
            dataIndex: 'canConsignment'
          },
          {
            title: '转入余额',
            align: "center",
            dataIndex: 'intoBalance'
          },
          {
            title: '转入购物积分',
            align: "center",
            dataIndex: 'intoShoppingCredits'
          },
          {
            title: '排序',
            align: "center",
            dataIndex: 'sort'
          },
          {
            title: '状态',
            align: "center",
            dataIndex: 'status',
            customRender: function (text) {
              if (text == 0) {
                return '停用'
              }else if (text == 1){
                return '启用'
              }
            },
          },
          {
            title: '状态说明',
            align: "center",
            dataIndex: 'statusExplain'
          },
          {
            title: '创建者',
            align: "center",
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',
            align: "center",
            dataIndex: 'createTime'
          },
          {
            title: '更新者',
            align: "center",
            dataIndex: 'updateBy'
          },
          {
            title: '更新时间',
            align: "center",
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            scopedSlots: {customRender: 'action'},
          }
        ],
        url: {
          edit:'marketingRushType/marketingRushType/edit',
          list: "/marketingRushType/marketingRushType/list",
          delete: "/marketingRushType/marketingRushType/delete",
          deleteBatch: "/marketingRushType/marketingRushType/deleteBatch",
          exportXlsUrl: "marketingRushType/marketingRushType/exportXls",
          importExcelUrl: "marketingRushType/marketingRushType/importExcel",

          getMarketingPrefecture: '/marketingZoneGroup/marketingZoneGroup/list',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',

          getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
          getMarketingPrefectureGoodUrl: '/marketingPrefectureGood/marketingPrefectureGood/getMarketingPrefectureGoodUrl',
          getMarketingPrefectureTypeAll: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureTypeAll'
        },
      }
    },
     created() {
      this.leftListMethods()
      this.goodTypeListcascade('0')
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      }
    },
    methods: {
      handleSort(record){
        this.$refs.modalForm1.edit(record)

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
            mainText: '启用后，该商品将在活动中展示',
            explainSureText: '您确定要启用吗'
          },
          {
            title: '删除',
            mainText: '删除后，该商品将不在活动中展示。',
            explainSureText: '您确定要删除吗'
          }
        ]
        this.modalForm2Record = record
        this.modalForm2Infos = allInfos[type - 1]
        await this.$nextTick()
        this.$refs.modalForm2.show()
      },

    async modalForm2Ok(infos) {
      const title = this.modalForm2Infos.title
      if (title == '停用') {
        infos.status = 0
      } else if (title == '启用') {
        infos.status = 1
      }
      let result
      infos.statusExplain = infos.modalExplain
      var obj = {}

      if (title == '删除') {
        obj.id = infos.id
        obj.delExplain = infos.statusExplain
        result = await postAction(this.url.delete, obj)
      } else {
        obj.id = infos.id
        obj.statusExplain = infos.statusExplain
        obj.status = infos.status
        obj.sort = infos.sort
        result = await postAction(this.url.edit, obj)

      }
      if (result.success) {
        this.$message.success(result.message)
        this.loadData()
      } else {
        this.$message.error(result.message)
      }

      console.log(infos)
    },
    //获取当前专区下的所有分类
    getMarketingPrefectureTypeAll() {
      getAction(this.url.getMarketingPrefectureTypeAll, { marketingZoneGroupId: this.marketingZoneGroupId }).then(
        res => {
          if (res.success) {
            this.classifactionList = res.result
          }
        }
      )
    },

    routerTo() {
      if (!this.marketingZoneGroupId) {
        this.$message.warn('请在左侧选择对应专区')
        return
      }
      let marketingZoneGroupRecord = this.listData.filter(item => item.id == this.marketingZoneGroupId)
      this.$router.push({
        path: '/marketing/modules/AddMarketingZoneGoodsModel',
        query: {
          marketingZoneGroupRecord,
          marketingZoneGroupId: this.marketingZoneGroupId
        }
      })
    },
    openPop(state = 1, item) {
      this.$refs.modalForm.open(state, item)
    },
    // 分类左边方法封装
    leftListMethods(zoneName = '') {
      this.cardLoading = true
      getAction(this.url.getMarketingPrefecture, {
        zoneName
      }).then(res => {
        if (res.success) {
          let records = (res.result && res.result.records) || []
          if (records.length > 0) {
            this.marketingZoneGroupId = records[0].id
            this.loadData(records[0])
          }

          this.listData = records
        }
        this.cardLoading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData(
        {
          id: this.marketingZoneGroupId
        },
        true
      )
    },
    loadData(
      item = {
        id: this.marketingZoneGroupId
      },
      isMore = false,
      isReset = false
    ) {
      // this.getMarketingPrefectureTypeAll()

      // if (item.buyLimit) {
      //   this.buyLimit = item.buyLimit
      // }

      if (!item) {
        item = {
          id: this.marketingZoneGroupId
        }
      }
      if (!isMore) {
        this.ipagination.current = 1
      }
      if (isReset) {
        this.queryParam = {}
        this.marketingPrefectureTypeIds = []
        this.ipagination.current = 1
      }
      let marketingZoneGroupId = item.id
      this.loading = true

      this.marketingZoneGroupId = marketingZoneGroupId
      let info = Object.assign({}, { marketingZoneGroupId }, this.queryParam, {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      })
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          for (let item of res.result.records) {
            // let minOrMax = []
            // let noExcept = 0 //不支持
            if (item.mainPicture) {
              item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
            // for (let item2 of item.goodListSpecificationList) {
            //   if (item2.isWelfare == 2) {
            //     minOrMax.push(item2.welfareProportion * 1)
            //   } else if (item2.isWelfare == 1) {
            //     minOrMax.push(100)
            //   } else {
            //     noExcept++
            //   }
            // }
          }
          this.dataSource = res.result.records
          this.ipagination.total = res.result.total
        }
        this.loading = false
      })
    },
    //搜索
    onSearch(value) {
      this.leftListMethods(value)
    },
    // onDateChange: function(value, dateString) {
    //   this.queryParam.createTime_begin = dateString[0]
    //   this.queryParam.createTime_end = dateString[1]
    // },

    // onDateChange2: function(value, dateString) {
    //   this.queryParam.updateTime_begin = dateString[0]
    //   this.queryParam.updateTime_end = dateString[1]
    // },

    onDateOk(value) {
      console.log(value)
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
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      that.queryParam.gtTwoId = ''
      that.queryParam.gtThreeId = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodType
          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
      //  that.queryParam.gtThreeId = "";
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.listGoodType2 = []
      //  that.queryParam.gtThreeId = "";
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType
          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    //启用
    updateStatus: function(id, status) {
      if (!this.url.updateStatus) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      let that = this
      this.$confirm({
        title: '启用商品后，该商品用户将可以搜索、浏览、购买，供应商可以上下架',
        content: '您确定要启用吗？',
        onOk: function() {
          getAction(that.url.updateStatus, { ids: id, closeExplian: '', status: status }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.loadData(
                {
                  id: this.marketingZoneGroupId
                },
                true
              )
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },
    //停用
    showModalStopStatus(id) {
      this.$refs.modalForm1.showModalStopStatus(id)
      this.$refs.modalForm1.title = '停用'
      this.$refs.modalForm1.disableSubmit = false
    },
    //复制地址
    copyAddress(id) {
      let that = this
      that.goodUrl = ''
      let clipBoardContent = ''
      that.getGoodUrlss(id)
    },
    //复制地址调用方法
    getGoodUrlss(id) {
      let that = this
      that.goodUrl = ''
      getAction(this.url.getMarketingPrefectureGoodUrl, { marketingPrefectureGoodId: id }).then(res => {
        if (res.success) {
          // debugger
          that.goodUrl = res.result.url
          let parameter = res.result.parameter
          parameter = JSON.parse(parameter)
          that.goodUrl = res.result.url + encodeURIComponent(JSON.stringify(parameter))

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
            textArea.value = that.goodUrl
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


    getQueryParams() {
        console.log(this.queryParam.createTime)
        var param = Object.assign({}, this.queryParam, this.isorter)
        param.field = this.getQueryField()
        param.pageNo = this.ipagination.current
        param.pageSize = this.ipagination.pageSize
        delete param.createTime
        delete param.updateTime
        return filterObj(param)
    },
    onDateChange: function(value, dateString) {
        this.queryParam.createTime_begin = dateString[0]
        this.queryParam.createTime_end = dateString[1]
    },
      onDateChange1: function(value, dateString) {
        this.queryParam.updateTime_begin = dateString[0]
        this.queryParam.updateTime_end = dateString[1]
      }
    }
  }
</script>
<style scoped>
@import "~@assets/less/common.less"











































</style>