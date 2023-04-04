<template>
  <div>
    <a-button @click="selectDesignationClick"> 选择称号 </a-button>
    <a-alert
      :closable="false"
      message="重要提示：未选择即为不送"
    />
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="titleColumns"
      :dataSource="myTitleDataSource"
      :pagination="false">
      <template slot="rewards" slot-scope="text,record,index">
        <a-input-number :min="0" :max="100" v-model="myTitleDataSource[index].rewards" @change="myTitleDataSourceChange" :key="index"></a-input-number>%
      </template>
      <template slot="logoAddr" slot-scope="text,record,index">
        <img class="clickShowImage " :preview="'mainPicture' + index" :src="getImgUrl(JSON.parse(text)[0])" alt="" />
      </template>

      <span slot="action" slot-scope="text, record,index">
             <a-popconfirm title="确定删除吗?" @confirm="() => selectDesignationHandleDelete(index)">
                    <a>删除</a>
                  </a-popconfirm>
          </span>

    </a-table>
    <span>按照此比例得到的奖励，均分给所有本店称号人员</span>
    <!--称号-->
    <select-designation ref="selectDesignation" @ok="selectDesignationCallBack"></select-designation>
  </div>
</template>

<script>
  import {getAction} from '@/api/manage';
  import SelectDesignation from'../SelectDesignation/SelectDesignation'
  export default {
    name: 'SelectDesignationAward',
    components:{
      SelectDesignation
    },
    data(){
      return{
        //称号

        myTitleDataSource:[],
        titleColumns:[
          {
            title: '称号名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title: '图标',
            align:"center",
            dataIndex: 'logoAddr',
            scopedSlots:{customRender:'logoAddr'}
          },
          {
            title: '称号团队名称',
            align:"center",
            dataIndex: 'groupName'
          },
          {
            title: '奖励比例',
            align:"center",
            dataIndex: 'rewards',
            scopedSlots:{customRender:'rewards'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed: 'right',
            width:150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        url:{
          getDesignationGroupByStoreManageId:"memberDesignationGroup/memberDesignationGroup/getDesignationGroupByStoreManageId",
        }
      }
    },
    props:{
      storeInfo:{
        type:Object,
        default:{
          key:'',
          title:''
        }
      }
    },
    watch:{
      myTitleDataSource:{
        handler() {
          console.log('监听数组变化：',this.myTitleDataSource)
          this.$emit('change',this.myTitleDataSource);
        },
        deep:true
      }
    },
    methods:{
      myTitleDataSourceChange(){
        this.myTitleDataSource=this.myTitleDataSource.map(item=>{
          return item;
        });
      },
      init(param){
        this.myTitleDataSource=[...param];
      },
      //称号
      selectDesignationClick(){
        console.log(this.storeInfo);
        getAction(this.url.getDesignationGroupByStoreManageId, {storeManageId: this.storeInfo.key}).then((res) => {

          if (res.success) {
            let group=res.result;
            if(group){
              this.$refs.selectDesignation.showModal({
                memberDesignationGroupId:group.id
              });
            }else{
              this.$message.warning('商户找不到称号团队');
            }
          } else {
            this.$message.warning(res.message);
          }
        });
      },
      selectDesignationCallBack(designation){
        for (let d of designation) {
          let dd=this.myTitleDataSource.find(item => item.id ===d.id);
          if(!dd){
            d.rewards=0
            this.myTitleDataSource.push(d);
          }
        }
      },

      selectDesignationHandleDelete(index){
        this.$delete(this.myTitleDataSource,index);
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
    },

  }
</script>

<style scoped>

</style>