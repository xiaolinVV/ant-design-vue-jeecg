<template>
  <div class="MarketingVenueSetting">
    <div class="title">
      场次设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="创建方式">
        <a-radio-group v-model="AllData.createMode">
          <a-radio :style="radioStyle" value="0">手动创建</a-radio>
          <a-radio :style="radioStyle" value="1">自动创建</a-radio>
        </a-radio-group>
      </a-form-item>
      <div v-if="AllData.createMode == 1">
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动周期">
          <a-input-number placeholder="请输入活动周期" v-decorator="rules.activityCycle" :min="1" style="width: 200px;">
          </a-input-number>
          天
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="执行日期" v-if="disabledDateResult">
          <a-date-picker showTime :disabled-date="disabledDate" :format="format" v-decorator="rules.executionDate" />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="执行时间">
          <a-radio-group v-decorator="rules.executionTime">
            <a-radio :style="radioStyle" value="0">当日执行（00:00:00）</a-radio>
            <a-radio :style="radioStyle" value="1">次日开始(00:00:00)</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="执行状态">
          <a-radio-group v-decorator="rules.executingState">
            <a-radio :style="radioStyle" value="0">停用</a-radio>
            <a-radio :style="radioStyle" value="1">启用</a-radio>
          </a-radio-group>
        </a-form-item>
      </div>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="温馨提示">
        当前选择创建方式为手动创建，请到免单场次中手动创建
      </a-form-item>
    </a-form>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button @click="sure" type="primary">
        确认
      </a-button>
    </div>
  </div>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import moment from 'moment'
import dayjs from 'dayjs'
export default {
  name: 'MarketingVenueSetting',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 12 }),
      format: 'YYYY-MM-DD',
      rules: Object.freeze({
        executionDate: ['executionDate', { rules: [{ required: true, message: '请选择执行日期' }] }],
        executionTime: ['executionTime', { rules: [{ required: true, message: '请选择执行时间' }] }],
        activityCycle: ['activityCycle', { rules: [{ required: true, message: '请输入活动周期' }] }],
        executingState: ['executingState', { rules: [{ required: true, message: '请选择执行状态' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        createMode: '0'
      },
      disabledDateResult: '',
      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: '/marketing/marketingFreeSessionSetting/addOrEdit', //免单场次设置
        queryByOne: '/marketing/marketingFreeSessionSetting/queryByOne', //返现
        lastExeTime: 'marketing/marketingFreeSession/lastExeTime' //获取场次开始的时间（1）
      })
    }
  },
  created() {
    this.getList()
  },

  watch: {
    'AllData.createMode'(newVal) {
      if (newVal == 1) {
        setTimeout(() => {
          this.form.setFieldsValue(this.AllData)
        }, 150)
      }
    }
  },
  methods: {
    moment,
    // range(start, end) {
    //   const result = []
    //   for (let i = start; i < end; i++) {
    //     result.push(i)
    //   }
    //   return result
    // },

    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment(this.disabledDateResult)
    },
    // disabledDateTime() {
    //   return {
    //     disabledHours: () => this.range(0, 24).splice(4, 20),
    //     disabledMinutes: () => this.range(30, 60),
    //     disabledSeconds: () => [55, 56]
    //   }
    // },
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        let allData = res.result
        allData.executionDate = allData.executionDate ? moment(allData.executionDate, this.format) : null
        allData.activityCycle =
          allData.activityCycle === undefined || allData.activityCycle === '' ? allData.activityCycle : 2
        this.AllData = { ...this.AllData, ...allData }
        await this.$nextTick()
        this.form.setFieldsValue(this.AllData)
      })
      getAction(this.url.lastExeTime).then(res => {
        this.disabledDateResult = res.result
      })
    },
    sure() {
      if (this.AllData.createMode == '0') {
        this.submit(this.AllData)
      } else {
        this.form.validateFields((err, values) => {
          console.log(err)
          if (!err) {
            this.submit(values)
          }
        })
      }
    },
    async submit(values) {
      if (this.AllData.createMode == '1') {
        values.executionDate = dayjs(new Date(values.executionDate._d)).format('YYYY-MM-DD HH:mm:ss')
      } else {
        values.executionDate = ''
      }

      this.AllData = Object.assign({}, this.AllData, values)
      await this.$nextTick()
      postAction(this.url.addOrEdit, this.AllData)
        .then(res => {
          if (res.success) {
            this.$message.success('成功！')
          } else {
            this.$message.warn('失败')
          }
        })
        .catch(err => {
          this.$message.warn('失败')
        })
    }
  }
}
</script>

<style lang="less">
.MarketingVenueSetting {
  background: white;
  width: 100%;

  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 25px;
    border-bottom: 1px solid #d9d9d9;
    margin-top: 12px;
  }

  .wrap {
    margin-top: 30px;

    .Discount {
      input {
        width: 75px;
        margin: 0 15px;
      }
    }

    .attention {
      margin-top: 10px;
      /*width: 1080px;*/
      font-size: 13px;
      line-height: 34px;
      padding: 0 20px;
      color: black;
      background: rgb(204, 235, 255);
      border: 1px solid rgb(0, 153, 255);
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      border-radius: 5px;
    }
  }

  .button-operation {
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin: 0 auto;
    padding-bottom: 20px;

    button {
      width: 80px;
    }
  }

  .button-end {
    margin-bottom: 40px;
    border-bottom: 1px solid gray;
  }
}
</style>
