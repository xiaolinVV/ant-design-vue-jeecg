<template>
  <a-card :bordered="false" class="AddMarketingSpecialAreaModal">
    <div class="title">
      {{ title }}
    </div>
    <a-form :form="form" @submit="submit">
      <a-form-item label="专区名称" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          class="ant-input"
          placeholder="请输入"
          v-decorator="['prefectureName', { rules: [{ required: true, message: '请输入专区名称' }] }]"
        />
      </a-form-item>
      <a-form-item label="专区排序" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input-number
          :min="0"
          :precision="0"
          class="ant-input"
          placeholder="数值越小数值展示越前面"
          v-decorator="['sort', { rules: [{ required: true, message: '请输入专区排序' }] }]"
        />
      </a-form-item>
      <a-form-item label="专区标签" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-input
          class="ant-input"
          placeholder="最多4个字"
          v-decorator="[
            'prefectureLabel',
            { rules: [{ required: true, message: '请输入专区标签' }, { max: 4, message: '字数不能超过4个字' }] }
          ]"
        />
      </a-form-item>
      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help="尺寸200*200 支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          <span style="color: red;">
            图标
          </span>
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="iconFileUpload"
          :fileList="iconFileList"
          :headers="headers"
          @change="iconHandleChange"
          @preview="iconHandlePreview"
          listType="picture-card"
        >
          <div v-if="iconFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="iconPreviewVisible" @cancel="iconHandleCancel">
          <img preview="1" :src="iconPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help="尺寸800*640 ，支持jpg、jpeg、png格式，大小不超过2M"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          <span style="color: red;">
            分享图
          </span>
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="shareImgFileUpload"
          :fileList="shareImgFileList"
          :headers="headers"
          @change="shareImgHandleChange"
          @preview="shareImgHandlePreview"
          listType="picture-card"
        >
          <div v-if="shareImgFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="shareImgPreviewVisible" @cancel="shareImgHandleCancel">
          <img preview="1" :src="shareImgPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help="尺寸1428*2540，支持jpg、jpeg、png格式，大小不超过2M。必须预留好二维码位置。以免影响展示效果"
      >
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          <span style="color: red;">
            海报图
          </span>
        </span>
        <a-upload
          :action="uploadAction"
          :beforeUpload="posterFileUpload"
          :fileList="posterFileList"
          :headers="headers"
          @change="posterHandleChange"
          @preview="posterHandlePreview"
          listType="picture-card"
        >
          <div v-if="posterFileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :footer="null" :visible="posterPreviewVisible" @cancel="posterHandleCancel">
          <img preview="1" :src="posterPreviewImage" alt="example" style="width: 100%" />
        </a-modal>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
        <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          专区介绍
        </span>
        <JEditor v-model="allData.prefectureExplain"> </JEditor>

        <!--        <a-textarea v-decorator="['prefectureExplain', { rules: [{ required: true, message: '请设置专区介绍' }] }]"-->
        <!--                    placeholder="专区介绍" :rows="4" style="width: 100%;"/>-->
      </a-form-item>

      <a-form-item
        label="专区分类"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help='说明：若加入专区的商品较少建议选择“无分类”，若分类比较多，可选择"自定义分类"，仅自定义分类可支持全部选项（勾起即支持，小程序端该专区分类标签中将显示全部标签）'
      >
        <!--        @change="onChange"-->
        <a-radio-group
          v-decorator="['isViewType', { rules: [{ required: false, message: '请选择专区分类' }] }]"
          @change="isViewTypeChange"
        >
          <a-radio value="0">无分类</a-radio>
          <a-radio value="1">自定义分类</a-radio>
        </a-radio-group>
        <!--        @change="isViewTypeAllChange"-->
        <a-checkbox :disabled="allData.isViewType != 1" :checked="isAllType" @change="isViewTypeAllChange">
          全部
        </a-checkbox>
      </a-form-item>

      <a-form-item label="专区推荐" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-decorator="['prefectureRecommended', { rules: [{ required: true, message: '请选择专区推荐' }] }]"
          @change="prefectureRecommendedChange"
        >
          <a-radio value="0">不支持</a-radio>
          <a-radio value="1">支持</a-radio>
        </a-radio-group>
        <a-input
          :disabled="allData.prefectureRecommended != 1"
          v-model="allData.prefectureRecommendedAlias"
          placeholder="专区推荐模块的别名"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        label="市场价"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help="说明：市场价即划线价"
      >
        <!--        @change="onChange"-->
        <a-radio-group v-decorator="['isViewMarketPrice', { rules: [{ required: false, message: '请选择市场价' }] }]">
          <a-radio value="0">不显示</a-radio>
          <a-radio value="1">显示</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item
        label="专区商品限制"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
        help="说明：不限制：即加入该专区内的商品不受价格约束限制；限制，即能加入该专区的商品都是成本低于销售价限定比例的商品；"
      >
        <a-radio-group
          v-decorator="['astrictGood', { rules: [{ required: false, message: '请选择专区商品限制' }] }]"
          @change="commodityRestrictionChange"
        >
          <a-radio value="0">不限制</a-radio>
          <a-radio value="1">
            成本价低于销售价
            <a-input
              style="width: 100px"
              type="number"
              placeholder="请输入"
              :disabled="allData.astrictGood != 1"
              v-model="allData.astrictPriceProportion"
            />
            %
          </a-radio>
        </a-radio-group>
      </a-form-item>

      <!--      <a-form-item label="专区价限制" :label-col="labelCol" :wrapper-col="wrapperCol"-->
      <!--      >-->
      <!--        不低于销售价-->
      <!--        <a-input-->
      <!--          style="width: 100px"-->
      <!--          type="number"-->
      <!--          placeholder="请输入"-->
      <!--          v-decorator="['prefecturePriceProportion', { rules: [{ required: true, message: '请设置专区价限制' },{validator:validatePriceLimit}] }]"-->
      <!--          @change="prefecturePriceProportionChange"-->
      <!--        />-->
      <!--        %-->
      <!--        <span style="margin-left: 15px">-->
      <!--          说明：加入专区的商品在设置专区价时，不得设置低于销售价{{allData.prefecturePriceProportion}}%价格作为该商品的专区价，<span-->
      <!--          style="color: red;">最少为10%</span>-->
      <!--        </span>-->
      <!--      </a-form-item>-->
      <a-form-item label="专区价比例" :label-col="labelCol" :wrapper-col="wrapperCol">
        销售价*
        <a-input-number
          style="width: 100px"
          :min="0"
          :precision="0"
          placeholder="请输入专区价比例"
          v-decorator="['prefecturePriceProportion', { rules: [{ required: true, message: '请设置专区价比例' }] }]"
        />
        %作为默认专区价，专区内商品可再单独定价
      </a-form-item>


      <a-form-item label="优惠券抵扣" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group v-decorator="['isDiscount', { rules: [{ required: false, message: '请选择优惠券抵扣' }] }]">
          <a-radio value="0">不支持</a-radio>
          <a-radio value="1">
            支持
          </a-radio>
        </a-radio-group>
        <span style="margin-left: 15px;">
          说明：不支持：即加入该专区的商品不可使用优惠券；支持：即加入该专区的商品若有优惠券就可以使用，<span
            style="color:red"
            >使用该配置项建议严格核准所加入的商品，减少不必要的损失</span
          >
        </span>
      </a-form-item>

      <a-form-item label="福利金抵扣" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-decorator="['isWelfare', { rules: [{ required: false, message: '请选择福利金抵扣' }] }]"
          @change="welfareWarePaymentChange"
        >
          <a-radio value="0">不支持福利金抵扣</a-radio>
          <a-radio value="1">
            福利金全额抵扣
          </a-radio>
          <a-radio value="2">
            福利金限额抵扣，最高可抵扣
            <a-input
              style="width: 100px"
              type="number"
              placeholder="请输入"
              :disabled="allData.isWelfare != 2"
              v-model="allData.bigWelfareProportion"
            />
            %
          </a-radio>
          <a-radio value="3">
            福利金限额抵扣，最高可抵扣(按利润额)
            <a-input
              style="width: 100px"
              type="number"
              placeholder="请输入"
              :disabled="allData.isWelfare != 3"
              v-model="allData.bigWelfareProportion"
            />
            %
          </a-radio>
          <a-checkbox v-model="allData.isVipLower" :disabled="allData.isWelfare == 0 || allData.isWelfare == 1">
            vip免福利金抵扣
          </a-checkbox>
        </a-radio-group>
        <p>
          说明：不支持：即该专区内的商品专区价不能用福利金抵扣；全额抵扣：即该专区的商品专区价可以用福利金全抵，<span
            style="color:red"
            >使用该配置项建议严格核准所加入的商品，减少不必要的损失</span
          >；限额抵扣（按专区价）：即该专区的商品专区价可用福利金抵扣部分价格，<span style="color:red">
            使用该配置项建议严格核准所加入的商品，减少不必要的损失</span
          >；
          限额抵扣（按利润额）：即该专区的商品（专区价-供货价）*（1-抵扣比例）可用福利金抵扣。该比例为默认比例，加入该专区的商品默认按照此比例执行，可另行修改。vip免福利金抵扣：vip会员不需要支付福利金直接按照最高抵扣后的价格购买（仅福利金限额抵扣可开启此项）
          <span style="color:red">使用该配置项建议严格核准所加入的商品，减少不必要的损失</span>。
        </p>
      </a-form-item>
      <a-form-item label="附加支付方式" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- v-decorator="['isIntegral', { rules: [{ required: false, message: '请选择支付方式' }] }]" -->
        <a-checkbox v-model="allData.isIntegral">
          {{ welfareBabelName }}
        </a-checkbox>

        <a-input-number
          style="width: 100px"
          placeholder="请输入默认比例"
          v-model="allData.proportionIntegral"
          :disabled="allData.isIntegral!= 1"
        />%

        <span style="margin-left: 15px;">
          说明：开启附加支付方式后，该专区商品无法加入购物车
        </span>
      </a-form-item>
      <a-form-item label="移除支付方式" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-checkbox v-model="allData.removePay">
          余额
        </a-checkbox>
        <span style="margin-left: 15px;">
          说明：开启移除支付方式后，该专区商品无法加入购物车
        </span>
      </a-form-item>
      <a-form-item label="赠送福利金" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-decorator="['isGiveWelfare', { rules: [{ required: false, message: '请选择赠送福利金' }] }]"
          @change="sendWarePaymentChange"
        >
          <a-radio value="0">不支持</a-radio>
          <a-radio value="1">
            最高可送
            <a-input
              style="width: 100px"
              type="number"
              placeholder="请输入"
              v-model="allData.bigGiveWelfareProportion"
              :disabled="allData.isGiveWelfare != 1"
            />
            %
          </a-radio>
        </a-radio-group>
        <span style="margin-left: 15px;">
          说明：不支持：即加入该专区的商品售出时不送福利金；支持：即加入该专区的商品售出时可送
          实付款*可送比例的福利金，加入该专区的商品赠送比例不得超过该比例，<span style="color:red"
            >若该专区商品支持福利金抵扣，建议下单后不送福利金。使用该配置项建议严格核准所加入的商品，减少不必要的损失</span
          >
        </span>
      </a-form-item>

      <a-form-item label="专区购买限制" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-decorator="['buyLimit', { rules: [{ required: false, message: '请选择专区购买限制' }] }]"
          @change="prefrectureBuyLimitChange"
        >
          <a-radio value="0">商品自定义限购</a-radio>
          <a-radio value="1">
            专区限购
            <a-input-number
              style="width: 100px"
              :min="0"
              :precision="0"
              placeholder="请输入专区限购"
              v-model="allData.limitCount"
              :disabled="allData.buyLimit != 1"
            />
            件
          </a-radio>
        </a-radio-group>
        <span style="margin-left: 15px;">
          说明：专区限购N件，即一个账号，再本专区只能买N件商品（不论什么商品或者规格都算1件）,且该专区的商品无法加入购物车；商品自定义限购：即专区不限制，由添加的专区商品进行限制，如A商品限购1件，则在这个专区内，一个用户A商品就只能买1件（不论什么规格）
          。
        </span>
      </a-form-item>

      <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" class="line-special" label="购买人限制">
        <!--          v-model="AllData.buyLimit"-->
        <div style="display: flex;align-items: center;height: 39px;">
          <a-checkbox-group
            :options="plainOptions"
            @change="buyLimitOfGradeChange"
            v-decorator="[
              'buyerLimit',
              {
                rules: [
                  {
                    required: true,
                    message: '请选择购买人限制!'
                  }
                ]
              }
            ]"
          />
          <div
            v-if="vipList.length > 0"
            style="background: #F2F2F2;height: 100%;display: flex;align-items: center;padding: 0 15px;"
          >
            <!--  vip等级-->
            <!--              v-model="AllData.buyVipMemberGradeId"-->
            <a-checkbox-group
              :options="vipList"
              v-model="allData.buyVipMemberGradeId"
              :disabled="buyLimitChangeValueDisabled"
            />
            <div style="margin-left: 20px">
              说明：不勾选vip等级，即不针对vip等级限制。勾选vip等级，即针对vip等级进行限制。
            </div>
          </div>
        </div>
      </a-form-item>

      <a-form-item label="有效期" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-radio-group
          v-decorator="['validTime', { rules: [{ required: false, message: '请选择赠送福利金' }] }]"
          @change="validityChange"
        >
          <a-radio value="0">永久有效</a-radio>
          <a-radio value="1">
            短期有效
          </a-radio>
        </a-radio-group>
        <span>
          说明：永久有效：即在开始时间后，该专区正式运营，用户可访问，无结束时间；短期有效：即在开始时间后，该专区正式运营，用户可访问，超过结束时间后自动下架该专区，用户无法访问。
        </span>
      </a-form-item>

      <a-form-item
        label="是否团队成员"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        validate-status="validating"
      >
        <!--        @change="onChange"-->
        <a-radio-group v-decorator="['isDesignation', { rules: [{ required: false, message: '请选择是否' }] }]">
          <a-radio value="0" default-checked="true">否</a-radio>
          <a-radio value="1">是</a-radio>
        </a-radio-group>
      </a-form-item>


      <a-form-item label="开始时间" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!--        :disabled="AllData.vouchersWay!=0" -->
        <a-date-picker v-decorator="['startTime', { rules: [{ required: true, message: '请选择开始时间' }] }]" format="YYYY-MM-DD HH:mm:ss" :show-time="{ format: 'HH:mm:ss' }" />
      </a-form-item>
      <a-form-item label="结束时间" :label-col="labelCol" :wrapper-col="wrapperCol" v-if="allData.validTime == 1">
        <!--        :disabled="AllData.vouchersWay!=0" -->
        <a-date-picker
          v-decorator="[
            'endTime',
            { rules: [{ required: allData.validTime == 1 ? true : false, message: '请选择结束时间' }] }
          ]"
          format="YYYY-MM-DD HH:mm:ss"
          :show-time="{ format: 'HH:mm:ss' }"
        />
      </a-form-item>
      <a-form-item label="备注说明" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!--        :disabled="AllData.vouchersWay!=0" -->
        <a-textarea
          v-decorator="['remark', { rules: [{ required: false, message: '请设置备注说明' }] }]"
          placeholder="备注说明"
          :rows="4"
          style="width: 100%;"
        />
      </a-form-item>
      <a-button type="primary" html-type="submit" style="margin: 0 auto;display: block">
        提交
      </a-button>
    </a-form>
  </a-card>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import dayjs from 'dayjs'
