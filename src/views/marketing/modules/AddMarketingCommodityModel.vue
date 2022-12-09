<template>
  <a-card :bordered="false" class="AddMarketingCommodityModel" :loading="cardLoading">
    <div class="title">
      添加商品
    </div>
    <div class="line-wrap" v-for="(item, index) in limitLsit" :key="index">
      <div class="label">
        <span class="dataCheckedStar" v-if="item.isMust">
          *
        </span>
        {{ item.label }}：
      </div>
      <div class="value">
        {{ item.value }}
      </div>
    </div>
    <a-alert
      message="  重要提示：先批量设置过后再单独调整价格，避免单独设置的价格被批量操作覆盖。选择商品时请合理设置价格，避免造成不必要的亏损"
      type="info"
    />

    <div class="table-page-search-wrapper">
      <a-form layout="inline" style="margin-top: 20px" @submit="handleSubmit">
        <a-row :gutter="24">
          <a-col :md="6" :sm="6">
            <a-form-item label="商品名称">
              <a-input placeholder="请输入商品名称" v-model="queryParam.goodName" style="width: 100%"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item style="display: flex;justify-content: space-between;width: 100%" label="商品分类">
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
          <a-col :md="6" :sm="6">
            <a-form-item label="商品折扣" style="width: 100%;display: flex">
              <a-input-group compact>
                <a-input-number
                  :min="0"
                  :max="astrictPriceProportion"
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
                  :max="astrictPriceProportion"
                  :formatter="value => `${value}%`"
                  :parser="value => value.replace('%', '')"
                  style="width: 45%; text-align: center; border-left: 0"
                  :disabled="disabled"
                  placeholder="请输入"
                  v-model="astrictPriceProportion"
                />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="供应商">
              <a-input placeholder="请输入供应商" v-model="queryParam.realname"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8" style="margin-top: 10px">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="search">查询</a-button>
              <a-button type="primary" @click="selectStore" icon="select" style="margin-left: 8px">选择商品</a-button>
              <a-button type="primary" icon="setting" style="margin-left: 8px" @click="setAll">批量设置</a-button>
            </span>
          </a-col>
          <a-col :md="24" :sm="24" style="margin-top: 10px">
            <!--          <a-input-number id="inputNumber" :min="1" :max="10" v-model="value" @change="onChange" />-->
            <!--          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
            <a-table
              :columns="columns"
              :dataSource="dataSource"
              :loading="tableLoading"
              :scroll="{ x: 3300 }"
              class="components-table-demo-nested"
              rowKey="id"
            >
              <!--              <a-icon type="smile-o" />-->
              <span slot="buylimitTitle">购买限制</span>
              <template slot="operation" slot-scope="text, record, index">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="确定删除吗？"
                  @confirm="() => onDelete(record.mainGoodId)"
                >
                  <a href="javascript:;">删除</a>
                </a-popconfirm>
              </template>
              <template slot="picture" slot-scope="text, record, index">
                <img
                  preview="1"
                  :src="text"
                  alt=""
                  style="width: 50px;height: 50px;display: inline-block;vertical-align: middle"
                />
              </template>
              <template slot="marketingPrefectureTypeId" slot-scope="text, record, index">
                <div v-if="limitLsit[2].value != '自定义分类'">
                  无分类
                </div>
                <div v-else>
                  <!--                  <a-select  style="width: 120px" v-model="record.marketingPrefectureTypeId" :disabled="!record.mainLine" @change="mainLineChange(record)">-->
                  <!--                    <a-select-option value="">请选择</a-select-option>-->
                  <!--                    <a-select-option v-for="item in prefectureType" :value="item.id">{{item.typeName}}</a-select-option>-->
                  <!--                  </a-select>-->
                  <a-cascader
                    :options="prefectureType"
                    :loadData="prefectureTypeDataLoad"
                    changeOnSelect
                    @change="mainLineChange(record)"
                    v-model="record.marketingPrefectureTypeId"
                    :disabled="!record.mainLine"
                    style="width: 100%"
                    placeholder="请选择专区分类"
                  />
                </div>
              </template>
              <template slot="prefecturePriceProportion" slot-scope="text, record, index">
                <a-input-number
                  v-model="record.prefecturePriceProportion"
                  style="width: 80px"
                  :min="0"
                  @change="prefecturePriceProportionChange(record)"
                />
                %
              </template>
              <template slot="isWelfare" slot-scope="text, record, index">
                <div v-if="text == 1">
                  福利金全额抵扣
                </div>
                <div
                  v-else-if="text == 2"
                  style="display: flex;align-items: center;height: 50px;justify-content: center"
                >
                  <span style="margin-right: 10px;">
                    福利金限额抵扣(按专区价)
                  </span>
                  <a-input-number v-model="record.welfareProportion" style="width: 100px;margin-right: 10px;" />
                  %
                </div>
                <div
                  v-else-if="text == 3"
                  style="display: flex;align-items: center;height: 50px;justify-content: center"
                >
                  <span style="margin-right: 10px;">
                    福利金限额抵扣(按利润)
                  </span>
                  <a-input-number v-model="record.welfareProportion" style="width: 100px;margin-right: 10px;" />
                  %
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

              <template slot="marketPrice" slot-scope="text, record, index">
                <div v-if="record.isViewMarketPrice == 1">
                  text
                </div>
                <div v-else>
                  --
                </div>
              </template>

              <template slot="isGiveWelfare" slot-scope="text, record, index">
                <div v-if="text == 1" style="display: flex;align-items: center;height: 50px;justify-content: center">
                  <div style="margin-right: 10px;">
                    最高可送
                  </div>
                  <a-input-number v-model="record.giveWelfareProportion" style="width: 100px;margin-right: 10px;" />
                  %
                </div>
                <div v-else>
                  不支持
                </div>
              </template>
              <template slot="prefecturePrice" slot-scope="text, record, index">
                <!--              allData.prefecturePriceProportion * record.price / 100-->
                <a-input-number
                  v-model="record.prefecturePrice"
                  style="width: 100px"
                  :min="0"
                  @change="prefecturePriceChange(record)"
                />
              </template>

              <template slot="proportionIntegral" slot-scope="text, record, index">
                  <a-input-number v-model="record.proportionIntegral" style="width: 150px" />%
              </template>

              <template slot="buylimit" slot-scope="text, record, index">
                <!--              <a-input-number :min="-1" v-model="record.buyProportionDay" style="width: 60px" />-->
                <!--              天，-->
                <div v-if="allData.buyLimit == 1">
                  - -
                </div>

                <div v-else>
                  可购买
                  <a-input v-model="record.buyProportionLetter" style="width: 60px" />
                  件
                </div>
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit" style="margin: 30px auto;display: block;">
          提交
        </a-button>
      </a-form>
    </div>

    <AddMarketingCommoditySelectStoreModel
      ref="AddMarketingCommoditySelectStoreModel"
      :selectedRowKeysFrom="modelOkInfo.ids"
      :marketingPrefectureId="marketingPrefectureId"
      @handleOK="modelOk"
    >
    </AddMarketingCommoditySelectStoreModel>

    <AddMarketingCommoditySetAllModel
      ref="AddMarketingCommoditySetAllModel"
      :marketingPrefectureId="marketingPrefectureId"
      :limitData="allData"
      @handleOK="PrefectureIdModelok"
    >
    </AddMarketingCommoditySetAllModel>
  </a-card>
