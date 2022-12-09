<!--平台，供应商，店铺商品新增编辑6合一页面-->
<!--供应商新增规格供货价和会员价未能成功添加-->
<template>
  <a-card :bordered="false">
    <div>
      <!--<a-button type="primary" @click="showModal">-->
      <!--Open Modal with async logic-->
      <!--</a-button>-->
      <a-modal
        title="商品发布成功"
        :visible="visible2"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
        okText="继续发布"
        cancelText="返回列表"
      >
        <p>继续发布商品,或返回商品列表</p>
      </a-modal>
    </div>

    <div class="release-assistant">
      <div class="head">
        发布助手
      </div>
      <div class="cnt">
        <div class="assistantTitle" v-if="!isChecked && !existenceGoodNo">
          {{ releaseAttention[releaseSelectedIndex].title }}
        </div>
        <div
          class="explain"
          v-for="item in releaseAttention[releaseSelectedIndex].AllList"
          v-if="!isChecked && !existenceGoodNo"
        >
          {{ item }}
        </div>
        <div class="title" v-if="(isChecked || existenceGoodNo) && warningMessage" style="color: red">
          {{ warningMessage }}
        </div>
      </div>
    </div>

    <div class="table-operator" style="width: 80%">
      <a-spin :spinning="confirmLoading">
        <H2 style="margin-left: 10%;">基本信息</H2>
        <a-form :form="form"
          ><!--@submit="handleSubmit"-->

          <a-form-item style="display: none" :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户Id">
            <a-input placeholder="请输入商品描述" v-decorator="['sysUserId', {}]" />
          </a-form-item>
          <!-- style="display: none"-->

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品分类">
            <span class="redStar">*</span>
            <span class="ant-form-text" v-decorator="['goodTypeId', {}]">{{ GoodTypeByid }}</span>
            <a style="margin-left: 40px" @click="updataGoodType">修改分类 </a>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品名称">
            <a-input
              placeholder="请输入商品名称"
              maxlength="30"
              v-decorator="['goodName', { rules: [{ required: true, message: '请输入商品名称' }] }]"
              @click="ReleaseContentChange(0)"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品描述">
            <a-textarea
              placeholder="请输入商品描述"
              v-decorator="['goodDescribe', {}]"
              :rows="4"
              @click="ReleaseContentChange(1)"
            />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品图片">
            <a-upload
              listType="picture-card"
              :fileList="fileList1"
              :action="uploadAction"
              :multiple="true"
              :headers="headers"
              @preview="handlePreview1"
              @change="handleChange1"
              v-decorator="['mainPicture', validatorRules.mainPicture]"
              :beforeUpload="pictureBeforeUpload"
            >
              <!--  v-decorator="['mainPicture',{ rules: [{ required: true, message: '请上传图片' }] }]"-->
              <div v-if="fileList1.length < 5" @click="ReleaseContentChange(2)">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传({{ uploadingNumber1 }}/5)</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible1" :footer="null" @cancel="handleCancel1">
              <img alt="example" style="width: 100%" :src="previewImage1" />
            </a-modal>
            <draggable
              element="span"
              v-model="fileList1"
              :options="dragOptions"
              :move="onMove"
              style="display: flex;justify-content: flex-start;align-items: center;min-width:100%;flex-wrap: wrap;"
            >
              <li v-for="(item, index) in fileList1" :key="index">
                <img
                  src="../../../assets/draggableSvg.svg"
                  alt=""
                  v-if="item.response"
                  style="width: 104px;margin:-5px 8px 8px 0;height:30px;border:1px solid gray;border-radius:10px"
                />
                <!--                <img v-if="item.response" :src="url.imgerver + '/' + item.response.message" alt="" style="width: 100px;height:100px;border-radius:10px;margin-right:10px">-->
              </li>
            </draggable>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="视频地址">
            <a-upload
              name="file"
              :headers="headers"
              :action="uploadAction"
              @change="handleChange2"
              :fileList="fileList2"
              :beforeUpload="videoBeforeUpload"
            >
              <a-button style="font-size:14px" v-if="fileList2.length <= 0" @click="ReleaseContentChange(3)">
                <a-icon type="upload" />
                点击上传视频
              </a-button>
            </a-upload>
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品详情图">
            <a-upload
              listType="picture-card"
              :fileList="fileList3"
              :headers="headers"
              :multiple="true"
              :action="uploadAction"
              @preview="handlePreview3"
              @change="handleChange3"
              :beforeUpload="pictureBeforeUpload"
              v-decorator="['detailsGoods', validatorRules.detailsGoods]"
            >
              <div v-if="fileList3.length < 50" @click="ReleaseContentChange(4)">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传({{ uploadingNumber }}/50)</div>
              </div>
            </a-upload>
            <a-modal :visible="previewVisible3" :footer="null" @cancel="handleCancel3">
              <img alt="example" style="width: 100%" :src="previewImage3" />
            </a-modal>
            <draggable
              element="span"
              v-model="fileList3"
              :options="dragOptions"
              :move="onMove"
              style="display: flex;justify-content: flex-start;align-items: center;min-width:100%;flex-wrap: wrap;"
            >
              <li v-for="(item, index) in fileList3" :key="index">
                <img
                  src="../../../assets/draggableSvg.svg"
                  alt=""
                  v-if="item.response"
                  style="width: 104px;margin:-5px 8px 8px 0;height:30px;border:1px solid gray;border-radius:10px"
                />
                <!--                <img v-if="item.response" :src="url.imgerver + '/' + item.response.message" alt="" style="width: 100px;height:100px;border-radius:10px;margin-right:10px">-->
              </li>
            </draggable>
          </a-form-item>
          <!--价格与库存-->
          <div>
            <h2 style="margin-left: 10%;">
              价格与库存
            </h2>
            <div class="wrap">
              <div class="specifications-title" v-if="!isEdit">
                <span class="sml-title">
                  商品规格
                </span>
                <div class="addBtn">
                  <a-button icon="plus" @click="addSpecification()">添加规格</a-button>
                </div>
                <div>
                  最多添加两个商品规格，第一个商品规格可添加规格图片
                </div>
              </div>
              <a-spin tip="加载中" :spinning="isSpin">
                <div class="content" v-for="(item, index) in CommoditySpecificationData">
                  <div class="floor">
                    <a-input placeholder="请输入规格名" class="ipt" v-model="item.CommodityStyle" />
                    <!--                  deleteSpecification(index)-->
                    <a-button @click="showConfirm(index)">
                      <span>
                        删除规格
                      </span>
                    </a-button>
                  </div>
                  <div class="add">
                    <a-button icon="plus" @click="addSpecificationDetail(index)">添加</a-button>
                    <div
                      v-for="(item2, index2) in item.classification"
                      class="ipt-wrap"
                      @mouseenter.stop="enter(index2)"
                      @mouseleave.stop="leave()"
                      :key="'wrap' + index + 'classification' + index2"
                    >
                      <a-icon
                        type="close-circle"
                        v-show="index2 == iptActiveIndex"
                        @click="clearClassification(index, item2)"
                        class="iconClose"
                      />
                      <a-input
                        placeholder="请输入"
                        v-model="item2.value"
                        @change.stop="iptChange2(index2, item2.value, index)"
                        :disabled="item.classification && item2.value != '' && index2 != item.classification.length - 1"
                      />
                      <div class="clearfix" @click.stop="specificationsSureIndex(index, index2)" v-if="index == 0">
                        <a-upload
                          :action="uploadAction"
                          listType="picture-card"
                          :multiple="true"
                          :headers="headers"
                          :fileList="CommoditySpecificationData[index].classification[index2].SpecificationsPictures"
                          @preview="specificationsPicHandlePreview"
                          @change="specificationsPichandleChange"
                          :beforeUpload="pictureBeforeUpload"
                          :remove="item2.value != '' ? specificationsPichandleRemove : specificationsPichandleRemoves"
                        >
                          <div
                            v-if="
                              CommoditySpecificationData[index].classification[index2].SpecificationsPictures &&
                                CommoditySpecificationData[index].classification[index2].SpecificationsPictures.length <
                                  1
                            "
                          >
                            <a-icon type="plus" />
                            <div class="ant-upload-text">
                              Upload
                            </div>
                          </div>
                        </a-upload>

                        <a-modal
                          :visible="
                            CommoditySpecificationData[index].classification[index2].specificationsPicPreviewVisible
                          "
                          :footer="null"
                          @cancel="specificationsPichandleCancel"
                        >
                          <img
                            alt="example"
                            style="width: 100%"
                            :src="
                              CommoditySpecificationData[index].classification[index2].specificationsPicPreviewImage
                            "
                          />
                        </a-modal>
                      </div>
                    </div>
                  </div>
                </div>
              </a-spin>
            </div>

            <div class="wrap">
              <div class="title">
                <span style="font-size: 15px;color: rgba(0, 0, 0, 0.85);">
                  <span style="color: red;  font-family: SimSun;"> *</span> 价格与库存
                </span>
              </div>
              <div class="content">
                <div
                  class="batch-setup"
                  v-if="
                    CommoditySpecificationData.length &&
                      CommoditySpecificationData[0].classification.length &&
                      CommoditySpecificationData[0].classification[0].value
                  "
                >
                  <div style="color:red">
                    批量设置：在下方栏中选择内容进行批量填充
                  </div>
                  <div class="opreation">
                    <a-select
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                      v-if="CommoditySpecificationData.length"
                      v-model="bulkFillData.Specification1"
                    >
                      <a-select-option value="99">
                        全部
                      </a-select-option>
                      <a-select-option v-for="item in CommoditySpecificationData[0].classification" :value="item.value">
                        {{ item.value }}
                      </a-select-option>
                    </a-select>

                    <a-select
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                      v-if="CommoditySpecificationData.length == 2"
                      v-model="bulkFillData.Specification2"
                    >
                      <a-select-option value="99">
                        全部
                      </a-select-option>
                      <a-select-option
                        v-for="item2 in CommoditySpecificationData[1].classification"
                        :value="item2.value"
                        >{{ item2.value }}
                      </a-select-option>
                    </a-select>
                    <a-input-number
                      :min="0"
                      :precision="2"
                      placeholder="销售价"
                      v-model="bulkFillData.price"
                      @focus="clickIndex(0)"
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-input-number
                      :min="0"
                      :precision="2"
                      placeholder="成本价"
                      v-model="bulkFillData.costPrice"
                      @focus="clickIndex(1)"
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-input-number
                      :min="0"
                      :precision="2"
                      v-if="reusePage == 1"
                      placeholder="供货价"
                      v-model="bulkFillData.supplyPrice"
                      @focus="clickIndex(2)"
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-input-number
                      :min="0"
                      :precision="2"
                      v-if="reusePage != 2"
                      placeholder="会员价"
                      v-model="bulkFillData.vipPrice"
                      @focus="clickIndex(3)"
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-input-number
                      :min="0"
                      :precision="0"
                      placeholder="库存"
                      v-model="bulkFillData.repertory"
                      @focus="clickIndex(4)"
                      style="width: 90px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-input
                      placeholder="编码"
                      v-model="bulkFillData.skuNo"
                      @focus="clickIndex(5)"
                      style="width: 140px;margin-right:10px;margin-bottom: 10px"
                    />
                    <a-button @click="bulkFillDataChange()" style="width: 90px;margin-bottom: 10px">
                      确定
                    </a-button>
                  </div>
                </div>
                <a-spin tip="加载中" :spinning="isSpin">
                  <a-table
                    :pagination="false"
                    :columns="columns"
                    :dataSource="data"
                    bordered
                    v-if="
                      CommoditySpecificationData.length &&
                        CommoditySpecificationData[0].classification.length &&
                        CommoditySpecificationData[0].classification[0].value
                    "
                  >
                    <template
                      v-for="(item, index) in [
                        'price',
                        'costPrice',
                        'supplyPrice',
                        'vipPrice',
                        'repertory',
                        'skuNo',
                        'specificationPicture'
                      ]"
                      :slot="item"
                      slot-scope="text, record, index"
                    >
                      <!--                    v-decorator="[item + index, item != 'skuNo' ? validatorRules.SpecificationsInputCheck : validatorRules.skucheck]"-->
                      <a-form-item class="anty-img-wrap" :key="item" v-if="item != 'specificationPicture'">
                        <a-input-number
                          v-if="item != 'skuNo'"
                          :min="0"
                          :precision="item != 'repertory' ? 2 : 0"
                          v-model="text"
                          placeholder=""
                          @change="handleChange($event, record.key, item)"
                        >
                        </a-input-number>
                        <a-input
                          v-else
                          v-model="text"
                          placeholder=""
                          @change="handleChange($event.target.value, record.key, item)"
                          @click="ReleaseContentChange(5)"
                        >
                        </a-input>
                      </a-form-item>
                      <a-form-item :key="item" v-else>
                        <img
                          v-if="record.specificationPicture && record.specificationPicture[0]"
                          class="clickShowImage"
                          style="width:50px;height:50px"
                          :preview="'logoAddr' + index"
                          :src="record.specificationPicture[0].url"
                          alt=""
                        />
                        <a-avatar shape="square" v-else src="" icon="user" />
                      </a-form-item>
                    </template>
                  </a-table>
                </a-spin>

                <a-spin tip="加载中" :spinning="isSpin">
                  <a-table
                    :pagination="false"
                    :columns="columns2"
                    :dataSource="data2"
                    bordered
                    style="margin-top: 60px"
                  >
                    <template
                      v-for="(item, index) in [
                        'price',
                        'costPrice',
                        'supplyPrice',
                        'vipPrice',
                        'repertory',
                        'skuNo',
                        'goodNo'
                      ]"
                      :slot="item"
                      slot-scope="text, record, index"
                    >
                      <a-form-item class="anty-img-wrap" :key="item">
                        <div v-if="CommoditySpecificationData.length == 0 || item == 'goodNo'">
                          <a-input-number
                            v-if="item != 'goodNo' && item != 'skuNo'"
                            v-model="text"
                            @change="value => handleChange4(value, record.key, item)"
                            :min="0"
                            :precision="item != 'repertory' ? 2 : 0"
                          >
                          </a-input-number>

                          <a-input v-else v-model="text" @change="handleChange4($event.target.value, record.key, item)">
                          </a-input>
                        </div>
                        <!--                        <a-input :type="item!= 'goodNo'?'number':'text'" placeholder="" v-model="text"-->
                        <!--                                 @change="handleChange4($event.target.value,record.key,item)"-->
                        <!--                                 v-if="CommoditySpecificationData.length == 0 || item == 'goodNo'"/>-->
                        <p v-else>
                          {{ text }}
                        </p>
                      </a-form-item>
                    </template>
                  </a-table>
                </a-spin>
              </div>
            </div>
            <div class="wrap" style="background:white">
              商品价格的修改仅对商品列表产生影响，若该商品有加入专区或其他活动且需修改其价格，请自行前往对应模块进行调整。
            </div>
            <!--            <a-form-item-->
            <!--              style="margin-top: 10px;"-->
            <!--              :labelCol="labelCol"-->
            <!--              :wrapperCol="wrapperCol"-->
            <!--              label="普通佣金"-->
            <!--              v-if="goodsDistributionCommissionSource"-->
            <!--            >-->
            <!--              <a-input-number :min="0" :precision="2" placeholder="普通佣金"  style="width: 120px;" v-decorator="['generalCommission', validatorRules.generalCommission]"/>-->
            <!--            </a-form-item>-->

            <!--            <a-form-item-->
            <!--              style="margin-top: 10px;"-->
            <!--              :labelCol="labelCol"-->
            <!--              :wrapperCol="wrapperCol"-->
            <!--              label="vip佣金"-->
            <!--              v-if="goodsDistributionCommissionSource"-->
            <!--            >-->
            <!--              <a-input-number :min="0" :precision="2" placeholder="vip佣金"  style="width: 120px;" v-decorator="['vipCommission', validatorRules.vipCommission]"/>-->
            <!--            </a-form-item>-->
            <!--            -->
            <a-form-item style="margin-top: 10px" :labelCol="labelCol" :wrapperCol="wrapperCol" :colon="false">
              <div slot="label">
                <span class="dataCheckedStar">
                  *
                </span>
                <span>
                  商品市场价 :
                </span>
              </div>

              <a-input-number
                :min="0"
                :precision="2"
                placeholder="应高于商品最大销售价"
                v-model="marketPrice"
                @click="ReleaseContentChange(6)"
                style="width: 120px"
              />
            </a-form-item>
          </div>
          <!--服务与承诺-->
          <div>
            <h2 style="margin-left: 10%;">
              <span style="color: red;">
                *
              </span>
              服务与承诺
            </h2>

            <!--供应商-->
            <div v-if="reusePage == 1">
              <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="商品供应商" v-if="reusePage != 3">
                <a-select
                  style="width: 150px"
                  v-decorator="['sysUserId', { rules: [{ required: true, message: '请选择' }] }]"
                  placeholder="请选择"
                  @change="handleProvinceChange"
                >
                  <a-select-option v-for="item in sysUserDTOs" :key="item.id">
                    {{ item.realname }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </div>

            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="自提" v-if="reusePage == 3">
              <a-radio-group v-decorator="['noutoasiakasStatus']">
                <a-radio :disabled="pickUpStatus == '0'" value="1" @click="storeInformation('1')">
                  支持
                </a-radio>
                <a-radio value="0" @click="storeInformation('0')">
                  不支持
                </a-radio>
              </a-radio-group>
              <div style="background-color: #f2f2f2;padding: 20px;width:100%" v-if="pickUpInAStore">
                <div v-if="goodStoreInformation">
                  <div>
                    <span>店铺名称：</span><span>{{ goodStoreInformation.storeName }} </span>
                  </div>
                  <div>
                    <span>店铺地址：</span><span>{{ goodStoreInformation.storeAddress }}</span>
                  </div>
                  <div>
                    <span> 客服电话：</span><span>{{ goodStoreInformation.takeOutPhone }}</span>
                  </div>
                  <div>
                    <span>备注说明：</span><span>{{ goodStoreInformation.remark }}</span>
                  </div>
                </div>
              </div>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="配送" v-if="reusePage == 3">
              <a-radio-group v-decorator="['distributionStatus']">
                <a-radio :disabled="menberDistributionStatus == '0'" value="1" @click="distributionSupport('1')">
                  支持
                </a-radio>
                <a-radio value="0" @click="distributionSupport('0')">
                  不支持
                </a-radio>
              </a-radio-group>

              <div style="background-color: #f2f2f2;padding: 20px;width:100%" v-if="distribution">
                <div v-if="goodStoreInformation">
                  <span>{{ handlerAccountingRules(goodStoreInformation.accountingRules) }}</span>
                </div>
              </div>
            </a-form-item>
          </div>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="服务承诺">
            <a-checkbox-group v-decorator="['commitmentCustomers', {}]" style="width: 100%;">
              <!-- -->
              <a-row>
                <!--@mouseover="ReleaseContentChange(7)"-->
                <a-col :span="8">
                  <a-checkbox value="0" @mouseover="ReleaseContentChange(7)">
                    7天无理由退换货
                  </a-checkbox>
                </a-col>
                <!--@mouseover="ReleaseContentChange(8)"-->
                <a-col :span="8" @mouseover="ReleaseContentChange(8)">
                  <a-checkbox value="1">
                    假一赔十
                  </a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>

          <!--<a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="店铺"
            v-if="reusePage == 3 && roleCode == 1">
            <template>
              <a-select
                showSearch
                placeholder="请选择"
                optionFilterProp="children"
                style="width: 300px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChangeSore"
                :filterOption="filterOption"
              >
                <a-select-option v-for="item in storeList" :value="item.sysUserId">{{ item.storeName }}
                <span v-if="item.subStoreName">({{ item.subStoreName }})</span>
                </a-select-option>
              </a-select>
            </template>
          </a-form-item>-->

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="运费模板">
            <span v-if="reusePage != 3" class="redStar">*</span>
            <!--disabled-->
            <a-select style="width: 300px" v-model="model.storeTemplateId" placeholder="请选择" v-if="reusePage == 3">
              <!--:value="item3.id"-->
              <a-select-option
                v-for="(item3, index) in providerTemplateList1"
                @click="listsysArea1(item3)"
                :key="item3.id"
                :value="item3.id"
              >
                {{ item3.name }}
              </a-select-option>
            </a-select>
            <a-select
              style="width: 150px"
              v-decorator="[
                'providerTemplateId',
                validatorRules.providerTemplateId2,
                { rules: [{ required: true, message: '请选择' }] }
              ]"
              placeholder="请选择"
              v-else
            >
              <!--:value="item3.id"-->
              <a-select-option
                v-for="(item3, index) in providerTemplateList1"
                @click="listsysArea1(item3)"
                :key="item3.id"
                :value="item3.id"
              >
                {{ item3.name }}
              </a-select-option>
            </a-select>
            <!--            v-decorator="['providerTemplateId',validatorRules.providerTemplateId2,{ rules: [{ required: true, message: '请选择' }] }]"-->

            <!--  <span style="margin-left:40px;cursor: pointer;color: #0099FF;" @click="pushAddfreight">新建运费模板</span>-->
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="信息" v-if="showLogisticsWeight">
            <div class="freight-template-info">
              <!-- <div class="edit" @click="pusheditfreight">
                 编辑
               </div>-->
              <div class="single-line">
                <div class="single-line-title">
                  包邮配送地区
                </div>
                <div class="right">
                  <span v-for="item in listsysArea.listsysArea">{{ item.name }}、</span>
                </div>
              </div>

              <div class="single-line" v-if="showBuyPostageArea">
                <div class="single-line-title">
                  买家付邮费区域
                </div>
                <div class="right">
                  <div v-for="(item, index) in JSON.parse(listsysArea.mailDelivery)" v-if="item.isDelivery != 2">
                    <p>
                      {{ item.city }}{{ item.count }}{{ listsysArea.chargeMode == 1 ? 'kg' : '件' }}内{{
                        item.price
                      }}元，每增加{{ item.everyIncreaseCount }}{{ listsysArea.chargeMode == 1 ? 'kg' : '件' }}加{{
                        item.everyIncreasePrice
                      }}元<span v-if="item.isConditionalPostage"
                        >，&nbsp;&nbsp;&nbsp;指定条件包邮：满{{ item.satisfyPriceNumber
                        }}{{ item.unit == 0 ? '件' : '元' }}包邮</span
                      >
                    </p>
                  </div>
                </div>
              </div>

              <div class="single-line" v-if="showNoDistribution">
                <div class="single-line-title">
                  不配送地区
                </div>
                <div class="right">
                  <span v-for="item in JSON.parse(listsysArea.mailDelivery)" v-if="item.isDelivery != 1">
                    {{ item.city }}
                  </span>
                </div>
              </div>
            </div>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="物流重量" v-if="showLogisticsWeight">
            <a-table :pagination="false" :columns="LogisticsWeightForm" :dataSource="LogisticsWeightdata" bordered>
              <template slot="weight" slot-scope="text, record, index">
                <a-input
                  style="width: 50%;margin: 0 auto;text-align: center"
                  :value="text"
                  type="number"
                  @change="LogisticsWeightinputChange($event.target.value, record.key, 'weight')"
                />
              </template>
              <template slot="Specifications" slot-scope="text, record, index">
                {{ text || '无' }}
              </template>
            </a-table>
          </a-form-item>
          <!--<a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            label="商品属性"
            v-if="reusePage!=3">
            <span v-if="reusePage != 3" class="redStar">*</span>
            &lt;!&ndash;,validatorRules.goodForm&ndash;&gt;
            <a-radio-group v-decorator="['goodForm']">
              <a-radio value="0">
                普通
              </a-radio>
              <a-radio value="1" :disabled="!specialPriceResult">
                特价
              </a-radio>
              <span style="margin-left: 40px">特价属性的商品必须是成本价必须低于销售价{{ specialPriceRatio }}%的商品</span>
            </a-radio-group>
          </a-form-item>-->

          <div class="button-end"></div>
          <div style="width: 200px;margin:0 auto;display: flex;justify-content:space-around;">
            <a-button @click="prevStep(0)">
              保存草稿箱
            </a-button>
            <a-button style="margin-left: 8px" type="primary" @click="prevStep(1)">
              提交并上架
            </a-button>
          </div>
        </a-form>
      </a-spin>
    </div>
  </a-card>
