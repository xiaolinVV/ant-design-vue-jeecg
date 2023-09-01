<template>
  <j-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :fullscreen="true"
    switchFullscreen
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="form" :model="model" :rules="validatorRules">
        <a-card title="商品信息">
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="goodTypeId"
            label="店铺名称"
            v-if="goodTypes['1']"
          >
            {{ storeInfo.title }}
          </a-form-model-item>
          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="goodTypeId"
            label="商品分类"
            v-if="goodTypes['1']"
          >
            <span>{{ goodTypes['1'].name }}>{{ goodTypes['2'].name }}</span
            ><a
              style="margin-left: 30px"
              @click.stop="
                () => {
                  drawerVisible = true
                  getStoreGoodTypeByTree()
                }
              "
              >修改分类</a
            >
          </a-form-model-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="goodTypeId" label="商品分类" v-else>
            <span>请选择分类</span
            ><a
              style="margin-left: 30px"
              @click.stop="
                () => {
                  drawerVisible = true
                  getStoreGoodTypeByTree()
                }
              "
              >修改分类</a
            >
          </a-form-model-item>

          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="goodNo" label="商品编号">
            <a-input placeholder="请输入商品编号" v-model="model.goodNo" />商品唯一编号
          </a-form-model-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="goodName" label="商品名称">
            <a-input placeholder="请输入商品名称" v-model="model.goodName" />最多支持45个字
          </a-form-model-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="goodDescribe" label="商品描述">
            <a-textarea placeholder="请输入商品描述" v-model="model.goodDescribe" />最多支持500个字
          </a-form-model-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品图片">
            <kq-upload
              ref="mainImagesUpload"
              :imgCount="5"
              explain="请上传800*800 的jpg、jpeg、png格式的图片，大小不超过5M，最多5张"
              @change="
                e => {
                  mainImages = e
                }
              "
            ></kq-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品详情图">
            <kq-upload
              ref="detailsImagesUpload"
              :imgCount="50"
              explain="请上传750*不限高 的jpg、jpeg、png格式的图片，大小不超过5M，最多50张"
              @change="
                e => {
                  detailsImages = e
                }
              "
            ></kq-upload>
          </a-form-item>
        </a-card>
        <a-card title="商品价格" style="margin-top: 30px">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品规格">
            <div>
              <div>
                <a-button type="primary" @click="addSpecification">
                  添加规格
                </a-button>
                <span style="margin-left: 20px"
                  >最多添加两个商品规格，第一个商品规格可添加规格图片（编辑规格信息会重置商品的规格，会删除这个商品参与的所有活动），编辑价格和库存等信息不会有影响</span
                >
              </div>
              <!--规格数据-->
              <div style="margin-top: 20px">
                <a-card style="background-color: #cccccc" v-for="(item, index) in specifications" :key="index">
                  <div style="display: flex;justify-content: space-between;">
                    <a-input style="width: 200px" v-model="item.name"></a-input>
                    <button type="primary" :ghost="true" @click="delSpecification(index)">
                      删除规格
                    </button>
                  </div>
                  <a-divider />
                  <div style="display: flex ; flex-direction: row">
                    <a-button type="primary" @click="addSpe(item)">
                      添加
                    </a-button>
                    <div v-if="item.spes">
                      <a-input
                        :key="index2"
                        v-for="(item2, index2) in item.spes"
                        v-model="item2.pName"
                        style="width: 100px;margin-left: 20px;"
                        @input="specificationsChange"
                      ></a-input>
                    </div>
                  </div>
                </a-card>
              </div>
            </div>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品价格">
            <div>
              <a-card style="background-color: #cccccc">
                <div v-if="specifications.length > 0">
                  <span style="color: #cf1322;font-weight: bold">批量设置：在下方栏中选择内容进行批量填充</span>
                  <a-card style="margin-top: 20px;background-color: #c0ccda; width: 100%">
                    <div style="display: flex;justify-content: space-between;">
                      <div>
                        <a-select
                          v-model="oneSpecification"
                          placeholder="请选择"
                          v-if="specifications.length >= 1"
                          style="width: 120px"
                        >
                          <a-select-option value="-1">全部</a-select-option>
                          <a-select-option
                            :key="index"
                            :value="item.pName"
                            v-for="(item, index) in specifications[0].spes"
                            >{{ item.pName }}</a-select-option
                          >
                        </a-select>
                        <a-select
                          v-model="twoSpecification"
                          placeholder="请选择"
                          v-if="specifications.length == 2"
                          style="margin-left: 10px;width: 120px"
                        >
                          <a-select-option value="-1">全部</a-select-option>
                          <a-select-option
                            :key="index"
                            :value="item.pName"
                            v-for="(item, index) in specifications[1].spes"
                            >{{ item.pName }}</a-select-option
                          >
                        </a-select>
                        <a-input
                          placeholder="销售价"
                          v-model="setting.salesPrice"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="成本价"
                          v-model="setting.costPrice"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="会员价"
                          v-model="setting.vipPrice"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="库存"
                          v-model="setting.repertory"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="重量"
                          v-model="setting.weight"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="skuNo"
                          v-model="setting.skuNo"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                        <a-input
                          placeholder="起批数量"
                          v-model="setting.minWholesaleNum"
                          style="margin-left: 10px;width: 100px"
                        ></a-input>
                      </div>
                      <div>
                        <a-button type="primary" @click="submitInfo">确认</a-button>
                      </div>
                    </div>
                  </a-card>

                  <a-table
                    :scroll="{ x: 1100 }"
                    :columns="specificationsColumns"
                    :data-source="specificationsDecribes"
                    :pagination="false"
                    bordered
                    :rowKey="
                      (record, index) => {
                        return index
                      }
                    "
                  >
                    <template slot="salesPrice" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].salesPrice" @input="salesPriceChange"></a-input>
                    </template>
                    <template slot="vipPrice" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].vipPrice" @input="vipPriceChange"></a-input>
                    </template>
                    <template slot="costPrice" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].costPrice" @input="costPriceChange"></a-input>
                    </template>
                    <template slot="repertory" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].repertory" @input="repertoryChange"></a-input>
                    </template>
                    <template slot="weight" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].weight"></a-input>
                    </template>
                    <template slot="skuNo" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].skuNo"></a-input>
                    </template>
                    <template slot="minWholesaleNum" slot-scope="text, record, index">
                      <a-input v-model="specificationsDecribes[index].minWholesaleNum"></a-input>
                    </template>
                    <template slot="imgUrl" slot-scope="text, record, index">
                      <kq-upload
                        :ref="'uploadImgsUpload' + index"
                        :imgCount="1"
                        explain="请上传规格图最多一张"
                        @change="
                          e => {
                            uploadImgs[index] = e
                          }
                        "
                      ></kq-upload>
                    </template>
                  </a-table>
                </div>

                <a-table
                  style="margin-top: 10px"
                  :columns="shopColumns"
                  :data-source="shopInfo"
                  :pagination="false"
                  bordered
                  :rowKey="
                    (record, index) => {
                      return index
                    }
                  "
                >
                  <template slot="salesPrice" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].salesPrice" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="vipPrice" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].vipPrice" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="costPrice" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].costPrice" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="repertory" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].repertory" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="weight" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].weight" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="skuNo" slot-scope="text, record">
                    <a-input v-model="shopInfo[0].skuNo" :disabled="specifications.length != 0"></a-input>
                  </template>
                  <template slot="minWholesaleNum" slot-scope="text, record, index">
                    <a-input v-model="shopInfo[0].minWholesaleNum"></a-input>
                  </template>
                </a-table>
              </a-card>
            </div>
          </a-form-item>

          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="marketPrice" label="市场价">
            <a-input-number :min="0" :precision="2" v-model="model.marketPrice" style="width: 95%"></a-input-number>元
          </a-form-model-item>
        </a-card>
        <a-card title="批发设置" style="margin-top: 30px">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="代理商分佣比例">
            <a-input-number v-model="model.productAgencyCommissionRate" placeholder="请输入代理商分佣比例" style="width: 100%" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺分佣比例">
            <a-input-number v-model="model.productStoreCommissionRate" placeholder="请输入店铺分佣比例" style="width: 100%" />
          </a-form-item>
        </a-card>
        <a-card title="服务承诺" style="margin-top: 30px">
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="distributionArray" label="配送方式">
            <a-checkbox-group v-model="distributionArray" @change="commitmentCustomersArrayChange">
              <a-checkbox value="0">快递</a-checkbox>
              <a-checkbox value="1">自提</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="storeTemplateId" label="运费模板">
            <a-select
              showSearch
              :options="providerTemplateOption"
              :filterOption="filterOption"
              v-model="model.storeTemplateId"
              @select="sdfgsdfg"
            ></a-select>
          </a-form-model-item>

          <a-form-model-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            prop="commitmentCustomersArray"
            label="服务承诺"
          >
            <a-checkbox-group v-model="model.commitmentCustomersArray" @change="commitmentCustomersArrayChange">
              <a-checkbox value="0">7天无理由退换货</a-checkbox>
              <a-checkbox value="1">假一赔十</a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
        </a-card>
        <a-card title="信息状态" style="margin-top: 30px">
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frameStatus" label="上下架状态">
            <a-radio-group v-model="model.frameStatus">
              <a-radio value="0">下架</a-radio>
              <a-radio value="1">上架</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status" label="信息状态">
            <a-radio-group v-model="model.status">
              <a-radio value="0">停用</a-radio>
              <a-radio value="1">启用</a-radio>
            </a-radio-group>
          </a-form-model-item>
        </a-card>
      </a-form-model>
    </a-spin>

    <!--选择分类-->
    <a-drawer
      :visible="drawerVisible"
      class="custom-class"
      style="color: red"
      title="选择分类"
      placement="right"
      @close="afterVisibleChange"
    >
     <a-tree :tree-data="goodTypeTree2">
      <template #title="{name,id,level}">
        <div @click="getByGoodType(id, level)">{{ name }}</div>
      </template>
    </a-tree>
    <!-- <template v-if="goodTypeTree.length > 1" >
      <a-tree :tree-data="goodTypeTree" :key="new Date().getTime()">
        <template #title="{name,id,level}">
          <span v-if="id === ''" style="color: #1890ff"
            ><div @click="getByGoodType(id, level)">{{ name }}</div></span
          >
          <template v-else
            ><div @click="getByGoodType(id, level)">{{ name }}</div></template
          >
        </template>
      </a-tree>
    </template> -->
    </a-drawer>
  </j-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import KqUpload from '@/components/kq/KqUpload/KqUpload'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import { getAction } from '@/api/manage'

