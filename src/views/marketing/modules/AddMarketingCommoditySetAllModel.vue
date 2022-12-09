<template>
  <a-modal
    title="批量设置"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭">
    <div class="wrap">
      <div class="line">
        <div class="label">
          专区分类：
        </div>
        <div class="value">
<!--          @change="handleChange"-->
          <div v-if="prefectureType.length<=0">
            无分类
          </div>
          <div v-else>
            <a-cascader :options="prefectureType"
                        :loadData="prefectureTypeDataLoad"
                        changeOnSelect
                        v-model="allData.marketingPrefectureTypeId"
                        style="width: 200px"
                        placeholder="请选择专区分类" />
<!--            <a-select  style="width: 120px" v-model="allData.marketingPrefectureTypeId">-->
<!--              <a-select-option value="">请选择</a-select-option>-->
<!--              <a-select-option v-for="item in prefectureType" :value="item.id">{{item.typeName}}</a-select-option>-->
<!--            </a-select>-->
          </div>
        </div>
      </div>
      <div class="line">
        <div class="label">
          专区折扣：
        </div>
        <div class="value">
<!--          :min="limitData.prefecturePriceProportion"-->
          <a-input-number v-model="allData.districtDiscount" :min="-1" style="width: 100px"/>
          <div>
            %
          </div>
        </div>
      </div>
      <div class="line">
        <div class="label">
          福利金抵扣：
        </div>
        <div class="value" v-if="allData.isWelfare == 1">
          福利金全额抵扣
        </div>
        <div class="value" v-else-if="allData.isWelfare == 2">
          <div>
            可抵扣
          </div>
          <a-input-number v-model="allData.districtWelfare" style="width: 100px"/>
          <div>
            %
          </div>
        </div>
        <div class="value" v-else>
          不支持
        </div>
      </div>
      <div class="line">
        <div class="label">
          赠送福利金：
        </div>
        <div class="value" v-if="limitData.isGiveWelfare == 1">
          <div>
            可赠送
          </div>
          <a-input type="number" v-model="allData.sendWelfare">

          </a-input>
          <div>
            %
          </div>
        </div>
        <div class="value" v-else>
          不支持
        </div>
      </div>
      <div class="line" v-if="showLimit">
        <div class="label">
          购买限制：
        </div>
        <div class="value">
<!--          <a-input type="number" v-model="allData.buyProportionDay">-->

<!--          </a-input>-->
<!--          <div>-->
<!--            天-->
<!--          </div>-->
          <div>
            可购买
          </div>

          <a-input type="number" v-model="allData.buyProportionLetter">

          </a-input>
          <div>
            件
          </div>

        </div>
      </div>

    </div>


    </a-modal>
</template>

<script>
  import { getAction,postAction  } from '@/api/manage'
  export default {
    name: 'AddMarketingCommoditySetAllModel',
    props:{
      marketingPrefectureId:{
        type:String,
        default:''
      },
      limitData:{
        type:Object,
        default(){
          return {}
        }
      },

    },
    data(){
      return{
        visible:false,
        confirmLoading:false,
        url:{
          //获取对应专区分类
          getMarketingPrefectureType:"marketingPrefectureType/marketingPrefectureType/getMarketingPrefectureType",
          //获取专区二级分类
          findUnderlingListMap: 'marketingPrefectureType/marketingPrefectureType/findUnderlingListMap',
        },
        prefectureType:[],
        allData:{
          id:'',
          districtDiscount:'',//专区折扣
          districtWelfare:'',//福利金抵扣
          sendWelfare:'',//赠送福利金
          buyProportionDay:-1,//限制多少天
          buyProportionLetter:-1,//限制数量
          isWelfare:'0'
        },
      }
    },
    computed:{
      showLimit(){
        return this.$parent.$parent.allData.buyLimit == 1 ? false : true
      }
    },
    created(){
      this.allData.districtDiscount = this.limitData.prefecturePriceProportion
      this.allData.isWelfare =  this.limitData.isWelfare
      this.getMarketingPrefectureType();
    },
    methods:{
      prefectureTypeDataLoad(selectedOptions){
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        console.log(targetOption);
        getAction(this.url.findUnderlingListMap,{id:targetOption.value}).then((res)=>{
          targetOption.loading = false;
          if (res.success && res.result.length>0){
            let sz = []
            for(let item of res.result){
              sz.push( {
                label: item.type_name,
                value: item.id,
                // isLeaf: false
              })
            }
            targetOption.children = sz
          }
          this.prefectureType = [...this.prefectureType];
        });
      },
      handleOk(){
        let allData = {
          ...this.allData,
          prefectureType:this.prefectureType
        }
        this.$emit('handleOK',allData)
        this.handleCancel()
      },
      handleCancel(){
        this.visible = false
      },
      open(){
        this.visible = true
      },
      getMarketingPrefectureType(){
        let info = {
          marketingPrefectureId:this.marketingPrefectureId,
        }
        getAction(this.url.getMarketingPrefectureType,info).then(res=>{
          if(res.success){
            let sz = []
            for(let item of res.result){
              sz.push({
                label: item.typeName,
                value: item.id,
                isLeaf: false,
              })
            }
            this.prefectureType = sz
          }
        })
      },
    }
  }
</script>

<style lang="less">
  .wrap{
    width: 100%;
    .line{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      height: 50px;
      justify-content: flex-start;
      .label{
        margin-right: 30px;
        margin-left: 30px;

      }
      .value{
        display: flex;
        align-items: center;
        >div{
          width:50px ;
          text-align: center;
        }
        >input{
          width: 100px;
        }
      }
    }
  }

</style>