<template>
  <a-spin :spinning="confirmLoading">
    <div class="search">
      <a-card style="margin-top:10px;">
        <p slot="title">
          <span>审批受理</span>
        </p>
        <j-form-container :disabled="formDisabled">
          <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
            <a-row style="position:relative">
              <div class="block">
                  <a-col :span="24">
                    <a-form-model-item label="受理意见" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="comment">
                      <a-textarea v-model="model.comment" rows="3" placeholder="请输入受理意见"/>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="24" v-if='returnTaskDictOptions.length'>
                    <a-form-model-item label="是否退回" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isReturn">
                      <j-dict-select-tag
                        v-model="model.isReturn"
                        placeholder="是否退回指定节点"
                        type='radio'
                        dictCode="actIsReturn"
                      />
                    </a-form-model-item>
                    <a-col :span="24" v-if='returnTaskDictOptions.length && model.isReturn === "1"'>
                      <a-form-model-item label="退回节点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="targetKey">
                        <j-search-select-tag
                          v-model="model.targetKey"
                          :async='false'
                          :dictOptions='returnTaskDictOptions'
                          placeholder="请选择节点"
                        />
                      </a-form-model-item>
                    </a-col>
                    </a-col>
                    <a-col :span="24">
                      <a-form-model-item label="转交人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="candidateUsers">
                        <j-dict-select-tag
                          v-model="model.candidateUsers"
                          placeholder="请选择下一步转交人"
                          dictCode="sys_user,realname,username"
                        />
                      </a-form-model-item>
                    </a-col>
                    <a-col :span="24" style="width: 100%;text-align: center;">
                      <a-button icon="check" style="width: 126px" type="primary" @click="submitForm">提 交</a-button>
                    </a-col>
              </div>
            </a-row>
          </a-form-model>
        </j-form-container>
      </a-card>
    </div>
  </a-spin>
</template>

<script>
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import { completeTask, rejectTask, returnList, returnTask } from '@views/flowable/api/todo'

  export default {
    name: 'ActHandleForm',
    components: {JDictSelectTag},
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data() {
      return {
        model: {
          isReturn: "0"
        },
        bpmModel: {

        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 2},
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16},
        },
        confirmLoading: false,
        validatorRules: {
          candidateUsers: [
            { required: true, message: '请选择下一步审批用户!'},
          ],
          comment: [
            { required: true, message: '请输入受理意见!'},
          ]
        },
        url: {
          add: "/equipment/equipmentApply/add",
        },
        returnTaskDictOptions: []
      }
    },
    computed: {
      formDisabled() {
        return this.disabled
      },
    },
    created() {
      //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add() {
        this.edit(this.modelDefault);
      },
      edit(record) {
        this.bpmModel = Object.assign({}, record);
        this.visible = true;
        returnList({dataId:this.bpmModel.dataId}).then(res => {
          let result = res.result||[]
          this.returnTaskDictOptions = result.map(e =>  {
            let obj = {}
            obj.value = e.id
            obj.text = e.name
            return obj;
          })
          // console.log(this.returnTaskList)
        })
      },
      submitForm() {
        const that = this;
        let formData = Object.assign({
          dataId:this.bpmModel.dataId,
          values:Object.assign({dataId:this.bpmModel.dataId},this.bpmModel)
        }, this.model);

        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            formData.candidateUsers = formData.candidateUsers.split(',')
            if (that.model.isReturn === '0') {
              completeTask(formData).then(res => {
                this.confirmLoading = false;
                if (res.success) {
                  this.$message.success('操作成功');
                  that.$emit('ok');
                } else {
                  this.$message.error('操作失败');
                }
              }).finally(()=>{this.confirmLoading=false});
            } else if (that.model.isReturn === '1'){
              if (!formData.targetKey){
                that.confirmLoading = false;
                this.$message.warn('请选择退回节点！');
                return
              }
              rejectTask(formData).then(res => {
                this.confirmLoading = false;
                if (res.success) {
                  this.$message.success('操作成功');
                  that.$emit('ok');
                } else {
                  this.$message.error('操作失败');
                }
              }).finally(()=>{this.confirmLoading=false});
            }
          }
        })
      },
      popupCallback(value, row) {
        this.model = Object.assign(this.model, row);
      },
    }
  }
</script>