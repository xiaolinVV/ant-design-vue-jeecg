<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    fullscreen
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :footer="null"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-card class="card" :bordered="false">
        <a-tabs :activeKey="activeKey" tabPosition="left" @tabClick="tabClick">
          <a-tab-pane tab="附加单据" key="1">
            <component ref="realForm" @ok="submitCallback" :disabled="true" :form-bpm='formBpm' :form-data='formData' :is="formComponent"></component>
          </a-tab-pane>
          <a-tab-pane tab="任务处理" key="2">
            <flow-my-business-config-list :process-definition-key='processDefinitionKey'></flow-my-business-config-list>
          </a-tab-pane>
          <a-tab-pane tab="流程图" key="3">
            <flow-my-business-config-list :process-definition-key='processDefinitionKey'></flow-my-business-config-list>
          </a-tab-pane>
        </a-tabs>

      </a-card>
    </a-spin>

  </j-modal>
</template>

<script>

  import FlowMyBusinessConfigList from '@/views/flowable/flowMyBusinessConfig/FlowMyBusinessConfigList'
  export default {
    name: 'ActApprovalModal',
    components: {
      FlowMyBusinessConfigList
    },
    props: {
      // 表单页面地址
      formComponentUrl: {
        type: String,
        default: '',
        required: false
      }
    },
    data () {
      return {
        title:'',
        width:1500,
        visible: false,
        disableSubmit: false,
        confirmLoading: false,
        activeKey:"1",
        processDefinitionKey: "",
        dataId: "",
        formBpm: false, //表单模式：true流程表单 false普通表单
        formData: {     //流程表单data
          disabled: true,
          dataId: ""
        },
        formComponent: "",
      }
    },
    methods: {
      // 动态注册表单组件
      registerFormComponent (formComponentUrl) {
        if (formComponentUrl) {
          // this.formComponent = require(`${formComponentUrl}`).default;
          // this.formComponent = () => import(`${formComponentUrl}`);
          this.formComponent = () => import(`@/views/${formComponentUrl}`);
        }
      },
      showModal (formComponentUrl) {
        this.registerFormComponent(formComponentUrl);
        this.visible=true
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$emit('ok');
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      },
      tabClick(key){
        this.activeKey = key;
      },
    }
  }
</script>