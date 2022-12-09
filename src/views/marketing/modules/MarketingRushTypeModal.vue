<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类名称">
          <a-input placeholder="请输入分类名称"
                   :min="0"
                   :precision="0"
                   style="width:250px"
                   v-decorator="['rushName', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="分类价格">
          <a-input-number :min="0"
                          :precision="2"
                          style="width:250px"
                          v-decorator="validatorRules.price"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="每日限购">
          <a-input-number :min="0"
                          :precision="0"
                          style="width:250px"
                          v-decorator="[ 'purchaseLimitation', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参与奖励">
          <a-input-number :min="0"
                          :precision="2"
                          style="width:250px"
                          v-decorator="validatorRules.groupRewards"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参与奖励类型">
          <a-select style="width:250px"
                    placeholder="请选择" v-decorator="['groupRewardsType', {}]">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">余额</a-select-option>
          </a-select>
          <!--<a-input placeholder="" v-decorator="['groupRewardsType', {}]"/>-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐奖励">
          <a-input-number :min="0"
                          :precision="2"
                          style="width:250px"
                          v-decorator="validatorRules.recommendGroupRewards"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="推荐奖励类型">
          <a-select style="width:250px" placeholder="请选择" v-decorator="['recommendGroupRewardsType', {}]">
            <a-select-option value="">请选择</a-select-option>
            <a-select-option :value="0">余额</a-select-option>
          </a-select>
          <!--<a-input placeholder="" v-decorator="['recommendGroupRewardsType', {}]"/>-->
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="寄售阀值(单)">
          <a-input-number :min="0"
                          :precision="0"
                          style="width:250px"
                          v-decorator="[ 'transformationThreshold', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="寄售条件">

         
          <a-select
            v-model="marketingPrefectureId"
            placeholder="请选择专区"
            @change="chooseMedicine"
            style="width:180px;margin-right: 10px;"
          >
            <a-select-option :value="0">请选择专区</a-select-option>
            <a-select-option v-for="(item,index) in prefectureList" :value="item.id" :key="index" >{{ item.prefectureName }}</a-select-option>
          
          </a-select>
          
          <a-cascader
            :options="prefectureTypeAll"
            changeOnSelect  
            v-model="marketingPrefectureTypeId"
            style="width: 200px;margin-right:10px;"
            placeholder="请选择分类"
          />
          <span>复购一单</span>
          
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="可寄售(单)">
          <a-input-number :min="0"
                          :precision="0"
                          style="width:250px"
                          v-decorator="[ 'canConsignment', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="转入余额">
          <a-input-number :min="0"
                          :precision="2"
                          style="width:250px"
                          v-decorator="validatorRules.intoBalance"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="转入购物积分">
          <a-input-number :min="0"
                          :precision="2"
                          style="width:250px"
                          v-decorator="validatorRules.intoShoppingCredits"/>
        </a-form-item>

        <!-- <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建年">
          <a-input-number v-decorator="[ 'year', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建月">
          <a-input-number v-decorator="[ 'month', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="创建日">
          <a-input-number v-decorator="[ 'day', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除状态（0，正常，1已删除）">
          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区id">
          <a-input placeholder="请输入专区id" v-decorator="['marketingPrefectureId', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="专区分类id">
          <a-input placeholder="请输入专区分类id" v-decorator="['marketingPrefectureTypeId', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态；0：停用；1：启用">
          <a-input placeholder="请输入状态；0：停用；1：启用" v-decorator="['status', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态说明">
          <a-input placeholder="请输入状态说明" v-decorator="['statusExplain', {}]"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除说明">
          <a-input placeholder="请输入删除说明" v-decorator="['delExplain', {}]"/>
        </a-form-item> -->

      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {httpAction, getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingRushTypeModal",
    data () {
      return {
        title: "操作",
        visible: false,
        model: {},
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules: {
          price: ['price', { rules: [{ required: true, message: '请输入分类价格' }] }],
          groupRewards: ['groupRewards', { rules: [{ required: true, message: '请输入参与奖励' }] }],
          recommendGroupRewards: ['recommendGroupRewards', { rules: [{ required: true, message: '请输入推荐奖励' }] }],
          intoBalance: ['intoBalance', { rules: [{ required: true, message: '请输入转入余额' }] }],
          intoShoppingCredits: ['intoShoppingCredits', { rules: [{ required: true, message: '请输入转入购物积分' }] }],
        },
        url: {
          add: "/marketingRushType/marketingRushType/add",
          edit: "/marketingRushType/marketingRushType/edit",
          getPrefectureList: 'marketingPrefecture/marketingPrefecture/getPrefectureList', //获取专区
          getMarketingPrefectureTypeAll:'marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureTypeAll'//获取专区分类
        },
        prefectureList: [],//专区
        marketingPrefectureId: '',//专区id
        prefectureTypeAll: [],//专区分类
        marketingPrefectureTypeId:'',//专区分类id
        marketingPrefectureTypeIds: [],//专区分类id
      }
    },
    created () {
      this.getPrefectureList()
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        if (record.id){
          record.groupRewardsType = record.groupRewardsType * 1
          record.recommendGroupRewardsType = record.recommendGroupRewardsType * 1
        }

        this.model = Object.assign({}, record);
        console.log(this.model)
        //专区id
        this.marketingPrefectureId = this.model.marketingPrefectureId
        //专区分类id
        if (this.model.marketingPrefectureTypeId !== undefined && this.model.marketingPrefectureTypeId !== '') {
          if (!Array.isArray(this.model.marketingPrefectureTypeId)) {
            this.marketingPrefectureTypeId = this.model.marketingPrefectureTypeId.split(',')
          }
        } else {
          this.marketingPrefectureTypeId = []
        }
        // 如果有分类id请求专区分类
        console.log(this.marketingPrefectureTypeId,'this.marketingPrefectureTypeId')
        if (this.marketingPrefectureTypeId != '') {
            getAction(this.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: this.marketingPrefectureId }).then(res => {
              if (res.success) {
                this.prefectureTypeAll = res.result
              } else {
                this.$message.warning(res.message)
              }
            })
        }
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model, 'year', 'month', 'day', 'delFlag', 'rushName', 'price', 'purchaseLimitation', 'groupRewards', 'groupRewardsType', 'recommendGroupRewards', 'recommendGroupRewardsType', 'transformationThreshold', 'canConsignment', 'marketingPrefectureId', 'marketingPrefectureTypeId', 'status', 'statusExplain', 'delExplain','intoBalance','intoShoppingCredits'))
          //时间格式化
        });
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      // 下拉选择
     chooseMedicine: function(value) {
      console.log(value)//0123456索引
      console.log(this.prefectureList)
      let that = this
      // that.marketingPrefectureId = that.prefectureList[value].id
      that.marketingPrefectureId = value
      getAction(that.url.getMarketingPrefectureTypeAll, { marketingPrefectureId: that.marketingPrefectureId }).then(res => {
        if (res.success) {
          that.prefectureTypeAll = res.result
          console.log(that.prefectureTypeAll,'that.prefectureTypeAll')
        } else {
          that.$message.warning(res.message)
        }
      })

    },
    //获取专区
      getPrefectureList() {
        getAction(this.url.getPrefectureList).then(async res => {
          if (res.success && res.result) {
              this.prefectureList = res.result
              console.log(this.prefectureList,'专区数组')
          }
        })  
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if (!this.model.id) {
              httpurl += this.url.add;
              method = 'post';
            } else {
              httpurl += this.url.edit;
              method = 'post';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.marketingPrefectureId = this.marketingPrefectureId
            formData.marketingPrefectureTypeId = this.marketingPrefectureTypeId.join(',')
            
            console.log(formData, 'formData')
            
            httpAction(httpurl, formData, method).then((res) => {
              if (res.success) {
                that.$message.success(res.message);
                that.$emit('ok');
              } else {
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })


          }
        })
      },
      handleCancel () {
        this.close()
      },
    },
    watch: {
      marketingPrefectureTypeIds: function(newData, oldData) {
        if (newData.length == 2) {
          this.marketingPrefectureTypeId = newData[1]
          console.log(this.marketingPrefectureTypeId,'this.marketingPrefectureTypeId')
        } else {
          this.marketingPrefectureTypeId = newData[0]
          console.log(this.marketingPrefectureTypeId,'this.marketingPrefectureTypeId')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
































































</style>