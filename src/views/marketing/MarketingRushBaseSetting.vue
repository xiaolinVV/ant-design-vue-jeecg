<template>
  <div class="MarketingGroupIntegralBaseSetting">
    <div class="title">
      单品抢购
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="模块别名">
        <a-input placeholder="请输入模块别名" style="width:300px;" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动标签">
        <a-input placeholder="请输入活动标签" style="width:300px;margin-right:10px;" v-decorator="rules.label"> </a-input>
        <span>字数不能超过4个字</span>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio value="0">
            全部
          </a-radio>
          <a-radio value="1">
            仅APP
          </a-radio>
          <a-radio value="2">
            仅小程序
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            启用
          </a-radio>
        </a-radio-group>
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
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'MarketingGroupIntegralBaseSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 2 }),
      wrapperCol: Object.freeze({ span: 12 }),
      rules: Object.freeze({
        anotherName: [
          'anotherName',
          {
            rules: [
              { required: true, message: '请输入活动别名' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],
        label: [
          'label',
          {
            rules: [
              { required: true, message: '请输入活动标签' },
              {
                max: 4,
                message: '字数不能超过4个字'
              }
            ]
          }
        ],
        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }],
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        status: '0',
        pointsDisplay:'0'
      },
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',

        addOrEdit: '/marketingRushBaseSetting/marketingRushBaseSetting/saveAndUpdate', //设置
        queryByOne: '/marketingRushBaseSetting/marketingRushBaseSetting/findByOne' ,//返显

      }),
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getList()
  },
  methods: {
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        if (res.success && res.result) {
          let allData = res.result
          this.AllData = { ...this.AllData, ...allData }
          await this.$nextTick()
          this.form.setFieldsValue(this.AllData)
        }
      })
    },
    sure() {
      this.form.validateFields((err, values) => {

        if (!err) {
          let formData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            postAction(this.url.addOrEdit, formData)
              .then(res => {
                if (res.success) {
                  this.$message.success('成功！')
                  this.getList()
                } else {
                  this.$message.warn('失败')
                }
              })
              .catch(err => {
                this.$message.warn('失败')
              })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.MarketingGroupIntegralBaseSetting {
	width: 100%;
	background: white;

	.title {
		margin-top: 12px;
		padding: 25px;
		border-bottom: 1px solid #d9d9d9;
		font-weight: 700;
		font-size: 16px;
	}

	.wrap {
		margin-top: 30px;

		.Discount {
			input {
				margin: 0 15px;
				width: 75px;
			}
		}

		.attention {
			margin-top: 10px;
			padding: 0 20px;
			border: 1px solid rgb(0, 153, 255);
			border-radius: 5px;
			background: rgb(204, 235, 255);
			line-height: 34px;
			font-size: 13px;
			color: black;

			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
		}
	}

	.button-operation {
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		padding-bottom: 20px;
		width: 200px;

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