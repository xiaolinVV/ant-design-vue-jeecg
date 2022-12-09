<template>
  <div class="AddMarketingGiftbagPurchaseModel">
    <div class="title">
      {{part == 2 ?'编辑':'添加'}}采购礼包
    </div>
    <div class="wrap">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }" label="采购礼包名称">
          <!--          v-model="AllData.giftName"-->
          <a-input
            placeholder="请输入采购礼包名称,字数不超过50个字"
            v-decorator="['giftName',VerificationRules.giftName]"/>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }" label="采购礼包价格">
          <!--            v-model="AllData.price"-->
          <a-input
            placeholder="请输入采购礼包价格"
            type="number"
            v-decorator="['price',VerificationRules.price]"/>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }" label="发货次数">
          <!--            v-model="AllData.price"-->
          <a-input
            placeholder="请输入发货次数"
            type="number"
            v-decorator="['sendTimes',VerificationRules.sendTimes]"/>
        </a-form-item>
        <!--        <a-form-item :label-col="labelCol" :wrapper-col="{span: 20}" label="兑换券">-->
        <!--          <a-button @click="PopUp(0)">-->
        <!--            选择兑换券-->
        <!--          </a-button>-->
        <!--          <a-alert-->
        <!--            :closable="true"-->
        <!--            class="attention"-->
        <!--            message="重要提示：未选择即为不送，兑换券所对应的商品若库存不足，也为不送。"-->
        <!--          />-->
        <!--          <a-table :columns="exchangeCertificateListComumns" :dataSource="exchangeCertificateListDatas"-->
        <!--                   :pagination="{pageSize:5}" :scroll="{x:exchangeCertificateListComumns.length * columnsWidth}"-->
        <!--                   bordered-->
        <!--                   rowKey="id"-->
        <!--                   style="margin-top: 20px;">-->
        <!--            <template slot="goodQuantity" slot-scope="text, record, index">-->
        <!--              <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>-->
        <!--            </template>-->
        <!--            <template slot="certificateType" slot-scope="text, record, index">-->
        <!--              <div v-if="record.certificateType == 1">-->
        <!--                可兑换的商品任选一个-->
        <!--              </div>-->
        <!--              <div v-else>-->
        <!--                可兑换的商品全部兑换-->
        <!--              </div>-->
        <!--            </template>-->
        <!--            <template slot="distributedAmount" slot-scope="text, record, index">-->
        <!--              <a-input-number-->
        <!--                :min="1"-->
        <!--                :precision="0"-->
        <!--                @change="e => certificateHandleChange(e, record.id, 'distributedAmount','exchangeCertificateListDatas')"-->
        <!--                v-model="record.distributedAmount"></a-input-number>-->
        <!--            </template>-->
        <!--            <template slot="operation" slot-scope="text, record">-->
        <!--              <a-popconfirm-->
        <!--                @confirm="() => onDelete(record.id,0)"-->
        <!--                title="确定要删除吗?"-->
        <!--                v-if="exchangeCertificateListDatas.length"-->
        <!--              >-->
        <!--                <a href="javascript:;">删除</a>-->
        <!--              </a-popconfirm>-->
        <!--            </template>-->
        <!--            <template slot="validityType" slot-scope="text, record, index">-->
        <!--              <a-select v-model="record.validityType * 1"-->
        <!--                        @change="value => certificateHandleChange(value, record.id, 'validityType','exchangeCertificateListDatas')"-->
        <!--                        style="width: 120px" v-if="record.distributedAmount > 1">-->
        <!--                <a-select-option :value="0">连续有效期</a-select-option>-->
        <!--                <a-select-option :value="1">相同有效期</a-select-option>-->
        <!--              </a-select>-->
        <!--              <div v-else>-->
        <!--                相同有效期-->
        <!--              </div>-->
        <!--            </template>-->
        <!--          </a-table>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item :label-col="labelCol" :wrapper-col="{span: 20}" label="优惠券">-->
        <!--          <a-button @click="PopUp(1)">-->
        <!--            选择优惠券-->
        <!--          </a-button>-->
        <!--          <a-alert-->
        <!--            :closable="true"-->
        <!--            class="attention"-->
        <!--            message="重要提示：未选择即为不送"-->
        <!--          />-->

        <!--          <a-table :columns="couponListColumns" :dataSource="couponListData" :pagination="{pageSize:5}"-->
        <!--                   :scroll="{x:couponListColumns.length * columnsWidth}"-->
        <!--                   bordered-->
        <!--                   rowKey="id"-->
        <!--                   style="margin-top: 20px;">-->
        <!--            <template slot="applyGood" slot-scope="text, record, index">-->
        <!--              <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>-->
        <!--            </template>-->
        <!--            <template slot="distributedAmount" slot-scope="text, record, index">-->
        <!--              <a-input-number-->
        <!--                :min="1"-->
        <!--                :precision="0"-->
        <!--                @change="e => certificateHandleChange(e, record.id, 'distributedAmount','couponListData')"-->
        <!--                v-model="record.distributedAmount"></a-input-number>-->
        <!--            </template>-->
        <!--            <template slot="operation" slot-scope="text, record">-->
        <!--              <a-popconfirm-->
        <!--                @confirm="() => onDelete(record.id,1)"-->
        <!--                title="确定要删除吗?"-->
        <!--                v-if="couponListData.length"-->
        <!--              >-->
        <!--                <a href="javascript:;">删除</a>-->
        <!--              </a-popconfirm>-->
        <!--            </template>-->
        <!--            <template slot="validityType" slot-scope="text, record, index">-->
        <!--              <a-select v-model="record.validityType * 1"-->
        <!--                        @change="value => certificateHandleChange(value, record.id, 'validityType','couponListData')"-->
        <!--                        style="width: 120px" v-if="record.distributedAmount > 1">-->
        <!--                <a-select-option :value="0">连续有效期</a-select-option>-->
        <!--                <a-select-option :value="1">相同有效期</a-select-option>-->
        <!--              </a-select>-->
        <!--              <div v-else>-->
        <!--                相同有效期-->
        <!--              </div>-->
        <!--            </template>-->
        <!--          </a-table>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 10 }" label="福利金">-->
        <!--          &lt;!&ndash;          v-model="AllData.welfarePayments"&ndash;&gt;-->
        <!--          &lt;!&ndash;          {&ndash;&gt;-->
        <!--          &lt;!&ndash;          pattern:  /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,&ndash;&gt;-->
        <!--          &lt;!&ndash;          message: '请输入正确的福利金！',&ndash;&gt;-->
        <!--          &lt;!&ndash;          },&ndash;&gt;-->
        <!--          <a-input-number-->
        <!--            placeholder="请输入福利金"-->
        <!--            :min="0"-->
        <!--            :precision="2"-->
        <!--            style="width:120px"-->
        <!--            v-decorator="[-->
        <!--          'welfarePayments',-->
        <!--          {-->
        <!--            rules: [-->
        <!--              {-->
        <!--                required: true,-->
        <!--                message: '请输入福利金!',-->
        <!--              },-->
        <!--            ],-->
        <!--          },-->
        <!--        ]"/>-->
        <!--          <div>-->
        <!--            0即不送-->
        <!--          </div>-->
        <!--        </a-form-item>-->
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 20}" label="分销佣金">
          <div>
            <div>
              <a-input-number
                :min="0"
                :precision="2"
                placeholder="请输入分销佣金"
                style="width: 8vw;margin: 0 10px;"
                v-decorator="['distributionCommission',VerificationRules.distributionCommission]"
                />
              <span>
                0即没有
              </span>
            </div>
            <div class="fxyjwrap">
              <div>
                <div>
                  <span>推广人一级奖励</span>
                  <a-input-number
                    :min="0" :precision="2" placeholder="请输入推广一级奖励比例" style="width: 4vw;margin: 0 10px;"
                    v-model="AllData.promoterReward"/>
                  <span>%,0即没有</span>
                </div>
                <div>
                  <span>推广人二级奖励</span>
                  <a-input-number
                    :min="0" :precision="2" placeholder="请输入推广二级奖励比例" style="width: 4vw;margin: 0 10px;"
                    v-model="AllData.promoterRewardTwo"/>
                  <span>%,0即没有</span>

                </div>
                <div>
                  <span>归属店铺奖励</span>
                  <a-input-number
                    :min="0" :precision="2" placeholder="请输入归属店铺奖励"
                    style="width: 4vw;margin: 0 10px;"
                    v-model="AllData.ownershipShopsReward"/>
                  <span>%,0即没有</span>
                </div>
                <div>
                  <span>渠道店铺奖励</span>
                  <a-input-number
                    :min="0" :precision="2" placeholder="请输入渠道店铺奖励"
                    style="width: 4vw;margin: 0 10px;"
                    v-model="AllData.channelShopsReward"/>
                  <span>%,0即没有</span>
                </div>
              </div>

              <a-radio-group v-model="AllData.modeDistribution" style="width: 100%" @change="handleChangeModeDistribution">
                <!--                :style="radioStyle"-->
                <a-radio value="0" style="display: flex;align-items: center;">
                  <div style="display: flex;align-items: center;">
                    按代理比例分配
                    <a-checkbox v-model="AllData.isAgencyAward" style="margin-left: 20px">
                      代理奖励，不勾选即不奖励
                    </a-checkbox>
                  </div>
                </a-radio>

                <a-radio value="1" style="display: flex;align-items: center;">
                  <div style="display: flex;align-items: center;">
                    按礼包比例分配
                    <div style="margin-left: 10px">
                      <span>省代奖励</span>
                      <a-input-number
                        :min="0" :precision="2" placeholder="请输入省代奖励"
                        style="width: 4vw;margin: 0 10px;"
                        :disabled="!firstDLFPCanInput"
                        v-model="AllData.proviceAward"/>
                      <span>%,0即没有</span>
                    </div>
                    <div style="margin-left: 10px">
                      <span>市代奖励</span>
                      <a-input-number
                        :min="0" :precision="2" placeholder="请输入市代奖励"
                        style="width: 4vw;margin: 0 10px;"
                        :disabled="!firstDLFPCanInput"
                        v-model="AllData.cityAward"/>
                      <span>%,0即没有</span>
                    </div>
                    <div style="margin-left: 10px">
                      <span>县代奖励</span>
                      <a-input-number
                        :min="0" :precision="2" placeholder="请输入县代奖励"
                        style="width: 4vw;margin: 0 10px;"
                        :disabled="!firstDLFPCanInput"
                        v-model="AllData.towmAward"/>
                      <span>%,0即没有</span>
                    </div>
                  </div>

                </a-radio>
              </a-radio-group>

              <a-radio-group v-model="AllData.allocationModel" style="width: 100%" @change="handleChangeAllocationModel">
                  <a-radio value="0" style="display: flex;align-items: center;">
                  <div style="display: flex;align-items: center;">
                    按加盟商比例分配
                    <a-checkbox v-model="AllData.isAllianceAward" style="margin-left: 20px">
                      加盟商奖励，不勾选即不奖励
                    </a-checkbox>
                  </div>
                </a-radio>

