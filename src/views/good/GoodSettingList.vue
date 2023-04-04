<template>
  <div class="MarketingGroupIntegralBaseSetting">
    <div class="title">
      基础设置
    </div>
    <a-form :form="form" class="wrap">
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="开启品牌">
        <a-radio-group v-decorator="rules.openBrand">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            开启
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否机械配件商城">
        <a-radio-group v-decorator="rules.machineParts">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            开启
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="终端商品列表">
        <a-radio-group v-decorator="rules.goodListModel">
          <a-radio value="0">
            一行一列
          </a-radio>
          <a-radio value="1">
            一行l两列
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="商品分类控制">
        <a-radio-group v-decorator="rules.openGoodType">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            开启
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-card title="vip管理：" style="margin-top: 30px" bordered>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启VIP">
        <a-radio-group v-decorator="rules.viewVip">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            开启
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启会员等级">
        <a-radio-group v-decorator="rules.openMemberGrade">
          <a-radio value="0">
            关闭
          </a-radio>
          <a-radio value="1">
            开启
          </a-radio>
        </a-radio-group>
      </a-form-item>
      </a-card>
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
  export default {
    name: 'GoodSettingList',
    components: {

    },
    data() {
      return {
        form: this.$form.createForm(this),
        labelCol: Object.freeze({ span: 2 }),
        wrapperCol: Object.freeze({ span: 12 }),
        rules: Object.freeze({
          openBrand: ['openBrand', { rules: [{ required: true, message: '请选择是否开启品牌' }] }],
          machineParts: ['machineParts', { rules: [{ required: true, message: '请选择是否开启机械配件商城' }] }],
          viewVip: ['viewVip', { rules: [{ required: true, message: '请选择是否开启VIP' }] }],
          openMemberGrade: ['openMemberGrade', { rules: [{ required: true, message: '请选择是否开启会员等级' }] }],
          goodListModel: ['goodListModel', { rules: [{ required: true, message: '请选择是终端列表展示模式P' }] }],
          openGoodType:['openGoodType', { rules: [{ required: true, message: '请选择是否开启分类' }] }],
        }),
        radioStyle: Object.freeze({
          height: '30px',
          lineHeight: '15px'
        }),
        AllData: {
          openBrand: '0',
          machineParts:'0',
          viewVip:'0',
          openMemberGrade:0,
          openGoodType:'0',
          goodListModel:'0'
        },
        url: Object.freeze({
          addOrEdit: '/good/goodSetting/addOrEdit', //设置
          queryByOne: '/good/goodSetting/queryByOne' ,//返显

        }),
      }
    },
    created() {
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