<!--新增-弹出页面-->
<template>
  <div>
    <a-modal
      v-if="title != '排序'"
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺编号">
            <a-input placeholder="" disabled v-decorator="['id', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺账号">
            <a-input placeholder="" disabled v-decorator="['userName', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="老板姓名">
            <!--                v-model='model.bossName'-->
            <a-input
              placeholder="请输入老板姓名"
              disabled
              v-decorator="[
                'bossName',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入老板姓名!'
                    },
                    {
                      pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/,
                      message: '请输入正确的老板姓名！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="老板手机">
            <!--                v-model='model.bossPhone'-->
            <a-input
              placeholder="请输入老板手机"
              disabled
              v-decorator="[
                'bossPhone',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入老板手机号!'
                    },
                    {
                      pattern: /^1[3456789]\d{9}$/,
                      message: '请输入正确的老板手机号！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="门店名称">
            <!--                v-model='model.storeName'-->
            <a-input
              placeholder="请输入门店名称"
              v-decorator="[
                'storeName',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入门店名称!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分店名称">
            <a-input placeholder="请输入分店名称" v-model="model.subStoreName" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="logo">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange"
              v-decorator="[
                'logoAddrPic',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请上传logo!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="logoAddrPic"
                :src="getLogoAddrView()"
                alt="上传Logo"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="门脸照">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange1"
              v-decorator="[
                'storePicturePic',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请上传门脸照!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="storePicturePic"
                :src="getStorePictureView()"
                alt="上传门脸照"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadActiong ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店内照">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange7"
            >
              <!--v-decorator="[-->
              <!--'accordingStorePic',-->
              <!--{-->
              <!--rules: [-->
              <!--{-->
              <!--required: visible,-->
              <!--message: '请上传店内照!',-->
              <!--}-->
              <!--],-->
              <!--},-->
              <!--]"-->
              <img
                preview="1"
                v-if="accordingStorePic"
                :src="getAccordingStoreView()"
                alt="上传店内照"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <!--<a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="区域id">
            <a-input placeholder="请输入区域id" v-decorator="['sysAreaId', {}]"/>
          </a-form-item>-->
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="所在城市">
            <a-cascader
              :options="cityAllData"
              @change="cityAllDataChange"
              :loadData="cityAllDataLoad"
              changeOnSelect
              v-decorator="[
                'defaultCity',
                {
                  initialValue: defaultCity,
                  rules: [
                    {
                      required: true,
                      message: '请选择所在城市!'
                    }
                  ]
                }
              ]"
              v-if="canShowDefaultCity"
              placeholder="请选择区域"
            />
            <!--<a-input placeholder="请输入城市区域地址说明" v-decorator="['areaAddress', {}]"/>-->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="门店详细地址">
            <!--                v-model="model.storeAddress"-->
            <a-input
              placeholder="请输入门店详细地址"
              @blur="getLngAndLat"
              v-decorator="[
                'storeAddress',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入门店详细地址!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主体类型">
            <!--                v-model='model.straight'-->
            <a-select
              placeholder="请选择主体类型"
              v-decorator="[
                'straight',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请选择主体类型!'
                    }
                  ]
                }
              ]"
            >
              <a-select-option value="0">个体</a-select-option>
              <a-select-option value="1">企业或个体户</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="主营分类">
            <!--                v-model='model.mainType'-->
            <j-dict-select-tag
              placeholder="请选择主营分类"
              v-decorator="[
                'mainType',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请选择主营分类!'
                    }
                  ]
                }
              ]"
              :triggerChange="true"
              dictCode="store_main_type"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="客服电话">
            <!--                v-model='model.takeOutPhone'-->
            <a-input
              placeholder="请输入客服电话"
              v-decorator="[
                'takeOutPhone',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入客服电话!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开通类型">
            <!--                v-model='model.openType'-->
            <j-dict-select-tag
              v-decorator="[
                'openType',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请选择开通类型!'
                    }
                  ]
                }
              ]"
              :triggerChange="true"
              placeholder="请选择开通类型"
              dictCode="store_open_type"
              @change="openTypeChange"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="支付状态">
            <!--                v-model='model.payStatus'-->
            <a-select
              placeholder="请选择支付状态"
              v-decorator="[
                'payStatus',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请选择支付状态!'
                    }
                  ]
                }
              ]"
            >
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="0">未支付</a-select-option>
              <a-select-option value="1">已支付</a-select-option>
              <a-select-option value="2">免支付</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="开通时间">
            <!--                v-model='model.startTime'-->
            <a-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="[
                'startTime',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请选择开通时间!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="到期时间" v-if="model.openType == 0">
            <!--                v-model='model.endTime'-->
            <a-date-picker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="[
                'endTime',
                {
                  rules: [
                    {
                      required: model.openType == 0 && visible ? true : false,
                      message: '请选择到期时间!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <a-modal
      v-if="title == '排序'"
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="排序">
            <a-input-number
              placeholder="请输入排序"
              :min="0"
              :precision="0"
              style="width:200px"
              v-decorator="[
                'sort',
                {
                  rules: [
                    {
                      required: visible,
                      message: '请输入排序!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--证件信息-->
    <a-modal
      :title="title"
      :width="800"
      :visible="CertificateVisible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="关闭"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺编号">
            <a-input placeholder="" disabled v-decorator="['id', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="店铺账号">
            <a-input placeholder="" disabled v-decorator="['userName', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="model.straight == 1" label="统一信用代码">
            <!--                v-model='model.socialCreditCode'-->
            <a-input
              placeholder="请输入统一信用代码"
              v-decorator="[
                'socialCreditCode',
                {
                  rules: [
                    {
                      required: model.straight == 1 && CertificateVisible ? true : false,
                      message: '请输入统一信用代码!'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-if="model.straight == 1"
            label="企业营业执照图片"
          >
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange2"
              v-decorator="[
                'licenseForEnterprisePic',
                {
                  rules: [
                    {
                      required: model.straight == 1 && CertificateVisible ? true : false,
                      message: '请上传企业营业执照图片!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="licenseForEnterprisePic"
                :src="getLicenseForEnterpriseView()"
                alt="上传企业营业执照图片"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="经办人类型">
            <!--                v-model='model.agentType'-->
            <a-select
              placeholder="请选择经办人类型"
              @change="personInCharge"
              v-decorator="[
                'agentType',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请选择经办人类型!'
                    }
                  ]
                }
              ]"
            >
              <a-select-option value="0">代办人</a-select-option>
              <a-select-option value="1" v-if="this.model.straight == 0">本人</a-select-option>
              <a-select-option value="2" v-if="this.model.straight == 1">法人本人</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
            <!--                v-model='model.agentName'-->
            <a-input
              placeholder="请输入姓名"
              v-decorator="[
                'agentName',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请输入姓名!'
                    },
                    {
                      pattern: /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/,
                      message: '请输入正确的姓名！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证号码">
            <!--                v-model='model.idCode'-->
            <a-input
              placeholder="请输入身份证号码"
              v-decorator="[
                'idCode',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请输入身份证号码!'
                    },
                    {
                      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                      message: '请输入正确的身份证号码！'
                    }
                  ]
                }
              ]"
            />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证正面照片">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange3"
              v-decorator="[
                'idPictureZPic',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请上传身份证正面照片!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="idPictureZPic"
                :src="getIdPictureZView()"
                alt="上传身份证正面照片"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="身份证反面照片">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange4"
              v-decorator="[
                'idPictureFPic',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请上传身份证反面照片!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="idPictureFPic"
                :src="getIdPictureFView()"
                alt="上传身份证反面照片"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手持身份证照片">
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange5"
              v-decorator="[
                'idHandPic',
                {
                  rules: [
                    {
                      required: CertificateVisible,
                      message: '请上传手持身份证照片!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="idHandPic"
                :src="getIdHandView()"
                alt="上传手持身份证照片"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item
            v-if="model.agentType == 0"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="代办人授权书照片"
          >
            <a-upload
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              :action="uploadAction"
              :data="{ isup: 1 }"
              :headers="headers"
              :beforeUpload="beforeUpload"
              @change="handleChange6"
              v-decorator="[
                'agentAuthorizationPic',
                {
                  rules: [
                    {
                      required: model.agentType == 0 && CertificateVisible ? true : false,
                      message: '请上传代办人授权书照片!'
                    }
                  ]
                }
              ]"
            >
              <img
                preview="1"
                v-if="agentAuthorizationPic"
                :src="getAgentAuthorizationView()"
                alt="上传授权书照片"
                style="height:104px;max-width:300px"
              />
              <div v-else>
                <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
    <!--启动停用弹窗-->
    <a-modal
      title="停用店铺后，店铺商品、订单、资金模块都将无法访问"
      v-model="storeStatus"
      @ok="updataStatusAndCloseEplain()"
      okText="确认"
      cancelText="取消"
    >
      <p>您确定要停用吗？</p>
      <a-textarea placeholder="停用原因" v-model="explainInfo.closeExplain" :autosize="{ minRows: 3, maxRows: 6 }" />
    </a-modal>
    <a-modal
      :title="title"
      v-model="promoterStatus"
      :width="800"
      @cancel="handleCancel"
      @ok="handleOk"
      okText="确认"
      cancelText="取消"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原推广人">
            {{ model.StorePromoter || '' }}
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新推广人类型">
            <a-radio-group
              name="radioGroup"
              v-decorator="['promoterType', { rules: [{ required: true, message: '请选择新推广人类型' }] }]"
              @change="promoterTypeChange"
            >
              <a-radio value="2">
                平台
              </a-radio>
              <a-radio value="1">
                会员
              </a-radio>
              <a-radio value="0">
                店铺
              </a-radio>
              <a-radio value="3">
                加盟商
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="promoterLabelName + '编号'"
            v-if="model.promoterType != 2"
          >
            <a-input
              v-decorator="[
                'promoter',
                { rules: [{ required: true, message: '请输入' + promoterLabelName + '编号' }] }
              ]"
              @change="promoterChange"
            ></a-input>
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            :label="promoterLabelName + '信息'"
            v-if="model.promoterType != 2"
          >
            <a-spin :spinning="searchPromoterInformation">
              <span v-if="!model.promoter"> 请输入{{ promoterLabelName }}编号 </span>
              <span v-else>
                {{ promoterInformation }}
              </span>
            </a-spin>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注说明">
            <a-textarea
              placeholder="请输入备注说明"
              v-decorator="['remark', { rules: [{ required: false, message: '请输入备注说明' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      :title="title"
      v-model="franchiseeStatus"
      @cancel="handleCancel"
      @ok="handleOk"
      okText="确认"
      cancelText="取消"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原归属加盟商">
            <div style="color: red;">
              {{ model.allianceName || '' }}
            </div>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有无加盟商">
            <a-radio-group
              name="radioGroup"
              v-decorator="['ifAlliance', { rules: [{ required: true, message: '请选择有无加盟商' }] }]"
              @change="franchiseeTypeChange"
            >
              <a-radio value="1">
                有
              </a-radio>
              <a-radio value="0">
                无
              </a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="新加盟商编号" v-if="model.ifAlliance == 1">
            <a-input
              placeholder="请输入加盟商编号"
              v-decorator="['allianceId', { rules: [{ required: true, message: '请输入新加盟商编号' }] }]"
              @change="ifAllianceChange"
            ></a-input>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="加盟商信息" v-if="model.ifAlliance == 1">
            <a-spin :spinning="searchPromoterInformation">
              <span v-if="!model.allianceId">
                请输入新店铺编号编号
              </span>
              <span v-else>
                {{ promoterInformation }}
              </span>
            </a-spin>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注说明">
            <a-textarea
              placeholder="请输入备注说明"
              v-decorator="['remark', { rules: [{ required: false, message: '请输入备注说明' }] }]"
              :row="40"
            >
            </a-textarea>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      :title="title"
      v-model="floorStatus"
      :width="800"
      @cancel="handleCancel"
      @ok="handleOk"
      okText="确认"
      cancelText="取消"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="楼层">
            <a-select
              placeholder="请选择楼层"
              v-decorator="[
                'floorName',
                {
                  rules: [
                    {
                      required: floorStatus,
                      message: '请选择楼层!'
                    }
                  ]
                }
              ]"
            >
              <a-select-option v-for="item in floorList" :value="item" :key="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal
      :title="title"
      v-model="specialLabelStatus"
      :width="800"
      @cancel="handleCancel"
      @ok="handleOk"
      okText="确认"
      cancelText="取消"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="特色标签">
            <a-checkbox-group
              :options="specialLabelList"
              v-decorator="['labelIds', { rules: [{ required: false, message: '请选择特色标签' }] }]"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>

    <a-modal :title="title" v-model="exhibitionSpecialLabelStatus" :width="800" @cancel="handleCancel" :footer="null">
      <a-spin :spinning="confirmLoading">
        <a-card title="已选择" :bordered="false">
          <a-card style="background:#ECECEC;">
            {{ labelNames && labelNames.length > 0 ? labelNames.join(',') : '暂无已选择特色标签' }}
          </a-card>
        </a-card>
      </a-spin>
    </a-modal>

    <br />
    <br />
  </div>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { disabledAuthFilter } from '@/utils/authFilter'
import Vue from 'vue'
import { getAction } from '@/api/manage'
import { duplicateCheck } from '@/api/api'
import AUpload from 'ant-design-vue/es/upload/Upload'
import dayjs from 'dayjs'
import AModal from 'ant-design-vue/es/modal/Modal'
import ATextarea from 'ant-design-vue/es/input/TextArea'

export default {
  name: 'StoreManageModal',
  inject: ['rush'],
  components: {
    ATextarea,
    AModal,
    AUpload
  },

  data() {
    return {
      title: '',
      //基础信息
      visible: false,
      //证件信息
      CertificateVisible: false,
      storeStatus: false,
      promoterStatus: false,
      franchiseeStatus: false,
      floorStatus: false,
      specialLabelStatus: false,
      searchPromoterInformation: false,
      exhibitionSpecialLabelStatus: false,
      promoterInformationTimeout: null,
      promoterInformation: '', //推广信息
      promoterLabelName: '平台',
      floorList: [],
      specialLabelList: [],
      labelNames: [],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      //弹窗参数
      explainInfo: {
        id: '',
        status: '',
        closeExplain: '' //状态停用说明
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      uploadLoading: false,
      uploadActiong: false,
      logoAddrPic: '',
      storePicturePic: '',
      licenseForEnterprisePic: '',
      idPictureZPic: '',
      idPictureFPic: '',
      idHandPic: '',
      agentAuthorizationPic: '',
      accordingStorePic: '',
      headers: {},
      validatorRules: {},
      url: {
        add: '/storeManage/storeManage/add',
        edit: '/storeManage/storeManage/edit',
        updateStatusById: '/storeManage/storeManage/updateStatusById',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        //获取经纬度
        getLngAndLat: '/storeManage/storeManage/getLngAndLat',
        getList: '/sysArea/sysArea/getList',
        findByParentId: '/sysArea/sysArea/findByParentId',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        //修改推广人
        updateStorePromoter: 'storeManage/storeManage/updateStorePromoter',
        //推广人反显
        findStorePromoter: 'storeManage/storeManage/findStorePromoter',
        //根据推广人类型和推广人id返回信息
        findInfoByidAndType: 'storeManage/storeManage/findInfoByidAndType',
        //修改归属加盟商
        updateStoreAlliance: 'storeManage/storeManage/updateStoreAlliance',
        //通过id获取加盟商信息
        getAllianceInfo: 'storeManage/storeManage/getAllianceInfo',
        //获取楼层列表（1）
        getFloorName: 'storeManage/storeManage/getFloorName',
        //获取标签列表（1）
        getStoreLabel: 'store/storeLabel/getStoreLabel',
        //选择标签（1）
        selectLabel: 'store/storeLabel/selectLabel'
      },
      //所在城市联想
      cityAllData: [],
      //可以显示回显默认地址
      canShowDefaultCity: false,
      //编辑回显的默认地址
      defaultCity: '',
      //地址转换拼接地址
      areaAddressList: [],
      longitude: '', //经度
      latitude: '', //纬度
      storeAddress: ''
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },
  computed: {
    uploadAction: function() {
      return this.url.fileUpload
    }
  },
  methods: {
    moment,
    //开通类型值的改变
    openTypeChange(value) {
      this.model.openType = value
    },
    promoterTypeChange(e) {
      let value = e.target.value
      this.form.resetFields('promoter')
      this.model.promoter = ''
      this.model.promoterType = value
      if (value == 0) {
        this.promoterLabelName = '店铺'
      }
      if (value == 1) {
        this.promoterLabelName = '会员'
      }
      if (value == 2) {
        this.promoterLabelName = '平台'
      }
      if (value == 3) {
        this.promoterLabelName = '加盟商'
      }
    },
    franchiseeTypeChange(e) {
      let value = e.target.value
      this.form.resetFields('allianceId')
      this.model.allianceId = ''
      this.model.ifAlliance = value
    },
    ifAllianceChange(e) {
      this.searchPromoterInformation = true
      clearTimeout(this.promoterInformationTimeout)
      this.promoterInformationTimeout = setTimeout(() => {
        this.getAllianceInfo(e.target.value)
      }, 1500)
    },
    promoterChange(e) {
      this.searchPromoterInformation = true
      clearTimeout(this.promoterInformationTimeout)
      this.promoterInformationTimeout = setTimeout(() => {
        this.findInfoByidAndType(e.target.value)
      }, 1500)
    },
    //赋值经纬度
    getLngAndLat() {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          console.log(this.areaAddressList)
          if (this.areaAddressList && this.areaAddressList.length > 0) {
            let frontAdd = this.areaAddressList.join(',').replace(/,/g, '')
            let info = {
              address: frontAdd + values.storeAddress,
              pageNo: 1,
              pageSize: 20
            }
            getAction(this.url.getLngAndLat, info).then(res => {
              if (!res.result || res.result.length <= 0) {
                resolve()
                return
              }
              let data = res.result[0].location
              if (res.success) {
                this.model.longitude = data.lng
                this.model.latitude = data.lat
                this.$nextTick(() => {
                  resolve()
                })
              } else {
                resolve()
              }
            })
          } else {
            resolve()
            this.$message.error('请选择所在城市！')
          }
        })
      })
    },
    //获取楼层信息
    getFloorName() {
      return new Promise((resolve, reject) => {
        getAction(this.url.getFloorName).then(res => {
          if (res.success) {
            this.floorList = res.result
          } else {
            this.$message.error(res.message)
          }
          resolve()
        })
      })
    },
    //获取标签列表
    getStoreLabel(record) {
      return new Promise((resolve, reject) => {
        getAction(this.url.getStoreLabel, { storeManageId: record.id }).then(async res => {
          if (res.success) {
            let labelIds = []
            let labelNames = []
            for (let item of res.result) {
              item.value = item.id
              if (item.isSelect == 1) {
                labelIds.push(item.id)
                labelNames.push(item.label)
              }
            }
            this.specialLabelList = res.result
            this.model.labelIds = labelIds
            this.labelNames = labelNames
            await this.$nextTick()
          } else {
            this.$message.error(res.message)
          }
          resolve()
        })
      })
    },

    //经办人类型选择
    personInCharge(options) {
      this.model.agentType = options
    },
    //所在城市地址选择完成事件
    cityAllDataChange(value, selectedOptions) {
      let sz = []
      for (let item of selectedOptions) {
        sz.push(item.label)
      }
      this.model.sysAreaId = value.join(',')
      this.areaAddressList = sz
    },
    //所在城市点击一级，二级，三级分类动态展示数据
    cityAllDataLoad(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true
      getAction(this.url.findByParentId, { id: targetOption.value }).then(res => {
        targetOption.loading = false
        if (res.success && res.result.length > 0) {
          let sz = []
          for (let item of res.result) {
            sz.push({
              label: item.name,
              value: item.id,
              isLeaf: false
            })
          }
          targetOption.children = sz
        }
        this.cityAllData = [...this.cityAllData]
      })
    },
    //所在城市回显
    cityEchoDisplay(info) {
      let sz = info.sysAreaId.split(',')
      let cityAllData = this.cityAllData
      this.defaultCity = info.sysAreaId.split(',').map(item => {
        return item * 1
      })
      console.log(this.defaultCity,'this.defaultCity')
      // this.$nextTick(()=>{
      //   this.form.setFieldsValue(Object.assign({},info,this.defaultCity));
      // })
      // console.log();
      // debugger;
      if (this.areaAddressList.length <= 1) {
        this.$message.warn('很抱歉,您的所属城市数据有误，请重新设置！')
        this.canShowDefaultCity = true
      } else {
        //第一个id请求其对应的子地址
        getAction(this.url.findByParentId, { id: sz[0] }).then(res => {
          if (res.success && res.result.length > 0) {
            let sz2 = [] //子地址
            for (let item of res.result) {
              sz2.push({
                label: item.name,
                value: item.id,
                isLeaf: false
              })
            }
            for (let item of cityAllData) {
              //找到对应的label添加children
              if (this.areaAddressList[0] == item.label) {
                item.children = sz2
                getAction(this.url.findByParentId, { id: sz[1] }).then(res2 => {
                  if (res2.success && res2.result.length > 0) {
                    let sz3 = []
                    for (let item of res2.result) {
                      sz3.push({
                        label: item.name,
                        value: item.id,
                        isLeaf: false
                      })
                    }
                    for (let item2 of sz2) {
                      if (this.areaAddressList[1] == item2.label) {
                        item2.children = sz3
                        this.$nextTick(() => {
                          this.canShowDefaultCity = true
                        })
                        break
                      }
                    }
                  } else {
                    this.canShowDefaultCity = true
                    console.log('没有第三季地址')
                  }
                })
                break
              }
            }
          } else {
            this.canShowDefaultCity = true
            console.log('空值')
          }
        })
      }
    },
    //获取包邮配送区域地址和所在城市一级options联想地址
    getList(callback) {
      getAction(this.url.getList).then(res => {
        if (res.success) {
          let sz3 = []
          for (let item of res.result) {
            sz3.push({
              label: item.name,
              value: item.id,
              isLeaf: false
            })
          }
          //所在城市
          this.cityAllData = sz3
          this.$nextTick(() => {
            callback()
          })
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    //接受弹窗参数 (停用弹窗)
    getExplainInfo(item) {
      //true 显示弹窗  false 隐藏弹窗
      this.storeStatus = true
      //显示弹窗接受item 赋值给explainInfo
      this.explainInfo = {
        id: item.id,
        status: item.status == '0' ? '1' : '0',
        closeExplain: ''
      }
    },
    //停用
    updataStatusAndCloseEplain() {
      let that = this
      //停用确认按钮
      getAction(that.url.updateStatusById, that.explainInfo).then(res => {
        if (res.code == 200) {
          that.$message.success(res.message)
          that.storeStatus = false
          that.$emit('refresh')
        } else {
          that.$message.success('修改失败')
        }
      })
    },
    //启用
    updateStatus(item) {
      let that = this
      if (!this.url.updateStatusById) {
        this.$message.error('请设置url.updateFrameStatus属性!')
        return
      }
      this.$confirm({
        title: '启用店铺后，店铺商品、订单、资金模块都将可以访问',
        content: '您确定要启用吗？',
        onOk: () => {
          console.log(item)
          getAction(that.url.updateStatusById, {
            id: item.id,
            status: item.status == '0' ? '1' : '0',
            closeExplain: ''
          }).then(res => {
            if (res.success) {
              that.$message.success(res.message)
              that.onClearSelected()
            } else {
              that.$message.warning(res.message)
            }
          })
        }
      })
    },

    //图片上传
    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        return false
      }
      //TODO 验证文件大小
    },
    handleChange(info) {
      this.logoAddrPic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.logoAddr = response.message
          // console.log('this.logo:', this.logoAddr)
          this.logoAddrPic = 'Has no pic url yet'
        } else {
          this.$message.warning(response.message)
        }
      }
    },
    handleChange1(info) {
      this.storePicturePic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.storePicture = response.message
          console.log('this.logo:', this.storePicture)

          this.storePicturePic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange2(info) {
      this.licenseForEnterprisePic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.licenseForEnterprise = response.message
          console.log('this.logo:', this.licenseForEnterprise)

          this.licenseForEnterprisePic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange3(info) {
      this.idPictureZPic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.idPictureZ = response.message
          console.log('this.logo:', this.idPictureZ)

          this.idPictureZPic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange4(info) {
      this.idPictureFPic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.idPictureF = response.message
          console.log('this.logo:', this.idPictureF)

          this.idPictureFPic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange5(info) {
      this.idHandPic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          this.model.idHand = response.message
          console.log('this.logo:', this.idHand)

          this.idHandPic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange6(info) {
      this.agentAuthorizationPic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.agentAuthorization = response.message
          console.log('this.logo:', this.agentAuthorization)

          this.agentAuthorizationPic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    handleChange7(info) {
      this.accordingStorePic = ''
      if (info.file.status === 'uploading') {
        this.uploadLoading = true
        return
      }
      if (info.file.status === 'done') {
        var response = info.file.response
        this.uploadLoading = false
        console.log(response)
        if (response.success) {
          //this.model.avatar = response.message;
          this.model.accordingStore = response.message
          console.log('this.logo:', this.accordingStore)

          this.accordingStorePic = 'Has no pic url yet'
        } else {
          this.$message.warning(response1.message)
        }
      }
    },
    getLogoAddrView() {
      console.log(this.url.imgerver + '/' + this.model.logoAddr)
      return this.url.imgerver + '/' + this.model.logoAddr
    },
    getStorePictureView() {
      console.log(this.url.imgerver + '/' + this.model.storePicture)
      return this.url.imgerver + '/' + this.model.storePicture
    },
    getLicenseForEnterpriseView() {
      console.log(this.url.imgerver + '/' + this.model.licenseForEnterprise)
      return this.url.imgerver + '/' + this.model.licenseForEnterprise
    },
    getIdPictureZView() {
      console.log(this.url.imgerver + '/' + this.model.idPictureZ)
      return this.url.imgerver + '/' + this.model.idPictureZ
    },
    getIdPictureFView() {
      console.log(this.url.imgerver + '/' + this.model.idPictureF)
      return this.url.imgerver + '/' + this.model.idPictureF
    },
    getIdHandView() {
      console.log(this.url.imgerver + '/' + this.model.idHand)
      return this.url.imgerver + '/' + this.model.idHand
    },
    getAgentAuthorizationView() {
      console.log(this.url.imgerver + '/' + this.model.agentAuthorization)
      return this.url.imgerver + '/' + this.model.agentAuthorization
    },
    getAccordingStoreView() {
      console.log(this.url.imgerver + '/' + this.model.accordingStore)
      return this.url.imgerver + '/' + this.model.accordingStore
    },
    add() {
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model.delFlag = 0
      if (record.title) {
        this.title = record.title
      }
      //预览显示图片
      /*if(record.hasOwnProperty("id")){
         this.logoAddrPic = "Has no pic url yet";
         }*/
      this.getList(() => {
        if (record) {
          if (record.areaAddress) {
            this.areaAddressList = record.areaAddress.split(',')
          }
          // record.accountType = record.accountType * 1
          if (record.startTime) record.startTime = moment(record.startTime, this.dateFormat)
          if (record.endTime) record.endTime = moment(record.endTime, this.dateFormat)
          //            this.AllData = Object.assign({},this.AllData,record)
          //             this.model = record;
          //所在城市回显
          // this.$nextTick(()=>{
          //              console.log(this.model)
          this.logoAddrPic = record.logoAddrPic = record.logoAddr
          this.storePicturePic = record.storePicturePic = record.storePicture
          this.licenseForEnterprisePic = record.licenseForEnterprisePic = record.licenseForEnterprise
          this.idPictureZPic = record.idPictureZPic = record.idPictureZ
          this.idPictureFPic = record.idPictureFPic = record.idPictureF
          this.idHandPic = record.idHandPic = record.idHand
          this.agentAuthorizationPic = record.agentAuthorizationPic = record.agentAuthorization
          this.accordingStorePic = record.accordingStorePic = record.accordingStore
          this.storeAddress = record.storeAddress = record.storeAddress
          //              this.canShowDefaultCity = false
          //              this.$nextTick(() => {
          //              this.form.resetFields()
          // ;
          this.model = record
          if (record.title == '证件信息') {
            this.CertificateVisible = true
            this.$nextTick(() => {
              this.form.setFieldsValue(record)
            })
          } else {
            this.visible = true
            this.$nextTick(() => {
              this.form.setFieldsValue(record)
            })
          }
          // this.form.setFieldsValue(pick(this.model,'year','month','day','sysUserId','storeName','subStoreName','logoAddr','storePicture','sysAreaId','areaAddress','storeAddress','openType','money','mainType','nextType','comprehensiveEvaluation','bossName','bossPhone','takeOutPhone','longitude','latitude','status','attestationStatus','remark','licenseForEnterprise','socialCreditCode','idCode','idPictureZ','idPictureF','delFlag','agentType','agentName','idHand','agentAuthorization','payStatus','payType','grade','accordingStore','straight','serviceRange','pickUpStatus','pickUpRemark','distributionType','accountingRules','distributionStatus'))
          //时间格式化
          //          this.form.setFieldsValue({startTime: this.model.startTime ? moment(this.model.startTime) : null})
          //          this.form.setFieldsValue({endTime: this.model.endTime ? moment(this.model.endTime) : null})
          //          this.form.setFieldsValue({payTime:this.model.payTime?moment(this.model.payTime):null})
          //              });
          //             })
          if (record.sysAreaId && record.areaAddress) {
            this.cityEchoDisplay(record)
          } else {
            this.canShowDefaultCity = true
          }
        } else {
          this.areaAddressList = ''
          this.canShowDefaultCity = true
        }
      })
    },
    close() {
      this.$emit('close')
      this.canShowDefaultCity = false
      this.CertificateVisible = false
      this.visible = false
      this.promoterStatus = false
    },
    async showPromoterModal(record) {
      this.confirmLoading = true
      console.log(record)
      record.promoterType = 2
      record.promoter = ''
      this.model = Object.assign({}, record)
      this.promoterStatus = true
      const findInfoByidAndType = await this.findInfoByidAndType()
      const findStorePromoter = await this.findStorePromoter()
      this.form.resetFields()
      this.form.setFieldsValue(this.model)
      this.$nextTick(() => {
        this.confirmLoading = false
      })
    },
    async showFranchiseeModal(record) {
      this.confirmLoading = true
      record.ifAlliance = '1'
      record.allianceId = ''
      this.model = Object.assign({}, record)
      this.franchiseeStatus = true
      // const getAllianceInfo = await this.getAllianceInfo()
      setTimeout(() => {
        this.form.resetFields()
        this.form.setFieldsValue(this.model)
        this.$nextTick(() => {
          this.confirmLoading = false
        })
      }, 200)
    },
    async showFloor(record) {
      this.confirmLoading = true
      this.model = Object.assign({}, record)
      this.floorStatus = true
      this.form.resetFields()
      await this.getFloorName()
      this.form.setFieldsValue(this.model)
      this.$nextTick(() => {
        this.confirmLoading = false
      })
    },
    async showSpecialLabel(record) {
      this.confirmLoading = true
      this.model = Object.assign({}, record)
      this.specialLabelStatus = true
      this.form.resetFields()
      await this.getStoreLabel(record)
      this.form.setFieldsValue(this.model)
      this.$nextTick(() => {
        this.confirmLoading = false
      })
    },

    async showExhibitionSpecialLabel(record) {
      this.confirmLoading = true
      this.model = Object.assign({}, record)
      this.exhibitionSpecialLabelStatus = true
      this.form.resetFields()
      await this.getStoreLabel(record)
      this.form.setFieldsValue(this.model)
      this.$nextTick(() => {
        this.confirmLoading = false
      })
    },

    getAllianceInfo(allianceId = this.model.allianceId || '') {
      return new Promise((resolve, reject) => {
        this.model.allianceId = allianceId
        getAction(this.url.getAllianceInfo, {
          allianceId
        }).then(res => {
          if (res.success) {
            this.promoterInformation = res.result.allianceInfo
            resolve()
          } else {
            reject(res.message || '接口响应失败 getAllianceInfo')
          }
          this.searchPromoterInformation = false
        })
      })
    },
    findInfoByidAndType(promoter = this.model.promoter || '') {
      return new Promise((resolve, reject) => {
        this.model.promoter = promoter
        getAction(this.url.findInfoByidAndType, {
          promoter,
          promoterType: this.model.promoterType || ''
        }).then(res => {
          if (res.success) {
            this.promoterInformation = res.result.information
            resolve()
          } else {
            reject(res.message || '接口响应失败 findInfoByidAndType')
          }
          this.searchPromoterInformation = false
        })
      })
    },
    findStorePromoter() {
      return new Promise((resolve, reject) => {
        getAction(this.url.findStorePromoter, { id: this.model.id }).then(res => {
          if (res.success) {
            this.model.StorePromoter = res.result.StorePromoter || ''
            this.$nextTick(() => {
              resolve()
            })
          } else {
            reject(res.message || '接口响应失败 findStorePromoter')
          }
        })
      })
    },
    async handleOk() {
      const that = this
      // 触发表单验证
      if (!this.promoterStatus) {
        const getLngAndLat = await that.getLngAndLat()
      } else {
        // if(this.promoterInformation == '查无此人'){
        //   this.$message.warn('查无此人')
        //   return;
        // }
      }

      this.form.validateFields((err, values) => {
        console.log('缺失数据', err)
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            if (this.promoterStatus) {
              httpurl += this.url.updateStorePromoter
              method = 'post'
            } else if (this.franchiseeStatus) {
              httpurl += this.url.updateStoreAlliance
              method = 'post'
            } else if (this.specialLabelStatus) {
              httpurl += this.url.selectLabel
              method = 'get'
            } else {
              httpurl += this.url.edit
              method = 'put'
            }
          }
          let formData = Object.assign(this.model, values)

          //时间格式化
          try {
            formData.startTime = formData.startTime ? formData.startTime.format('YYYY-MM-DD HH:mm:ss') : null
            formData.endTime = formData.endTime ? formData.endTime.format('YYYY-MM-DD HH:mm:ss') : null
            //            formData.sysAreaId = this.model.sysAreaId
            formData.areaAddress = this.areaAddressList.join(',')
          } catch (e) {
            console.warn('解析数据出错')
          }
          if (this.promoterStatus) {
            formData = {
              id: formData.id,
              promoter: formData.promoter || '',
              promoterType: formData.promoterType,
              remark: formData.remark || ''
            }
          }
          if (this.franchiseeStatus) {
            formData = {
              id: formData.id,
              allianceId: formData.allianceId || '',
              ifAlliance: formData.ifAlliance,
              remark: formData.remark || ''
            }
          }
          if (this.specialLabelStatus) {
            formData = {
              storeManageId: formData.id,
              labelIds: formData.labelIds && formData.labelIds.length > 0 ? formData.labelIds.join(',') : ''
            }
          }
          console.log(formData)
          httpAction(httpurl, formData, method)
            .then(res => {
              if (res.success) {
                that.$message.success(res.message)
                that.close()
                this.rush()
              } else {
                that.$message.error(res.message)
                // this.rush()
              }
            })
            .finally(() => {
              that.confirmLoading = false
              // that.close()
            })
        }
      })
    },
    handleCancel() {
      this.close()
    }
    /*handleCancel1() {
        this.close()
      }*/
  }
}
</script>

<style lang="less"></style>
