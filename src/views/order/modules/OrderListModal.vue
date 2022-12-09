<template>
  <a-card :bordered="false">
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建年">
            <a-input-number v-decorator="['year', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建月">
            <a-input-number v-decorator="['month', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="创建日">
            <a-input-number v-decorator="['day', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="删除状态（0，正常，1已删除）">
            <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="会员列表id">
            <a-input placeholder="请输入会员列表id" v-decorator="['memberListId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单号">
            <a-input placeholder="请输入订单号" v-decorator="['orderNo', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单类型；数据字段获取">
            <a-input placeholder="请输入订单类型；数据字段获取" v-decorator="['orderType', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货人">
            <a-input placeholder="请输入收货人" v-decorator="['consignee', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系电话">
            <a-input placeholder="请输入联系电话" v-decorator="['contactNumber', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收货地址">
            <a-input placeholder="请输入收货地址" v-decorator="['shippingAddress', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="门牌号">
            <a-input placeholder="请输入门牌号" v-decorator="['houseNumber', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="留言">
            <a-input placeholder="请输入留言" v-decorator="['message', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品总价">
            <a-input-number v-decorator="['goodsTotal', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优惠金额">
            <a-input-number v-decorator="['coupon', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配送金额">
            <a-input-number v-decorator="['shipFee', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="优惠券id">
            <a-input placeholder="请输入优惠券id" v-decorator="['marketingDiscountCouponId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应付款（支付前标准金额）">
            <a-input-number v-decorator="['customaryDues', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实付款（支付后标准金额）">
            <a-input-number v-decorator="['actualPayment', {}]" />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="有无修改地址（0：无修改地址；1：有修改地址）"
          >
            <a-input
              placeholder="请输入有无修改地址（0：无修改地址；1：有修改地址）"
              v-decorator="['isUpdateAddr', {}]"
            />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="订单状态；0：待付款；1：待发货（已付款、部分发货）；2：待收货（已发货）；3：交易成功；4：交易失败"
          >
            <a-input
              placeholder="请输入订单状态；0：待付款；1：待发货（已付款、部分发货）；2：待收货（已发货）；3：交易成功；4：交易失败"
              v-decorator="['status', {}]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="付款时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['payTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="首次发货时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['shipmentsTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="确认收货时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['deliveryTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="子订单数量">
            <a-input-number v-decorator="['childOrder', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关闭类型;查看数据字典">
            <a-input placeholder="请输入关闭类型;查看数据字典" v-decorator="['closeType', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关闭原因">
            <a-input placeholder="请输入关闭原因" v-decorator="['closeExplain', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="关闭时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['closeTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="推广人">
            <a-input placeholder="请输入推广人" v-decorator="['promoter', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="归属店铺">
            <a-input placeholder="请输入归属店铺" v-decorator="['affiliationStore', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="销售渠道">
            <a-input placeholder="请输入销售渠道" v-decorator="['distributionChannel', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配送方式；对应数据字典">
            <a-input placeholder="请输入配送方式；对应数据字典" v-decorator="['distribution', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否部分发货；0：否；1：是">
            <a-input placeholder="请输入是否部分发货；0：否；1：是" v-decorator="['isSender', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="订单完成时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['completionTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物流星级">
            <a-input-number v-decorator="['logisticsStar', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="发货星级">
            <a-input-number v-decorator="['shippingStar', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="服务星级">
            <a-input-number v-decorator="['serviceStar', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="评价时间">
            <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" v-decorator="['evaluateTime', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否评价；0：未评价；1：已评价">
            <a-input placeholder="请输入是否评价；0：未评价；1：已评价" v-decorator="['isEvaluate', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="成本价（供货价）">
            <a-input-number v-decorator="['costPrice', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品利润（销售价减去成本价）">
            <a-input-number v-decorator="['profit', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分销佣金">
            <a-input-number v-decorator="['distributionCommission', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="净利润">
            <a-input-number v-decorator="['retainedProfits', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="平台净利润（供货价减去平台成本价）">
            <a-input-number v-decorator="['platformRetainedProfits', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="平台成本价">
            <a-input-number v-decorator="['platformProfit', {}]" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <!--会员信息弹出-->
    <a-modal
      title="会员信息"
      :footer="null"
      v-model="visiblEmemberInformation"
      @ok="hideModalEmemberInformation()"
      :width="1000"
      okText="确认"
      cancelText="取消"
    >
      <div v-if="memberList">
        <div class="CouponTextA">
          <div class="CouponText">买家账号</div>
          <div class="CouponText2">{{ memberList.phone }}</div>
          <div class="CouponText">买家昵称</div>
          <div class="CouponText2">{{ memberList.nickName }}</div>
        </div>
        <div class="CouponTextA">
          <div class="CouponText">会员类型</div>
          <div class="CouponText2">{{ memberList.memberType }}</div>
          <div class="CouponText">会员等级</div>
          <div class="CouponText2"></div>
        </div>
        <div class="CouponTextA">
          <div class="CouponText">收货人</div>
          <div class="CouponText2">{{ consignee }}</div>
          <div class="CouponText">联系电话</div>
          <div class="CouponText2">{{ contactNumber }}</div>
        </div>
        <div class="CouponTextA">
          <div class="CouponText" style="width:18.1%">收货地址</div>
          <div class="CouponText2" style="flex:1">{{ shippingAddress }}</div>
        </div>
      </div>
    </a-modal>

    <!--留言信息弹出-->
    <a-modal
      title="留言信息"
      v-model="visiblMessageInformation"
      :footer="null"
      @ok="hideModalMessageInformation()"
      :width="800"
      okText="确认"
      cancelText="取消"
    >
      <div style="border: 1px solid gainsboro;height: 250px;border-radius: 10px;padding: 30px;margin-bottom: 30px">
        留言内容：{{ Message }}
      </div>
    </a-modal>
    <!--优惠券弹出-->
    <!--<a-modal title="优惠券"
             :footer="null"
             v-model="visiblCouponInformation"
             @ok="hideCouponEmemberInformation()"
             :width="800"
             okText="确认"
             cancelText="取消">
       <div v-if="marketingDiscountCoupon">
         <div class="CouponTextA"  >
           <div class="CouponText" >优惠券id</div>
           <div class="CouponText2" >{{ marketingDiscountCoupon.id }}</div>
         </div>
         <div class="CouponTextA"  >
           <div class="CouponText" >优惠金额</div>
           <div class="CouponText2" >{{ marketingDiscountCoupon.price }}</div>
         </div>
         <div class="CouponTextA"  >
           <div class="CouponText" >优惠券名称</div>
           <div class="CouponText2" >{{ marketingDiscountCoupon.name }}</div>
         </div>
         <div class="CouponTextA"  >
           <div class="CouponText" >优惠券规则</div>
           <div class="CouponText2" >{{ marketingDiscountCoupon.regulation }}</div>
         </div>
         <div class="CouponTextA"  >
           <div class="CouponText" >优惠券发行人</div>
           <div class="CouponText2" v-if="marketingDiscountCoupon.publisher == 0 " >平台</div>
           <div class="CouponText2" v-if="marketingDiscountCoupon.publisher == 1 " >店铺</div>
         </div>
         <div class="CouponTextA" style="margin-bottom: 20px" >
           <div class="CouponText" >优惠券有效期</div>
           <div class="CouponText2" >{{ marketingDiscountCoupon.startTime }} 至 {{ marketingDiscountCoupon.endTime }}</div>
         </div>
       </div>


    </a-modal>-->
    <!--商品信息弹出-->
    <a-modal
      title="商品信息"
      :footer="null"
      :width="1000"
      v-model="visiblGoodsInformation"
      @ok="hideModalGoodsInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div v-for="item in formList" style="margin-bottom: 20px">
        <div class="suppliers">
          <div>
            <span>供应商</span>
            <span class="suppliers-content">{{ item.sysUserName }}</span>
          </div>
          <div>
            <span>供应商订单编号</span>
            <span class="suppliers-content">{{ item.orderNo }}</span>
          </div>
        </div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns"
          :pagination="false"
          :dataSource="item.orderProviderGoodRecordDTOList"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->
          <template slot="mainPicture" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <a-avatar
                shape="square"
                v-if="record.mainPicture != undefined"
                :src="getAvatarView(JSON.parse(record.mainPicture)[0])"
                icon="user"
              />
              <a-avatar
                shape="square"
                v-if="record.mainPicture == undefined || record.mainPicture == ''"
                :src="getAvatarView(record.mainPicture)"
                icon="user"
              />
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>

    <!--配送方式信息弹出-->
    <a-modal
      title="配送信息"
      :footer="null"
      :width="1000"
      v-model="visiblDistributionInformation"
      @ok="hideModalDistributionInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <a-table
          ref="table"
          size="middle"
          bordered
          rowKey="id"
          :columns="columns1"
          :dataSource="providerTemplateMaps"
          :pagination="false"
        >
          <!-- :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"-->

          <!--<template slot="accountingRules" slot-scope="text, record, index">
            <div class="single-line" >
              <div class="title">
                买家付邮费区域
              </div>
              <div class="right">

                <div v-for="(item,index) in JSON.parse(accountingRules)" v-if="item.isDelivery != 2">
                  <p>
                    {{item.city}}{{item.count}}{{listsysArea.chargeMode==1?'kg':'件'}}内{{item.price}}元，每增加{{item.everyIncreaseCount}}{{listsysArea.chargeMode==1?'kg':'件'}}加{{item.everyIncreasePrice}}元<span
                    v-if="item.isConditionalPostage">，&nbsp;&nbsp;&nbsp;指定条件包邮：满{{item.satisfyPriceNumber}}{{item.unit == 0?'件':'元'}}包邮</span>
                  </p>
                </div>
              </div>
            </div>
          </template>
-->
          <template slot="chargeMode" slot-scope="text, record, index">
            <div class="anty-img-wrap">
              <span shape="square" v-if="record.chargeMode == 0">按件数计费</span>
              <span shape="square" v-else-if="record.chargeMode == 1">按重量计费</span>
              <span shape="square" v-else>{{ record.chargeMode }}</span>
            </div>
          </template>
        </a-table>
      </div>
    </a-modal>
    <!--取消弹出-->
    <a-modal
      title="取消订单"
      :width="700"
      v-model="visiblCancelInformation"
      @ok="hideModalCancelInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <div class="Cancel">
          请您在与买家达成一致的前提下，使用关闭交易这个功能哦！
        </div>
        <div style="margin-top: 60px;margin-bottom: 60px">
          关闭订单的理由：
          <j-dict-select-tag
            v-model="closeExplain"
            style="width: 200px;"
            placeholder="请选择"
            dictCode="oder_close_explain"
          />
        </div>
      </div>
    </a-modal>
    <!--修改地址弹出-->
    <a-modal
      title="修改买家收货地址"
      :width="700"
      v-model="visiblAddressInformation"
      @ok="hideModalAddressInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <div class="Address">
          当前订单的收货信息：{{ consignee }}&nbsp;&nbsp;&nbsp;{{ contactNumber }}&nbsp;&nbsp;&nbsp;{{
            shippingAddress
          }}
        </div>
        <div style="margin-top: 60px;margin-bottom: 60px">
          <a-radio-group @change="onChange" v-model="areaAddressId">
            <a-radio :style="radioStyle" v-for="item of listMemberShippingAddress" :value="item.id"
              >{{ item.linkman }}&nbsp;&nbsp;&nbsp; {{ item.phone }} &nbsp;&nbsp;&nbsp; {{ item.areaAddress }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </a-modal>
    <!--审核弹窗-->
    <a-modal
      :width="700"
      :height="900"
      title="审批"
      v-model="visibleAudi"
      @ok="hideAudiModal()"
      okText="确认"
      cancelText="取消"
    >
      <input style="display: none; " :value="orderListId" placeholder="id" />
      <div>
        <div class="Address">
          说明：若审批不通过则前端不展示此评论信息，且本次评价判定为无效且不计入综合评分）
        </div>
        <div style="margin-top: 60px;margin-bottom: 20px">
          <a-radio-group style="margin-bottom: 60px" @change="onChange1" name="radioGroup" :defaultValue="1">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="2">不通过</a-radio>
          </a-radio-group>

          <a v-if="AuditId == 2">
            <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
          </a>
        </div>
      </div>

      <a v-if="showPrise">
        <a-textarea placeholder="停用原因" v-model="closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
      </a>
    </a-modal>
    <!--评论弹出-->
    <a-modal
      title="查看评论"
      :footer="null"
      :width="700"
      v-model="visiblEvaluateInformation"
      @ok="hideModalAddressInformation()"
      okText="确认"
      cancelText="取消"
    >
      <div>
        <!--评论内容-->
        <div>
          <div style="margin-bottom: 20px" v-for="item in orderListDTO.orderEvaluateDTOList">
            <div style="display: flex;justify-content:flex-start;">
              <div class="evaluate">
                <a-avatar
                  shape="square"
                  v-if="item.mainPicture == undefined || item.mainPicture == ''"
                  :src="getAvatarView(item.mainPicture)"
                  class="mainPictureimg"
                />
                <a-avatar
                  shape="square"
                  v-if="item.mainPicture != undefined"
                  :src="getAvatarView(JSON.parse(item.mainPicture)[0])"
                  class="mainPictureimg"
                />
              </div>
              <div class="neirongCSS">
                <div>{{ item.goodName }}</div>
                <div>{{ item.specification }}</div>
                <div>
                  描述相符：
                  <template>
                    <a-rate class="colorSize" v-model="item.descriptionStar" disabled />
                  </template>
                </div>
              </div>
            </div>
            <div>
              <div style="font-size: 13px;margin-top: 15px">{{ item.content }}</div>
              <div style="margin-top: 15px" v-if="item.pictures">
                <img class="imgCss" v-for="imgItem in JSON.parse(item.pictures)" :src="getAvatarView(imgItem)" />
                <!--height="60px" width="60px" alt="图片不存在"-->
              </div>
            </div>
          </div>
        </div>
        <!--店铺评价-->
        <div style="background-color: #f2f2f2;padding:20px;">
          <div class="title" style="border: none;padding: 0;margin-bottom: 10px">店铺评价</div>
          <div>
            <div style="margin-bottom: 10px">
              物流服务：
              <template>
                <a-rate class="colorSize" v-model="orderListDTO.logisticsStar" disabled />
              </template>
            </div>
            <div style="margin-bottom: 10px">
              发货速度：
              <template>
                <a-rate class="colorSize" v-model="orderListDTO.shippingStar" disabled />
              </template>
            </div>
            <div style="margin-bottom: 10px">
              服务态度：
              <template>
                <a-rate class="colorSize" v-model="orderListDTO.serviceStar" disabled />
              </template>
            </div>
          </div>
        </div>
        <!--评论人-->
        <div class="pinlunren">
          <div>评论人：{{ orderListDTO.nickName }}</div>
          <div>评论时间：{{ orderListDTO.evaluateTime }}</div>
        </div>
      </div>
    </a-modal>
    <!--优惠信息弹出-->
    <!--v-model="visiblPreferentialInformation"-->
    <a-modal
      title="优惠信息"
      :footer="null"
      v-model="visiblCouponInformation"
      @ok="hideModalEmemberInformation()"
      :width="1200"
      okText="确认"
      cancelText="取消"
    >
      <div style="margin-bottom: 20px" v-if="marketingDiscountCoupon">
        <H3>优惠券</H3>
        <div class="CouponTextA">
          <div class="CouponText">优惠券id</div>
          <div class="CouponText2">{{ marketingDiscountCoupon.id }}</div>
          <div class="CouponText">优惠金额</div>
          <div class="CouponText2">
            -{{ record.coupon - (welfarePayments + record.vipLowerTotal + record.memberDiscountPriceTotal) }}
          </div>
          <!--优惠券金额=实际优惠-福利金-vip-会员-->
          <!--<div class="CouponText2"> -{{record.coupon}}</div>-->
        </div>
        <div class="CouponTextA">
          <div class="CouponText">优惠券名称</div>
          <div class="CouponText2">{{ marketingDiscountCoupon.name }}</div>
          <div class="CouponText">优惠券规则</div>
          <div class="CouponText2" v-if="(marketingDiscountCoupon.isThreshold = 0)">无门槛</div>
          <div class="CouponText2" v-if="(marketingDiscountCoupon.isThreshold = 1)">
            满{{ marketingDiscountCoupon.completely }}元,减{{ marketingDiscountCoupon.price }}元
          </div>
        </div>
        <div class="CouponTextA">
          <div class="CouponText">优惠券发行人</div>
          <div class="CouponText2" v-if="marketingDiscountCoupon.isPlatform == 0">平台</div>
          <div class="CouponText2" v-if="marketingDiscountCoupon.isPlatform == 1">店铺</div>

          <div class="CouponText">优惠券有效期</div>
          <div class="CouponText2">
            {{ marketingDiscountCoupon.startTime }} 至 {{ marketingDiscountCoupon.endTime }}
          </div>
        </div>
      </div>
      <div style="margin-bottom: 20px" v-if="welfarePayments">
        <H3>福利金</H3>
        <div class="CouponTextA">
          <div class="CouponText">支出福利金</div>
          <div class="CouponText2">{{ welfarePayments }}</div>
          <div class="CouponText">优惠金额</div>
          <div class="CouponText2">-{{ welfarePayments }}</div>
        </div>
      </div>
      <div style="margin-bottom: 20px" v-if="vipLowerTotal">
        <H3>vip免福利金抵扣</H3>
        <div class="CouponTextA">
          <div class="CouponText">会员类型</div>
          <div class="CouponText2" v-if="memberType2 == 0">普通会员</div>
          <div class="CouponText2" v-else-if="memberType2 == 1">vip会员</div>
          <div class="CouponText2" v-else>无会员信息</div>

          <div class="CouponText">优惠金额</div>
          <div class="CouponText2">-{{ vipLowerTotal }}</div>
        </div>
      </div>
      <div style="margin-bottom: 20px;" v-if="record.memberDiscountPriceTotal">
        <H3>会员等级优惠</H3>
        <div class="CouponTextA">
          <div class="CouponText">会员等级</div>
          <div class="CouponText2">
            {{ record.memberGradeContent }}
          </div>
          <div class="CouponText">优惠金额</div>
          <div class="CouponText2">-{{ record.memberDiscountPriceTotal }}</div>
        </div>
      </div>
    </a-modal>

    <!--赠送信息弹出-->
    <!--v-model="visiblPreferentialInformation"-->
    <a-modal
      title="赠送信息"
      :footer="null"
      v-model="visiblGivingInformation"
      @ok="hideModalEmemberInformation()"
      :width="1200"
      okText="确认"
      cancelText="取消"
    >
      <div style="margin-bottom: 20px">
        <H3>赠福利金</H3>
        <div class="CouponTextA">
          <div class="CouponText">赠送内容</div>
          <div class="CouponText2">{{ giveWelfarePayments }}福利金</div>
          <div class="CouponText">赠送规则</div>
          <div class="CouponText2">确认收货7天后到账</div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { postAction, getAction } from '@/api/manage'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'

export default {
  name: 'OrderListModal',
  data() {
    return {
      record: {},
      title: '操作',
      visible: false,
      visiblEmemberInformation: false,
      visiblGoodsInformation: false,
      visiblMessageInformation: false,
      visiblCouponInformation: false,
      visiblDistributionInformation: false,
      visiblCancelInformation: false,
      visiblAddressInformation: false,
      visibleAudi: false,
      visibleDelete: false, //删除
      visiblEvaluateInformation: false,
      visiblGivingInformation: false, //赠送信息
      giveWelfarePayments: '',
      orderId: '',
      listMemberShippingAddress: [],
      orderProviderListDTOs: [], //配送信息
      areaAddressId: '', //修改地址
      shippingAddress: '', //收货地址
      Message: '',
      closeExplain: '',
      memberList: {},
      orderListDTO: {},
      model: {},
      contactNumber: '',
      providerTemplateMaps: [], //运费模板信息
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      radioStyle: {
        areaAddressId: '',
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      orderListId: '',
      auditExplain: '',
      AuditId: '1',
      radioStyleAudit: {
        AuditId: '',
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      showPrise: false,
      consignee: '',
      houseNumberL: '',
      //优惠信息
      memberType: '',
      memberType2: '',
      marketingDiscountCoupon: {},
      welfarePayments: '0',
      vipLowerTotal: '0',
      formList: [],
      // 商品信息表头
      columns: [
        {
          title: '商品编号',
          align: 'center',
          dataIndex: 'goodNo'
        },
        {
          title: '商品主图',
          align: 'center',
          dataIndex: 'mainPicture',
          scopedSlots: { customRender: 'mainPicture' }
        },
        {
          title: '商品名称',
          align: 'center',
          dataIndex: 'goodName',
          width: 200
        },

        {
          title: '商品规格',
          align: 'center',
          dataIndex: 'specification',
          scopedSlots: { customRender: 'specification' }
        },

        {
          title: '单价',
          align: 'center',
          dataIndex: 'unitPrice'
        },
        {
          title: '数量',
          align: 'center',
          dataIndex: 'amount',
          scopedSlots: { customRender: 'amount' }
        },
        {
          title: '小计',
          align: 'center',
          dataIndex: 'total'
        },
        {
          title: '重量',
          align: 'center',
          dataIndex: 'weight'
        }
      ],

      // 配送信息表头
      columns1: [
        {
          title: '供应商',
          align: 'center',
          dataIndex: 'sysUserName'
        },
        {
          title: '运费模板',
          align: 'center',
          dataIndex: 'name'
        },

        {
          title: '计费规则',
          align: 'center',
          dataIndex: 'accountingRules'
          /* scopedSlots: {customRender: "accountingRules"}*/
        },

        {
          title: '计费方式',
          align: 'center',
          dataIndex: 'chargeMode',
          scopedSlots: { customRender: 'chargeMode' }
        },
        {
          title: '总数',
          align: 'center',
          dataIndex: 'goodCount'
          //scopedSlots: {customRender: "amount"}
        },
        {
          title: '运费',
          align: 'center',
          dataIndex: 'shipFee'
        }
      ],

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {},
      url: {
        add: '/orderList/orderList/add',
        edit: '/orderList/orderList/edit',
        updateStatus: '/orderList/orderList/updateStatus',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        memberListIdList: '/memberShippingAddress/memberShippingAddress/memberListIdList',
        updateAddress: '/orderList/orderList/updateAddress',
        reviewInformation: '/orderEvaluate/orderEvaluate/reviewInformation',
        updateAuditStatus: '/orderEvaluate/orderEvaluate/updateStatus',
        orderOff: 'orderList/orderList/orderOff'
      }
    }
  },
  computed: {
    importExcelUrl: function() {
      return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'delFlag',
            'memberListId',
            'orderNo',
            'orderType',
            'consignee',
            'contactNumber',
            'shippingAddress',
            'houseNumber',
            'message',
            'goodsTotal',
            'coupon',
            'shipFee',
            'marketingDiscountCouponId',
            'customaryDues',
            'actualPayment',
            'isUpdateAddr',
            'status',
            'childOrder',
            'closeType',
            'closeExplain',
            'promoter',
            'affiliationStore',
            'distributionChannel',
            'distribution',
            'isSender',
            'logisticsStar',
            'shippingStar',
            'serviceStar',
            'isEvaluate',
            'costPrice',
            'profit',
            'distributionCommission',
            'retainedProfits',
            'platformRetainedProfits',
            'platformProfit'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ payTime: this.model.payTime ? moment(this.model.payTime) : null })
        this.form.setFieldsValue({ shipmentsTime: this.model.shipmentsTime ? moment(this.model.shipmentsTime) : null })
        this.form.setFieldsValue({ deliveryTime: this.model.deliveryTime ? moment(this.model.deliveryTime) : null })
        this.form.setFieldsValue({ closeTime: this.model.closeTime ? moment(this.model.closeTime) : null })
        this.form.setFieldsValue({
          completionTime: this.model.completionTime ? moment(this.model.completionTime) : null
        })
        this.form.setFieldsValue({ evaluateTime: this.model.evaluateTime ? moment(this.model.evaluateTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleOk() {
      const that = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'put'
          }
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.payTime = formData.payTime ? formData.payTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.shipmentsTime = formData.shipmentsTime ? formData.shipmentsTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.deliveryTime = formData.deliveryTime ? formData.deliveryTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.closeTime = formData.closeTime ? formData.closeTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.completionTime = formData.completionTime
            ? formData.completionTime.format('YYYY-MM-DD HH:mm:ss')
            : null
          formData.evaluateTime = formData.evaluateTime ? formData.evaluateTime.format('YYYY-MM-DD HH:mm:ss') : null

          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    //会员信息弹窗
    showModalEmemberInformation(memberList, consignee, contactNumber, shippingAddress, houseNumber) {
      this.visiblEmemberInformation = true
      this.memberList = memberList
      this.consignee = consignee
      this.contactNumber = contactNumber
      this.shippingAddress = shippingAddress
      this.houseNumber = houseNumber
      for (let item of this.memberType) {
        //字典值替换
        if (item.value == this.memberList.memberType) {
          this.memberList.memberType = item.text
          break
        }
      }
      console.log('this.memberList', this.memberList)
    },
    hideModalEmemberInformation() {
      this.visiblEmemberInformation = false
    },
    //留言信息弹窗
    showModalMessageInformation(Message) {
      this.visiblMessageInformation = true
      this.Message = Message
    },
    //留言信息弹窗
    hideModalMessageInformation() {
      this.visiblMessageInformation = false
    },
    //赠送信息弹窗
    showModalGivingInformation(giveWelfarePayments) {
      this.visiblGivingInformation = true
      this.giveWelfarePayments = giveWelfarePayments
    },
    //赠送信息弹窗
    hideModalGivingInformation(giveWelfarePayments) {
      this.visiblGivingInformation = false
    },

    //优惠券
    showModalCouponInformation(record) {
      this.record = record
      this.marketingDiscountCoupon = record.marketingDiscountCoupon
      this.welfarePayments = record.welfarePayments
      this.vipLowerTotal = record.vipLowerTotal
      if (record.memberList) {
        this.memberType2 = record.memberList.memberType
      }
      console.log('this.memberType2:' + this.memberType2)
      console.log('this.marketingDiscountCoupon', this.marketingDiscountCoupon)
      this.visiblCouponInformation = true
    },
    hideModalCouponInformation() {
      this.visiblCouponInformation = false
    },
    //商品信息弹窗
    showModalGoodsInformation(orderProviderListDTOs) {
      this.visiblGoodsInformation = true
      console.log('-------------==', orderProviderListDTOs)
      this.orderNo = orderProviderListDTOs[0].orderNo
      this.formList = orderProviderListDTOs
      //this.goodList=goodList;
    },
    hideModalEmemberInformation() {
      this.visiblGoodsInformation = false
    },
    //配送方式信息弹窗
    showModalDistributionInformation(providerTemplateMaps) {
      this.visiblDistributionInformation = true

      this.providerTemplateMaps = providerTemplateMaps
    },
    hideModalDistributionInformation() {
      this.visiblDistributionInformation = false
    },
    //取消弹窗
    showModalCancelInformation(goodListId) {
      this.visiblCancelInformation = true
      this.goodListId = goodListId
    },
    hideModalCancelInformation() {
      var that = this
      postAction(that.url.orderOff, {
        id: this.goodListId,
        closeExplain: this.closeExplain,
        status: '4',
        closeType: '2'
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.error(res.message)
        }
      })
      this.goodListId = ''
      this.closeExplain = ''
      this.visiblCancelInformation = false
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    //修改地址
    showModalAddressInformation(goodListId, memberListId, consignee, contactNumber, shippingAddress) {
      var that = this
      this.goodListId = goodListId
      this.consignee = consignee
      this.contactNumber = contactNumber
      this.shippingAddress = shippingAddress
      getAction(that.url.memberListIdList, { memberListId: memberListId }).then(res => {
        if (res.success) {
          this.listMemberShippingAddress = res.result
          console.log(this.listMemberShippingAddress)
        } else {
          that.$message.success('操作失败')
        }
      })
      this.visiblAddressInformation = true
      //this.goodListId=goodListId;
    },
    hideModalAddressInformation() {
      var that = this
      getAction(that.url.updateAddress, { id: this.goodListId, areaAddressId: this.areaAddressId }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
      this.goodListId = ''
      this.consignee = ''
      this.contactNumber = ''
      this.shippingAddress = ''
      this.areaAddressId = ''
      this.visiblAddressInformation = false
    },

    //修改地址获取修改数据
    onChange(e) {
      this.areaAddressId = e.target.value
      console.log('radio checked', e.target.value)
    },
    init() {
      this.initIndex()
    },
    initIndex() {
      initDictOptions('member_type').then(res => {
        if (res.success) {
          /*for(let item of res.result){
              if(item.value == this.distribution  ){
                this.distribution = item.title
              }
            }*/
          this.memberType = res.result
        }
      })
    },
    //审核弹窗显示
    showAudiModal(id) {
      this.orderListId = id
      this.visibleAudi = true
      this.closeExplain = ''
    },
    //审核
    hideAudiModal() {
      this.visibleAudi = false
      // console.log("this.stopRemark=",this.stopRemark)
      var that = this
      getAction(that.url.updateAuditStatus, {
        id: this.orderListId,
        closeExplain: this.closeExplain,
        status: this.AuditId
      }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.loadData()
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //修改地址获取修改数据
    onChange1(e) {
      this.AuditId = e.target.value
      console.log('radio checked', e.target.value)
    },
    check(e) {
      // 先取消所有选中项

      this.isChecked = false
      this.isChecked1 = false
      this.showPrise = false
      //再设置当前点击项选中
      //  this.radio = this.radios.value;
      // 设置值，以供传递
      if (e == 2) {
        this.isChecked = true
        this.auditExplain = ''
      } else {
        this.isChecked1 = true
        this.showPrise = true
      }
    },
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },

    //评论内容
    showEvaluateModal(id) {
      console.log(id)

      var that = this
      getAction(that.url.reviewInformation, { orderListId: id }).then(res => {
        if (res.success) {
          that.orderListDTO = res.result
          console.log('that.orderListDTO', that.orderListDTO)
        } else {
          //that.$message.success("操作失败");
        }
      })
      this.visiblEvaluateInformation = true
      //this.goodListId=goodListId;
    },
    hideModalEvaluateInformation() {
      visiblEvaluateInformation
      var that = this
      getAction(that.url.updateAddress, { id: this.goodListId, areaAddressId: this.areaAddressId }).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.$emit('ok') //发送父级主键刷新
        } else {
          that.$message.success('修改失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.suppliers {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.suppliers-content {
  margin-left: 20px;
}

.Cancel {
  width: 100%;
  height: 30px;
  text-align: center;
  background-color: #fff2f1;
  border-radius: 4px;
  border: 1px solid #ffa39e;
  line-height: 30px;
}

.Address {
  width: 100%;
  height: 30px;
  text-align: center;
  background-color: #ccebff;
  border-radius: 4px;
  border: 1px solid #0099ff;
  line-height: 30px;
}

.CouponTextA {
  display: flex;
  justify-items: center;
  justify-content: space-between;
}

.CouponText {
  width: 35%;
  float: left;
  height: 40px;
  text-align: right;
  line-height: 40px;
  border: 1px solid #cccccc;
  padding-right: 30px;
  background-color: #f2f2f2;
}

.CouponText2 {
  width: 65%;
  float: left;
  height: 40px;
  text-align: left;
  line-height: 40px;
  border: 1px solid #cccccc;
  padding-left: 30px;
}

.evaluate {
  font-style: italic;
  height: 80px;
  width: 80px;
  line-height: 80px;
  text-align: center;
}

.evaluateNR {
  font-style: italic;
  height: 80px;
  width: 80px;
  line-height: 80px;
  text-align: center;
}

.colorSize {
  color: red;
  font-size: 14px;
}

.imgCss {
  max-width: 80px;
  font-size: 12px;
  font-style: italic;
  margin-right: 20px;
}

.title {
  font-size: 15px;
  font-weight: 600;
}

.neirongCSS {
  margin-left: 20px;
  line-height: 27px;
  text-align: left;
}

.pinlunren {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  margin-bottom: 20px;
}

.mainPictureimg {
  font-size: 12px;
  font-style: italic;
  height: 80px;
  width: 80px;
  text-align: center;
}
</style>