import { httpAction, getAction, postAction, putAction } from '@/api/manage'
import { initDictOptions, filterDictText } from '@/components/dict/JDictSelectUtil'
import JEditor from '@/components/jeecg/JEditor'
function isEmpty(obj) {
  if (typeof obj == 'undefined' || obj == null || obj == '') {
    return true
  } else {
    return false
  }
}

export default {
  name: 'AddMarketingSpecialAreaModal',
  data() {
    return {
      form: '',
      labelCol: { span: 2 },
      wrapperCol: { span: 18 },
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      headers: '',
      title: '创建专区',
      //配置
      configure: {
        imgErver: window._CONFIG['domianURL'] + '/sys/common/view'
      },
      plainOptions: ['普通会员', 'vip会员'],
      //会员等级列表
      vipList: [],
      //图标上传配置
      iconFileList: [],
      iconPreviewImage: [],
      iconPreviewVisible: false,
      iconFilePic: true,
      //分享图上传配置
      shareImgFileList: [],
      shareImgPreviewImage: [],
      shareImgPreviewVisible: false,
      shareImgFilePic: true,
      //海报图上传配置
      posterFileList: [],
      posterPreviewImage: [],
      posterPreviewVisible: false,
      posterFilePic: true,
      isAllType: false,
      //创建专区的默认数据
      allData: {
        astrictGood: '0',
        isWelfare: '0',
        isGiveWelfare: '0',
        isIntegral: '0',
        proportionIntegral:'0',
        removePay:'0',
        buyLimit: '0',
        buyerLimit: [],
        validTime: '0',
        isViewMarketPrice: '1',
        prefectureName: '',
        sort: '',
        prefectureLabel: '',
        prefectureExplain: '',
        //福利金抵扣额
        bigWelfareProportion: '',
        //赠送福利金
        bigGiveWelfareProportion: '',
        //专区限购
        limitCount: '',
        //专区商品 成本价低于销售价
        astrictPriceProportion: '',
        isViewType: '0',
        prefectureRecommended: '0',
        prefectureRecommendedAlias: '',
        prefecturePriceProportion: 10,
        isDiscount: '0',
        startTime: '',
        endTime: '',
        remark: '',
        isVipLower: false,
        isAllType: 0,
        buyVipMemberGradeId: [],
        isDesignation:0
      },
      buyLimitChangeValueDisabled: true, //购买限制选择值（交互用）
      //日期选择器返现参数
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      url: {
        add: '/marketingPrefecture/marketingPrefecture/add',
        edit: '/marketingPrefecture/marketingPrefecture/edit',
        //返回会员等级
        findMemberGradeList: 'memberGrade/memberGrade/findMemberGradeList'
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
  async mounted() {
    //会员等级返显
    this.initDictConfig()
    await this.findMemberGradeList()
    let marketingSpecialAreaLocalStorage = localStorage.getItem('marketingSpecialArea')
    if (marketingSpecialAreaLocalStorage) {
      marketingSpecialAreaLocalStorage = JSON.parse(marketingSpecialAreaLocalStorage)
      marketingSpecialAreaLocalStorage.startTime = moment(marketingSpecialAreaLocalStorage.startTime, this.dateFormat)
      if (marketingSpecialAreaLocalStorage.endTime) {
        marketingSpecialAreaLocalStorage.endTime = moment(marketingSpecialAreaLocalStorage.endTime, this.dateFormat)
      } else {
        marketingSpecialAreaLocalStorage.endTime = ''
      }
      if (marketingSpecialAreaLocalStorage.isIntegral == 1) {
        marketingSpecialAreaLocalStorage.isIntegral = true
      } else {
        marketingSpecialAreaLocalStorage.isIntegral = false
      }
      if (marketingSpecialAreaLocalStorage.removePay == 1) {
        marketingSpecialAreaLocalStorage.removePay = true
      } else {
        marketingSpecialAreaLocalStorage.removePay = false
      }
      if (marketingSpecialAreaLocalStorage.buyerLimit) {
        marketingSpecialAreaLocalStorage.buyerLimit = marketingSpecialAreaLocalStorage.buyerLimit.split(',')
        if (marketingSpecialAreaLocalStorage.buyerLimit.indexOf('1') != -1) {
          this.buyLimitChangeValueDisabled = false
        } else {
          this.buyLimitChangeValueDisabled = true
        }
      } else {
        marketingSpecialAreaLocalStorage.buyerLimit = []
      }
      if (!marketingSpecialAreaLocalStorage.buyVipMemberGradeId) {
        marketingSpecialAreaLocalStorage.buyVipMemberGradeId = []
      } else {
        marketingSpecialAreaLocalStorage.buyVipMemberGradeId = marketingSpecialAreaLocalStorage.buyVipMemberGradeId.split(
          ','
        )
      }
      this.iconFileList = [
        {
          uid: 0,
          response: {
            message: Object.values(JSON.parse(marketingSpecialAreaLocalStorage.logoAddr))[0]
          },
          url: this.configure.imgErver + '/' + Object.values(JSON.parse(marketingSpecialAreaLocalStorage.logoAddr))[0]
        }
      ]
      this.shareImgFileList = [
        {
          uid: 0,
          response: {
            message: Object.values(JSON.parse(marketingSpecialAreaLocalStorage.coverPlan))[0]
          },
          url: this.configure.imgErver + '/' + Object.values(JSON.parse(marketingSpecialAreaLocalStorage.coverPlan))[0]
        }
      ]
      this.posterFileList = [
        {
          uid: 0,
          response: {
            message: Object.values(JSON.parse(marketingSpecialAreaLocalStorage.posters))[0]
          },
          url: this.configure.imgErver + '/' + Object.values(JSON.parse(marketingSpecialAreaLocalStorage.posters))[0]
        }
      ]
      if (marketingSpecialAreaLocalStorage.isVipLower == 1) {
        marketingSpecialAreaLocalStorage.isVipLower = true
      } else {
        marketingSpecialAreaLocalStorage.isVipLower = false
      }
      if (marketingSpecialAreaLocalStorage.isAllType == 1) {
        this.isAllType = true
      } else {
        this.isAllType = false
      }
      this.title = '修改专区'
    } else {
      marketingSpecialAreaLocalStorage = this.allData
    }
    // debugger;
    this.form = this.$form.createForm(this)
    console.log(marketingSpecialAreaLocalStorage)
    this.$nextTick(() => {
      this.allData = marketingSpecialAreaLocalStorage
      setTimeout(() => {
        this.form.setFieldsValue(marketingSpecialAreaLocalStorage)
      }, 250)
    })
  },
  methods: {
    moment,
    initDictConfig() {
      initDictOptions('member_type').then(res => {
        if (res.success) {
          for (let item of res.result) {
            item.label = item.title
          }
          this.plainOptions = res.result
        }
      })
    },
    //购买限制vip特权变化（交互）
    buyLimitOfGradeChange(checkedValues) {
      if (checkedValues.length > 0 && checkedValues.indexOf('1') != -1) {
        this.buyLimitChangeValueDisabled = false
      } else {
        this.buyLimitChangeValueDisabled = true
        this.allData.buyVipMemberGradeId = []
      }
    },
    findMemberGradeList() {
      let that = this
      return new Promise((resolve, reject) => {
        getAction(that.url.findMemberGradeList).then(res => {
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
    //提交表单
    submit(e) {
      e.preventDefault()
      if (!this.dataCheck()) {
        return false
      }
      this.form.validateFields((err, values) => {
        console.log(values)
        if (!err) {
          values.startTime = dayjs(values.startTime).format(this.dateFormat)
          values.endTime = dayjs(values.endTime).format(this.dateFormat)
          values.logoAddr = JSON.stringify({ 0: this.iconFileList[0].response.message })
          values.coverPlan = JSON.stringify({ 0: this.shareImgFileList[0].response.message })
          values.posters = JSON.stringify({ 0: this.posterFileList[0].response.message })
          values = Object.assign({}, this.allData, values)
          if (values.buyVipMemberGradeId && values.buyVipMemberGradeId.length > 0) {
            values.buyVipMemberGradeId = values.buyVipMemberGradeId.join(',')
          } else {
            values.buyVipMemberGradeId = ''
          }
          if (values.buyerLimit) {
            values.buyerLimit = values.buyerLimit.join(',')
          }
          if (values.isVipLower) {
            values.isVipLower = 1
          } else {
            values.isVipLower = 0
          }
          if (values.isIntegral) {
            values.isIntegral = 1
          } else {
            values.isIntegral = 0
          }
          if (values.removePay) {
            values.removePay = 1
          } else {
            values.removePay = 0
          }
          let apiUrl = this.url.add
          let that = this
          if (this.title == '修改专区') {
            this.$confirm({
              title: '确定要修改专区吗？',
              onOk() {
                apiUrl = that.url.edit
                putAction(apiUrl, values).then(res => {
                  if (res.success) {
                    that.$message.success(res.message)
                    that.$router.push('/marketing/MarketingPrefectureList')
                    return
                  }
                  that.$message.warn(res.message)
                })
                return
              },
              onCancel() {
                console.log('Cancel')
              },
              class: 'test'
            })
            return
          }
          values.status = 1
          postAction(apiUrl, values).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.$router.push('/marketing/MarketingPrefectureList')
              return
            }
            that.$message.warn(res.message)
          })
        }
      })
    },
    isViewTypeAllChange(e) {
      this.isAllType = e.target.checked
      if (e.target.checked) {
        this.allData.isAllType = 1
      } else {
        this.allData.isAllType = 0
      }
      console.log(e.target.checked)
    },
    isViewTypeChange(e) {
      this.allData.isViewType = e.target.value
    },
    prefectureRecommendedChange(e) {
      this.allData.prefectureRecommended = e.target.value
    },
    prefecturePriceProportionChange(e) {
      console.log(e)
      this.allData.prefecturePriceProportion = e.target.value
    },
    validatePriceLimit(rule, value, callback) {
      if (value < 10) {
        callback('专区价最低为10%')
      }
      callback()
    },
    //图标上传验证
    iconFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.iconFilePic = isLt2M
      return isLt2M && fileType
    },
    //图标上传
    iconHandleChange({ fileList }) {
      if (fileList.length <= 0) {
        this.iconFileList = []
        return
      }
      if (
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      ) {
        this.iconFileList = fileList
      }
    },
    //图标预览
    iconHandlePreview(file) {
      this.iconPreviewImage = file.url || file.thumbUrl
      this.iconPreviewVisible = true
    },
    //图标取消预览
    iconHandleCancel() {
      this.iconPreviewVisible = false
    },

    //分享图上传验证
    shareImgFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.shareImgFilePic = isLt2M
      return isLt2M && fileType
    },
    //分享图上传
    shareImgHandleChange({ fileList }) {
      if (fileList.length <= 0) {
        this.shareImgFileList = []
        return
      }
      if (
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      ) {
        this.shareImgFileList = fileList
      }
    },
    //分享图预览
    shareImgHandlePreview(file) {
      this.shareImgPreviewImage = file.url || file.thumbUrl
      this.shareImgPreviewVisible = true
    },
    //分享图取消预览
    shareImgHandleCancel() {
      this.shareImgPreviewVisible = false
    },

    //海报图上传验证
    posterFileUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      const fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!fileType) {
        this.$message.error('请上传jpg、jpeg、png格式的图片')
      }
      if (!isLt2M) {
        this.$message.error('图片大小必须在2M以内!')
      }
      this.posterFilePic = isLt2M
      return isLt2M && fileType
    },
    //海报图上传
    posterHandleChange({ fileList }) {
      if (fileList.length <= 0) {
        this.posterFileList = []
        return
      }
      if (
        fileList[0].size / 1024 / 1024 < 2 &&
        (fileList[0].type === 'image/jpeg' || fileList[0].type === 'image/png' || fileList[0].type === 'image/jpg')
      ) {
        this.posterFileList = fileList
      }
    },
    //海报图预览
    posterHandlePreview(file) {
      this.posterPreviewImage = file.url || file.thumbUrl
      this.posterPreviewVisible = true
    },
    //海报图取消预览
    posterHandleCancel() {
      this.posterPreviewVisible = false
    },
    //专区商品限制选择
    commodityRestrictionChange(e) {
      this.allData.astrictGood = e.target.value
    },
    //福利金抵扣选择
    welfareWarePaymentChange(e) {
      if (e.target.value == 0 || e.target.value == 1) {
        this.allData.isVipLower = false
      }
      this.allData.isWelfare = e.target.value
    },
    //赠送福利金选择
    sendWarePaymentChange(e) {
      this.allData.isGiveWelfare = e.target.value
    },
    prefrectureBuyLimitChange(e) {
      this.allData.buyLimit = e.target.value
    },
    //有效期选择
    validityChange(e) {
      this.allData.validTime = e.target.value
    },
    //校验
    dataCheck() {
      if (!this.iconFileList || this.iconFileList.length <= 0) {
        this.$message.warn('请上传图标')
        return false
      }
      if (!this.shareImgFileList || this.shareImgFileList.length <= 0) {
        this.$message.warn('请上传分享图')
        return false
      }
      if (!this.posterFileList || this.posterFileList.length <= 0) {
        this.$message.warn('请上传分享图')
        return false
      }
      //专区介绍
      if (!this.allData.prefectureExplain) {
        this.$message.warn('请设置专区介绍')
        return false
      }
      //专区商品限制校验
      if (this.allData.astrictGood == 1 && isEmpty(this.allData.astrictPriceProportion)) {
        this.$message.warn('请设置专区商品限制百分比')
        return false
      } else if (this.allData.astrictPriceProportion < 0) {
        this.$message.warn('请设置正确的专区商品限制百分比')
        return false
      }
      //福利金抵扣校验
      if (this.allData.isWelfare == 2 && isEmpty(this.allData.bigWelfareProportion)) {
        this.$message.warn('请设置福利金抵扣百分比')
        return false
      } else if (this.allData.bigWelfareProportion < 0) {
        this.$message.warn('请设置正确的福利金抵扣百分比')
        return false
      }

      //赠送福利金校验
      if (this.allData.isGiveWelfare == 1 && isEmpty(this.allData.bigGiveWelfareProportion)) {
        this.$message.warn('请设置赠送福利金百分比')
        return false
      } else if (this.allData.bigGiveWelfareProportion < 0) {
        this.$message.warn('请设置正确的赠送福利金百分比')
        return false
      }
      //专区限购校验
      if (this.allData.buyLimit == 1 && isEmpty(this.allData.limitCount)) {
        this.$message.warn('请设置专区限购件数')
        return false
      } else if (this.allData.limitCount < 0) {
        this.$message.warn('请设置正确的专区限购件数')
        return false
      }
      //专区别名
      if (this.allData.prefectureRecommended == 1 && !this.allData.prefectureRecommendedAlias) {
        this.$message.warn('请填写专区推荐模块的别名！')
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less">
.AddMarketingSpecialAreaModal {
	.ant-input {
		width: 250px;
	}

	.title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ccc;
		width: 100%;
		height: 50px;
		font-weight: 700;
		font-size: 18px;
		color: black;
	}
}

</style>
