<!--兑换券新增编辑页面-->
<template>
  <a-card class="AddMarketingCertificateModel" ref="AddMarketingCertificateModel">
    <div class="title">{{ part == 2 ? '编辑' : '添加' }}券</div>
    <div class="wrap">
      <a-form :form="form">
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="兑换券名称">
          <!--          v-model="AllData.name"-->
          <a-input
            placeholder="请输入兑换券名称,字数不超过50个字"
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入兑换券名称' }, { max: 50, message: '字数不能超过50个字' }]
              }
            ]"
          />
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          label="主图"
          validate-status="error"
          help="尺寸800*800 支持jpg、jpeg、png格式，大小不超过2M"
        >
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
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="mainPicturePreviewVisible" @cancel="mainPictureHandleCancel">
            <img :src="mainPicturePreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          label="分享图"
          validate-status="error"
          help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
        >
          <a-upload
            :action="uploadAction"
            :beforeUpload="diagramFileUpload"
            :fileList="diagramFileList"
            :headers="headers"
            @change="diagramHandleChange"
            @preview="diagramHandlePreview"
            listType="picture-card"
          >
            <div v-if="diagramFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="diagramPreviewVisible" @cancel="diagramHandleCancel">
            <img :src="diagramPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>
        <a-form-item
          :label-col="labelCol"
          :wrapper-col="{ span: 12 }"
          label="海报图"
          validate-status="error"
          help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果。"
        >
          <a-upload
            :action="uploadAction"
            :beforeUpload="postersFileUpload"
            :fileList="postersFileList"
            :headers="headers"
            @change="postersHandleChange"
            @preview="postersHandlePreview"
            listType="picture-card"
          >
            <div v-if="postersFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :footer="null" :visible="postersPreviewVisible" @cancel="postersHandleCancel">
            <img :src="postersPreviewImage" alt="example" style="width: 100%" />
          </a-modal>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 18 }" label="用券时间">
          <!--          v-model="AllData.vouchersWay"-->
          <a-radio-group
            @change="useCouponTime"
            style="display: flex;align-items: center;flex-wrap: wrap;"
            v-decorator="['vouchersWay', { rules: [{ required: true, message: '请选择用券时间' }] }]"
          >
            <a-radio :value="0" style="margin: 10px;">
              <!--                :defaultValue="AllData.startTime&&AllData.startTime?[moment(AllData.startTime, dateFormat), moment(AllData.endTime, dateFormat)]:''"-->
              <a-range-picker :disabled="AllData.vouchersWay != 0" v-model="selectDateToTime" />
            </a-radio>
            <a-radio :value="1" style="margin: 10px;">
              领券当日起
              <a-input :disabled="AllData.vouchersWay != 1" style="width: 75px;" v-model="AllData.today" />
              <a-select
                :disabled="AllData.vouchersWay != 1"
                style="width: 120px;margin-left: 10px;"
                v-model="AllData.monad"
              >
                <a-select-option value="天">
                  天
                </a-select-option>
                <a-select-option value="周">
                  周
                </a-select-option>
                <a-select-option value="月">
                  月
                </a-select-option>
              </a-select>
              内可用
            </a-radio>
            <a-radio :value="2" style="margin: 10px;">
              领券次日起
              <a-input :disabled="AllData.vouchersWay != 2" style="width: 75px;" v-model="AllData.tomorow" />
              <a-select
                :disabled="AllData.vouchersWay != 2"
                style="width: 120px;margin-left: 10px;"
                v-model="AllData.monad"
              >
                <a-select-option value="天">
                  天
                </a-select-option>
                <a-select-option value="周">
                  周
                </a-select-option>
                <a-select-option value="月">
                  月
                </a-select-option>
              </a-select>
              内可用
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 20 }" label="兑换商品">
          <!--          <span slot="label">-->
          <!--          <span class="dataCheckedStar">-->
          <!--            *-->
          <!--          </span>-->
          <!--          兑换商品-->
          <!--        </span>-->
          <a-button @click="PopUp(1)">
            选择商品
          </a-button>
          <!--          :scroll="{ x: 1500, y: 300 }"-->
          <a-alert
            :closable="true"
            class="attention"
            message="重要提示：持有此兑换券的用户将可以兑换以下商品，请谨慎选择兑换商品。"
          />
          <a-table
            :columns="exchangeStoreColumns"
            :dataSource="exchangeStoreData"
            :pagination="{ pageSize: 5 }"
            bordered
            style="margin-top: 20px;"
            :scroll="{ x: 2200 }"
            :rowKey="record => record.id"
          >
            <template slot="mainPicture" slot-scope="text">
              <img :src="text" alt=" " style="width: 100px;height: 100px;" />
            </template>
            <template slot="name" slot-scope="text, record">
              {{ text || record.username }}
            </template>
            <template slot="quantity" slot-scope="text, record">
              <a-input-number
                :min="1"
                :precision="0"
                v-model="record.quantity"
                @change="value => recordHandleChange(value, record.id, 'quantity', 'exchangeStoreData')"
              >
              </a-input-number>
            </template>
            <template slot="goodSpecificationId" slot-scope="text, record">
              <a-select
                v-model="record.goodSpecificationId"
                style="width: 120px"
                @change="value => recordHandleChange(value, record.id, 'goodSpecificationId', 'exchangeStoreData')"
                @focus="recordHandleFocus(record)"
              >
                <a-select-option value="">
                  请选择
                </a-select-option>
                <a-select-option
                  :value="item.goodSpecificationId"
                  v-for="(item, index) in record.goodSpecificationIdOptions"
                  :key="item.specification + item.goodSpecificationId"
                >
                  {{ item.specification }}
                </a-select-option>
              </a-select>
            </template>

            <template slot="canMonth" slot-scope="text, record">
              <a-select
                v-model="record.canMonth"
                style="width: 120px"
                @change="value => recordHandleChange(value, record.id, 'canMonth', 'exchangeStoreData')"
              >
                <a-select-option value="0">
                  不限
                </a-select-option>
                <a-select-option value="1">
                  一月
                </a-select-option>
                <a-select-option value="2">
                  二月
                </a-select-option>
                <a-select-option value="3">
                  三月
                </a-select-option>
                <a-select-option value="4">
                  四月
                </a-select-option>
                <a-select-option value="5">
                  五月
                </a-select-option>
                <a-select-option value="6">
                  六月
                </a-select-option>
                <a-select-option value="7">
                  七月
                </a-select-option>
                <a-select-option value="8">
                  八月
                </a-select-option>
                <a-select-option value="9">
                  九月
                </a-select-option>
                <a-select-option value="10">
                  十月
                </a-select-option>
                <a-select-option value="11">
                  十一月
                </a-select-option>
                <a-select-option value="12">
                  十二月
                </a-select-option>
              </a-select>
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                @confirm="() => onDeleteShop(record.id)"
                title="确定要删除吗?"
                v-if="exchangeStoreData.length"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
          <div>
            已选择商品共计{{ exchangeStoreData.length }}件
            <!--            <span style="color: red;margin-left: 20px">-->
            <!--            当前选取的商品库存低于发行总量，请补充库存后再发券。-->
            <!--            </span>-->
          </div>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="发放总量">
          <!--          v-model="AllData.total"-->
          <a-input
            type="number"
            v-decorator="[
              'total',
              {
                rules: [
                  { required: true, message: '请输入发放总量' },
                  { pattern: /^[+]{0,1}(\d+)$/, message: '发放总量为正整数！' }
                ]
              }
            ]"
          />
          <!--          ,{validator: totalDetermine}-->
          <!--          编辑时仅能编辑剩余发行量，-->
          最大库存不能大于兑换商品库存，若商品库存不足请及时联系供应商补货，请谨慎设置
        </a-form-item>
        <a-form-item label="兑换方式" :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <a-radio-group v-decorator="['certificateType', { rules: [{ required: true, message: '请选择兑换方式' }] }]">
            <a-radio :style="radioStyle" value="1">可兑换的商品任选一个</a-radio>
            <a-radio :style="radioStyle" value="0">可兑换的商品全部兑换</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 20 }" label="核销门店">
          <!--          v-model="AllData.rewardStore"-->
          <a-radio-group
            @change="rewardStoreChange"
            v-decorator="['rewardStore', { rules: [{ required: true, message: '请选择核销门店' }] }]"
          >
            <a-radio :style="radioStyle" :value="0"> 全平台</a-radio>
            <a-radio :style="radioStyle" :value="1" style="margin-right: 150px;">指定门店</a-radio>
          </a-radio-group>
          <a-button :disabled="AllData.rewardStore == 0" @click="PopUp(2)">
            选择核销门店
          </a-button>
          <a-alert
            :closable="true"
            class="attention"
            message="重要提示：兑换券支持线上直接兑换，若要线下核销请指定核销门店。"
          />
          <a-table
            :columns="cancelStoresColumns"
            :dataSource="cancelStoresData"
            :pagination="{ pageSize: 5 }"
            bordered
            style="margin-top: 20px;"
          >
            <template slot="logoAddr" slot-scope="text">
              <img :src="text" alt="" style="width: 100px;height: 100px;" />
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                @confirm="() => onDeleteStore(record.id)"
                title="确定要删除吗?"
                v-if="cancelStoresData.length"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>
          </a-table>
          <div v-if="AllData.rewardStore == 0">
            已选择全平台门店可以核销
          </div>
          <div v-if="AllData.rewardStore == 1">已选择{{ cancelStoresData.length }}个核销门店</div>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="券类型">
          <!--          v-model="AllData.isNomal"-->
          <a-radio-group
            @change="couponClassification"
            v-decorator="['isNomal', { rules: [{ required: true, message: '请选择券类型' }] }]"
          >
            <a-radio :style="radioStyle" :value="0"> 活动券</a-radio>
            <a-radio :style="radioStyle" :value="1" style="margin-right: 150px;">付费券</a-radio>
          </a-radio-group>
          市场价
          <a-input :disabled="AllData.isNomal == 0" style="width: 75px;margin: 0 10px;" v-model="AllData.marketPrice" />
          元 销售价
          <a-input :disabled="AllData.isNomal == 0" style="width: 75px;margin: 0 10px;" v-model="AllData.price" />
          元 成本价
          <a-input :disabled="AllData.isNomal == 0" style="width: 75px;margin: 0 10px;" v-model="AllData.costPrice" />
          元 推广佣金
          <a-input
            :disabled="AllData.isNomal == 0"
            style="width: 75px;margin: 0 10px;"
            v-model="AllData.promoteCommission"
          />
          元
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <span slot="label">
            <!--          <span class="dataCheckedStar">-->
            <!--            *-->
            <!--          </span>-->
            核销限制
          </span>
          <a-checkbox v-model="AllData.sellRewardStore"
            >仅销售店铺可核销（有记录到销售店铺则该券仅销售店铺可核销）</a-checkbox
          >
          <a-checkbox v-model="AllData.rewardDayOne">同一家店同一天仅能核销1次</a-checkbox>
        </a-form-item>

        <!-- <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }">
          <span slot="label">
            <span class="dataCheckedStar">*</span>
            核销支持方式
          </span>
          <a-checkbox v-model="AllData.aboveUse">线上核销</a-checkbox>
          <a-checkbox v-model="AllData.belowUse">线下核销</a-checkbox>
        </a-form-item>
      -->

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="核销支持方式">
          <a-checkbox-group  :options="aboveBelowUse" v-decorator="['aboveBelowUseDe', { rules: [{ required: true, message: '请选择核销支持方式' }] }]"/>
        </a-form-item>





        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" label="核销奖励">
          <!--          v-model="AllData.theReward"-->
          <a-input
            type="number"
            v-decorator="[
              'theReward',
              {
                rules: [
                  { required: true, message: '请输入核销奖励' },
                  {
                    pattern: /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/,
                    message: '请填写正确的金额'
                  }
                ]
              }
            ]"
          />
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="使用人限制">
          <!--          v-model="AllData.userRestrict"-->
          <a-checkbox-group
            :options="plainOptions"
            v-decorator="['userRestrict', { rules: [{ required: true, message: '请选择使用人限制' }] }]"
          />
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="赠送设置">
          <!--          v-model="AllData.isGive"-->
          <a-radio-group v-decorator="['isGive', { rules: [{ required: true, message: '请选择赠送设置' }] }]">
            <a-radio :style="radioStyle" :value="0">不支持</a-radio>
            <a-radio :style="radioStyle" :value="1">支持</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special" label="过期提醒">
          <!--          v-model="AllData.isWarn"-->
          <a-radio-group
            @change="expiredReminder"
            v-decorator="['isWarn', { rules: [{ required: true, message: '请选择过期提醒' }] }]"
          >
            <a-radio :style="radioStyle" :value="1">
              过期前
              <a-input :disabled="AllData.isWarn == 0" style="width: 75px;margin: 0 10px;" v-model="AllData.warnDays" />
              天
            </a-radio>
            <a-radio :style="radioStyle" :value="0">
              不提醒
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label-col="labelCol" :wrapper-col="{ span: 12 }" class="line-special-second" label="券说明">
          <JEditor v-model="AllData.discountExplain"> </JEditor>
          <!-- <a-textarea :rows="4" placeholder="券说明能让用户更加了解券" v-model="AllData.discountExplain" /> -->
        </a-form-item>
        <!-- <a-form-item :label-col="labelCol" :wrapper-col="{ span: 1 }" label="排序">
          <a-input
            type="number"
            v-decorator="[
              'sort',
              {
                rules: [
                  { required: true, message: '请输入排序默认为0' },
                  { pattern: /^[+]{0,1}(\d+)$/, message: '必须为正整数！' }
                ]
              }
            ]"
          />
        </a-form-item> -->
      </a-form>
    </div>
    <div class="button-end"></div>
    <div class="button-operation">
      <a-button>
        取消
      </a-button>
      <a-button @click="sure" type="primary">
        确认
      </a-button>
    </div>

    <a-modal title="选择商品" :visible="ShowPopUp" :width="1500" :title="modalTitle" :footer="null" @cancel="PopUp">
      <!--      @ok="handleOk"-->
      <!--      @cancel="handleCancel"-->
      <div class="AddMarketingCertificateModel-pop-wrap">
        <div class="cnt">
          <div class="title2">
            <!--<div>
              {{part == 1 ? '商品' : '分类'}}名称：
              <a-input v-model="searchName"/>
            </div>-->
            <div v-if="popPart == 1">
              商品名称:
              <a-input v-model="searchName" />
            </div>
            <div v-if="popPart == 1">
              商品分类：
              <a-select
                v-model="queryParam.goodTypeIdOne"
                placeholder="请选择"
                @change="chooseMedicine"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType" :value="item.id">{{ item.name }}</a-select-option>
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdTwo"
                placeholder="请选择"
                @change="chooseMedicine1"
                style="width:100px;margin-right: 10px;"
                ><!--v-model="id"-->
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType1" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType1.length>0?listGoodType1[0].name : ''"-->
              </a-select>
              <a-select
                v-model="queryParam.goodTypeIdThree"
                placeholder="请选择"
                style="width:100px;margin-right: 10px;"
              >
                <a-select-option value="">请选择</a-select-option>
                <a-select-option v-for="item in listGoodType2" :value="item.id">{{ item.name }}</a-select-option>
                <!--:defaultValue="listGoodType2.length>0?listGoodType2[0].name : ''"-->
              </a-select>
            </div>
            <div v-if="popPart == 1">
              供应商：
              <a-input  v-model="queryParam.realname"/>
            </div>
            <div v-if="popPart == 2">
              门店名称：
              <a-input v-model="storeName" />
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

            <a-button @click="search(true)" type="primary">
              查询
            </a-button>
          </div>
          <!--                   ,total:popPart==1?exchangeStorePopUpTotalPage:cancelStoresPopUpTotalPage-->
          <!--          :pagination="{pageSize:popPart==1?exchangeStorePopUpPageSize:cancelStoresPopUpPageSize}"-->
          <a-table
            :columns="popUpColumns"
            :dataSource="popUpData"
            :loading="tableLoading"
            :rowSelection="rowSelection"
            :scroll="{ x: columnsWidth * popUpColumns.length + columnsWidth, y: 300 }"
            bordered
            style="margin-top: 20px;"
            @change="handleSelectTableChange"
            :pagination="selectPagination"
          >
            <template :slot="popPart == 1 ? 'mainPicture' : 'logoAddr'" slot-scope="text">
              <img :src="text" alt="" style="width: 40px;height: 40px;" />
            </template>
          </a-table>
          <!--          border-bottom: 1px solid gray;-->
          <div class="bottom" style="height: 15px;"></div>
          <div class="info">
            <span> 已选{{ popPart == 1 ? '商品' : '门店' }}（{{ selectedRowKeys.length }}） </span>
            <a-button @click="PopUp">
              取消
            </a-button>
            <a-button @click="selectStoreSure" type="primary">
              确定
            </a-button>
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
    </a-modal>
  </a-card>
