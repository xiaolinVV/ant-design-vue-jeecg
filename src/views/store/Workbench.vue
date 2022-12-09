<template>
  <div class="Workbench">
    <div class="line-wraps">
      <a-card :bordered="false" class="detail-wrap left-card">
        <img :src="AllData.logoAddr || '/img/WorkBalanceLogo.e89b0f4c.png'" style="height:104px;width:104px"/>
        <div class="right">
          <div class="floor">
            <div class="title">
              {{ AllData.storeName }}
            </div>
            <div class="edit blue">
              <a @click="handleEdit(record)">编辑</a>
            </div>
          </div>
          <div class="floor">
            <div class="cnt">
              <i data-v-ca8b52bc=""  title="exclamation-circle" class="anticon anticon-exclamation-circle"><svg data-v-ca8b52bc="" viewBox="64 64 896 896" data-icon="exclamation-circle" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path></svg></i>
<!--              <img src="../../assets/WorkBalanceLogo.png" alt="">-->
              <span>店铺状态</span>
              <span class="blue" @click=""> 启用</span>
            </div>
            <!--<div class="cnt">
              <img src="../../assets/WorkBalanceLogo.png" alt="">
              <span>进店会员数</span>
              <span class="blue"> 41,848人</span>
            </div>-->
            <div class="cnt">

            </div>
          </div>
          <div class="floor">
            <div class="cnt">
<!--              <img src="../../assets/WorkBalanceLogo.png" alt="">-->
              <i data-v-ca8b52bc="" title="safety-certificate" class="anticon anticon-safety-certificate"><svg data-v-ca8b52bc="" viewBox="64 64 896 896" data-icon="safety-certificate" width="1em" height="1em" fill="currentColor" aria-hidden="true" class=""><path d="M866.9 169.9L527.1 54.1C523 52.7 517.5 52 512 52s-11 .7-15.1 2.1L157.1 169.9c-8.3 2.8-15.1 12.4-15.1 21.2v482.4c0 8.8 5.7 20.4 12.6 25.9L499.3 968c3.5 2.7 8 4.1 12.6 4.1s9.2-1.4 12.6-4.1l344.7-268.6c6.9-5.4 12.6-17 12.6-25.9V191.1c.2-8.8-6.6-18.3-14.9-21.2zM810 654.3L512 886.5 214 654.3V226.7l298-101.6 298 101.6v427.6zm-405.8-201c-3-4.1-7.8-6.6-13-6.6H336c-6.5 0-10.3 7.4-6.5 12.7l126.4 174a16.1 16.1 0 0 0 26 0l212.6-292.7c3.8-5.3 0-12.7-6.5-12.7h-55.2c-5.1 0-10 2.5-13 6.6L468.9 542.4l-64.7-89.1z"></path></svg></i>
              <!--&lt;!&ndash;<span v-if="record.attestationStatus == -1">未认证</span>-->
              <span> 审核状态 </span>
              <a v-if="AllData.attestationStatus==-1" @click="handleform(record)">{{ AllData.attestationName }}</a>
              <a v-if="AllData.attestationStatus==0" @click="handleToAudit(record)">{{ AllData.attestationName }}</a>
              <a v-if="AllData.attestationStatus==1" @click="handleToAudit(record)">{{ AllData.attestationName }}</a>
              <a v-if="AllData.attestationStatus==2">{{ AllData.attestationName }}</a>
              <a v-if="AllData.attestationStatus==3" @click="handleToAudit(record)">{{ AllData.attestationName }}</a>
            </div>
