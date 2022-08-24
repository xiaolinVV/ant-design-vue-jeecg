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
    <k-form-build ref="kfb" :value="jsonData" />
  </j-modal>
</template>

<script>


  export default {
    name: 'DesignFormModal',
    components: {
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,
        jsonData: {
          list: [
            {
              type: 'input',
              label: '单行文本',
              options: {
                width: '100%',
                defaultValue: '',
                placeholder: '请输入',
                disabled: false
              },
              model: 'input_1577875678405',
              key: 'input_1577875678405',
              rules: [{ required: true, message: '必填项' }]
            },
            {
              type: 'date',
              label: '日期选择器',
              options: {
                width: '100%',
                defaultValue: '',
                range: false,
                showTime: false,
                disabled: false,
                clearable: false,
                placeholder: '请选择',
                rangePlaceholder: ['开始时间', '结束时间'],
                format: 'YYYY-MM-DD'
              },
              model: 'date_1577877450971',
              key: 'date_1577877450971',
              rules: [{ required: true, message: '必填项' }]
            },
            {
              type: 'textarea',
              label: '多行文本',
              options: {
                width: '100%',
                minRows: 4,
                maxRows: 6,
                defaultValue: '',
                disabled: false,
                placeholder: '请输入'
              },
              model: 'textarea_1577877446659',
              key: 'textarea_1577877446659',
              rules: [{ required: true, message: '必填项' }]
            },
            {
              type: 'rate',
              label: '评分',
              options: {
                defaultValue: 0,
                max: 5,
                disabled: false,
                allowHalf: false
              },
              model: 'rate_1577877468717',
              key: 'rate_1577877468717',
              rules: [{ required: true, message: '必填项' }]
            }
          ],
          config: {
            layout: 'horizontal',
            labelCol: { span: 4 },
            wrapperCol: { span: 18 },
            hideRequiredMark: false,
            customStyle: ''
          }
        }
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          // 重置表单
          this.$refs.kfb.reset();
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          // 使用k-form-design组件的form属性修改表单数据
          this.$refs.kfb.setData(record)
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        // 使用getData函数获取数据
        this.$refs.kfb.getData().then(values => {
          console.log('验证通过', values)
        }).catch(() => {
          console.log('验证未通过，获取失败')
        })
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