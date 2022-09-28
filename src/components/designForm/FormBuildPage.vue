<template>
  <div>
    <k-form-build ref="kfb" :value="jsonData" />
  </div>
</template>

<script>
import { getAction } from '@/api/manage'
export default {
  name: 'FormBuildPage',
  props: {
    code: String,
  },
  data () {
    return {
      jsonData: "",
      url: {
        loadJsonData: "/formDesign/formDesign/queryByCode"
      }
    }
  },
  watch: {
    code() {
      this.loadJsonData()
    }
  },
  created() {
    this.loadJsonData()
  },
  methods: {
    loadJsonData(){
        getAction(`${this.url.loadJsonData}`,{code: this.code}).then(res=>{
          if(res.success){
            this.jsonData = JSON.parse(res.result.designData)
          }else{
            this.$message.warning(res.message)
          }
        })
    }
  }
}
</script>

<style scoped>

</style>