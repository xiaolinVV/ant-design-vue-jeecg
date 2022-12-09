<template>
  <div>
    <a-modal
      title="审核" v-model="visibleAudi" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="id"  placeholder="id"/>
      <a-radio-group @change="" v-model="status">
        <a-radio style="float:left;margin-left: 20px" :style="radioStyle"  v-model="status" value='1' >通过</a-radio>
        <a-radio style="left: 20px" :style="radioStyle"  v-model="status" value='2' >
          不通过
        </a-radio>
      </a-radio-group>
      <a-textarea style="width: 100%;margin-top: 20px" placeholder="请输入" :rows="4" v-if="status==2" v-model="closeExplain" />

    </a-modal>

    <a-modal width="700px"
      title="回复评论" v-model="visibleReply" @ok="hideReplyModal()" okText="确认" cancelText="取消">

      <div style="display:flex;align-items: center;justify-content: space-between;">
        <div>
          <a-avatar shape="square" :src="getAvatarView(marketingMaterialCommentDTO.headPortrait)" icon="user"/>

          <span style="margin-left: 20px;font-size: 16px">{{marketingMaterialCommentDTO.nickName}}</span>
        </div>
        <div><span>{{marketingMaterialCommentDTO.commentTime}}</span></div>
      </div>
      <div style="display:flex;margin-top: 20px;font-size:15px">{{marketingMaterialCommentDTO.content}}</div>
      <a-textarea style="width: 100%;margin-top: 20px" placeholder="请输入回复内容" :rows="4"  v-model="content" />

    </a-modal>
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
            label="素材id">
            <a-input placeholder="请输入素材id" v-decorator="['marketingMaterialList', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="会员列表id">
            <a-input placeholder="请输入会员列表id" v-decorator="['memberListId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="为父类评论为0；子评论：为父类评论id">
            <a-input placeholder="请输入为父类评论为0；子评论：为父类评论id" v-decorator="['parentId', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="评论内容">
            <a-input placeholder="请输入评论内容" v-decorator="['content', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="评论时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'commentTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="状态；0：待审核；1：审核通过；2：审核不通过">
            <a-input placeholder="请输入状态；0：待审核；1：审核通过；2：审核不通过" v-decorator="['status', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="审核时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'auditTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="不通过时间">
            <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'closeTime', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="不通过原因">
            <a-input placeholder="请输入不通过原因" v-decorator="['closeExplain', {}]" />
          </a-form-item>

        </a-form>
      </a-spin>
    </a-modal>
  </div>

</template>

<script>
  import { httpAction,getAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingMaterialCommentModal",
    data () {
      return {
        title:"操作",
        visible: false,
        visibleAudi:false,
        visibleReply:false,
        closeExplain:"",
        marketingMaterialCommentDTO:{},
        content:"",
        status:"1",
        id:"",
        radioStyle: {
          display: 'block',
          height: '30px',
          lineHeight: '30px',
        },
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
          add: "/marketingMaterialComment/marketingMaterialComment/add",
          edit: "/marketingMaterialComment/marketingMaterialComment/edit",
          updateStatus:"/marketingMaterialComment/marketingMaterialComment/updateStatus",
          addReplyComment:"/marketingMaterialComment/marketingMaterialComment/addReplyComment",
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','marketingMaterialList','memberListId','parentId','content','status','closeExplain'))
		  //时间格式化
          this.form.setFieldsValue({commentTime:this.model.commentTime?moment(this.model.commentTime):null})
          this.form.setFieldsValue({auditTime:this.model.auditTime?moment(this.model.auditTime):null})
          this.form.setFieldsValue({closeTime:this.model.closeTime?moment(this.model.closeTime):null})
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
            formData.commentTime = formData.commentTime?formData.commentTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.auditTime = formData.auditTime?formData.auditTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.closeTime = formData.closeTime?formData.closeTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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
      //审核
      showModal(id) {
        this.id=id;
        this.visibleAudi = true;
        this.status = "1";
        this.closeExplain='';
      },
      //审核
      hideModal() {
        this.visibleAudi = false;
        // console.log("this.stopRemark=",this.stopRemark)
        var that = this;
        getAction(that.url.updateStatus, {ids: this.id,closeExplain:this.closeExplain,status:this.status}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {

            that.$message.success("修改失败");
          }
        });
      },
      replyModal(record){
        this.marketingMaterialCommentDTO=record;
        this.visibleReply = true;
        this.content='';
      },
      //回复评论提交
      hideReplyModal() {
        this.visibleReply = false;
        // console.log("this.stopRemark=",this.stopRemark)
        var that = this;
        getAction(that.url.addReplyComment, {id: this.marketingMaterialCommentDTO.id,content:this.content}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {

            that.$message.success("修改失败");
          }
        });
      },

      getAvatarView: function (mainPicture) {
        if(mainPicture){
          if (mainPicture.indexOf('http')!= -1 ){
            return mainPicture
          }
          return this.url.imgerver + "/" +  mainPicture;
        }else{
          return ''
        }

      },
    }
  }
</script>

<style lang="less" scoped>

</style>