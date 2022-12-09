<template>
  <a-card class="MarketingDistributionSetting">
    <div class="title">
      分销设置
    </div>
    <div class="wrap">
      <a-form :form="form">
        <a-form-item label="推荐人限制条件" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group
            v-decorator="['isThreshold', { rules: [{ required: true, message: '请选择推荐人限制条件' }] }]"
          >
            <a-radio value="0">无限制</a-radio>
            <a-radio value="1" style="margin-left: 30px;">需购买礼包</a-radio>
            <!--<a-radio value="2" style="margin-left: 30px;">需成为vip会员</a-radio>-->
            <a-radio value="3" style="margin-left: 30px;">需购买送vip礼包</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="绑定关系条件" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group
            v-decorator="['distributionBuild', { rules: [{ required: true, message: '请选择绑定关系条件' }] }]"
          >
            <a-radio value="0">被推荐人注册</a-radio>
            <a-radio value="1" style="margin-left: 30px;">被推荐人首次购买礼包</a-radio>
            <a-radio value="2" style="margin-left: 30px;">被推荐人首次购买送vip礼包</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="佣金类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group v-decorator="['commissionType', { rules: [{ required: true, message: '请选择佣金类型' }] }]">
            <a-radio value="0" style="margin-left: 30px;">余额</a-radio>
            <a-radio value="1" style="margin-left: 30px;">{{ welfareBabelName }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="是否二级延伸" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group
            v-decorator="['secondaryStretching', { rules: [{ required: true, message: '请选择是否二级延伸' }] }]"
          >
            <a-radio value="1" style="margin-left: 30px;">是</a-radio>
            <a-radio value="0" style="margin-left: 30px;">否</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            佣金比例
          </span>
          <div class="distributionRatio">
            <div class="distributionWrap">
              <div>
                普通会员一级
              </div>
              <a-input-number :min="0" :precision="2" style="width:120px" v-model="AllData.commonFirst" />
              %
            </div>
            <div class="distributionWrap">
              <div>
                vip会员一级
              </div>
              <a-input-number :min="0" :precision="2" style="width:120px" v-model="AllData.vipFirst" />
              %
            </div>
            <div class="distributionWrap">
              <div>
                普通会员二级
              </div>
              <a-input-number :min="0" :precision="2" style="width:120px" v-model="AllData.commonSecond" />
              %
            </div>
            <div class="distributionWrap">
              <div>
                vip会员二级
              </div>
              <a-input-number :min="0" :precision="2" style="width:120px" v-model="AllData.vipSecond" />
              %
            </div>
          </div>
          <div>
            注意：若不做二级分销则设置分销比例为0%。
          </div>
        </a-form-item>
        <a-form-item
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 18 }"
          validate-status="error"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            分销海报图
          </span>
          <a-upload
            :headers="headers"
            :action="uploadAction"
            listType="picture-card"
            :fileList="fileList"
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
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <!--            v-model="AllData.strategy"-->
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            赚钱攻略
          </span>
          <JEditor v-model="AllData.strategy"> </JEditor>
        </a-form-item>
        <a-form-item :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
            店铺分销
          </span>
          <div class="storeDistribution">
            <div class="storeDistribution-line">
              <div>
                归属店铺奖励
              </div>
              <a-input-number
                :min="0"
                :precision="2"
                style="width:120px;;margin: 0 10px;"
                v-model="AllData.affiliationStoreAward"
              />
              <div>
                %，此百分比为平台商品分销利润奖励比例，即与店铺绑定归属关系的会员购买平台商品所产生的利润，按照此比例进行奖励
              </div>
            </div>
            <div class="storeDistribution-line">
              <div>
                销售渠道奖励
              </div>
              <a-input-number
                :min="0"
                :precision="2"
                style="width:120px;margin: 0 10px;"
                v-model="AllData.distributionChannelAward"
              />
              <div>
                %，此百分比为平台商品分销利润奖励比例，即进入该店铺的会员购买平台商品所产生的利润，按照此比例进行奖励
              </div>
            </div>
          </div>
          <div style="color: red;">
            注意：若不做二级分销则设置分销比例为0%，分销佣金来自于店铺利润乘以分销比例。为确保店铺利益，建议不要设置过高的比例。
          </div>
        </a-form-item>
        <a-form-item label="分销等级" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group
            v-decorator="['distributionLevel', { rules: [{ required: true, message: '请选择分销等级' }] }]"
          >
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0" style="margin-left: 30px;">停用</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="状态" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
          <a-radio-group v-decorator="['status', { rules: [{ required: true, message: '请选择状态' }] }]">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0" style="margin-left: 30px;">停用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </div>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button type="primary" @click="sure">
        确认
      </a-button>
    </div>
  </a-card>