<!--            <div class="cnt">-->
<!--              <img src="../../assets/WorkBalanceLogo.png" alt="">-->
<!--              <span>手机号码</span>-->
<!--              <span>{{ AllData.phoneStatus }}</span>-->
<!--              <span class="blue" @click=""> 修改绑定</span>-->
<!--            </div>-->
            <!--<div class="cnt">
              <img src="../../assets/WorkBalanceLogo.png" alt="">
              <span>邮箱</span>
              <span>{{ AllData.emailStatus }}</span>
              <span class="blue" @click=""> 绑定</span>
            </div>-->
          </div>
        </div>
      </a-card>
      <a-card :bordered="false" class="right-card">
        <div class="content">
          <div class="title">
            我的资金
          </div>
          <div class="operation">
            <a-button type="primary" @click="">
              提现
            </a-button>
            <a-button @click="">
              明细
            </a-button>
          </div>
          <div class="detail">
            <div class="cnt">
              <div class="price">
                <v-if></v-if>
                {{ AllData.accumulatedIncome }}
              </div>
              <div class="type">
                累计收入
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.balance}}
              </div>
              <div class="type">
                可提现
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.balanceYet }}
              </div>
              <div class="type">
                已提现
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <div class="line-wraps">
      <a-card :bordered="false" class="left-card">
        <div class="content">
          <div class="title">
            订单管理
          </div>
          <div class="detail">
            <div class="cnt">
              <div class="price">
                {{ AllData.orderWait }}
              </div>
              <div class="type">
                待付款
              </div>
            </div>
            <!--<div class="cnt">
              <div class="price">
                {{ AllData.orderWait }}
              </div>
              <div class="type">
                待成团
              </div>
            </div>-->
            <div class="cnt">
              <div class="price">
                {{ AllData.orderDeliver }}
              </div>
              <div class="type">
                待发货
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.orderReceive }}
              </div>
              <div class="type">
                待收货
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.orderAppraise }}
              </div>
              <div class="type">
                待评价
              </div>
            </div>
            <!--<div class="cnt">
              <div class="price">
                2
              </div>
              <div class="type">
                退款/售后
              </div>
            </div>-->
          </div>
        </div>
      </a-card>
      <a-card :bordered="false" class="right-card">
        <div class="content">
          <div class="title">
            福利金
          </div>
          <div class="operation">
            <a-button type="primary" @click="">
              买福利金
            </a-button>
            <a-button @click="handleWelfarePayRecord(record)">
              送福利金
            </a-button>
          </div>
          <div class="detail">
            <div class="cnt">
              <div class="price">
                {{ AllData.welfarePayments }}
              </div>
              <div class="type">
                福利金金额
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.welfarePaymentsPresented }}
              </div>
              <div class="type">
                已送出福利金
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

    <div class="line-wraps">
      <a-card :bordered="false" class="left-card">
        <div class="content">
          <div class="title">
            商品管理
          </div>
          <div class="detail">
            <div class="cnt">
              <div class="price">
                {{ AllData.storeGoodids }}
              </div>
              <div class="type">
                总商品
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.putaway }}
              </div>
              <div class="type">
                上架商品
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.soldOut }}
              </div>
              <div class="type">
                下架商品
              </div>
            </div>
            <div class="cnt">
              |
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.drafts }}
              </div>
              <div class="type">
                草稿箱
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.recycleBin }}
              </div>
              <div class="type">
                回收站
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <a-card :bordered="false" class="right-card">
        <div class="content">
          <div class="title">
            优惠券
          </div>
          <div class="operation">
            <a-button type="primary" @click="handleDiscount(record)">
              去发券
            </a-button>
            <a-button @click="handleDiscountCoupon(record)">
              明细
            </a-button>
          </div>
          <div class="detail">
            <div class="cnt">
              <div class="price">
                {{ AllData.discountGet }}
              </div>
              <div class="type">
                已被领
              </div>
            </div>
            <div class="cnt">
              <div class="price">
                {{ AllData.statusUse }}
              </div>
              <div class="type">
                已被使用
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>

   <!-- <div class="line-wraps form-data">
      <a-card :bordered="false" class="left-card">
        <div class="content">
          <div class="title">
            进店会员管理
          </div>
          <div class="operation">
            <div class="extra-item">
              <span>今日</span>
              <span>本周</span>
              <span>本月</span>
              <span>本年</span>
            </div>
            <a-range-picker @change="onChange" class="range-picker"/>
          </div>
          <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <a-tab-pane loading="true" tab="销售额" key="1">
              <a-row>
                <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar title="销售额排行" :dataSource="barData"/>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
      <a-card :bordered="false" class="right-card">
        <div class="content">
          <div class="title">
            秒杀销售额
          </div>
          <div class="operation">
            <div class="extra-item">
              <span>今日</span>
              <span>本周</span>
              <span>本月</span>
              <span>本年</span>
            </div>
            <a-range-picker @change="onChange" class="range-picker"/>
          </div>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo" :height="430"
                             style="width: 550px;padding: 0;margin-left: -30px;"></line-chart-multid>
        </div>
      </a-card>
    </div>

    <div class="line-wraps form-data">
      <a-card :bordered="false" class="left-card">
        <div class="content">
          <div class="title">
            商品销售额
          </div>
          <div class="operation">
            <div class="extra-item">
              <span>今日</span>
              <span>本周</span>
              <span>本月</span>
              <span>本年</span>
            </div>
            <a-range-picker @change="onChange" class="range-picker"/>
          </div>
          <a-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
            <a-tab-pane loading="true" tab="销售额" key="1">
              <a-row>
                <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                  <bar title="销售额排行" :dataSource="barData"/>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </div>
      </a-card>
      <a-card :bordered="false" class="right-card">
        <div class="content">
          <div class="title">
            拼团销售额
          </div>
          <div class="operation">
            <div class="extra-item">
              <span>今日</span>
              <span>本周</span>
              <span>本月</span>
              <span>本年</span>
            </div>
            <a-range-picker @change="onChange" class="range-picker"/>
          </div>
          <line-chart-multid :fields="visitFields" :dataSource="visitInfo" :height="430"
                             style="width: 550px;padding: 0;margin-left: -30px;"></line-chart-multid>
        </div>
      </a-card>
    </div>-->

  </div>