</template>

<script>
import AddMarketingCommoditySelectStoreModel from './AddMarketingCommoditySelectStoreModel'
import AddMarketingCommoditySetAllModel from './AddMarketingCommoditySetAllModel'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'AddMarketingCommodityModel',
  data() {
    return {
      // buyLimit: '',//1:专区限购,0:商品自定义限购
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      cardLoading: false,
      tableLoading: false,
      areaOptions: [],
      astrictPriceProportion: 100,
      disabled: true,
      limitLsit: [
        {
          label: '专区id',
          value: '',
          isMust: false
        },
        {
          label: '加入专区',
          value: '',
          isMust: false
        },
        {
          label: '专区分类',
          value: '',
          isMust: false
        },
        {
          label: '专区商品限制',
          value: '',
          isMust: false
        },
        {
          label: '专区价比例',
          value: '',
          isMust: false
        },
        {
          label: '优惠券抵扣',
          value: '',
          isMust: false
        },
        {
          label: '积分抵扣',
          value: '',
          isMust: false
        },
        {
          label: '赠送积分',
          value: '',
          isMust: false
        },
        {
          label: '市场价',
          value: '显示',
          isMust: false
        },
        {
          label: '专区购买限制',
          value: '显示',
          isMust: false
        },
        {
          label: '购买人限制',
          value: '显示',
          isMust: false
        },
        {
          label: '优惠折扣',
          value: '',
          isMust: false
        },
        {
          label: '免费积分抵扣比例%',
          value: '无',
          isMust: false
        }
      ],
      dataSource: [],
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
          align: 'center',
          key: 'picture',
          scopedSlots: { customRender: 'picture' }
        },
        {
          title: '商品名称',
          dataIndex: 'goodName',
          key: 'goodName',
          align: 'center',
          width: 220
        },
        {
          title: '商品分类',
          dataIndex: 'goodTypeNames',
          key: 'goodTypeNames',
          align: 'center',
          width: 150
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          align: 'center',
          width: 150
        },
        {
          title: '专区分类',
          dataIndex: 'marketingPrefectureTypeId',
          key: 'marketingPrefectureTypeId',
          align: 'center',
          scopedSlots: { customRender: 'marketingPrefectureTypeId' },
          width: 200
        },
        {
          title: '销售价',
          dataIndex: 'price',
          key: 'price',
          align: 'center'
        },
        {
          title: '折扣',
          align: 'center',
          dataIndex: 'discount'
        },
        {
          title: '规格',
          dataIndex: 'specification',
          key: 'specification',
          align: 'center'
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          key: 'repertory',
          align: 'center'
        },
        {
          title: '专区折扣',
          dataIndex: 'prefecturePriceProportion',
          key: 'prefecturePriceProportion',
          align: 'center',
          scopedSlots: { customRender: 'prefecturePriceProportion' }
        },
        {
          title: '专区价格',
          dataIndex: 'prefecturePrice',
          key: 'prefecturePrice',
          align: 'center',
          scopedSlots: { customRender: 'prefecturePrice' }
        },
        {
          title: '积分抵扣',
          dataIndex: 'isWelfare',
          key: 'isWelfare',
          align: 'center',
          width: 450,
          scopedSlots: { customRender: 'isWelfare' }
        },
        {
          title: 'vip免积分抵扣',
          dataIndex: 'isVipLower',
          key: 'isVipLower',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'isVipLower' }
        },
        {
          title: '赠送积分',
          dataIndex: 'isGiveWelfare',
          key: 'isGiveWelfare',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'isGiveWelfare' }
        },
        {
          // buy_proportion_day 购买天数;-1：不限制；其他代表天数   //buy_proportion_letter 可购买件数；-1：不限制；其他代表件数
          title: '免费积分抵扣比例%',
          dataIndex: 'proportionIntegral',
          key: 'proportionIntegral',
          slots: { title: 'proportionIntegralTitle' },
          scopedSlots: { customRender: 'proportionIntegral' },
          align: 'center',
          width: 400
        },
        {
          title: '购买限制',
          dataIndex: 'buylimit',
          key: 'buylimit',
          slots: { title: 'buylimitTitle' },
          scopedSlots: { customRender: 'buylimit' },
          align: 'center',
          width: 400
        },
        {
          title: '供应商',
          dataIndex: 'realname',
          key: 'realname',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'operation' }
        }
      ],
      selectedRowKeys: [], // Check here to configure the default column
      marketingPrefectureId: '',
      allData: {},
      //选中专区商品
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        postGoodListList: 'marketingPrefecture/marketingPrefecture/postGoodListList',
        getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
        //获取对应专区分类
        getMarketingPrefectureType: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType',
        //获取专区二级分类
        findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        queryById: '/marketingPrefecture/marketingPrefecture/queryById',
        //提交接口
        addAllMarketingPrefectureGoodAndSpecification:
          '/marketingPrefectureGood/marketingPrefectureGood/addAllMarketingPrefectureGoodAndSpecification'
      },
      //查询条件
      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: '',
        goodName: '',
        realname: ''
      },
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      prefectureType: [], //专区分类
      modelOkInfo: '',
      subMitDataSource: '',
      memberType: []
    }
  },
  components: {
    AddMarketingCommoditySelectStoreModel,
    AddMarketingCommoditySetAllModel
  },
  async created() {
    this.marketingPrefectureId = this.$route.query.marketingPrefectureId || ''
    this.limitLsit[0].value = this.$route.query.marketingPrefectureId || ''
    this.goodTypeListcascade('0')
    await this.getMarketingPrefectureType()
    this.loadData()
  },
  computed() {},
  methods: {
    prefectureTypeDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      console.log(targetOption)
      getAction(this.url.findUnderlingListMap, { id: targetOption.value }).then(res => {
        targetOption.loading = false
        if (res.success && res.result.length > 0) {
          let sz = []
          for (let item of res.result) {
            sz.push({
              label: item.type_name,
              value: item.id
              // isLeaf: false
            })
          }
          targetOption.children = sz
        }
        this.prefectureType = [...this.prefectureType]
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    onDelete(id) {
      let ids
      if (this.modelOkInfo.ids) {
        ids = this.modelOkInfo.ids.split(',')
      }
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.mainGoodId !== id)
      ids = ids.filter(item => item !== id)
      this.modelOkInfo.ids = ids.join(',')

      const subMitDataSource = [...this.subMitDataSource]
      this.subMitDataSource = subMitDataSource.filter(item => item.goodListId !== id)
    },
    selectStore() {
      this.$refs.AddMarketingCommoditySelectStoreModel.open()
    },
    setAll() {
      this.$refs.AddMarketingCommoditySetAllModel.open()
    },
    mainLineChange(record) {
      // console.log(record,this.dataSource);
      for (let item of this.dataSource) {
        if (item.mainGoodId == record.mainGoodId) {
          item.marketingPrefectureTypeId = record.marketingPrefectureTypeId
        }
      }
    },
    handleSubmit(e) {
      e.preventDefault()
      if (this.dataSource.length <= 0) {
        this.$message.warn('请选择商品！')
        return
      }
      if (!this.submitCheck()) {
        this.$message.warn('请填写完整表中的数据')
        return
      }

      for (let item of this.subMitDataSource) {
        for (let index = 0; index < item.goodListSpecificationList.length; index++) {
          for (let item2 of this.dataSource) {
            if (item2.mainGoodId == item.id && index == item2.sort) {
              item.goodListSpecificationList[index] = {
                buyProportionDay: item2.buyProportionDay,
                buyProportionLetter: item2.buyProportionLetter,
                goodSpecificationId: item2.goodSpecificationId,
                id: item2.id,
                isGiveWelfare: item2.isGiveWelfare,
                isWelfare: item2.isWelfare,
                prefecturePrice: item2.prefecturePrice,
                prefecturePriceProportion: item2.prefecturePriceProportion,
                price: item2.price,
                repertory: item2.repertory,
                specification: item2.specification,
                welfareProportion: item2.welfareProportion,
                giveWelfareProportion: item2.giveWelfareProportion,
                isVipLower: item2.isVipLower,
                proportionIntegral:item2.proportionIntegral
              }
              if (item2.sort == 0) {
                console.log(item2.marketingPrefectureTypeId)
                if (Array.isArray(item2.marketingPrefectureTypeId)) {
                  item.marketingPrefectureTypeId = item2.marketingPrefectureTypeId.join(',')
                } else {
                  item.marketingPrefectureTypeId = ''
                }
              }
            }
          }
        }
      }
      postAction(this.url.addAllMarketingPrefectureGoodAndSpecification, this.subMitDataSource).then(res => {
        if (res.success) {
          this.$message.success(res.message || '添加成功！')
          setTimeout(() => {
            this.$router.push({ path: '/marketing/MarketingPrefectureGoodList' })
          }, 500)
        } else {
          this.$message.warn(res.message || '添加失败！')
        }
        console.log(res)
      })
    },
    getMarketingPrefectureType() {
      this.cardLoading = true
      let info = {
        marketingPrefectureId: this.marketingPrefectureId
      }
      return new Promise(resolve => {
        getAction(this.url.getMarketingPrefectureType, info).then(res => {
          if (res.success) {
            let sz = []
            for (let item of res.result) {
              sz.push({
                label: item.typeName,
                value: item.id,
                isLeaf: false
              })
            }
            this.prefectureType = sz
            this.$nextTick(() => {
              resolve()
            })
          } else {
            resolve()
          }
        })
      })
    },
    async loadData() {
      await this.initDictConfig()
      getAction(this.url.queryById, { id: this.marketingPrefectureId }).then(res => {
        if (res.success) {
          this.allData = res.result
          //console.log("this.allData"+JSON.stringify(this.allData) )
          this.limitLsit[1].value = res.result.prefectureName
          if (this.prefectureType.length > 0 && res.result.isViewType == 1) {
            this.limitLsit[2].value = '自定义分类'
          } else {
            this.limitLsit[2].value = '无分类'
          }

          if (res.result.astrictGood == 1) {
            this.limitLsit[3].value = `成本价低于销售价${res.result.astrictPriceProportion}%`
            this.astrictPriceProportion = res.result.astrictPriceProportion
            this.disabled = true
          } else {
            this.limitLsit[3].value = '不限制'
            this.astrictPriceProportion = 100
            this.disabled = false
          }
          // this.limitLsit[4].value = `不低于销售价的${res.result.prefecturePriceProportion}%`
          this.limitLsit[4].value = res.result.prefecturePriceProportion + '%'
          if (res.result.isDiscount == 1) {
            this.limitLsit[5].value = '支持'
          } else {
            this.limitLsit[5].value = '不支持'
          }
          let isWelfare = ''
          if (res.result.isWelfare == 1) {
            isWelfare = '福利金限额抵扣'
          } else if (res.result.isWelfare == 2) {
            isWelfare = `福利金限额抵扣，最高可抵扣(按专区价)${res.result.bigWelfareProportion}%`
          } else if (res.result.isWelfare == 3) {
            isWelfare = `福利金限额抵扣，最高可抵扣(按利润)${res.result.bigWelfareProportion}%`
          } else {
            isWelfare = '不支持'
          }
          if (res.result.isVipLower == 1 && res.result.isWelfare && res.result.isWelfare != '0') {
            isWelfare = isWelfare + '，会员免福利金直抵'
          }

          this.limitLsit[6].value = isWelfare
          if (res.result.isGiveWelfare == 1) {
            this.limitLsit[7].value = `最高可送${res.result.bigGiveWelfareProportion}%`
          } else {
            this.limitLsit[7].value = '不支持'
          }
          if (res.result.isViewMarketPrice == 1) {
            this.limitLsit[8].value = '显示'
          } else {
            this.limitLsit[8].value = '不显示'
            this.columns.splice(3, 1)
          }
          if (res.result.buyLimit == 1) {
            this.limitLsit[9].value = `专区限购${res.result.limitCount}件`
          } else {
            this.limitLsit[9].value = '商品自定义限购'
          }
          this.limitLsit[10].value = res.result.specialDiscount
          let buyerPathNameValue
          let resultName
          if (res.result.buyerLimit) {
            if (res.result.buyerLimit.indexOf(',') == -1) {
              res.result.buyerLimit = res.result.buyerLimit + ','
            }
            buyerPathNameValue = res.result.buyerLimit.split(',')
            resultName = []
            for (let item of this.memberType) {
              for (let item2 of buyerPathNameValue) {
                if (item.value == item2) {
                  resultName.push(item.title)
                }
              }
            }
            resultName = resultName.join(',')
          } else {
            resultName = ''
          }

          if (res.result.buyerLimitName && res.result.buyerLimitName != '[]') {
            this.limitLsit[10].value = resultName + `(${res.result.buyerLimitName})`
          } else {
            this.limitLsit[10].value = resultName
          }
          this.limitLsit[12].value=res.result.proportionIntegral+'%';
        }
        this.cardLoading = false
      })
    },
    initDictConfig() {
      return new Promise(resolve => {
        initDictOptions('member_type').then(res => {
          if (res.success) {
            this.memberType = res.result
          }
          resolve()
        })
      })
    },
    submitCheck() {
      let result = this.dataSource.every(item => {
        let firstPd = false
        let secondPd = false
        if (item.isGiveWelfare == 1) {
          firstPd =
            this.isEmpty(item.giveWelfareProportion) &&
            this.isEmpty(item.buyProportionDay) &&
            this.isEmpty(item.buyProportionLetter) &&
            this.isEmpty(item.prefecturePrice) &&
            this.isEmpty(item.prefecturePriceProportion)
        } else {
          firstPd =
            this.isEmpty(item.buyProportionDay) &&
            this.isEmpty(item.buyProportionLetter) &&
            this.isEmpty(item.prefecturePrice && item.prefecturePriceProportion)
        }
        if (this.limitLsit[2].value == '自定义分类') {
          secondPd = this.isEmpty(item.marketingPrefectureTypeId)
        } else {
          secondPd = true
        }
        return firstPd && secondPd
      })
      return result
    },
    isEmpty(a) {
      if (a === '' || a === null || a === undefined) {
        return false
      } else {
        return true
      }
    },
    modelOk(info = this.modelOkInfo, search = false) {
      this.tableLoading = true
      this.modelOkInfo = info
      postAction(this.url.postGoodListList, info).then(res => {
        this.subMitDataSource = res.result
        console.log(res.result)
        if (res.success) {
          let sz = []
          for (let item of res.result) {
            if (item.mainPicture) {
              item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            }
            item.goodListSpecificationList[0].mainLine = true
            for (let index = 0; index < item.goodListSpecificationList.length; index++) {
              item.goodListSpecificationList[index].mainGoodId = item.id
              item.goodListSpecificationList[index].sort = index
              sz.push(Object.assign({}, item, item.goodListSpecificationList[index]))
            }
          }
          this.dataSource = sz
          console.log(JSON.stringify(this.dataSource))
        }
        this.tableLoading = false
      })
    },
    PrefectureIdModelok(info) {
      if (this.dataSource.length <= 0) {
        this.$message.warn('请选择商品！')
        return
      }
      console.log(info)
      this.prefectureType = info.prefectureType || []
      // if(Array.isArray(info.marketingPrefectureTypeId)){
      //   info.marketingPrefectureTypeId = info.marketingPrefectureTypeId.split(',')
      // }
      for (let item of this.dataSource) {
        item.prefecturePriceProportion = info.districtDiscount
        item.prefecturePrice = info.districtWelfare
        item.buyProportionDay = info.buyProportionDay
        item.buyProportionLetter = info.buyProportionLetter
        item.marketingPrefectureTypeId = info.marketingPrefectureTypeId
        this.prefecturePriceProportionChange(item)
      }
    },
    //专区折扣输入框改变值
    prefecturePriceProportionChange(record) {
      record.prefecturePrice = (record.prefecturePriceProportion * record.price) / 100 || '0'
    },
    //专区价格输入框改变值
    prefecturePriceChange(record) {
      record.prefecturePriceProportion = (record.prefecturePrice / record.price) * 100 || '0'
    },
    //查询
    search() {
      let info = Object.assign({}, this.modelOkInfo, this.queryParam)
      this.modelOk(info, true)
    },
    chooseMedicine: function(value) {
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
    }
  }
}
</script>

<style lang="less">
.AddMarketingCommodityModel {
	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ccc;
		width: 100%;
		height: 50px;
		font-weight: 700;
		font-size: 18px;
		color: black;

		span:nth-child(2) {
			padding: 15px;
			cursor: pointer;
		}
	}

	.line-wrap:last-child {
		box-sizing: content-box;
		padding-bottom: 20px;
		border-bottom: 1px solid #ccc;
	}

	.line-wrap {
		display: flex;
		align-items: center;
		margin-bottom: 10px;
		width: 60vw;
		height: 40px;
		font-size: 14px;

		.label,
		.value {
			display: flex;
			align-items: center;
			height: 100%;
		}

		.label {
			/*height: 100%;*/
			/*text-align: right;*/
			justify-content: flex-end;
			margin-right: 30px;
			width: 15%;
		}

		.value {
			/*height: 100%;*/
			justify-content: left;
			width: 40%;
		}
	}
}

</style>