export default {
  name: 'GoodStoreListModal',
  components: { ATextarea, KqUpload },
  data() {
    return {
      goodTypeTree2:[],
      title: '商品添加',
      visible: false,
      drawerVisible: false,
      goodTypeTree: [],
      /*供应商列表*/
      sysUserList: [],
      /*运费模板*/
      providerTemplateOption: [],
      distributionArray: [],
      model: {
        goodNo: '',
        goodName: '',
        goodDescribe: '',
        commitmentCustomers: '',
        commitmentCustomersArray: [],
        distribution: '',

        status: '1',
        frameStatus: '1',
        storeTemplateId: '',
        marketPrice: ''
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      validatorRules: {},
      url: {
        add: '/goodStoreList/goodStoreList/add',
        edit: '/goodStoreList/goodStoreList/edit',
        getGoodStoreTypeByTwoId: 'GoodStoreType/goodStoreType/getGoodStoreTypeByTwoId',
        getStoreGoodTypeByTree: 'GoodStoreType/goodStoreType/getStoreGoodTypeByTree',
        getStoreTemplateByStoreManageId: '/storeTemplate/storeTemplate/getStoreTemplateByStoreManageId'
      },
      //上传组件参数
      //主图
      mainImages: [],
      //详情图
      detailsImages: [],
      //规格数据
      specifications: [],
      specificationsDecribes: [],
      uploadImgs: [],
      shopInfo: [
        {
          salesPrice: 0,
          costPrice: 0,
          vipPrice: 0,
          repertory: 0,
          weight: 0,
          skuNo: '',
          // minWholesaleNum: 0
        }
      ],
      shopColumns: [
        {
          title: '销售价（元）',
          dataIndex: 'salesPrice',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '成本价（元）',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '会员价（元）',
          dataIndex: 'vipPrice',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '总库存',
          dataIndex: 'repertory',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: '重量',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' }
        },
        {
          title: 'skuNo编码',
          dataIndex: 'skuNo',
          scopedSlots: { customRender: 'skuNo' }
        },
        {
          title: '起批数量',
          dataIndex: 'minWholesaleNum',
          scopedSlots: { customRender: 'minWholesaleNum' }
        },
      ],
      specificationsColumns: [
        {
          title: '规格',
          dataIndex: 'pName'
        },
        {
          title: '销售价（元）',
          dataIndex: 'salesPrice',
          scopedSlots: { customRender: 'salesPrice' }
        },
        {
          title: '成本价（元）',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '会员价（元）',
          dataIndex: 'vipPrice',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: '重量',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' }
        },
        {
          title: 'sku编码',
          dataIndex: 'skuNo',
          scopedSlots: { customRender: 'skuNo' }
        },
        {
          title: '起批数量',
          dataIndex: 'minWholesaleNum',
          scopedSlots: { customRender: 'minWholesaleNum' }
        },
        {
          title: '规格图',
          dataIndex: 'imgUrl',
          scopedSlots: { customRender: 'imgUrl' }
        }
      ],
      oneSpecification: '-1',
      twoSpecification: '-1',
      setting: {
        salesPrice: '',
        costPrice: '',
        weight: '',
        repertory: '',
        skuNo: '',
        vipPrice: '',
        minWholesaleNum: ''
      },
      typeParam: {},
      goodTypeByTwoId: '',
      goodTypes: {},

      //商品基础设置
      goodSetting: {
        openBrand: '0',
        machineParts: '0'
      },
      storeInfo: {}
    }
  },
  created() {},
  methods: {
    commitmentCustomersArrayChange(e) {
      console.log(e)
      this.$forceUpdate()
    },

    sdfgsdfg() {
      console.log(this.model.storeTemplateId)
      this.$forceUpdate()
    },
    getStoreTemplateByStoreManageId() {
      getAction(this.url.getStoreTemplateByStoreManageId, { storeManageId: this.storeInfo.key }).then(res => {
        if (res.success) {
          console.log('获取运费模板列表：', res.result)
          this.providerTemplateOption = []
          for (let r of res.result) {
            this.providerTemplateOption.push({
              value: r.id,
              label: r.name
            })
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    filterOption(inputValue, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0
    },

    getByGoodType(id, level) {
      console.log(id, '----', level)
      if (level != 2) {
        this.$message.warning('请选择二级分类')
      } else {
        this.goodTypeByTwoId = id
        this.getGoodStoreTypeByTwoId()
        this.drawerVisible = false
      }
    },
       getStoreGoodTypeByTree() {
      getAction(this.url.getStoreGoodTypeByTree, {
        storeManageId: this.storeInfo.key
      }).then(res => {

        if (res.success) {

          this.goodTypeTree2 = []
          this.$nextTick(() => {
            this.goodTypeTree2 = res.result
          })

          console.log(this.goodTypeTree)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    afterVisibleChange() {
      this.drawerVisible = false
    },
    getGoodStoreTypeByTwoId() {
      getAction(this.url.getGoodStoreTypeByTwoId, { id: this.goodTypeByTwoId }).then(res => {
        if (res.success) {
          this.goodTypes = res.result
          console.log(this.goodTypes)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    submitInfo() {
      console.log(this.oneSpecification, '=======', this.twoSpecification)
      for (let item of this.specificationsDecribes) {
        let frontString = ''
        let afterString = ''
        if (this.specifications.length == 1) {
          frontString = item.pName
          if (this.oneSpecification == -1) {
            this.setShuju(item)
          }
          if (frontString == this.oneSpecification) {
            this.setShuju(item)
          }
        }
        if (this.specifications.length == 2) {
          frontString = item.pName.substr(0, item.pName.indexOf(','))
          afterString = item.pName.substr(item.pName.indexOf(',') + 1, item.pName.length)
          if (this.oneSpecification == -1 && this.twoSpecification != -1) {
            if (afterString == this.twoSpecification) {
              this.setShuju(item)
            }
          }
          if (this.oneSpecification != -1 && this.twoSpecification == -1) {
            if (frontString == this.oneSpecification) {
              this.setShuju(item)
            }
          }
          if (this.oneSpecification != -1 && this.twoSpecification != -1) {
            if (frontString == this.oneSpecification && afterString == this.twoSpecification) {
              this.setShuju(item)
            }
          }
          if (this.oneSpecification == -1 && this.twoSpecification == -1) {
            this.setShuju(item)
          }
        }
        console.log(frontString, '------', afterString)
      }
      this.salesPriceChange()
      this.vipPriceChange()
      this.repertoryChange()
      this.costPriceChange()
    },
    setShuju(item) {
      if (this.setting.salesPrice) {
        item.salesPrice = this.setting.salesPrice
      }
      if (this.setting.vipPrice) {
        item.vipPrice = this.setting.vipPrice
      }
      if (this.setting.costPrice) {
        item.costPrice = this.setting.costPrice
      }
      if (this.setting.weight) {
        item.weight = this.setting.weight
      }
      if (this.setting.repertory) {
        item.repertory = this.setting.repertory
      }
      if (this.setting.skuNo) {
        item.skuNo = this.setting.skuNo
      }
      if (this.setting.minWholesaleNum) {
        item.minWholesaleNum = this.setting.minWholesaleNum
      }
    },
    //商品数据统计
    salesPriceChange() {
      let minSalesPrice = parseFloat(this.specificationsDecribes[0].salesPrice)
      let maxSalesPrice = parseFloat(this.specificationsDecribes[0].salesPrice)
      for (let sp of this.specificationsDecribes) {
        if (minSalesPrice > parseFloat(sp.salesPrice)) {
          minSalesPrice = parseFloat(sp.salesPrice)
        }
        if (maxSalesPrice < parseFloat(sp.salesPrice)) {
          maxSalesPrice = parseFloat(sp.salesPrice)
        }
      }
      this.shopInfo[0].salesPrice = minSalesPrice.toString() + '-' + maxSalesPrice.toString()
    },
    vipPriceChange() {
      let minVipPrice = parseFloat(this.specificationsDecribes[0].vipPrice)
      let maxVipPrice = parseFloat(this.specificationsDecribes[0].vipPrice)
      for (let sp of this.specificationsDecribes) {
        if (minVipPrice > parseFloat(sp.vipPrice)) {
          minVipPrice = parseFloat(sp.vipPrice)
        }
        if (maxVipPrice < parseFloat(sp.vipPrice)) {
          maxVipPrice = parseFloat(sp.vipPrice)
        }
      }
      this.shopInfo[0].vipPrice = minVipPrice.toString() + '-' + maxVipPrice.toString()
    },
    costPriceChange() {
      let minPrice = parseFloat(this.specificationsDecribes[0].costPrice)
      let maxPrice = parseFloat(this.specificationsDecribes[0].costPrice)
      for (let sp of this.specificationsDecribes) {
        if (minPrice > parseFloat(sp.costPrice)) {
          minPrice = parseFloat(sp.costPrice)
        }
        if (maxPrice < parseFloat(sp.costPrice)) {
          maxPrice = parseFloat(sp.costPrice)
        }
      }
      this.shopInfo[0].costPrice = minPrice.toString() + '-' + maxPrice.toString()
    },
    repertoryChange() {
      let totalRepertory = 0
      for (let sp of this.specificationsDecribes) {
        totalRepertory = totalRepertory + parseInt(sp.repertory)
      }
      this.shopInfo[0].repertory = totalRepertory
    },
    //添加规格
    specificationsChange() {
      console.log(this.specifications)
      if (this.specifications) {
        console.log(this.specifications)
        this.specificationsDecribes = []
        this.uploadImgs = []
        if (this.specifications.length == 1) {
          this.specifications[0].spes.forEach(sp => {
            this.specificationsDecribes.push({
              pName: sp.pName,
              salesPrice: 0,
              vipPrice: 0,
              costPrice: 0,
              weight: 0,
              repertory: 0,
              skuNo: '',
              imgUrl: ''
            })
          })
        }
        if (this.specifications.length == 2) {
          this.specifications[0].spes.forEach(sp => {
            this.specifications[1].spes.forEach(sp2 => {
              this.specificationsDecribes.push({
                pName: sp.pName + ',' + sp2.pName,
                salesPrice: 0,
                vipPrice: 0,
                costPrice: 0,
                weight: 0,
                repertory: 0,
                skuNo: '',
                imgUrl: ''
              })
            })
          })
        }
        this.oneSpecification = '-1'
        this.twoSpecification = '-1'
        console.log('规格数据', this.specificationsDecribes)
        this.specificationsDecribes.map((item, index) => {
          this.uploadImgs[index] = []
          if (item.imgUrl) {
            this.uploadImgs[index].push(item.imgUrl)
          }
        })
      }
    },
    addSpe(item) {
      item.spes.push({
        pName: '',
        salesPrice: 0,
        vipPrice: 0,
        costPrice: 0,
        weight: 0,
        repertory: 0,
        skuNo: '',
        imgUrl: ''
      })
      this.oneSpecification = '-1'
      this.twoSpecification = '-1'
      console.log(this.specifications)
    },
    addSpecification() {
      if (this.specifications.length >= 2) {
        this.$message.warning('最多允许添加两个规格')
        return
      }
      this.specifications.push({
        spes: [],
        name: ''
      })
      console.log(this.specifications)
    },
    delSpecification(e) {
      console.log(e)
      this.$delete(this.specifications, e)
      this.specificationsChange()
    },

    getImgUrl(url) {
      return window._CONFIG['imgDomainURL'] + '/' + url
    },
    add(param, storeInfo) {
      console.log(param, storeInfo)
      //初始化默认值
      this.typeParam = param
      this.storeInfo = storeInfo
      if (param.level == 2) {
        this.goodTypeByTwoId = param.id
      } else {
        this.goodTypeByTwoId = ''
        this.goodTypes = {}
      }
      this.edit({})
    },
    edit(record) {
      this.model = Object.assign({}, record)

      //初始化数据
      this.specifications = []
      this.specificationsDecribes = []
      this.shopInfo = []
      this.mainImages = []
      this.detailsImages = []
      this.uploadImgs = []
      this.providerTemplateOption = []
      this.model.commitmentCustomersArray = []

      if (this.model.id) {
        console.log(this.model)

        if (this.model.storeManageId) {
          this.storeInfo = {
            key: this.model.storeManageId,
            title: this.model.storeName
          }
        }

        this.title = '商品编辑'
        if (this.model.commitmentCustomers) {
          this.model.commitmentCustomersArray = JSON.parse(this.model.commitmentCustomers)
        }
        if (this.model.distribution) {
          this.distributionArray = this.model.distribution.split(',')
        }

        this.goodTypeByTwoId = this.model.typeThree
        //设置数据
        //主图

        if (this.model.mainPicture) {
          this.mainImages = JSON.parse(this.model.mainPicture)
        }
        //详情图

        if (this.model.detailsGoods) {
          this.detailsImages = JSON.parse(this.model.detailsGoods)
        }
        //规格信息
        this.specifications = JSON.parse(this.model.specifications)
        this.specificationsDecribes = JSON.parse(this.model.specificationsDecribes)
        this.shopInfo = JSON.parse(this.model.shopInfo)
        console.log('specificationsDecribes:', this.specificationsDecribes)
      } else {
        this.title = '商品新增'
        this.shopInfo = [
          {
            salesPrice: 0,
            vipPrice: 0,
            costPrice: 0,
            repertory: 0,
            weight: 0,
            skuNo: ''
          }
        ]
        this.model = {
          goodNo: '',
          goodName: '',
          goodDescribe: '',
          commitmentCustomers: '',
          commitmentCustomersArray: [],
          status: '1',
          frameStatus: '1'
        }
      }
      if (this.goodTypeByTwoId) {
        this.getGoodStoreTypeByTwoId()
      }
      /*加载运费模板*/
      this.getStoreTemplateByStoreManageId()
      this.visible = true

      this.$nextTick(() => {
        /*初始化组件*/
        this.$refs.mainImagesUpload.init(this.mainImages)
        this.$refs.detailsImagesUpload.init(this.detailsImages)
        this.specificationsDecribes.map((item, index) => {
          this.uploadImgs[index] = []
          if (item.imgUrl) {
            this.uploadImgs[index].push(item.imgUrl)
          }
          this.$refs[`uploadImgsUpload${index}`].init(this.uploadImgs[index])
        })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.$refs.form.clearValidate()
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }

          /*刷新规格图数据*/

          console.log('规格图', this.uploadImgs)
          this.specificationsDecribes = this.specificationsDecribes.map((item, index) => {
            if (this.uploadImgs[index].length != 0) {
              item.imgUrl = this.uploadImgs[index][0]
            }
            return item
          })

          this.model.mainImages = JSON.stringify(this.mainImages)
          this.model.detailsImages = JSON.stringify(this.detailsImages)
          this.model.specifications = JSON.stringify(this.specifications)

          this.model.specificationsDecribes = JSON.stringify(this.specificationsDecribes)
          this.model.goodTypeId = this.goodTypeByTwoId
          this.model.commitmentCustomers = JSON.stringify(this.model.commitmentCustomersArray)
          this.model.storeManageId = this.storeInfo.key
          this.model.shopInfo = JSON.stringify(this.shopInfo)
          if (this.distributionArray && this.distributionArray.length > 0) {
            this.model.distribution = this.distributionArray.join(',')
          } else {
            this.model.distribution = ''
          }

          console.log(this.model)

          httpAction(httpurl, this.model, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
                that.close()
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
            })
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.close()
    }
  }
}
</script>

<style lang="less" scoped></style>
