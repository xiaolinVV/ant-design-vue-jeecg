<template>
  <div>
    <k-form-build ref="kfb" :value="jsonData" @submit="submitData" />
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
export default {
  name: 'FormBuildPage',
  props: {
    config: Object,
  },
  data () {
    return {
      jsonData: "",
      url: {
        loadJsonData: "/formDesign/formDesign/queryByCode",
      }
    }
  },
  created() {
    this.loadJsonData()
  },
  methods: {
    loadJsonData(){
        getAction(`${this.url.loadJsonData}`,{code: this.config.code}).then(res=>{
          if(res.success){
            this.jsonData = JSON.parse(res.result.designData)
            this.loadFormData()
          }else{
            this.$message.warning(res.message)
          }
        })
    },
    loadFormData(){
      getAction(`${this.config.url.loadFormData}`).then(res=>{
        if(res.success){
          this.$refs.kfb.setData(res.result)
        }else{
          this.$message.warning(res.message)
        }
      })
    },
    submitData (getData) {
      getData()
        .then(values => {
          console.log('验证通过', values)
        })
        .catch(() => {
          console.log('验证未通过，获取失败')
        })
    }
  }
}
</script>

<style scoped>

</style>