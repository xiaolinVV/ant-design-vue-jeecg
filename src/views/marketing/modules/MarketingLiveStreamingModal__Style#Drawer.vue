<template>
  <a-drawer
      :title="title"
      :width="800"
      placement="right"
      :closable="false"
      @close="close"
      :visible="visible"
  >

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
          label="直播间名称">
          <a-input placeholder="请输入直播间名称" v-decorator="['roomName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="直播流编号">
          <a-input placeholder="请输入直播流编号" v-decorator="['streamNumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="预告时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'noticeTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="开播时间">
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
          label="封面图">
          <a-input placeholder="请输入封面图" v-decorator="['surfacePlot', {}]" />
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
          label="背景墙">
          <a-input placeholder="请输入背景墙" v-decorator="['wallPanel', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主播名字">
          <a-input placeholder="请输入主播名字" v-decorator="['hostName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="主播头像">
          <a-input placeholder="请输入主播头像" v-decorator="['headPortrait', {}]" />
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
          label="推流地址">
          <a-input placeholder="请输入推流地址" v-decorator="['pushStreamAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="OBS推流地址">
          <a-input placeholder="请输入OBS推流地址" v-decorator="['obsStreamAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="OBS推流名称">
          <a-input placeholder="请输入OBS推流名称" v-decorator="['obsStreamName', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="过期时间流过期时间">
          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'streamEndTime', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="RTMP播放地址">
          <a-input placeholder="请输入RTMP播放地址" v-decorator="['rtmpBroadcastAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="FLV播放地址">
          <a-input placeholder="请输入FLV播放地址" v-decorator="['flvBroadcastAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="HLS播放地址">
          <a-input placeholder="请输入HLS播放地址" v-decorator="['hlsBroadcastAddress', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="UDP播放地址">
          <a-input placeholder="请输入UDP播放地址" v-decorator="['udpBroadcastAddress', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
    <a-button type="primary" @click="handleOk">确定</a-button>
    <a-button type="primary" @click="handleCancel">取消</a-button>
  </a-drawer>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"

  export default {
    name: "MarketingLiveStreamingModal",
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
          add: "/marketing/marketingLiveStreaming/add",
          edit: "/marketing/marketingLiveStreaming/edit",
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','roomName','streamNumber','surfacePlot','posters','wallPanel','hostName','headPortrait','sort','pushStreamAddress','obsStreamAddress','obsStreamName','rtmpBroadcastAddress','flvBroadcastAddress','hlsBroadcastAddress','udpBroadcastAddress'))
		  //时间格式化
          this.form.setFieldsValue({noticeTime:this.model.noticeTime?moment(this.model.noticeTime):null})
          this.form.setFieldsValue({startTime:this.model.startTime?moment(this.model.startTime):null})
          this.form.setFieldsValue({endTime:this.model.endTime?moment(this.model.endTime):null})
          this.form.setFieldsValue({streamEndTime:this.model.streamEndTime?moment(this.model.streamEndTime):null})
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
            formData.noticeTime = formData.noticeTime?formData.noticeTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.startTime = formData.startTime?formData.startTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.endTime = formData.endTime?formData.endTime.format('YYYY-MM-DD HH:mm:ss'):null;
            formData.streamEndTime = formData.streamEndTime?formData.streamEndTime.format('YYYY-MM-DD HH:mm:ss'):null;
            
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
/** Button按钮间距 */
  .ant-btn {
    margin-left: 30px;
    margin-bottom: 30px;
    float: right;
  }
</style>