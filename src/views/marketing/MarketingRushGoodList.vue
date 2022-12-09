<template>
  <div class="MarketingPrefectureGoodList">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both"></div>
      <a-card :bordered="false" style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入" @search="onSearch" enterButton />
          <a-list itemLayout="horizontal" :dataSource="listData">
            <div class="line-render-item" slot="renderItem" slot-scope="item, index" @click="loadData(item)">
              <!-- <img preview="1" :src="item['logoAddr']" alt="" /> -->
              <div :class="{ 'select-color': item.id == marketingRushTypeId }">
                {{ item.rushName }}
              </div>
            </div>
          </a-list>
        </a-spin>
      </a-card>
      <a-card :bordered="false" style="width: 79%;min-height: 700px;background: white;float: right">
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
                <a-form-item style="display: flex;width: 100%;" label="商品分类">
                  <a-select
                    v-model="queryParam.gtOneId"
                    placeholder="请选择"
                    @change="chooseMedicine"
                    style="width:30%;margin-right: 5%;"
                  >
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
                  </a-select>
                  <a-select
                    v-model="queryParam.gtTwoId"
                    placeholder="请选择"
                    @change="chooseMedicine1"
                    style="width:30%;margin-right: 5%;"
                  ><!--v-model="id"-->
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                    <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                  </a-select>
                  <a-select v-model="queryParam.gtThreeId" placeholder="请选择" style="width:30%">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                    <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
                  </a-select>
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
                <a-form-item label="加入时间">
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    v-model="queryParam.createTime"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="loadData({ id: marketingRushTypeId })" icon="search">查询</a-button>
            <a-button
              type="primary"
              @click="loadData({ id: marketingRushTypeId }, false, true)"
              icon="reload"
              style="margin-left: 8px"
            >重置</a-button
            >
            <!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
            <!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
            <!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
            <!--              </a>-->
          </span>
        </div>
        <div style="clear: both;height: 20px;"></div>

        <!-- 操作按钮区域 -->
        <div class="table-operator">
          <a-button @click="routerTo" icon="plus" type="primary">新增</a-button>
          
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item @click="batchDel" key="1">
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
            <a @click="onClearSelected" style="margin-left: 24px">清空</a>
          </div>

          <a-table
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            :pagination="ipagination"
            :scroll="{ x: 2000 }"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
            ref="table"
            rowKey="id"
            size="middle"
          >
            <template slot="mainPicture" slot-scope="text, record, index">
              <img class="clickShowImage " :preview="'mainPicture' + index" :src="text" alt="" />
            </template>

            <template slot="status" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <span shape="square" v-if="record.status == 0">停用</span>
                <span shape="square" v-if="record.status == 1">启用</span>
                <span shape="square" v-if="record.status == 3">失效</span>
              </div>
            </template>

            <span
              slot="action"
              slot-scope="text, record"
              style="display: flex;align-items: center;justify-content: space-around"
            >
              <a @click="handleEdit(record)">排序</a>
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
      </a-card>
      <MarketingRushGroupGoodModal ref="modalForm" @ok="modalFormOk"></MarketingRushGroupGoodModal>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

import { filterObj } from '@/utils/util'
import MarketingRushGroupGoodModal from './modules/MarketingRushGroupGoodModal'
import textAreaModal from '@/components/popUp/textAreaModal'
import { postAction } from '@/api/manage'

