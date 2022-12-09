<template>
  <div class="MarketingBusinessGiftSetting">
    <div class="title">
      基础设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动别名">
        <a-input placeholder="请输入活动别名,字数不能超过4个字" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="活动标签">
        <a-input placeholder="请输入活动标签,字数不能超过4个字" v-decorator="rules.label"> </a-input>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="分红类型">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio :value="0">
            福利金
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio :value="0">
            全部
          </a-radio>
          <a-radio :value="1">
            仅小程序
          </a-radio>
          <a-radio :value="2">
            仅app
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio :style="radioStyle" :value="0">关闭</a-radio>
          <a-radio :style="radioStyle" :value="1">开启</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="创业团身份">
        <a-row :gutter="24" style="background-color:#f6f6f6;margin-left:10px;">
          <a-col :span="4">
            <a-card title="称号" :bordered="false" style="background-color:#f6f6f6;">
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
            </a-card>
          </a-col>
          <a-col :span="5">
            <a-card title="级别" :bordered="false" style="background-color:#f6f6f6;">
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
              <p><a-input placeholder="" v-decorator=""> </a-input></p>
            </a-card>
          </a-col>
          <a-col :span="5">
            <a-card title="发展奖励" :bordered="false" style="background-color:#f6f6f6;">
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
            </a-card>
          </a-col>
          <a-col :span="5">
            <a-card title="推荐奖励" :bordered="false" style="background-color:#f6f6f6;">
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
            </a-card>
          </a-col>
          <a-col :span="5">
            <a-card title="业绩达标奖励" :bordered="false" style="background-color:#f6f6f6;">
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
              <p style="display: flex;align-items:center;">
                <a-input placeholder="" v-decorator=""> </a-input>
                <span>%</span>
              </p>
            </a-card>
          </a-col>
        </a-row>
      </a-form-item> -->
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="业绩达标奖励条件">
        <span>团队长,当前团队推荐购买人数</span>
        <a-input placeholder="" v-decorator="rules.numberStandard" style="width:50px;margin:0 10px;"> </a-input>
        <span
          >人以上(含两人),即可获得业绩达标奖励,成团后以余额的方式奖励给团长,未达标则该团的业绩达标奖励将转入到云豆资金池,按照比例分配。</span
        >
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
// import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'MarketingBusinessGiftSetting',
  data() {
    return {
      headers: '',
      form: this.$form.createForm(this),
      labelCol: Object.freeze({ span: 3 }),
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
          { rules: [{ required: true, message: '请输入活动标签' }, { max: 4, message: '字数不能超过4个字' }] }
        ],

        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }],
        numberStandard: ['numberStandard', { rules: [{ required: true, message: '请输入达标人数' }] }]
      }),
      radioStyle: Object.freeze({
        height: '30px',
        lineHeight: '15px'
      }),
      AllData: {
        status: 0
      },

      //接口
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        addOrEdit: 'marketingBusinessGiftBaseSetting/marketingBusinessGiftBaseSetting/saveAndUpdate', //新增编辑
        queryByOne: 'marketingBusinessGiftBaseSetting/marketingBusinessGiftBaseSetting/findByOne' //返现
      }),
      //配置
      configure: Object.freeze({
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      })
    }
  },
  // components: {
  //   JEditor
  // },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getList()
  },
  methods: {
    getList() {
      getAction(this.url.queryByOne).then(async res => {
        let allData = res.result

        allData.status = allData.status * 1
        allData.pointsDisplay = allData.pointsDisplay * 1
        this.AllData = { ...this.AllData, ...allData }
        await this.$nextTick()
        this.form.setFieldsValue(this.AllData)
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },

    sure() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            postAction(this.url.addOrEdit, this.AllData)
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
.MarketingBusinessGiftSetting {
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

      /*width: 1080px;*/
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
