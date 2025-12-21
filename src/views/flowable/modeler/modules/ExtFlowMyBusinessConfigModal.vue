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
          <a-tab-pane tab="业务关联" key="1">
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
    name: 'ExtFlowMyBusinessConfigModal',
    components: {
      FlowMyBusinessConfigList
    },
    data () {
      return {
        title:'',
        width:1500,
        visible: false,
        disableSubmit: false,
        confirmLoading: false,
        activeKey:"1",
        processDefinitionKey: ""
      }
    },
    methods: {
      showModal (processDefinitionKey) {
        this.processDefinitionKey = processDefinitionKey
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