</template>

<script>
import { httpAction, postAction } from '@/api/manage'
import pick from 'lodash.pick'
import moment from 'moment'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { disabledAuthFilter } from '@/utils/authFilter'
import { getAction } from '@/api/manage'
import Vue from 'vue'
import RowspanTable from '../../jeecg/RowspanTable'
import SplitPanel from '../../jeecg/SplitPanel'
import draggable from 'vuedraggable'
import ARow from 'ant-design-vue/es/grid/Row'
import ACol from 'ant-design-vue/es/grid/Col'
import { mapGetters } from 'vuex'
//字典
import { filterDictText, initDictOptions } from '@/components/dict/JDictSelectUtil'
import AFormItem from 'ant-design-vue/es/form/FormItem'
//去除空字符串

export default {
  inject: ['rush'],
  name: 'GoodListadd2',
  components: {
    AFormItem,
    SplitPanel,
    RowspanTable,
    ACol,
    ARow,
    draggable
  },
  data() {
    return {
      visible2: false,
      confirmLoading: false,
      attestationStatus: '',
      title: '操作',
      GoodTypeByid: [],
      GoodTypeByid1: '',
      isSpin: false,
      supplyPriceRatio: 0,
      specialPriceRatio: 0,
      membershipRate: 0,
      goodsDistributionCommissionSource: false,
      //批量编辑聚焦坐标
      focusIndex: '',
      //是否需要校验
      isChecked: false,
      //是否显示买家付邮费区域
      showBuyPostageArea: false,
      //是否显示不配送地区
      showNoDistribution: false,
      //自提状态
      pickUpInAStore: false,
      //配送状态
      distribution: false,
      goodStoreInformation: {}, //自提对象信息
      commitmentCustomers: [],
      //配送状态状态；0：停用；1:启用
      menberDistributionStatus: '',
      //到店自提状态；0：停用；1:启用
      pickUpStatus: '',
      //角色状态 ： 1：平台 2.供应商 3.店铺
      roleCode: '',
      //审核状态:商品审核：0：需审核 1:免审核
      goodAudit: '',
      storeList: '', //店铺list
      sysUserId: '', //用户id
      // goodId:"",//商品id
      fileList: [
        {
          uid: '-1',
          name: 'xxx.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
        }
      ],
      specificationsPicSelectIndexList: [0, 1],
      specificationsPicPreviewVisible: false,
      specificationsPicPreviewImage: '',
      sysUserDTOs: [], //供应商数据
      priceRange: '',
      reusePage: '', //复用页面参数
      addtest: {},
      filelist5: [],
      providerTemplateList1: [
        {
          id: '',
          name: '请选择'
        }
      ], //运费模板
      listsysArea: {}, //运费模板地址数据
      storeTemplateId: '',
      model: {},
      auditStatus: '',
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
      validatorRules: {
        mainPicture: {
          rules: [
            {
              required: true,
              validator: (rule, value, cbfn) => {
                if (typeof value == 'object') {
                  if (value.fileList.length < 1) {
                    cbfn('请上传图片')
                  } else if (value.fileList.length > 5) {
                    cbfn('上传图片不能大于5张')
                  } else {
                    cbfn()
                  }
                } else {
                  if (value == '{}') {
                    cbfn('请上传图片')
                  } else {
                    cbfn()
                  }
                }
                // if ((typeof value == 'object' && value.fileList.length < 1) || (typeof value == 'string' && value == '{}')) {
                //   cbfn('请上传图片')
                // } else if ( value.fileList.length > 5) {
                //   cbfn('上传图片不能大于5张')
                // } else {
                //   cbfn()
                // }
              }
            }
          ]
        },
        generalCommission: {
          rules: [
            {
              required: true,
              message: '请输入普通佣金!'
            }
          ]
        },
        vipCommission: {
          rules: [
            {
              required: true,
              message: '请输入vip佣金!'
            }
          ]
        },
        detailsGoods: {
          rules: [
            {
              validator: this.detailsGoodsUplode
            }
          ]
        },
        //规格表单验证
        SpecificationsInputCheck: {
          rules: [
            {
              required: true,
              pattern: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/,
              message: '最多只能输入两位小数的数字'
            }
          ]
        },
        //sku规格验证
        skucheck: {},
        providerTemplateId: {
          rules: [
            {
              required: true,
              message: '请选择!'
            },
            {
              validator: this.providerTemplateId2
            }
          ]
        }
        /* ,
           goodForm: {
             rules: [{
               required: true, message: '请选择!'
             }, {
               validator: this.SpecialOfferValidation
             }]
           }*/
      },
      url: {
        add: '/goodList/goodList/add',
        edit: '/goodList/goodList/edit',
        addgoodStore: '/goodStoreList/goodStoreList/add',
        editgoodStore: '/goodStoreList/goodStoreList/edit',
        getUserByRoleName: '/sys/user/getUserByRoleName',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        imgerver: window._CONFIG['domianURL'] + '/sys/common/view',
        providerTemplateList: '/providerTemplate/providerTemplate/queryList',
        findListByUserId: '/providerTemplate/providerTemplate/findListByUserId',
        findLIst: '/storeTemplate/storeTemplate/findLIst',
        findGoodStoreById: '/storeManage/storeManage/findGoodStoreById',
        getUserRoleCodeAndGoodAudit: '/sys/user/getUserRoleCodeAndGoodAudit',
        findStoreList: '/storeManage/storeManage/findStoreList',
        getGoodNoCount: '/goodList/goodList/getGoodNoCount'
      },
      SpecialOffer: true,
      //主图上传
      previewVisible1: false,
      previewImage1: '',
      fileList1: [],
      uploadingNumber1: 0,
      previewImage1list: {},
      //视频上传
      previewVisible2: false,
      previewImage2: '',
      fileList2: [],
      //多图上传
      previewVisible3: false,
      previewImage3: '',
      fileList3: [],
      uploadingNumber: 0,
      previewImage3list: {},
      //规格上传
      previewVisible4: false,
      previewImage4: '',
      uploadingNumber4: 0,
      previewImage4list: {},
      //点击图片选择的坐标
      selectUploadIndex: 0,
      //表单头部
      columns: [
        {
          title: '规格',
          dataIndex: 'specification',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '销售价（元）',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价（元）',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '供货价（元）',
          dataIndex: 'supplyPrice',
          align: 'center',
          scopedSlots: { customRender: 'supplyPrice' }
        },
        {
          title: '会员价（元）',
          dataIndex: 'vipPrice',
          align: 'center',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: 'sku编码',
          dataIndex: 'skuNo',
          align: 'center',
          scopedSlots: { customRender: 'skuNo' }
        }
        // {
        //   title: '规格图',
        //   dataIndex: 'specificationPicture',
        //   align: "center",
        //   scopedSlots: {customRender: 'specificationPicture'},
        // },
      ],
      isEdit: false,
      //表单数据
      data: [],
      // 商品规格数据返选
      CommoditySpecificationData: [],

      //鼠标经过的ipt坐标
      iptActiveIndex: -1,
      //商品编号是否存在
      existenceGoodNo: false, //false 不存在 true 存在
      //表单2
      columns2: [
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '供货价',
          dataIndex: 'supplyPrice',
          align: 'center',
          scopedSlots: { customRender: 'supplyPrice' }
        },
        {
          title: '会员价',
          dataIndex: 'vipPrice',
          align: 'center',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '总库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: 'sku编码',
          dataIndex: 'skuNo',
          align: 'center',
          scopedSlots: { customRender: 'skuNo' }
        },
        {
          title: '商品编码',
          dataIndex: 'goodNo',
          align: 'center',
          scopedSlots: { customRender: 'goodNo' }
        }
      ],
      columns3: [
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price1' }
        },
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price2' }
        },
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '供货价',
          dataIndex: 'supplyPrice',
          align: 'center',
          scopedSlots: { customRender: 'supplyPrice' }
        },
        {
          title: '会员价',
          dataIndex: 'vipPrice',
          align: 'center',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '总库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: '商品编码',
          dataIndex: 'goodNo',
          align: 'center',
          scopedSlots: { customRender: 'goodNo' }
        }
      ],
      data2: [
        {
          price: '0',
          costPrice: '0',
          supplyPrice: '0',
          vipPrice: '0',
          repertory: '0',
          goodNo: ''
        }
      ],
      //商品市场价
      marketPrice: '0',
      //发布助手注意事项
      releaseAttention: [
        {
          title: '商品名称',
          AllList: [
            'a.中文按照2个字符计算，最多填写30个汉字（60个字符）。',
            'b.商品标题=商品描述+相关属性，需与当前商品的分类、属性一致。',
            'c.错误填写可能会引起流量减少甚至商品下架，请准确填写！'
          ]
        },
        {
          title: '商品描述',
          AllList: ['a. 字数不能超过500字！']
        },
        {
          title: '商品轮播图',
          AllList: [
            'a. 尺寸宽高需均大于480px',
            'b. 大小5M以内',
            'c. 数量限制在10张以内',
            'd. 图片格式仅支持JPG,PNG,GIF格式',
            'e. 主轮播图背景为纯白色（服饰除外）,图片上不添加任何文字',
            'f. 批量上传时，图片须等宽高且不小于480px',
            'g. 可以拖动改变图片顺序'
          ]
        },
        {
          title: '商品视频要求',
          AllList: [
            'a. 时长30s以内',
            'b. 大小50M以内',
            'c. 尺寸比1:1',
            'd. 建议分辨率≥720P',
            'e. 支持mp4,rmvb,3gp,avi,mov,wmv,flv,mkv格式',
            'f. 请勿上传违禁内容，包含但不限于涉黄、涉暴、站外引流等内容'
          ]
        },
        {
          title: '商品详情图',
          AllList: [
            'a. 尺寸要求宽度大于480px',
            'b. 大小5M以内',
            'c. 数量限制在20张之间',
            'd. 图片格式仅支持JPG,PNG,GIF格式',
            'e. 批量上传时，尺寸要求宽度处于480~1200px之间，高度0~1500px之间',
            'f. 可以拖动改变图片顺序'
          ]
        },
        {
          title: '规格值',
          AllList: ['a. 最多填写18个字', "b. 仅允许中英文 数字 空格 部分英文符号如#:%()'+-*/. 部分中文符号如（）【】"]
        },
        {
          title: '市场价',
          AllList: ['a. 应高于上表所有SKU中的最大单买价格']
        },
        {
          title:
            '平台会根据商品分类、特性等因素，决定是否向消费者展示某项服务承诺标签，但展示与否不影响您对该项服务承诺应承担的义务与责任',
          AllList: [
            '7天无理由退货',
            '商家承诺按照《中华人民共和国消费者权益保护法》等相关法律法规及平台规则的规定，保障买家7天无理由退换货权益。买家在签收商品之日起七天内，对支持7天无理由退换货并符合完好标准的商品，可发起7天无理由退换货申请'
          ]
        },
        {
          title:
            '平台会根据商品分类、特性等因素，决定是否向消费者展示某项服务承诺标签，但展示与否不影响您对该项服务承诺应承担的义务与责任',
          AllList: [
            '假一赔十',
            '若商家违规销售《平台合作协议》规定的“严重问题产品”，商家同意平台有权依据《平台合作协议》、《假货处理规则》及其他相关规定采取违规处理措施，包括但不限于限制商家店铺资金提现、按照“假一赔十”的标准自商家店铺资金中扣除相应款项并代为向买家进行赔付、扣收店铺保证金、清退商家等'
          ]
        }
      ],
      //发布助手index
      releaseSelectedIndex: 0,
      //是否可以上传图片
      canUploadPic: true,
      //是否可以上传视频
      canUploadVideo: true,
      //商品属性是否可以选择特价
      specialPriceResult: true,
      //物流重量表头
      LogisticsWeightForm: [
        {
          title: '规格',
          dataIndex: 'Specifications',
          scopedSlots: { customRender: 'Specifications' },
          align: 'center'
        },
        {
          title: '重量（按物流重量含包装kg）',
          dataIndex: 'weight',
          scopedSlots: { customRender: 'weight' },
          align: 'center'
        }
      ],
      //物流重量数据
      LogisticsWeightdata: [
        {
          key: '-1',
          Specifications: '',
          weight: ''
        }
      ],
      showLogisticsWeight: false,
      //批量设置数据
      bulkFillData: {
        Specification1: '99',
        Specification2: '99',
        price: '',
        costPrice: '',
        repertory: '',
        skuNo: '',
        supplyPrice: '',
        vipPrice: ''
      },
      //警告MSG
      warningMessage: ''
      //返先规格图数据格式
      // fillList: [
      //   {
      //     uid: '-1',
      //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      //   },
      // ]
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },

  computed: {
    uploadAction() {
      return this.url.fileUpload
    },
    getMarketPrice() {
      return this.data2[0].price
    },
    dragOptions() {
      return {
        animation: 0,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  mounted() {
    this.init()
    this.getUserByRoleName()
    this.getUserRoleCodeAndGoodAudit() //角色信息判断
    //平台帮店铺录入商品的 店铺UserId
    if (this.$route.query.sysUserId) {
      this.sysUserId = this.$route.query.sysUserId
      this.model.sysUserId = this.$route.query.sysUserId
      this.handleChangeSore(this.sysUserId)
    }
    if (this.$route.query.reusePage) {
      //页面复用参数
      this.reusePage = this.$route.query.reusePage
      //运费模板
      if (this.reusePage == 2) {
        getAction(this.url.findListByUserId).then(res => {
          if (res.success) {
            let sz = [
              {
                id: '',
                name: '请选择'
              }
            ]
            for (let item of res.result) {
              sz.push(item)
              if (item.id == this.providerTemplateId) {
                this.listsysArea1(item)
              }
            }
            this.providerTemplateList1 = sz
            console.log('this.providerTemplateList1++++', this.providerTemplateList1)
          }
        })
      }
      if (this.reusePage == 3) {
        //管理员登录
        if (localStorage.getItem('GoodListListInfo')) {
          let data = JSON.parse(localStorage.getItem('GoodListListInfo'))
          getAction(this.url.findLIst, { uId: data.sysUserId }).then(res => {
            if (res.success) {
              let sz = [
                {
                  id: '',
                  name: '请选择'
                }
              ]
              for (let item of res.result) {
                sz.push(item)

                if (item.id == this.storeTemplateId) {
                  this.listsysArea1(item)
                }
              }
              this.providerTemplateList1 = sz
            }
          })
        } else {
          getAction(this.url.findLIst, { uId: '' }).then(res => {
            if (res.success) {
              let sz = [
                {
                  id: '',
                  name: '请选择'
                }
              ]
              for (let item of res.result) {
                if (item.id == this.storeTemplateId) {
                  this.listsysArea1(item)
                }
              }
              this.providerTemplateList1 = [...sz, ...res.result]
            }
          })
        }
      }
    }
    console.log('this.reusePage===', this.reusePage)
    if (this.reusePage == 2) {
      //供应商用户
      this.columns = [
        {
          title: '规格',
          dataIndex: 'specification',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '销售价（元）',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价（元）',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: 'sku编码',
          dataIndex: 'skuNo',
          align: 'center',
          scopedSlots: { customRender: 'skuNo' }
        },
        {
          title: '规格图',
          dataIndex: 'specificationPicture',
          align: 'center',
          scopedSlots: { customRender: 'specificationPicture' }
        }
      ]
      this.columns2 = [
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '总库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: '商品编码',
          dataIndex: 'goodNo',
          align: 'center',
          scopedSlots: { customRender: 'goodNo' }
        }
      ]
    }
    if (this.reusePage == 3) {
      //店铺用户
      this.columns = [
        {
          title: '规格',
          dataIndex: 'specification',
          align: 'center',
          scopedSlots: { customRender: 'specification' }
        },
        {
          title: '销售价（元）',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价（元）',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '会员价（元）',
          dataIndex: 'vipPrice',
          align: 'center',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: 'sku编码',
          dataIndex: 'skuNo',
          align: 'center',
          scopedSlots: { customRender: 'skuNo' }
        },
        {
          title: '规格图',
          dataIndex: 'specificationPicture',
          align: 'center',
          scopedSlots: { customRender: 'specificationPicture' }
        }
      ]
      this.columns2 = [
        {
          title: '销售价',
          dataIndex: 'price',
          align: 'center',
          scopedSlots: { customRender: 'price' }
        },
        {
          title: '成本价',
          dataIndex: 'costPrice',
          align: 'center',
          scopedSlots: { customRender: 'costPrice' }
        },
        {
          title: '会员价',
          dataIndex: 'vipPrice',
          align: 'center',
          scopedSlots: { customRender: 'vipPrice' }
        },
        {
          title: '总库存',
          dataIndex: 'repertory',
          align: 'center',
          scopedSlots: { customRender: 'repertory' }
        },
        {
          title: '商品编码',
          dataIndex: 'goodNo',
          align: 'center',
          scopedSlots: { customRender: 'goodNo' }
        }
      ]
    }
    //配送方式判断
    //this.distributionSupport('0')
    this.loadingPage()

    // this.listsysArea1(this.providerTemplateList1[0])

    //      console.log(typeof this.data[0].specificationPicture)
    //      console.log([this.data[0].specificationPicture])
  },
  methods: {
    handlerAccountingRules(accountingRules) {
      let record = JSON.parse(accountingRules)
      return `配送费:${record.distributionFeeDistance}公里内${record.distributionFee}元,每增加${
        record.everyIncrease
      }公里配送费增加${record.increaseInDeliveryFee}元`
    },

    handleOk(e) {
      this.rush()
    },

    handleCancel(e) {
      this.visible2 = false
      this.$router.push({ path: `/good/GoodListList`, query: { isrush: true } })
    },

    add() {
      this.edit({})
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element
      const draggedElement = draggedContext.element
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    //添加规格
    addSpecification() {
      let data
      if (this.CommoditySpecificationData.length < 2) {
        //商品规格数据集合形式
        if (this.CommoditySpecificationData.length == 0) {
          data = {
            //规格名
            CommodityStyle: '',
            //规格值集合
            classification: [
              {
                value: '',
                SpecificationsPictures: [],
                specificationsPicPreviewVisible: false,
                specificationsPicPreviewImage: ''
              }
            ]
          }
        } else {
          data = {
            //规格名
            CommodityStyle: '',
            //规格值集合
            classification: [
              {
                value: ''
              }
            ]
          }
        }

        this.CommoditySpecificationData.push(data)
      }
    },
    //添加规格具体值
    addSpecificationDetail(index) {
      let data,
        classifyData = this.CommoditySpecificationData[index].classification
      if (index == 0) {
        //第一个规格添加
        data = {
          key: `firstCommoditySpecificationData0${classifyData.length}`,
          value: '',
          SpecificationsPictures: [],
          specificationsPicPreviewVisible: false,
          specificationsPicPreviewImage: ''
        }
      } else {
        //第二个规格添加
        data = {
          key: `secondCommoditySpecificationData${classifyData.length}`,
          value: ''
        }
      }
      if (classifyData.length == 0 || classifyData[classifyData.length - 1].value.length > 0) {
        classifyData.push(data)
      }
      // else if (classifyData[classifyData.length - 1].value.length > 0) {
      //     classifyData.push(data)
      // }
    },
    //确定删除规格弹窗
    showConfirm(index) {
      let that = this
      this.$confirm({
        title: '删除该规格后，当前的规格相关数据将丢失，确认要删除吗?',
        content: '您确定要删除吗？',
        onOk() {
          that.deleteSpecification(index)
        },
        onCancel() {},
        class: 'test'
      })
    },
    // 删除规格
    deleteSpecification(index) {
      if (index == 0) {
        this.CommoditySpecificationData = []
        this.LogisticsWeightdata = [
          {
            key: '-1',
            Specifications: '',
            weight: ''
          }
        ]
        this.data = []
        this.$nextTick(() => {
          this.RecalculationMinOrMax()
        })
      }
      if (index == 1) {
        this.CommoditySpecificationData.splice(1, 1)
        let sz = []
        let sz2 = []
        let count = 0
        for (let item of this.CommoditySpecificationData[0].classification) {
          let data = {
            key: count,
            specification: item.value,
            price: item.price,
            costPrice: item.costPrice,
            vipPrice: item.vipPrice,
            supplyPrice: item.supplyPrice,
            repertory: item.repertory,
            skuNo: item.skuNo,
            specificationPicture: []
          }
          let data2 = {
            key: count,
            Specifications: item.value,
            weight: item.weight
          }
          sz.push(data)
          sz2.push(data2)
          count++
        }
        this.data = sz
        this.LogisticsWeightdata = sz2
        this.$nextTick(() => {
          this.RecalculationMinOrMax()
        })
      }
    },
    //规格具体值内容变化时
    iptChange2(index, ct, wrapIndex) {
      //第一个规格的input变化
      if (!ct) return
      if (wrapIndex + 1 == 1 && this.CommoditySpecificationData.length == 1) {
        if (this.data.length == index) {
          let data = {
            key: `firstCommoditySpecificationData${index}`,
            specification: ct,
            price: '',
            costPrice: '',
            supplyPrice: '',
            vipPrice: '',
            repertory: '',
            skuNo: '',
            specificationPicture: []
          }
          let data2 = {
            key: `firstCommoditySpecificationData${index}`,
            Specifications: ct,
            weight: ''
          }
          if (this.data.length <= 0) {
            this.LogisticsWeightdata = []
            this.$nextTick(() => {
              this.LogisticsWeightdata.push(data2)
            })
          } else {
            this.LogisticsWeightdata.push(data2)
          }
          this.data.push(data)
        } else {
          if (ct.length > 0) {
            this.data[index].specification = ct
            if (Array.isArray(this.LogisticsWeightdata) && this.LogisticsWeightdata.length > 0) {
              this.LogisticsWeightdata[index].Specifications = ct
            }
          } else {
            this.data.splice(index, 1)
            if (Array.isArray(this.LogisticsWeightdata) && this.LogisticsWeightdata.length > 0) {
              this.LogisticsWeightdata.splice(index, 1)
            }
          }
        }
      }
      //第二个规格的input变化
      if (wrapIndex + 1 == 2 || this.CommoditySpecificationData.length == 2) {
        let sz = []
        let count = 1
        let sz2 = []
        for (let item of this.CommoditySpecificationData[0].classification) {
          for (let item2 of this.CommoditySpecificationData[1].classification) {
            count++
            let shuzu = [item.value, item2.value]
            let data = {
              key: `secondCommoditySpecificationData${count}`,
              specification: shuzu.join(','),
              price: '',
              costPrice: '',
              supplyPrice: '',
              vipPrice: '',
              repertory: '',
              skuNo: '',
              specificationPicture: []
            }
            let data2 = {
              key: `secondCommoditySpecificationData${count}`,
              Specifications: shuzu.join(','),
              weight: ''
            }
            sz.push(data)
            sz2.push(data2)
          }
        }
        this.data = sz
        this.LogisticsWeightdata = sz2
      }
      this.$nextTick(() => {
        //重新计算范围值
        this.RecalculationMinOrMax()
      })
    },
    //表单1内容input改变
    handleChange(value, key, column) {
      const newData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        // if (column == 'skuNo') {
        //   target[column] = value
        // } else if (column == 'repertory') {
        //   target[column] = Math.floor(value)
        // } else {
        //   target[column] = Math.floor(value * 100) / 100
        // }
        target[column] = value
        if ((target['price'] != '' || target['costPrice'] != '') && (column == 'price' || column == 'costPrice')) {
          this.allPriceChange(target)
        }

        if (target.supplyPrice > target.price) {
          target.supplyPrice = target.price
        }

        if (target.vipPrice > target.price) {
          target.vipPrice = target.price
        }

        this.data = newData
        this.MinOrMax(column)
        this.MinOrMax('supplyPrice')
        this.MinOrMax('vipPrice')
        //校验
        this.dataCheck()
        //商品属性特价判定
        this.specialPrice(1)
      }
    },
    //价格联动方法封装
    allPriceChange(bulkFillData) {
      if (bulkFillData.price && bulkFillData.costPrice) {
        // 供货价=成本价+成本价*供货价比例 supply_price
        //计算公式写法1 parseFloat((parseFloat(bulkFillData.costPrice) + parseFloat(bulkFillData.costPrice * this.supplyPriceRatio / 100)).toFixed(2))
        //计算公式写法2 `${Math.floor(parseFloat((parseFloat(bulkFillData['costPrice']) + parseFloat(bulkFillData['costPrice'] * this.supplyPriceRatio / 100))) * 100) / 100}`
        let supplyPrice = parseFloat(
          (
            parseFloat(bulkFillData.costPrice) + parseFloat((bulkFillData.costPrice * this.supplyPriceRatio) / 100)
          ).toFixed(2)
        )

        //会员价=（销售价 - 供货价 ）*会员价比例+供货价
        //计算公式写法1  parseFloat(((parseFloat(bulkFillData.price) - parseFloat(this.reusePage == 3 ? bulkFillData.costPrice : bulkFillData.supplyPrice)) * parseFloat(this.membershipRate / 100) + parseFloat(bulkFillData.supplyPrice))).toFixed(2)
        //计算公式写法2  `${Math.floor(parseFloat(((parseFloat(bulkFillData['price']) - parseFloat(this.reusePage == 3 ? bulkFillData['costPrice'] : bulkFillData['supplyPrice'])) * parseFloat(this.membershipRate / 100) + parseFloat(this.reusePage == 3 ? bulkFillData['costPrice'] : bulkFillData['supplyPrice']))) * 100) / 100}`
        // let vipPrice = parseFloat(((parseFloat(bulkFillData.price) - parseFloat(this.reusePage == 3 ? bulkFillData.costPrice : supplyPrice)) * parseFloat(this.membershipRate / 100) + parseFloat(supplyPrice))).toFixed(2)
        let vipPrice = (parseFloat(bulkFillData.price) * this.membershipRate).toFixed(2)
        if (supplyPrice < parseFloat(bulkFillData.costPrice)) {
          //如果供货价小于成本价
          bulkFillData.supplyPrice = parseFloat(bulkFillData.costPrice)
        } else if (supplyPrice > parseFloat(bulkFillData.price)) {
          //如果供货价大于销售价
          bulkFillData.supplyPrice = parseFloat(bulkFillData.price)
        } else {
          bulkFillData.supplyPrice = supplyPrice
        }
        // if (vipPrice > parseFloat(bulkFillData.price)) {
        //   //如果会员价大于销售价
        //   bulkFillData.vipPrice = parseFloat(bulkFillData.price)
        // } else if (vipPrice < supplyPrice) {
        //   //如果会员价小于供货价
        //   bulkFillData.vipPrice = supplyPrice
        // } else {
        bulkFillData.vipPrice = vipPrice
        console.log(bulkFillData)
        // }
      }
    },
    //鼠标进入事件
    enter(index) {
      this.iptActiveIndex = index
    },
    //鼠标离开事件
    leave() {
      this.iptActiveIndex = -1
    },
    //点击删除规格值
    clearClassification(index, item2) {
      this.isSpin = true
      let result = item2.value
      //规格表格的删除
      setTimeout(() => {
        for (let index2 = 0, flag = true; index2 < this.data.length; flag ? index2++ : index2) {
          console.log(JSON.stringify(this.data))

          let specification = this.data[index2].specification //表的规格值
          if (specification.indexOf(',') == -1) {
            //如果是单个
            specification = [specification]
          }
          let specificationSz = Array.isArray(specification) ? specification : specification.split(',') //['高级套餐','中级套餐']  数组形式规格名
          let resultIndex = specificationSz.indexOf(result) //在数组里找名字存不存在 存在返回坐标 不存在-1
          if (resultIndex != -1) {
            //splice 删除的开始坐标  删除的个数（重铸规格名）
            specificationSz.splice(resultIndex, 1)
            if (specificationSz.length > 1) {
              this.data[index2].specification = specificationSz.join(',')
            } else {
              this.data.splice(index2, 1)
              console.log(JSON.stringify(this.data))
            }
          }
          // setTimeout(()=>{
          if (specificationSz.length > 1 || (specificationSz.length == 1 && index == 0)) {
            flag = true
          } else {
            flag = false
            if (this.CommoditySpecificationData.length == 1) {
              break
            }
          }
        }
      }, 10)

      //物流重量的删除
      setTimeout(() => {
        for (let index2 = 0, flag = true; index2 < this.LogisticsWeightdata.length; flag ? index2++ : index2) {
          // setTimeout(()=>{
          let specification = this.LogisticsWeightdata[index2].Specifications
          if (specification.indexOf(',') == -1) {
            specification = [specification]
          }
          let specificationSz = Array.isArray(specification) ? specification : specification.split(',')
          let resultIndex = specificationSz.indexOf(result)
          if (resultIndex != -1) {
            specificationSz.splice(resultIndex, 1)

            if (specificationSz.length > 1) {
              this.LogisticsWeightdata[index2].Specifications = specificationSz.join(',')
              flag = true
            } else {
              this.LogisticsWeightdata.splice(index2, 1)
              flag = false
              if (this.CommoditySpecificationData.length == 1) {
                break
              }
            }
          }

          // },0)
        }
        this.isSpin = false
      }, 200)

      setTimeout(() => {
        if (
          this.CommoditySpecificationData.length == index + 1 &&
          this.CommoditySpecificationData[index].classification.length <= 1
        ) {
          this.isSpin = false
          this.deleteSpecification(index)
        } else {
          for (let index2 = 0; index2 <= this.CommoditySpecificationData[index].classification.length; index2++) {
            if (this.CommoditySpecificationData[index].classification[index2].value == result) {
              this.CommoditySpecificationData[index].classification.splice(index2, 1)
              break
            }
          }
        }
      }, 200)

      // this.data.splice(index2, 1)
      // this.LogisticsWeightdata.splice(index2, 1)
      // this.$nextTick(() => {
      this.RecalculationMinOrMax()
      // })
    },
    //表单2输入框输入事件
    handleChange4(value, key, column) {
      const newData = [...this.data2]
      const target = newData.filter(item => key === item.key)[0]
      if (target) {
        // if (column == 'repertory') {
        //   target[column] = Math.floor(value)
        // } else if (column != 'goodNo') {
        //   target[column] = Math.floor(value * 100) / 100
        // } else {
        //   target[column] = value
        // }

        target[column] = value
        if ((target['price'] != '' || target['costPrice'] != '') && (column == 'price' || column == 'costPrice')) {
          this.allPriceChange(target)
        }

        if (target.supplyPrice > target.price) {
          target.supplyPrice = target.price
        }

        if (target.vipPrice > target.price) {
          target.vipPrice = target.price
        }

        this.data2 = newData
      }
      if (column == 'price') {
        this.marketPrice = (value * 1.1).toFixed(2)
      }
      if (column == 'goodNo') {
        this.getGoodNoCount()
      }
      //商品属性特价判定
      this.specialPrice(2)
      //校验
      this.dataCheck()
    },
    //this.data规格值校验
    dataCheck(callback = '') {
      console.log(this.reusePage, 'reusePagereusePage')
      let result
      if (this.CommoditySpecificationData.length <= 0) {
        result = this.data2.every(item => {
          if (this.reusePage == 2) return item.price * 1 > 0 && item.costPrice * 1 > 0
          if (this.reusePage == 3)
            return item.price * 1 > 0 && item.costPrice * 1 > 0 && item.vipPrice * 1 > 0 && item.repertory * 1 >= 0 //&& item.goodNo
          return (
            item.price * 1 > 0 &&
            item.costPrice * 1 > 0 &&
            item.supplyPrice * 1 > 0 &&
            item.vipPrice * 1 > 0 &&
            item.repertory * 1 >= 0
          ) //&& item.goodNo
        })
      } else {
        //如果data的其中的任何一个值为0或者空  result 为false
        result = this.data.every(item => {
          if (this.reusePage == 2) return item.price * 1 > 0 && item.costPrice * 1 > 0
          if (this.reusePage == 3)
            return item.costPrice * 1 > 0 && item.repertory * 1 >= 0 && item.vipPrice * 1 > 0 && item.price * 1 > 0 //&& item.skuNo
          return (
            item.costPrice * 1 > 0 &&
            item.repertory * 1 >= 0 &&
            item.supplyPrice * 1 > 0 &&
            item.vipPrice * 1 > 0 &&
            item.price * 1 > 0
          ) //&& item.skuNo
        })
      }
      //是否开启校验
      this.isChecked = !result
      this.$nextTick(() => {
        if (callback) {
          callback()
        }
      })
    },
    //规格值校验
    CommoditySpecificationDataCheck(callback = '') {
      let CommoditySpecificationData = this.CommoditySpecificationData
      if (CommoditySpecificationData.length > 0) {
        //如果有规格
        let isCommodityStyle = CommoditySpecificationData.every(item => {
          let value = '' //保存value
          //两个规格的所有规格值是否为空并且是否与其中一个值相同判断
          let result = item.classification.every(item2 => {
            let a = item2.value && item2.value != value
            value = item2.value
            return a
          })
          return item.CommodityStyle && result
        })
        //是否开启校验
        this.isChecked = !isCommodityStyle
        this.$nextTick(() => {
          if (callback) {
            callback()
          }
        })
      } else {
        //如果没有规格
        //是否开启校验
        this.isChecked = false
        this.$nextTick(() => {
          if (callback) {
            callback()
          }
        })
      }
    },
    //保留两位小数
    keepSecondCount(num) {
      if (num) {
        return Math.round(num * 100) / 100
      } else {
        return 0
      }
    },
    //判断范围值
    MinOrMax(column) {
      let that = this
      // this.$nextTick(() => {
      let sz = [],
        type = '',
        Max,
        Min
      switch (column) {
        case 'price':
          for (let item of this.data) {
            //会员价=（销售价-供货价）*会员价比例+供货价
            this.allPriceChange(item)
            sz.push(that.keepSecondCount(item.price))
          }
          type = 'price'
          break
        case 'costPrice':
          for (let item of this.data) {
            this.allPriceChange(item)
            sz.push(that.keepSecondCount(item.costPrice))
          }
          type = 'costPrice'
          break
        case 'supplyPrice':
          for (let item of this.data) {
            sz.push(that.keepSecondCount(item.supplyPrice))
          }
          type = 'supplyPrice'
          break
        case 'vipPrice':
          for (let item of this.data) {
            sz.push(that.keepSecondCount(item.vipPrice))
          }
          type = 'vipPrice'
          break
        case 'repertory':
          for (let item of this.data) {
            sz.push(item.repertory)
          }
          type = 'repertory'
          break
      }

      sz = sz.notempty()
      if (type == 'repertory') {
        let result = 0
        for (let i = 0; i < sz.length; i++) {
          result += sz[i] * 1
        }
        this.data2[0][type] = result
      } else {
        if (sz.length == 0) {
          Max = 0
          Min = 0
        } else {
          Max = that.keepSecondCount(Math.max(...sz)) || 0
          Min = that.keepSecondCount(Math.min(...sz)) || 0
        }
        if (Min == Max) {
          this.data2[0][type] = Min || Max
        } else {
          this.data2[0][type] = `${Min} -- ${Max} `
        }
      }
      if (type == 'price') {
        this.marketPrice = (Max * 1.1).toFixed(2)
      }
      // })
    },
    //重新计算范围值
    RecalculationMinOrMax() {
      let Attribute = ['price', 'costPrice', 'supplyPrice', 'vipPrice', 'repertory']
      for (let item of Attribute) {
        let sz = [],
          type = item,
          Max,
          Min
        for (let item2 of this.data) {
          sz.push(item2[type])
        }
        if (item == 'repertory') {
          this.MinOrMax('repertory')
        } else {
          if (sz.length > 0) {
            Max = Math.max(...sz) || 0
            Min = Math.min(...sz) || 0
            if (Min == Max) {
              this.data2[0][type] = Min || Max
              if (type == 'price') {
                this.priceRange = 0
              } else {
                this.priceRange = 1
              }
            } else {
              this.data2[0][type] = `${Min} -- ${Max} `
            }
            if (type == 'price') {
              this.marketPrice = (Max * 1.1).toFixed(2)
            }
          } else {
            this.data2[0][type] = `0`
            this.marketPrice = '0'
          }
        }
      }
    },
    //物流重量input变化
    LogisticsWeightinputChange(value, key, column) {
      value = value.replace(/^(\-)*(\d+)\.(\d\d\d).*$/, '$1$2.$3')
      if (value < 0) {
        value = 0
      }
      const newData = [...this.LogisticsWeightdata]
      const dataOfNewData = [...this.data]
      const target = newData.filter(item => key === item.key)[0]
      const dataOftarget = dataOfNewData.filter(item => key === item.key)[0]
      if (target) {
        if (newData.length > 0) {
          target[column] = value
        }
        if (dataOfNewData.length > 0) {
          dataOftarget[column] = value
        }
        this.LogisticsWeightdata = newData
        this.data = dataOfNewData
      }
    },
    //发布助手内容变化
    ReleaseContentChange(index) {
      this.releaseSelectedIndex = index
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      if (this.model.delFlag == '' || this.model.delFlag == undefined) {
        this.model.delFlag = 0
      }
      this.$nextTick(() => {
        // 'generalCommission','vipCommission',
        this.form.setFieldsValue(
          pick(
            this.model,
            'year',
            'month',
            'day',
            'sysUserId',
            'delFlag',
            'goodTypeId',
            'mainPicture',
            'goodName',
            'nickName',
            'price',
            'costPrice',
            'supplyPrice',
            'vipPrice',
            'activitiesType',
            'marketPrice',
            'status',
            'goodDescribe',
            'goodVideo',
            'detailsGoods',
            'repertory',
            'frameStatus',
            'frameExplain',
            'goodNo',
            'statusExplain',
            'specification',
            'isSpecification',
            'providerTemplateId',
            'commitmentCustomers',
            'auditStatus',
            'auditExplain',
            'delExplain',
            'goodForm',
            'GoodListSpecificationVOs',
            'noutoasiakasStatus',
            'distributionStatus',
            'source',
            'sourceType'
          )
        )
        //时间格式化
        this.form.setFieldsValue({ delTime: this.model.delTime ? moment(this.model.delTime) : null })
      })
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    //供应商和运费模板联动
    handleProvinceChange(value) {
      this.providerTemplateList(value)
    },
    //图片校验
    pictureBeforeUpload(file) {
      const isPic = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isPic) {
        this.$message.error('图片格式仅支持JPG,PNG,GIF格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 5
      if (!isLt2M) {
        this.$message.error('图片大小必须在5M以内!')
      }
      this.canUploadPic = isPic && isLt2M
      return isPic && isLt2M
    },
    //视频校验
    videoBeforeUpload(file) {
      console.log(file.type)
      const isVideo =
        file.type === 'video/mp4' ||
        file.type === 'video/rmvb' ||
        file.type === 'video/3gp' ||
        file.type === 'video/avi' ||
        file.type === 'video/mov' ||
        file.type === 'video/x-ms-wmv' ||
        file.type === 'video/flv' ||
        file.type === 'video/mkv'
      if (!isVideo) {
        this.$message.error('视频格式支持mp4,rmvb,3gp,avi,mov,wmv,flv,mkv格式!')
      }
      const isLt2M = file.size / 1024 / 1024 < 50
      if (!isLt2M) {
        this.$message.error('视频大小必须在50M以内!')
      }
      this.canUploadVideo = isVideo && isLt2M
      return isVideo && isLt2M
    },
    /*主图上传*/
    //多图上传开始
    handleCancel1() {
      this.previewVisible1 = false
      this.close()
    },
    handlePreview1(file) {
      this.previewImage1 = file.url || file.thumbUrl
      this.previewVisible1 = true
    },
    handleChange1({ fileList }) {
      if (this.canUploadPic) {
        this.fileList1 = fileList
      }
    },
    //主图交换位置时的方法
    mainPictureChangePosition(fileList) {
      let result = []
      for (let item of fileList) {
        let obj = {
          name: item.name,
          imgUrl: item.response ? item.response.message : ''
        }
        result.push(obj)
      }
      this.uploadingNumber1 = result.length
      let obj = {}
      for (let i = 0; i < result.length; i++) {
        obj[i] = result[i].imgUrl
      }
      this.previewImage1list = JSON.stringify(obj).toString()
    },
    //详情图交换位置方法
    detailPictureChangePosition(fileList) {
      let result = []
      for (let item of fileList) {
        let obj = {
          name: item.name,
          imgUrl: item.response ? item.response.message : ''
        }
        result.push(obj)
      }
      this.uploadingNumber = result.length
      let obj = {}
      for (var i = 0; i < result.length; i++) {
        obj[i] = result[i].imgUrl
      }
      this.previewImage3list = JSON.stringify(obj).toString()
    },
    //规格图上传
    specificationsPichandleChange({ fileList }) {
      if (this.canUploadPic) {
        let indexList = this.specificationsPicSelectIndexList
        this.CommoditySpecificationData[indexList[0]].classification[indexList[1]].SpecificationsPictures = fileList
      }
    },
    specificationsPichandleRemove() {
      console.log('执行l')
      return false
    },
    specificationsPichandleRemoves(file) {
      console.log(file.originFileObj.uid)
      let uid = (file.uid = file.originFileObj.uid)
      var flag = true
      let indexList = this.specificationsPicSelectIndexList
      // console.log(this.CommoditySpecificationData[indexList[0]])
      // try {
      //   if (this.CommoditySpecificationData[indexList[0]].classification > 1) {
      //     this.CommoditySpecificationData[indexList[0]].classification.forEach(function(item) {
      //       console.log(item)
      //       if (item.SpecificationsPictures[0].uid == uid) {
      //         console.log(item.SpecificationsPictures[0].uid, '3333')
      //         flag = true
      //       } else {
      //         console.log(item.SpecificationsPictures[0].uid, '2222')
      //         flag = false
      //         throw '循环退出'
      //       }
      //     })
      //   } else {
      //     flag = false
      //     throw '循环退出'
      //   }
      // } catch (e) {
      //   console.log(e)
      // }

      // return flag
    },
    specificationsPicHandlePreview(file) {
      console.log(file)
      let uid = file.uid
      // let that = this
      let indexList = this.specificationsPicSelectIndexList
      this.CommoditySpecificationData[indexList[0]].classification.forEach(function(item) {
        if (item.SpecificationsPictures[0].uid == uid) {
          item.specificationsPicPreviewImage = file.url || file.thumbUrl
          item.specificationsPicPreviewVisible = true
        }
      })
      console.log(this.CommoditySpecificationData[indexList[0]].classification, '2222')
      // console.log(uid, 'uid')
      // console.log(this.CommoditySpecificationData[indexList[0]].classification, '数组')
      // that.CommoditySpecificationData[indexList[0]].classification[indexList[1]].specificationsPicPreviewImage =
      //   file.url || file.thumbUrl
      // that.CommoditySpecificationData[indexList[0]].classification[indexList[1]].specificationsPicPreviewVisible = true
    },
    specificationsPichandleCancel() {
      //预览图片
      let indexList = this.specificationsPicSelectIndexList
      this.CommoditySpecificationData[indexList[0]].classification[indexList[1]].specificationsPicPreviewVisible = false
    },
    specificationsSureIndex(index, index2) {
      // console.log('执行了')
      this.specificationsPicSelectIndexList[0] = index
      this.specificationsPicSelectIndexList[1] = index2
    },
    //上传视频
    handleChange2(info) {
      if (this.canUploadVideo) {
        let fileList = [...info.fileList]
        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
        fileList = fileList.slice(-2)
        // 2. read from response and show file link
        fileList = fileList.map(file => {
          if (file.response) {
            // Component will show file.url as link
            file.url = file.response.url
          }
          return file
        })
        this.fileList2 = fileList
      }
    },
    //商品详情图
    handleCancel3() {
      this.previewVisible3 = false
      this.close()
    },
    handlePreview3(file) {
      this.previewImage3 = file.url || file.thumbUrl
      this.previewVisible3 = true
    },
    handleChange3({ fileList }) {
      if (this.canUploadPic) {
        this.fileList3 = fileList
        // console.log('this.previewImage3list', this.previewImage3list)
      }
    },
    //商品规格图
    handleCancel4() {
      this.previewVisible4 = false
      this.close()
    },
    handlePreview4(file) {
      this.previewImage4 = file.url || file.thumbUrl
      this.previewVisible4 = true
    },
    handleChange44({ fileList }) {
      this.data[this.selectUploadIndex].specificationPicture = fileList
      let result = []
      for (let item of fileList) {
        let obj = {
          name: item.name,
          imgUrl: item.response ? item.response.message : ''
        }
        result.push(obj)
      }
      this.uploadingNumber = result.length
      // let obj ={};
      // for(var i=0;i<result.length;i++){
      //   obj[i] = result[i].imgUrl;
      // }
      // this.previewImage4list = JSON.stringify(obj).toString()
      // console.log("this.previewImage4list",this.previewImage4list)
    },
    //商品属性特价判定
    specialPrice(form) {
      console.log('特价判定', this.specialPriceRatio, this.data)
      let result
      if (form == 1) {
        //根据表单1判定
        result = this.data.every(item => {
          return (item.price * parseFloat(this.specialPriceRatio)) / 100 > item.costPrice
        })
      } else {
        console.log(2)
        //根据表单2判定
        result = this.data2.every(item => {
          return (item.price * parseFloat(this.specialPriceRatio)) / 100 > item.costPrice
        })
      }
      console.log(result)
      this.specialPriceResult = result
    },
    prevStep(e) {
      //提交 e=1
      if (e == '1') {
        //  const goodNoCheck = await this.getGoodNoCount()
        this.dataCheck(() => {
          //规格名和对应值校验
          if (this.isChecked) {
            this.warningMessage = '请设置完成价格与库存中的值'
            this.$message.warn('请设置完成价格与库存中的值！')
            return
          } else if (this.existenceGoodNo) {
            this.warningMessage = '已存在相同的商品编号。'
            this.$message.warn('已存在相同的商品编号。')
            return
          } else {
            this.CommoditySpecificationDataCheck(() => {
              if (this.isChecked) {
                this.warningMessage = '请设置完成商品规格信息并且规格值信息不能出现重复的情况!'
                this.$message.warn('请设置完成商品规格信息并且规格值信息不能出现重复的情况！')
                return
              }
              //如果是无规格且是重量计费且重量的值为空的判断
              console.log('this.listsysArea.chargeMode', this.listsysArea.chargeMode)
              if (this.listsysArea.chargeMode == '1' && this.listsysArea.templateType == '1') {
                if (
                  this.CommoditySpecificationData.length <= 0 &&
                  !this.LogisticsWeightdata[0].weight * 1 &&
                  (!this.LogisticsWeightdata[0].Specifications || this.LogisticsWeightdata[0].Specifications == '无')
                ) {
                  this.$message.warn('按重量计费模板需填写重量值！')
                  return
                }
              }

              this.form.validateFields((err, values) => {
                if (err) return

                if (this.reusePage != 3) {
                  //如果选择了特价并且特价为不可选 则提示
                  if (values.goodForm == null || values.goodForm == '') {
                    values.goodForm = 0
                  }
                  /*if (values.goodForm == 1 && !this.specialPriceResult) {
                      this.$message.warn('不是特价商品不可选特价！')
                      return
                    }*/
                } else {
                  if (!values.sysUserId) {
                    //添加绑定指点店铺id
                    if (this.sysUserId) {
                      values.sysUserId = this.sysUserId
                    }
                  }
                }

                console.log(
                  'this.CommoditySpecificationData,商品规格数据' + JSON.stringify(this.CommoditySpecificationData)
                )
                console.log('this.data,表单数据' + JSON.stringify(this.data))
                //values.GoodListSpecificationVOs1="ssss";
                if (values.delFlag == '' || values.delFlag == undefined) {
                  values.delFlag = 0 //删除状态
                }
                if (values.frameStatus == '' || values.frameStatus == undefined) {
                  values.frameStatus = 1 //上下架状态
                }
                if (values.status == '' || values.status == undefined) {
                  values.status = 1 //上下架状态
                }
                //保存草稿箱后再次编辑完成提交，改变状态
                if (this.auditStatus == '0') {
                  values.frameStatus = 1
                  values.status = 1
                }

                //无规格重量
                values.weight = this.LogisticsWeightdata[0].weight

                if (values.providerTemplateId == '' || values.providerTemplateId == undefined) {
                  values.providerTemplateId = this.model.providerTemplateId
                }

                if (this.reusePage != 3) {
                  values.goodTypeId = this.GoodTypeByid1 //分类id
                  if (!values.providerTemplateId) {
                    this.$message.warn('请选择运费模板！')
                    return
                  }
                } else {
                  values.goodStoreTypeId = this.GoodTypeByid1 //分类id
                  console.log('values.providerTemplateId', values.providerTemplateId)
                  console.log('this.model.providerTemplateId', this.model.providerTemplateId)
                  values.storeTemplateId = values.providerTemplateId

                  if (!values.storeTemplateId && values.noutoasiakasStatus != '1' && values.distributionStatus != '1') {
                    this.$message.warn('请选择自提,配送,运费模板其中一种！')
                    return
                  }
                }
                // if(this.model.sysUserId){
                //   values.sysUserId = this.model.sysUserId
                // }else{
                //   if (values.sysUserId == '' || values.sysUserId == undefined) {
                //     values.sysUserId = this.userInfo().id
                //   }
                // }

                if (this.model.id != '' || this.model.id != undefined) {
                  values.id = this.model.id
                }
                if (this.priceRange) {
                  values.priceRange = this.priceRange //有无销售价区间；0：无；1：有
                }
                //审核状态为空
                if (this.goodAudit) {
                  //免审核
                  if (this.goodAudit == '1') {
                    values.auditStatus = '2'
                  } else {
                    //需要平台审核
                    values.auditStatus = e
                  }
                } else {
                  values.auditStatus = e
                }

                console.log('this.CommoditySpecificationData.length', this.CommoditySpecificationData.length)
                if (this.CommoditySpecificationData.length > 0) {
                  values.isSpecification = '1'
                  let sz = []
                  for (let item2 of this.CommoditySpecificationData[0].classification) {
                    if (item2.SpecificationsPictures.length > 0) {
                      if (item2.SpecificationsPictures[0].response) {
                        item2.SpecificationsPictures = item2.SpecificationsPictures[0].response.message
                      } else if (item2.SpecificationsPictures[0].url) {
                        item2.SpecificationsPictures = item2.SpecificationsPictures[0].url.substring(
                          this.url.imgerver.length + 1
                        )
                      } else {
                        item2.SpecificationsPictures = ''
                      }
                    } else {
                      item2.SpecificationsPictures = ''
                    }
                    sz.push({
                      name: item2.value,
                      url: item2.SpecificationsPictures
                    })
                  }
                  let CommoditySpecificationData = this.CommoditySpecificationData
                  for (let item of CommoditySpecificationData) {
                    for (let item2 of item.classification) {
                      delete item2.key
                      delete item2.SpecificationsPictures
                      delete item2.specificationsPicPreviewVisible
                      delete item2.specificationsPicPreviewImage
                    }
                  }
                  for (let item of this.data) {
                    delete item.key
                  }
                  values.specification = JSON.stringify(CommoditySpecificationData)
                  values.specificationsPictures = JSON.stringify(sz)

                  values.goodListSpecificationVOs1 = JSON.stringify(this.data)
                  values.GoodListSpecificationVOs = JSON.stringify(this.data)
                  values.costPrice = this.data2[0].costPrice
                  values.price = this.data2[0].price
                  values.goodNo = this.data2[0].goodNo
                  console.log(this.data2[0])
                  values.supplyPrice = this.data2[0].supplyPrice
                  values.vipPrice = this.data2[0].vipPrice
                  console.log('计算价格', values.supplyPrice, values.vipPrice)
                  values.repertory = this.data2[0].repertory
                  values.marketPrice = this.marketPrice
                } else {
                  values.isSpecification = '0'
                  console.log('this.data2', this.data2)
                  console.log('this.data2', this.data2[0].costPrice)
                  values.GoodListSpecificationVOs1 = JSON.stringify(this.data2)
                  values.costPrice = this.data2[0].costPrice
                  values.price = this.data2[0].price
                  values.goodNo = this.data2[0].goodNo
                  values.supplyPrice = this.data2[0].supplyPrice
                  values.vipPrice = this.data2[0].vipPrice
                  values.repertory = this.data2[0].repertory
                  values.marketPrice = this.marketPrice
                }
                if (Object.keys(this.previewImage1list).length > 0) {
                  values.mainPicture = this.previewImage1list.toString()
                } else {
                  values.mainPicture = null
                }
                if (this.fileList2.length > 0) {
                  if (this.fileList2[0].response) {
                    values.goodVideo = this.fileList2[0].response.message || ''
                  } else {
                    values.goodVideo = this.fileList2.url || ''
                  }
                } else {
                  values.goodVideo = ''
                }
                if (Object.keys(this.previewImage3list).length > 0) {
                  values.detailsGoods = this.previewImage3list.toString()
                } else {
                  values.detailsGoods = null
                }
                if (typeof values.commitmentCustomers != 'undefined') {
                  values.commitmentCustomers = values.commitmentCustomers.toString()
                } else {
                  values.commitmentCustomers = ''
                }
                // let formData = Object.assign(this.model, values)
                console.log(values, 'valuesvaluesvaluesvalues')
                debugger
                if (this.reusePage == 1) {
                  if (e == 0) {
                    //保存草稿箱
                    httpAction(this.url.add, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')
                          this.$router.push({ path: `/good/GoodListList`, query: { isrush: true } })
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                    return false
                  }
                  if (!err) {
                    console.log('Received values of form: ', values)
                    this.addtest = values
                    httpAction(this.url.add, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')

                          if (!values.id) {
                            //当前是添加操作弹出提示框
                            this.visible2 = true
                          } else {
                            this.$router.push({ path: `/good/GoodListList`, query: { isrush: true } })
                          }
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                  }
                }

                if (this.reusePage == 2) {
                  if (e == 0) {
                    //保存草稿箱
                    httpAction(this.url.add, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')
                          this.$router.push({ path: `/good/GoodProviderListList`, query: { isrush: true } })
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                    return false
                  }
                  if (!err) {
                    console.log('Received values of form: ', values)
                    this.addtest = values
                    httpAction(this.url.add, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')
                          this.$router.push({ path: `/good/GoodProviderListList`, query: { isrush: true } })
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                  }
                }
                if (this.reusePage == 3) {
                  if (e == 0) {
                    //保存草稿箱
                    httpAction(this.url.addgoodStore, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')
                          this.$router.push({ path: `/good/GoodStoreListList`, query: { isrush: true } })
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                    return false
                  }
                  if (!err) {
                    console.log('Received values of form: ', values)
                    this.addtest = values
                    httpAction(this.url.addgoodStore, values, 'post')
                      .then(res => {
                        if (res.success) {
                          this.$message.success(res.message)
                          this.$emit('ok')
                          this.$router.push({ path: `/good/GoodStoreListList`, query: { isrush: true } })
                        } else {
                          this.$message.warning(res.message)
                        }
                      })
                      .finally(() => {
                        // this.confirmLoading = false;
                        this.close()
                      })
                  }
                }
              })
            })
          }
        })
      } else {
        this.form.validateFields((err, values) => {
          if (err && err.goodName) return
          if (this.model.sysUserId) {
            values.sysUserId = this.model.sysUserId
          } else {
            if (values.sysUserId == '' || values.sysUserId == undefined) {
              values.sysUserId = this.userInfo().id
            }
          }
          if (values.delFlag == '' || values.delFlag == undefined) {
            values.delFlag = 0 //删除状态
          }
          if (values.frameStatus == '' || values.frameStatus == undefined) {
            values.frameStatus = 0 //上下架状态
          }
          if (!values.providerTemplateId || values.providerTemplateId == '0') {
            values.providerTemplateId = this.model.providerTemplateId
          }
          if (values.status == '' || values.status == undefined) {
            values.status = 0 //启用停用状态
          }
          if (this.reusePage != 3) {
            values.goodTypeId = this.GoodTypeByid1 //分类id
          } else {
            values.goodStoreTypeId = this.GoodTypeByid1 //分类id
          }
          if (this.model.id != '' || this.model.id != undefined) {
            values.id = this.model.id
          }
          if (this.priceRange) {
            values.priceRange = this.priceRange //有无销售价区间；0：无；1：有
          }
          values.auditStatus = e
          console.log('this.CommoditySpecificationData.length', this.CommoditySpecificationData.length)
          if (this.CommoditySpecificationData.length > 0) {
            values.isSpecification = '1'
            let sz = []
            for (let item2 of this.CommoditySpecificationData[0].classification) {
              if (item2.SpecificationsPictures.length > 0) {
                if (item2.SpecificationsPictures[0].response) {
                  item2.SpecificationsPictures = item2.SpecificationsPictures[0].response.message
                } else if (item2.SpecificationsPictures[0].url) {
                  item2.SpecificationsPictures = item2.SpecificationsPictures[0].url.substring(
                    this.url.imgerver.length + 1
                  )
                } else {
                  item2.SpecificationsPictures = ''
                }
              } else {
                item2.SpecificationsPictures = ''
              }
              sz.push({
                name: item2.value,
                url: item2.SpecificationsPictures
              })
            }
            let CommoditySpecificationData = this.CommoditySpecificationData
            for (let item of CommoditySpecificationData) {
              for (let item2 of item.classification) {
                delete item2.SpecificationsPictures
                delete item2.specificationsPicPreviewVisible
                delete item2.specificationsPicPreviewImage
                delete item2.key
              }
            }
            for (let item of this.data) {
              delete item.key
            }
            values.specification = JSON.stringify(CommoditySpecificationData)
            values.specificationsPictures = JSON.stringify(sz)
            values.goodListSpecificationVOs1 = JSON.stringify(this.data)
            values.GoodListSpecificationVOs = JSON.stringify(this.data)
            values.costPrice = this.data2[0].costPrice
            values.price = this.data2[0].price
            values.goodNo = this.data2[0].goodNo
            console.log(this.data2[0])
            values.supplyPrice = this.data2[0].supplyPrice
            values.vipPrice = this.data2[0].vipPrice
            console.log('计算价格', values.supplyPrice, values.vipPrice)
            values.repertory = this.data2[0].repertory
            values.marketPrice = this.marketPrice
          } else {
            values.isSpecification = '0'
            console.log('this.data2', this.data2)
            console.log('this.data2', this.data2[0].costPrice)
            values.GoodListSpecificationVOs1 = JSON.stringify(this.data2)
            values.costPrice = this.data2[0].costPrice
            values.price = this.data2[0].price
            values.goodNo = this.data2[0].goodNo
            values.supplyPrice = this.data2[0].supplyPrice
            values.vipPrice = this.data2[0].vipPrice
            values.repertory = this.data2[0].repertory
            values.marketPrice = this.marketPrice
          }
          if (Object.keys(this.previewImage1list).length > 0) {
            values.mainPicture = this.previewImage1list.toString()
          } else {
            values.mainPicture = null
          }
          if (this.fileList2.length > 0) {
            if (this.fileList2[0].response) {
              values.goodVideo = this.fileList2[0].response.message
            } else {
              values.goodVideo = this.fileList2.url
            }
          } else {
            values.goodVideo = null
          }
          if (Object.keys(this.previewImage3list).length > 0) {
            values.detailsGoods = this.previewImage3list.toString()
          } else {
            values.detailsGoods = null
          }
          if (typeof values.commitmentCustomers != 'undefined') {
            values.commitmentCustomers = values.commitmentCustomers.toString()
          } else {
            values.commitmentCustomers = ''
          }
          let formData = Object.assign(this.model, values)
          if (this.reusePage == 1) {
            if (e == 0) {
              //保存草稿箱
              httpAction(this.url.add, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.$router.push({ path: `/good/GoodListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
              return false
            }
            if (!err) {
              console.log('Received values of form: ', values)
              this.addtest = values
              httpAction(this.url.add, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.$router.push({ path: `/good/GoodListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
            }
          }
          if (this.reusePage == 2) {
            if (e == 0) {
              //保存草稿箱
              httpAction(this.url.add, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.$router.push({ path: `/good/GoodProviderListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
              return false
            }
            if (!err) {
              console.log('Received values of form: ', values)
              this.addtest = values
              httpAction(this.url.add, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.$router.push({ path: `/good/GoodProviderListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
            }
          }
          if (this.reusePage == 3) {
            if (e == 0) {
              //保存草稿箱
              httpAction(this.url.addgoodStore, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')
                    this.$router.push({ path: `/good/GoodStoreListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
              return false
            }
            if (!err) {
              console.log('Received values of form: ', values)
              this.addtest = values
              httpAction(this.url.addgoodStore, values, 'post')
                .then(res => {
                  if (res.success) {
                    this.$message.success(res.message)
                    this.$emit('ok')

                    this.visible = true

                    //  this.$router.push({ path: `/good/GoodStoreListList`, query: { isrush: true } })
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .finally(() => {
                  // this.confirmLoading = false;
                  this.close()
                })
            }
          }
        })
      }
    },
    updataGoodType() {
      if (this.reusePage != 3) {
        this.$router.push({ path: `/good/modules/GoodListadd`, query: { reusePage: this.reusePage } })
      } else {
        this.$router.push({ path: `/good/modules/GoodStoreListadd`, query: { reusePage: this.reusePage } })
      }
    },

    /*数据校验*/
    mainPictureUplode(rule, value, callback) {
      let result = JSON.parse(this.previewImage1list)
      /*if(this.previewImage1list){
          result = JSON.parse(this.previewImage1list)
          if(Object.keys(result).length > 5){}
        }else{
          return
        }*/
      // if(result instanceof Object ){
      //
      // }else{
      //
      // }

      if (Object.keys(this.previewImage1list).length > 0) {
        // result = JSON.parse(this.previewImage1list)
        if (Object.keys(result).length > 5) {
          callback('上传图片不能超过5张！')
        } else {
          callback()
        }
      } else {
        callback('请上传图片')
      }
    },
    detailsGoodsUplode(rule, value, callback) {
      let result
      if (Object.keys(this.previewImage3list).length > 2) {
        result = JSON.parse(this.previewImage3list)
        if (Object.keys(result).length > 50) {
          callback('上传图片不能超过50张！')
          return
        } else {
          callback()
        }
      } else {
        callback()
      }
    },

    providerTemplateId2(rule, value, callback) {
      // console.log("this.model.providerTemplateId",this.model.providerTemplateId)
      if (!this.showLogisticsWeight) {
        this.showLogisticsWeight = !this.showLogisticsWeight
      }
      this.model.providerTemplateId = value
      //        console.log(rule,value)
      if (callback) {
        callback()
      }
    },
    SpecialOfferValidation(rule, value, callback) {
      console.log('this.data++++++++++', this.data)
      console.log('this.model.providerTemplateId', this.model.providerTemplateId)
      if (value == 1) {
        if (this.model.providerTemplateId) {
          console.log('this.providerTemplateList1--', this.providerTemplateList1)
          for (let item of this.providerTemplateList1) {
            if (this.model.providerTemplateId == item.id) {
              /* if (item.templateType != '0') {//template_type
                   callback("只能选择包邮！")
                 }*/
            }
          }
        }
        if (this.CommoditySpecificationData.length > 0) {
          if (Object.keys(this.data).length > 0) {
            console.log('this.specialPriceRatio', this.specialPriceRatio)

            for (let i = 0; i < this.data.length; i++) {
              console.log('this.data[i].costPrice', this.data[i].costPrice)
              console.log('this.data[i].price)', this.data[i].price)
              if (
                (parseFloat(this.data[i].costPrice) / parseFloat(this.data[i].price)) * 100 >
                this.specialPriceRatio
              ) {
                callback('规格销售价成本价比例,不符合特价商品要求！')
              }
            }
            callback()
          }
        } else if (Object.keys(this.data2).length > 0) {
          console.log('this.data2[0].costPrice', this.data2[0].costPrice)
          console.log('this.data2[0].costPrice', this.data2[0].price)
          if (parseFloat(this.data2[0].costPrice) && parseFloat(this.data2[0].price)) {
            if (
              (parseFloat(this.data2[0].costPrice) / parseFloat(this.data2[0].price)) * 100 >
              this.specialPriceRatio
            ) {
              callback('销售价成本价比例,不符合特价商品要求！！')
            } else {
              callback()
            }
          } else {
            callback('销售价成本价不能为空！！')
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    },

    //新增运费模板跳转
    pushAddfreight() {
      if (this.reusePage == '1') {
        this.$router.push({ path: '/provider/modules/PlatformTemplateModel', query: { reusePage: this.reusePage } })
      }
      if (this.reusePage == '2') {
        this.$router.push({ path: '/provider/modules/AddTemplate', query: { reusePage: this.reusePage } })
      }

      if (this.reusePage == '3') {
        this.$router.push({ path: '/store/modules/AddTemplate', query: { reusePage: this.reusePage } })
      }
    },
    //运费模板编辑跳转
    pusheditfreight() {
      //平台身份
      if (this.reusePage == '1') {
        this.$router.push({ path: '/provider/modules/PlatformTemplateModel', query: { reusePage: this.reusePage } })
      }
      //供应商
      if (this.reusePage == '2') {
        this.$router.push({ path: '/provider/modules/AddTemplate', query: { reusePage: this.reusePage } })
      }
      //店铺
      if (this.reusePage == '3') {
        this.$router.push({ path: '/store/modules/AddTemplate', query: { reusePage: this.reusePage } })
      }
    },
    //页面加载执行事件
    loadingPage() {
      if (localStorage.getItem('GoodListListInfo')) {
        this.isEdit = true
        let data = JSON.parse(localStorage.getItem('GoodListListInfo'))
        this.storeUserId = data.sysUserId

        console.log('数据初始化' + JSON.stringify(data))
        //编辑
        //审核状态，做是否是草稿箱数据判断
        if (data.auditStatus) {
          this.auditStatus = data.auditStatus
        }

        if (this.reusePage == 3) {
          this.GoodTypeByid = data.goodStoreTypeNames //分类
          this.GoodTypeByid1 = data.goodStoreTypeId //分类id
          this.storeTemplateId = data.storeTemplateId //运费模板ID
          this.providerTemplateId = data.storeTemplateId //运费模板ID
          // //自提
          // this.storeInformation(data.noutoasiakasStatus)
          // //配送
          // this.distributionSupport(data.distributionStatus)
        } else {
          this.GoodTypeByid = data.goodTypeNames //分类
          this.GoodTypeByid1 = data.goodTypeId //分类id
          this.model.providerTemplateId = data.providerTemplateId //运费模板ID
          this.providerTemplateId = data.providerTemplateId //运费模板ID
        }

        console.log('data', data)
        if (data.goodVideo) {
          this.fileList2.push({
            uid: '-1',
            name: data.goodVideo, //视频名称
            status: 'done',
            url: data.goodVideo //视频地址
          })
        }
        //运费模板
        if (this.reusePage == 1) {
          getAction(this.url.providerTemplateList, { uId: data.sysUserId }).then(res => {
            if (res.success) {
              console.log('this.providerTemplateId', this.providerTemplateId)
              let sz = [
                {
                  id: '',
                  name: '请选择'
                }
              ]
              for (let item of res.result) {
                if (item.id == this.providerTemplateId) {
                  this.listsysArea1(item)
                }
              }
              this.providerTemplateList1 = [...sz, ...res.result]
              console.log('this.providerTemplateList1++++', this.providerTemplateList1)
            }
          })
          //this.handleProvinceChange(data.sysUserId);
        }

        /*console.log("this.providerTemplateId---",this.providerTemplateId)*/
        this.form.resetFields()
        if (data.commitmentCustomers) {
          data.commitmentCustomers = data.commitmentCustomers.split(',')
        } else {
          data.commitmentCustomers = []
        }
        this.model = Object.assign({}, data)
        this.$nextTick(() => {
          // 'generalCommission','vipCommission',
          this.form.setFieldsValue(
            pick(
              this.model,
              'year',
              'month',
              'day',
              'sysUserId',
              'delFlag',
              'goodTypeId',
              'mainPicture',
              'goodName',
              'nickName',
              'price',
              'costPrice',
              'supplyPrice',
              'vipPrice',
              'activitiesType',
              'marketPrice',
              'status',
              'goodDescribe',
              'goodVideo',
              'detailsGoods',
              'repertory',
              'frameStatus',
              'frameExplain',
              'goodNo',
              'statusExplain',
              'specification',
              'isSpecification',
              'providerTemplateId',
              'commitmentCustomers',
              'auditStatus',
              'auditExplain',
              'delExplain',
              'goodForm',
              'GoodListSpecificationVOs',
              'noutoasiakasStatus',
              'distributionStatus',
              'source',
              'sourceType'
            )
          )
          //时间格式化
          this.form.setFieldsValue({ delTime: this.model.delTime ? moment(this.model.delTime) : null })
        })
        //主图
        if (data.mainPicture) {
          let obj = JSON.parse(data.mainPicture)
          let sz = []
          let count = 0
          this.previewImage1list = data.mainPicture
          for (let item of Object.values(obj)) {
            this.uploadingNumber1 = count + 1
            let ojb2 = {
              uid: count,
              name: `${count}.png`,
              status: 'done',
              url: this.url.imgerver + '/' + item,
              response: {
                success: true,
                message: item,
                code: 0,
                result: null,
                timestamp: null
              }
            }
            sz.push(ojb2)
            count++
          }
          if (sz) {
            this.fileList1 = sz
          }
        }

        //商品图片回选
        if (data.detailsGoods) {
          let obj2 = JSON.parse(data.detailsGoods)
          let count2 = 0
          let sz2 = []
          this.previewImage3list = data.detailsGoods.toString()

          for (let item of Object.values(obj2)) {
            this.uploadingNumber = count2 + 1
            let ojb2 = {
              uid: count2,
              name: `${count2}.png`,
              status: 'done',
              url: this.url.imgerver + '/' + item,
              response: {
                success: true,
                message: item,
                code: 0,
                result: null,
                timestamp: null
              }
            }
            sz2.push(ojb2)
            count2++
          }
          if (sz2) {
            this.fileList3 = sz2
          }
        }
        //规格
        let goodListSpecificationVOs = data.goodListSpecificationVOs
        console.log('规格数据' + JSON.stringify(goodListSpecificationVOs))

        if (goodListSpecificationVOs) {
          let sz = []
          for (let a = 0; a < goodListSpecificationVOs.length; a++) {
            goodListSpecificationVOs[a].key = a
            //物重流量表单
            let obj = {
              key: a,
              Specifications: goodListSpecificationVOs[a].specification,
              weight: goodListSpecificationVOs[a].weight
            }
            //规格图
            let obj2 = [
              {
                uid: a,
                url: this.url.imgerver + '/' + goodListSpecificationVOs[a].specificationPicture
              }
            ]
            sz.push(obj)
            goodListSpecificationVOs[a].specificationPicture = obj2
          }

          this.data = goodListSpecificationVOs
          this.$nextTick(() => {
            setTimeout(() => {
              if (goodListSpecificationVOs && goodListSpecificationVOs.length > 0) {
                //商品属性特价判定
                this.specialPrice(1)
              } else {
                //商品属性特价判定
                this.specialPrice(2)
              }
            }, 1000)
          })
          this.LogisticsWeightdata = sz
          let str = ''
          let datas = {}
          for (let count = 0; count < goodListSpecificationVOs.length; count++) {
            let name = 'price' + count,
              name1 = 'vipPrice' + count,
              name2 = 'repertory' + count,
              name3 = 'supplyPrice' + count,
              name4 = 'skuNo' + count,
              name5 = 'costPrice' + count
            ;(datas[name] = goodListSpecificationVOs[count].price),
              (datas[name1] = goodListSpecificationVOs[count].vipPrice),
              (datas[name2] = goodListSpecificationVOs[count].repertory),
              (datas[name3] = goodListSpecificationVOs[count].supplyPrice),
              (datas[name4] = goodListSpecificationVOs[count].skuNo),
              (datas[name5] = goodListSpecificationVOs[count].costPrice),
              (str =
                str +
                "'" +
                name +
                "'" +
                ',' +
                "'" +
                name1 +
                "'" +
                ',' +
                "'" +
                name2 +
                "'" +
                ',' +
                "'" +
                name3 +
                "'" +
                ',' +
                "'" +
                name4 +
                "'" +
                ',' +
                "'" +
                name5 +
                "'" +
                ',')
          }
          this.model1 = Object.assign({}, datas)
          this.$nextTick(() => {
            //this.form.setFieldsValue(pick(this.model1,str))
            this.form.setFieldsValue(this.model1)
          })
          if (data.isSpecification == 1) {
            if (data.specification) {
              let specification = JSON.parse(data.specification)

              //规格图回显
              let specificationsPictures = data.listSpecificationsPicturesDTO
              console.log('specificationsPictures', specificationsPictures)
              let sz = []
              if (specificationsPictures) {
                for (let item of specificationsPictures) {
                  for (let item2 of specification[0].classification) {
                    if (item2.value == item.name) {
                      sz.push({
                        value: item2.value,
                        SpecificationsPictures: [
                          {
                            uid: sz.length,
                            url: this.url.imgerver + '/' + item.url
                          }
                        ],
                        specificationsPicPreviewVisible: false,
                        specificationsPicPreviewImage: this.url.imgerver + '/' + item.url
                      })
                    }
                  }
                }
              }

              console.log('规格缩略图' + JSON.stringify(sz))
              specification[0].classification = sz
              this.CommoditySpecificationData = specification
            }
          }
        } else {
          this.LogisticsWeightdata = [
            {
              key: '-1',
              Specifications: '无',
              weight: data.weight || 0
            }
          ]
        }
        this.data2 = [
          {
            costPrice: data.costPrice,
            goodNo: data.goodNo,
            price: data.price,
            repertory: data.repertory,
            supplyPrice: data.supplyPrice,
            vipPrice: data.vipPrice
          }
        ]
        this.marketPrice = data.marketPrice
        //this.data校验
        this.dataCheck()
        //规格名和对应值校验
        this.CommoditySpecificationDataCheck()
      } else {
        this.isEdit = false
      }
      /**编辑结束*/
      if (this.$route.query.reusePage) {
        this.reusePage = this.$route.query.reusePage
      }

      console.log('this.reusePage===', this.reusePage)
      if (this.$route.query.GoodTypeByid) {
        this.GoodTypeByid = this.$route.query.GoodTypeByid
        let obj = this.$route.query.GoodTypeByid
        if (typeof obj[0] == 'string') {
          for (let a = 0; a < obj.length; a++) {
            obj[a] = obj[a].split(',')
          }
        }
        if (this.GoodTypeByid.length == 3) {
          this.GoodTypeByid = obj[0][1] + '-' + obj[1][1] + '-' + obj[2][1]
          this.GoodTypeByid1 = obj[2][0]
        } else if (this.GoodTypeByid.length == 2) {
          this.GoodTypeByid = obj[0][1] + '-' + obj[1][1]
          this.GoodTypeByid1 = obj[1][0]
        } else if (this.GoodTypeByid.length == 1) {
          this.GoodTypeByid = obj[0][1]
          this.GoodTypeByid1 = obj[0][0]
        } else {
          this.GoodTypeByid = []
          this.GoodTypeByid1 = ''
        }
      }
    },
    //批量编辑确定
    bulkFillDataChange() {
      let data = this.data,
        bulkFillData = this.bulkFillData,
        result
      if (bulkFillData.Specification1 != '请选择') {
        if (bulkFillData.Specification2 != '请选择') {
          result = bulkFillData.Specification1 + ',' + bulkFillData.Specification2
        } else {
          result = bulkFillData.Specification1
        }
      }
      let datas = {}
      if (
        (bulkFillData.Specification1 == 99 && bulkFillData.Specification2 != 99) ||
        (bulkFillData.Specification1 != 99 && bulkFillData.Specification2 == 99) ||
        (bulkFillData.Specification1 == 99 && bulkFillData.Specification2 == '请选择')
      ) {
        //第一项全部并且第二项其他或者第二项全部并且第一项其他或者第一项全部并且第二项不选择
        if (bulkFillData.Specification1 == 99) {
          result = bulkFillData.Specification2 == '请选择' ? '' : bulkFillData.Specification2
        } else {
          result = bulkFillData.Specification1
        }
        for (let a = 0; a < data.length; a++) {
          if (data[a].specification.indexOf(result) != -1) {
            let name = 'price' + a, //商品销售价格
              name1 = 'vipPrice' + a, //会员价
              name2 = 'repertory' + a, //库存
              name3 = 'supplyPrice' + a, //商品供货价
              name4 = 'skuNo' + a, //编号
              name5 = 'costPrice' + a //商品成本价
            if (bulkFillData.price) this.data[a].price = bulkFillData.price
            datas[name] = bulkFillData.price
            if (bulkFillData.repertory) this.data[a].repertory = bulkFillData.repertory
            datas[name2] = bulkFillData.repertory
            if (bulkFillData.skuNo) this.data[a].skuNo = bulkFillData.skuNo
            datas[name4] = bulkFillData.skuNo
            if (bulkFillData.costPrice) this.data[a].costPrice = bulkFillData.costPrice
            datas[name5] = bulkFillData.costPrice
            if (this.reusePage == 1) {
              if (bulkFillData.vipPrice) this.data[a].vipPrice = bulkFillData.vipPrice
              datas[name1] = bulkFillData.vipPrice
              if (bulkFillData.supplyPrice) this.data[a].supplyPrice = bulkFillData.supplyPrice
              datas[name3] = bulkFillData.supplyPrice
            }
            if (this.reusePage == 3 && bulkFillData.vipPrice) {
              ;(datas[name1] = bulkFillData.vipPrice), (this.data[a].vipPrice = bulkFillData.vipPrice)
            }
          }
        }
      } else if (bulkFillData.Specification1 == 99 && bulkFillData.Specification2 == 99) {
        //第一项全部第二项全部
        for (let a = 0; a < data.length; a++) {
          let name = 'price' + a,
            name1 = 'vipPrice' + a,
            name2 = 'repertory' + a,
            name3 = 'supplyPrice' + a,
            name4 = 'skuNo' + a,
            name5 = 'costPrice' + a
          if (bulkFillData.price) this.data[a].price = bulkFillData.price
          datas[name] = bulkFillData.price
          if (bulkFillData.repertory) this.data[a].repertory = bulkFillData.repertory
          datas[name2] = bulkFillData.repertory
          if (bulkFillData.skuNo) this.data[a].skuNo = bulkFillData.skuNo
          datas[name4] = bulkFillData.skuNo
          if (bulkFillData.costPrice) this.data[a].costPrice = bulkFillData.costPrice
          datas[name5] = bulkFillData.costPrice
          if (this.reusePage == 1) {
            if (bulkFillData.vipPrice) this.data[a].vipPrice = bulkFillData.vipPrice
            datas[name1] = bulkFillData.vipPrice
            if (bulkFillData.supplyPrice) this.data[a].supplyPrice = bulkFillData.supplyPrice
            datas[name3] = bulkFillData.supplyPrice
          }
          if (this.reusePage == 3 && bulkFillData.vipPrice) {
            ;(datas[name1] = bulkFillData.vipPrice), (this.data[a].vipPrice = bulkFillData.vipPrice)
          }
        }
        // this.data2[0].supplyPrice =  parseFloat((parseFloat(this.data2[0].costPrice)+parseFloat(this.data2[0].costPrice*this.supplyPriceRatio/100)).toFixed(2))
        // this.data2[0].vipPrice =  parseFloat(((parseFloat(this.data2[0].price)-parseFloat(this.data2[0].supplyPrice))*parseFloat(this.membershipRate/100)+parseFloat(this.data2[0].supplyPrice)).toFixed(2))
      } else {
        for (let a = 0; a < data.length; a++) {
          if (data[a].specification == result) {
            let name = 'price' + a,
              name1 = 'vipPrice' + a,
              name2 = 'repertory' + a,
              name3 = 'supplyPrice' + a,
              name4 = 'skuNo' + a,
              name5 = 'costPrice' + a
            if (bulkFillData.price) this.data[a].price = bulkFillData.price
            datas[name] = bulkFillData.price
            if (bulkFillData.repertory) this.data[a].repertory = bulkFillData.repertory
            datas[name2] = bulkFillData.repertory
            if (bulkFillData.skuNo) this.data[a].skuNo = bulkFillData.skuNo
            datas[name4] = bulkFillData.skuNo
            if (bulkFillData.costPrice) this.data[a].costPrice = bulkFillData.costPrice
            datas[name5] = bulkFillData.costPrice
            if (this.reusePage == 1) {
              if (bulkFillData.vipPrice) this.data[a].vipPrice = bulkFillData.vipPrice
              datas[name1] = bulkFillData.vipPrice
              if (bulkFillData.supplyPrice) this.data[a].supplyPrice = bulkFillData.supplyPrice
              datas[name3] = bulkFillData.supplyPrice
            }
          }
        }
      }

      this.RecalculationMinOrMax()
      this.MinOrMax('repertory')
      this.model2 = Object.assign({}, datas)
      this.$nextTick(() => {
        //this.form.setFieldsValue(pick(this.model1,str))
        this.form.setFieldsValue(this.model2)
        //商品属性特价判定
        this.specialPrice(1)
      })
      // this.data = data;
      // this.$nextTick(()=>{
      //   this.bulkFillData = {
      //     Specification1:'请选择',
      //     Specification2:'请选择',
      //     price:'',
      //     costPrice:"",
      //     repertory:'',
      //     skuNo:''
      //   }
      // })
    },

    //保存点击图片的坐标，保存key
    ChangeUploadIndex(key) {
      // console.log(key);
      let data = this.data
      for (let index = 0; index < data.length; index++) {
        if (data[index].key == key) {
          this.selectUploadIndex = index
          break
        }
      }
      // this.selectUploadIndex = 0;
      console.log(this.selectUploadIndex)
    },
    //字典
    init() {
      this.initIndex()
    },
    initIndex() {
      initDictOptions('supply_price_ratio').then(res => {
        if (res.success) {
          this.supplyPriceRatio = parseFloat(res.result[0].value.replace(/%/g, ''))
          //parseFloat(that.data.qiandao)).toFixed(2)
          console.log('this.supplyPriceRatio字典', this.supplyPriceRatio)
        }
      }),
        //会员价比例 membership_rate
        initDictOptions('membership_rate').then(res => {
          if (res.success) {
            this.membershipRate = parseFloat(res.result[0].value.replace(/%/g, '') / 100)
            console.log('this.membershipRate', this.membershipRate)
          }
        })
      //特价比例
      initDictOptions('special_price_ratio').then(res => {
        if (res.success) {
          this.specialPriceRatio = parseFloat(res.result[0].value.replace(/%/g, ''))
          console.log('this.specialPriceRatio字典', this.specialPriceRatio)
        }
      })
      // //会员价比例 membership_rate
      // initDictOptions('membership_rate').then(res => {
      //   if (res.success) {
      //     this.membershipRate = parseFloat(res.result[0].value.replace(/%/g, ''))
      //     console.log(res)
      //     console.log('this.membership_rate字典')
      //   }
      // })
      //商品分销佣金来源 0：商品实付款；1：商品利润；(0显示) (1不显示)
      // initDictOptions('goods_distribution_commission_source').then((res) => {
      //   if (res.success) {
      //     if(res.result[0].value != 1){
      //       this.goodsDistributionCommissionSource = true
      //     }else{
      //       this.goodsDistributionCommissionSource = false
      //     }
      //   }
      // })
    },
    getUserByRoleName() {
      let that = this
      getAction(that.url.getUserByRoleName).then(res => {
        if (res.success) {
          this.sysUserDTOs = res.result
          console.log(res.result)
          // that.$message.success(res.message);
        } else {
          //that.$message.warning(res.message);
        }
      })
    },
    //加载对应供应商运费模板
    providerTemplateList(string) {
      console.log(string)
      getAction(this.url.providerTemplateList, { uId: string }).then(res => {
        if (res.success) {
          this.providerTemplateList1 = [{ id: '', name: '请选择' }, ...res.result]
        }
      })
    },
    listsysArea1(item) {
      console.log('item', item)
      if (!item.id) return
      this.listsysArea = item
      if (this.reusePage == 3) {
        this.model.storeTemplateId = item.id
        //绑定userId
        this.model.sysUserId = item.sysUserId
        if (item.sysUserId) {
          this.sysUserId = item.sysUserId
        }
      }

      this.showBuyPostageArea = !JSON.parse(item.mailDelivery).every(item => {
        return item.isDelivery == 2
      })
      this.showNoDistribution = !JSON.parse(item.mailDelivery).every(item => {
        return item.isDelivery == 1
      })
      this.providerTemplateId2('', item.id)
    },
    clickIndex(e) {
      this.focusIndex = e
    },

    ...mapGetters(['nickname', 'typePicture', 'userInfo']),
    //自提信息
    storeInformation(e) {
      if (e == '1') {
        this.pickUpInAStore = true
        //平台帮店铺编辑
        if (this.roleCode == 1) {
          getAction(this.url.findGoodStoreById, { userId: this.storeUserId }).then(res => {
            if (res.success) {
              this.goodStoreInformation = res.result
              console.log('this.goodStoreInformation', this.goodStoreInformation)
            }
          })
        } else {
          //店铺自己编辑
          getAction(this.url.findGoodStoreById, { userId: this.userInfo().id }).then(res => {
            if (res.success) {
              this.goodStoreInformation = res.result
              console.log('this.goodStoreInformation', this.goodStoreInformation)
            }
          })
        }
      } else {
        this.pickUpInAStore = false
      }
    },
    //配送
    distributionSupport(e) {
      //平台帮店铺编辑
      if (this.roleCode == 1) {
        getAction(this.url.findGoodStoreById, { userId: this.storeUserId }).then(res => {
          if (res.success) {
            this.goodStoreInformation = res.result
            if (this.goodStoreInformation) {
              //配送状态状态；0：停用；1:启用
              this.menberDistributionStatus = res.result.distributionStatus
              //到店自提状态；0：停用；1:启用
              this.pickUpStatus = res.result.pickUpStatus
            }
          }
        })
      } else {
        getAction(this.url.findGoodStoreById, { userId: this.userInfo().id }).then(res => {
          if (res.success) {
            this.goodStoreInformation = res.result
            if (this.goodStoreInformation) {
              //配送状态状态；0：停用；1:启用
              this.menberDistributionStatus = res.result.distributionStatus
              //到店自提状态；0：停用；1:启用
              this.pickUpStatus = res.result.pickUpStatus
            }
          }
        })
      }

      if (e == '1') {
        this.distribution = true
      } else {
        this.distribution = false
      }
    },
    //登录人角色判断,是否审核判断
    getUserRoleCodeAndGoodAudit() {
      let data = JSON.parse(localStorage.getItem('GoodListListInfo'))

      getAction(this.url.getUserRoleCodeAndGoodAudit, { sysUserId: this.userInfo().id }).then(res => {
        if (res.success) {
          this.userRoleCodeAndGoodAudit = res.result
          if (this.userRoleCodeAndGoodAudit) {
            //角色信息 ：roleCode ：1.台平 2.供应商，3店铺
            //商品审核 ： goodAudit：：0：需审核 1:免审核
            this.roleCode = this.userRoleCodeAndGoodAudit.roleCode
            this.goodAudit = this.userRoleCodeAndGoodAudit.goodAudit
          }

          if (this.roleCode == 1) {
            if (this.reusePage == 3) {
              // 管理员权限 获取店铺列表信息
              this.getFindStoreList()
            }
          }

          console.log('this.userRoleCodeAndGoodAudit', this.userRoleCodeAndGoodAudit)
        } else {
          this.$message.warning(res.message)
        }

        if (data) {
          //自提
          if (data.noutoasiakasStatus) {
            this.storeInformation(data.noutoasiakasStatus)
          }

          //配送
          if (data.distributionStatus) {
            this.distributionSupport(data.distributionStatus)
          }
        }
      })
    },
    //查询店铺列表
    getFindStoreList() {
      getAction(this.url.findStoreList).then(res => {
        if (res.success) {
          this.storeList = res.result
          console.log(' this.storeList:', this.storeList)
        }
      })
    },
    //店铺列表的下拉选择框
    handleChangeSore(value) {
      var userId = `${value}`
      console.log(value)
      if (userId) {
        //赋值uid
        this.sysUserId = userId
      }

      getAction(this.url.findLIst, { uId: userId }).then(res => {
        this.providerTemplateList1 = [{ id: '', name: '请选择' }]
        this.model.storeTemplateId = ''
        if (res.success) {
          console.log('res.result----', res.result)
          for (let item of res.result) {
            this.providerTemplateList1.push(item)
            //默认第一个运费模板
            this.listsysArea1(this.providerTemplateList1[0])
          }
        }
      })

      console.log(`selected ${value}`)
    },

    handleBlur() {
      console.log('blur')
    },
    handleFocus() {
      console.log('focus')
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //校验商品编号是否存在
    getGoodNoCount() {
      let requestInfo = {
        isPlatform: 1,
        goodNo: this.data2[0].goodNo,
        goodId: ''
      }
      // this.goodId
      if (localStorage.getItem('GoodListListInfo')) {
        requestInfo.goodId = JSON.parse(localStorage.getItem('GoodListListInfo')).id
      }

      if (this.reusePage == 3) {
        requestInfo.isPlatform = 0
      }
      return new Promise((resolve, reject) => {
        getAction(this.url.getGoodNoCount, requestInfo).then(res => {
          if (res.success) {
            if (res.result > 0) {
              // 商品编号存在
              this.existenceGoodNo = true
              this.warningMessage = '已存在相同的商品编号。'
              this.$nextTick(() => {
                resolve('success')
              })
            } else {
              //商品编号不存在
              this.existenceGoodNo = false
              this.$nextTick(() => {
                resolve('success')
              })
            }
          } else {
            resolve('failed')
          }
        })
      })
    }
  },
  watch: {
    bulkFillData: {
      handler() {
        let bulkFillData = this.bulkFillData
        //批量设置计算 供货价 会员价
        // else{bulkFillData.supplyPrice = (Math.round(bulkFillData.supplyPrice) * 100)/100};
        if (bulkFillData.price < 0) {
          bulkFillData.price = 0
        }
        if (bulkFillData.costPrice < 0) {
          bulkFillData.costPrice = 0
        }
        if (bulkFillData.repertory < 0) {
          bulkFillData.repertory = 0
        } else {
          bulkFillData.repertory = Math.round(bulkFillData.repertory)
        }

        if (bulkFillData.supplyPrice < 0) {
          bulkFillData.supplyPrice = 0
        }
        if (bulkFillData.vipPrice < 0) {
          bulkFillData.vipPrice = 0
        }
        if (this.focusIndex == '0' || this.focusIndex == '1') {
          this.allPriceChange(bulkFillData)
        }

        if (bulkFillData.supplyPrice > bulkFillData.price) {
          bulkFillData.supplyPrice = bulkFillData.price
        }
        if (bulkFillData.vipPrice > bulkFillData.price) {
          bulkFillData.vipPrice = bulkFillData.price
        }
      },
      deep: true
    },
    fileList1: {
      handler(fileList) {
        this.mainPictureChangePosition(fileList)
      },
      deep: true
    },
    fileList3: {
      handler(fileList) {
        this.detailPictureChangePosition(fileList)
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
/* you can make up upload button and sample style by using stylesheets */

.release-assistant {
  position: fixed;
  right: 3%;
  top: 15%;
  z-index: 99999999;
  border: 1px solid gray;
  width: 15%;
  background: white;
  font-size: 13px;

  .head {
    width: 100%;
    background: #09f;
    line-height: 30px;
    text-align: center;
    color: white;
  }

  > .cnt {
    padding: 20px 10px;
    width: 100%;

    .explain {
      margin: 15px 0;
    }

    .title {
      margin-bottom: 15px;
      font-weight: 700;
    }
  }
}

.ant-table-pagination.ant-pagination {
  display: none;
}

.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.anty-img-wrap {
  margin: 0 auto;
  width: 100%;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.assistantTitle {
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 14px;
}

.freight-template-info {
  position: relative;
  padding: 5px 15px;
  width: 100%;
  background: #eee;

  .edit {
    position: absolute;
    right: 20px;
    top: 10px;
    cursor: pointer;
    color: #09f;
  }

  .single-line {
    display: flex;
    width: 90%;
    font-size: 13px;

    .single-line-title {
      margin-right: 10px;
      min-width: 100px;
      font-weight: 700;
    }
  }
}

.wrap {
  margin-left: 13%;
  margin-top: 2%;
  width: 100%;

  .specifications-title {
    /*width: 40%;*/
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;

    .sml-title {
      padding-left: 14px;
      font-size: 15px;
    }

    .addBtn {
      margin: 0 15px;
    }
  }

  .content {
    margin-left: 6%;
    margin-top: 1%;
    padding: 20px;

    // width: 80%;
    width: 100%;
    background: #eee;

    .batch-setup {
      margin-bottom: 15px;
      padding: 16px;
      border: 1px solid #e8e8e8;
      width: 100%;
      line-height: 30px;
      font-size: 13px;

      .title {
        color: red;
      }

      .opreation {
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-items: center;
        width: 100%;

        .ant-input {
          margin: 0 10px 10px 0;
          width: 90px;
        }
      }
    }

    .floor {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 10px;
      border-bottom: 1px solid gray;

      .ipt {
        width: 30%;
      }

      span {
        cursor: pointer;
      }
    }

    .add {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      width: 100%;

      .ipt-wrap {
        position: relative;
        margin-right: 1.5%;
        margin-top: 2%;

        .iconClose {
          right: -6px !important;
          top: -6px !important;
        }

        .clearfix {
          margin-left: 20%;
          margin-top: 20px;
        }

        i,
        .iconClose {
          position: absolute;
          z-index: 2;
        }

        i {
          right: 41%;
          top: 41%;
        }

        .ant-upload-text {
          margin-top: 30px;
        }
      }

      > input,
      button {
        margin-right: 1.5%;
        margin-top: 2%;
      }

      input {
        width: 175px;
      }
    }
  }
}

.redStar {
  display: inline-block;
  position: relative;
  left: -80px;
  margin-right: 4px;
  line-height: 1;
  font-family: SimSun;
  font-size: 14px;
  color: #f5222d;
  content: '*';
}

.button-end {
  margin-bottom: 40px;
  border-bottom: 1px solid gray;
}
</style>
