<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    okText="提交"
    cancelText="关闭">
    <component ref="realForm" @ok="submitCallback" :disabled="true" :form-bpm='formBpm' :form-data='formData' :is="formComponent"></component>
    <HistoricActDetail ref="historicDetail" :data-id="dataId"></HistoricActDetail>
    <act-handle-form  ref="actHandleForm" v-if='!disableSubmit' @ok="submitCallback" :disabled="disableSubmit" style='margin-top: 10px'></act-handle-form>
  </j-modal>
</template>

<script>

  import HistoricActDetail from '@views/flowable/components/HistoricActDetail';
  import ActHandleForm from '@views/flowable/components/ActHandleForm';

  export default {
    name: 'ActHandleModal',
    components: {
      HistoricActDetail,
      ActHandleForm
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
        dataId: "",
        formBpm: false,
        formData: {
          disabled: true,
          dataId: ""
        },
        formComponent: "",
      }
    },
    created() {
    },
    watch:{
      formComponentUrl (newVal) {
        if (newVal !== '') {
          let formComponentUrl = "./" + this.formComponentUrl
          // this.formComponent = require(`${formComponentUrl}`).default;
          this.formComponent = () => import(`${formComponentUrl}`)
          console.log('this.formComponent===', this.formComponent);
        }
      }
    },
    methods: {
      // 动态注册表单组件
      registerFormComponent (formComponentUrl) {
        if (formComponentUrl) {
          // this.formComponent = require(`${formComponentUrl}`).default;
          this.formComponent = () => import(`${formComponentUrl}`)
        }
      },
      show (record) {
        this.dataId = record.dataId
        this.visible=true
        this.formData.dataId = record.dataId
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
          if (!this.disableSubmit){
            this.$refs.actHandleForm.edit(record);
          }
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.actHandleForm.submitForm();
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