<!--                <a-radio value="1" style="display: flex;align-items: center;">-->
<!--                  <div style="display: flex;align-items: center;">-->
<!--                    按礼包比例分配-->
<!--                    <div style="margin-left: 10px">-->
<!--                      <span>加盟商奖励</span>-->
<!--                      <a-input-number-->
<!--                        :min="0" :precision="2" placeholder="请输入省代奖励"-->
<!--                        style="width: 4vw;margin: 0 10px;"-->
<!--                        v-model="AllData.jiamengshangjiangli"/>-->
<!--                      <span>%,0即没有</span>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </a-radio>-->
              </a-radio-group>
            </div>

            <!--            <div>-->
            <!--              <a-checkbox v-model="AllData.isAgencyAward">代理奖励不勾选即不奖励</a-checkbox>-->
            <!--            </div>-->
            <!--            <div>-->
            <!--              <a-checkbox v-model="AllData.isAllianceAward">加盟商奖励不勾选即不奖励</a-checkbox>-->
            <!--            </div>-->
          </div>
        </a-form-item>
        <!--        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="礼包分红">-->
        <!--          <div style="display: flex;align-items: center">-->
        <!--            <div style="margin-right: 15px;">-->
        <!--              <a-input-number-->
        <!--                placeholder="请输入礼包分红"-->
        <!--                style="width: 150px"-->
        <!--                :min="0"-->
        <!--                :precision="2"-->
        <!--                v-decorator="[-->
        <!--          'participation',-->
        <!--          {-->
        <!--            rules: [-->
        <!--              {-->
        <!--                required: true,-->
        <!--                message: '请输入礼包分红!',-->
        <!--              }-->
        <!--            ],-->
        <!--          },-->
        <!--        ]"/>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--          &lt;!&ndash;          ,{&ndash;&gt;-->
        <!--          &lt;!&ndash;          pattern:  /^[+]{0,1}(\d+)$/,&ndash;&gt;-->
        <!--          &lt;!&ndash;          message: '请输入正确的数字,不能为负数！',&ndash;&gt;-->
        <!--          &lt;!&ndash;          },&ndash;&gt;-->
        <!--        </a-form-item>-->
        <!--        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" class="line-special" label="vip特权">-->
        <!--          &lt;!&ndash;          v-model="AllData.vipPrivilege"&ndash;&gt;-->
        <!--          <div style="display: flex;align-items: center;">-->
        <!--            <a-radio-group-->
        <!--              @change="vipPrivilegeChange"-->
        <!--              v-decorator="[-->
        <!--          'vipPrivilege',-->
        <!--          {-->
        <!--            rules: [-->
        <!--              {-->
        <!--                required: true,-->
        <!--                message: '请选择vip特权!',-->
        <!--              },-->
        <!--            ],-->
        <!--          },-->
        <!--        ]"-->
        <!--              style="margin-right: 10px"-->
        <!--            >-->
        <!--              <a-radio :style="radioStyle" :value="0">不赠送</a-radio>-->
        <!--              <a-radio :style="radioStyle" :value="1">赠送</a-radio>-->
        <!--            </a-radio-group>-->
        <!--            <div style="background: #F2F2F2;height: 100%;display: flex;align-items: center;padding: 0 15px;">-->
        <!--              &lt;!&ndash;  vip等级&ndash;&gt;-->
        <!--              <a-radio-group-->
        <!--                :disabled="vipPrivilegeChangeValueDisabled == 1 ? false : true"-->
        <!--                v-model="AllData.sendVipMemberGradeId"-->
        <!--              >-->
        <!--                <a-radio :style="radioStyle" v-for="(item,index) in vipList" :value="item.id">{{item.gradeName}}-->
        <!--                </a-radio>-->
        <!--              </a-radio-group>-->
        <!--            </div>-->
        <!--          </div>-->

        <!--        </a-form-item>-->
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" class="line-special" label="购买人限制">
          <!--          v-model="AllData.buyLimit"-->
          <div style="display: flex;align-items: center;height: 39px;">
            <a-checkbox-group
              :options="plainOptions"
              @change="buyLimitOfGradeChange"
              v-decorator="['buyLimit',VerificationRules.buyLimit]"
            />
            <div v-if="vipList.length>0"
                 style="background: #F2F2F2;height: 100%;display: flex;align-items: center;padding: 0 15px;">
              <!--  vip等级-->
              <!--              v-model="AllData.buyVipMemberGradeId"-->
              <a-checkbox-group :options="vipList" v-model="AllData.buyVipMemberGradeId"
                                :disabled="buyLimitChangeValueDisabled"/>
              <div style="margin-left: 20px">
                说明：不勾选vip等级，即不针对vip等级限制。勾选vip等级，即针对vip等级进行限制。
              </div>
            </div>
          </div>

        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 18 }" label="最低购买数量">
          <!--          v-model="AllData.repertory"-->
          <a-input
            placeholder="请输入最低购买数量"
            style="width: 15%"
            type="number"
            v-decorator="[
          'smallBuyCount',
          {
            rules: [
              {
                required: true,
                message: '请输入最低购买数量！',
              },{
                pattern:  /^[+]{0,1}(\d+)$/,
                message: '请输入正确的最低购买数量！',
              },
            ],
          },
        ]"/>
        </a-form-item>
