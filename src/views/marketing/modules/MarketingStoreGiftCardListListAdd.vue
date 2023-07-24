<template>
  <a-card :border="false" :title="title">
    <a-form :form="form">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="发行店铺">
        <a-select
          show-search
          option-filter-prop="children"
          :filter-option="filterOption"
          style="width:300px"
          v-decorator="rules.storeManageId"
          placeholder="请选择发行店铺"
          @change="storeManageIdChange"
        >
          <a-select-option value="">请选择</a-select-option>
          <a-select-option v-for="item in allStoreList" :key="item.id" :value="item.id">{{
            item.storeName
          }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="卡名称">
        <a-input style="width:200px" placeholder="请输入卡名称" v-decorator="rules.carName"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="面额">
        <a-input-number
          :min="0"
          :precision="2"
          style="width: 200px;"
          placeholder="请输入面额"
          v-decorator="rules.denomination"
        >
        </a-input-number>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          可选商品
        </span>
        <a-button @click="PopUp">
          选择商品
        </a-button>

        <a-table
          :columns="isSelectColumns"
          :dataSource="isSelectData"
          :pagination="{ pageSize: 5 }"
          bordered
          style="margin-top: 20px;"
        >
          <template slot="mainPicture" slot-scope="text">
            <img :src="text" alt=" " style="width: 40px;height: 40px;" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <a-popconfirm v-if="isSelectData.length" title="确定要删除吗?" @confirm="() => onDelete(record.id)">
              <a href="javascript:;">删除</a>
            </a-popconfirm>
          </template>
        </a-table>
        <div>已选择商品共计{{ isSelectData.length }}件</div>
      </a-form-item>

      <a-form-item label="有效期" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!--          v-model="model.timeWay"-->
        <a-radio-group
          style="display: flex;align-items: center;flex-wrap: wrap;"
          v-decorator="rules.timeWay"
          @change="timeWayChange"
        >
          <div>
            <a-radio :value="0">
              <!-- :defaultValue="timeWayDefaultValue" -->
              <a-range-picker v-model="selectDateToTime" :disabled="model.timeWay != 0" />
            </a-radio>
          </div>
          <div style="margin-right:10px">
            <a-radio :value="1"> 当日起</a-radio>
            <a-input-number style="width: 75px;" :precision="0" v-model="today" :disabled="model.timeWay != 1" />
            <a-select style="width: 120px;margin-left: 10px;" v-model="todayMonad" @click.stop>
              <a-select-option value="0">
                天
              </a-select-option>
              <a-select-option value="1">
                周
              </a-select-option>
              <a-select-option value="2">
                月
              </a-select-option>
            </a-select>
            内可用
          </div>
          <div>
            <a-radio :value="2">
              次日起
            </a-radio>
            <a-input-number :precision="0" style="width: 75px;" v-model="tomorrow" :disabled="model.timeWay != 2" />
            <a-select style="width: 120px;margin-left: 10px;" v-model="tomorrowMonad" @click.stop>
              <a-select-option value="0">
                天
              </a-select-option>
              <a-select-option value="1">
                周
              </a-select-option>
              <a-select-option value="2">
                月
              </a-select-option>
            </a-select>
            内可用
          </div>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="礼品卡说明" :label-col="labelCol" :wrapper-col="wrapperCol">
        <JEditor v-model="model.carExplain" placeholder="礼品卡说明能让客户更加了解礼品卡"> </JEditor>
      </a-form-item>
    </a-form>
    <select-goods-to-add-pop-up
      ref="selectGoodsToAddPopUp"
      :selectGoodsPopUpLists="isSelectData"
      @handleCancel="PopUp"
      @handleOk="selectGoodsHandleOk"
      :selectGoodsPopUpIds="selectGoodsPopUpIds"
      :storeManageId="model.storeManageId"
      :sysUserId="model.storeManageId"
      apiName="selectStoreGoods"
    >
    </select-goods-to-add-pop-up>
    <div class="button-end"></div>

    <div class="button-operation">
      <a-button @click="cancel">
        取消
      </a-button>
      <a-button type="primary" @click="sure">
        确认
      </a-button>
    </div>
  </a-card>
</template>
<script>
import moment from 'moment'
import JEditor from '@/components/jeecg/JEditor'
import { httpAction, getAction } from '@/api/manage'
import pick from 'lodash.pick'
import selectGoodsToAddPopUp from '@/components/popUp/selectGoodsToAddPopUp.vue'
import dayjs from 'dayjs'
export default {
  name: 'MarketingStoreGiftCardListListAdd',
  data() {
    return {
      title: '添加礼品卡',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 22 }),
      model: {},
      //开始结束时间
      selectDateToTime: '',
      //日期选择器返现参数
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      ShowPopUp: false,
      //已经选择的选择商品数据
      isSelectData: [],
      goodStoreListIds: '',
      //选择商品保存的id
      selectedRowKeys: [],
      today: '',
      todayMonad: '',
      tomorrow: '',
      tomorrowMonad: '',
      //商品返现表头
      isSelectColumns: [
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
        },

        {
          title: '操作',
          dataIndex: 'operation',
          // className: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center'
        }
      ],
      rules: Object.freeze({
        carName: [
          'carName',
          {
            rules: [
              { required: true, message: '请输入卡名称' }
              // {
              //   max: 4,
              //   message: '字数不能超过4个字'
              // }
            ]
          }
        ],
        denomination: ['denomination', { rules: [{ required: true, message: '请输入面额' }] }],
        storeManageId: ['storeManageId', { rules: [{ required: true, message: '请选择发行店铺' }] }],
        timeWay: ['timeWay', { rules: [{ required: true, message: '请选择有效期' }] }]
      }),
      url: {
        //获取店铺列表（1）
        getStoreList: 'marketing/marketingStoreGiftCardList/getStoreList',
        add: '/marketing/marketingStoreGiftCardList/add',
        edit: '/marketing/marketingStoreGiftCardList/edit',
        // 新增和删除商品（1）
        addOrDelStoreGoods: 'marketing/marketingStoreGiftCardList/addOrDelStoreGoods',
        //获取选择的商品（1）
        getSelectGoods: 'marketing/marketingStoreGiftCardList/getSelectGoods'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      },
      allStoreList: [],
      oldStoreManageId: ''
    }
  },
  components: {
    selectGoodsToAddPopUp,
    JEditor
  },
  async created() {
    await this.getAllStore()
    this.init()
  },
  computed: {
    selectGoodsPopUpIds({ goodStoreListIds }) {
      console.log(goodStoreListIds)
      return goodStoreListIds && typeof goodStoreListIds == 'string' ? goodStoreListIds.split(',') || [] : []
    },
    timeWayDefaultValue({ model, moment, dateFormat }) {
      return model.startTime && model.startTime
        ? [moment(model.startTime, dateFormat), moment(model.endTime, dateFormat)]
        : ''
    }
  },
  methods: {
    moment,
    storeManageIdChange(value) {
      const that = this
      if (this.isSelectData && this.isSelectData.length > 0) {
        this.$confirm({
          title: '切换发行店铺',
          content: '切换发行店铺后，您所选择的可选商品数据将被清空且不可找回，确定要切换发行店铺吗？',
          okText: '确定',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            that.model.storeManageId = value
            that.form.setFieldsValue({ storeManageId: value })
            that.oldStoreManageId = value
          },
          onCancel() {
            that.model.storeManageId = that.oldStoreManageId
            that.form.setFieldsValue({ storeManageId: that.oldStoreManageId })
          }
        })
      } else {
        this.model.storeManageId = value
        this.form.setFieldsValue({ storeManageId: value })
        this.oldStoreManageId = value
      }

      // this.model.storeManageId = value
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getSelectGoods() {
      return new Promise(resolve => {
        getAction(this.url.getSelectGoods, { marketingStoreGiftCardListId: this.model.id }).then(res => {
          if (res.success) {
            if (res.result) {
              let sz = []
              for (let item of res.result) {
                sz.push(item.id)
                try {
                  item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
                } catch (error) {
                  console.error(error, '图片解析出错')
                }
              }
              this.isSelectData = res.result
              this.goodStoreListIds = sz.join(',')
              console.log('---------', sz)
            } else {
              this.isSelectData = []
            }
          } else {
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    },
    getAllStore() {
      return new Promise(resolve => {
        getAction(this.url.getStoreList).then(res => {
          if (res.success) {
            this.allStoreList = res.result || []
          } else {
            this.$message.warn(res.message)
          }
          resolve()
        })
      })
    },
    async init() {
      if (this.$route.query.record && this.$route.query.record.id) {
        let record = Object.assign({}, this.$route.query.record)
        record.timeWay = record.timeWay * 1
        this.model = Object.assign({}, this.model, record)
        if (record.startTime && record.endTime) {
          this.selectDateToTime = [moment(record.startTime, this.dateFormat), moment(record.endTime, this.dateFormat)]
        } else {
          this.selectDateToTime = ''
        }

        if (this.model.timeWay == 1) {
          this.today = record.timeDigital
          this.todayMonad = record.timeUnit
        } else if (this.model.timeWay == 2) {
          this.tomorrow = record.timeDigital
          this.tomorrowMonad = record.timeUnit
        }
        await this.$nextTick()
        this.form.setFieldsValue(this.model)
        this.oldStoreManageId = record.storeManageId
        this.getSelectGoods()
        this.title = '编辑礼品卡'
      } else {
        this.title = '添加礼品卡'
      }
    },

    timeWayChange(e) {
      this.model.timeWay = e.target.value
    },
    PopUp() {
      if (!this.model.storeManageId) {
        this.$message.warn('请先选择发行店铺')
        return
      }
      this.ShowPopUp = !this.ShowPopUp
      this.$nextTick(() => {
        if (this.ShowPopUp) {
          this.$refs.selectGoodsToAddPopUp.open()
        }
      })
    },
    selectGoodsHandleOk(ids, sz) {
      this.goodStoreListIds = ids
      this.isSelectData = sz
      this.PopUp()
    },
    async onDelete(id) {
      await this.addOrDelStoreGoods('delete', this.model.id, id)
      const dataSource = [...this.isSelectData]
      const selectedRowKeys = [...this.selectedRowKeys]
      this.selectedRowKeys = selectedRowKeys.filter(item => item !== id)
      this.isSelectData = dataSource.filter(item => item.id !== id)
    },
    addOrDelStoreGoods(type = 'submit', marketingStoreGiftCardListId = this.model.id, deleteId = '') {
      const that = this
      let obj = {
        marketingStoreGiftCardListId
      }
      if (type == 'submit') {
        obj.addStoreGoodIds = this.goodStoreListIds
      } else {
        obj.delStoreGoodIds = deleteId
      }

      return new Promise(resolve => {
        if (!marketingStoreGiftCardListId) {
          resolve()
          return
        }
        getAction(this.url.addOrDelStoreGoods, obj).then(res2 => {
          resolve()
          if (res2.success) {
            that.$message.success(res2.message)
          } else {
            that.$message.warning(res2.message)
          }
        })
      })
    },

    cancel() {
      this.$router.push('/marketing/MarketingStoreGiftCardListList')
    },
    sure() {
      const that = this
      this.form.validateFields((err, values) => {
        if (!err) {
          if (values.timeWay == 0) {
            if (!this.selectDateToTime) {
              this.$message.warn('请设置开始时间和结束时间')
              return
            } else {
              let startTime = new Date(this.selectDateToTime[0]._d),
                endTime = new Date(this.selectDateToTime[1]._d)
              values.startTime = dayjs(startTime).format(this.dateFormat)
              values.endTime = dayjs(endTime).format(this.dateFormat)
            }
          }
          if (values.timeWay == 1) {
            if (!this.today) {
              this.$message.warn('请设置当日起时间')
              return
            } else {
              values.timeDigital = this.today
            }
            if (!this.todayMonad) {
              this.$message.warn('请设置当日起时间单位')
              return
            } else {
              values.timeUnit = this.todayMonad
            }
          }
          if (values.timeWay == 2) {
            if (!this.tomorrow) {
              this.$message.warn('请设置次日起时间')
              return
            } else {
              values.timeDigital = this.tomorrow
            }
            if (!this.tomorrowMonad) {
              this.$message.warn('请设置次日起时间单位')
              return
            } else {
              values.timeUnit = this.tomorrowMonad
            }
          }
          if (!this.goodStoreListIds) {
            this.$message.warn('请选择可选商品')
            return
          }
          let formData = Object.assign({}, this.model, values)
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          formData.getTime = formData.getTime ? formData.getTime.format('YYYY-MM-DD HH:mm:ss') : null
          // formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          // formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
          httpAction(httpurl, formData, method).then(async res => {
            if (res.success) {
              await that.addOrDelStoreGoods('submit', res.result.id)
              setTimeout(() => {
                that.cancel()
              }, 500)
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.button-operation {
  display: flex;
  justify-content: space-between;
  width: 200px;
  margin: 0 auto;

  button {
    width: 80px;
  }
}
.button-end {
  margin-bottom: 40px;
  border-bottom: 1px solid gray;
}
</style>
