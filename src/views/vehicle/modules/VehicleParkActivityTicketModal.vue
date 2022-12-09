<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动名称">
          <a-input placeholder="请输入活动名称" v-decorator="validatorRules.activityName" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="活动条件">
          <!-- ；0：累计消费满，1：单笔消费满 -->
          <!-- activityConditions -->
          <div style="display:flex;align-items:center">
            <a-select v-model="model.activityConditions" style="width:150px;margin-right:5px">
              <a-select-option :value="0">累计消费满</a-select-option>
              <a-select-option :value="1">单笔消费满</a-select-option>
            </a-select>
            <a-input-number
              :min="0"
              :precision="2"
              v-decorator="validatorRules.price"
              style="width:150px"
              placeholder="请输入"
            />
          </div>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开始时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.startTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="结束时间">
          <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="validatorRules.endTime" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <!-- vehicleParkTicketId -->
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            选停车券
          </span>
          <a-button type="primary" @click="showParkingCoupon">请选择</a-button>
          <a-table
            :columns="columnsResult"
            :data-source="dataSourceResult"
            rowKey="id"
            bordered
            v-if="dataSourceResult.length > 0"
          >
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm v-if="dataSource.length" title="确定删除吗？" @confirm="() => onDelete(record)">
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
            <template slot="count">
              1
            </template>
            <template slot="preferentialTime" slot-scope="text, record">
              {{ text }}{{ record.timeType == 1 ? '分钟' : '小时' }}
            </template>

            <template slot="effectiveDays" slot-scope="text">
              {{ text }} 天有效（含当日)
            </template>

            <template slot="mainPicture" slot-scope="text, record, index">
              <img
                class="clickShowImage"
                v-if="text != undefined"
                :preview="'mainPicture' + index"
                :src="handleImage(text)"
                alt=""
              />
              <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-modal title="选择券" :width="1200" :visible="selectCouponVisible" @ok="selectOk" @cancel="selectCancel">
      <div style="display:flex;align-itmes:center;margin-bottom:10px">
        <div style="display:flex;align-itmes:center;margin-right:10px">
          <div style="line-height:32px;margin-right:5px">
            停车券编号:
          </div>
          <a-input v-model="queryParam.serialNumber" style="width:200px" placeholder="请输入停车券编号"></a-input>
        </div>
        <div style="display:flex;align-itmes:center;margin-right:10px">
          <div style="line-height:32px;margin-right:5px">
            券名称:
          </div>
          <a-input v-model="queryParam.ticketName" style="width:200px" placeholder="请输入券名称"></a-input>
        </div>
        <a-button type="primary" @click="search">查询</a-button>
      </div>
      <a-table
        :row-selection="rowSelection"
        :columns="columns"
        :data-source="dataSource"
        :pagination="selectPagination"
        rowKey="id"
        bordered
        :loading="popUPTableLoading"
        @change="handleSelectTableChange"
      >
        <template slot="preferentialTime" slot-scope="text, record">
          {{ text }}{{ record.timeType == 1 ? '分钟' : '小时' }}
        </template>

        <template slot="effectiveDays" slot-scope="text">
          {{ text }} 天有效（含当日)
        </template>

        <template slot="mainPicture" slot-scope="text, record, index">
          <img
            class="clickShowImage"
            v-if="text != undefined"
            :preview="'mainPicture' + index"
            :src="handleImage(text)"
            alt=""
          />
          <a-avatar shape="square" v-if="text == undefined || text == ''" :src="handleImage(text)" icon="user" />
        </template>
      </a-table>
    </a-modal>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import moment from 'moment'