</template>
<script>
  import ACol from "ant-design-vue/es/grid/Col"
  import ATooltip from "ant-design-vue/es/tooltip/Tooltip"
  import Bar from '@/components/chart/Bar'
  import LineChartMultid from '@/components/chart/LineChartMultid'
  import {getAction, putAction, postAction} from '@/api/manage'
  import Vue from 'vue'
  // import MiniArea from '@/components/chart/MiniArea'
  // import MiniBar from '@/components/chart/MiniBar'
  // import MiniProgress from '@/components/chart/MiniProgress'
  // import RankList from '@/components/chart/RankList'

  import {getLoginfo, getVisitInfo} from '@/api/api'

  const barData = []
  for (let i = 0; i < 12; i += 1) {
    barData.push({
      x: `${i + 1}月`,
      y: Math.floor(Math.random() * 1000) + 200
    })
  }
  //图标框架  viser
  export default {
    name: 'Workbench',
    data() {
      return {
        AllData: {
        },
        url: {
          findWorkbenchVO: 'storeManage/storeManage/findWorkbenchVO',//工作台返显
          imgerver: window._CONFIG['domianURL'] + "/sys/common/view",
        },
        barData,
        visitFields: ['visit'],
        visitInfo: [
          {
            type: "一月",
            visit: 4,
          }, {
            type: "二月",
            visit: 20,
          }, {
            type: "三月",
            visit: 25,
          }, {
            type: "四月",
            visit: 18,
          }, {
            type: "五月",
            visit: 16,
          }, {
            type: "六月",
            visit: 10,
          }, {
            type: "7月",
            visit: 4,
          }, {
            type: "八月",
            visit: 8,
          }, {
            type: "九月",
            visit: 20,
          }, {
            type: "十月",
            visit: 16,
          }, {
            type: "十一月",
            visit: 25,
          }, {
            type: "十二月",
            visit: 20,
          },
        ],
      }
    },
    components: {
      ATooltip,
      ACol,
      // MiniArea,
      // MiniBar,
      // MiniProgress,
      // RankList,
      Bar,
      LineChartMultid,
    },
    created() {
      const token = Vue.ls.get('Access-Token');
      this.headers = {"X-Access-Token": token};
//       getAction(this.url.findWorkbenchVO).then(res => {
//          if(res){
//            res.logoAddr = this.url.imgerver + '/' + res.logoAddr
//            this.AllData = res
//          }
// //        this.$set(this.AllData.shopInfo, 'shopHeadUrl', this.url.imgerver + '/' + res.logoAddr)
// //        this.$set(this.AllData.shopInfo, 'storeName',res.storeName)
//       })
    },
    methods: {
      initLogInfo() {
        getVisitInfo().then(res => {
          if (res.success) {
            console.log("aaaaaa", res.result)
            this.visitInfo = res.result;
          }
        })
      },
      handleEdit(record){
        //路由跳转
        this.$router.push({path: '/store/StoreManageInforMation',})
      },
      handleform(record){
        //路由跳转 认证
        this.$router.push({path: '/store/modules/StoreManageFrom',params:{id:this.AllData.id}})
      },
    handleToAudit(record){
      //路由跳转 审核页面
      this.$router.push({path: '/store/modules/ToAudit',query:{AllData:this.AllData}})
    },
      handleWelfarePayRecord(record){
        //路由跳转 福利金赠送记录
        this.$router.push({path: '/marketing/MarketingWelfarePaymentsRecord',})
      },

      handleDiscount(record){
        //路由跳转 去发券
        this.$router.push({path: '/marketing/MarketingDiscountList',})
      },
      handleDiscountCoupon(record){
        //路由跳转 优惠券记录
        this.$router.push({path: '/marketing/MarketingDiscountCouponList',})
      },

    }
  }

