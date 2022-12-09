<template>
  <a-card :bordered="false">




    <div class="table-operator" style="width: 80%">


      <!-- 最近使用分类 -->
      <div>
        <span v-for="(item,index) in  listGoodUserType">
        <a-Button v-if="item.length==3" @click="addTypeButton(item)"  class="addTypeButton" >{{ item[0].name }} - {{ item[1].name }} -  {{ item[2].name }}</a-Button>
        <a-Button v-if="item.length==2" @click="addTypeButton(item)" class="addTypeButton">{{ item[0].name }} - {{ item[1].name }}</a-Button>
        <a-Button v-if="item.length==1" @click="addTypeButton(item)" class="addTypeButton">{{ item[0].name }}</a-Button>

        </span>

      </div>
      <div>
        <a-auto-complete style="width: 96%;margin-left: 2%" @search="handleSearch" placeholder="请输入关键词搜索分类">
          <template slot="dataSource">
            <a-select-option v-for="item in dataSource" :key="item.id" @click="onSelect(item)">{{item.name}}</a-select-option>
          </template>
        </a-auto-complete>
      </div>

      <!--分类-->
      <div style="margin: 2%">
        <a-row type="flex" >
          <!--一级分类-->
          <a-col :span="8" style="border: 1px solid #eeeeee;height: 300px;overflow: hidden; " :order="1">
            <a-input-search style="width: 98%"  placeholder="一级分类" @search="onSearch1" />
            <div style="overflow-y: scroll;height: 270px;">
              <div class="Typeone " :class="{select:tabSelectIndex1==index}" v-for="(item,index) in listGoodType" @click="chooseMedicine(item.id,item.name,index)"><span class="Typeone-neirong ">{{ item.name }}</span> <a-icon class="Typeone-img " type="right" /></div>
            </div>
          </a-col>
          <!--二级分类-->
          <a-col :span="8" style="border: 1px solid #eeeeee;height: 300px;overflow: hidden; " :order="2">
            <a-input-search style="width: 98%"   placeholder="二级分类" @search="onSearch2" />
            <div style="overflow-y: scroll;height: 270px;">
              <div class="Typeone " :class="{select:tabSelectIndex2==index}" v-for="(item,index)  in listGoodType1" @click="chooseMedicine1(item.id,item.name,index)"><span class="Typeone-neirong ">{{ item.name }}</span> <a-icon class="Typeone-img " type="right" /></div>
            </div>
          </a-col>
          <!--三级分类-->
          <a-col :span="8" style="border: 1px solid #eeeeee;height: 300px;overflow: hidden; " :order="3">
            <a-input-search style="width: 98%"   placeholder="三级分类" @search="onSearch3" />
            <div style="overflow-y: scroll;height: 270px;">
              <div class="Typeone " :class="{select:tabSelectIndex3==index}" v-for="(item,index) in listGoodType2" @click="chooseMedicine2(item.id,item.name,index)" ><span class="Typeone-neirong ">{{ item.name }}</span> <a-icon class="Typeone-img " type="right" /></div>
            </div>
          </a-col>
        </a-row>


      </div>

      <!--选择内容-->
      <div>
        <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;width: 96%;margin-left:2%">
          <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选：
          <a style="font-weight: 600"><span>{{ GoodTypeName1}}</span>
            <span v-if="GoodTypeName2!=''" > - {{ GoodTypeName2}}</span>
            <span v-if="GoodTypeName3!=''"> - {{ GoodTypeName3}}</span></a>
        </div>
      </div>

      <div style="width: 100%;text-align: center">
        <a-button   type="primary" @click="handleAdd">我已阅读以下须知，确认创建该类商品</a-button>
        <div style="margin-top: 10px">发布须知：准确选择类目有利于商品曝光，促进转化；若错放类目将会导致流量降权或下架整改.</div>
      </div>
    </div>



    <!-- table区域-end -->
    <!-- 表单区域 -->

  </a-card>
