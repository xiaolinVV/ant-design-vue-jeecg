<template>
  <a-spin :spinning="false">
    <a-card :border="false" title="下单结果">
      <a-table
        ref="table"
        size="middle"
        rowKey="id"
        :bordered="false"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :scroll="{ x: 2000 }"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="action" slot-scope="text, record">
          <a-button type="primary" @click="Supplement(record)" v-if="record.isSend != 1">补单</a-button>
        </template>
        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="record.mainPicture != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar
            shape="square"
            v-if="record.mainPicture == undefined || record.mainPicture == ''"
            :src="handleImage(text)"
            icon="user"
          />
        </template>
        <template slot="isSend" slot-scope="text">
          <div v-if="text == 1">
            下单成功
          </div>
          <div v-if="text == 2">
            下单失败
          </div>
          <div v-if="text == 0">
            未下单
          </div>
        </template>
      </a-table>
    </a-card>

    <a-modal title="补单" v-model="modalShow" :width="800" @ok="handleOk" @cancel="handleCancel" cancelText="关闭">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品编号">
          <a-input
            v-decorator="['goodNo', { rules: [{ required: true, message: '请输入商品编号' }] }]"
            placeholder="请输入商品编号"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="sku编号">
          <a-input
            v-decorator="['skuNo', { rules: [{ required: false, message: '请输入sku编号' }] }]"
            placeholder="请输入sku编号"
          />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-button
      type="primary"
      style="margin:0 auto;display:block;margin-top:20px"
      @click="
        () => {
          this.$router.go(-1)
        }
      "
      >返回</a-button
    >
  </a-spin>
</template>
<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { deleteAction, getAction, downFile, putAction, httpAction } from '@/api/manage'
import { filterObj } from '@/utils/util'
export default {
  mixins: [JeecgListMixin],
  name: 'Supplier1688OrderDeliverGoods',
  data() {
    return {
      modalShow: false,
      form: this.$form.createForm(this),
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
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
          title: '订单编号',
          align: 'center',
          dataIndex: 'orderProviderListId'
        },
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: 'SKU编号',
          align: 'center',
          dataIndex: 'skuNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName'
        },
        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' }
        },

        {
          title: '单价',
          align: 'center',
          dataIndex: 'unitPrice',
          scopedSlots: { customRender: 'unitPrice' }
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '小计',
          align: 'center',
          dataIndex: 'total'
        },
        {
          // 是否下单0：未下单；1：已下单；2：下单失败
          title: '下单状态',
          align: 'center',
          dataIndex: 'isSend',
          scopedSlots: { customRender: 'isSend' }
        },
        {
          title: '状态说明',
          align: 'center',
          dataIndex: 'message'
        },
        {
          title: '第三方订单号',
          align: 'center',
          dataIndex: 'taoOrderId'
        },
        // {
        //   title: '实收运费',
        //   align: 'center',
        //   dataIndex: 'freight'
        // },
        {
          title: '操作',
          dataIndex: 'action',
          align: 'center',
          fixed: 'right',
          width: 150,
          scopedSlots: { customRender: 'action' }
        }
      ],
      url: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        list: 'orderProviderList/orderProviderList/getOrderProviderGoodRecordByOrderProviderListId',
        replenishment: 'orderProviderList/orderProviderList/replenishment'
      },
      showRecord: {},
      queryParam: {
        orderProviderListId: this.$route.query.record ? this.$route.query.record.id : ''
      }
    }
  },
  // created() {
  // this.init()
  // },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        let path = this.$route.path
        this.ipagination.current = 1
        localStorage.setItem(path + 'pageNo', 1)
      }
      var params = this.getQueryParams() //查询条件

      this.loading = true
      getAction(this.url.list, params).then(res => {
        if (res.success) {
          this.dataSource = res.result
          this.ipagination.total = res.result.total || res.result.length
        }
        if (res.code === 510) {
          this.$message.warning(res.message)
        }
        this.loading = false
      })
    },
    handleImage(imgUrl) {
      if (imgUrl) {
        try {
          return this.url.imgerver + '/' + Object.values(JSON.parse(imgUrl))[0]
        } catch (error) {
          console.error(error, '图片解析出错')
        }
      }
      return ''
    },
    async Supplement(record) {
      this.modalShow = true
      this.showRecord = record
      await this.$nextTick()
      this.form.setFieldsValue(record)
    },
    // init() {
    //   let record = this.$route.query.record
    //   this.queryParam.orderProviderListId = record.orderListId
    // },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          let httpurl = this.url.replenishment
          values.orderProviderGoodRecordId = this.showRecord.id
          getAction(httpurl, values)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.handleCancel()
            })
        }
      })
    },
    handleCancel() {
      this.form.resetFields()
      this.$nextTick(() => {
        this.modalShow = false
        this.loadData()
      })
    }
  }
}
</script>
