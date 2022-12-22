<template>
  <div v-if="flag" class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :md="12" :sm="24" :style="{ marginBottom: '24px' }" :xl="10">
        <a-card :bodyStyle="cardStyle" :bordered="false" :loading="cardLoading" class="all-info">
          <div class="left">
            <img :src="allData.logoAddr" alt="" preview="1" style="margin-bottom: 10px;background: white;"
                 v-if="allData.logoAddr">
            <a-avatar shape="square" :size="130" icon="user" style="margin-bottom: 10px;" v-else/>
            <!--            <img :src="allData.logoAddr" alt="">-->
            <div class="concants">
              <i class="anticon anticon-user" data-v-ca8b52bc="" title="user">
                <svg aria-hidden="true" class="" data-icon="user" data-v-ca8b52bc="" fill="currentColor" height="1em"
                     viewBox="64 64 896 896" width="1em">
                  <path
                    d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                </svg>
              </i>
              <span>
                  联系人：{{allData.realname || allData.bossName || allData.linkman || ''}}
              </span>

            </div>
          </div>
          <div class="right">
            <div class="title">
              <span>
                  {{allData.name || allData.storeName||''}}
              </span>
              <!--              <span class="edit" v-if="showEdit">-->
              <!--              编辑-->
              <!--            </span>-->
              <!--              v-else-->
              <span class="edit">

              </span>
            </div>
            <div class="single-line">
              <i class="anticon anticon-user" data-v-ca8b52bc="" title="user">
                <svg aria-hidden="true" class="" data-icon="user" data-v-ca8b52bc="" fill="currentColor" height="1em"
                     viewBox="64 64 896 896" width="1em">
                  <path
                    d="M858.5 763.6a374 374 0 0 0-80.6-119.5 375.63 375.63 0 0 0-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 0 0-80.6 119.5A371.7 371.7 0 0 0 136 901.8a8 8 0 0 0 8 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 0 0 8-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path>
                </svg>
              </i>
              <div>
                角色:
              </div>
              <div>
                {{allData.roleName || ''}}
              </div>
            </div>
            <div class="single-line" v-if="control.authStatus">
              <i data-v-ca8b52bc="" title="idcard" class="anticon anticon-idcard">
                <svg data-v-ca8b52bc="" viewBox="64 64 896 896" data-icon="idcard" width="1em" height="1em"
                     fill="currentColor" aria-hidden="true" class="">
                  <path
                    d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 632H136V232h752v560zM610.3 476h123.4c1.3 0 2.3-3.6 2.3-8v-48c0-4.4-1-8-2.3-8H610.3c-1.3 0-2.3 3.6-2.3 8v48c0 4.4 1 8 2.3 8zm4.8 144h185.7c3.9 0 7.1-3.6 7.1-8v-48c0-4.4-3.2-8-7.1-8H615.1c-3.9 0-7.1 3.6-7.1 8v48c0 4.4 3.2 8 7.1 8zM224 673h43.9c4.2 0 7.6-3.3 7.9-7.5 3.8-50.5 46-90.5 97.2-90.5s93.4 40 97.2 90.5c.3 4.2 3.7 7.5 7.9 7.5H522a8 8 0 0 0 8-8.4c-2.8-53.3-32-99.7-74.6-126.1a111.8 111.8 0 0 0 29.1-75.5c0-61.9-49.9-112-111.4-112s-111.4 50.1-111.4 112c0 29.1 11 55.5 29.1 75.5a158.09 158.09 0 0 0-74.6 126.1c-.4 4.6 3.2 8.4 7.8 8.4zm149-262c28.5 0 51.7 23.3 51.7 52s-23.2 52-51.7 52-51.7-23.3-51.7-52 23.2-52 51.7-52z"></path>
                </svg>
              </i>
              <div>
                认证状态：
              </div>
              <div @click="handleform" style="cursor: pointer" v-if="attestationStatus == -1">
                {{allData.attestationStatus || '- -'}}
              </div>
              <div @click="authStatusRouter" style="cursor: pointer" v-if="attestationStatus!=-1">
                {{allData.attestationStatus || '- -'}}
              </div>
            </div>
            <div class="single-line" v-if='control.opening'>
              <i data-v-ca8b52bc="" title="file-done" class="anticon anticon-file-done">
                <svg data-v-ca8b52bc="" viewBox="64 64 896 896" data-icon="file-done" width="1em" height="1em"
                     fill="currentColor" aria-hidden="true" class="">
                  <path
                    d="M688 312v-48c0-4.4-3.6-8-8-8H296c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8zm-392 88c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H296zm376 116c-119.3 0-216 96.7-216 216s96.7 216 216 216 216-96.7 216-216-96.7-216-216-216zm107.5 323.5C750.8 868.2 712.6 884 672 884s-78.8-15.8-107.5-44.5C535.8 810.8 520 772.6 520 732s15.8-78.8 44.5-107.5C593.2 595.8 631.4 580 672 580s78.8 15.8 107.5 44.5C808.2 653.2 824 691.4 824 732s-15.8 78.8-44.5 107.5zM761 656h-44.3c-2.6 0-5 1.2-6.5 3.3l-63.5 87.8-23.1-31.9a7.92 7.92 0 0 0-6.5-3.3H573c-6.5 0-10.3 7.4-6.5 12.7l73.8 102.1c3.2 4.4 9.7 4.4 12.9 0l114.2-158c3.9-5.3.1-12.7-6.4-12.7zM440 852H208V148h560v344c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V108c0-17.7-14.3-32-32-32H168c-17.7 0-32 14.3-32 32v784c0 17.7 14.3 32 32 32h272c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8z"></path>
                </svg>
              </i>
              <div>
                开通:
              </div>
              <div>
                {{allData.openUp || '- - '}}
              </div>
            </div>
            <div class="single-line">
              <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="exclamation-circle">
                <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc="" fill="currentColor"
                     height="1em" viewBox="64 64 896 896" width="1em">
                  <path
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                  <path
                    d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                </svg>
              </i>
              <div>
                状态:
              </div>
              <div>
                {{allData.statusName || ''}}
              </div>
            </div>
          </div>

        </a-card>

      </a-col>
      <a-col :md="12" :sm="24" :style="{ marginBottom: '24px' }" :xl="14">
        <a-card :body-style="{height:'230px'}" :bordered="false" :loading="cardLoading" class=" line-wraps">
          <div class="content">
            <div class="title">
              经营概况
            </div>
            <div class="detail">
              <div class="cnt">
                <div class="price">
                  {{allData.orderSum || ''}}单
                </div>
                <div class="type">
                  有效订单
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="订单实收款（交易完成）">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>

              </div>
              <div class="cnt">
                <div class="price">
                  {{allData.earnings || 0}} 元
                </div>
                <div class="type">
                  累计收益
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="订单实收款（交易完成），开店收款，礼包收款，现金兑换收款">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div class="cnt" v-if="control.cumulativeMember">
                <div class="price">
                  {{allData.memberSum || ''}}人
                </div>
                <div class="type">
                  累计会员
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="平台总会员">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div class="cnt" v-if="control.storeCount">
                <div class="price">
                  {{allData.storeSum || ''}}家
                </div>
                <div class="type">
                  店铺
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="平台所有店铺">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div class="cnt" v-if="control.benifitPay">
                <div class="price">
                  {{allData.welfareSum || 0 }} 福利金
                </div>
                <div class="type">
                  已送福利金
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc=""
                     title="平台送给店铺，平台送给会员，店铺送给会员，礼包赠送，开店赠送">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div class="cnt" v-if="control.supplier">
                <div class="price">
                  {{allData.providerSum || 0}}
                </div>
                <div class="type">
                  供应商
                  <i class="anticon anticon-exclamation-circle" data-v-ca8b52bc="" title="供应商数">
                    <svg aria-hidden="true" class="" data-icon="exclamation-circle" data-v-ca8b52bc=""
                         fill="currentColor" height="1em" viewBox="64 64 896 896" width="1em">
                      <path
                        d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path>
                      <path
                        d="M464 688a48 48 0 1 0 96 0 48 48 0 1 0-96 0zm24-112h48c4.4 0 8-3.6 8-8V296c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8z"></path>
                    </svg>
                  </i>
                </div>
              </div>
            </div>
          </div>
        </a-card>

      </a-col>
      <a-col :md="12" :sm="24" :style="{ marginBottom: '24px' }" :xl="24">
        <a-card :bordered="false" :loading="cardLoading" class=" line-wraps">
          <div class="content">
            <div class="title">
              重要提醒
            </div>
            <div class="detail">
              <div class="cnt">
                <div class="price">
                  {{allData.waitDeliverGoods || ''}} 单
                </div>
                <div class="type fontWeight">
                  待发货订单
                </div>
              </div>
              <div class="cnt">
                <div class="price">
                  - -
                </div>
                <div class="type fontWeight">
                  待处理退款
                </div>
              </div>
              <span v-if="control.isSellShopping">
                |
              </span>
              <div class="cnt" v-if="control.isSellShopping">
                <div class="price">
                  {{allData.forGoods || ''}}件
                </div>
                <div class="type fontWeight">
                  在售商品
                </div>
              </div>
              <div class="cnt" v-if="control.soldOut">
                <div class="price">
                  <!--                  件-->
                  - -
                </div>
                <div class="type fontWeight">
                  已售罄商品
                </div>
              </div>
              <span v-if="control.couponsReceived">
                |
              </span>

              <div class="cnt" v-if="control.couponsReceived">
                <div class="price">
                  {{allData.byGetDiscount || ''}} 张
                </div>
                <div class="type">
                  已被领优惠券
                </div>
              </div>
              <div class="cnt" v-if="control.usedCoupon">
                <div class="price" v-if="">
                  {{allData.byUseDiscount || ''}} 张
                </div>
                <div class="type">
                  已被使用优惠券
                </div>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24" :style="{ marginBottom: '24px' }" :xl="24">
        <a-card :bordered="false" :loading="cardLoading" class="all-proceeds">
          <div class="card-top">
            <div class="title">
              <div class="top">
                累计收益
              </div>
              <div class="bottom">
                {{allData.earningsPatch}}
              </div>
            </div>
            <div>
              <span>
                时间：
              </span>
              <a-range-picker :style="{width: '256px'}"
                              format="YYYY-MM-DD"
                              @change="earningTimeChange"
              />
            </div>
          </div>
          <!--          title="累计收益"-->
          <bar v-if="barData.length > 0" :dataSource="barData"/>
        </a-card>
      </a-col>
      <a-col :md="12" :sm="24" :style="{ marginBottom: '24px' }" :xl="24" v-if="vipNumber.length > 0 || sex.length > 0">
        <a-card :bordered="false" :loading="cardLoading" class="all-proceeds">
          <div class="card-top">
            <div class="title">
              <div class="top">
                会员数
              </div>
              <div class="bottom">
                {{allData.memberPatch}}
              </div>
            </div>
            <div>
              <span>
                时间：
              </span>
              <a-range-picker :style="{width: '256px'}"
                              format="YYYY-MM-DD"
                              @change="memberTimChange"/>
            </div>
          </div>
          <pie v-if="vipNumber.length > 0" :dataSource="vipNumber" :height="350" style="float: left;width: 50%;"/>
          <pie v-if="sex.length > 0" :dataSource="sex" :height="350" style="float: right;width: 50%;"/>

        </a-card>
      </a-col>
    </a-row>


  </div>
  <div style="text-align: center" v-else>
    <h3 style="font-size: 25px;margin-top: 100px">欢迎登入{{name}}</h3>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Bar from '@/components/chart/Bar'
  import Pie from '@/components/chart/Pie'
  import { getAction } from '@/api/manage'
  import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
  import { getLoginfo, getVisitInfo } from '@/api/api'
  import { ACCESS_TOKEN } from '@/store/mutation-types'

  export default {
    name: 'Analysis',
    components: {
      Bar,
      Pie
    },
    data() {
      return {
        name: '',//系统名称
        flag: true,
        loginfo: {},
        visitInfo: [],
        cardStyle: {
          background: '#0099FF',
          color: 'white',
          fontSize: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          height: '230px'
        },
        //加载动画
        cardLoading: false,
        barData: [],
        vipNumber: [],
        sex: [],
        url: {
          findAll: '/sys/user/findAll',
          imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
          queryByUser: '/sys/permission/queryByUser',
          findSysBackSetting: '/sysBackSetting/sysBackSetting/findSysBackSetting'//后台设置返显
        },
        allData: '',
        //所有控制状态
        //控制：无已认证店铺 无供应商 无认证状态 无开通 无累计会员 无已送福利金 已被领取优惠券 已被使用优惠券 无在售商品  无已售罄商品 认证店铺数量
        //      certifiedStores supplier authStatus  opening cumulativeMember benifitPay couponsReceived usedCoupon isSellShopping soldOut storeCount
        control: {
          certifiedStores: true,
          supplier: true,
          authStatus: true,
          opening: true,
          cumulativeMember: true,
          benifitPay: true,
          couponsReceived: true,
          usedCoupon: true,
          isSellShopping: true,
          soldOut: true,
          storeCount: true
        },
        //是否显示编辑
        showEdit: true,
        //开始时间  结束时间
        allTime: {
          earningTime_begin: '',
          earningTime_end: '',
          memberTime_begin: '',
          memberTime_end: ''
        },
        attestationStatus:""
      }
    },
    created() {
      // this.getMenu()
      this.cardLoading = true
      this.initLogInfo()
      this.loadData()
      this.getSysName()
    },
    methods: {
      getMenu() {
        let v_token = Vue.ls.get(ACCESS_TOKEN)
        let params = { token: v_token }
        getAction(this.url.queryByUser, params).then(response => {
          if (response.success) {
            let menu = response.result
            try {
              menu.forEach(item => {
                if (item.meta.title == '首页') {
                  this.flag = true
                  throw 'Jump out now'
                } else {
                  this.flag = false
                }
              })
            } catch (e) {
              console.log(e)
            }
            console.log('状态' + this.flag)
          } else {
            this.$message.error(response.message)
          }
        })
      },

      getSysName() {
        getAction(this.url.findSysBackSetting).then((res) => {
          if (res.success) {
            this.name = res.result.name
          }
        })
      },

      earningTimeChange(value, dataString) {
        this.allTime.earningTime_begin = dataString[0] || ''
        this.allTime.earningTime_end = dataString[1] || ''
        if (this.allTime.earningTime_begin && this.allTime.earningTime_end) {
          this.loadData()
        }
      },
      memberTimChange(value, dataString) {
        this.allTime.memberTime_begin = dataString[0] || ''
        this.allTime.memberTime_end = dataString[1] || ''
        if (this.allTime.memberTime_begin && this.allTime.memberTime_end) {
          this.loadData()
        }
      },
      loadData() {
        this.barData = []
        this.vipNumber = []
        this.sex = []
        getAction(this.url.findAll, this.allTime).then(res => {
          if (res.admin) {
            //平台工作台
            //控制：无认证状态 无开通
            this.showEdit = false
            this.control.authStatus = false
            this.control.opening = false
            if (res.admin.avatar) {
              res.admin.logoAddr = this.url.imgerver + '/' + res.admin.avatar
            } else {
              res.admin.logoAddr = ''
            }
            this.allData = res.admin
            if (res.admin.earningsList) {
              this.barData = res.admin.earningsList
            }
            if (res.admin.memberList) {
              for (let item of res.admin.memberList) {
                item.count = item.count * 1
              }
              this.vipNumber = res.admin.memberList
            }
            if (res.admin.memberSexList) {
              for (let item of res.admin.memberSexList) {
                item.count = item.count * 1
              }
              this.sex = res.admin.memberSexList
            }
          }
          if (res.Merchant) {
            //店铺工作台
            //控制：无已认证店铺 无供应商
            this.control.certifiedStores = false
            this.control.supplier = false
            this.control.storeCount = false
            this.attestationStatus = res.Merchant.attestationStatus
            initDictOptions('store_attestation_status').then((res2) => {
              if (res2.success) {
                for (let item of res2.result) {
                  if (item.value == res.Merchant.attestationStatus) {
                    res.Merchant.attestationStatus = item.text
                  }
                }
                // this.specialPriceRatio = parseInt(res.result[0].value.replace(/%/g, ""));
                // console.log("this.specialPriceRatio字典", this.specialPriceRatio)
              }
            })
            if (res.Merchant.logoAddr) {
              res.Merchant.logoAddr = this.url.imgerver + '/' + res.Merchant.logoAddr
            } else {
              res.Merchant.logoAddr = ''
            }
            this.allData = res.Merchant
            if (res.Merchant.earningsList) {
              this.barData = res.Merchant.earningsList
            }
            if (res.Merchant.memberList) {
              for (let item of res.Merchant.memberList) {
                item.count = item.count * 1
              }
              this.vipNumber = res.Merchant.memberList
            }
            if (res.Merchant.memberSexList) {
              for (let item of res.Merchant.memberSexList) {
                item.count = item.count * 1
              }
              this.sex = res.Merchant.memberSexList
            }
          }
          if (res.Supplier) {
            //供应商工作台
            //控制 : 无已认证店铺 无供应商 无认证状态 无开通 无累计会员 无已送福利金 已被领取优惠券 已被使用优惠券
            this.control.certifiedStores = false
            this.control.supplier = false
            this.control.authStatus = false
            this.control.opening = false
            this.control.cumulativeMember = false
            this.control.benifitPay = false
            this.control.couponsReceived = false
            this.control.usedCoupon = false
            this.control.storeCount = false
            if (res.Supplier.avatar) {
              res.Supplier.logoAddr = this.url.imgerver + '/' + res.Supplier.avatar
            } else {
              res.Supplier.logoAddr = ''
            }
            this.allData = res.Supplier
            if (res.Supplier.earningsList) {
              this.barData = res.Supplier.earningsList
            }
            if (res.Supplier.memberList) {
              for (let item of res.Supplier.memberList) {
                item.count = item.count * 1
              }
              this.vipNumber = res.Supplier.memberList
            }
            if (res.Supplier.memberSexList) {
              for (let item of res.Supplier.memberSexList) {
                item.count = item.count * 1
              }
              this.sex = res.Supplier.memberSexList
            }
          }
          if (res.agency) {
            //代理工作台
            //控制 : 无已认证店铺 无供应商 无认证状态 无开通  无已送福利金 已被领取优惠券 已被使用优惠券 无在售商品  无已售罄商品
            this.control.certifiedStores = false
            this.control.supplier = false
            this.control.authStatus = false
            this.control.opening = false
            this.control.benifitPay = false
            this.control.couponsReceived = false
            this.control.usedCoupon = false
            this.control.isSellShopping = false
            this.control.soldOut = false
            if (res.agency.avatar) {
              res.agency.logoAddr = this.url.imgerver + '/' + res.agency.avatar
            } else {
              res.agency.logoAddr = ''
            }
            this.allData = res.agency
            if (res.agency.earningsList) {
              this.barData = res.agency.earningsList
            }
            if (res.agency.memberList) {
              for (let item of res.agency.memberList) {
                item.count = item.count * 1
              }
              this.vipNumber = res.agency.memberList
            }
            if (res.agency.memberSexList) {
              for (let item of res.agency.memberSexList) {
                item.count = item.count * 1
              }
              this.sex = res.agency.memberSexList
            }
          }
          if (res.Franchisee) {
            //加盟商工作台
            //控制：无认证状态 无开通 无供应商 无已送福利金  已被领取优惠券 已被使用优惠券 无在售商品  无已售罄商品
            this.showEdit = true
            this.control.authStatus = false
            this.control.opening = false
            this.control.supplier = false
            this.control.benifitPay = false
            this.control.couponsReceived = false
            this.control.usedCoupon = false
            this.control.isSellShopping = false
            this.control.soldOut = false
            if (res.Franchisee.avatar) {
              res.Franchisee.logoAddr = this.url.imgerver + '/' + res.Franchisee.avatar
            } else {
              res.Franchisee.logoAddr = ''
            }
            this.allData = res.Franchisee
            if (res.Franchisee.earningsList) {
              this.barData = res.Franchisee.earningsList
            }
            if (res.Franchisee.memberList) {
              for (let item of res.Franchisee.memberList) {
                item.count = item.count * 1
              }
              this.vipNumber = res.Franchisee.memberList
            }
            if (res.Franchisee.memberSexList) {
              for (let item of res.Franchisee.memberSexList) {
                item.count = item.count * 1
              }
              this.sex = res.Franchisee.memberSexList
            }
          }
          this.cardLoading = false
        })
      },
      initLogInfo() {
        getLoginfo(null).then((res) => {
          if (res.success) {
            Object.keys(res.result).forEach(key => {
              res.result[key] = res.result[key] + ''
            })
            this.loginfo = res.result
          }
        })
        getVisitInfo().then(res => {
          if (res.success) {
            console.log('aaaaaa', res.result)
            this.visitInfo = res.result
          }
        })
      },
      //店铺认证状态跳转
      authStatusRouter() {
        this.$router.push({ path: '/store/modules/ToAudit', query: { AllData: this.allData } })
      },
      handleform() {
        //路由跳转 认证
        this.$router.push({ path: '/store/modules/StoreManageFrom' })
      }

    }
  }
