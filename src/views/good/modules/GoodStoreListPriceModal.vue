<template>
  <!--弹窗-->
  <div>
    <!--改价格-->
    <a-modal
      width="60%" title="改价格" v-model="visibleAudi" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodTypeId2"  placeholder="id"/>

      <div>
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodSpecificationColumns"
          :dataSource="dataSource1"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange">
          <template slot="price" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入销售价格"  v-decorator="['price', {}]" v-model="record.price" @input="inputFunPrice"  />

            </div>
          </template>
          <template slot="costPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入成本价格"  v-decorator="['costPrice', {}]" v-model="record.costPrice" @input="inputFunCostPrice" />
            </div>
          </template>
          <template slot="vipPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入会员价格"  v-decorator="['vipPrice', {}]" v-model="record.vipPrice" @input="inputFunVipPrice"/>
            </div>
          </template>
        </a-table>
      </div>
      <div style="margin-top: 10px">
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodPriceColumns"
          :dataSource="dataSource2"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >
          <template slot="marketPrice" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入销售价格"  v-decorator="['marketPrice', {}]" v-model="record.marketPrice" />
            </div>
          </template>
          <template slot="price1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入销售价格"  v-decorator="['price', {}]"  v-model="record.price"/>
            </div>
          </template>
          <template slot="costPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入成本价格"  v-decorator="['costPrice', {}]" v-model="record.costPrice"/>
            </div>
          </template>
          <template slot="vipPrice1" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入会员价格"  v-decorator="['vipPrice', {}]" v-model="record.vipPrice"/>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
    <!--改库存-->
    <a-modal
      width="60%" title="改价格" v-model="visibleRepertory" @ok="hideModal()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodTypeId2"  placeholder="id"/>

      <div>
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodSpecificationRepertory"
          :dataSource="dataSource1"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
          @change="handleTableChange">
          <template slot="repertory" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-input type="number" placeholder="请输入库存"  v-decorator="['price', {}]" v-model="record.repertory" @input="inputFunRepertory"  />
            </div>
          </template>
        </a-table>
      </div>
      <div style="margin-top: 10px">
        <a-table
          ref="table"
          bordered
          rowKey="id"
          :columns="goodPriceRepertory"
          :dataSource="dataSource2"
          :loading="loading"
          :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        >

        </a-table>
      </div>
    </a-modal>
    <!--停用弹出-->
    <a-modal title="停用" v-model="visibleStopStatus" @ok="hideModalStopStatus()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodListId2"  placeholder="id"/>
      <h3>停用分类后，该分类的子分类及关联商品都将被停用，无法访问</h3>
      <p>您确定要停用吗？</p>
      <a-textarea
        placeholder="停用原因"
        v-model="statusExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
    <!--下架弹出-->
    <a-modal title="下架" v-model="visibleFrameStatus" @ok="hideModalFrameStatus()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodListId2"  placeholder="id"/>
      <h3>下架商品后，该商品用户将无法搜索、浏览、购买</h3>
      <p>您确定要下架吗？</p>
      <a-textarea
        placeholder="下架原因"
        v-model="frameExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
    <!--删除弹出-->
    <a-modal title="删除" v-model="visibleDelete" @ok="hideModalDelete()" okText="确认" cancelText="取消">
      <input style="display: none"  :value="goodListId2"  placeholder="id"/>
      <h3>删除商品后，该商品用户将无法搜索、浏览、购买，可以在回收站找回</h3>
      <p>您确定要删除吗？</p>
      <a-textarea
        placeholder="删除原因"
        v-model="delExplain"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </a-modal>
    <br />
    <br />
  </div>
</template>