</template>
<script>
import JEditor from '@/components/jeecg/JEditor'
import { getAction, putAction, postAction } from '@/api/manage'
import Vue from 'vue'

export default {
  inject: ['rush'],
  data() {
    return {
      form: this.$form.createForm(this),
      AllData: {
        distributionChannelAward: '', //销售渠道百分比
        affiliationStoreAward: '', //归属店铺百分比
        strategy: '', //挣钱攻略
        distributionPosters: '', //分销海报地址
        delFlag: '0',
        isThreshold: '', //门槛
        commonFirst: '', //普通一级分销
        vipFirst: '', //vip一级级分销
        commonSecond: '', //普通二级分销
        vipSecond: '', //vip二级级分销
        distributionBuild: '', //绑定关系条件
        commissionType: '', //佣金类型
        secondaryStretching: '', // 二级延伸
        status: 1, //状态
        distributionLevel: 1
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      //判断调用接口  1添加接口  2 编辑接口
      witchUrl: 1,
      //接口
      url: {
        //返显
        findDistributionSetting: '/marketingDistributionSetting/marketingDistributionSetting/findDistributionSetting',
        //没有返回值时调用的新增接口
        add: '/marketingDistributionSetting/marketingDistributionSetting/add',
        //有返回值时调用的编辑接口
        edit: '/marketingDistributionSetting/marketingDistributionSetting/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  components: {
    JEditor
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    getAction(this.url.findDistributionSetting).then(res => {
      if (res.success) {
        let data = res.result
        data.status = data.status * 1
        data.distributionLevel = data.distributionLevel * 1

        // data.isThreshold = data.isThreshold * 1
        // data.distributionBuild = data.distributionBuild * 1
        if (data.id) {
          //根据status判断是哪个接口
          this.witchUrl = 2
        }
        this.AllData = Object.assign({}, this.AllData, data)
        this.$nextTick(() => {
          this.form.setFieldsValue(data)
        })
        if (data.distributionPosters) {
          this.fileList.push({
            uid: '-1',
            url: this.url.imgerver + '/' + res.result.distributionPosters
          })
        }
      }
    })
  },
  methods: {
    // isThresholdHandleChange(e){
    //   if(e.target.value != 0){
    //     this.showBuyLimitSelect = true
    //   }else{
    //     this.showBuyLimitSelect = false
    //   }
    // },
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

    uploadAction() {
      return this.url.fileUpload
    },
    //保存
    sure() {
      let result =
        this.AllData.commonFirst.toString() &&
        this.AllData.vipFirst.toString() &&
        this.AllData.commonSecond.toString() &&
        this.AllData.vipSecond.toString()
      if (!result) {
        this.$message.warn('请设置完成分销比例！')
        return
      }
      if (!(this.AllData.affiliationStoreAward.toString() && this.AllData.distributionChannelAward.toString())) {
        this.$message.warn('请设置完成店铺分销！')
        return
      }
      if (this.fileList.length <= 0) {
        this.$message.warn('请上传分销海报图')
        return false
      }
      if (!this.AllData.strategy) {
        this.$message.warn('请填写赚钱攻略')
        return false
      }
      this.form.validateFields((err, values) => {
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            if (this.fileList.length && this.fileList[0].response) {
              this.AllData.distributionPosters = this.fileList[0].response.message || this.fileList[0].response.url
            }
            console.log("接口方式：",this.witchUrl)
            if (this.witchUrl == 2) {
              putAction(this.url.edit, this.AllData).then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.rush()
                } else {
                  this.$message.warn(res.message)
                }
              })
            } else {
              postAction(this.url.add, this.AllData).then(res => {
                if (res.success) {
                  this.$message.success(res.message)
                  this.rush()
                } else {
                  this.$message.warn(res.message)
                }
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="less">
.MarketingDistributionSetting {
	width: 100%;

	.title {
		margin-top: 30px;
		padding-bottom: 25px;
		border-bottom: 1px solid gray;
		font-weight: 700;
		font-size: 16px;
	}

	.wrap {
		margin-top: 30px;

		.distributionRatio {
			display: flex;
			flex-wrap: wrap-reverse;
			justify-content: space-around;

			.distributionWrap {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 15px;
				width: 40%;

				input {
					width: 50%;
				}
			}
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
		margin-bottom: 40px;
		border-bottom: 1px solid gray;
	}

	.storeDistribution {
		.storeDistribution-line {
			display: flex;
			justify-content: flex-start;
			align-items: center;
		}
	}
}

</style>