<!--        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="每人限购买次数">-->
<!--          &lt;!&ndash;          v-model="AllData.limitTimes"&ndash;&gt;-->
<!--          <div style="display: flex;align-items: center">-->
<!--            <div style="margin-right: 15px;">-->
<!--              <a-input-number-->
<!--                placeholder="请输入购买次数"-->
<!--                style="width: 150px"-->
<!--                type="number"-->
<!--                v-decorator="[-->
<!--          'limitTimes',-->
<!--          {-->
<!--            rules: [-->
<!--              {-->
<!--                required: true,-->
<!--                message: '请输入每人限购买次数!',-->
<!--              },{-->
<!--                pattern:  /^[+]{0,1}(\d+)$/,-->
<!--                message: '请输入正确的购买限制次数！',-->
<!--              },-->
<!--            ],-->
<!--          },-->
<!--        ]"/>-->
<!--              <span>-->
<!--            次-->
<!--          </span>-->
<!--            </div>-->
<!--            <div style="display: flex;align-items: center">-->
<!--              &lt;!&ndash;              v-model=""&ndash;&gt;-->
<!--              <a-checkbox v-model="AllData.isPreposition" @change="isPrepositionChange">-->
<!--                前置礼包-->
<!--              </a-checkbox>-->
<!--              &lt;!&ndash;              @click="PopUp(2)"&ndash;&gt;-->
<!--              <a-button :disabled="!AllData.isPreposition" @click="PopUp(3)">-->
<!--                选择礼包-->
<!--              </a-button>-->
<!--              <a-tag closable @close="onDelete(giftBagData[0].id,3)" v-if="giftBagData.length > 0"-->
<!--                     style="height: 32px; display: flex;align-items: center;margin-left: 10px">-->
<!--                {{giftBagData[0].giftName}} {{giftBagData[0].id}}-->
<!--              </a-tag>-->
<!--            </div>-->
<!--          </div>-->

<!--        </a-form-item>-->
        <a-form-item :label-col="labelCol" :wrapper-col="{span: 14}" label="礼包上架门店">
          <div>
            <!--            v-model="AllData.viewScope"-->
            <a-radio-group
              @change="rackGiftChange"
              v-decorator="[
          'viewScope',VerificationRules.viewScope]"
            >
              <a-radio :style="radioStyle" :value="1" style="margin-right: 150px;"> 全平台</a-radio>
              <a-radio :style="radioStyle" :value="0">指定门店</a-radio>
            </a-radio-group>
            <a-button :disabled="AllData.viewScope == '1'" @click="PopUp(2)">
              选择门店
            </a-button>
          </div>
          <a-alert
            :closable="true"
            class="attention"
            message="重要提示：指定门店分店适用的话，若进入其他门店是看不到此礼包的。"
          />
          <a-table :columns="upperStoreColumns" :dataSource="upperStoreDatas" :pagination="{pageSize:5}" bordered
                   style="margin-top: 20px;">
            <template slot="logoAddr" slot-scope="text">
              <img :src="text" alt="" style="width:40px;height:40px;">
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                @confirm="() => onDelete(record.sysUserId,2)"
                title="确定要删除吗?"
                v-if="upperStoreDatas.length"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 18 }" label="发行总量">
          <!--          v-model="AllData.repertory"-->
          <a-input
            placeholder="请输入发行总量"
            style="width: 15%"
            type="number"
            v-decorator="[
          'repertory',
          {
            rules: [
              {
                required: true,
                message: '请输入发行总量！',
              },{
                pattern:  /^[+]{0,1}(\d+)$/,
                message: '请输入正确的发行总量！',
              },
            ],
          },
        ]"/>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 10 }" label="礼包发行时间">
          <!--          v-model="selectDateToTime"-->
          <a-range-picker v-decorator="['selectDateToTime',VerificationRules.selectDateToTime]"/>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }"
                     help="尺寸1029*480 ，支持jpg、jpeg、png格式，大小不超过2M"
                     validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              礼包图片
          </span>
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="mainPictureUpload"
              :fileList="mainPictureFileList"
              :headers="headers"
              @change="mainPictureHandleChange"
              @preview="mainPictureHandlePreview"
              listType="picture-card"
            >
              <div v-if="mainPictureFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
              <img :src="mainPicturePreviewImage" alt="example" style="width: 100%"/>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }"
                     help="尺寸750*高度不限，支持jpg、jpeg、png格式，单张大小不超过2M"
                     validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              详情图
          </span>
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="giftDealsUpload"
              :fileList="giftDealsFileList"
              :headers="headers"
              @change="giftDealsHandleChange"
              @preview="giftDealsHandlePreview"
              listType="picture-card"
            >
              <div v-if="giftDealsFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="giftDealsPreviewVisible" @cancel="giftDealsHandleCancel">
              <img :src="giftDealsPreviewImage" alt="example" style="width: 100%"/>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }"
                     help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
                     validate-status="error"
        >
          <span slot="label">
            <span class="dataCheckedStar">
              *
            </span>
              分享图
          </span>
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="coverPlanUpload"
              :fileList="coverPlanFileList"
              :headers="headers"
              @change="coverPlanHandleChange"
              @preview="coverPlanHandlePreview"
              listType="picture-card"
            >
              <div v-if="coverPlanFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="coverPlanPreviewVisible" @cancel="coverPlanHandleCancel">
              <img :src="coverPlanPreviewImage" alt="example" style="width: 100%"/>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 7 }"
                     help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置，以免影响展示效果。"
                     label="海报图"
                     validate-status="error"
        >
          <div class="clearfix">
            <a-upload
              :action="uploadAction"
              :beforeUpload="postersUpload"
              :fileList="postersFileList"
              :headers="headers"
              @change="postersHandleChange"
              @preview="postersHandlePreview"
              listType="picture-card"
            >
              <div v-if="postersFileList.length < 1">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :footer="null" :visible="postersPreviewVisible" @cancel="postersHandleCancel">
              <img :src="postersPreviewImage" alt="example" style="width: 100%"/>
            </a-modal>
          </div>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="礼包说明">
          <a-textarea :rows="4" placeholder="礼包说明能让用户更加了解礼包" v-model="AllData.giftExplain"/>
        </a-form-item>
      </a-form>
      <div class="button-end">

      </div>
      <div class="button-operation">
        <a-button>
          取消
        </a-button>
        <a-button @click="sure" type="primary">
          确认
        </a-button>
      </div>

      <!--    弹窗-->
      <a-modal
        :title="'选择' + popName"
        :visible="ShowPopUp"
        :width="1200"
        @ok="selectLineData"
        @cancel="PopUp"
      >
        <div id="cnt">
          <div class="title2">
            <div>
              {{popName}}名称：
              <a-input v-model="searchName" style="width:  200px;"/>
              <!--                商品分类：-->
              <!--                <a-select defaultValue="请选择" style="width: 120px">-->

              <!--                </a-select>-->
              <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

              <!--                </a-select>-->
              <!--                <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">-->

              <!--                </a-select>-->
            </div>
            <div v-if="popPart == '0' || popPart == '1'">
              券id:
              <a-input v-model="queryParam.id" style="width:  200px;">

              </a-input>
            </div>
            <!--<div v-if="popPart == '1'">
              使用人限制:
              <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.getRestrict" style="width:  200px" dictCode="member_type"/>
            </div>-->
            <div v-if="popPart == 1">
              发行人：
              <a-input v-model="queryParam.issuer" style="width: 200px;"/>
            </div>
            <div v-if="popPart == '0'">
              兑换方式：
              <a-select v-model="queryParam.certificateType" placeholder="请选择" style="width: 200px">
                <a-select-option value="">请选择</a-select-option>
                <a-select-option value="0">可兑换的商品全部兑换</a-select-option>
                <a-select-option value="1">可兑换的商品任选一个</a-select-option>
              </a-select>
            </div>
            <div v-if="popPart == 2">
              <!--门店名称：
              <a-input v-model="searchName"/>-->
              <!--分店名称：
              <a-input/>-->
            </div>
            <!--<div v-if="popPart == 2">
              所属城市：
              <a-select defaultValue="请选择" style="width: 120px">

              </a-select>
              <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

              </a-select>
              <a-select defaultValue="请选择" style="width: 120px;margin-left: 20px;">

              </a-select>
            </div>-->

            <a-button @click="PopUp(popPart,'true')" type="primary">
              查询
            </a-button>
          </div>
          <a-table :columns="popUpColumns" :dataSource="popUpData" :loading="tableloading"
                   :pagination="selectPagination"
                   :rowKey="record => popPart==2?record.sysUserId:record.id"
                   :rowSelection="rowSelection"
                   :scroll="{y:300,x:(popUpColumns.length + 1) * columnsWidth}"
                   bordered
                   style="margin-top: 20px;"
                   @change="handleSelectTableChange"
          >
            <template slot="goodQuantity" slot-scope="text, record, index">
              <a @click="showExchangeGoodInformation(record.id)">{{record.goodQuantity}}</a>
            </template>
            <template slot="applyGood" slot-scope="text, record, index">
              <a @click="showGoodInformation(record.id)">{{record.applyGood}}</a>
            </template>
            <template slot="logoAddr" slot-scope="text">
              <img :src="text" alt="" style="width: 40px;height: 40px;">
            </template>
            <template slot="distributedAmount" slot-scope="text">
              - -
            </template>
            <template slot="validityType" slot-scope="text">
              - -
            </template>
            <template slot="operation" slot-scope="text">
              - -
            </template>

          </a-table>
        </div>
      </a-modal>
    </div>
    <AppMarketingCertificateGoodModal ref="AppMarketingCertificateGoodModal"></AppMarketingCertificateGoodModal>
    <AppMarketingGoodModal ref="AppMarketingGoodModal"></AppMarketingGoodModal>
  </div>