</script>
<style lang="less" >

  .Workbench {
    width: 100%;
    i{
      font-size: 1rem;
      padding: 0.2rem;
      margin: 0.3rem;
      cursor: pointer;
    }
    .anticon{
      display: inline-block;
      font-style: normal;
      vertical-align: -0.125em;
      text-align: center;
      text-transform: none;
      line-height: 0;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
    }

    .detail-wrap {
      .ant-card-body{
        /*padding: 24px 10px!important;*/
        display: flex;
        justify-content: flex-start;

      }
      .right{
        margin-left: 32px;
      }
    }

    .line-wraps {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;

      .left-card {
        width: 65%;
        .ant-card-body {
          width: 100%;
        }
      }

      .right-card {
        width: 34%;

      }

      .head-portrait {
        width: 130px;
        height: 130px;
        border-radius: 50%;
        float: left;
      }

      .right {
        float: right;
        width: calc(100% - 160px);
        height: 130px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .blue {
          cursor: pointer;
          color: #2596FF;
        }

        .floor {
          display: flex;
          height: 25px;
          align-items: center;
          width: 100%;
          .edit{
            margin-left:10px;
          }

          .cnt {
            display: flex;
            justify-content: space-between;
            /*padding: 0 50px;*/
            min-width: 20%;
            margin: 0 3%;
            align-items: center;

            img {
              width: 25px;
              height: 25px;
            }
          }
          .cnt:nth-child(1){
            margin-left:0;
          }

          .title {
            font-weight: 700;
            text-align: left;
          }
        }
      }

      .content {
        position: relative;

        .title {
          font-weight: 700;
          font-size: 20px;
          margin-bottom: 30px;
          text-align: left;
        }

        .operation {
          position: absolute;
          right: 0;
          top: 0;

          button {
            margin-left: 20px;
          }

          .extra-item {
            display: inline-block;
            margin-right: 15px;

            span {
              margin-left: 15px;
            }

            span:hover {
              cursor: pointer;
              color: #2596FF;
            }
          }

          .range-picker {
            width: 220px !important;
          }
        }

        .price {
          color: #2596FF;
          font-weight: 700;
          font-size: 18px;
        }

        .detail {
          display: flex;
          justify-content: space-around;

          .cnt {
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            align-items: center;
            height: 70px;
            min-width: 70px;
          }

        }
      }

    }

  }

</style>