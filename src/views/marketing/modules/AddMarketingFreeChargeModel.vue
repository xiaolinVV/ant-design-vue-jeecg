<template>
  <a-card :bordered="false" class="AddMarketingFreeChargeModel" :loading="cardLoading">
    <div class="title">
      添加商品
    </div>
    <a-alert
      message="重要提示：先批量设置过后再单独调整价格，避免单独设置的价格被批量操作覆盖。选择商品时请合理设置价格，避免造成不必要的亏损"
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
            <a-form-item label="商品编号">
              <a-input placeholder="请输入商品编号" v-model="queryParam.goodNo" style="width: 100%"></a-input>
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
                  v-model="queryParam.discountStart"
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
                  v-model="queryParam.discountEnd"
                />
              </a-input-group>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="6">
            <a-form-item label="供应商">
              <a-input placeholder="请输入供应商" v-model="queryParam.sysUserName"></a-input>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="8">
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
              :rowSelection="rowSelection"
              :dataSource="dataSource"
              :loading="tableLoading"
              :scroll="{ x: 2000 }"
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
              <template slot="marketingFreeGoodTypeId" slot-scope="text, record">
                <a-select
                  :disabled="!record.mainLine"
                  v-model="record.marketingFreeGoodTypeId"
                  @change="mainLineChange(record)"
                  style="width:120px"
                >
                  <a-select-option value="">
                    请选择
                  </a-select-option>
                  <a-select-option :value="item.value" v-for="(item, index) in prefectureType" :key="index">
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </template>
              <template slot="discount" slot-scope="text, record">
                {{ record.discountStart + '-' + record.discountEnd }}
              </template>
              <template slot="freePriceProportion" slot-scope="text, record, index">
                <a-input-number
                  @change="prefecturePriceProportionChange(record)"
                  v-model="record.freePriceProportion"
                  style="width: 80px"
                  :min="0"
                />
                <!-- @change="prefecturePriceProportionChange(record)" -->
                %
              </template>

              <template slot="marketPrice" slot-scope="text, record, index">
                <div v-if="record.isViewMarketPrice == 1">
                  text
                </div>
                <div v-else>
                  --
                </div>
              </template>

              <template slot="freePrice" slot-scope="text, record, index">
                <!--              allData.freePriceProportion * record.price / 100-->
                <a-input-number
                  v-model="record.freePrice"
                  style="width: 100px"
                  :min="0"
                  @change="prefecturePriceChange(record)"
                />
                <!-- @change="prefecturePriceChange(record)" -->
              </template>
            </a-table>
          </a-col>
        </a-row>
        <a-button type="primary" html-type="submit" style="margin: 30px auto;display: block;">
          提交
        </a-button>
      </a-form>
    </div>

    <AddMarketingChargeSelectStoreModel
      ref="AddMarketingChargeSelectStoreModel"
      :selectedRowKeysFrom="modelOkInfo.ids"
      :marketingPrefectureId="marketingPrefectureId"
      @handleOK="modelOk"
    >
    </AddMarketingChargeSelectStoreModel>

    <AddMarketingFreeChargeSetAllModel
      ref="AddMarketingFreeChargeSetAllModel"
      :id="marketingPrefectureId"
      @handleOK="PrefectureIdModelok"
    >
    </AddMarketingFreeChargeSetAllModel>
  </a-card>
</template>

