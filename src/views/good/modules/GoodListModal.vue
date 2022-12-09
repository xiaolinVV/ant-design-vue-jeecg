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
          label="商品图片"><!--//相对地址（以json的形式存储多张）-->
          <a-input placeholder="请输入商品主图相对地址（以json的形式存储多张）" v-decorator="['mainPicture', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品编号">
          <a-input placeholder="请输入商品编号" v-decorator="['goodNo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品名称">
          <a-input placeholder="请输入商品名称" v-decorator="['goodName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="平台商品分类id">
          <a-input placeholder="请输入平台商品分类id" v-decorator="['goodTypeId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="市场价">
          <a-input placeholder="请输入商品市场价" v-decorator="['marketPrice', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="销售价">
          <a-input placeholder="请输入商品销售价格" v-decorator="['price', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员价，"><!--//按照利润比例，根据数据字段设置的比例自动填入-->
          <a-input placeholder="请输入商品会员价，按照利润比例，根据数据字段设置的比例自动填入" v-decorator="['vipPrice', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="供应链用户id">
          <a-input placeholder="请输入供应链用户id" v-decorator="['sysUserId', {}]" />
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
          label="商品别名（默认与商品名称相同）">
          <a-input placeholder="请输入商品别名（默认与商品名称相同）" v-decorator="['nickName', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品成本价">
          <a-input placeholder="请输入商品成本价" v-decorator="['costPrice', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品供货价">
          <a-input placeholder="请输入商品供货价" v-decorator="['supplyPrice', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="参与活动;对应数据字典字段的活动类型数据，为空代表没有参与活动">
          <a-input placeholder="请输入参与活动;对应数据字典字段的活动类型数据，为空代表没有参与活动" v-decorator="['activitiesType', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态：0：停用；1：启用">
          <a-input placeholder="请输入状态：0：停用；1：启用" v-decorator="['status', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品描述">
          <a-input placeholder="请输入商品描述" v-decorator="['goodDescribe', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品视频地址">
          <a-input placeholder="请输入商品视频地址" v-decorator="['goodVideo', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="商品详情图多张以json的形式存储">
          <a-input placeholder="请输入商品详情图多张以json的形式存储" v-decorator="['detailsGoods', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="库存">
          <a-input-number v-decorator="[ 'repertory', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上下架；0：下架；1：上架">
          <a-input placeholder="请输入上下架；0：下架；1：上架" v-decorator="['frameStatus', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="上下架说明">
          <a-input placeholder="请输入上下架说明" v-decorator="['frameExplain', {}]" />
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态说明，停用说明">
          <a-input placeholder="请输入状态说明，停用说明" v-decorator="['statusExplain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="规格说明按照json的形式保存">
          <a-input placeholder="请输入规格说明按照json的形式保存" v-decorator="['specification', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="有无规格；0：无规格；1：有规格">
          <a-input placeholder="请输入有无规格；0：无规格；1：有规格" v-decorator="['isSpecification', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="运费模板id">
          <a-input placeholder="请输入运费模板id" v-decorator="['providerTemplateId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="服务承诺，来自数据字段逗号隔开">
          <a-input placeholder="请输入服务承诺，来自数据字段逗号隔开" v-decorator="['commitmentCustomers', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核状态：0:草稿；1：待审核；2：审核通过；3：审核不通过">
          <a-input placeholder="请输入审核状态：0:草稿；1：待审核；2：审核通过；3：审核不通过" v-decorator="['auditStatus', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="审核原因">
          <a-input placeholder="请输入审核原因" v-decorator="['auditExplain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除原因">
          <a-input placeholder="请输入删除原因" v-decorator="['delExplain', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="删除时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'delTime', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "GoodListModal",
    data () {
      return {
        title:"操作",
        visible: false,
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
          add: "/goodList/goodList/add",
          edit: "/goodList/goodList/edit",
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
        if(this.model.delFlag=="" || this.model.delFlag==undefined){
          this.model.delFlag=0;
        }
        this.$nextTick(() => {
          this.form.setFieldsValue(pick(this.model,'year','month','day','sysUserId','delFlag','goodTypeId','mainPicture','goodName','nickName','price','costPrice','supplyPrice','vipPrice','activitiesType','marketPrice','status','goodDescribe','goodVideo','detailsGoods','repertory','frameStatus','frameExplain','goodNo','statusExplain','specification','isSpecification','providerTemplateId','commitmentCustomers','auditStatus','auditExplain','delExplain'))
		  //时间格式化
          this.form.setFieldsValue({delTime:this.model.delTime?moment(this.model.delTime):null})
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
            formData.delTime = formData.delTime?formData.delTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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


    }
  }
</script>

<style lang="less" scoped>

</style>