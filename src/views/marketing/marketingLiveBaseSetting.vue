<template>
  <div class="marketingLiveBaseSetting" style="background: #ffffff;padding:20px">
    <div class="title">
      直播设置
    </div>
    <a-form :form="form" class="wrap" >
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="直播别名">
        <a-input placeholder="请输入直播别名" style="width:300px;" v-decorator="rules.anotherName"> </a-input>
      </a-form-item>
      
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        help="尺寸355*360 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          首页广告图
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="diagramFileUpload"
          :fileList="diagramFileList"
          :headers="headers"
          @change="diagramHandleChange"
          @preview="diagramHandlePreview"
          listType="picture-card"
        >
          <div v-if="diagramFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="diagramPreviewVisible" @cancel="diagramHandleCancel">
          <img :src="diagramPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="客户端显示">
        <a-radio-group v-decorator="rules.pointsDisplay">
          <a-radio :value="0">
            全部
          </a-radio>
          <a-radio :value="2">
            仅APP
          </a-radio>
          <a-radio :value="1">
            仅小程序
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="是否开启">
        <a-radio-group v-decorator="rules.status">
          <a-radio :value="0">
            关闭
          </a-radio>
          <a-radio :value="1">
            启用
          </a-radio>
        </a-radio-group>
      </a-form-item>
      
      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          规则
        </span>
        <JEditor v-model="AllData.liveDescription"> </JEditor>
      </a-form-item>
     
      
      <div class="button-end"></div>
      <div class="button-operation" style="padding-left:300px">
        <a-button @click="sure" type="primary" style="">
          确认
        </a-button>
      </div>
    </a-form>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import Vue from 'vue'
import { getAction, postAction } from '@/api/manage'

export default {
  name: 'MarketingLiveBaseSetting',
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
        
        pointsDisplay: ['pointsDisplay', { rules: [{ required: true, message: '请选择客户端显示' }] }],
        status: ['status', { rules: [{ required: true, message: '请选择是否开启' }] }]
        
      }),
      AllData: {
        liveDescription: '',
        status: 0,
      },
      //图片配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      url: Object.freeze({
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',

        addOrEdit: '/marketingLiveBaseSetting/marketingLiveBaseSetting/saveAndUpdate', //设置
        queryByOne: '/marketingLiveBaseSetting/marketingLiveBaseSetting/findByOne' ,//返显
        
      }),
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      }
    }
  },
  components: {
    JEditor
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
          try {
            if (allData.indexAddress) {
              let indexAddress1 = Object.values(JSON.parse(allData.indexAddress))
              let indexAddressZ = []
              //图返显
              for (let a = 0; a < indexAddress1.length; a++) {
                let obj = {
                  uid: a,
                  url: this.configure.imgErver + '/' + indexAddress1[a],
                  response: {
                    message: indexAddress1[a]
                  }
                }
                indexAddressZ.push(obj)
              }
              this.diagramFileList = indexAddressZ

            }
        
            
          } catch (e) {
            console.error(e)
          }
        
          
          console.log(allData, 'allData')
          allData.status = allData.status * 1
          allData.pointsDisplay = allData.pointsDisplay * 1

  
        
          this.AllData = { ...this.AllData, ...allData }
          await this.$nextTick()
          this.form.setFieldsValue(this.AllData)
        }
      })
    },
    uploadAction() {
      return this.url.fileUpload
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    //分享图
    diagramHandleCancel() {
      this.diagramPreviewVisible = false
    },

    diagramHandlePreview(file) {
      this.diagramPreviewImage = file.url || file.thumbUrl
      this.diagramPreviewVisible = true
    },

    diagramHandleChange({ fileList }) {
      this.diagramFileList = fileList
    },


    sure() {
      if (!Array.isArray(this.diagramFileList) || this.diagramFileList.length <= 0) {
        this.$message.warn('请上传首页广告图！')
        return false
      }
      if (!this.AllData.liveDescription) {
        this.$message.warn('请填写规则！')
        return false
      }
      
      this.form.validateFields((err, values) => {
        
        if (!err) {
          let formData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let indexAddress = {}//小图
            for (let count = 0; count < this.diagramFileList.length; count++) {
              indexAddress[count] = this.diagramFileList[count].response.message
            }
            formData.indexAddress = this.diagramFileList.length > 0 ? JSON.stringify(indexAddress) : ''
           
            
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
.marketingLiveBaseSetting {
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
    // background: #ffffff;

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
