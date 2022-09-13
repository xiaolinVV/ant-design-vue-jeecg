<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="受理意见" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="comment">
              <a-textarea v-model="model.comment" rows="3" placeholder="请输入受理意见"/>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="下一步转交人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="candidateUsers">
              <j-dict-select-tag
                v-model="model.candidateUsers"
                placeholder="请选择下一步转交人"
                dictCode="sys_user,realname,username"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8" v-if='returnTaskDictOptions.length'>
            <a-form-model-item label="退回节点" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="targetKey">
              <j-search-select-tag
                v-model="model.targetKey"
                :async='false'
                :dictOptions='returnTaskDictOptions'
                placeholder="请选择节点"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>
  import JDictSelectTag from '@/components/dict/JDictSelectTag'
  import { completeTask,returnList } from "@views/flowable/api/todo";

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
        },
        bpmModel: {

        },
        labelCol: {
          xs: {span: 24},
          sm: {span: 5},
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
            debugger
            completeTask(formData).then(res => {
              this.confirmLoading = false;
              if (res.success) {
                this.$message.success('操作成功');
                that.$emit('ok');
              } else {
                this.$message.error('操作失败');
              }
            }).finally(()=>{this.confirmLoading=false});
          }
        })
      },
      popupCallback(value, row) {
        this.model = Object.assign(this.model, row);
      },
    }
  }
</script>