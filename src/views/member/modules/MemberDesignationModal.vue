<template>
  <a-modal
    :title="title"
    :width="1200"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" style="height: 500px; overflow: scroll">
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="创建年">-->
        <!--          <a-input-number v-decorator="[ 'year', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="创建月">-->
        <!--          <a-input-number v-decorator="[ 'month', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="创建日">-->
        <!--          <a-input-number v-decorator="[ 'day', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="删除状态（0，正常，1已删除）">-->
        <!--          <a-input placeholder="请输入删除状态（0，正常，1已删除）" v-decorator="['delFlag', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="称号名称">-->
        <!--          <a-input placeholder="请输入称号名称" v-decorator="['name', {}]"/>-->
        <!--        </a-form-item>-->

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="称号名称">
          <a-input placeholder="请输入称号名称" v-decorator="['name', validatorRules.name]" />
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          validate-status="validating"
          help="尺寸40*40 支持png格式，大小不超过200k"
          :colon="false"
        >
          <div slot="label">
            <span class="dataCheckedStar"> * </span>
            <span style="margin-right: 10px"> 图标: </span>
          </div>
          <a-upload
            :action="uploadAction"
            :headers="headers"
            :fileList="frontCoverFileList"
            :beforeUpload="frontCoverBeforeUpload"
            list-type="picture-card"
            @preview="frontCoverPreview"
            @change="frontCoverChange"
          >
            <div v-if="frontCoverFileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <a-modal :visible="frontCoverPreviewVisible" :footer="null" @cancel="frontCoverCancel">
            <img alt="example" style="width: 100%" :src="frontCoverPreviewImage" />
          </a-modal>
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否为默认称号" v-if="!confirmLoading">
          <a-radio-group v-model="isDefault" @change="isDefaultChange" :disabled="model.id ? true : false">
            <a-radio :value="0"> 否 </a-radio>
            <a-radio :value="1"> 是 </a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="团队归属">
          <!-- v-if="showTeamFor" -->
          <a-select
            show-search
            v-decorator="['memberDesignationGroupId', validatorRules.memberDesignationGroupId]"
            placeholder="请输入"
            style="width: 100%"
            :disabled="model.id ? true : false"
            :filter-option="false"
            :not-found-content="fetching ? undefined : null"
            @search="fetchPhone"
            @change="phoneChange"
          >
            <a-spin v-if="fetching" slot="notFoundContent" size="small" />
            <a-select-option v-for="d in teamList" :key="d.id">
              {{ d.groupName }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="级别">
          <a-input-number
            :min="minSort"
            :precision="0"
            :disabled="model.id ? true : false"
            v-decorator="['sort', validatorRules.sort]"
            @change="sortHandleChange"
          />
        </a-form-item>
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="推荐人限制">-->
        <!--          &lt;!&ndash;          <a-input placeholder="请输入图标" v-decorator="['logoAddr', {}]"/>&ndash;&gt;-->
        <!--          <a-radio-group  v-decorator="['recommendType', validatorRules.recommendType]" >-->
        <!--            <a-radio value="0">-->
        <!--              无-->
        <!--            </a-radio>-->
        <!--            <a-radio value="1">-->
        <!--              需成为vip会员-->
        <!--            </a-radio>-->
        <!--            <a-radio value="2">-->
        <!--              需购买礼包-->
        <!--            </a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="被推荐人限制">-->
        <!--&lt;!&ndash;          <a-input placeholder="请输入图标" v-decorator="['logoAddr', {}]"/>&ndash;&gt;-->
        <!--          <a-radio-group  v-decorator="['recommendedType', validatorRules.recommendedType]" >-->
        <!--            <a-radio value="0">-->
        <!--              无-->
        <!--            </a-radio>-->
        <!--            <a-radio value="1">-->
        <!--              需成为vip会员-->
        <!--            </a-radio>-->
        <!--            <a-radio value="2">-->
        <!--              需购买礼包-->
        <!--            </a-radio>-->
        <!--          </a-radio-group>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="直推人数">-->
        <!--          <a-input-number v-decorator="[ 'directReferrals', {}]"/>-->
        <!--        </a-form-item>-->

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar" v-if="showTeamFor"> * </span>
            获得方式
          </span>

          <div class="sjtj">
            <!-- @change="marketingGiftBagIdHandleChange"  marketingGiftBagId-->
            <a-checkbox v-model="model.isBuyGiftbag"> </a-checkbox>
            <div>
              <div style="margin: 0 10px">购买礼包</div>
              <!-- <a-button :disabled="!marketingGiftBagId"  @click="PopUp(3)">
                选择礼包
              </a-button> -->
              <!-- <a-tag
                closable
                @close="onDelete(giftBagData[0].id, 3)"
                v-if="giftBagData.length > 0"
                style="height: 32px; display: flex; align-items: center; margin-left: 10px"
              >
                {{ giftBagData[0].giftName }} {{ giftBagData[0].id }}
              </a-tag> -->
            </div>
          </div>

          <!--  <div class="sjtj">
            <a-checkbox @change="giftTotalSalesHandleChange" v-model="giftTotalSales"> </a-checkbox>
            <div>
              <div style="margin: 0 10px">团队礼包销售总额</div>
              <a-input-number
                style="width: 150px"
                v-model="model.giftTotalSales"
                :min="0"
                :precision="2"
                :disabled="!giftTotalSales"
                placeholder="团队礼包销售总额"
              />
            </div>
          </div>
-->
          <!--   <div class="sjtj">
            &lt;!&ndash;            @change="onChange"&ndash;&gt;
            <a-checkbox @change="directPromitionHandleChange" v-model="directPromition"> </a-checkbox>
            <div>
              <div style="margin: 0 10px">直推人数</div>
              <a-input-number
                v-model="model.directReferrals"
                :min="0"
                :precision="0"
                :disabled="!directPromition"
                placeholder="直推人数"
              />
            </div>
            <div>
              <div style="margin-right: 10px; width: 60px">
                &lt;!&ndash;                总推人数&ndash;&gt;
                团队人数
              </div>
              <a-input-number
                v-model="model.totalRecommend"
                :min="0"
                :precision="0"
                :disabled="!directPromition"
                placeholder="总推人数"
              />
              人
            </div>
          </div>-->

          <!--<div class="sjtj" v-if="lowLevelDividendsOptions.length > 0">
            &lt;!&ndash;            @change="onChange"&ndash;&gt;
            <a-checkbox @change="directDeductionHandleChange" v-model="directDeduction"> </a-checkbox>
            <div>
              <div style="margin: 0 10px">下属</div>
              <a-input-number
                v-model="model.totalTeams"
                :precision="0"
                :disabled="!directDeduction"
                :min="0"
                placeholder="下属人数"
              />
              <div style="margin: 0 10px">团队，</div>
            </div>
            <div>
              &lt;!&ndash;              <div style="margin: 0 10px">&ndash;&gt;
              &lt;!&ndash;                关联直推&ndash;&gt;
              &lt;!&ndash;              </div>&ndash;&gt;
              &lt;!&ndash;              <a-input-number v-model="model.directReferrals" :min="0" placeholder="关联直推" />&ndash;&gt;
              <a-select
                v-model="model.straightPushId"
                style="width: 120px"
                :disabled="!directDeduction"
                placeholder="请选择关联直推"
              >
                <a-select-option value=""> 请选择 </a-select-option>
                <a-select-option v-for="(item, index) in lowLevelDividendsOptions" :key="index" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </div>
            <div>
              <div style="margin-right: 10px">
                &lt;!&ndash;                达&ndash;&gt;
                各有
              </div>
              <a-input-number
                v-model="model.straightPushProple"
                :precision="0"
                :disabled="!directDeduction"
                :min="0"
                placeholder="各有人数"
              />
              人
            </div>
          </div>-->
        </a-form-item>

        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="总推荐人数">-->
        <!--          <a-input-number v-decorator="[ 'totalRecommend', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="分红资金占比">-->
        <!--          <a-input-number v-decorator="[ 'participation', {}]"/>-->
        <!--        </a-form-item>-->

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分红资金占比">
          <a-input-number :min="0" :precision="2" v-decorator="['participation', validatorRules.participation]" />%
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <span class="dataCheckedStar" v-if="showTeamFor"> * </span>
            称号特权
          </span>
          <div class="sjtj">
            <a-checkbox @change="isAverageHandleChange" v-model="model.isAverage"> 均分当前称号分红资金 </a-checkbox>
          </div>
          <div class="sjtj" v-if="lowLevelDividendsOptions.length > 0">
            <div class="specialTwo">
              <a-checkbox @change="lowLevelDividendsHandleChange" v-model="model.lowLevelDividends">
                参与低级分红
              </a-checkbox>
            </div>
            <div class="specialOne">
              <a-checkbox-group
                :options="lowLevelDividendsOptions"
                v-model="model.memberDesignations"
                :disabled="!model.lowLevelDividends"
              />
            </div>
          </div>
          <!--          <div class="sjtj">-->
          <!--            <div class="specialTwo">-->
          <!--              <a-checkbox @change="customHandleChange" v-model="custom">-->

          <!--                自定义特权-->
          <!--              </a-checkbox>-->
          <!--            </div>-->
          <!--            <div style="width: 65%">-->
          <!--              <a-textarea style="width: 100%" placeholder="自定义特权" v-model="model.customRemark">-->

          <!--              </a-textarea>-->

          <!--            </div>-->

          <!--          </div>-->
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol">
          <span slot="label">
            <!-- <span class="dataCheckedStar"> * </span> -->
            称号规则描述
          </span>
          <JEditor v-model="model.customRemark"> </JEditor>
        </a-form-item>
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="月绩效奖励">-->
        <!--          <a-checkbox v-model="model.isMonthlyPerformance" @change="isMonthlyPerformanceHandleChange">-->
        <!--            开启月绩效，不勾选即无-->
        <!--          </a-checkbox>-->
        <!--          <div class="specialThird">-->
        <!--            <div>-->
        <!--              <div>-->
        <!--                每月总推人数新增-->
        <!--              </div>-->
        <!--              <a-input-number :min="0" :precision='0' placeholder="每月总推人数新增" v-model="model.totalPeoples" :disabled="!model.isMonthlyPerformance" style="width: 150px;">-->

        <!--              </a-input-number>-->
        <!--              <div>-->
        <!--                人，累计-->
        <!--              </div>-->
        <!--              <a-input-number :min="0" :precision='0' placeholder="累计" v-model="model.totalPrices" :disabled="!model.isMonthlyPerformance" style="width: 150px;">-->

        <!--              </a-input-number>-->
        <!--              <div>-->
        <!--                元消费额-->
        <!--              </div>-->
        <!--            </div>-->
        <!--            <div >-->
        <!--              <div>-->
        <!--                每月均分平台消费额-->
        <!--              </div>-->
        <!--              <a-input-number :min="0" :precision='2' placeholder="每月均分平台消费额" v-model="model.totalPercent" :disabled="!model.isMonthlyPerformance" style="width: 150px;">-->

        <!--              </a-input-number>-->
        <!--              <div>-->
        <!--                % 分红权益-->
        <!--              </div>-->
        <!--              <div style="width: 35%">-->

        <!--              </div>-->
        <!--            </div>-->

        <!--          </div>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="状态: 0:停用; 1:启用">-->
        <!--          <a-input placeholder="请输入状态: 0:停用; 1:启用" v-decorator="['status', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="停用时间">-->
        <!--          <a-date-picker showTime format='YYYY-MM-DD HH:mm:ss' v-decorator="[ 'closeTime', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="停用说明">-->
        <!--          <a-input placeholder="请输入停用说明" v-decorator="['closeExplain', {}]"/>-->
        <!--        </a-form-item>-->
        <!--        <a-form-item-->
        <!--          :labelCol="labelCol"-->
        <!--          :wrapperCol="wrapperCol"-->
        <!--          label="删除说明">-->
        <!--          <a-input placeholder="请输入删除说明" v-decorator="['delExplain', {}]"/>-->
        <!--        </a-form-item>-->
      </a-form>
    </a-spin>
    <!--    弹窗-->
    <a-modal :title="'选择' + popName" :visible="ShowPopUp" :width="1200" @ok="selectLineData" @cancel="PopUp">
      <div id="cnt">
        <div class="title2">
          <div>
            {{ popName }}名称：
            <a-input v-model="searchName" style="width: 200px" />
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
            <a-input v-model="queryParam.id" style="width: 200px"> </a-input>
          </div>
          <!--<div v-if="popPart == '1'">
            使用人限制:
            <j-dict-select-tag placeholder="请选择状态" v-model="queryParam.getRestrict" style="width:  200px" dictCode="member_type"/>
          </div>-->
          <div v-if="popPart == 1">
            发行人：
            <a-input v-model="queryParam.issuer" style="width: 200px" />
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

          <a-button @click="PopUp(popPart, 'true')" type="primary"> 查询 </a-button>
        </div>
        <a-table
          :columns="popUpColumns"
          :dataSource="popUpData"
          :loading="tableloading"
          :pagination="selectPagination"
          :rowKey="record => (popPart == 2 ? record.sysUserId : record.id)"
          :rowSelection="rowSelection"
          :scroll="{ y: 300, x: (popUpColumns.length + 1) * columnsWidth }"
          bordered
          style="margin-top: 20px"
          @change="handleSelectTableChange"
        >
          <template slot="goodQuantity" slot-scope="text, record, index">
            <a @click="showExchangeGoodInformation(record.id)">{{ record.goodQuantity }}</a>
          </template>
          <template slot="applyGood" slot-scope="text, record, index">
            <a @click="showGoodInformation(record.id)">{{ record.applyGood }}</a>
          </template>
          <template slot="mainPicture" slot-scope="text">
            <img :src="handleImage(text)" alt="" style="width: 40px; height: 40px" />
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
  </a-modal>
</template>

<script>
import { httpAction, getAction } from '@/api/manage'
import JEditor from '@/components/jeecg/JEditor'
import pick from 'lodash.pick'
import moment from 'moment'
import Vue from 'vue'
import debounce from 'lodash/debounce'
const columnsWidth = 160
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
    dataIndex: 'mainPicture',
    scopedSlots: { customRender: 'mainPicture' },
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '礼包价格',
    dataIndex: 'price',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '礼包发行时间',
    dataIndex: 'publishTime',
    width: columnsWidth,
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: columnsWidth,
    align: 'center'
  }
]
export default {
  name: 'MemberDesignationModal',
  data() {
    this.lastFetchId = 0
    this.fetchPhone = debounce(this.fetchPhone, 800)
    return {
      title: '操作',
      visible: false,
      isDefault: 0,
      teamList: [],
      fetching: false,
      giftBagAllData: '', //礼包所有数据
      minSort: 0,
      model: {
        directReferrals: '',
        totalRecommend: '',
        straightPushProple: '',
        totalTeams: '',
        straightPushId: '',
        // recommendedType:'',
        // recommendType:'',
        isAverage: true,
        lowLevelDividends: false,
        memberDesignations: '',
        memberDesignationGroupId: '',
        customRemark: '',
        giftTotalSales: 0,
        marketingGiftBagId: '',
        isDefault: 0,
        isBuyGiftbag: 0,
        participation: 0,
        sort: 0
        // isMonthlyPerformance:false,
        // totalPeoples:'',
        // totalPrices:'',
        // totalPercent:''
      },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      headers: '',
      //图标配置
      frontCoverFileList: [],
      frontCoverPic: true,
      frontCoverPreviewImage: '',
      frontCoverPreviewVisible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      directPromition: true,
      directDeduction: false,
      marketingGiftBagId: false,
      giftTotalSales: false,
      // custom:false,
      lowLevelDividendsOptions: [],
      tableloading: false,
      columnsWidth,

      popPart: 1,

      modalTableType: 'radio',
      selectedRowKeys: [], // Check here to configure the default column
      // certificateSelectedRowKeys: [],
      // discountRowKeys: [],
      // storeSelectedRowKeys: [],
      giftBagSelectedRowKeys: [],
      //礼包列表表头
      giftBagColumns,
      //礼包列表数据
      giftBagData: [],
      //弹窗表头
      popUpColumns: '',
      //弹窗数据
      popUpData: '',
      //弹窗名称
      popName: '',
      //团队归属显示交互
      showTeamFor: true,
      ShowPopUp: false,
      searchName: '',
      queryParam: {},
      selectPagination: {
        current: 1,
        pageSize: 10,
        total: 1
      },
      record1: {},
      validatorRules: {
        name: { rules: [{ required: true, message: '请输入称号名称!' }] },
        // logoAddr: { rules: [{ required: true, message: '请输入标被推荐人类型题!' }] },
        participation: { rules: [{ required: true, message: '请输入分红资金占比!' }] },
        // discount: { rules: [{ required: true, message: '请输入会员价折扣!' }] }
        sort: { rules: [{ required: true, message: '请输入级别!' }] },
        /*recommendedType: { rules: [{ required: true, message: '请选择被推荐人限制!' }] },
        recommendType: { rules: [{ required: true, message: '请选择推荐人限制!' }] },*/
        isDefault: { rules: [{ required: true, message: '请选择是否为默认称号!' }] },
        memberDesignationGroupId: { rules: [{ required: true, message: '请选择团队归属!' }] }
      },

      url: {
        add: '/memberDesignation/memberDesignation/add',
        edit: '/memberDesignation/memberDesignation/edit',
        findCreatedByName: 'memberDesignationGroup/memberDesignationGroup/findMemberDesignationGroupByName',
        getMemberDesignationListBySort: 'memberDesignation/memberDesignation/getMemberDesignationListBySort',
        //前置礼包弹窗
        isPrepositionList: 'marketingGiftBag/marketingGiftBag/isPrepositionList' //查询字段:id ,giftName, startTime_begin ,endTime_end ,createTime_begin ,createTime_end
      },
      //配置
      configure: {
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  computed: {
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
  },
  created() {
    const token = Vue.ls.get('Access-Token')
    this.headers = { 'X-Access-Token': token }
  },
  components: {
    JEditor
  },

  watch: {
    lowLevelDividendsOptions: {
      handler(newVal) {
        this.directDeduction = false
        this.model.lowLevelDividends = false
        this.model.straightPushId = ''
        this.model.straightPushProple = ''
        this.model.totalTeams = ''
        this.model.memberDesignations = ''
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    isDefaultChange(e) {
      let value = e.target.value
      if (value == 1) {
        this.showTeamFor = false
        this.$set(this.validatorRules.memberDesignationGroupId.rules[0], 'required', false)
      } else {
        this.showTeamFor = true
        this.$set(this.validatorRules.memberDesignationGroupId.rules[0], 'required', true)
      }
    },
    fetchPhone(phone) {
      console.log('fetching phone', phone)

      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      let formData = {
        name
      }

      getAction(this.url.findCreatedByName, { name: phone }).then(res => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return
        }
        // this.phoneIsExistence = res
        this.teamList = [
          {
            groupName: '请选择',
            id: '',
            sort: -1
          },
          ...res.result
        ]
        this.fetching = false
      })

      // fetch('https://randomuser.me/api/?results=5')
      //   .then(response => response.json())
      //   .then(body => {
      //     if (fetchId !== this.lastFetchId) {
      //       // for fetch callback order
      //       return;
      //     }
      //     const data = body.results.map(user => ({
      //       text: `${user.name.first} ${user.name.last}`,
      //       value: user.login.username,
      //     }));
      //     this.data = data;
      //     this.fetching = false;
      //   });
    },
    async phoneChange(id) {
      console.log(id)
      let sort = this.teamList.filter(v => v.id === id)[0].sort + 1
      await this.getMemberDesignationListBySort(sort, id)
      this.form.setFieldsValue({
        sort
      })
      this.minSort = sort

      // if (id) {
      //   if (this.visiblwelfarePaymentsProInformation) {
      //     this.tarrace.id = id
      //   }
      //   if (this.visiblwelfarePaymentsInformation) {
      //     this.dataAll.id = id
      //   }
      // }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleImage(url) {
      if (url) {
        return this.configure.imgerver + '/' + Object.values(JSON.parse(url))[0]
      } else {
        return ''
      }
    },
    onDelete(id, index) {
      let that = this
      let attributeName = [
        //兑换券
        {
          ids: 'certificateIds',
          data: 'exchangeCertificateListDatas',
          selectedRowKeys: 'certificateSelectedRowKeys'
        },
        {
          //优惠券
          ids: 'discountIds',
          data: 'couponListData',
          selectedRowKeys: 'discountRowKeys'
        },
        {
          //门店
          ids: 'storeIds',
          data: 'upperStoreDatas',
          selectedRowKeys: 'storeSelectedRowKeys'
        },
        {
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
      this.$nextTick(() => {
        this.model.marketingGiftBagId = ''
      })
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
      console.log(selectedRowKeys)
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
        },
        {
          columns: 'couponListColumns',
          url: 'CouponPopupList',
          selectedRowKeys: 'discountRowKeys',
          popName: '优惠券',
          searchName: 'discoountName',
          allData: 'discoountAllData'
        },
        {
          columns: 'upperStoreColumns',
          url: 'storePopUpList',
          selectedRowKeys: 'storeSelectedRowKeys',
          popName: '门店',
          searchName: 'storeName',
          allData: 'storeAllData'
        },
        {
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
        let requestOptions = Object.assign(
          {},
          this.selectPagination,
          { pageNo: this.selectPagination.current },
          { [Interface[index].searchName]: this.searchName },
          this.queryParam
        )
        // if (index == '0') {
        //   requestOptions = Object.assign({}, requestOptions, { certificateType: this.certificateType })
        // }
        getAction(that.url[Interface[index].url], requestOptions).then(res => {
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
            // if(index == 0 || index == 1){
            //   delete popUpColumns[popUpColumns.length - 1]
            //   delete popUpColumns[popUpColumns.length - 2]
            //   delete popUpColumns[popUpColumns.length - 3]
            // }
            this.popUpColumns = popUpColumns
            this.$nextTick(() => {
              this.popUpData = datas.records
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
        },
        {
          ids: 'discountIds',
          data: 'couponListData',
          selectedRowKeys: 'discountRowKeys',
          allData: 'discoountAllData'
        },
        {
          ids: 'storeIds',
          data: 'upperStoreDatas',
          selectedRowKeys: 'storeSelectedRowKeys',
          allData: 'storeAllData'
        },
        {
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
      if (sz.length > 0) {
        this.model.marketingGiftBagId = sz[0].id
      } else {
        this.model.marketingGiftBagId = ''
      }
    },
    add() {
      this.edit({})
    },
    sortHandleChange(value) {
      if (value) {
        this.getMemberDesignationListBySort(value)
      }
    },
    getMemberDesignationListBySort(
      sort = this.form.getFieldValue('sort'),
      memberDesignationGroupId = this.form.getFieldValue('memberDesignationGroupId')
    ) {
      return new Promise(resolve => {
        if (memberDesignationGroupId) {
          getAction(this.url.getMemberDesignationListBySort, { sort, memberDesignationGroupId }).then(res => {
            if (res.success) {
              let sz = []
              for (let item of res.result) {
                sz.push({
                  label: item.name,
                  value: item.memberDesignationId
                })
              }
              this.lowLevelDividendsOptions = sz
              this.$nextTick(() => {
                resolve()
              })
            } else {
              this.$message.warn(res.message)
              resolve()
            }
          })
        } else {
          resolve()
        }
      })
    },
    async edit(record) {
      this.form.resetFields()
      this.confirmLoading = true
      this.model = {
        directReferrals: '',
        totalRecommend: '',
        straightPushProple: '',
        totalTeams: '',
        straightPushId: '',
        // recommendedType:'',
        // recommendType:'',
        isAverage: true,
        lowLevelDividends: false,
        memberDesignations: '',
        memberDesignationGroupId: '',
        customRemark: '',
        giftTotalSales: 0,
        marketingGiftBagId: '',
        isDefault: 0,
        isBuyGiftbag: 0,
        participation: 0,
        sort: 0
        // isMonthlyPerformance:false,
        // totalPeoples:'',
        // totalPrices:'',
        // totalPercent:''
      }
      getAction(this.url.findCreatedByName, { name: '' }).then(res => {
        // this.phoneIsExistence = res
        this.teamList = [
          {
            groupName: '请选择',
            id: '',
            sort: -1
          },
          ...res.result
        ]
        this.fetching = false
      })

      this.editShowHandleImg(record.logoAddr, 'frontCoverFileList')
      if (record.id) {
        this.title = '编辑'
        this.record1 = record
        console.log(record)
        await this.getMemberDesignationListBySort(record.sort, record.memberDesignationGroupId)
        record.isAverage = record.isAverage == 1 ? true : false
        record.lowLevelDividends = record.lowLevelDividends == 1 ? true : false
        record.isBuyGiftbag = record.isBuyGiftbag == 1 ? true : false
        this.isDefault = record.isDefault == 1 ? 1 : 0
        // record.isMonthlyPerformance = record.isMonthlyPerformance == 1 ? true : false
        this.directPromition = !(this.isEmpty(record.directReferrals) && this.isEmpty(record.totalRecommend))
        this.directDeduction = record.straightPushId ? true : false
        this.marketingGiftBagId = record.memberDesignationGroupId ? true : false
        this.giftTotalSales = !(this.isEmpty(record.giftTotalSales) && this.isEmpty(record.giftTotalSales))
        this.isDefaultChange({
          target: {
            value: record.isDefault
          }
        })
        if (record.marketingGiftBagId) {
          this.giftBagData = [
            {
              id: record.marketingGiftBagId,
              giftName: record.giftName || ''
            }
          ]
          this.giftBagData = [record]
          this.selectedRowKeys = [record.marketingGiftBagId]
          this.giftBagSelectedRowKeys = [record.marketingGiftBagId]
        } else {
          this.giftBagData = []
          this.selectedRowKeys = []
          this.giftBagSelectedRowKeys = []
        }
        // this.custom = record.customRemark ? true : false
        if (record.memberDesignations && !Array.isArray(record.memberDesignations)) {
          record.memberDesignations = record.memberDesignations.split(',')
        }
        this.model = Object.assign({}, record)
      } else {
        this.title = '新增'
        this.lowLevelDividendsOptions = []
      }
      this.visible = true

      setTimeout(() => {
        console.log(this.model)
        this.form.setFieldsValue(this.model)
        this.confirmLoading = false
      }, 1200)
    },
    //购买指定礼包
    marketingGiftBagIdHandleChange(e) {
      let checked = e.target.checked
      // marketingGiftBagId giftTotalSales directPromition  directDeduction
      let allChecked = this.giftTotalSales || this.directPromition || this.directDeduction
      if (!checked) {
        if (!checked && !allChecked) {
          this.$message.warn('请至少选择一个升级条件！')
          this.marketingGiftBagId = true
          return
        }
        this.model.marketingGiftBagId = ''
        this.giftBagData = []
      }
    },
    //团队礼包销售总额
    giftTotalSalesHandleChange(e) {
      let checked = e.target.checked
      let allChecked = this.marketingGiftBagId || this.directPromition || this.directDeduction
      if (!checked) {
        if (!checked && !allChecked) {
          this.$message.warn('请至少选择一个升级条件！')
          this.giftTotalSales = true
          return
        }
        this.model.giftTotalSales = ''
      }
    },
    //直推人数
    directPromitionHandleChange(e) {
      let checked = e.target.checked
      let allChecked = this.marketingGiftBagId || this.giftTotalSales || this.directDeduction
      if (!checked) {
        if (!checked && !allChecked) {
          this.$message.warn('请至少选择一个升级条件！')
          this.directPromition = true
          return
        }
        this.model.directReferrals = ''
        this.model.totalRecommend = ''
      }
    },
    //关联直推
    directDeductionHandleChange(e) {
      let checked = e.target.checked
      let allChecked = this.marketingGiftBagId || this.giftTotalSales || this.directDeduction
      if (!checked) {
        if (!checked && !allChecked) {
          this.$message.warn('请至少选择一个升级条件！')
          this.directDeduction = true
          return
        }
        this.model.straightPushId = ''
        this.model.straightPushProple = ''
        this.model.totalTeams = ''
      }
    },
    // 均分当前称号分红资金
    isAverageHandleChange(e) {
      let checked = e.target.checked
      // && !this.custom
      if (!checked && !this.model.lowLevelDividends && this.showTeamFor) {
        this.$message.warn('请至少选择一个称号特权！')
        this.model.isAverage = true
        return
      }
    },
    //参与低级分红
    lowLevelDividendsHandleChange(e) {
      let checked = e.target.checked
      if (!checked) {
        // && !this.custom
        if (!checked && !this.model.isAverage) {
          this.$message.warn('请至少选择一个称号特权！')
          this.model.lowLevelDividends = true
          return
        }
        this.model.memberDesignations = ''
      }
    },
    //自定义分红
    // customHandleChange(e){
    //   let checked = e.target.checked;
    //   if(!checked){
    //     if(!checked && !this.model.isAverage && !this.model.lowLevelDividends){
    //       this.$message.warn('请至少选择一个称号特权！')
    //       this.custom = true
    //       return;
    //     }
    //     this.model.customRemark = ''
    //   }
    // },
    //月绩效奖励
    // isMonthlyPerformanceHandleChange(e){
    //   let checked = e.target.checked;
    //   if(!checked){
    //     this.model.totalPeoples = ''
    //     this.model.totalPrices = ''
    //     this.model.totalPercent = ''
    //   }
    // },
    //初级达人
    // juniorTalentHandleChange(e){
    //   console.log(e.target.value)
    // },
    close() {
      this.$emit('close')
      this.visible = false
    },
    isEmpty(number) {
      if (number !== undefined && number !== null && number !== '' && number >= 0) {
        return false
      } else {
        return true
      }
    },
    //校验
    allChecked() {
      //      if (this.directPromition) {
      //        if (this.isEmpty(this.model.directReferrals)) {
      //          this.$message.warn('请输入正确的直推人数！')
      //          return false
      //        }
      //        if (this.isEmpty(this.model.totalRecommend)) {
      //          this.$message.warn('请输入正确的总推人数！')
      //          return false
      //        }
      //      }
      //      if (this.directDeduction) {
      //        if (!this.model.straightPushId && this.lowLevelDividendsOptions.length > 0) {
      //          this.$message.warn('请选择对应称号！')
      //          return false
      //        }
      //        if (this.isEmpty(this.model.straightPushProple)) {
      //          this.$message.warn('请输入正确的各有多少人数！')
      //          return false
      //        }
      //        if (this.isEmpty(this.model.totalTeams)) {
      //          this.$message.warn('请输入正确的下属团队人数！')
      //          return false
      //        }
      //      }
      //      if (this.marketingGiftBagId) {
      //        if (!this.model.marketingGiftBagId) {
      //          this.$message.warn('请选择购买指定礼包！')
      //          return false
      //        }
      //      }
      if (this.giftTotalSales) {
        if (this.isEmpty(this.model.giftTotalSales)) {
          this.$message.warn('请输入团队礼包销售总额！')
          return false
        }
      }
      if (this.model.lowLevelDividends && !this.model.memberDesignations && this.lowLevelDividendsOptions.length > 0) {
        this.$message.warn('请选择具体参与低级分红类型！')
        return false
      }
      // if (!this.model.customRemark) {
      //   this.$message.warn('请填写称号规则描述！')
      //   return false
      // }
      // if(this.custom && !this.model.customRemark){
      //   this.$message.warn('请输入自定义特权！')
      //   return false;
      // }
      // if(this.model.isMonthlyPerformance){
      //   if(!this.model.totalPeoples){
      //     this.$message.warn('请输入累计新增推广人数！')
      //     return false;
      //   }
      //   if(!this.model.totalPrices){
      //     this.$message.warn('请输入累计消费额！')
      //     return false;
      //   }
      //   if(!this.model.totalPercent){
      //     this.$message.warn('请输入消费金额百分比！')
      //     return false;
      //   }
      // }
      return true
    },
    handleOk() {
      const that = this
      // 触发表单验证
      if (!this.allChecked()) return
      if (!this.frontCoverFileList || !Array.isArray(this.frontCoverFileList) || this.frontCoverFileList.length <= 0) {
        this.$message.warn('请上传图标！')
        return
      }
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
          values.isDefault = this.isDefault
          let formData = Object.assign(this.model, values)
          //时间格式化
          formData.closeTime = formData.closeTime ? formData.closeTime.format('YYYY-MM-DD HH:mm:ss') : null
          formData.isAverage = formData.isAverage ? 1 : 0
          formData.lowLevelDividends = formData.lowLevelDividends ? 1 : 0
          formData.isBuyGiftbag = formData.isBuyGiftbag ? 1 : 0
          // formData.isMonthlyPerformance = formData.isMonthlyPerformance ? 1 : 0
          if (formData.memberDesignations && formData.memberDesignations.length > 0) {
            formData.memberDesignations = formData.memberDesignations.join(',')
          }
          this.allHandleImg(res => {
            httpAction(httpurl, formData, method)
              .then(res => {
                if (res.success) {
                  that.$message.success(res.message)
                  that.$emit('ok')
                  that.close()
                } else {
                  that.$message.warning(res.message)
                }
              })
              .finally(() => {
                that.confirmLoading = false
              })
          })
        }
      })
    },
    handleCancel() {
      this.close()
    },
    //提交图片的数据处理封装
    async allHandleImg(callback) {
      this.model.logoAddr = await this.beforeSubmitHandleImg('frontCoverFileList')
      callback()
    },
    //提交前的处理图片格式方法（多图）
    beforeSubmitHandleImg(varName) {
      return new Promise((resolve, reject) => {
        let Obj = {},
          result = ''
        console.log(this[varName])
        if (this[varName].length > 0) {
          for (let index = 0; index < this[varName].length; index++) {
            Obj[index] = this[varName][index].response.message
          }
          result = JSON.stringify(Obj)
        } else {
          result = ''
        }
        resolve(result)
      })
    },
    //编辑反显的处理图片格式方法（多图）
    editShowHandleImg(values, varName) {
      let sz = []
      if (values && values != '{}') {
        let result = Object.values(JSON.parse(values))
        for (let index = 0; index < result.length; index++) {
          sz.push({
            uid: index,
            url: this.configure.imgerver + '/' + result[index],
            response: {
              message: result[index]
            }
          })
        }
      }
      this[varName] = sz
    },
    //封面图
    frontCoverCancel() {
      this.frontCoverPreviewVisible = false
    },
    async frontCoverPreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.frontCoverPreviewImage = file.url || file.preview
      this.frontCoverPreviewVisible = true
    },
    frontCoverChange({ fileList }) {
      if (this.frontCoverPic) {
        this.frontCoverFileList = fileList
      }
    },
    frontCoverBeforeUpload(file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      const isLt2M = file.size / 1024 / 1024 < 0.2
      if (!isJpgOrPng) {
        this.$message.error('图片必须为jpeg，png,jpg格式!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在200k以内!')
      }
      this.frontCoverPic = isLt2M && isJpgOrPng
      return isLt2M && isJpgOrPng
    }
  }
}
</script>

<style lang="less" scoped>
.sjtj {
  display: flex;
  align-items: center;
  height: 100%;

  > div {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin-right: 20px;
  }
}
.specialOne {
  width: 65%;
  background: #f2f2f2;
  border: 1px solid #cccccc;
  justify-content: flex-start !important;
  padding: 5px;
  margin-bottom: 5px;
}
.specialThird {
  background: #f2f2f2;
  border: 1px solid #cccccc;
  justify-content: flex-start;
  padding: 0 10px;
  width: 80%;
  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  > div:last-child {
    margin-bottom: 0;
  }
}
.specialTwo {
  width: 35%;
  justify-content: flex-start !important;
}
</style>
