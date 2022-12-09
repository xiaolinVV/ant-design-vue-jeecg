<template>
  <a-modal
    :title="title"
    :width="1200"
    :height="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    :footer="null"
    cancelText="关闭">
    <div class="search">
      <div>
        <div>
          会员昵称：
        </div>
        <a-input v-model="querySearch.nickName">

        </a-input>
      </div>
      <div>
        <div>
          会员手机号：
        </div>
        <a-input v-model="querySearch.phone">

        </a-input>
      </div>
      <div>
        <div>
          点赞时间：
        </div>
<!--        v-model="queryParam.createTime"-->
<!--        @change="onDateChange"-->
<!--        @ok="onDateOk"-->
<!--        v-model="querySearch.time"-->
        <a-range-picker
          style="width: 210px"
          format="YYYY-MM-DD"
          @change="onDateChange"
          :placeholder="['开始时间', '结束时间']"
        />
      </div>
      <a-button type="primary" @click="search" icon="search">查询</a-button>
    </div>
<!--    :scroll="{x:1200,y:200}"-->
    <a-table :columns="memberColumn" :dataSource="memberDataSource"  bordered
             :pagination="selectPagination" @change="handleSelectTableChange" style="margin-top: 10px;" :loading="tableLoading"
    >
      <template slot="headPortrait" slot-scope="text">
        <img preview="1" :src="text" alt="" style="width: 40px;height: 40px;">
      </template>
    </a-table>

  </a-modal>
</template>

<script>
  import { httpAction ,getAction} from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  let memberColumn = [
    {
      title: '会员头像',
      align:"center",
      dataIndex: 'headPortrait',
      scopedSlots: {customRender: "headPortrait"},
      // width:400
    }, {
      title: '会员昵称',
      align:"center",
      dataIndex: 'nickName',
      // width:400
    },{
      title: '会员手机号',
      align:"center",
      dataIndex: 'phone',
      // width:400
    },{
      title: '点赞时间',
      align:"center",
      dataIndex: 'browseTime',
      // width:400
    },
  ]
  export default {
    name: "memberInfoModal",
    props:['type'],
    data () {
      return {
        title:"",
        visible: false,
        model: {},
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        memberColumn,
        memberDataSource:[],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        //查询table分页配置
        selectPagination:{
          current:1,
          pageSize:10,
          pageNo:1,
          total:1
        },
        //查询数据
        querySearch:{
          nickName: '',
          phone :'',
          time:'',
          browseTime_begin:'',
          browseTime_end:''
        },
        //弹窗表加载
        tableLoading: false,
        url:{
          // 素材浏览记录-分页列表查询
          getMarketingMaterialBrowseMap:"/marketingMaterialBrowse/marketingMaterialBrowse/getMarketingMaterialBrowseMap",
          // 素材点赞-分页列表查询:
          getMarketingMaterialDianzanMap:"/marketingMaterialDianzan/marketingMaterialDianzan/getMarketingMaterialDianzanMap"
        }
      }
    },
    created () {
    },
    methods: {
      add () {
        this.edit({});
      },
      edit (record) {
        this.selectPagination.current = 1
        this.selectPagination.pageNo = 1
        this.querySearch = {
          nickName: '',
            phone :'',
            time:'',
            browseTime_begin:'',
            browseTime_end:''
        }
        if(this.type == 'thumbsUp'){
          this.memberColumn[3] = {
            title: '点赞时间',
            align:"center",
            dataIndex: 'browseTime'
          }
          this.title = '点赞记录'
        }
        if(this.type == 'browse'){
          this.memberColumn[3] = {
            title: '浏览时间',
            align:"center",
            dataIndex: 'browseTime'
          }
          this.title = '浏览记录'
        }
        this.model = Object.assign({}, record);
        this.visible = true;
        this.$nextTick(()=>{
          this.search()
        })
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {

      },
      handleCancel () {
        this.close()
      },
      handleSelectTableChange(pagination){
        this.selectPagination.current = pagination.current;
        this.selectPagination.pageNo = pagination.current;
        this.$nextTick(()=>{
          this.search()
        })
      },
      onDateChange(value, dateString) {
        this.querySearch.browseTime_begin = dateString[0]
        this.querySearch.browseTime_end = dateString[1]
      },
      search(){
        this.tableLoading = true
        let apiName;
        // if(!apiName){
          if(this.type == 'browse'){
            apiName = this.url.getMarketingMaterialBrowseMap
          }
          if(this.type == 'thumbsUp'){
            apiName = this.url.getMarketingMaterialDianzanMap
          }
        // }
        let requestInfo = Object.assign({},{marketingMaterialListId:this.model.id},this.querySearch,this.selectPagination)
        getAction(apiName,requestInfo).then(res=>{
          console.log(res);
          let data = res.result
          this.memberDataSource = data.records
          this.tableLoading = false
          this.selectPagination.total = data.total
        })
      }
    },
  }
</script>

<style lang="less" scoped>
.search{
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 50px;
  width:100% ;
  >div{
    display: flex;
    align-items: center;
    input{
      margin-left: 10px;
      width: 150px;
    }
  }
}
</style>