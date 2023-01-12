<template>
  <div class="MarketingPrefectureGoodList">
    <div style="width:calc(100vw - 250px)">
      <div style="clear: both"></div>
      <a-card :bordered="false" style="width: 19%;min-height: 700px;background: white;float: left">
        <a-spin :spinning="cardLoading">
          <a-input-search placeholder="请输入" @search="onSearch" enterButton />
          <a-list itemLayout="horizontal" :dataSource="listData">
            <div class="line-render-item" slot="renderItem" slot-scope="item, index" @click="loadData(item)">
              <img preview="1" :src="item['logoAddr']" alt="" />
              <div :class="{ 'select-color': item.id == marketingPrefectureId }">
                {{ item.prefectureName }}
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
                    v-model="queryParam.goodTypeIdOne"
                    placeholder="请选择"
                    @change="chooseMedicine"
                    style="width:30%;margin-right: 5%;"
                  >
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
                  </a-select>
                  <a-select
                    v-model="queryParam.goodTypeIdTwo"
                    placeholder="请选择"
                    @change="chooseMedicine1"
                    style="width:30%;margin-right: 5%;"
                  ><!--v-model="id"-->
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                    <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
                  </a-select>
                  <a-select v-model="queryParam.goodTypeIdThree" placeholder="请选择" style="width:30%">
                    <a-select-option value="">请选择</a-select-option>
                    <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                    <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :md="8" :sm="8">
                <a-form-item label="商品折扣">
                  <a-input-group compact style="width: 100%">
                    <a-input-number
                      :min="0"
                      :max="queryParam.maxDiscount"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      style=" width: 45%; text-align: center"
                      placeholder="请输入"
                      v-model="queryParam.minDiscount"
                    />
                    <a-input
                      style=" width: 10%; border-left: 0; pointer-events: none; backgroundColor: #fff"
                      placeholder="~"
                      disabled
                    />
                    <a-input-number
                      :min="0"
                      :max="100"
                      :formatter="value => `${value}%`"
                      :parser="value => value.replace('%', '')"
                      style="width: 45%; text-align: center; border-left: 0"
                      placeholder="请输入"
                      v-model="queryParam.maxDiscount"
                    />
                  </a-input-group>
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="专区分类">
                  <a-cascader
                    v-if="classifactionList.length > 0"
                    :options="classifactionList"
                    changeOnSelect
                    v-model="marketingPrefectureTypeIds"
                    style="width: 150px"
                    placeholder="请选择专区"
                  />
                </a-form-item>
              </a-col>

              <a-col :md="8" :sm="8">
                <a-form-item label="供应商">
                  <a-input placeholder="请输入" v-model="queryParam.realname"></a-input>
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
              <!--时间选择框-->
              <!--<a-col :md="8" :sm="8">-->
              <!--<a-form-item label="创建时间">-->
              <!--<a-range-picker-->
              <!--style="width: 100%"-->
              <!--format="YYYY-MM-DD"-->
              <!--:placeholder="['开始时间', '结束时间']"-->
              <!--@change="onDateChange"-->
              <!--@ok="onDateOk"-->
              <!--/>-->
              <!--</a-form-item>-->
              <!--</a-col>-->

              <!--时间选择框-->
              <a-col :md="8" :sm="8">
                <a-form-item label="更新时间">
                  <a-range-picker
                    style="width: 100%"
                    format="YYYY-MM-DD"
                    :placeholder="['开始时间', '结束时间']"
                    @change="onDateChange2"
                    @ok="onDateOk"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div class="table-operator">
          <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
            <a-button type="primary" @click="loadData({ id: marketingPrefectureId })" icon="search">查询</a-button>
            <a-button
              type="primary"
              @click="loadData({ id: marketingPrefectureId }, false, true)"
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
          <a-button @click="handleExportXls('专区商品')" icon="download" type="primary">导出</a-button>
          <a-upload
            :action="importExcelUrl"
            :headers="tokenHeader"
            :multiple="false"
            :showUploadList="false"
            @change="handleImportExcel"
            name="file"
          >
            <!--<a-button icon="import" type="primary">导入</a-button>-->
          </a-upload>
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
            :scroll="{ x: true }"
            :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            @change="handleTableChange"
            ref="table"
            rowKey="id"
            size="middle"
          >
            <template slot="mainPicture" slot-scope="text, record, index">
              <img class="clickShowImage " :preview="'mainPicture' + index" :src="text" alt="" />
            </template>

            <template slot="isViewMarketPrice" slot-scope="text, record">
              <span v-if="text == 1">
                {{ record.marketPrice }}
              </span>
              <span v-else>
                -
              </span>
            </template>

            <template slot="typeName" slot-scope="text, record">
              <span v-if="text">
                {{ text }}
              </span>
              <span v-else>
                无分类
              </span>
            </template>
            <!--//0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣-->
            <template slot="isWelfare" slot-scope="text, record, index">
              <div v-if="text == 1">
                福利金全额抵扣
              </div>
              <div v-else-if="text == 2" style="display: flex;align-items: center;height: 50px;justify-content: center">
                福利金限额抵扣(按专区价) {{ record.welfareProportion }}%
              </div>
              <div v-else-if="text == 3" style="display: flex;align-items: center;height: 50px;justify-content: center">
                福利金限额抵扣(按利润) {{ record.welfareProportion }}%
              </div>
              <div v-else>
                不支持
              </div>
            </template>
            <template slot="isVipLower" slot-scope="text, record, index">
              <div v-if="text == 1">
                支持
              </div>
              <div v-else>
                不支持
              </div>
            </template>
            <template slot="isGiveWelfare" slot-scope="text, record, index">
              <div v-if="text == 1" style="display: flex;align-items: center;height: 50px;justify-content: center">
                {{ record.giveWelfareProportion }}%
              </div>
              <div v-else>
                不支持
              </div>
            </template>

            <template slot="isIntegral" slot-scope="text, record, index">
              <div v-if="text == 1" style="display: flex;align-items: center;height: 50px;justify-content: center">
                {{ record.goodListSpecificationList[0].proportionIntegral }}%
              </div>
              <div v-else>
                不支持
              </div>
            </template>
            <template slot="status" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <span shape="square" v-if="record.status == 0">停用</span>
                <span shape="square" v-if="record.status == 1">启用</span>
                <span shape="square" v-if="record.status == 3">失效</span>
              </div>
            </template>
            <template slot="srcStatus" slot-scope="text, record, index">
              <div class="anty-img-wrap">
                <span shape="square" v-if="record.srcStatus == 0">不可用</span>
                <span shape="square" v-if="record.srcStatus == 1">可用</span>
              </div>
            </template>
            <span slot="action" slot-scope="text, record">
              <a @click="openPop(7, record)" v-if="record.status == 1">停用</a>
              <a @click="openPop(7, record)" v-if="record.status == 0">启用</a>
              <a-divider type="vertical" />
              <a-dropdown>
                <a class="ant-dropdown-link">
                  更多 <a-icon type="down" />
                </a>
                <a-menu slot="overlay">
                 <a-menu-item>
                  <a @click="copyAddress(record.id)" v-if="record.status != 3">复制地址</a>
                 </a-menu-item>
                    <a-menu-item>
              <a @click="openPop(9, record)">删除</a>
                    </a-menu-item>
                    <a-menu-item>
                <a @click="openPop(10, record)">排序</a>
                    </a-menu-item>
                    <a-menu-item>
              <a @click="openPop(2, record)" v-if="record.status != 3">专区分类</a>
                    </a-menu-item>
                    <a-menu-item>
              <a @click="openPop(3, record)" v-if="record.status != 3">专区价</a>
                    </a-menu-item>
                    <a-menu-item>
              <a @click="openPop(4, record)" v-if="record.status != 3">福利金抵扣</a>
                    </a-menu-item>
                    <a-menu-item><a @click="openPop(5, record)" v-if="record.status != 3">赠送福利金</a> </a-menu-item>
                    <a-menu-item> <a @click="openPop(1, record)" v-if="record.status != 3">购买限制</a></a-menu-item>
                 </a-menu>
               </a-dropdown>
            </span>
            <template slot="buyProportionDay" slot-scope="text, record">
              <!--              <a v-if="record.buyProportionDay > 0" @click="openPop(1,record)"> 限时</a>-->
              <!--              <a v-else @click="openPop(1,record)">不限时</a>-->
              <!--              <a v-if="record.buyProportionLetter > 0" @click="openPop(1,record)">-->
              <!--                限量-->
              <!--              </a>-->
              <!--              <a v-else @click="openPop(1,record)">-->
              <!--                不限量-->
              <!--              </a>-->

              <div v-if="buyLimit == 0">
                <a @click="openPop(1, record)"> 可购买{{ record.buyProportionLetter }}件 </a>
              </div>

              <div v-else>
                --
              </div>
            </template>
          </a-table>
        </div>
        <!-- table区域-end -->

        <!-- 表单区域 -->
        <!--        <marketingPrefectureGood-modal></marketingPrefectureGood-modal>-->
        <marketingPrefectureGoodAllModal
          @ok="loadData('', true)"
          ref="modalForm"
          :marketingPrefectureId="marketingPrefectureId"
        >
        </marketingPrefectureGoodAllModal>
      </a-card>
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<script>
import MarketingPrefectureGoodModal from './modules/MarketingPrefectureGoodModal'
import marketingPrefectureGoodAllModal from './modules/marketingPrefectureGoodAllModal'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction } from '@/api/manage'

