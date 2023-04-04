<template>
  <div>
    <a-tree
      v-if="prefectureListFilt.length>0"
      :tree-data="prefectureListFilt"
      @select="getSelectprefecture"
    >
    </a-tree>
<div v-if="prefectureListFilt.length==0&&storeManageId">
  本店铺暂无专区
</div>
    <div v-if="!storeManageId">
      请选择左侧店铺
    </div>

  </div>
</template>

<script>
  import {getAction} from '@/api/manage';
  export default {
    name: 'StorePrefectureTree',
    data(){
      return{
        prefectureListFilt:[],
        storeManageId:'',
        url:{
          getMarketingStorePrefectureListByStoreManageId:"marketing.store.prefecture/marketingStorePrefectureList/getMarketingStorePrefectureListByStoreManageId"
        }
      }
    },
    methods: {
      init(storeManageId){
        this.storeManageId=storeManageId;
        this.prefectureListFilt=[];
        this.getMarketingStorePrefectureListByStoreManageId();
      },
      getSelectprefecture(e){
        console.log(e);
        let prefectureInfo=this.prefectureListFilt.find(item=>item.key===e[0]);
        this.$emit('ok',prefectureInfo);
      },
      getMarketingStorePrefectureListByStoreManageId() {
        getAction(this.url.getMarketingStorePrefectureListByStoreManageId, {
          storeManageId:this.storeManageId
      }).then((res) => {

          if (res.success) {
            for (let s of res.result) {
              this.prefectureListFilt.push({
                title: s.prefectureName,
                key: s.id
              });
              console.log(this.prefectureListFilt);
            }
          }
          else
            {
              this.$message.warning(res.message);
            }
        });
      }
    }
  }
</script>

<style scoped>

</style>