<script>
  import { httpAction } from '@/api/manage'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { getAction,deleteAction } from '@/api/manage'
  import { putAction } from '@/api/manage'
  import pick from 'lodash.pick'
  import moment from "moment"
  export default {
    name: "GoodStoreListPriceModal",
    mixins:[JeecgListMixin],
    data () {
      return {
        title:"操作",
        visibleAudi:false,
        visibleRepertory:false,
        visibleStopStatus:false,
        visibleFrameStatus:false,
        visibleDelete:false,
        goodListId2:"",
        statusExplain:"",
        frameExplain:"",
        goodTypeId2:"",
        inputPrice:"",//销售价
        inputCostPrice:"",//成本价
        inputSupplyPrice:"",//供货价
        inputVipPrice:"",//会员价
        inputRepertory:"",//库存
        delExplain:"",
        model: {},
        dataSource2:[],
        dataSource1:[],
        dataSourceRepertory1:[],
        dataSourceRepertory2:[],
        Goodlistprice:'',
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        // 规格
        goodSpecificationColumns: [
          {
            title: '规格',//相对地址（以json的形式存储多张）
            align:"center",
            dataIndex: 'specification',
          },

          {
            title: '销售价',
            align:"center",
            dataIndex: 'price',
            scopedSlots: {customRender: "price"}
          },
          {
            title: '成本价',
            align:"center",
            dataIndex: 'costPrice',
            scopedSlots: {customRender: "costPrice"}
          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'vipPrice',
            scopedSlots: {customRender: "vipPrice"}
          }],
        //价格
        goodPriceColumns:[
          {
            title: '市场价',
            align:"center",
            dataIndex: 'marketPrice',
            scopedSlots: {customRender: "marketPrice"}
          },
          {
            title: '销售价',
            align:"center",
            dataIndex: 'price',
          },
          {
            title: '成本价',
            align:"center",
            dataIndex: 'costPrice',

          },
          {
            title: '会员价',
            align:"center",
            dataIndex: 'vipPrice',

          }],
        // 库存
        goodSpecificationRepertory: [
          {
            title: '规格',//相对地址（以json的形式存储多张）
            align:"center",
            dataIndex: 'specification',
          },

          {
            title: '库存',
            align:"center",
            dataIndex: 'repertory',
            scopedSlots: {customRender: "repertory"}
          }],
        //总库存
        goodPriceRepertory:[
          {
            title: '总库存',
            align:"center",
            dataIndex: 'repertory',
          }],
        confirmLoading: false,
        form: this.$form.createForm(this),
        validatorRules:{
        },
        url: {
          list: "/goodStoreList/goodStoreList/list",
          listChangePrice:"/goodStoreSpecification/goodStoreSpecification/listChangePrice",
          updatePrice:"/goodStoreSpecification/goodStoreSpecification/updatePrice",
          updateFrameStatus: "/goodStoreList/goodStoreList/updateFrameStatus",
          updateStatus: "/goodStoreList/goodStoreList/updateStatus",
          deleteAndDelExplain:"/goodStoreList/goodStoreList/deleteAndDelExplain",
        },
      }
    },
    created () {
    },
    methods: {
      showModal(id) {
        console.log("id-------------",id)
        this.goodTypeId2=id;
        this.visibleAudi = true;
        getAction(this.url.listChangePrice,{goodListid:id} ).then((res) => {
          if (res.success) {
            this.dataSource1 = res.result.listgoodSpecification;
            this.dataSource2 = res.result.listGoodList;
          }
        })
      },
      showModalRepertory(id) {
        console.log("id-------------",id)
        this.goodTypeId2=id;
        this.visibleRepertory = true;
        getAction(this.url.listChangePrice,{goodListid:id} ).then((res) => {
          if (res.success) {
            this.dataSource1 = res.result.listgoodSpecification;
            this.dataSource2 = res.result.listGoodList;
          }
        })
      },
      close () {
        this.$emit('close');
        this.visibleAudi = false;
        this.visibleRepertory = false;
      },
      handleOk () {
        const that = this;
        // 触发表单验证
        this.form.validateFields((err, values) => {
          if (!err) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
              method = 'put';
            }
            let formData = Object.assign(this.model, values);
            //时间格式化
            formData.delTime = formData.delTime?formData.delTime.format('YYYY-MM-DD HH:mm:ss'):null;

            console.log(formData)
            httpAction(httpurl,formData,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
              that.close();
            })



          }
        })
      },
      handleCancel () {
        this.close()
      },