</template>
<script>
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import JEditor from '@/components/jeecg/JEditor'
import pick from 'lodash.pick'
import moment from 'moment'
import dayjs from 'dayjs'
import AInput from 'ant-design-vue/es/input/Input'
import Vue from 'vue'
const columnsWidth = 210
const cancelStoresColumns = [
  //    {
  //      title: '#',
  //      dataIndex: '#',
  //      align:'center'
  //    },
  {
    title: 'logo',
    dataIndex: 'logoAddr',
    scopedSlots: { customRender: 'logoAddr' },
    align: 'center'
  },
  {
    title: '门店名称',
    className: 'column-money',
    dataIndex: 'storeName',
    align: 'center'
  },
  {
    title: '分店名称',
    dataIndex: 'subStoreName',
    align: 'center'
  },
  {
    title: '所属城市',
    dataIndex: 'areaAddress',
    align: 'center'
  },
  {
    title: '门店地址',
    dataIndex: 'storeAddress',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    // className: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
const exchangeStorePopUpColumns = [
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品名称',
    className: 'column-money',
    dataIndex: 'goodName',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '商品分类',
    dataIndex: 'typeName',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '销售价',
    dataIndex: 'price',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    width: columnsWidth,
    align: 'center'
  },

  {
    title: '供货价',
    dataIndex: 'supplyPrice',
    width: columnsWidth,
    align: 'center'
  },

  {
    title: '会员价',
    dataIndex: 'vipPrice',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    width: columnsWidth,
    align: 'center'
  },

  {
    title: '供应商',
    dataIndex: 'name',
    width: columnsWidth,
    align: 'center'
  }
]
const exchangeStoreColumns = [
  /*{
      title: '#',
      dataIndex: '#',
      align:'center'
    },*/
  {
    title: '商品图片',
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    align: 'center',
    width: columnsWidth
  },
  {
    title: '商品名称',
    className: 'column-money',
    dataIndex: 'goodName',
    align: 'center'
  },
  {
    title: '商品分类',
    dataIndex: 'typeName',
    align: 'center'
  },
  {
    title: '规格',
    dataIndex: 'goodSpecificationId',
    align: 'center',
    scopedSlots: { customRender: 'goodSpecificationId' }
  },
  {
    title: '市场价',
    dataIndex: 'marketPrice',
    align: 'center'
  },
  {
    title: '销售价',
    dataIndex: 'price',
    align: 'center'
  },
  {
    title: '成本价',
    dataIndex: 'costPrice',
    align: 'center'
  },

  {
    title: '供货价',
    dataIndex: 'supplyPrice',
    align: 'center'
  },

  {
    title: '会员价',
    dataIndex: 'vipPrice',
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'repertory',
    align: 'center'
  },

  {
    title: '供应商',
    dataIndex: 'name',
    // username
    align: 'center',
    scopedSlots: { customRender: 'name' },
    width: columnsWidth
  },
  {
    title: '可兑换月份',
    dataIndex: 'canMonth',
    scopedSlots: { customRender: 'canMonth' },
    align: 'center'
  },
  {
    title: '可兑换数量',
    dataIndex: 'quantity',
    scopedSlots: { customRender: 'quantity' },
    align: 'center'
  },

  {
    title: '操作',
    dataIndex: 'operation',
    // className: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center'
  }
]
const cancelStoresPopUpColumns = [
  {
    title: 'logo',
    dataIndex: 'logoAddr',
    scopedSlots: { customRender: 'logoAddr' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '门店名称',
    className: 'column-money',
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
  }
]
export default {
  components: { AInput, JEditor },
  name: 'AddMarketingCertificateModel',
  data() {
    return {
      form: this.$form.createForm(this),
      queryParam: {
        goodTypeIdThree: '',
        goodTypeIdTwo: '',
        goodTypeIdOne: '',
        realname:'',
      },
      listGoodType: [],
      listGoodType1: [],
      listGoodType2: [],
      value2: 1,
      value3: 1,
      value4: 1,
      value5: 1,
      labelCol: { span: 2 },
      radioStyle: {
        height: '30px',
        lineHeight: '15px'
      },
      //查询table分页配置
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      headers: '',
      //主图 配置
      mainPictureFileList: [],
      mainPicturePreviewVisible: false,
      mainPicturePreviewImage: '',
      mainPicturePic: true,
      //推广图配置
      diagramFileList: [],
      diagramPreviewVisible: false,
      diagramPreviewImage: '',
      diagramFilePic: true,
      //海报图配置
      postersFileList: [],
      postersPreviewVisible: false,
      postersPreviewImage: '',
      postersFilePic: true,
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      //table加载
      tableLoading: false,
      //搜索名
      searchName: '',
      storeName: '',
      columnsWidth,
      //兑换商品列表表头
      exchangeStoreColumns,
      //兑换商品列表数据
      exchangeStoreData: [],
      //核销门店列表表头
      cancelStoresColumns,
      //核销门店列表数据
      cancelStoresData: [],
      //弹窗表头
      popUpColumns: '',
      //弹窗数据
      popUpData: '',
      //兑换商品弹窗表头
      exchangeStorePopUpColumns,
      //兑换商品弹窗数据
      exchangeStorePopUpDatas: [],
      //兑换商品弹窗全部数据
      exchangeStorePopUpAllDatas: [],
      //核销门店弹窗表头
      cancelStoresPopUpColumns,
      //核销门店弹窗数据
      cancelStoresPopUpData: [],
      //核销门店弹窗全部数据
      cancelStoresPopUpAllData: [],
      //兑换商品总共页码
      exchangeStorePopUpTotalPage: '',
      //兑换商品一页显示多少条,
      exchangeStorePopUpPageSize: '',
      //核销门店一页显示多少条
      cancelStoresPopUpPageSize: '',
      //核销门店总共页码
      cancelStoresPopUpTotalPage: '',
      //请求页码
      pageNo: 1,
      //开始结束时间未处理
      selectDateToTime: '',
      //日期选择器返现参数
      dateFormat: 'YYYY-MM-DD',
      selectedRowKeys: [], // Check here to configure the default column
      exchangeStoreSelectedRowKeys: [], //兑换商品keys
      cancelStoresSelectedRowKeys: [], //核销门店keys
      plainOptions: ['普通会员', 'VIP会员'],
      checkedList: ['普通会员', 'VIP会员'],
      aboveBelowUse: ['线上核销', '线下核销'], // 线上与线下的数据
      ShowPopUp: false,
      previewVisible1: false, //主图上传
      //判断是点击添加进入页面还是编辑   编辑 2 添加 1
      part: '1',
      //接口
      url: {
        add: '/marketingCertificate/marketingCertificate/add', //兑换券添加
        edit: '/marketingCertificate/marketingCertificate/edit', //兑换券编辑
        goodList: '/goodList/goodList/findGoodList', //新增兑换券商品列表
        storeList: '/storeManage/storeManage/findStoreManage', //新增兑换券门店核销列表
        findGoodByCertificateId: 'marketingCertificate/marketingCertificate/findGoodByCertificateId', //编辑兑换券-选择商品返显
        findStoreByCertificateId: 'marketingCertificate/marketingCertificate/findStoreByCertificateId', //编辑兑换券-核销门店返显
        getGoodSpecificationByGoodId: 'goodSpecification/goodSpecification/getGoodSpecificationByGoodId', //通过商品id获取规格id
        getgoodTypeListcascade: '/goodType/goodType/getgoodTypeListcascade',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      //弹窗类型 1选择商品  2.核销门店
      popPart: 1,
      AllData: {
        delFlag: '0', //删除状态
        name: '', //兑换券名称
        vouchersWay: 0, //用券时间方式
        startTime: '', //开始时间
        endTime: '', //结束时间
        today: '0', //当日起
        tomorow: '0', //次日起
        monad: '天', //单位
        total: '0', //发放总量
        theReward: '', //核销奖励
        userRestrict: ['普通会员', 'VIP会员'], //使用人限制
        isGive: '', //赠送设置
        isWarn: '', //是否过期提醒；0：不提醒；1：提醒
        warnDays: '0', //过期前多少天提醒
        goodListIds: '', //商品选择ids
        sysUserIds: '', //核销门店ids
        discountExplain: '', //券说明
        status: '1', //状态
        shopTotal: '', //商品总量
        certificateType: '1', //兑换方式
        rewardStore: '0', //核销门店: 0: 全平台 1:指定门店
        isNomal: '0', //券类型: 0:活动券 1:付费券
        marketPrice: '', //市场价
        price: '', //销售价
        costPrice: '', //成本价
        sellRewardStore: false, //仅销售店铺可核销（有记录到销售店铺则该券仅销售店铺可核销）
        rewardDayOne: false, //同一家店同一天仅能核销1次
        mainPictures: '',
        coverPlans: '',
        posters: '', //海报图
        sort: '', //排序
        promoteCommission: '', //推广佣金
        aboveUse: '0', //线上使用: 0 关闭 1开启
        belowUse: '0', //线下使用: 0 关闭 1开启
        aboveBelowUseDe: ['线上核销', '线下核销'], // 线上与线下的数据


      }
    }
  },

  methods: {
    moment,
    mainPictureUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.mainPicturePic = isLt2M
      return isLt2M
    },
    diagramFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.diagramFilePic = isLt2M
      return isLt2M
    },
    postersFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.postersFilePic = isLt2M
      return isLt2M
    },
    //用券时间单选框
    useCouponTime(e) {
      this.AllData.vouchersWay = e.target.value
    },
    //核销门店
    rewardStoreChange(e) {
      let value = e.target.value
      this.AllData.rewardStore = value
      if (value != 1) {
        this.cancelStoresData = []
        this.cancelStoresSelectedRowKeys = []
      }
    },
    //券类型单选框
    couponClassification(e) {
      this.AllData.isNomal = e.target.value
    },
    //过期提醒
    expiredReminder(e) {
      this.AllData.isWarn = e.target.value
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log(selectedRowKeys)
    },
    totalDetermine(rule, value, callback) {
      if (!this.exchangeStoreData || this.exchangeStoreData.length <= 0) {
        callback()
      } else if (this.exchangeStoreData.length > 0 && value) {
        let number = 0
        for (let item of this.exchangeStoreData) {
          number += item.repertory * 1
        }
        console.log(number)
        if (value > number) {
          callback('发放总量应小于兑换商品中所有商品的库存总量')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    recordHandleChange(value, key, column, dataSource) {
      const newData = [...this[dataSource]]
      const target = newData.filter(item => key === (item.key || item.id))[0]
      console.log(target)
      if (target) {
        target[column] = value
        if (column == 'goodSpecificationId') {
          if (!value) {
            target.marketPrice = '-'
            target.price = '-'
            target.costPrice = '-'
            target.supplyPrice = '-'
            target.vipPrice = '-'
            target.repertory = '-'
            this[dataSource] = newData
          } else {
            for (let item of target.goodSpecificationIdOptions) {
              if (item.goodSpecificationId == value) {
                target.marketPrice = item.marketPrice || '-'
                target.price = item.price || '-'
                target.costPrice = item.costPrice || '-'
                target.supplyPrice = item.supplyPrice || '-'
                target.vipPrice = item.vipPrice || '-'
                target.repertory = item.repertory || '-'
                this[dataSource] = newData
                break
              }
            }
          }
        } else {
          this[dataSource] = newData
        }
      }
    },
    recordHandleFocus(record, isOnload = false) {
      return new Promise(resolve => {
        const newData = [...this.exchangeStoreData]
        const target = newData.filter(item => record.id === item.key)[0]
        if (target && target.goodSpecificationIdOptions && target.goodSpecificationIdOptions.length > 0) return
        getAction(this.url.getGoodSpecificationByGoodId, { id: record.id }).then(res => {
          if (res.success) {
            if (!isOnload) {
              if (target) {
                target.goodSpecificationIdOptions = res.result
                this.exchangeStoreData = newData
              }
            } else {
              record.goodSpecificationIdOptions = res.result
            }
          }
          resolve()
        })
      })
    },
    handleSelectTableChange(pagination) {
      console.log(pagination)
      this.selectPagination.current = pagination.current
      this.search()
    },
    PopUp(index = '') {
      this.popPart = index
      this.selectedRowKeys = []
      this.ShowPopUp = !this.ShowPopUp
      if (!this.ShowPopUp) return
      if (index == 1) {
        //  选择商品
        // 弹窗表头
        this.popUpColumns = this.exchangeStorePopUpColumns
        //弹窗数据
        this.popUpData = this.exchangeStorePopUpDatas
        //keys
        this.selectedRowKeys = this.exchangeStoreSelectedRowKeys
      } else {
        //核销门店
        // 弹窗表头
        this.popUpColumns = this.cancelStoresPopUpColumns
        //兑换商品弹窗数据
        this.popUpData = this.cancelStoresPopUpData
        //keys
        this.selectedRowKeys = this.cancelStoresSelectedRowKeys
      }
      console.log(this.exchangeStoreData)
      this.search()
      console.log(this.selectedRowKeys)
    },
    //搜索
    search(clickSearch = false) {
      if (clickSearch) {
        this.selectPagination.current = 1
      }
      let that = this
      this.tableLoading = true
      let requestOptions = Object.assign({}, this.selectPagination, { pageNo: this.selectPagination.current })
      if (this.popPart == 1) {
        //  选择商品
        // 兑换商品弹窗表头
        requestOptions = Object.assign({}, requestOptions, { goodName: this.searchName }, this.queryParam)
        getAction(that.url.goodList, requestOptions).then(res => {
          this.tableLoading = false
          if (res.success) {
            res.result.records.map((item, index) => {
              item.key = item.id
              //                item['#'] = index + 1
              if (item.mainPicture) {
                item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              }
              return item
            })
            // this.popUpColumns = this.exchangeStorePopUpColumns
            if (this.exchangeStorePopUpAllDatas.length > 0) {
              for (let item of res.result.records) {
                let canPush = true
                for (let item2 of this.exchangeStorePopUpAllDatas) {
                  if (item2.id === item.id) {
                    canPush = false
                    break
                  }
                }
                if (canPush) {
                  this.exchangeStorePopUpAllDatas.push(item)
                }
              }
            } else {
              this.exchangeStorePopUpAllDatas = res.result.records
            }

            this.popUpData = res.result.records
            this.selectPagination.total = res.result.total
            this.selectPagination.pageSize = res.result.size
          }
        })
      } else {
        //核销门店
        requestOptions = Object.assign({}, requestOptions, { storeName: this.storeName })
        getAction(that.url.storeList, requestOptions).then(res => {
          this.tableLoading = false
          if (res.success) {
            res.result.records.map((item, index) => {
              item.key = item.id
              //                item['#'] = index + 1
              item.logoAddr = this.configure.imgErver + '/' + item.logoAddr
              return item
            })
            if (this.cancelStoresPopUpAllData.length > 0) {
              for (let item of res.result.records) {
                let canPush = true
                for (let item2 of this.cancelStoresPopUpAllData) {
                  if (item2.id === item.id) {
                    canPush = false
                    break
                  }
                }
                if (canPush) {
                  this.cancelStoresPopUpAllData.push(item)
                }
              }
            } else {
              this.cancelStoresPopUpAllData = res.result.records
            }
            this.popUpData = res.result.records
            this.selectPagination.total = res.result.total
            this.selectPagination.pageSize = res.result.size
          }
        })
      }
    },
    //商品删除
    onDeleteShop(id) {
      const dataSource = [...this.exchangeStoreData]
      const selectedRowKeys = [...this.exchangeStoreSelectedRowKeys]
      this.exchangeStoreSelectedRowKeys = selectedRowKeys.filter(item => item !== id)
      this.exchangeStoreData = dataSource.filter(item => item.id !== id)
    },
    //核销门店删除
    onDeleteStore(id) {
      const dataSource = [...this.cancelStoresData]
      const selectedRowKeys = [...this.cancelStoresSelectedRowKeys]
      this.cancelStoresSelectedRowKeys = selectedRowKeys.filter(item => item !== id)
      this.cancelStoresData = dataSource.filter(item => item.id !== id)
    },
    //弹窗确定选择
    selectStoreSure() {
      let ids = this.selectedRowKeys,
        sz = [],
        attributeName = [
          {
            ids: 'goodListIds',
            forEachData: 'exchangeStorePopUpAllDatas',
            data: 'exchangeStoreData',
            selectedRowKeys: 'exchangeStoreSelectedRowKeys'
          },
          {
            ids: 'sysUserIds',
            forEachData: 'cancelStoresPopUpAllData',
            data: 'cancelStoresData',
            selectedRowKeys: 'cancelStoresSelectedRowKeys'
          }
        ],
        dataSource = this[attributeName[this.popPart - 1].data],
        allDataSource = this[attributeName[this.popPart - 1].forEachData]
      this.AllData[attributeName[this.popPart - 1].ids] = ids.join(',')
      if (dataSource.length <= 0) {
        debugger
        dataSource = allDataSource.filter(item => {
          let returnResult = false
          for (let item2 of ids) {
            if (item.id == item2) {
              returnResult = true
              break
            }
          }
          return returnResult
        })
        this[attributeName[this.popPart - 1].data] = [...dataSource]
      } else {
        dataSource = dataSource.filter(item => {
          let returnResult = false
          for (let item2 of ids) {
            if (item.id == item2) {
              returnResult = true
              break
            }
          }
          return returnResult
        })
        sz = ids.filter(item => {
          let returnResult = true
          for (let item2 of dataSource) {
            if (item == item2.id) {
              returnResult = false
              break
            }
          }
          return returnResult
        })
        allDataSource = allDataSource.filter(item => {
          let returnResult = false
          for (let item2 of sz) {
            if (item.id == item2) {
              returnResult = true
              break
            }
          }
          return returnResult
        })
        this[attributeName[this.popPart - 1].data] = [...dataSource, ...allDataSource]
      }
      this[attributeName[this.popPart - 1].selectedRowKeys] = this.selectedRowKeys
      this.PopUp()
    },
    //确认提交
    sure() {
      /*if(this.exchangeStoreData.length<=0){
          this.$message.warn('请选择兑换商品')
          return;
        }
        if(this.AllData.rewardStore == 1 && this.cancelStoresData.length<=0){
          this.$message.warn('请选择核销门店')
          return;
        }
        if( !this.AllData.sellRewardStore || !this.AllData.rewardDayOne){
          this.$message.warn('请选择核销限制')
          return;
        }*/
      let checked = true
      if (this.exchangeStoreData.length > 0) {
        // let item of this.exchangeStoreData
        for (let index = 1; index <= this.exchangeStoreData.length; index++) {
          let item = this.exchangeStoreData[index - 1]
          let page = index % 5 == 0 ? index / 5 : parseInt(index / 5) + 1
          if (!item.goodSpecificationId) {
            this.$message.warn(`请设置兑换商品中第${page}页的${item.goodName}的商品规格！`)
            checked = false
            break
          } else if (!item.canMonth) {
            this.$message.warn(`请设置兑换商品中第${page}页的${item.goodName}的可兑换月份！`)
            checked = false
            break
          } else if (!item.quantity) {
            this.$message.warn(`请设置兑换商品中第${page}页的${item.goodName}的可兑换数量！`)
            checked = false
            break
          }
        }
      }

      if (!checked) return
      this.form.validateFields((err, values) => {
        if (values.rewardStore == 1 && this.cancelStoresData.length <= 0) {
          this.$message.warn('请选择指定门店！')
          return
        }
        if (!err) {
          this.AllData = Object.assign({}, this.AllData, values)
          this.$nextTick(() => {
            let url = this.url.add
            if (this.part == 2) {
              url = this.url.edit
            }
            let mainPictureFileList = {}
            let coverPlan = {}
            let postersCK = {}
            for (let count = 0; count < this.mainPictureFileList.length; count++) {
              mainPictureFileList[count] = this.mainPictureFileList[count].response.message
            }
            for (let count = 0; count < this.diagramFileList.length; count++) {
              coverPlan[count] = this.diagramFileList[count].response.message
            }
            for (let count = 0; count < this.postersFileList.length; count++) {
              postersCK[count] = this.postersFileList[count].response.message
            }
            this.AllData.mainPictures = this.mainPictureFileList.length > 0 ? JSON.stringify(mainPictureFileList) : ''
            this.AllData.coverPlans = this.diagramFileList.length > 0 ? JSON.stringify(coverPlan) : ''
            this.AllData.posters = this.postersFileList.length > 0 ? JSON.stringify(postersCK) : ''
            let that = this
            if (this.selectDateToTime) {
              let startTime = new Date(this.selectDateToTime[0]._d),
                endTime = new Date(this.selectDateToTime[1]._d)
              this.AllData.startTime = dayjs(startTime).format('YYYY-MM-DD HH:mm:ss')
              this.AllData.endTime = dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            this.AllData.shopTotal = this.exchangeStoreData.length || 0
            this.AllData.sellRewardStore = this.AllData.sellRewardStore ? '1' : '0'
            this.AllData.rewardDayOne = this.AllData.rewardDayOne ? '1' : '0'
            if (this.AllData.userRestrict) {
              let sz = []
              for (let item of this.AllData.userRestrict) {
                if (item == '普通会员') {
                  sz.push('0')
                }
                if (item == 'VIP会员') {
                  sz.push('1')
                }
              }
              this.AllData.userRestrict = sz.join(',')
            }

            if (this.AllData.aboveBelowUseDe) {
              let sz = []
              this.AllData.aboveUse = 0
              this.AllData.belowUse = 0
              for (let item of this.AllData.aboveBelowUseDe) {
                console.log("aboveBelowUseDe",item);
                if (item == '线上核销') {
                  this.AllData.aboveUse = 1
                }
                if (item == '线下核销') {
                  this.AllData.belowUse = 1
                }
              }
            }
            // this.AllData.goodListIds = this.exchangeStoreSelectedRowKeys.join(',') //兑换商品
            let goodListIds = []
            for (let item of this.exchangeStoreData) {
              let obj = {
                canMonth: item.canMonth,
                id: item.id,
                goodSpecificationId: item.goodSpecificationId,
                quantity: item.quantity
              }
              goodListIds.push(obj)
            }
            this.AllData.goodListIds = goodListIds.length > 0 ? JSON.stringify(goodListIds) : ''
            this.AllData.sysUserIds = this.cancelStoresSelectedRowKeys.join(',') //核销门店
            console.log(this.AllData)
            // debugger
            if (this.part == 2) {
              postAction(url, this.AllData)
                .then(res => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.$router.push('/marketing/MarketingCertificateList')
                  } else {
                    that.$message.success(res.message)
                    that.$router.push('/marketing/MarketingCertificateList')
                  }
                })
                .catch(err => {
                  that.$message.success(res.message)
                  that.$router.push('/marketing/MarketingCertificateList')
                })
            } else {
              postAction(url, this.AllData)
                .then(res => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.$router.push('/marketing/MarketingCertificateList')
                  } else {
                    that.$message.success(res.message)
                    that.$router.push('/marketing/MarketingCertificateList')
                  }
                })
                .catch(err => {
                  that.$message.success(res.message)
                  that.$router.push('/marketing/MarketingCertificateList')
                })
            }
          })
        }
      })
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
    //分享图
    diagramHandleCancel() {
      this.diagramPreviewVisible = false
    },
    diagramHandlePreview(file) {
      this.diagramPreviewImage = file.url || file.thumbUrl
      this.diagramPreviewVisible = true
    },
    diagramHandleChange({ fileList }) {
      this.diagramFileList = fileList
    },
    //海报图
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
    chooseMedicine: function(value) {
      console.log('parentId1111111111' + value)
      let that = this
      //console.log("parentId1111111111"+value)
      that.listGoodType1 = []
      that.listGoodType2 = []
      that.queryParam.goodTypeIdTwo = ''
      that.queryParam.goodTypeIdThree = ''
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType1 = res.result.listGoodType

          console.log(that.listGoodType1)
        } else {
          that.$message.warning(res.message)
        }
      })
      //  that.queryParam.goodTypeIdThree = "";
    },
    chooseMedicine1: function(value) {
      console.log('parentId2222' + value)
      let that = this
      that.listGoodType2 = []
      //  that.queryParam.goodTypeIdThree = "";
      getAction(that.url.getgoodTypeListcascade, { parentId: value }).then(res => {
        if (res.success) {
          that.listGoodType2 = res.result.listGoodType
          console.log(that.listGoodType2)
        } else {
          that.$message.warning(res.message)
        }
      })
    },
    goodTypeListcascade(parentId) {
      let that = this
      that.listGoodType1 = []
      that.listGoodType2 = []
      getAction(that.url.getgoodTypeListcascade, { parentId: parentId }).then(res => {
        if (res.success) {
          that.listGoodType = res.result.listGoodType
          //that.$message.success(res.message);
          //  console.log("res.message===="+res.result.listGoodType[0].id)
        } else {
          that.$message.warning(res.message)
        }
      })
    }
  },
  mounted() {
    this.goodTypeListcascade('0')
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
    let that = this
    let part = this.$route.query.part ? this.$route.query.part : '1'
    let marketingCertificateData = localStorage.getItem('marketingCertificateData')
    this.storeName = ''
    this.searchName = ''
    let requestOptions = Object.assign({}, { goodName: '' }, this.selectPagination, {
      pageNo: this.selectPagination.current
    })
    //页面加载判断是否是点击编辑进入页面  编辑返回2
    this.part = part
    if (part == 2 && marketingCertificateData) {
      //编辑
      marketingCertificateData = JSON.parse(marketingCertificateData)
      console.log("marketingCertificateData", marketingCertificateData);
      let aboveBelowUseDe = []
      if(marketingCertificateData.aboveUse == 1){
        aboveBelowUseDe.push('线上核销')
      }
      if(marketingCertificateData.belowUse == 1){
        aboveBelowUseDe.push('线下核销')
      }
      
      let allData = {
        // id:marketingCertificateData.id,
        // delFlag:marketingCertificateData.delFlag,//删除状态
        // theReward:marketingCertificateData.theReward,//核销奖励
        // name:marketingCertificateData.name,//优惠券名称 marketingDiscountData.delFlag
        // total:marketingCertificateData.total,//发放总量
        userRestrict: marketingCertificateData.userRestrict.split(','), //使用人限制
        aboveBelowUseDe:  aboveBelowUseDe,
        isGive: marketingCertificateData.isGive * 1, //赠送设置
        isWarn: marketingCertificateData.isWarn * 1, //是否过期提醒
        vouchersWay: marketingCertificateData.vouchersWay * 1, //用券方式
        // warnDays:marketingCertificateData.warnDays,//过期前多少天提醒
        //用券时间
        // startTime:marketingCertificateData.startTime,//开始时间
        // endTime:marketingCertificateData.endTime,//结束时间
        // disData:marketingCertificateData.disData,//多少天、周、月  数字形式
        // monad:marketingCertificateData.monad,//单位
        // goodListIds:marketingCertificateData.goodListIds,//商品ids
        // sysUserIds:marketingCertificateData.sysUserIds,//核销门店ids
        // discountExplain:marketingCertificateData.discountExplain,//券说明
        rewardStore: marketingCertificateData.rewardStore * 1, //核销门店: 0: 全平台 1:指定门店
        // certificateType:marketingCertificateData.certificateType * 1,//兑换方式
        isNomal: marketingCertificateData.isNomal * 1, //券类型: 0:活动券 1:付费券
        sellRewardStore: marketingCertificateData.sellRewardStore * 1 == 1 ? true : false, //仅销售店铺可核销（有记录到销售店铺则该券仅销售店铺可核销）
        rewardDayOne: marketingCertificateData.rewardDayOne * 1 == 1 ? true : false //同一家店同一天仅能核销1次
      }
      console.log("allData",allData);
      
      allData = Object.assign({}, marketingCertificateData, allData)
      if (allData.startTime && allData.endTime) {
        this.selectDateToTime = [moment(allData.startTime, this.dateFormat), moment(allData.endTime, this.dateFormat)]
      }
      for (let a = 0; a < allData.userRestrict.length; a++) {
        allData.userRestrict[a] = this.plainOptions[allData.userRestrict[a]]
      }

      if (allData.mainPictures) {
        let mainPictures = Object.values(JSON.parse(allData.mainPictures))
        let mainPicturesSz = []
        //主图返显
        for (let a = 0; a < mainPictures.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + mainPictures[a],
            response: {
              message: mainPictures[a]
            }
          }
          mainPicturesSz.push(obj)
        }
        this.mainPictureFileList = mainPicturesSz
      }
      if (allData.coverPlans) {
        let coverPlans = Object.values(JSON.parse(allData.coverPlans))
        let coverPlansSz = []
        //分享图返显
        for (let a = 0; a < coverPlans.length; a++) {
          let obj = {
            uid: a,
            url: this.configure.imgErver + '/' + coverPlans[a],
            response: {
              message: coverPlans[a]
            }
          }
          coverPlansSz.push(obj)
        }
        this.diagramFileList = coverPlansSz
      }
      if (allData.posters) {
        let posters = Object.values(JSON.parse(allData.posters))
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
      //使用商品列表请求接口返先
      //参数  marketingDiscountId
      let info = {
        pageNo: this.pageNo,
        marketingCertificateId: allData.id,
        id: allData.id
      }
      //编辑兑换券-选择商品返显
      getAction(that.url.findGoodByCertificateId, info).then(async res => {
        if (res.success) {
          let data = res.result.records
          let sz = []
          for (let item of data) {
            item.operation = '删除'
            await this.recordHandleFocus(item, true)
            if (item.mainPicture) {
              try {
                item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              } catch (e) {}
              sz.push(item.id)
            }
          }
          setTimeout(() => {
            that.exchangeStoreData = [...data]
            // [...that.exchangeStorePopUpAllDatas,...data]
            that.exchangeStorePopUpAllDatas = [...data]
            that.exchangeStoreSelectedRowKeys = sz
          }, 250)
        }
      })
      //编辑兑换券-核销门店返显
      getAction(that.url.findStoreByCertificateId, info).then(res => {
        if (res.success) {
          let sz = []
          let data = res.result.records
          for (let item of data) {
            item.operation = '删除'
            sz.push(item.id)
            if (item.logoAddr) {
              //                item.mainPicture =  this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
              try {
                item.logoAddr = this.configure.imgErver + '/' + item.logoAddr
              } catch (e) {}
            }
          }
          that.cancelStoresData = [...data]
          // that.cancelStoresPopUpAllData = [...that.cancelStoresPopUpAllData,...data]
          that.cancelStoresPopUpAllData = [...data]
          that.cancelStoresSelectedRowKeys = sz
          console.log(sz)
        }
      })
      this.AllData = allData
      this.$nextTick(() => {
        this.form.setFieldsValue(this.AllData)
      })
    }
    //兑换商品弹窗表格列表
    getAction(that.url.goodList, requestOptions).then(res => {
      if (res.success) {
        res.result.records.map((item, index) => {
          item.key = item.id
          //            item['#'] = index + 1
          if (item.mainPicture) {
            try {
              item.mainPicture = this.configure.imgErver + '/' + Object.values(JSON.parse(item.mainPicture))[0]
            } catch (e) {}
          }
          return item
        })
        this.popUpColumns = this.exchangeStorePopUpColumns
        this.exchangeStorePopUpDatas = res.result.records
        ;(this.exchangeStorePopUpAllDatas = res.result.records), (this.selectPagination.total = res.result.total)
        this.selectPagination.pageSize = res.result.size
        // this.exchangeStorePopUpTotalPage = res.result.total;
        // this.exchangeStorePopUpPageSize = res.result.size
        this.$nextTick(() => {
          this.popUpData = res.result.records
        })
      }
    })
    //核销门店弹窗表格列表
    getAction(that.url.storeList, requestOptions).then(res => {
      if (res.success) {
        res.result.records.map((item, index) => {
          item.key = item.id
          //            item['#'] = index + 1
          item.logoAddr = this.configure.imgErver + '/' + item.logoAddr
          return item
        })
        // this.cancelStoresPopUpTotalPage = res.result.total;
        // this.cancelStoresPopUpPageSize = res.result.size;
        this.cancelStoresPopUpData = res.result.records
        this.cancelStoresPopUpAllData = res.result.records
      }
    })
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
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
    },
    modalTitle() {
      return this.popPart == 1 ? '选择商品' : '选择核销门店'
    }
  }
}
</script>
<style lang="less">
.AddMarketingCertificateModel {
  width: 100%;

  .el-dialog {
    -webkit-backface-visibility: hidden;
  }

  .title {
    padding-bottom: 25px;
    font-weight: 700;
    font-size: 16px;
    /*border-bottom: 1px solid gray;*/
    /*margin-top: 30px;*/
  }

  .wrap {
    margin-top: 30px;

    .Discount {
      input {
        margin: 0 15px;
        width: 75px;
      }
    }

    .attention {
      margin-top: 10px;
      padding: 0 20px;
      border: 1px solid rgb(0, 153, 255);
      border-radius: 5px;
      background: rgb(204, 235, 255);
      line-height: 34px;

      /*width: 1080px;*/
      font-size: 13px;
      color: black;

      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
    }
  }

  .operation {
    cursor: pointer;
    color: rgb(24, 144, 255);
  }

  .line-special .ant-checkbox-group,
  .line-special .ant-radio-group {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 300px;
    height: 39px;

    .ant-radio-wrapper {
      display: flex;
      align-items: center;
    }
  }

  .line-special-second {
    .ant-checkbox-group {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      height: 100px;
    }
  }

  .button-operation {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    width: 200px;

    button {
      width: 80px;
    }
  }

  .button-end {
    margin-bottom: 40px;
    border-bottom: 1px solid gray;
  }
}
.AddMarketingCertificateModel-pop-wrap {
  background: white;
  font-size: 12px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 5px 0 20px;
    border-bottom: 1px solid gray;
    width: 100%;
    height: 50px;

    span:nth-child(2) {
      padding: 15px;
      cursor: pointer;
    }
  }
  .cnt {
    input {
      width: 120px;
    }
    .title2 {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .info {
      display: flex;
      float: right;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      min-width: 250px;
    }
  }
}
</style>