</template>
<script>
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import { httpAction, getAction, postAction, putAction } from '@/api/manage'
  import moment from 'moment'
  import dayjs from 'dayjs'
  import Vue from 'vue'
  import '@/assets/js/allReg'
  import { ajaxGetDictItems } from '@/api/api'
  //字典替换
  import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
  import AppMarketingCertificateGoodModal from './AppMarketingCertificateGoodModal'
  import AppMarketingGoodModal from './AppMarketingGoodModal'

  function isEmpty(obj) {
    if (typeof obj === 'undefined' || obj == null || obj === '') {
      return true
    } else {
      return false
    }
  }

  const columnsWidth = 160
  const exchangeCertificateListComumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: '兑换券id',
      dataIndex: 'id',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '兑换券名称',
      dataIndex: 'name',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '兑换商品',
      dataIndex: 'goodQuantity',
      scopedSlots: { customRender: 'goodQuantity' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '兑换方式',
      dataIndex: 'certificateType',
      width: columnsWidth,
      align: 'center',
      scopedSlots: { customRender: 'certificateType' }
    },
    {
      title: '使用人限制',
      dataIndex: 'memberTypeName',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '券剩余发行量',
      dataIndex: 'discountSurplus',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '核销门店',
      dataIndex: 'storeQuantity',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '核销奖励',
      dataIndex: 'theReward',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '有效期控制',
      dataIndex: 'validityType',
      scopedSlots: { customRender: 'validityType' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'operation',
      // className: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
  const couponListColumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: '优惠券id',
      dataIndex: 'id',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '优惠券名称',
      dataIndex: 'name',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '使用门槛',
      dataIndex: 'usingThreshold',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '优惠内容',
      dataIndex: 'preferentialContent',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '用券时间',
      dataIndex: 'usrTime',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '适用商品',
      dataIndex: 'applyGood',
      scopedSlots: { customRender: 'applyGood' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '购买限制',
      dataIndex: 'memberTypeName',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发行人',
      dataIndex: 'issuer',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '券剩余发行量',
      dataIndex: 'discountSurplus',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '发放数量',
      dataIndex: 'distributedAmount',
      scopedSlots: { customRender: 'distributedAmount' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '有效期控制',
      dataIndex: 'validityType',
      scopedSlots: { customRender: 'validityType' },
      width: columnsWidth,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'operation',
      // className: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
  const upperStoreColumns = [
    /*{
      title: '#',
      dataIndex: '#',
      width: columnsWidth,
      align: 'center'
    },*/
    {
      title: 'logo',
      dataIndex: 'logoAddr',
      scopedSlots: { customRender: 'logoAddr' },
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '门店名称',
      dataIndex: 'storeName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '分店名称',
      dataIndex: 'subStoreName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '所属城市',
      dataIndex: 'areaAddress',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '门店地址',
      dataIndex: 'storeAddress',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '操作',
      dataIndex: 'operation',
      // className: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ]
  const giftBagColumns = [
    {
      title: '礼包编号',
      dataIndex: 'id',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '礼包名称',
      dataIndex: 'giftName',
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '礼包图片',
      dataIndex: 'logoAddr',
      scopedSlots: { customRender: 'logoAddr' },
      width: columnsWidth,
      align: 'center'
    },
    {
      title: '礼包价格',
      dataIndex: 'price',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '礼包发行时间',
      dataIndex: 'publishTime',
      width: columnsWidth,
      align: 'center'
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      width: columnsWidth,
      align: 'center'
    }
  ]
  export default {
    data() {
      return {
        labelCol: { span: 3 },
        wrapperCol: { span: 21 },
        radioStyle: {},
        modalTableType: 'checkbox',
        headers: '',
        id:'',
        //主图 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
        //详情图 配置
        giftDealsFileList: [],
        giftDealsPreviewVisible: false,
        giftDealsPreviewImage: '',
        giftDealsPic: true,
        //分享图 配置
        coverPlanFileList: [],
        coverPlanPreviewVisible: false,
        coverPlanPreviewImage: '',
        coverPlanPic: true,
        //海报图 配置
        postersFileList: [],
        postersPreviewVisible: false,
        postersPreviewImage: '',
        postersPic: true,
        searchName: '',//查询内容
        // certificateType: '',
        form: this.$form.createForm(this, { name: 'AddMarketingGiftbagPurchaseModel' }),
        VerificationRules: {
          giftName: {
            rules: [
              {
                required: true,
                message: '请输入采购礼包名称!'
              }, {
                max: 50,
                message: '采购礼包名称字数不超过50字！'
              }
            ]
          },
          sendTimes:{
            rules: [
              {
                pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                message: '请输入正确的发货次数！'
              },
              {
                required: true,
                message: '请输入发货次数!'
              }
            ]
          },
          price: {
            rules: [
              {
                pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                message: '请输入正确的采购礼包价格！'
              },
              {
                required: true,
                message: '请输入采购礼包价格!'
              }
            ]
          },
          buyLimit: {
            rules: [
              {
                required: true,
                message: '请选择购买人限制!'
              }
            ]
          },
          viewScope: {
            rules: [
              {
                required: true,
                message: '请选择礼包上架门店',
              }
            ],
          },
          distributionCommission:{rules: [{required: true,message: '请输入分销佣金',}]},
          selectDateToTime:{rules: [{required: true,message: '请选择礼包发行时间',}]}

        },
        //查询table分页配置
        selectPagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        queryParam: {},
        AllData: {
          delFlag: '0',//删除状态
          giftName: '',//礼包名称
          price: '',//礼包价格
          welfarePayments: '',//福利金
          distributionCommission: '',//分销佣金
          buyLimit: [],//购买限制
          // vipPrivilege: '',//vip特权
          smallBuyCount:1,//最低购买数量
          limitTimes: '',//每人限购买次数
          viewScope: 1,//上架门店类型
          repertory: '',//发行总量
          startTime: '',//礼包发行开始时间
          endTime: '',//礼包发行结束时间
          status: '1',
          certificateIds: '',//选择兑换券ids
          storeIds: '', //-选择门店 ids
          discountIds: '',//选择优惠券  ids
          giftBagIds: '',//选择礼包 ids
          mainPicture: '',//礼包图片
          giftDeals: '',//礼包详情图
          coverPlan: '',//分享图
          posters: '',//海报图
          giftExplain: '',//礼包说明
          promoterReward: '',//推广奖励,不设置的话就取字典promoter_reward作为默认值
          ownershipShopsReward: '',//归属店铺奖励,不设置的话就取字典ownership_shops_reward作为默认值
          channelShopsReward: '',//渠道店铺奖励,不设置的话就取字典channel_shops_reward作为默认值
          isAgencyAward: true,//代理是否奖励；0：不奖励；1：奖励；
          isAllianceAward: true,//加盟商是否奖励；0：不奖励；1：奖励；
          promoterRewardTwo: '',//推广奖励,不设置的话就取字典promoter_reward_two作为默认值
          // sendVipMemberGradeId: '',//赠送vip等级id
          buyVipMemberGradeId: [],//限制购买的会员等级，等级id逗号隔开
          participation: '',//礼包分红
          // isPreposition: true,//是否有前置礼包；0：无 false；1：有 true
          // prepositionMarketingGiftBag: '',//前置礼包的id
          selectDateToTime: '',//礼包发行时间(未解析)
          modeDistribution:'0',//分配方式：0：按代理比例分配；1：按礼包比例分配
          allocationModel:'0',//分钱模式；0：按加盟商比例分配；1：按礼包比例分配
          proviceAward:0,//省代
          cityAward:0,//市代
          towmAward:0,//区县代

        },

        //会员等级列表
        vipList: [],
        columnsWidth,
        popPart: 1,
        ShowPopUp: false,
        //兑换券列表表头
        exchangeCertificateListComumns,
        //兑换券列表数据
        exchangeCertificateListDatas: [],
        //优惠券列表表头
        couponListColumns,
        //优惠券列表数据
        couponListData: [],
        //礼品上架门店表头
        upperStoreColumns,
        //礼品上架列表数据
        upperStoreDatas: [],
        //礼包列表表头
        giftBagColumns,
        //礼包列表数据
        giftBagData: [],
        //弹窗表头
        popUpColumns: [],
        //弹窗数据
        popUpData: [],
        //弹窗名称
        popName: '',
        pageSize: 5,
        total: 5,
        //礼包发行时间
        // selectDateToTime: '',

        //弹窗表格加载
        tableloading: false,

        //1 添加  2 编辑
        part: '1',
        //请求页码
        pageNo: 1,
        //弹窗所有数据
        popUpAllData: '',
        storeAllData: '',//门店所有数据
        discoountAllData: '',//选择优惠券所有数据
        certificateAllData: '',//选择兑换券所有数据
        giftBagAllData: '',//礼包所有数据
        plainOptions: ['普通会员', 'vip会员'],

        //日期选择器返现参数
        dateFormat: 'YYYY-MM-DD',
        selectedRowKeys: [], // Check here to configure the default column
        certificateSelectedRowKeys: [],
        discountRowKeys: [],
        storeSelectedRowKeys: [],
        giftBagSelectedRowKeys: [],
        userRestrictDictOptions: [],
        vipPrivilegeChangeValueDisabled: false,//vip特权选择值（交互用）
        buyLimitChangeValueDisabled: true,//购买限制选择值（交互用）
        firstDLFPCanInput:false,
        //接口配置
        url: {
          //选择兑换券弹窗列表(传入字段 certificateName )
          exchangeCertificatePopUpList: '/marketingCertificate/marketingCertificate/findCertificateVO',
          //选择优惠券弹窗列表(传入字段 discoountName)
          CouponPopupList: '/marketingDiscount/marketingDiscount/findMarketingDiscountVO',
          //选择门店弹窗列表(传入字段 storeName)
          storePopUpList: '/storeManage/storeManage/findStoreManage',
          //添加
          add: '/marketingGiftBagBatch/marketingGiftBagBatch/add',
          //编辑
          edit: '/marketingGiftBagBatch/marketingGiftBagBatch/edit',
          //兑换券返显
          findCertificateById: '/marketingGiftBag/marketingGiftBag/findCertificateById',
          //优惠券返显
          findDiscountById: '/marketingGiftBag/marketingGiftBag/findDiscountById',
          //门店返显
          findStoreById: 'marketingGiftBagStoreBatch/marketingGiftBagStoreBatch/findGiftBagStoreById',
          //礼包内容返显(需传入礼包id)
          queryById: '/marketingGiftBagStoreBatch/marketingGiftBagStoreBatch/findGiftBagStoreById',
          //返回会员等级
          findMemberGradeList: 'memberGrade/memberGrade/findMemberGradeList',
          //前置礼包弹窗
          isPrepositionList: 'marketingGiftBag/marketingGiftBag/isPrepositionList'//查询字段:id ,giftName, startTime_begin ,endTime_end ,createTime_begin ,createTime_end
        },
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.form.setFieldsValue(this.AllData)
      }, 800)
    },
    components: {
      AppMarketingCertificateGoodModal,
      AppMarketingGoodModal
    },
    async created() {
      const token = Vue.ls.get('Access-Token')
      this.headers = { 'X-Access-Token': token }
      let that = this
      let part = this.$route.query.part ? this.$route.query.part : '1'
      let AddMarketingGiftbagPurchaseData = localStorage.getItem('AddMarketingGiftbagPurchaseData')

      this.part = part
      this.tableloading = true
      //会员等级返显
      await this.findMemberGradeList()
      if (part == 2 && AddMarketingGiftbagPurchaseData) {
        //编辑
        AddMarketingGiftbagPurchaseData = JSON.parse(AddMarketingGiftbagPurchaseData)
        this.id = AddMarketingGiftbagPurchaseData ? (AddMarketingGiftbagPurchaseData.id )|| '' : ''
        AddMarketingGiftbagPurchaseData.viewScope = AddMarketingGiftbagPurchaseData.viewScope * 1
        // AddMarketingGiftbagPurchaseData.vipPrivilege = AddMarketingGiftbagPurchaseData.vipPrivilege * 1
        AddMarketingGiftbagPurchaseData.isAgencyAward = AddMarketingGiftbagPurchaseData.isAgencyAward == 1 ? true : false
        AddMarketingGiftbagPurchaseData.isAllianceAward = AddMarketingGiftbagPurchaseData.isAllianceAward == 1 ? true : false
        // AddMarketingGiftbagPurchaseData.isPreposition = AddMarketingGiftbagPurchaseData.isPreposition == 1 ? true : false
        this.handleChangeModeDistribution({
          target:{
            value:AddMarketingGiftbagPurchaseData.modeDistribution
          }
        })
        if (AddMarketingGiftbagPurchaseData.buyLimit) {
          AddMarketingGiftbagPurchaseData.buyLimit = AddMarketingGiftbagPurchaseData.buyLimit.split(',')
          if (AddMarketingGiftbagPurchaseData.buyLimit.indexOf('1') != -1) {
            this.buyLimitChangeValueDisabled = false
          } else {
            this.buyLimitChangeValueDisabled = true
          }
        } else {
          AddMarketingGiftbagPurchaseData.buyLimit = []
        }
        if (!AddMarketingGiftbagPurchaseData.buyVipMemberGradeId) {
          AddMarketingGiftbagPurchaseData.buyVipMemberGradeId = []
        } else {
          AddMarketingGiftbagPurchaseData.buyVipMemberGradeId = AddMarketingGiftbagPurchaseData.buyVipMemberGradeId.split(',')
        }
        // this.vipPrivilegeChangeValueDisabled = AddMarketingGiftbagPurchaseData.vipPrivilege == 1
        // this.selectDateToTime
        AddMarketingGiftbagPurchaseData.selectDateToTime = AddMarketingGiftbagPurchaseData.startTime && AddMarketingGiftbagPurchaseData.endTime ? [moment(AddMarketingGiftbagPurchaseData.startTime, this.dateFormat), moment(AddMarketingGiftbagPurchaseData.endTime, this.dateFormat)] : ''
        this.AllData = AddMarketingGiftbagPurchaseData
        let info = {
          pageNo: this.pageNo,
          pageSize:10,
          id: AddMarketingGiftbagPurchaseData.id,
          // id: AddMarketingGiftbagPurchaseData.prepositionMarketingGiftBag || ''
        }
        if (AddMarketingGiftbagPurchaseData.mainPicture) {
          let mainPicture = Object.values(JSON.parse(AddMarketingGiftbagPurchaseData.mainPicture))
          let mainPicturesSz = []
          //主图返显
          for (let a = 0; a < mainPicture.length; a++) {
            let obj = {
              uid: a,
              url: this.configure.imgErver + '/' + mainPicture[a],
              response: {
                message: mainPicture[a]
              }
            }
            mainPicturesSz.push(obj)
          }
          this.mainPictureFileList = mainPicturesSz
        }

        if (AddMarketingGiftbagPurchaseData.giftDeals) {
          let giftDeals = Object.values(JSON.parse(AddMarketingGiftbagPurchaseData.giftDeals))
          let giftDealsSz = []
          //详情图返显
          for (let a = 0; a < giftDeals.length; a++) {
            let obj = {
              uid: a,
              url: this.configure.imgErver + '/' + giftDeals[a],
              response: {
                message: giftDeals[a]
              }
            }
            giftDealsSz.push(obj)
          }
          this.giftDealsFileList = giftDealsSz

        }

        if (AddMarketingGiftbagPurchaseData.coverPlan) {
          let coverPlan = Object.values(JSON.parse(AddMarketingGiftbagPurchaseData.coverPlan))
          let coverPlanSz = []
          //分享图返显
          for (let a = 0; a < coverPlan.length; a++) {
            let obj = {
              uid: a,
              url: this.configure.imgErver + '/' + coverPlan[a],
              response: {
                message: coverPlan[a]
              }
            }
            coverPlanSz.push(obj)
          }
          this.coverPlanFileList = coverPlanSz
        }

        if (AddMarketingGiftbagPurchaseData.posters) {
          let posters = Object.values(JSON.parse(AddMarketingGiftbagPurchaseData.posters))
          let postersSz = []
          //海报图返显
          for (let a = 0; a < posters.length; a++) {
            let obj = {
              uid: a,
              url: this.configure.imgErver + '/' + posters[a],
              response: {
                message: posters[a]
              }
            }
            postersSz.push(obj)
          }
          this.postersFileList = postersSz
        }
        //兑换券返显
        // getAction(that.url.findCertificateById, info).then((res) => {
        //   if (res.success) {
        //     let sz = []
        //     for (let item of res.result.records) {
        //       sz.push(item.id)
        //     }
        //     this.exchangeCertificateListDatas = res.result.records
        //     this.certificateAllData = [...this.certificateAllData, ...res.result.records]
        //     this.certificateSelectedRowKeys = sz
        //     console.log('certificateSelectedRowKeys', sz)
        //   }
        // })
        //优惠券返显
        // getAction(that.url.findDiscountById, info).then((res) => {
        //   if (res.success) {
        //     let sz = []
        //     for (let item of res.result.records) {
        //       sz.push(item.id)
        //     }
        //     this.couponListData = res.result.records
        //     this.discoountAllData = [...this.discoountAllData, ...res.result.records]
        //     this.discountRowKeys = sz
        //     console.log('discountRowKeys', sz)
        //   }
        // })
        //门店返显
        getAction(that.url.findStoreById, info).then((res) => {
          if (res.success) {
            let sz = []
            for (let item of res.result.records) {
              item.logoAddr = this.configure.imgErver + '/' + item.logoAddr
              sz.push(item.sysUserId)
            }
            this.storeAllData = [...this.storeAllData, ...res.result.records]
            this.upperStoreDatas = res.result.records
            this.storeSelectedRowKeys = sz
          }
        })
        //礼包内容返显 queryById
        // getAction(that.url.queryById, info).then((res) => {
        //   if (res.success) {
        //     console.log('礼包内容', res)
        //     let sz = [
        //       res.result.id
        //     ]
        //     this.giftBagAllData = [res.result]
        //     this.giftBagData = [res.result]
        //     this.giftBagSelectedRowKeys = sz
        //   }
        // })
      } else {
        // if (this.vipList.length > 0) {
        //   this.AllData.sendVipMemberGradeId = this.vipList[0].id
        // } else {
        //   this.AllData.sendVipMemberGradeId = ''
        // }
        this.AllData.buyVipMemberGradeId = []
      }
      this.initDictConfig()
      //选择兑换券弹窗列表
//       getAction(that.url.exchangeCertificatePopUpList).then((res) => {
//         if (res.success) {
//           let datas = res.result
//           this.popUpData = datas.records
//           this.certificateAllData = datas.records
//           datas.records.map((item, index) => {
//             item.key = item.id
// //            item['#'] = index + 1
//             item.validityType = 1
//             return item
//           })
//           for (let item of this.exchangeCertificateListComumns) {
//             item.width = columnsWidth
//           }
//           this.popUpColumns = this.exchangeCertificateListComumns
//           this.selectPagination.total = res.result.total
//           this.selectPagination.pageSize = res.result.size
//           this.$nextTick(() => {
//             this.tableloading = false
//           })
//           console.log('exchangeCertificatePopUpList', res)
//         }
//       })

    },
    methods: {
      moment,
      handleChangeModeDistribution(e){
        let value = e.target.value
        if(value == 1){
          this.firstDLFPCanInput = true
          this.AllData.isAgencyAward = false
          this.AllData.towmAward = 0
          this.AllData.cityAward = 0
          this.AllData.proviceAward = 0
        }else{
          this.firstDLFPCanInput = false
          this.AllData.isAgencyAward = true
          this.AllData.towmAward = ''
          this.AllData.cityAward = ''
          this.AllData.proviceAward = ''
        }
      },
      handleChangeAllocationModel(){

      },
      //适用商品弹窗(兑换券)
      showExchangeGoodInformation(id) {
        this.$refs.AppMarketingCertificateGoodModal.showModalVisible(id)
      },
      //适用商品弹窗（优惠券）
      showGoodInformation(id) {
        this.$refs.AppMarketingGoodModal.showModalVisible(id)
      },
      mainPictureUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.mainPicturePic = isLt2M
        return isLt2M
      },
      initDictConfig() {
        //初始化字典
        let part = this.$route.query.part ? this.$route.query.part : '1'
        let AddMarketingGiftbagPurchaseData = localStorage.getItem('AddMarketingGiftbagPurchaseData')
        if (!(part == 2 && AddMarketingGiftbagPurchaseData)) {
          initDictOptions('tear_config').then((res) => {
            let that = this
            if (res.success) {
              for (let item of res.result) {
                switch (item.title) {
                  case 'promoter_reward':
                    that.AllData.promoterReward = item.value.replace('%', '')//推广奖励,不设置的话就取字典promoter_reward作为默认值
                  case 'ownership_shops_reward':
                    that.AllData.ownershipShopsReward = item.value.replace('%', '')//归属店铺奖励,不设置的话就取字典ownership_shops_reward作为默认值
                  case 'channel_shops_reward':
                    that.AllData.channelShopsReward = item.value.replace('%', '')//归属店铺奖励,不设置的话就取字典ownership_shops_reward作为默认值
                  case 'promoter_reward_two':
                    that.AllData.promoterRewardTwo = item.value.replace('%', '')//推广奖励,不设置的话就取字典promoter_reward_two作为默认值
                }
              }
            }
          })
        }
        initDictOptions('member_type').then((res) => {
          if (res.success) {
            for (let item of  res.result) {
              item.label = item.title
            }
            this.plainOptions = res.result
          }
        })
      },
      giftDealsUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.giftDealsPic = isLt2M
        return isLt2M
      },
      coverPlanUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.coverPlanPic = isLt2M
        return isLt2M
      },
      postersUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
          this.$message.error('图片大小必须在2M以内!')
        }
        this.postersPic = isLt2M
        return isLt2M
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
        console.log(selectedRowKeys)
      },
      certificateHandleChange(value, key, column, dataSource) {
        const newData = [...this[dataSource]]
        const target = newData.filter(item => key === item.id)[0]
        if (target) {
          target[column] = value
          if (column == 'distributedAmount' && value <= 1) {
            target.validityType = 1
          }
          this[dataSource] = newData
        }
      },
      findMemberGradeList() {
        let that = this
        return new Promise((resolve, reject) => {
          getAction(that.url.findMemberGradeList).then((res) => {
            if (res.success && res.result) {
              for (let item of res.result) {
                item.label = item.gradeName
                item.value = item.id
              }
              that.vipList = res.result
              resolve('success')
            } else if (res.success && (!res.result || res.result.lenbth < 0)) {
              that.vipList = []
            } else {
              that.$message.warn(res.message)
              reject(res.message)
            }
          })
        })
      },
      onDelete(id, index) {
        let that = this
        let attributeName = [
          //兑换券
          {
            ids: 'certificateIds',
            data: 'exchangeCertificateListDatas',
            selectedRowKeys: 'certificateSelectedRowKeys'
          }, {
            //优惠券
            ids: 'discountIds',
            data: 'couponListData',
            selectedRowKeys: 'discountRowKeys'
          }, {
            //门店
            ids: 'storeIds',
            data: 'upperStoreDatas',
            selectedRowKeys: 'storeSelectedRowKeys'
          }, {
            //礼包
            ids: 'giftBagIds',
            data: 'giftBagData',
            selectedRowKeys: 'giftBagSelectedRowKeys'
          }
        ]
        //.....
        const dataSource = [...this[attributeName[index].data]]
        const selectedRowKeys = [...this[attributeName[index].selectedRowKeys]]
        this[attributeName[index].selectedRowKeys] = selectedRowKeys.filter(item => item !== id)
        this[attributeName[index].data] = dataSource.filter(item => (index == 2 ? item.sysUserId : item.id) !== id)
      },
      isPrepositionChange(e) {
        if (!e.target.checked && this.giftBagData.length > 0) {
          this.onDelete(this.giftBagData[0].id, 3)
        }
      },
      //vip特权变化（交互）
      // vipPrivilegeChange(e) {
      //   console.log(e)
      //   this.vipPrivilegeChangeValueDisabled = e.target.value
      //   if (e.target.value != 1 && this.vipList.length > 0) {
      //     this.AllData.sendVipMemberGradeId = this.vipList[0].id
      //   }
      // },
      //购买限制vip特权变化（交互）
      buyLimitOfGradeChange(checkedValues) {
        console.log(checkedValues)
        // checkedValues.indexOf('vip会员')
        if (checkedValues.length > 0 && checkedValues.indexOf('1') != -1) {
          this.buyLimitChangeValueDisabled = false
        } else {
          this.buyLimitChangeValueDisabled = true
          this.AllData.buyVipMemberGradeId = []
        }
      },
      PopUp(index = '-1', isSearch = 'false') {
        // this.selectedRowKeys = []
        this.popPart = index
        if (index == 3) {
          this.modalTableType = 'radio'
        } else {
          this.modalTableType = 'checkbox'
        }
        if (isSearch == 'false') {
          this.ShowPopUp = !this.ShowPopUp
          this.searchName = ''
          // this.certificateType = ''
          this.queryParam = {}
          this.search()
        } else {
          this.search(true)
        }
      },
      handleSelectTableChange(pagination) {
        console.log(pagination)
        this.selectPagination.current = pagination.current
        this.search()
      },
      search(clickSearch = false) {
        if (clickSearch) {
          this.selectPagination.current = 1
        }
        let index = this.popPart
        let that = this
        let Interface = [
          {
            columns: 'exchangeCertificateListComumns',
            url: 'exchangeCertificatePopUpList',
            selectedRowKeys: 'certificateSelectedRowKeys',
            popName: '兑换券',
            searchName: 'certificateName',
            allData: 'certificateAllData'
          }, {
            columns: 'couponListColumns',
            url: 'CouponPopupList',
            selectedRowKeys: 'discountRowKeys',
            popName: '优惠券',
            searchName: 'discoountName',
            allData: 'discoountAllData'
          }, {
            columns: 'upperStoreColumns',
            url: 'storePopUpList',
            selectedRowKeys: 'storeSelectedRowKeys',
            popName: '上架门店',
            searchName: 'storeName',
            allData: 'storeAllData'
          }, {
            // giftBagColumns
            columns: 'giftBagColumns',
            url: 'isPrepositionList',
            selectedRowKeys: 'giftBagSelectedRowKeys',
            popName: '礼包',
            searchName: 'giftBagName',
            allData: 'giftBagAllData'
          }
        ]
        if (index != '-1') {
          this.tableloading = true
          let requestOptions = Object.assign({}, this.selectPagination, { pageNo: this.selectPagination.current }, { [Interface[index].searchName]: this.searchName }, this.queryParam,{id:this.id})
          // if (index == '0') {
          //   requestOptions = Object.assign({}, requestOptions, { certificateType: this.certificateType })
          // }
          getAction(that.url[Interface[index].url], requestOptions).then((res) => {
            if (res.success) {
              let datas = res.result
              let popUpColumns = [...this[Interface[index].columns]]
              datas.records.map((item, index) => {
                item.key = item.id
                // item.operation = '删除'
                /*item['#'] = index + 1*/
                if (item.logoAddr) item.logoAddr = that.configure.imgErver + '/' + item.logoAddr
                return item
              })
              if (index == 0 || index == 1) {
                delete popUpColumns[popUpColumns.length - 1]
                delete popUpColumns[popUpColumns.length - 2]
                delete popUpColumns[popUpColumns.length - 3]
              }
              this.popUpColumns = popUpColumns
              this.$nextTick(() => {
                this.popUpData = datas.records
                // if (isSearch == 'false') {
                if (this[Interface[index].allData].length > 0) {
                  for (let item of datas.records) {
                    let canPush = true
                    for (let item2 of this[Interface[index].allData]) {
                      if (item2.id === item.id) {
                        canPush = false
                        break
                      }
                    }
                    if (canPush) {
                      this[Interface[index].allData].push(item)
                    }
                  }
                } else {
                  this[Interface[index].allData] = datas.records
                }
                // }

                this.selectPagination.total = res.result.total
                this.selectPagination.pageSize = res.result.size

                this.tableloading = false
                this.selectedRowKeys = this[Interface[index].selectedRowKeys]
                this.popName = Interface[index].popName
                console.log(this[Interface[index].selectedRowKeys])
              })
            }
          })
        }
      },
      //选择确定弹窗
      selectLineData() {
        let ids = this.selectedRowKeys,
          sz = []
        let attributeName = [
          {
            ids: 'certificateIds',
            data: 'exchangeCertificateListDatas',
            selectedRowKeys: 'certificateSelectedRowKeys',
            allData: 'certificateAllData'
          }, {
            ids: 'discountIds',
            data: 'couponListData',
            selectedRowKeys: 'discountRowKeys',
            allData: 'discoountAllData'
          }, {
            ids: 'storeIds',
            data: 'upperStoreDatas',
            selectedRowKeys: 'storeSelectedRowKeys',
            allData: 'storeAllData'
          }, {
            ids: 'giftBagIds',
            data: 'giftBagData',
            selectedRowKeys: 'giftBagSelectedRowKeys',
            allData: 'giftBagAllData'
          }
        ]

        for (let item of ids) {
          for (let item2 of this[attributeName[this.popPart].allData]) {
            if (item == (this.popPart == 2 ? item2.sysUserId : item2.id)) {
              item2.operation = '删除'
              item2.validityType = 1
              item2.distributedAmount = 1
              sz.push(item2)
            }
          }
        }
        if (this.popPart == 2) {
          this.AllData[attributeName[this.popPart].ids] = ids.join(',')
        }
        console.log(sz)
        this[attributeName[this.popPart].data] = sz
        this[attributeName[this.popPart].selectedRowKeys] = ids
        this.$nextTick(() => {
          this.selectedRowKeys = []
        })
        this.PopUp()
      },
      //上传主图
      mainPictureHandleCancel() {
        this.mainPicturePreviewVisible = false
      },
      mainPictureHandlePreview(file) {
        this.mainPicturePreviewImage = file.url || file.thumbUrl
        this.mainPicturePreviewVisible = true
      },
      mainPictureHandleChange({ fileList }) {
        this.mainPictureFileList = fileList
      },
      //上传详情图
      giftDealsHandleCancel() {
        this.giftDealsPreviewVisible = false
      },
      giftDealsHandlePreview(file) {
        this.giftDealsPreviewImage = file.url || file.thumbUrl
        this.giftDealsPreviewVisible = true
      },
      giftDealsHandleChange({ fileList }) {
        this.giftDealsFileList = fileList
      },
      //上传分享图
      coverPlanHandleCancel() {
        this.coverPlanPreviewVisible = false
      },
      coverPlanHandlePreview(file) {
        this.coverPlanPreviewImage = file.url || file.thumbUrl
        this.coverPlanPreviewVisible = true
      },
      coverPlanHandleChange({ fileList }) {
        this.coverPlanFileList = fileList
      },
      //上传海报图
      postersHandleCancel() {
        this.postersPreviewVisible = false
      },
      postersHandlePreview(file) {
        this.postersPreviewImage = file.url || file.thumbUrl
        this.postersPreviewVisible = true
      },
      postersHandleChange({ fileList }) {
        this.postersFileList = fileList
      },
      //确认提交事件
      sure() {
        let that = this
        this.form.validateFields((err, values) => {
          if (!this.mainPictureFileList || this.mainPictureFileList.length <= 0) {
            this.$message.warn('请上传礼包图片')
            return
          }
          if (!this.giftDealsFileList || this.giftDealsFileList.length <= 0) {
            this.$message.warn('请上传详情图')
            return
          }
          if (!this.coverPlanFileList || this.coverPlanFileList.length <= 0) {
            this.$message.warn('请上传分享图')
            return
          }

          // if (isEmpty(this.AllData.distributionCommission)) {
          //   this.$message.warn('请设置分销佣金的分销佣金')
          //   return
          // }
          if (isEmpty(this.AllData.promoterReward)) {
            this.$message.warn('请设置分销佣金的一级推广奖励')
            return
          }
          if (isEmpty(this.AllData.promoterRewardTwo)) {
            this.$message.warn('请设置分销佣金的二级推广奖励')
            return
          }
          if (isEmpty(this.AllData.ownershipShopsReward)) {
            this.$message.warn('请设置分销佣金的归属店铺奖励')
            return
          }
          if (isEmpty(this.AllData.channelShopsReward)) {
            this.$message.warn('请设置分销佣金的渠道店铺奖励')
            return
          }
          // if (this.vipList && this.vipList.length > 0) {
            // if (this.giftBagData.length <= 0 && this.AllData.isPreposition) {
            //   this.$message.warn('请选择前置礼包！')
            //   return
            // }
            // if (values.vipPrivilege == 1 && !this.AllData.sendVipMemberGradeId) {
            //   this.$message.warn('请选择vip特权的vip对应等级！')
            //   return
            // }
          // }
          if (values.viewScope != 1 && this.upperStoreDatas.length <= 0) {
            this.$message.warn('请选择指定门店！')
            return
          }
          if (!err) {
            this.AllData = Object.assign({}, this.AllData, values)
            let startTime = new Date(values.selectDateToTime[0]._d),
              endTime = new Date(values.selectDateToTime[1]._d)
            this.AllData.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
            this.AllData.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
            this.AllData.isAgencyAward = this.AllData.isAgencyAward ? '1' : '0'
            this.AllData.isAllianceAward = this.AllData.isAllianceAward ? '1' : '0'
            // this.AllData.isPreposition = this.AllData.isPreposition ? '1' : '0'
            if (this.AllData.buyVipMemberGradeId && this.AllData.buyVipMemberGradeId.length > 0) {
              this.AllData.buyVipMemberGradeId = this.AllData.buyVipMemberGradeId.join(',')
            } else {
              this.AllData.buyVipMemberGradeId = ''
            }
            if (this.AllData.buyLimit) {
              this.AllData.buyLimit = this.AllData.buyLimit.join(',')
            }
            // this.AllData.certificateIds = this.certificateSelectedRowKeys.join(',')
            // this.AllData.discountIds = this.discountRowKeys.join(',')
            this.AllData.storeIds = this.storeSelectedRowKeys.join(',')
            // this.AllData.prepositionMarketingGiftBag = this.giftBagSelectedRowKeys.length > 0 ? this.giftBagSelectedRowKeys[0] : ''
            let mainPictureFileList = {}
            let giftDealsFileList = {}
            let coverPlanFileList = {}
            let postersFileList = {}
            for (let count = 0; count < this.mainPictureFileList.length; count++) {
              mainPictureFileList[count] = this.mainPictureFileList[count].response.message
            }
            for (let count = 0; count < this.giftDealsFileList.length; count++) {
              giftDealsFileList[count] = this.giftDealsFileList[count].response.message
            }
            for (let count = 0; count < this.coverPlanFileList.length; count++) {
              coverPlanFileList[count] = this.coverPlanFileList[count].response.message
            }
            for (let count = 0; count < this.postersFileList.length; count++) {
              postersFileList[count] = this.postersFileList[count].response.message
            }
            this.AllData.mainPicture = JSON.stringify(mainPictureFileList)
            this.AllData.giftDeals = JSON.stringify(giftDealsFileList)
            this.AllData.coverPlan = JSON.stringify(coverPlanFileList)
            this.AllData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersFileList) : ''
            //兑换券列表数据处理
            // if (this.exchangeCertificateListDatas.length > 0) {
            //   let szs = []
            //   for (let item of this.exchangeCertificateListDatas) {
            //     let obj = {
            //       id: item.id,
            //       validityType: item.validityType,
            //       distributedAmount: item.distributedAmount
            //     }
            //     szs.push(obj)
            //   }
            //   this.AllData.certificateIds = JSON.stringify(szs)
            // }
            //优惠券列表数据处理
            // if (this.couponListData.length > 0) {
            //   let szs = []
            //   for (let item of this.couponListData) {
            //     let obj = {
            //       id: item.id,
            //       validityType: item.validityType,
            //       distributedAmount: item.distributedAmount
            //     }
            //     szs.push(obj)
            //   }
            //   this.AllData.discountIds = JSON.stringify(szs)
            // }
            delete that.AllData.selectDateToTime;
            if (this.part == 2) {
              //编辑
              putAction(that.url.edit, that.AllData)
                .then(res => {
                  if (res.success) {
                    that.$message.success('成功！')
                    that.$router.push('/marketing/MarketingGiftBagBatchList')
                  } else {
                    that.$message.warn('失败')
                  }
                })
                .catch(err => {
                  that.$message.warn('失败')
                })
            } else {
              postAction(that.url.add, that.AllData)
                .then(res => {
                  if (res.success) {
                    that.$message.success('成功！')
                    that.$router.push('/marketing/MarketingGiftBagBatchList')
                  } else {
                    that.$message.warn('失败')
                  }
                })
                .catch(err => {
                  that.$message.warn('失败')
                })
            }
          }
        })

      },
      //查询

      //礼包上架门店
      rackGiftChange(e) {
        let value = e.target.value
        this.AllData.viewScope = value
        if (value == 1) {
          this.upperStoreDatas = []
          this.storeSelectedRowKeys = []
        }
      }
    },
    computed: {
      uploadAction() {
        return this.configure.fileUpload
      },
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          type: this.modalTableType,
          selections: [
            {
              key: 'all-data',
              text: 'Select All Data',
              onSelect: () => {
                this.selectedRowKeys = [...Array(46).keys()] // 0...45
              }
            }
          ],
          onSelection: this.onSelection
        }
      }
    }
  }