</template>

<script>

  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction,postAction } from '@/api/manage'
  import JDate from '@/components/jeecg/JDate'
  import {mapGetters} from 'vuex'
  export default {
    name: "GoodListadd",
    mixins:[JeecgListMixin],
    components: {

      JDate
    },
    data () {
      return {
        description: '商品列表管理页面',
        listGoodUserType:[],
        reusePage:'',
        listGoodType:[],
        listGoodType1:[],
        listGoodType2:[],
        GoodTypeByid:[],
        GoodTypeByid1:[],
        GoodTypeName1:"",
        GoodTypeName2:"",
        GoodTypeName3:"",
        provider:"",
        tabSelectIndex1:-1,
        tabSelectIndex2:-1,
        tabSelectIndex3:-1,
        searchGoodTypeByid1:"",
        searchGoodTypeByid2:"",
        onSearchGoodType:[
        ],
        dataSource:[],
        id:'',
        storeList:"",//店铺列表

       ClassificationJudgment:false,
        url: {
          list:"/goodUserType/goodUserType/list",
          getgoodTypeListcascade:"/goodType/goodType/getgoodTypeListcascade",
          getgoodTypeListName:"/goodType/goodType/getgoodTypeListName" ,
          listGoodUserType:"goodUserType/goodUserType/listGoodUserType",
          getGoodTypeListNameAndParentId:"goodType/goodType/getgoodTypeListNameAndParentId" ,
          addGoodUserType:"/goodUserType/goodUserType/addGoodUserType" ,
          ClassificationJudgment:"goodType/goodType/ClassificationJudgment",

        },
      }
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },

    },
    mounted(){
      this.id = this.$route.query.id
      this.provider=this.$route.query.provider
      this.goodTypeListcascade('0')
      this.listGoodUserTypecascade();
    },



    methods: {

      goodTypeListcascade (parentId){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.getgoodTypeListcascade,{parentId: parentId}).then((res) => {

          if (res.success) {
            that.listGoodType=res.result.listGoodType
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      getQueryField() {
      },
      listGoodUserTypecascade (){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        getAction(that.url.listGoodUserType,{sysUserId:this.userInfo().id}).then((res) => {

          if (res.success) {
            that.listGoodUserType=res.result.listGoodUserType
          } else {
            that.$message.warning(res.message);
          }
        });
      },

      chooseMedicine:function(GoodTypeid,GoodTypeName,index = ''){
        let that = this;
        that.listGoodType1=[];
        that.listGoodType2=[];
        this.GoodTypeByid=[];
        this.GoodTypeByid1=[];
        this.GoodTypeByid1[0]=GoodTypeid;
        this.GoodTypeByid1[1]=GoodTypeName;
        this.GoodTypeByid[0]=this.GoodTypeByid1
        this.searchGoodTypeByid1=GoodTypeid;
        if(!index){
          let listGoodType = this.listGoodType
          for(let count = 0;count<listGoodType.length;count++){
            if(listGoodType[count].id == GoodTypeid){
              index = count;
              break
            }
          }
        }
        this.tabSelectIndex1 = index;
        this.tabSelectIndex2 =-1;
        this.tabSelectIndex3 =-1;
        this.GoodTypeName1=GoodTypeName;
        this.GoodTypeName2="";
        this.GoodTypeName3="";
       return new Promise(resolve => {
         getAction(that.url.getgoodTypeListcascade, {parentId:GoodTypeid}).then((res) => {
           if (res.success) {
             that.listGoodType1=res.result.listGoodType
           } else {
             that.$message.warning(res.message);
           }
           resolve()
         });
       })

      },
      chooseMedicine1:function (GoodTypeid,GoodTypeName,index = '') {
        this.GoodTypeName2=GoodTypeName;
        if(!index){
          let listGoodType = this.listGoodType1
          for(let count = 0;count<listGoodType.length;count++){
            if(listGoodType[count].id == GoodTypeid){
              index = count;
              break
            }
          }
        }
        this.tabSelectIndex2 = index;
        this.tabSelectIndex3 =-1;
        this.GoodTypeByid1=[];
        this.GoodTypeByid1[0]=GoodTypeid;
        this.searchGoodTypeByid2=GoodTypeid;
        this.GoodTypeByid1[1]=GoodTypeName;//this.GoodTypeByid1=[GoodTypeid,GoodTypeName]
        this.GoodTypeByid[1]=this.GoodTypeByid1;//this.GoodTypeByid=[[GoodTypeid,GoodTypeName],[GoodTypeid,GoodTypeName],[GoodTypeid,GoodTypeName]]
        if(this.GoodTypeByid[2]){
          this.GoodTypeByid[2]=null;
        }
        this.GoodTypeName3="";
        let that = this;
        that.listGoodType2=[];
        return new Promise(resolve => {
          getAction(that.url.getgoodTypeListcascade, { parentId: GoodTypeid}).then((res) => {
            if (res.success) {
              that.listGoodType2=res.result.listGoodType
            } else {
              that.$message.warning(res.message);
            }
            resolve()
          });
        })

      },
      chooseMedicine2:function (GoodTypeid,GoodTypeName,index = '') {
        this.GoodTypeName3=GoodTypeName;
        if(!index){
          let listGoodType = this.listGoodType2
          for(let count = 0;count<listGoodType.length;count++){
            if(listGoodType[count].id == GoodTypeid){
              index = count;
              break
            }
          }
        }
        this.tabSelectIndex3 = index;
        this.GoodTypeByid1=[];
        this.GoodTypeByid1[0]=GoodTypeid;
        this.GoodTypeByid1[1]=GoodTypeName;
        this.GoodTypeByid[2]=this.GoodTypeByid1;
        return new Promise(resolve => {
          resolve()
        })
      },
      //搜索框
      handleSearch(value) {
        let that = this;
        getAction(that.url.getgoodTypeListName,{ nodeName: value,level:3}).then((res) => {
          if (res.success) {
            that.dataSource=[];
            for(let i=0;i<res.result.listGoodType.length;i++){
               let result = res.result.listGoodType[i],
                   obj = {
                      name:result.goodTypeParentName+"-"+result.goodTypeSonName+"-" + result.goodTypeGrandsonName,
                      id:result.goodTypeGrandsonId
                  }
              that.dataSource.push(obj);
             }
            that.dataSource = !value ? [] : that.dataSource;
          } else {
            //that.$message.warning(res.message);
          }
        });
      },
      onSelect(value) {
        if(value!="" || value!=undefined){
          this.GoodTypeByid = [];
          this.GoodTypeName1=[];
          this.GoodTypeName2=[];
          this.GoodTypeName3=[];
          this.GoodTypeName1 = value.name;
          this.GoodTypeByid1=[value.id,value.name];
          this.GoodTypeByid.push(this.GoodTypeByid1);
        }

      },
      //搜索框
      onSearch1(value) {
        let that = this;
        if(!value){
          return false;
        }
        getAction(that.url.getGoodTypeListNameAndParentId,{ name: value,parentId:0}).then((res) => {
          if (res.success) {
            that.listGoodType=res.result.listGoodType
            that.listGoodType2=[];
            that.listGoodType3=[];
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      onSearch2(value) {
        let that = this;
        if(!value){
          return false;
        }
        getAction(that.url.getGoodTypeListNameAndParentId,{ name: value,parentId:this.searchGoodTypeByid1}).then((res) => {
          if (res.success) {
            that.listGoodType1=res.result.listGoodType
            console.log(that.listGoodType1)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      onSearch3(value) {
        let that = this;
        getAction(that.url.getGoodTypeListNameAndParentId,{ name: value,parentId:this.searchGoodTypeByid2}).then((res) => {
          if (res.success) {
            that.listGoodType2=res.result.listGoodType
            console.log(that.listGoodType2)
          } else {
            that.$message.warning(res.message);
          }
        });
      },
      //最近常分类赋值
      async addTypeButton(item){
        switch (item.length){
          case 1:
            await this.chooseMedicine(item[0].id,item[0].name)
            break;
          case 2:
            await this.chooseMedicine(item[0].id,item[0].name)
            await this.chooseMedicine1(item[1].id,item[1].name)
            break;
          case 3:
            await this.chooseMedicine(item[0].id,item[0].name)
            await this.chooseMedicine1(item[1].id,item[1].name)
            await this.chooseMedicine2(item[2].id,item[2].name)
            break
        }
        // this.chooseMedicine(item[0].id,item[0].name,0)
        // this.chooseMedicine1(item[1].id,item[1].name,0)
        // this.chooseMedicine2(item[2].id,item[2].name,0)
        for(var i=0;i<item.length;i++ ){
          this.GoodTypeByid1=[]
          this.GoodTypeByid1[0]=item[i].id;
          this.GoodTypeByid1[1]=item[i].name;
          this.GoodTypeByid[i]=this.GoodTypeByid1//传递值到GoodListadd2页面的值
        }

        if(item.length==3){
          this.GoodTypeName1=item[0].name;
          this.GoodTypeName2=item[1].name;
          this.GoodTypeName3=item[2].name;
        }else if(item.length==2){
          this.GoodTypeName1=item[0].name;
          this.GoodTypeName2=item[1].name;
        }else if(item.length==1){
          this.GoodTypeName1=item[0].name;
        }

      },
      handleAdd(){
        console.log("this.GoodTypeByid",this.GoodTypeByid)
       // debugger;
       // return false;

        if(this.GoodTypeByid.length==0){
          this.$message.warning('请选择分类');
          return false;
        }
        console.log("this.userInfo().id",this.userInfo().id);
        console.log("this.GoodTypeByid[this.GoodTypeByid.length-1][0]",this.GoodTypeByid[this.GoodTypeByid.length-1][0]);
         let goodUserType={goodTypeId:this.GoodTypeByid[this.GoodTypeByid.length-1][0],sysUserId:this.userInfo().id};
         console.log(goodUserType);
         //三级分类判断
        getAction(this.url.ClassificationJudgment,{goodTypeId:this.GoodTypeByid[this.GoodTypeByid.length-1][0]}).then((res) => {
          if (res.result) {
//             this.$message.success(res.message);
            //三级分类判断
            postAction(this.url.addGoodUserType,goodUserType).then((res) => {
              if (res.success) {
//             this.$message.success(res.message);
              } else {
                this.$message.warning(res.message);
              }
            });
            if(this.$route.query.reusePage){
              this.reusePage = this.$route.query.reusePage;
            }
            console.log("this.reusePage===",this.reusePage)
            //路由跳转
            // localStorage.removeItem('GoodListListInfo')
            this.$router.push({ path: '/good/modules/GoodListadd2' ,query:{GoodTypeByid: this.GoodTypeByid,reusePage:this.reusePage}})

          } else {
            this.$message.warning("请选择三级分类");
            this.ClassificationJudgment = false;
          }
        });


      },


      ...mapGetters(["nickname", "pictureAddr", "userInfo"]),
    }
  }
</script>
<style scoped lang="less">
  .select{
    background: #eeeeee;
  }
  .ant-table-wrapper {
    width: 3000px;
    /*overflow-x: scroll !important;*/
  }
  .addTypeButton{
    width: 22%;margin-left: 2%;margin-bottom: 20px
  }
  .Typeone{
    height: 40px;
    line-height: 40px;
    border: 0.5px solid #eeeeee;
  }
  .Typeone:hover{
    background-color: #eeeeee;
  }
  .Typeone-neirong{
    margin-left: 20px;
  }
  .Typeone-img{
    float: right;
    line-height: 40px;
    margin-right: 10px;
  }
</style>