export default {
  name: 'MarketingPrefectureGoodList',
  mixins: [JeecgListMixin],
  components: {
    MarketingPrefectureGoodModal,
    marketingPrefectureGoodAllModal
  },
  data() {
    return {
      marketingPrefectureTypeIds: [], //当前选择分类id
      classifactionList: '', //专区分类列表
      buyLimit: '', //当前分类专区购买限制；0：商品自定义限购；1：专区限购
      description: '专区商品管理页面',
      listData: [],
      //卡片加载
      cardLoading: false,
      marketingPrefectureId: '',
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      goodUrl: '', //复制链接
      //供应链接口用
      page: '',
      count: '',

      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: '',
        createTime: [],
        typeName: ''
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
          dataIndex: 'goodTypeNames'
        },
        {
          title: '排序',
          align: 'center',
          dataIndex: 'sort'
        },
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'isViewMarketPrice',
          scopedSlots: { customRender: 'isViewMarketPrice' }
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
          title: '商品折扣',
          align: 'center',
          dataIndex: 'discount'
        },
        {
          title: '专区折扣',
          align: 'center',
          dataIndex: 'prefecturePriceProportion',
          scopedSlots: { customRender: 'prefecturePriceProportion' }
        },
        {
          title: '专区价',
          align: 'center',
          dataIndex: 'prefecturePrice',
          sorter: (a, b) => a.prefecturePrice - b.prefecturePrice
        },
        {
          title: '专区分类',
          align: 'center',
          dataIndex: 'typeName',
          scopedSlots: { customRender: 'typeName' }
        },

        // ；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣
        {
          title: '积分抵扣',
          align: 'center',
          dataIndex: 'isWelfare',
          scopedSlots: { customRender: 'isWelfare' }
        },
        {
          title: 'vip免积分抵扣',
          align: 'center',
          dataIndex: 'isVipLower',
          scopedSlots: { customRender: 'isVipLower' }
        },
        // ；0：不支持；1：支持
        {
          title: '赠送积分',
          align: 'center',
          dataIndex: 'isGiveWelfare',
          scopedSlots: { customRender: 'isGiveWelfare' }
        },
        {
          title: '免费积分抵扣比例',
          align: 'center',
          dataIndex: 'isIntegral',
          scopedSlots: { customRender: 'isIntegral' }
        },
        {
          title: '购买限制',
          align: 'center',
          dataIndex: 'buyProportionDay',
          scopedSlots: { customRender: 'buyProportionDay' }
        },
        {
          title: '购买人限制',
          align: 'center',
          dataIndex: 'buyerLimit_dictText'
        },
        {
          title: '供应商',
          align: 'center',
          dataIndex: 'realname'
        },
        {
          title: '状态', //：0：停用；1：启用
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '原商品状态', //：0：不可用；1：可用
          align: 'center',
          dataIndex: 'srcStatus',
          scopedSlots: { customRender: 'srcStatus' }
        },

        {
          title: '停用说明', //状态说明，
          align: 'center',
          dataIndex: 'closeExplian'
        },
        // {
        //   title: '创建者',
        //   align: 'center',
        //   dataIndex: 'createBy'
        // }, {
        //   title: '创建时间',
        //   align: 'center',
        //   dataIndex: 'createTime'
        // },

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

        // {
        //   title: '赠送福利金比例',
        //   align: 'center',
        //   dataIndex: 'giveWelfareProportion'
        // },

        // 购买天数;-1：不限制；其他代表天数 buyProportionDay
        // 可购买件数；-1：不限制；其他代表件数 buyProportionLetter

        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          scopedSlots: { customRender: 'action' },
          fixed: 'right'
        }
      ],
      url: {
        list: '/marketingPrefectureGood/marketingPrefectureGood/list',
        delete: '/marketingPrefectureGood/marketingPrefectureGood/delete',
        deleteBatch: '/marketingPrefectureGood/marketingPrefectureGood/deleteBatch',
        exportXlsUrl: 'marketingPrefectureGood/marketingPrefectureGood/exportXls',
        importExcelUrl: 'marketingPrefectureGood/marketingPrefectureGood/importExcel',
        //专区分类左边  参数 prefectureName null || 指定名字
        getMarketingPrefecture: '/marketingPrefecture/marketingPrefecture/getMarketingPrefecture',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        updateFrameStatus: '/goodList/goodList/updateFrameStatus',
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
    //获取当前专区下的所有分类
    getMarketingPrefectureTypeAll() {
      getAction(this.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: this.marketingPrefectureId }).then(
        res => {
          if (res.success) {
            this.classifactionList = res.result
          }
        }
      )
    },

    routerTo() {
      if (!this.marketingPrefectureId) {
        this.$message.warn('请在左侧选择对应专区')
        return
      }
      this.$router.push({
        path: '/marketing/modules/AddMarketingCommodityModel',
        query: {
          marketingPrefectureId: this.marketingPrefectureId
        }
      })
    },
    openPop(state = 1, item) {
      this.$refs.modalForm.open(state, item)
    },
    // 分类左边方法封装
    leftListMethods(prefectureName = '') {
      this.cardLoading = true
      getAction(this.url.getMarketingPrefecture, {
        prefectureName,
        isViewType: '',
        isViewPrefectureRecommended: ''
      }).then(res => {
        if (res.success) {
          if (res.result.length > 0) {
            this.marketingPrefectureId = res.result[0].id
            this.loadData(res.result[0])
          }
          for (let item of res.result) {
            if (item['logoAddr']) {
              item['logoAddr'] = this.url.imgerver + '/' + Object.values(JSON.parse(item['logoAddr']))[0]
            } else {
              item['logoAddr'] = ''
            }
          }
          this.listData = res.result
        }
        this.cardLoading = false
      })
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination
      this.loadData(
        {
          id: this.marketingPrefectureId
        },
        true
      )
    },
    loadData(
      item = {
        id: this.marketingPrefectureId
      },
      isMore = false,
      isReset = false
    ) {
      this.getMarketingPrefectureTypeAll()

      if (item.buyLimit) {
        this.buyLimit = item.buyLimit
      }

      if (!item) {
        item = {
          id: this.marketingPrefectureId
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
      let marketingPrefectureId = item.id
      this.loading = true

      this.marketingPrefectureId = marketingPrefectureId
      let info = Object.assign({}, { marketingPrefectureId }, this.queryParam, {
        pageNo: this.ipagination.current,
        pageSize: this.ipagination.pageSize
      })
      getAction(this.url.list, info).then(res => {
        if (res.success) {
          for (let item of res.result.records) {
            let minOrMax = []
            let noExcept = 0 //不支持
            if (item.mainPicture) {
              item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
            for (let item2 of item.goodListSpecificationList) {
              if (item2.isWelfare == 2) {
                minOrMax.push(item2.welfareProportion * 1)
              } else if (item2.isWelfare == 1) {
                minOrMax.push(100)
              } else {
                noExcept++
              }
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
                  id: this.marketingPrefectureId
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