</script>

<style lang="scss">
  .page-header-index-wide {
    .title {
      border: none !important;
    }
    .all-proceeds {
      .card-top {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;

        .title {
          width: 200px;
          display: flex;
          justify-content: space-between;
          /*align-items: center;*/
          text-align: left;
          flex-direction: column;

          .top {
            font-weight: 700;
            font-size: 20px;
            min-width: 35%;
            text-align: left;
          }

          .bottom {
            color: #2596FF;
            font-weight: 700;
            font-size: 20px;
            /*min-width: 20%;*/
            text-align: left;
            margin-left: 16%;
          }
        }
      }

      /*.all-pie{*/
      /*  display: flex;*/
      /*  justify-content: space-around;*/
      /*  width: 100%;*/
      /*  height: 200px;*/
      /*  align-items: center;*/
      /*}*/

    }

    .line-wraps {
      width: 100%;
      /*height: 100%;*/
      /*display: flex;*/
      /*justify-content: space-between;*/
      /*margin-bottom: 15px;*/

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

          .edit {
            margin-left: 10px;
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

          .cnt:nth-child(1) {
            margin-left: 0;
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
          .fontWeight {
            font-weight: 700;
          }

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

    .all-info {
      .left, .right {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
      }

      .edit {
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
      }

      .left {
        text-align: center;
        .concants {
          text-align: center;
        }
        img {
          -webkit-border-radius: 10px;
          -moz-border-radius: 10px;
          border-radius: 10px;
          width: 130px;
          height: 130px;
          margin-bottom: 10px;

        }

      }

      .right {
        width: 70%;
        .title {
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          > span:nth-child(1) {
            width: 300px;
            display: inline-block;
            overflow: hidden;
            height: 30px;
            line-height: 30px;
            color: white !important;
          }
          /*font-size: 18px;*/
        }
        .single-line {
          display: flex;
          /*justify-content: space-between;*/
          align-items: center;
          > div:nth-child(2) {
            width: 25%;
            text-align: left;
          }
          > i {
            margin-right: 10px;
          }
        }

      }
    }
  }

  .circle-cust {
    position: relative;
    top: 28px;
    left: -100%;
  }

  .extra-wrapper {
    line-height: 55px;
    padding-right: 24px;

    .extra-item {
      display: inline-block;
      margin-right: 24px;

      a {
        margin-left: 24px;
      }
    }
  }

  /* 首页访问量统计 */
  .head-info {
    position: relative;
    text-align: left;
    padding: 0 32px 0 0;
    min-width: 125px;

    &.center {
      text-align: center;
      padding: 0 32px;
    }

    span {
      color: rgba(0, 0, 0, .45);
      display: inline-block;
      font-size: .95rem;
      line-height: 42px;
      margin-bottom: 4px;
    }

    p {
      line-height: 42px;
      margin: 0;

      a {
        font-weight: 600;
        font-size: 1rem;
      }
    }
  }
</style>