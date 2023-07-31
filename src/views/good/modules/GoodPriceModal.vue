<template>
  <!--弹窗-->
  <div>
    <!--改价格-->
    <a-modal width="60%" title="改价格" v-model="visibleAudi" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodTypeId2" placeholder="id" />
      <div>
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodSpecificationColumns"
          :dataSource="dataSource1"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
        >
          <template slot="price" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入销售价格"
                v-decorator="['price', {}]"
                v-model="record.price"
                @input="inputFunPrice($event, record.id, 'price')"
              />
            </div>
          </template>
          <template slot="costPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入成本价格"
                v-decorator="['costPrice', {}]"
                v-model="record.costPrice"
                @input="inputFunCostPrice($event, record.id, 'costPrice')"
              />
            </div>
          </template>
          <template slot="supplyPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入供货价格"
                v-decorator="['supplyPrice', {}]"
                v-model="record.supplyPrice"
                @input="inputFunSupplyPrice"
              />
            </div>
          </template>
          <template slot="vipPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入会员价格"
                v-decorator="['vipPrice', {}]"
                v-model="record.vipPrice"
                @input="inputFunVipPrice"
              />
            </div>
          </template>
        </a-table>
      </div>
      <div style="margin-top: 10px">
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodPriceColumns"
          :dataSource="dataSource2"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template slot="marketPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入销售价格"
                v-decorator="['marketPrice', {}]"
                v-model="record.marketPrice"
              />
            </div>
          </template>
          <template slot="price1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入销售价格" v-decorator="['price', {}]" v-model="record.price" />
            </div>
          </template>
          <template slot="costPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入成本价格"
                v-decorator="['costPrice', {}]"
                v-model="record.costPrice"
              />
            </div>
          </template>
          <template slot="supplyPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入供货价格"
                v-decorator="['supplyPrice', {}]"
                v-model="record.supplyPrice"
              />
            </div>
          </template>
          <template slot="vipPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入会员价格"
                v-decorator="['vipPrice', {}]"
                v-model="record.vipPrice"
              />
            </div>
          </template>
        </a-table>
      </div>
      <div style="text-align: center;margin: 0 auto;">
        商品价格的修改仅对商品列表产生影响，若该商品有加入专区或其他活动且需修改其价格，请自行前往对应模块进行调整。
      </div>
    </a-modal>

    <!--供应商改价格-->
    <a-modal width="60%" title="改价格" v-model="visibleAudi1" @ok="hideModal1()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodTypeId2" placeholder="id" />
      <div>
        <a-table
          ref="table"
          bordered
          :columns="goodSpecificationColumns1"
          :dataSource="dataSource1"
          :loading="loading"
          :pagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
        >
          <template slot="price" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入销售价格"
                v-decorator="['price', {}]"
                v-model="record.price"
                @input="inputFunPrice($event, record.id, 'price')"
              />
            </div>
          </template>
          <template slot="costPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入成本价格"
                v-decorator="['costPrice', {}]"
                v-model="record.costPrice"
                @input="inputFunCostPrice($event, record.id, 'costPrice')"
              />
            </div>
          </template>
        </a-table>
      </div>
      <div style="margin-top: 10px">
        <a-table
          ref="table"
          bordered
          :columns="goodPriceColumns1"
          :dataSource="dataSource2"
          :loading="loading"
          :pagination="false"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
          <template slot="marketPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入销售价格"
                v-decorator="['marketPrice', {}]"
                v-model="record.marketPrice"
              />
            </div>
          </template>
          <template slot="price1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入销售价格" v-decorator="['price', {}]" v-model="record.price" />
            </div>
          </template>
          <template slot="costPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入成本价格"
                v-decorator="['costPrice', {}]"
                v-model="record.costPrice"
              />
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!--改库存-->
    <a-modal width="60%" title="改库存" v-model="visibleRepertory" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodTypeId2" placeholder="id" />

      <div>
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodSpecificationRepertory"
          :dataSource="dataSource1"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          @change="handleTableChange"
        >
          <template slot="repertory" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input
                type="number"
                placeholder="请输入库存"
                v-decorator="['price', {}]"
                v-model="record.repertory"
                @input="inputFunRepertory"
              />
            </div>
          </template>
        </a-table>
      </div>
      <div style="margin-top: 10px">
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodPriceRepertory"
          :dataSource="dataSource2"
          :loading="loading"
          :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        >
        </a-table>
      </div>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodListId2" placeholder="id" />
      <h3>停用分类后，该分类的子分类及关联商品都将被停用，无法访问</h3>
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="statusExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
    <!--下架弹出-->
    <a-modal title="下架" v-model="visibleFrameStatus" @ok="hideModalFrameStatus()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodListId2" placeholder="id" />
      <h3>下架商品后，该商品用户将无法搜索、浏览、购买</h3>
      <p>您确定要下架吗？</p>
      <a-textarea placeholder="下架原因" v-model="frameExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>

    <!--比价链接弹出-->
    <a-modal
      title="比价链接"
      v-model="visibleComparisonURL"
      @ok="hideModalComparisonURL()"
      okText="确认"
      cancelText="取消"
    >
      <input style="display: none" :value="goodListId2" placeholder="id" />
      <a-form-item label="比价链接" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input v-model="skuUrl" placeholder="请输入比价链接"></a-input>
      </a-form-item>
    </a-modal>
    <!--删除弹出-->
    <a-modal title="删除" v-model="visibleDelete" @ok="hideModalDelete()" okText="确认" cancelText="取消">
      <input style="display: none" :value="goodListId2" placeholder="id" />
      <h3>删除商品后，该商品用户将无法搜索、浏览、购买，可以在回收站找回</h3>
      <p>您确定要删除吗？</p>
      <a-textarea placeholder="删除原因" v-model="delExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
    <a-modal title="排序" v-model="visibleSort" @ok="hideMKodalSort()" okText="确认" cancelText="取消">
      <div style="display:flex;align-items:center">
        <div style="margin-right:20px">
          排序:
        </div>
        <a-input-number v-model="sort" :precision="0" :min="0" />
      </div>
    </a-modal>
    <br />
    <br />
  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, deleteAction, postAction } from '@/api/manage'