//销售价
      inputFunPrice(e){
        this.inputPrice = e.target.value;
        if(this.dataSource1.length>1){
          if(parseInt(this.inputPrice)>0){
            var num=null;
            var a=[];
            for(var i=0;i<this.dataSource1.length;i++){
              a[i]=parseInt(this.dataSource1[i].price);
            }
            this.bSort(a);
            this.dataSource2[0].price= a[0]+"-"+a[this.dataSource1.length-1];
            this.dataSource2[0].marketPrice =(a[this.dataSource1.length-1]*1.1).toFixed(2)//市场价
          }
        }else{
          this.dataSource2[0].price=e.target.value;
          this.dataSource2[0].marketPrice =(e.target.value*1.1).toFixed(2)//市场价
        }
},
      //成本价
      inputFunCostPrice(e){
        this.inputCostPrice = e.target.value;
        if(this.dataSource1.length>1){
          //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
          if(parseInt(this.inputCostPrice)>0){
            var num=null;
            var a=[];
            for(var i=0;i<this.dataSource1.length;i++){
              a[i]=parseInt(this.dataSource1[i].costPrice);
            }
            this.bSort(a);
            this.dataSource2[0].costPrice= a[0]+"-"+a[this.dataSource1.length-1];
          }
        }else{
          this.dataSource2[0].costPrice=e.target.value;
        }
      },
      //供货价
      inputFunSupplyPrice(e){
        this.inputSupplyPrice = e.target.value;
        if(this.dataSource1.length>1){
          //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
          if(parseInt(this.inputSupplyPrice)>0){
            var num=null;
            var a=[];
            for(var i=0;i<this.dataSource1.length;i++){
              a[i]=parseInt(this.dataSource1[i].supplyPrice);
            }
            this.bSort(a);
            this.dataSource2[0].supplyPrice= a[0]+"-"+a[this.dataSource1.length-1];
          }
        }else{
          this.dataSource2[0].supplyPrice=e.target.value;
        }
      },
      //会员价
      inputFunVipPrice(e){
        this.inputVipPrice = e.target.value;
        if(this.dataSource1.length>1){
          //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
          if(parseInt(this.inputVipPrice)>0){
            var num=null;
            var a=[];
            for(var i=0;i<this.dataSource1.length;i++){
              a[i]=parseInt(this.dataSource1[i].vipPrice);
            }
            this.bSort(a);
            this.dataSource2[0].vipPrice= a[0]+"-"+a[this.dataSource1.length-1];
            console.log(this.dataSource2)
            console.log(this.dataSource1)
          }
        }else{
          this.dataSource2[0].vipPrice= e.target.value;
        }
      },
      //总库存
      inputFunRepertory(e){
        this.inputRepertory = e.target.value;
        if(this.dataSource1.length>1){
          //this.Goodlistprice=this.dataSource2[0].costPrice.split('-')
          if(parseInt(this.inputRepertory)>0){
            var repertory=0;
            for(var i=0;i<this.dataSource1.length;i++){
              repertory=parseInt(this.dataSource1[i].repertory)+repertory
            }
            this.dataSource2[0].repertory=repertory;
          }
        }else{
          this.dataSource2[0].repertory= e.target.value;
        }
      },
      //修改提交
      hideModal() {
        this.visibleAudi = false;
        this.visibleRepertory = false;
        //console.log("this.stopRemark=",this.stopRemark)
        var that = this;
        putAction(that.url.updatePrice, {listgoodSpecification: this.dataSource1,listGoodList:this.dataSource2}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {
            that.$message.error("修改失败");
          }
        });
      },
      getQueryField() {
      },
       bSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len-1; i++) {
      for (var j = 0; j < len - 1 - i; j++) {
        // 相邻元素两两对比，元素交换，大的元素交换到后面
        if (arr[j] > arr[j + 1]) {
          var temp = arr[j];
          arr[j] = arr[j+1];
          arr[j+1] = temp;
        }
      }
    }
    return arr;
  },
      //停用弹窗
      showModalStopStatus(id) {
        this.goodListId2=id;
        this.visibleStopStatus = true;
        this.statusExplain='';
      },
      //停用
      hideModalStopStatus() {
        this.visibleStopStatus = false;
        console.log("this.statusExplain=",this.statusExplain)
        var that = this;
        getAction(that.url.updateStatus, {id: this.goodListId2,statusExplain:this.statusExplain}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {
            that.$message.success("修改失败");
          }
        });
      },
      //下架弹窗
      showModalFrameStatus(id) {
        this.goodListId2=id;
        this.visibleFrameStatus = true;
        this.frameExplain='';
      },
      //下架弹出
      hideModalFrameStatus() {
        this.visibleFrameStatus = false;
        console.log("this.frameExplain=",this.frameExplain)
        var that = this;
        getAction(that.url.updateFrameStatus, {ids: this.goodListId2,frameStatus:'0',frameExplain:this.frameExplain}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {
            that.$message.success("修改失败");
          }
        });
      },
      //删除弹窗
      showModalDelete(id) {
        this.goodListId2=id;
        this.visibleDelete = true;
        this.delExplain='';
      },
      //删除弹出
      hideModalDelete() {
        this.visibleDelete = false;
        console.log("this.delExplain=",this.delExplain)
        var that = this;
        deleteAction(that.url.deleteAndDelExplain, {id: this.goodListId2,delExplain:this.delExplain}).then((res) => {
          if (res.code==200) {
            that.$message.success(res.message);
            that.$emit('ok');//发送父级主键刷新
          } else {
            that.$message.success("修改失败");
          }
        });
      },
    }
  }
</script>

<style lang="less" scoped>

</style>