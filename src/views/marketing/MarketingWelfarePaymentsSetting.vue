<template>
  <a-card class="MarketingWelfarePaymentsSetting" ref="MarketingWelfarePaymentsSetting">
    <div class="title">{{ welfareBabelName }}设置</div>
    <a-form :form="form" class="wrap">
      <a-form-item :label="welfareBabelName + '别名'" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <!--        v-model="DataAll.nickName"-->
        <a-input
          v-decorator="[
            'nickName',
            {
              rules: [
                { required: true, message: '请输入别名标签' },
                { max: 5, message: '字数不能超过5个字' },
                { min: 2, message: '字数最少2个字' }
              ]
            }
          ]"
          style="width: 30%"
          placeholder=""
        />
        <div style="color: red">
          展示于商品详情的价格旁边,2至5字
        </div>
      </a-form-item>

      <a-form-item label="购买折扣" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input
          style="width: 30%"
          v-decorator="[
            'proportion',
            {
              rules: [
                { required: true, message: '请输入购买比例' },
                { pattern: /^[+]{0,1}(\d+)$/, message: '购买比例为正整数！' }
              ]
            }
          ]"
          type="number"
          placeholder=""
        />
        %
      </a-form-item>
      <a-form-item :label="welfareBabelName + '价值'" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-input-number
          style="width: 30%"
          :min="0"
          :precision="2"
          v-decorator="[
            'integralValue',
            {
              rules: [{ required: true, message: `请输入${welfareBabelName + '价值'}` }]
            }
          ]"
          type="number"
          placeholder=""
        />
        元
      </a-form-item>
      <!--      <div class="clearfix">-->
      <!-- <a-form-item
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 12 }"
        validate-status="error"
        help="尺寸1125*480，支持jpg、jpeg、png格式，大小不超过2m。"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          主题图
        </span>
        <a-upload
          :action="uploadAction"
          listType="picture-card"
          :fileList="fileList"
          :headers="headers"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">上传</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          状态
        </span>
        <a-radio-group v-model="DataAll.status" @change="changStatus">
          <a-radio :value="1">启用</a-radio>
          <a-radio :value="0">停用</a-radio>
        </a-radio-group>
      </a-form-item> -->

      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
        <!--        v-model="DataAll.welfareExplain"-->
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          说明
        </span>
        <JEditor v-model="DataAll.welfareExplain"> </JEditor>
      </a-form-item>
      <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }" label="是否开启">
        <a-radio-group v-decorator="['status', { rules: [{ required: true, message: '请选择是否开启' }] }]">
          <a-radio :value="0">关闭</a-radio>
          <a-radio :value="1">开启</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <a-button type="primary" style="display: block;margin: 0 auto;" @click="showModal(3)">保存</a-button>

    <a-modal
      :title="modalTitle"
      :visible="visible"
      @ok="modalOk"
      :confirmLoading="confirmLoading"
      @cancel="modelCancel"
    >
      <p>{{ ModalText }}</p>
      <a-textarea placeholder="请输入说明" :rows="4" v-model="DataAll.stopExplain" v-if="operation == 0" />
    </a-modal>
  </a-card>
</template>
<script>
import JEditor from '@/components/jeecg/JEditor'
import { httpAction, postAction, getAction, putAction } from '@/api/manage'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import Vue from 'vue'

