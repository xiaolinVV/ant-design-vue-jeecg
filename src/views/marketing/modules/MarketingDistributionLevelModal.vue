<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="等级名称">
          <a-input placeholder="请输入等级名称" v-decorator="['levelName', validatorRules.levelName]" />
        </a-form-item>
        <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图标"> -->
        <!-- <a-input placeholder="请输入图标" v-decorator="['icon', {}]" /> -->
        <!-- </a-form-item> -->

        <a-form-item
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          help="尺寸40*40 支持png格式，大小不超过200k"
          validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            图标
          </span>
          <a-upload
            :action="uploadAction"
            :beforeUpload="iconFileUpload"
            :fileList="iconFileList"
            :headers="headers"
            @change="iconHandleChange"
            @preview="iconHandlePreview"
            listType="picture-card"
          >
            <div v-if="iconFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="iconPreviewVisible" @cancel="iconHandleCancel">
            <img :src="iconPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="级别">
          <a-input-number
            style="width:250px"
            :min="0"
            :disabled="model.id"
            :precision="0"
            placeholder="请输入级别"
            v-decorator="['grade', validatorRules.grade]"
          />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="获取方式">
          <!-- ；0：默认获得，1：参与拼购；2：直推人数 -->
          <a-radio-group v-decorator="['waysObtain', validatorRules.waysObtain]">
            <a-radio :style="radioStyle" :value="0">
              默认获得
            </a-radio>
            <a-radio :style="radioStyle" :value="1">
              参与拼团
              <a-input-number style="width:200px" :min="0" :precision="0" v-model="model.addTimes"></a-input-number>次
            </a-radio>
            <a-radio :style="radioStyle" :value="4">
              参与抢购
            </a-radio>
            <a-radio :style="radioStyle" :value="2">
              直推人数
              <a-input-number style="width:200px" :min="0" :precision="0" v-model="model.direct"></a-input-number>人
              团队人数
              <a-input-number style="width:200px" :min="0" :precision="0" v-model="model.teamNumber"></a-input-number>人
            </a-radio>
            
            <a-radio :style="radioStyle" :value="3">
              直推人数
              <a-input-number style="width:200px" :min="0" :precision="0" v-model="model.direct"></a-input-number>人,
              团队成员有
              <a-select
                v-model="model.marketingDistributionLevelId"
                placeholder="请选择"
                style="width:15%;margin: 0 10px;"
                
              >
                <a-select-option :value="0">请选择</a-select-option>
                <a-select-option v-for="(item,index) in levelNameList" :value="item.id" :key="index" >{{ item.levelName }}</a-select-option>
              </a-select>
              等级
              <a-input-number style="width:50px" :min="0" :precision="0" v-model="model.levelNumber"></a-input-number>人,
            </a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="级差奖励">
          <a-input-number
            style="width:250px"
            :min="0"
            :precision="2"
            v-decorator="['differentialReward', validatorRules.differentialReward]"
            placeholder="请输入级差奖励"
          />%
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="平级奖励">
          <a-input-number
            style="width:250px"
            :min="0"
            :precision="2"
            v-decorator="['levelRewards', validatorRules.levelRewards]"
            placeholder="请输入平级奖励"
          />%
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="称号规则描述">
          <j-editor v-decorator="['rulesDescription', validatorRules.rulesDescription]" triggerChange></j-editor>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction ,getAction} from '@/api/manage'
import pick from 'lodash.pick'
import JEditor from '@/components/jeecg/JEditor'
import moment from 'moment'
import Vue from 'vue'
export default {
  name: 'MarketingDistributionLevelModal',
  components: {
    JEditor
  },
  data() {
    return {
      title: '操作',
      visible: false,

      model: {
        direct: 0,
        teamNumber: 0,
        addTimes: 1,
        marketingDistributionLevelId:'',
        levelNumber:'',
      },
      radioStyle: {
        display: 'block',
        height: '50px',
        lineHeight: '50px'
      },
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      //主图
      iconFileList: [],
      iconPreviewVisible: false,
      iconPreviewImage: '',
      iconFilePic: true,
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        levelName: {
          rules: [
            {
              required: true,
              message: '请输入等级名称!'
            }
          ]
        },
        grade: {
          rules: [
            {
              required: true,
              message: '请输入级别!'
            }
          ]
        },
        differentialReward: {
          rules: [
            {
              required: true,
              message: '请输入级差奖励'
            }
          ]
        },
        levelRewards: {
          rules: [
            {
              required: true,
              message: '请输入平级奖励'
            }
          ]
        },
        rulesDescription: {
          rules: [
            {
              required: false,
              message: '请输入规则描述'
            }
          ]
        },
        waysObtain: {
          rules: [
            {
              required: true,
              message: '请选择获得方式'
            }
          ]
        }
      },
      url: {
        add: '/marketing/marketingDistributionLevel/add',
        edit: '/marketing/marketingDistributionLevel/edit',
        getMarketingDistributionLevelList: 'member/memberDistributionLevel/getMarketingDistributionLevelList',//获取登记列表数据
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      levelNameList: [],//分销等级
    }
  },
  computed: {
    uploadAction() {
      return this.url.fileUpload
    },

  },
  created() {
    console.log("开始")
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    this.getlevelNameList()
    console.log("结束")
  },
  methods: {
    getlevelNameList() {
      getAction(this.url.getMarketingDistributionLevelList).then(res => {
        this.levelNameList = res.result
      })
    },
    //主图
    iconFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 0.2
      if (!isLt2M) {
        this.$message.error('图片大小必须在200k以内!')
      }
      this.iconFilePic = isLt2M
      return isLt2M
    },

    iconHandleCancel() {
      this.iconPreviewVisible = false
    },
    iconHandlePreview(file) {
      this.iconPreviewImage = file.url || file.thumbUrl
      this.iconPreviewVisible = true
    },
    iconHandleChange({ fileList }) {
      this.iconFileList = fileList
    },
    add() {
      this.edit({})
    },

    edit(record) {
      this.iconFileList = []
      this.form.resetFields()
      this.model = Object.assign({ direct: 0, teamNumber: 0, addTimes: 1 }, record)
      this.model.waysObtain = this.model.waysObtain ? this.model.waysObtain * 1 : 0
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'levelName',
            'icon',
            'grade',
            'waysObtain',
            'status',
            'statusExplain',
            'direct',
            'teamNumber',
            'differentialReward',
            'levelRewards',
            'marketingDistributionLevelId',
            'levelNumber'
          )
        )
        //时间格式化
        try {
          if (record.icon) {
            let iconIcons = Object.values(JSON.parse(record.icon))
            let iconIconsSz = []
            //封面图
            for (let a = 0; a < iconIcons.length; a++) {
              let obj = {
                uid: a,
                url: this.url.imgerver + '/' + iconIcons[a],
                response: {
                  message: iconIcons[a]
                }
              }
              iconIconsSz.push(obj)
            }
            this.iconFileList = iconIconsSz
          }
        } catch (e) {
          console.error(e)
        }
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      if (this.iconFileList.length <= 0) {
        this.$message.warn('请上传主图')
        return
      }
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          let formData = Object.assign(this.model, values)
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
            formData.status = 1
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          //时间格式化
          let iconIcon = {}
          for (let count = 0; count < this.iconFileList.length; count++) {
            iconIcon[count] = this.iconFileList[count].response.message
          }
          formData.icon = this.iconFileList.length > 0 ? JSON.stringify(iconIcon) : ''

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