<script>
import AddMarketingChargeSelectStoreModel from './AddMarketingChargeSelectStoreModel'
import AddMarketingFreeChargeSetAllModel from './AddMarketingFreeChargeSetAllModel'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'AddMarketingFreeChargeModel',
  data() {
    return {
      // buyLimit: '',//1:专区限购,0:商品自定义限购
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      cardLoading: false,
      tableLoading: false,
      areaOptions: [],
      astrictPriceProportion: 100,
      disabled: false,
      dataSource: [],
      /* table选中keys*/
      selectedRowKeys: [],
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
          dataIndex: 'goodNo',
          align: 'center'
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
          dataIndex: 'goodTypeName',
          key: 'goodTypeName',
          align: 'center',
          width: 150
        },
        {
          title: '活动分类',
          dataIndex: 'marketingFreeGoodTypeId',
          key: 'marketingFreeGoodTypeId',
          align: 'center',
          scopedSlots: { customRender: 'marketingFreeGoodTypeId' },
          width: 200
        },
        {
          title: '市场价',
          dataIndex: 'marketPrice',
          key: 'marketPrice',
          align: 'center',
          width: 150
        },

        {
          title: '销售价',
          dataIndex: 'price',
          key: 'price',
          align: 'center'
        },
        // {
        //   title: '规格',
        //   dataIndex: 'specification',
        //   key: 'specification',
        //   align: 'center'
        // },
        // {
        //   title: '库存',
        //   dataIndex: 'repertory',
        //   key: 'repertory',
        //   align: 'center'
        // },
        // {
        //   title: '商品折扣',
        //   dataIndex: 'discount',
        //   key: 'discount',
        //   align: 'center',
        //   scopedSlots: { customRender: 'discount' }
        // },
        {
          title: '活动折扣',
          dataIndex: 'freePriceProportion',
          key: 'freePriceProportion',
          align: 'center',
          scopedSlots: { customRender: 'freePriceProportion' }
        },
        {
          title: '活动价格',
          dataIndex: 'freePrice',
          key: 'freePrice',
          align: 'center',
          scopedSlots: { customRender: 'freePrice' }
        },
        {
          title: '供应商',
          dataIndex: 'sysUserName',
          key: 'sysUserName',
          align: 'center'
        },
        {
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          align: 'center',
          width: 200,
          scopedSlots: { customRender: 'operation' },
          fixed: 'right'
        }
      ],
      selectedRowKeys: [], // Check here to configure the default column
      marketingPrefectureId: '',
      allData: {},
      //选中专区商品
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        // postGoodListList: 'marketingPrefecture/marketingPrefecture/postGoodListList',
        getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
        //获取对应活动分类
        getMarketingPrefectureType: 'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType',
        //获取专区二级分类
        findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        queryById: '/marketingPrefecture/marketingPrefecture/queryById',
        //提交接口
        chooseAddGood: 'marketing/marketingFreeGoodList/chooseAddGood',
        //获取免单活动商品类型（1）
        getAllMarketingFreeGoodType: 'marketing/marketingFreeGoodType/getAllMarketingFreeGoodType'
      },
      //查询条件
      queryParam: {
        goodTypeIdOne: '',
        goodTypeIdTwo: '',
        goodTypeIdThree: '',
        goodName: '',
        sysUserName: '',
        goodNo: '',
        discountStart: '',
        discountEnd: '',
        goodTypeId: ''
      },
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      prefectureType: [], //活动分类
      modelOkInfo: '',
      subMitDataSource: '',
      memberType: [],
      allDataSource: []
    }
  },
  components: {
    AddMarketingChargeSelectStoreModel,
    AddMarketingFreeChargeSetAllModel
  },

  async created() {
    this.marketingPrefectureId = this.$route.query.marketingPrefectureId || ''

    this.goodTypeListcascade('0')
    await this.getMarketingPrefectureType()
    this.loadData()
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
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      // this.selectionRows = selectionRows
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
      this.$refs.AddMarketingChargeSelectStoreModel.open()
    },
    setAll() {
      this.$refs.AddMarketingFreeChargeSetAllModel.open()
    },
    mainLineChange(record) {
      for (let item of this.dataSource) {
        if (item.mainGoodId == record.mainGoodId) {
          this.$set(item, 'marketingFreeGoodTypeId', record.marketingFreeGoodTypeId)
        }
      }
    },
    async handleSubmit(e) {
      e.preventDefault()
      if (this.dataSource.length <= 0) {
        this.$message.warn('请选择商品！')
        return
      }
      if (!this.submitCheck()) {
        this.$message.warn('请填写完整表中的数据')
        return
      }
      let subMitDataSource = JSON.parse(JSON.stringify(this.subMitDataSource))
      let resALL = []
      for (let item of subMitDataSource) {
        let ret
        for (let index = 0; index < item.goodSpecificationList.length; index++) {
          for (let item2 of this.dataSource) {
            if (item2.mainGoodId == item.id && index == item2.sort) {
              ret = {
                id: item.id,
                marketingFreeGoodTypeId: item2.marketingFreeGoodTypeId,
                marketingFreeGoodSpecifications: item.goodSpecificationList
              }
              // item.marketingFreeGoodSpecifications = item.goodSpecificationList
              ret.marketingFreeGoodSpecifications[index] = {
                // goodSpecificationId: item2.goodSpecificationId,
                // goodSpecificationId: item2.specification,
                goodSpecificationId: item2.id,
                freePrice: item2.freePrice,
                freePriceProportion: item2.freePriceProportion
              }
            }
          }
        }
        setTimeout(() => {
          resALL.push(ret)
        }, 100)
      }
      await new Promise(resolve => {
        setTimeout(() => {
          resolve(resALL)
        }, 500)
      })
      // return
      postAction(this.url.chooseAddGood, JSON.stringify(resALL), {
        'Content-Type': 'application/json'
      }).then(res => {
        if (res.success) {
          this.$message.success(res.message || '添加成功！')
          setTimeout(() => {
            this.$router.push({ path: '/marketing/MarketingFreeGoodListList' })
          }, 500)
        } else {
          this.$message.warn(res.message || '添加失败！')
        }
      })
    },
    getMarketingPrefectureType() {
      this.cardLoading = true
      return new Promise(resolve => {
        getAction(this.url.getAllMarketingFreeGoodType).then(res => {
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
      this.cardLoading = false
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
        firstPd =
          this.isEmpty(item.freePrice) &&
          this.isEmpty(item.freePriceProportion) &&
          this.isEmpty(item.marketingFreeGoodTypeId)

        return firstPd
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
    async modelOk(info = this.modelOkInfo, search = false) {
      this.tableLoading = true
      this.modelOkInfo = info
      let sz = []
      console.log(info.subMitDataSource)
      for (let item of info.subMitDataSource) {
        // if (item.mainPicture) {
        //   item.mainPicture = this.url.imgerver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
        // }
        item.goodSpecificationList[0].mainLine = true
        for (let index = 0; index < item.goodSpecificationList.length; index++) {
          item.goodSpecificationList[index].mainGoodId = item.id
          item.goodSpecificationList[index].sort = index
          let resultItem = Object.assign({}, item, item.goodSpecificationList[index])
          let hasResult = this.allDataSource.filter(
            v => v.mainGoodId == resultItem.mainGoodId && v.sort == resultItem.sort
          )
          if (hasResult && hasResult.length > 0) {
            resultItem = hasResult[0]
          }
          sz.push(resultItem)
        }
      }
      this.subMitDataSource = info.subMitDataSource
      await this.$nextTick()
      this.allDataSource = sz
      this.dataSource = sz
      this.tableLoading = false
    },
    PrefectureIdModelok(info) {
      if (this.dataSource.length <= 0) {
        this.$message.warn('请选择商品！')
        return
      }
      for (let item of this.dataSource) {
        this.$set(item, 'freePriceProportion', info.freePriceProportion)
        this.$set(item, 'marketingFreeGoodTypeId', info.marketingFreeGoodTypeId)
        this.prefecturePriceProportionChange(item)
      }
    },
    //活动折扣输入框改变值
    prefecturePriceProportionChange(record) {
      this.$set(record, 'freePrice', this.keepSecondCount((record.freePriceProportion * record.price) / 100) || '0')
    },
    //活动价格输入框改变值
    prefecturePriceChange(record) {
      this.$set(record, 'freePriceProportion', this.keepSecondCount((record.freePrice / record.price) * 100) || '0')
    },
    //查询
    search() {
      let queryParam = Object.freeze(this.queryParam),
        retnIndex = {
          goodName: 0,
          goodNo: 0,
          sysUserName: 0,
          goodTypeId: 1,
          // goodTypeIdOne: 1,
          // goodTypeIdTwo: 1,
          // goodTypeIdThree: 1,
          discountStart: 2,
          discountEnd: 3
        },
        rules = (v, key) => {
          let rets =
            queryParam[key] === '' || queryParam[key] == undefined
              ? true
              : [
                  queryParam[key] && v[key] && v[key].indexOf(queryParam[key]) !== -1,
                  v[key] === queryParam[key],
                  queryParam[key] >= v[key],
                  queryParam[key] <= v[key]
                ][retnIndex[key]]
          return rets
        }
      console.log(rules)
      this.dataSource = this.allDataSource.filter(v => {
        let ret = true
        Object.keys(queryParam).forEach(key => {
          ret = rules(v, key) && ret
        })
        return ret
      })
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
.AddMarketingFreeChargeModel {
  .title {
    width: 100%;
    height: 50px;
    color: black;
    display: flex;
    justify-content: space-between;
    padding-bottom: 10px;
    font-size: 18px;
    font-weight: 700;
    align-items: center;
    border-bottom: 1px solid #cccccc;
    margin-bottom: 10px;

    span:nth-child(2) {
      padding: 15px;
      cursor: pointer;
    }
  }

  .line-wrap:last-child {
    box-sizing: content-box;
    padding-bottom: 20px;
    border-bottom: 1px solid #cccccc;
  }

  .line-wrap {
    display: flex;
    align-items: center;
    height: 40px;
    font-size: 14px;
    width: 60vw;
    margin-bottom: 10px;

    .label,
    .value {
      display: flex;
      align-items: center;
      height: 100%;
    }

    .label {
      width: 15%;
      /*height: 100%;*/
      /*text-align: right;*/
      justify-content: flex-end;
      margin-right: 30px;
    }

    .value {
      width: 40%;
      /*height: 100%;*/
      justify-content: left;
    }
  }
}
</style>
