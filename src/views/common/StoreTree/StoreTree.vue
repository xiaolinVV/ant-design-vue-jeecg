<template>
  <div>

    <a-input-search  v-model="searchValue" style="margin-bottom: 8px" placeholder="店铺查询" @change="onChange" />

    <a-tree
      v-if="storeList.length>0"
      :tree-data="storeListFilt"
      @select="getSelectStore"
    >
    </a-tree>


  </div>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'StoreTree',
    data(){
      return{
        storeList:[],
        storeListFilt:[],
        searchValue:'',
        url:{
          getAllStoreList:"storeManage/storeManage/getAllStoreList",
        }
      }
    },
    created() {
      this.getAllStoreList();
    },
    methods: {
      getSelectStore(e){
        console.log(e);
        let storeInfo=this.storeListFilt.find(item=>item.key===e[0]);
        this.$emit('ok',storeInfo);
      },
      onChange(e){
        console.log(this.searchValue);
        if(this.searchValue) {
          this.storeListFilt = this.storeList.filter(item => item.title.indexOf(this.searchValue) > -1);
        }else{
          this.storeListFilt=this.storeList;
        }
      },
      getAllStoreList() {
        getAction(this.url.getAllStoreList, {}).then((res) => {

          if (res.success) {
            for (let s of res.result) {
              this.storeList.push({
                title: s.storeName,
                key: s.id
              });
              this.storeListFilt.push({
                title: s.storeName,
                key: s.id
              });
            }
            console.log(this.storeList);
          } else {
            this.$message.warning(res.message);
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>