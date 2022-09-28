<template>
  <div>
    <k-form-design
      ref="kfd"
      showToolbarsText
      title="表单设计器"
      @save="handleSave"
      @close="handleClose"/>
  </div>
</template>

<script>

import { httpAction } from '@/api/manage'

export default {
  name: 'FormDesign',
  data () {
    return {
      url: {
        edit: "/formDesign/formDesign/edit",
      },
      designData:""
    }
  },
  created() {
    this.$nextTick(()=>{
      this.designData =  this.$route.params.designData
      if (this.designData !== "null") {
        this.$refs.kfd.handleSetData(JSON.parse(this.designData))
      }
    })
  },
  mounted () {
    // this.designData =  this.$route.params.designData
    // this.$refs.kfd.handleSetData(this.designData)
  },
  methods: {
    handleSave(values) {
      const that = this;
      let id = this.$route.params.id
      let param = {
        id: id,
        designData:values
      }
      let httpurl = this.url.edit;
      let method = 'put';
      httpAction(httpurl,param,method).then((res)=>{
        if(res.success){
          that.$message.success("保存成功");
        }else{
          that.$message.warning(res.message);
        }
      }).finally(() => {
      })
    },
    handleClose(){
      this.$router.push({path:'/formDesign/FormDesignList'})
    },
    importData () {
      this.$refs.kfd.handleSetData(this.designData)
    }
  }
}
</script>

<style scoped>

</style>