</script>
<style lang="less">
  /*.fxyj {*/
  /*  > div {*/
  /*    margin-right: 20px;*/
  /*  }*/
  /*}*/
  .fxyjwrap {
    background: #F2F2F2;
    width: 100%;
    padding:20px 10px;
    /*>div:last-child{*/
    /*  margin: 0;*/
    /*}*/
    >div{
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      > div {
        display: flex;
        align-items: center;
        width: 25%;
        /*justify-content: center;*/
      }
    }

  }

  .AddMarketingGiftbagPurchaseModel {
    background: white;

    .el-dialog {
      -webkit-backface-visibility: hidden;
    }

    .operation {
      color: rgb(24, 144, 255);
      cursor: pointer;
    }

    .title {
      font-size: 16px;
      font-weight: 700;
      padding: 25px;
    }

    .wrap {
      margin-top: 30px;

      .Discount {
        input {
          width: 75px;
          margin: 0 15px;
        }
      }

      .attention {
        margin-top: 10px;
        width: 1080px;
        font-size: 13px;
        line-height: 34px;
        padding: 0 20px;
        color: black;
        background: rgb(204, 235, 255);
        border: 1px solid rgb(0, 153, 255);
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
      }
    }

    .button-operation {
      display: flex;
      justify-content: space-between;
      width: 200px;
      margin: 0 auto;
      padding-bottom: 20px;

      button {
        width: 80px;
      }
    }

    .button-end {
      margin-bottom: 40px;
      border-bottom: 1px solid gray;
    }

    /*.popUp {*/
    /*  position: fixed;*/
    /*  width: 100vw;*/
    /*  height: 100vh;*/
    /*  top: 0;*/
    /*  left: 0;*/
    /*  z-index: 999;*/
    /*  background: rgba(0, 0, 0, 0.3);*/

    /*  .pop-wrap {*/
    /*    !*margin: 0 auto;*!*/
    /*    !*margin-top: 5vh;*!*/
    /*    !*width: 70%;*!*/
    /*    !*background: white;*!*/
    /*    font-size: 12px;*/

    /*    .title {*/
    /*      width: 100%;*/
    /*      height: 50px;*/
    /*      display: flex;*/
    /*      justify-content: space-between;*/
    /*      padding: 0 5px 0 20px;*/
    /*      align-items: center;*/
    /*      border-bottom: 1px solid gray;*/

    /*      span:nth-child(2) {*/
    /*        padding: 15px;*/
    /*        cursor: pointer;*/
    /*      }*/
    /*    }*/
    /*  }*/

    /*  */
    /*}*/

    .operation {
      color: rgb(24, 144, 255);
      cursor: pointer;
      margin-bottom: 0
    }
  }

  #cnt {
    input {
      width: 120px;
    }

    .title2 {
      display: flex;
      justify-content: space-between;
    }

    .info {
      margin-top: 15px;
      float: right;
      min-width: 250px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
</style>