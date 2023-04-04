<template>
  <div>
    <a-button @click="selectGoodClick"> 选择商品 </a-button>
    <a-alert
      :closable="false"
      message="重要提示：未选择即无"
    />
    <a-table
      ref="table"
      size="middle"
      bordered
      rowKey="id"
      :columns="goodColumns"
      :dataSource="goodDataSource"
      :defaultExpandAllRows="true"
      :expandedRowKeys="expandedRowKeys"
      :pagination="false">
      <template slot="mainPicture" slot-scope="text,record,index">
        <img class="clickShowImage " :preview="'mainPicture' + index" :src="getImgUrl(JSON.parse(text)[0])" alt="" />
      </template>
      <template slot="expandedRowRender" slot-scope="record,index">
        <a-table
          ref="storeSpecificationtable"
          size="middle"
          bordered
          rowKey="id"
          :columns="storeSpecificationColumns"
          :dataSource="goodDataSource[index].storeSpecifications"
          :pagination="false">
          <template slot="activePrice" slot-scope="text,record,index2">
            <a-input-number style="width: 50%" :min="1" v-model="goodDataSource[index].storeSpecifications[index2].activePrice" @change="activePriceChange(index)"></a-input-number>元
          </template>
        </a-table>
      </template>

      <span slot="action" slot-scope="text, record,index">
             <a-popconfirm title="确定删除吗?" @confirm="() => selectGoodHandleDelete(index)">
                    <a>删除</a>
                  </a-popconfirm>
          </span>

    </a-table>
    <!--店铺商品列表-->
    <store-good-modal ref="storeGoodModal" @ok="selectGoodCallBack"></store-good-modal>
  </div>
</template>

<script>
  import StoreGoodModal from'../SelectStoreGood/StoreGoodModal'
  export default {
    name: 'SelectStoreGood',
    components:{
      StoreGoodModal
    },
    data(){
      return{
        goodDataSource:[],
        goodColumns:[
          {
            title: '商品图片',
            align:"center",
            dataIndex: 'mainPicture',
            scopedSlots:{customRender:'mainPicture'}
          },
          {
            title: '商品名称',
            align:"center",
            dataIndex: 'goodName',

          },
          {
            title: '商品分类',
            align:"center",
            dataIndex: 'typeName'
          },
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice'
          },
          {
            title : '操作',
            dataIndex: 'action',
            align:"center",
            width:150,
            scopedSlots: { customRender: 'action' },
          }
        ],
        storeSpecificationColumns:[
          {
            title: '规格',
            align:"center",
            dataIndex: 'specification',
          },
          {
            title: '销售价',
            align:"center",
            dataIndex: 'price',

          },
          {
            title: '库存',
            align:"center",
            dataIndex: 'repertory'
          },
          {
            title: '活动价',
            align:"center",
            dataIndex: 'activePrice',
            scopedSlots:{customRender:'activePrice'}
          },
        ],
        expandedRowKeys:[]
      }
    },
    watch:{
      goodDataSource:{
        handler() {
          console.log('监听数组变化：',this.goodDataSource)
          this.$emit('change',this.goodDataSource);
        },
        deep:true
      }
    },
    props:{
      storeManageId:{
        type:String,
        default:''
      }
    },
    methods:{
      activePriceChange(index){
        console.log( this.goodDataSource[index].storeSpecifications);
        this.goodDataSource[index].storeSpecifications=this.goodDataSource[index].storeSpecifications.map(item=>{
          return item;
        });
      },
      //选择商品弹窗
      selectGoodClick(){
          this.$refs.storeGoodModal.showModal(this.storeManageId);
      },
      selectGoodCallBack(Good){
        for (let d of Good) {
          let dd=this.goodDataSource.find(item => item.id ===d.id);
          if(!dd){
            this.expandedRowKeys.push(d.id);
            for (let s of d.storeSpecifications){
              s.activePrice=s.price;
            }
            this.goodDataSource.push(d);
          }
        }
      },

      selectGoodHandleDelete(index){
        this.$delete(this.goodDataSource,index);
      },
      getImgUrl(url){
        return window._CONFIG['imgDomainURL']+'/'+url;
      },
    },

  }
</script>

<style scoped>

</style>