import { putAction } from '@/api/manage'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
export default {
  name: 'GoodListPriceModal',
  mixins: [JeecgListMixin],
  data() {
    return {
      title: '操作',
      visibleAudi: false,
      visibleAudi1: false,
      visibleRepertory: false,
      visibleStopStatus: false,
      visibleFrameStatus: false,
      visibleDelete: false,
      visibleComparisonURL: false,
      visibleSort: false,
      goodListId2: '',
      statusExplain: '',
      frameExplain: '',
      goodTypeId2: '',
      inputPrice: '', //销售价
      inputCostPrice: '', //成本价
      inputSupplyPrice: '', //供货价
      inputVipPrice: '', //会员价
      inputRepertory: '', //库存
      delExplain: '',
      skuUrl: '', //比价链接
      model: {},
      dataSource2: [],
      dataSource1: [],
      dataSourceRepertory1: [],
      dataSourceRepertory2: [],
      Goodlistprice: '',
      specialPriceRatio: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      // 规格
      goodSpecificationColumns: [
        {
          title: '规格', //相对地址（以json的形式存储多张）
          align: 'center',
          dataIndex: 'specification'
        },

        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '供货价',
          align: 'center',
          dataIndex: 'supplyPrice',
          scopedSlots: { customRender: 'supplyPrice' }
        },
        {
          title: '会员价',
          align: 'center',
          dataIndex: 'vipPrice',
          scopedSlots: { customRender: 'vipPrice' }
        }
      ],

      //价格
      goodPriceColumns: [
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice',
          scopedSlots: { customRender: 'marketPrice' }
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        },
        {
          title: '供货价',
          align: 'center',
          dataIndex: 'supplyPrice'
        },
        {
          title: '会员价',
          align: 'center',
          dataIndex: 'vipPrice'
        }
      ],
      // 供应商规格
      goodSpecificationColumns1: [
        {
          title: '规格', //相对地址（以json的形式存储多张）
          align: 'center',
          dataIndex: 'specification'
        },

        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice',
          scopedSlots: { customRender: 'costPrice' }
        }
        /*{
            title: '供货价',
            align:"center",
            dataIndex: 'supplyPrice',
            scopedSlots: {customRender: "supplyPrice"}
          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'vipPrice',
            scopedSlots: {customRender: "vipPrice"}
          }*/
      ],
      //供应商价格
      goodPriceColumns1: [
        {
          title: '市场价',
          align: 'center',
          dataIndex: 'marketPrice',
          scopedSlots: { customRender: 'marketPrice' }
        },
        {
          title: '销售价',
          align: 'center',
          dataIndex: 'price'
        },
        {
          title: '成本价',
          align: 'center',
          dataIndex: 'costPrice'
        }
        /* {
            title: '供货价',
            align:"center",
            dataIndex: 'supplyPrice',

          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'vipPrice',

          }*/
      ],
      // 库存
      goodSpecificationRepertory: [
        {
          title: '规格', //相对地址（以json的形式存储多张）
          align: 'center',
          dataIndex: 'specification'
        },

        {
          title: '库存',
          align: 'center',
          dataIndex: 'repertory',
          scopedSlots: { customRender: 'repertory' }
        }
      ],
      //总库存
      goodPriceRepertory: [
        {
          title: '总库存',
          align: 'center',
          dataIndex: 'repertory'
        }
      ],
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        list: '/goodList/goodList/list',
        listChangePrice: '/goodSpecification/goodSpecification/listChangePrice',
        updatePrice: '/goodSpecification/goodSpecification/updatePrice',
        updateFrameStatus: 'goodStoreList/goodStoreList/updateFrameStatus',
        updateStatus: 'goodStoreList/goodStoreList/updateFrameStatus',
        deleteAndDelExplain: 'goodList/goodList/deleteAndDelExplain',
        updateSkuUrl: 'goodList/goodList/updateSkuUrl',
        edit: 'goodList/goodList/add',
        sort:'goodStoreList/goodStoreList/updateSort'
      },
      sort: '',
      //百分比
      supplyPriceRatio: 20,
      membershipRate: 20,
      lineRecord: {}
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    showModal(item) {
      this.goodTypeId2 = item
      this.visibleAudi = true
      getAction(this.url.listChangePrice, { goodListid: item }).then(res => {
        if (res.success) {
          this.dataSource1 = res.result.listgoodSpecification
          this.dataSource2 = res.result.listGoodList
          console.log('this.dataSource1', this.dataSource1)
          console.log('this.dataSource2', this.dataSource2)
        } else {
          console.log('请求失败')
        }
      })
    },
    showModal1(id) {
      console.log('id-------------', id)
      this.goodTypeId2 = id
      this.visibleAudi1 = true
      getAction(this.url.listChangePrice, { goodListid: id }).then(res => {
        if (res.success) {
          this.dataSource1 = res.result.listgoodSpecification
          this.dataSource2 = res.result.listGoodList
        }
      })
    },
    showModalRepertory(id) {
      console.log('id-------------', id)
      this.goodTypeId2 = id
      this.visibleRepertory = true
      getAction(this.url.listChangePrice, { goodListid: id }).then(res => {
        if (res.success) {
          this.dataSource1 = res.result.listgoodSpecification
          this.dataSource2 = res.result.listGoodList
        }
      })
    },

    close() {
      this.$emit('close')
      this.visibleAudi = false
      this.visibleRepertory = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
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
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.delTime = formData.delTime ? formData.delTime.format('YYYY-MM-DD HH:mm:ss') : null
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    //计算公式封装
    Calculation(e, id = '', column = '') {
      if (id && column) {
        const newData = [...this.dataSource1]
        const target = newData.filter(item => id === item.id)[0]
        if (target) {
          // 供货价=成本价+成本价*供货价比例
          target['supplyPrice'] = `${Math.floor(
            parseFloat(
              parseFloat(target['costPrice']) + parseFloat((target['costPrice'] * this.supplyPriceRatio) / 100)
            ) * 100
          ) / 100}`

          // target.supplyPrice = parseFloat((parseFloat(e.target.value)+parseFloat(e.target.value*this.supplyPriceRatio/100)).toFixed(2))
          //会员价=（销售价-供货价）*会员价比例+供货价
          // target.vipPrice =parseFloat(((parseFloat(e.target.value)-parseFloat(target.supplyPrice))*parseFloat(this.supplyPriceRatio/100)+parseFloat(target.supplyPrice)).toFixed(2))
          // target['vipPrice'] = `${Math.floor(
          //   parseFloat(
          //     (parseFloat(target['price']) - parseFloat(target['supplyPrice'])) *
          //       parseFloat(this.membershipRate / 100) +
          //       parseFloat(target['supplyPrice'])
          //   ) * 100
          // ) / 100}`
          target['vipPrice'] = (parseFloat(target['price']) * parseFloat(this.membershipRate / 100)).toFixed(2)
          setTimeout(() => {
            this.dataSource1 = newData
            //供货价价改变
            let SupplyPrice = {
              target: {
                value: target.supplyPrice
              }
            }
            this.inputFunSupplyPrice(SupplyPrice)
            //会员价改变
            let FunVipPrice = {
              target: {
                value: target.vipPrice
              }
            }
            this.inputFunVipPrice(FunVipPrice)
          }, 150)
        }
        // this.inputFunVipPrice()
      }
    },
    //销售价
    inputFunPrice(e, id = '', column = '') {
      this.Calculation(e, id, column)
      this.inputPrice = e.target.value
      if (this.dataSource1.length > 1) {
        if (parseInt(this.inputPrice) > 0) {
          var num = null
          var a = []
          for (var i = 0; i < this.dataSource1.length; i++) {
            a[i] = parseInt(this.dataSource1[i].price)
          }
          this.bSort(a)
          this.dataSource2[0].price = a[0] + '-' + a[this.dataSource1.length - 1]
          this.dataSource2[0].marketPrice = (a[this.dataSource1.length - 1] * 1.1).toFixed(2) //市场价
        }
      } else {
        this.dataSource2[0].price = e.target.value
        this.dataSource2[0].marketPrice = (e.target.value * 1.1).toFixed(2) //市场价
      }
    },
    //成本价
    inputFunCostPrice(e, id, column) {
      this.Calculation(e, id, column)
      this.inputCostPrice = e.target.value
      if (this.dataSource1.length > 1) {
        //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
        if (parseInt(this.inputCostPrice) > 0) {
          var num = null
          var a = []
          for (var i = 0; i < this.dataSource1.length; i++) {
            a[i] = parseInt(this.dataSource1[i].costPrice)
          }
          this.bSort(a)
          this.dataSource2[0].costPrice = a[0] + '-' + a[this.dataSource1.length - 1]
        }
      } else {
        this.dataSource2[0].costPrice = e.target.value
      }
    },
    //供货价
    inputFunSupplyPrice(e) {
      this.inputSupplyPrice = e.target.value
      if (this.dataSource1.length > 1) {
        //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
        if (parseInt(this.inputSupplyPrice) > 0) {
          var num = null
          var a = []
          for (var i = 0; i < this.dataSource1.length; i++) {
            a[i] = parseInt(this.dataSource1[i].supplyPrice)
          }
          this.bSort(a)
          this.dataSource2[0].supplyPrice = a[0] + '-' + a[this.dataSource1.length - 1]
        }
      } else {
        this.dataSource2[0].supplyPrice = e.target.value
      }
    },
    //会员价
    inputFunVipPrice(e) {
      this.inputVipPrice = e.target.value
      if (this.dataSource1.length > 1) {
        //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
        if (parseInt(this.inputVipPrice) > 0) {
          var num = null
          var a = []
          for (var i = 0; i < this.dataSource1.length; i++) {
            a[i] = parseInt(this.dataSource1[i].vipPrice)
          }
          this.bSort(a)
          this.dataSource2[0].vipPrice = a[0] + '-' + a[this.dataSource1.length - 1]
          console.log(this.dataSource2)
          console.log(this.dataSource1)
        }
      } else {
        this.dataSource2[0].vipPrice = e.target.value
      }
    },
    //总库存
    inputFunRepertory(e) {
      this.inputRepertory = e.target.value
      if (this.dataSource1.length > 1) {
        //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
        if (parseInt(this.inputRepertory) > 0) {
          var repertory = 0
          for (var i = 0; i < this.dataSource1.length; i++) {
            repertory = parseInt(this.dataSource1[i].repertory) + repertory
          }
          this.dataSource2[0].repertory = repertory
        }
      } else {
        this.dataSource2[0].repertory = e.target.value
      }
    },
    //修改提交
    hideModal() {
      let that = this
      let result = this.dataSource1.every(item => {
        return (item.price * parseFloat(this.specialPriceRatio)) / 100 <= item.costPrice //成本价
      })
      if (this.dataSource2[0].goodForm == '1' && result) {
        this.$message.warn('特价商品需符合特价规则')
        return
      }
      this.visibleAudi = false
      this.visibleRepertory = false
      putAction(that.url.updatePrice, { listgoodSpecification: that.dataSource1, listGoodList: that.dataSource2 }).then(
        res => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.$emit('ok')
            //that.loadData();
          } else {
            that.$message.error('修改失败')
          }
        }
      )
    },
    //修改提交
    hideModal1() {
      this.visibleAudi1 = false
      this.visibleRepertory = false
      let that = this
      putAction(that.url.updatePrice, { listgoodSpecification: that.dataSource1, listGoodList: that.dataSource2 }).then(
        res => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.$emit('ok')
            //that.loadData();
          } else {
            that.$message.error('修改失败')
          }
        }
      )
    },

    getQueryField() {},
    //冒泡排序
    bSort(arr) {
      var len = arr.length
      for (var i = 0; i < len - 1; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
          // 相邻元素两两对比，元素交换，大的元素交换到后面
          if (arr[j] > arr[j + 1]) {
            var temp = arr[j]
            arr[j] = arr[j + 1]
            arr[j + 1] = temp
          }
        }
      }
      return arr
    },
    //停用弹窗
    showModalStopStatus(id) {
      this.goodListId2 = id
      this.visibleStopStatus = true
      this.statusExplain = ''
    },
    //停用
    hideModalStopStatus() {
      this.visibleStopStatus = false
      console.log('this.statusExplain=', this.statusExplain)
      var that = this
      getAction(that.url.updateStatus, { ids: this.goodListId2, statusExplain: this.statusExplain, status: '0' }).then(
        res => {
          if (res.code == 200) {
            that.$message.success(res.message)
            that.$emit('ok') //发送父级主键刷新
          } else {
            that.$message.success('修改失败')
          }
        }
      )
    },
    //下架弹窗
    showModalFrameStatus(id) {
      this.goodListId2 = id
      this.visibleFrameStatus = true
      this.frameExplain = ''
    },
    //下架弹出
    hideModalFrameStatus() {
      this.visibleFrameStatus = false
      console.log('this.frameExplain=', this.frameExplain)
      var that = this
      getAction(that.url.updateFrameStatus, {
        ids: this.goodListId2,
        frameStatus: '0',
        frameExplain: this.frameExplain
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //对比价链接
    //对比价链接
    showModalComparisonURL(id, skuUrl) {
      this.goodListId2 = id
      this.visibleComparisonURL = true
      this.skuUrl = skuUrl
    },
    //对比价链接
    hideModalComparisonURL() {
      this.visibleComparisonURL = false
      var that = this
      getAction(that.url.updateSkuUrl, { ids: this.goodListId2, skuUrl: this.skuUrl }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    showModalSort(record) {
      this.visibleSort = true
      // this.goodListId2 = record.id
      this.lineRecord = record
      this.sort = record.sort
    },
    hideMKodalSort() {
      this.visibleSort = false
      var that = this
      getAction(that.url.sort, { 'goodListId':this.lineRecord.id, sort: this.sort }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },

    //删除弹窗
    showModalDelete(id) {
      this.goodListId2 = id
      this.visibleDelete = true
      this.delExplain = ''
    },
    //删除弹出
    hideModalDelete() {
      this.visibleDelete = false
      console.log('this.delExplain=', this.delExplain)
      var that = this
      deleteAction(that.url.deleteAndDelExplain, { id: this.goodListId2, delExplain: this.delExplain }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //字典
    init() {
      this.initIndex()
    },
    initIndex() {
      initDictOptions('supply_price_ratio').then(res => {
        if (res.success) {
          this.supplyPriceRatio = parseFloat(res.result[0].value.replace(/%/g, ''))
          //parseFloat(that.data.qiandao)).toFixed(2)
          console.log('this.supplyPriceRatio字典', this.supplyPriceRatio)
        }
      }),
        initDictOptions('membership_rate').then(res => {
          if (res.success) {
            this.membershipRate = parseFloat(res.result[0].value.replace(/%/g, ''))
            console.log('this.membershipRate', this.membershipRate)
          }
        })
      //特价比例
      initDictOptions('special_price_ratio').then(res => {
        if (res.success) {
          this.specialPriceRatio = parseFloat(res.result[0].value.replace(/%/g, ''))
          console.log('this.specialPriceRatio字典', this.specialPriceRatio)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
