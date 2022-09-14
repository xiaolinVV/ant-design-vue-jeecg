<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <flow-my-business-config-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></flow-my-business-config-form>
  </j-modal>
</template>

<script>

  import FlowMyBusinessConfigForm from './FlowMyBusinessConfigForm'
  export default {
    name: 'FlowMyBusinessConfigModal',
    components: {
      FlowMyBusinessConfigForm
    },
    data () {
      return {
        title:'',
        width:1000,
        visible: false,
        disableSubmit: false
      }
    },
    methods: {
      add (processDefinitionKey) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add(processDefinitionKey);
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>