export default {
  components: { AFormItem, JEditor },
  name: 'MarketingWelfarePaymentsSetting',
  inject: ['rush'],
  data() {
    return {
      headers: '',
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this),
      witchUrl: 1,
      //接口
      url: {
        //平台福利金返显接口
        findSetting: '/marketingWelfarePaymentsSetting/marketingWelfarePaymentsSetting/findSetting',
        //平台福利金保存接口
        edit: '/marketingWelfarePaymentsSetting/marketingWelfarePaymentsSetting/edit',
        add: '/marketingWelfarePaymentsSetting/marketingWelfarePaymentsSetting/add',
        savaorUpdateSetting: '/marketingWelfarePaymentsSetting/marketingWelfarePaymentsSetting/savaorUpdateSetting',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      //操作
      operation: '',
      //参数
      DataAll: {
        nickName: '', // 别名
        proportion: '', //购买比例
        integralValue: '', //积分价值
        // topicMap: '', //主题图
        // status: 1, //状态
        stopExplain: '', //停用说明
        welfareExplain: '', //福利金说明
        delFlag: '0',
        status: 0
      },
      ModalText: '',
      visible: false,
      confirmLoading: false,
      modalTitle: '保存'
    }
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    getAction(this.url.findSetting).then(res => {
      if (res.success && res.result) {
        let data = res.result
        data.status = data.status * 1
        if (data.status) {
          this.witchUrl = 2
        }
        this.DataAll = data
        this.$nextTick(() => {
          this.form.setFieldsValue(data)
        })
        if (data.topicMap) {
          this.fileList.push({
            uid: '-1',
            url: this.url.imgerver + '/' + res.result.topicMap
          })
        }
      }
    })
  },
  methods: {
    handleCancel() {
      this.previewVisible = false
    },
    handlePreview(file) {
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange({ fileList }) {
      this.fileList = fileList
    },
    modalOk(e) {
      console.log(e)
      // this.confirmLoading = true;
      // setTimeout(() => {

      // }, 1000);
      if (this.operation == 3) {
        this.sure()
      }
      this.visible = false
      this.confirmLoading = false
    },
    modelCancel() {
      this.visible = false
      if (this.operation != 3) {
        if (this.DataAll.status == 1) {
          this.DataAll.status = 0
        } else {
          this.DataAll.status = 1
        }
      }
    },
    showModal(operation) {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.operation = operation
          switch (operation * 1) {
            case 3:
              if (values.status == 1) {
                this.ModalText = `请核实清楚当前的配置，点击确定您的这些配置将生效,您确定要保存吗？`
              } else {
                this.ModalText = `您已经将该${this.welfareBabelName}设置了停用，点击确定后，${
                  this.welfareBabelName
                }功能将无法使用\r\n您确定要保存吗？`
              }
              this.modalTitle = '保存'
              break
            case 0:
              this.ModalText = `停用后，${this.welfareBabelName}能将无法使用。您确定要停用吗？`
              this.modalTitle = '停用'
              break
            case 1:
              this.ModalText = `启用后，${this.welfareBabelName}功能将开放使用。您确定要启用吗？`
              this.modalTitle = '启用'
              break
          }
          this.visible = true
        }
      })
    },
    changStatus() {
      this.showModal(this.DataAll.status)
    },
    //保存
    sure() {
      if (!this.dataCheck()) {
        return
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.DataAll = Object.assign({}, this.DataAll, values)
          this.$nextTick(() => {
            if (this.fileList[0].response) {
              this.DataAll.topicMap = this.fileList[0].response.message || this.fileList[0].response.url
            }
            postAction(this.url.savaorUpdateSetting, this.DataAll).then(res => {
              if (res.success) {
                this.$message.success('修改成功')
              } else {
                this.$message.success('修改失败')
              }
            })
          })
        }
      })
    },
    //校验
    dataCheck() {
      // if (!(this.DataAll.nickName.length > 1 && this.DataAll.nickName.length < 7)) {
      //   this.$message.warn('展示于商品详情的价格旁边,2至5字')
      //   return false
      // }
      if (!this.DataAll.welfareExplain) {
        this.$message.warn(`请填写${this.welfareBabelName}说明`)
        return false
      }
      // if (this.fileList.length <= 0) {
      //   this.$message.warn('请上传主题图')
      //   return false
      // }
      return true
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        selections: [
          {
            key: 'all-data',
            text: 'Select All Data',
            onSelect: () => {
              this.selectedRowKeys = [...Array(46).keys()] // 0...45
            }
          }
        ],
        onSelection: this.onSelection
      }
    },
    uploadAction() {
      return this.url.fileUpload
    }
  }
}
</script>
<style lang="less">
.MarketingWelfarePaymentsSetting {
	width: 100%;

	.el-dialog {
		-webkit-backface-visibility: hidden;
	}

	.title {
		margin-top: 30px;
		padding-bottom: 25px;
		border-bottom: 1px solid gray;
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
			width: 1080px;
			background: rgb(204, 235, 255);
			line-height: 34px;
			font-size: 13px;
			color: black;

			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
		}
	}

	.operation {
		cursor: pointer;
		color: rgb(24, 144, 255);
	}

	.line-special .ant-checkbox-group,
	.line-special .ant-radio-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 300px;
		height: 39px;

		.ant-radio-wrapper {
			display: flex;
			align-items: center;
		}
	}

	.line-special-second {
		.ant-checkbox-group {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			height: 100px;
		}
	}

	.button-operation {
		display: flex;
		justify-content: space-between;
		margin: 0 auto;
		width: 200px;

		button {
			width: 80px;
		}
	}

	.button-end {
		padding-bottom: 40px;
		border-bottom: 1px solid gray;
	}

	.popUp {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 999;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, .3);

		.pop-wrap {
			margin: 0 auto;
			margin-top: 20vh;
			width: 50%;
			background: white;
			font-size: 12px;

			.title {
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 0 5px 0 20px;
				border-bottom: 1px solid gray;
				width: 100%;
				height: 50px;

				span:nth-child(2) {
					padding: 15px;
					cursor: pointer;
				}
			}
		}

		.cnt {
			padding: 20px;
			width: 100%;

			input {
				width: 120px;
			}

			.title2 {
				display: flex;
				justify-content: space-between;
			}
		}
	}
}

</style>

<!--if(this.witchUrl == 2){
putAction(this.url.edit, this.DataAll).then(res => {
if (res.success) {
this.$message.success(res.message)
this.rush()
} else {
this.$message.warn(res.message)
}
})
}else{
postAction(this.url.add, this.DataAll).then(res => {
if (res.success) {
this.$message.success(res.message)
this.rush()
} else {
this.$message.warn(res.message)
}
})
}-->