import { httpAction, getAction, postAction, putAction } from '@/api/manage'
export default {
  name: 'VehicleParkActivityTicketModal',
  data() {
    return {
      title: '操作',
      visible: false,
      selectCouponVisible: false,
      model: {
        activityConditions: 0
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      dataSource: [],
      queryParam: {},
      dataSourceResult: [],
      //查询table分页配置
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      columns: [
        {
          title: '停车券编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '券名称',
          align: 'center',
          dataIndex: 'ticketName'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '优惠',
          align: 'center',
          dataIndex: 'preferentialTime',
          scopedSlots: { customRender: 'preferentialTime' }
        },
        {
          title: '有效期',
          align: 'center',
          dataIndex: 'effectiveDays',
          scopedSlots: { customRender: 'effectiveDays' }
        }
      ],
      columnsResult: [
        {
          title: '停车券编号',
          align: 'center',
          dataIndex: 'serialNumber'
        },
        {
          title: '券名称',
          align: 'center',
          dataIndex: 'ticketName'
        },
        {
          title: '主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '优惠',
          align: 'center',
          dataIndex: 'preferentialTime',
          scopedSlots: { customRender: 'preferentialTime' }
        },
        {
          title: '有效期',
          align: 'center',
          dataIndex: 'effectiveDays',
          scopedSlots: { customRender: 'effectiveDays' }
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' }
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      popUPTableLoading: false,
      confirmLoading: false,
      selectedRowKeys: [], // Check here to configure the default column
      selectionRows: [],
      form: this.$form.createForm(this),
      validatorRules: {
        activityName: ['activityName', { rules: [{ required: true, message: '请输入活动名称!' }] }],
        price: ['price', { rules: [{ required: true, message: '请输入价格!' }] }],
        startTime: ['startTime', { rules: [{ required: true, message: '请选择开始时间!' }] }],
        endTime: ['endTime', { rules: [{ required: true, message: '请选择结束时间!' }] }]
      },
      url: {
        add: '/vehicle/vehicleParkActivityTicket/add',
        edit: '/vehicle/vehicleParkActivityTicket/edit',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        vehicleParkActivityTicket: 'vehicle/vehicleParkTicket/list'
      }
    }
  },
  created() {},
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
        type: 'radio'
      }
    }
  },
  methods: {
    onDelete(record) {
      this.dataSourceResult = this.dataSourceResult.filter(item => item.id !== record.id)
      this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== record.id)
      this.selectionRows = this.selectionRows.filter(item => item.id !== record.id)
    },
    async handleSelectTableChange(pagination) {
      console.log(pagination)
      this.selectPagination.current = pagination.current
      await this.$nextTick()
      this.search()
    },
    search(clickSearch = false) {
      this.popUPTableLoading = true
      if (clickSearch) {
        this.selectPagination.current = 1
      }
      getAction(this.url.vehicleParkActivityTicket, { ...this.selectPagination, ...this.queryParam }).then(res => {
        this.popUPTableLoading = false
        if (res.success) {
          console.log(res.result)
          this.dataSource = res.result.records
          this.selectPagination.total = res.result.total
          this.selectPagination.pageSize = res.result.size
        } else {
        }
      })
    },
    showParkingCoupon() {
      this.selectCouponVisible = true
      this.$nextTick(() => {
        this.search()
      })
    },
    selectOk() {},
    selectCancel() {},
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
    onSelectChange(selectedRowKeys, selectionRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectionRows = selectionRows
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, this.model, record, { activityConditions: record.activityConditions * 1 || 0 })

      this.visible = true
      if (record.id) {
        this.title = '编辑'
      } else {
        this.title = '新增'
      }
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'activityName', 'activityConditions', 'vehicleParkTicketId', 'status', 'statusExplain')
        )
        //时间格式化
        this.form.setFieldsValue({ startTime: this.model.startTime ? moment(this.model.startTime) : null })
        this.form.setFieldsValue({ endTime: this.model.endTime ? moment(this.model.endTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    selectOk() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.warn('请选择一张券')
        return
      }
      this.selectCouponVisible = false
      this.dataSourceResult = this.selectionRows
      this.model.vehicleParkTicketId = this.selectedRowKeys[0]
    },
    selectCancel() {
      this.selectCouponVisible = false
    },
    handleOk() {
      const that = this
      if (!this.model.vehicleParkTicketId) {
        this.$message.warn('请选择一张券')
        return
      }
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
          formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
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
    }
  }
}
</script>

<style lang="less" scoped></style>
