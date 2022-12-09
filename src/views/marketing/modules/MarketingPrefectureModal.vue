<template>
  <div>
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
            label="创建年">
            <a-input-number v-decorator="[ 'year', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建月">
            <a-input-number v-decorator="[ 'month', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="创建日">
            <a-input-number v-decorator="[ 'day', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="专区名称">
            <a-input placeholder="请输入专区名称" v-decorator="['prefectureName', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="排序">
            <a-input-number v-decorator="[ 'sort', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="专区标签">
            <a-input placeholder="请输入专区标签" v-decorator="['prefectureLabel', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="logo图标">
            <a-input placeholder="请输入logo图标" v-decorator="['logoAddr', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="分享图">
            <a-input placeholder="请输入分享图" v-decorator="['coverPlan', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="海报图">
            <a-input placeholder="请输入海报图" v-decorator="['posters', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="专区介绍">
            <a-input placeholder="请输入专区介绍" v-decorator="['prefectureExplain', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="是否显示分类；0：不显示；1：显示">
            <a-input placeholder="请输入是否显示分类；0：不显示；1：显示" v-decorator="['isViewType', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="限制商品;0:不限制；1：限制">
            <a-input placeholder="请输入限制商品;0:不限制；1：限制" v-decorator="['astrictGood', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="成本价低于销售价百分比">
            <a-input-number v-decorator="[ 'astrictPriceProportion', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="专区价限制">
            <a-input-number v-decorator="[ 'prefecturePriceProportion', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="优惠券抵扣；0：不支持；1：支持">
            <a-input placeholder="请输入优惠券抵扣；0：不支持；1：支持" v-decorator="['isDiscount', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="福利金抵扣；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣">
            <a-input placeholder="请输入福利金抵扣；0：不支持福利金抵扣；1：福利金全额抵扣；2：福利金限额抵扣" v-decorator="['isWelfare', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="福利金限额抵扣，最高可抵扣">
            <a-input-number v-decorator="[ 'bigWelfareProportion', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="赠送福利金；0：不支持；1：支持">
            <a-input placeholder="请输入赠送福利金；0：不支持；1：支持" v-decorator="['isGiveWelfare', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="赠送福利金，最高可送">
            <a-input-number v-decorator="[ 'bigGiveWelfareProportion', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="有效期；0：长期有效；1：短期有效">
            <a-input placeholder="请输入有效期；0：长期有效；1：短期有效" v-decorator="['validTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="开始时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'startTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="结束时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'endTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态；0：停用；1：启用；2：草稿">
            <a-input placeholder="请输入状态；0：停用；1：启用；2：草稿" v-decorator="['status', {}]" />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="marketingPrefectureId"  placeholder="id"/>
      <h3>停用后，该专区内的广告和商品都将被停用</h3>
      <p>您确定要停用吗？</p>
      <a-textarea
        placeholder="停用原因"
        v-model="closeExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
  </div>

</template>

<script>
  import { getAction,httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingPrefectureModal",
    data () {
      return {
        title:"操作",
        visible: false,
        visibleStopStatus:false,
        marketingPrefectureId:"",
        closeExplain:"",
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },

        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          add: "/marketingPrefecture/marketingPrefecture/add",
          edit: "/marketingPrefecture/marketingPrefecture/edit",
          updateStatus: "/marketingPrefecture/marketingPrefecture/updateStatus",
        },
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.form.resetFields();
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','prefectureName','sort','prefectureLabel','logoAddr','coverPlan','posters','prefectureExplain','isViewType','astrictGood','astrictPriceProportion','prefecturePriceProportion','isDiscount','isWelfare','bigWelfareProportion','isGiveWelfare','bigGiveWelfareProportion','validTime','status'))
		  //时间格式化
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
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
      //停用弹窗
      showModalStopStatus(id) {
        this.marketingPrefectureId=id;
        this.visibleStopStatus = true;
        this.closeExplain='';
      },
      //停用
      hideModalStopStatus() {
        this.visibleStopStatus = false;
        console.log("this.closeExplain=",this.closeExplain)
        var that = this;
        getAction(that.url.updateStatus, {ids: this.marketingPrefectureId,closeExplain:this.closeExplain,status:'0'}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {
            that.$message.success("修改失败");
          }
        });
      },

    }
  }
</script>

<style lang="less" scoped>

</style>