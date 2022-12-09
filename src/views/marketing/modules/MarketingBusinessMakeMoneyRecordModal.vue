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
          label="流水号">
          <a-input placeholder="请输入流水号" v-decorator="['serialNumber', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="出账资金id">
          <a-input placeholder="请输入出账资金id" v-decorator="['marketingBusinessMakeMoneyId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="会员id">
          <a-input placeholder="请输入会员id" v-decorator="['memberListId', {}]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="金额">
          <a-input-number v-decorator="[ 'amount', {}]" />
        </a-form-item>
		
      </a-form>
    </a-spin>
  </a-modal>
  <a-modal title="详情" :footer="null" :width="800" v-model="visiblParticularsInformation" @ok="hideModalDistributionInformation()" okText="确认" cancelText="取消">

    <div>

      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        @change="handleTableChange"
        :loading="loading"
      >
      </a-table>
    </div>
  </a-modal>

  </div>
</template>

<script>
  import { httpAction,getAction  } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  export default {
    name: "MarketingBusinessMakeMoneyRecordModal",
    data () {
      return {
        title:"操作",
        visible: false,
        model: {},
        visiblParticularsInformation:false,
        dataSource:[],
        /* 分页参数 */
        ipagination:{
          current: 1,
          pageSize: 10,
          pageSizeOptions: ['10', '20', '30'],
          showTotal: (total, range) => {
            return range[0] + "-" + range[1] + " 共" + total + "条"
          },
          showQuickJumper: true,
          showSizeChanger: true,
          total: 0
        },
        id:"",
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        agencyRechargeRecordList:"",//表格数据
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title: '流水号',
            align:"center",
            dataIndex: 'serialNumber'
          },
          {
            title: '账号',
            align:"center",
            dataIndex: 'phone'
          },
          {
            title: '昵称',
            align:"center",
            dataIndex: 'nickName'
          },
          {
            title: '称号分红金额',
            align:"center",
            dataIndex: 'amount'
          },

        ],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        loading:false,
        url: {
          add: "/marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/add",
          edit: "/marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/edit",
          findMoneyRecordListByMarketingBusinessMakeMoneyId:"/marketingBusinessMakeMoneyRecord/marketingBusinessMakeMoneyRecord/findMoneyRecordListByMarketingBusinessMakeMoneyId"
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
          this.form.setFieldsValue(pick(this.model,'year','month','day','delFlag','serialNumber','marketingBusinessMakeMoneyId','memberListId','amount'))
		  //时间格式化
        });

      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleTableChange(pagination){
        this.ipagination.current = pagination.current;
        this.$nextTick(()=>{
          this.loadData();
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
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            
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
//查看明细弹窗
      showModalParticularsInformation(id){
        this.visiblParticularsInformation = true;
        if(!id){
          return;
        }else{
          this.id = id;
        }
        this.loadData()
      },
      loadData(arg) {
        if(!this.id){
          return
        }
        this.loading = true;
        getAction(this.url.findMoneyRecordListByMarketingBusinessMakeMoneyId,{marketingBusinessMakeMoneyId: this.id,pageNo:this.ipagination.current,pageSize:this.ipagination.pageSize }).then((res) => {
          if (res.success) {
            this.dataSource = res.result.records;
            this.ipagination.total = res.result.total;
          } else {
            this.$message.warning(res.message);
          }
          this.loading = false;
        })
      },

      open(value){
        this.visible = true
        this.title = value.modalTitle
      }
    }
  }
</script>

<style lang="less" scoped>

</style>