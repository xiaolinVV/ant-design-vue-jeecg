<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">

    <a-spin :spinning="confirmLoading">
      <a-form>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="取消原因">
          <a-textarea  v-model="closeExplain"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {getAction} from '@/api/manage'
  import ATextarea from 'ant-design-vue/es/input/TextArea'

  export default {
    name: "RefundAndAbrogateOrderModal",
    components: { ATextarea },
    data() {
      return {
        title: "操作",
        visible: false,
        model: {
          id:'',
          closeExplain:''
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
        url: {
          refundAndAbrogateOrder: "orderList/orderList/refundAndAbrogateOrder",
        },

      }
    },
    methods: {
      open(record) {
        this.model.id=record;
        this.visible = true;
      },
      close() {

        this.visible = false;
      },
      handleOk() {
        this.confirmLoading = true;
        getAction(this.url.refundAndAbrogateOrder, this.model).then((res) => {
          if (res.success) {
            this.$message.warning(res.message);
            this.$emit('ok');
            this.confirmLoading = false;
            this.close();
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      handleCancel() {
        this.close()
      },
    }
  }
</script>

<style scoped>

</style>