export default {
  name: 'MarketingPrefectureGoodList',
  mixins: [JeecgListMixin],
  components: {
    textAreaModal,
    MarketingRushGroupGoodModal
  },
  data() {
    return {
      modalForm2Record: {},
      modalForm2Infos: {},
      marketingPrefectureTypeIds: [], //当前选择分类id
      classifactionList: '', //专区分类列表
      description: '专区商品管理页面',
      listData: [],
      //卡片加载
      cardLoading: false,
      marketingRushTypeId: '',
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
          title: '商品图片', //相对地址（以json的形式存储多张）
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
          dataIndex: 'typeName'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice'
        },
        {
          title: '销售价',
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
          title: '活动价格',
          align: 'center',
          dataIndex: 'groupPrice'
        },

        {
          title: '状态', //：0：停用；1：启用
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },

        {
          title: '状态说明', //状态说明，
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
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 200
        }
      ],
      url: {
        edit: 'marketingRushGood/marketingRushGood/edit',
        list: '/marketingRushGood/marketingRushGood/list',
        delete: '/marketingRushGood/marketingRushGood/delete',
        deleteBatch: '/marketingZoneGroupGood/marketingZoneGroupGood/deleteBatch',
        exportXlsUrl: 'marketingZoneGroupGood/marketingZoneGroupGood/exportXls',
        importExcelUrl: 'marketingZoneGroupGood/marketingZoneGroupGood/importExcel',
        //专区分类左边  参数 zoneName null || 指定名字
        getMarketingPrefecture: '/marketingRushType/marketingRushType/list',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
        getMarketingPrefectureGoodUrl: '/marketingPrefectureGood/marketingPrefectureGood/getMarketingPrefectureGoodUrl',
        getMarketingPrefectureTypeAll: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureTypeAll'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {
    this.leftListMethods()
    this.goodTypeListcascade('0')
  },

  methods: {
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
      console.log(infos,'infos')
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
      getAction(this.url.getMarketingPrefectureTypeAll, { marketingRushTypeId: this.marketingRushTypeId }).then(
        res => {
          if (res.success) {
            this.classifactionList = res.result
          }
        }
      )
    },
    //新增
    routerTo() {
      if (!this.marketingRushTypeId) {
        this.$message.warn('请在左侧选择对应专区')
        return
      }
      let marketingZoneGroupRecord = this.listData.filter(item => item.id == this.marketingRushTypeId)
      this.$router.push({
        path: '/marketing/modules/AddMarketingRushGoodsModel',
        query: {
          marketingZoneGroupRecord,
          marketingRushTypeId: this.marketingRushTypeId,
          price: this.price
        }
      })
    },
    openPop(state = 1, item) {
      this.$refs.modalForm.open(state, item)
    },
    // 分类左边方法封装
    leftListMethods(rushName = '') {
      this.cardLoading = true
      getAction(this.url.getMarketingPrefecture, {
        rushName
      }).then(res => {
        if (res.success) {
          let records = (res.result && res.result.records) || []
          if (records.length > 0) {
            this.marketingRushTypeId = records[0].id
            this.price =  records[0].price
            this.loadData(records[0])
            console.log(records,'111')
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
          id: this.marketingRushTypeId
        },
        true
      )
    },
    loadData(
      item = {
        id: this.marketingRushTypeId
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
          id: this.marketingRushTypeId
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
      let marketingRushTypeId = item.id
      this.loading = true

      this.marketingRushTypeId = marketingRushTypeId
      this.price = item.price
      console.log(this.price,'this.price')
      let info = Object.assign({}, { marketingRushTypeId: marketingRushTypeId}, this.queryParam, {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      })
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          for (let item of res.result.records) {
            if (item.mainPicture) {
              item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
          
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
    onDateChange: function(value, dateString) {
      this.queryParam.createTime_begin = dateString[0]
      this.queryParam.createTime_end = dateString[1]
    },

    onDateChange2: function(value, dateString) {
      this.queryParam.updateTime_begin = dateString[0]
      this.queryParam.updateTime_end = dateString[1]
    },

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
      //console.log("parentId1111111111"+value)
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
                  id: this.marketingRushTypeId
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
    }
  },
  watch: {
    marketingPrefectureTypeIds: function(newData, oldData) {
      if (newData.length == 2) {
        this.queryParam.marketingPrefectureTypeId = newData[1]
      } else {
        this.queryParam.marketingPrefectureTypeId = newData[0]
      }
    }
  }
}
</script>
<style lang="less">
.MarketingPrefectureGoodList {
	.select-color {
		color: #1890ff;
	}

	.spin-content {
		padding: 30px;
	}

	.line-render-item {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		width: 100%;
		min-height: 60px;
		font-weight: 700;
		font-size: 14px;

		img {
			margin-right: 10px;
			width: 40px;
			height: 40px;
		}
	}

	.line-render-item:hover {
		cursor: pointer;
		color: #1890ff;
	}
}
</style>