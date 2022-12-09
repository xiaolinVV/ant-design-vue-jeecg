<template>
    <div class="AddMarketingGiftbagPurchaseRecord">
      <div class="title">
        添加采购记录
      </div>
      <div class="wrap">
        <a-form :form="form">
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="流水号">
            <!--          v-model="AllData.giftName"-->
           -
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="选择会员" >
            <a-select
              show-search
              v-decorator="[ 'memberListId',VerificationRules.memberListId ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchPhone"
              @change="handleChangeVipMember"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in phoneList" :key="d.id" v-if="d.NAME && d.id">
                {{d.NAME}}
              </a-select-option>
            </a-select>


<!--            <a-select-->
<!--              label-in-value-->
<!--              @change="handleChangeVipMember"-->
<!--              v-decorator="['memberListId',VerificationRules.memberListId]"-->

<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="头像">
            <!--          v-model="AllData.giftName"-->
            <span v-if="vipMemberSelectedInformation.headPortrait == '-'">
              -
            </span>
            <img preview="1" v-else :src="vipMemberSelectedInformation.headPortrait" alt="" style="width: 100px;height: 100px;">
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{vipMemberSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="昵称">
            <!--          v-model="AllData.giftName"-->
           {{vipMemberSelectedInformation.nickName}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" >
            <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          选择联系人
        </span>
            <a-button @click="PopUp(1)">
              设置购买人信息
            </a-button>
<!--            <a-select-->
<!--              label-in-value-->
<!--              @change="handleChangecContacts"-->
<!--              v-decorator="['contactsId',VerificationRules.contactsId]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系人">
            <!--          v-model="AllData.giftName"-->
            {{allData.linkman}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="联系人手机">
            <!--          v-model="AllData.giftName"-->
            {{allData.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="所在城市">
            <!--          v-model="AllData.giftName"-->
            {{allData.areaExplan}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="详细地址">
            <!--          v-model="AllData.giftName"-->
            {{allData.areaAddress}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol">
            <span slot="label">
          <span class="dataCheckedStar">
            *
          </span>
          选择采购礼包
        </span>
            <a-button @click="PopUp(2)">
              选择礼包
            </a-button>
            <a-table
              bordered
              :columns="columns"
              :data-source="dataSource"
            >
            <template slot="mainPicture" slot-scope="text">
              <img :src="text" alt="" style="width: 40px;height: 40px;">
            </template>
            <template slot="operation" slot-scope="text, record">
              <a-popconfirm
                @confirm="() => onDelete(record.id)"
                title="确定要删除吗?"
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </template>

              </a-table>
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="购买数量">
            <!--          v-model="AllData.giftName"-->
            <a-input-number
              :min="1"
              :precision="0"
              v-decorator="['buyCount',VerificationRules.buyCount]">

            </a-input-number>

          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="运费">
            0.00
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="应收金额">
            0.00
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="实收金额">
            <!--          v-model="AllData.giftName"-->
            <a-input-number
              :min="1"
              :precision="0"
              v-decorator="['actualPayment',VerificationRules.actualPayment]">
            </a-input-number>

          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="收款说明">
            <!--          v-model="AllData.giftName"-->
            <a-textarea v-decorator="['gatheringExplain',VerificationRules.gatheringExplain]">

            </a-textarea>
          </a-form-item>

          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
        <span slot="label">
              <span class="dataCheckedStar">
                *
              </span>
              收款凭证
        </span>
            <a-upload
              :action="uploadAction"
              listType="picture-card"
              :fileList="mainPictureFileList"
              @preview="mainPictureHandlePreview"
              @change="mainPictureHandleChange"
              :headers="headers"
              :beforeUpload="mainPictureUpload"
            >
              <div v-if="mainPictureFileList.length < 5">
                <a-icon type="plus"/>
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-modal :visible="mainPicturePreviewVisible" :footer="null" @cancel="mainPictureHandleCancel">
              <img alt="example" style="width: 100%" :src="mainPicturePreviewImage"/>
            </a-modal>

            <div>
              请上传分类图片，支持jpg、jpeg、png格式，大小不超过500k
            </div>
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="购买时间">
            <!--          v-model="AllData.giftName"-->
            <a-date-picker
              @change="onDateChange"
              style="width: 210px"
              placeholder='开始时间'
              format="YYYY-MM-DD HH:mm:ss"
              v-decorator="['payTime',VerificationRules.payTime]"
            />
<!--            <a-range-picker-->
<!--              style="width: 210px"-->
<!--              v-decorator="['payTime',VerificationRules.payTime]"-->
<!--              format="YYYY-MM-DD"-->
<!--              :placeholder="['开始时间', '结束时间']"-->
<!--              @change="onDateChange"-->
<!--            />-->
<!--            @change="onDateChange"-->
<!--            @ok="onDateOk"-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="留言">
            <!--          v-model="AllData.giftName"-->
            <a-textarea v-decorator="['message',VerificationRules.message]">

            </a-textarea>
          </a-form-item>


          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="推广人">

            <a-select
              show-search
              v-decorator="[ 'promoter',VerificationRules.promoter ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchPhone"
              @change="handleChangePromoter"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in phoneList" :key="d.id" v-if="d.NAME && d.id">
                {{d.NAME}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['promoter',VerificationRules.promoter]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{promoterSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="昵称">
            <!--          v-model="AllData.giftName"-->
            {{promoterSelectedInformation.nickName}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="二级推广人">
            <a-select
              show-search
              v-decorator="[ 'promoterTwo',VerificationRules.promoterTwo ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchPhone"
              @change="handleChangePromoterSecond"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in phoneList" :key="d.id" v-if="d.NAME && d.id">
                {{d.NAME}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['promoterTwo',VerificationRules.promoterTwo]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{promoterSecondSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="昵称">
            <!--          v-model="AllData.giftName"-->
            {{promoterSecondSelectedInformation.nickName}}
          </a-form-item>


          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="归属店铺">
            <a-select
              show-search
              v-decorator="[ 'affiliationStore',VerificationRules.affiliationStore ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchStore"
              @change="handleChangeBelongStore"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in storeList" :key="d.sys_user_id" v-if="d.NAME && d.sys_user_id">
                {{d.NAME}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['affiliationStore',VerificationRules.affiliationStore]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{belongStoreSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="店铺名称">
            <!--          v-model="AllData.giftName"-->
            {{belongStoreSelectedInformation.NAME}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="销售渠道">
            <a-select
              show-search
              v-decorator="[ 'distributionChannel',VerificationRules.distributionChannel ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchStore"
              @change="handleChangeDistributionChannel"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in storeList" :key="d.sys_user_id" v-if="d.NAME && d.sys_user_id">
                {{d.NAME}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['distributionChannel',VerificationRules.distributionChannel]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{distributionChannelSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="店铺名称">
            <!--          v-model="AllData.giftName"-->
            {{distributionChannelSelectedInformation.NAME}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="省代">
            <a-select
              show-search
              v-decorator="[ 'proviceId',VerificationRules.proviceId ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchAgent"
              @change="handleChangeProvinceAgent"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in agentList" :key="d.id" v-if="d.agencyName">
                {{d.agencyName}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['proviceId',VerificationRules.proviceId]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{provinceAgentSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司名称">
            <!--          v-model="AllData.giftName"-->
            {{provinceAgentSelectedInformation.name}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名字">
            <!--          v-model="AllData.giftName"-->
            {{provinceAgentSelectedInformation.realname}}
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="市代">
            <a-select
              show-search
              v-decorator="[ 'cityId',VerificationRules.cityId ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchAgent"
              @change="handleChangeCityAgent"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in agentList" :key="d.id" v-if="d.agencyName">
                {{d.agencyName}}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{cityAgentSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司名称">
            <!--          v-model="AllData.giftName"-->
            {{cityAgentSelectedInformation.name}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名字">
            <!--          v-model="AllData.giftName"-->
            {{cityAgentSelectedInformation.realname}}
          </a-form-item>


          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="县代">

            <a-select
              show-search
              v-decorator="[ 'towmId',VerificationRules.towmId ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchAgent"
              @change="handleChangeCountyAgent"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in agentList" :key="d.id" v-if="d.agencyName">
                {{d.agencyName}}
              </a-select-option>
            </a-select>

<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['towmId',VerificationRules.towmId]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>

          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{countyAgentSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司名称">
            <!--          v-model="AllData.giftName"-->
            {{countyAgentSelectedInformation.name}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名字">
            <!--          v-model="AllData.giftName"-->
            {{countyAgentSelectedInformation.realname}}
          </a-form-item>


          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="加盟商">
            <a-select
              show-search
              v-decorator="[ 'allianceId',VerificationRules.allianceId ]"
              placeholder="请输入"
              style="width: 100%"
              :filter-option="false"
              :not-found-content="fetching ? undefined : null"
              @search="fetchFranchisee"
              @change="handleChangeAlliance"
            >
              <a-spin v-if="fetching" slot="notFoundContent" size="small" />
              <a-select-option v-for="d in franchiseeList" :key="d.id" v-if="d.allianceName">
                {{d.allianceName}}
              </a-select-option>
            </a-select>


<!--            <a-select-->
<!--              label-in-value-->
<!--              v-decorator="['allianceId',VerificationRules.allianceId]"-->
<!--            >-->
<!--              <a-select-option value="1">-->
<!--                Jack (100)-->
<!--              </a-select-option>-->
<!--              <a-select-option value="2">-->
<!--                Lucy (101)-->
<!--              </a-select-option>-->
<!--            </a-select>-->
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="手机号">
            <!--          v-model="AllData.giftName"-->
            {{franchiseeSelectedInformation.phone}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="公司名称">
            <!--          v-model="AllData.giftName"-->
            {{franchiseeSelectedInformation.name}}
          </a-form-item>
          <a-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="用户名字">
            <!--          v-model="AllData.giftName"-->
            {{franchiseeSelectedInformation.realname}}
          </a-form-item>
        </a-form>
        <div class="button-end">

        </div>
        <div class="button-operation">
          <a-button @click="back">
            取消
          </a-button>
          <a-button type="primary" @click="submit">
            确认
          </a-button>
        </div>
      </div>

<!--      @ok="selectLineData"-->
      <a-modal
        :title="'选择' + popName"
        :visible="ShowPopUp"
        :width="1500"
        @cancel="PopUp('')"
        @ok="modalOk"
      >
        <a-spin :spinning="popUpLoading">
          <div v-if="showType == 1">
            <a-radio-group v-model="popUpbuyId">
              <a-radio v-for="(item,index) in buyerInformationList" :value="item.id" style="display: flex;align-items: center;" >
                <div style="display: flex;align-items: center;min-width: 500px;">
                  <div style="margin-right: 20px">
                    {{item.linkman}}
                  </div>
                  <div style="margin-right: 20px">
                    {{item.phone}}
                  </div>
                  <div style="margin-right: 20px">
                    {{item.areaExplan}}
                  </div>
                  <div style="margin-right: 20px">
                    {{item.areaAddress}}
                  </div>
                </div>

              </a-radio>

            </a-radio-group>
          </div>
          <div v-if="showType == 2" id="cnt">
            <div class="title2">
              <div>
                礼包名称：
                <a-input v-model="searchName"  style="width:  150px;"/>
              </div>
              <div >
                礼包编号：
                <a-input v-model="queryParam.id"  style="width: 150px;"/>
              </div>
              <div>
                礼包发行时间：
                <a-range-picker format="YYYY-MM-DD" style="width:  300px;" :placeholder="['开始时间', '结束时间']" v-model="queryParam.giftPackIssueTime"  @change="onDateChange1" />
              </div>
              <div>
                创建时间：
                <a-range-picker format="YYYY-MM-DD" style="width:  300px;" :placeholder="['开始时间', '结束时间']" v-model="queryParam.createTime"  @change="onDateChange"/>
              </div>
<!--              @click="PopUp(popPart,'true')"-->
              <a-button type="primary" @click="search">
                查询
              </a-button>
            </div>
            <a-table :columns="popUpColumns" :dataSource="popUpData"
                     :pagination="selectPagination"
                     :rowKey="record => record.id"
                     :rowSelection="rowSelection"
                     :scroll="{y:300,x:(popUpColumns.length + 1) * columnsWidth}"
                     bordered
                     style="margin-top: 20px;"
                     @change="handleSelectTableChange"
            >
              <template slot="mainPicture" slot-scope="text">
                <img :src="text" alt="" style="width: 40px;height: 40px;">
              </template>
            </a-table>
          </div>
        </a-spin>
      </a-modal>
    </div>
</template>

<script>
  import Vue from 'vue'
  import {httpAction,getAction,postAction} from '@/api/manage'
  import moment from 'moment'
  import debounce from 'lodash/debounce';
  const columnsWidth = 160
  const columns = [
    {
      title: '#',
      dataIndex: '',
      key: 'rowIndex',
      width: 60,
      align: "center",
      customRender: function (t, r, index) {
        return parseInt(index) + 1;
      }
    },
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
    }, {
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
      align: 'center'
    }
  ];
  const popUpColumns = [
    {
      title: '#',
      dataIndex: '',
      key: 'rowIndex',
      width: 60,
      align: "center",
      customRender: function (t, r, index) {
        return parseInt(index) + 1;
      }
    },
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
  ];
  // moment(this.model.payTime) 返现
  // payTime.format('YYYY-MM-DD HH:mm:ss') 提交
  export default {
    name: 'AddMarketingGiftbagPurchaseRecord',
    data(){
      this.lastFetchId = 0;
      this.fetchPhone = debounce(this.fetchPhone, 800);
      this.fetchStore = debounce(this.fetchStore, 800);
      this.fetchAgent = debounce(this.fetchAgent, 800);
      this.fetchFranchisee = debounce(this.fetchFranchisee, 800);
      return{
        form: this.$form.createForm(this, { name: 'AddMarketingGiftbagPurchaseRecord' }),
        phoneList:[],//手机号模糊查询
        storeList:[],//店铺模糊查询
        agentList:[],//代理模糊查询
        franchiseeList:[],//加盟商模糊查询
        fetching: false,
        ShowPopUp:false,
        popUpLoading:false,
        popUpbuyId:'',
        showType:1,
        labelCol: { span: 3 },
        wrapperCol: { span: 17 },
        uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
        //选择礼包弹窗
        popUpData:[],
        popUpColumns,
        searchName:'',
        queryParam:{

        },
        allData:{
          marketingGiftBagBatchId:[],
          gatheringProof:'',//收款凭证
          promoterType:1,
          promoterTypeTwo:1,
          linkman:'-',
          phone:'-',
          areaAddress:'-',
          areaExplan:'-',
          shipFee:'0',
          customaryDues:'0',
          promoter:'',
          promoterTwo:'',
          affiliationStore:'',
          distributionChannel:'',
          proviceId:'',
          cityId:'',
          towmId:'',
          allianceId:''
        },
        columnsWidth,
        //查询table分页配置
        selectPagination: {
          current: 1,
          pageSize: 10,
          total: 1
        },
        VerificationRules:{
          memberListId:{
            rules: [
              {
                required: true,
                message: '请选择会员!'
              }
            ]
          },
          PurchasingGiftBagId:{
            rules: [
              {
                required: true,
                message: '请选择采购礼包!'
              }
            ]
          },
          contactsId:{
            rules: [
              {
                required: true,
                message: '请选择联系人!'
              }
            ]
          },
          buyCount:{
            rules: [
              {
                required: true,
                message: '请输入购买数量!'
              }
            ]
          },
          actualPayment:{
            rules: [
              {
                required: true,
                message: '请输入实收金额!'
              }
            ]
          },
          gatheringExplain:{
            rules: [
              {
                required: true,
                message: '请输入收款说明!'
              }
            ]
          },
          payTime:{
            rules: [
              {
                required: true,
                message: '请选择购买时间!'
              }
            ]
          },
          promoter:{
            rules: [
              {
                required: false,
                message: '请选择推广人!'
              }
            ]
          },
          promoterTwo:{
            rules: [
              {
                required: false,
                message: '请选择二级推广人!'
              }
            ]
          },
          affiliationStore:{
            rules: [
              {
                required: false,
                message: '请选择归属店铺!'
              }
            ]
          },
          distributionChannel:{
            rules: [
              {
                required: false,
                message: '请选择销售渠道!'
              }
            ]
          },
          proviceId:{
            rules: [
              {
                required: false,
                message: '请选择省代!'
              }
            ]
          },
          cityId:{
            rules: [
              {
                required: false,
                message: '请选择市代!'
              }
            ]
          },
          towmId:{
            rules: [
              {
                required: false,
                message: '请选择县代!'
              }
            ]
          },
          allianceId:{
            rules: [
              {
                required: false,
                message: '请选择加盟商!'
              }
            ]
          },
          message:{
            rules: [
              {
                required: false,
                message: '请输入留言!'
              }
            ]
          },
        },
        //收款凭证 配置
        mainPictureFileList: [],
        mainPicturePreviewVisible: false,
        mainPicturePreviewImage: '',
        mainPicturePic: true,
        //配置
        configure: {
          imgErver: window._CONFIG['domianURL'] + '/sys/common/view',
          fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
        },
        url:{
          //选择会员 选择推广人 选择二级推广人 传入字段:phone
          findMemberListByPhone:"memberList/memberList/findMemberListByPhone",
          //选择联系人信息 传入字段:memberListId
          findMemberShippingAddressByMemberId:"memberShippingAddress/memberShippingAddress/findMemberShippingAddressByMemberId",
          //选择礼包弹窗数据
          findMarketingGiftBagBatch:"marketingGiftBagBatch/marketingGiftBagBatch/findMarketingGiftBagBatch",
          //选择归属店铺 销售渠道 传入字段:phone
          findStoreByPhone:"storeManage/storeManage/findStoreByPhone",
          //选择省市县代 传入字段:phone
          findAgencyManageByPhone:"agencyManage/agencyManage/findAgencyManageByPhone",
          //选择加盟商 传入字段:phone
          findAllianceManageByphone:"allianceManage/allianceManage/findAllianceManageByphone",
          // //校验手机号码接口 (通过手机号码获取会员信息)
          // likeMemberByPhone: "/memberList/memberList/likeMemberByPhone",//校验手机号码接口 (通过手机号码获取会员信息)
          //礼包弹窗查询字段:id ,giftName, startTime_begin ,endTime_end ,createTime_begin ,createTime_end
          // isPrepositionList: 'marketingGiftBag/marketingGiftBag/isPrepositionList',
          //添加
          add:"marketingGiftBagRecordBatch/marketingGiftBagRecordBatch/add"
        },
        headers:'',
        //选择采购礼包结果表
        columns,
        dataSource:[],
        //选择会员返显信息
        vipMemberSelectedInformation:{
          phone:'-',
          headPortrait:'-',
          nickName:'-'
        },
        //选择联系人返显信息
        memberConcatSelectedInformation:{
          areaExplan:'-',
          areaAddress:'-',
          linkman:'-',
          phone:'-'
        },
        //选择推广人信息
        promoterSelectedInformation:{
          phone:'-',
          nickName:'-'
        },
        //选择二级推广人信息
        promoterSecondSelectedInformation:{
          phone:'-',
          nickName:'-'
        },
        //归属店铺
        belongStoreSelectedInformation:{
          phone:'-',
          NAME:'-'
        },
        //销售渠道
        distributionChannelSelectedInformation:{
          phone:'-',
          NAME:'-'
        },
        //省代
        provinceAgentSelectedInformation:{
          realname:'-',
          phone:'-',
          name:'-'
        },
        //市代
        cityAgentSelectedInformation:{
          realname:'-',
          phone:'-',
          name:'-'
        },
        //县代
        countyAgentSelectedInformation:{
          realname:'-',
          phone:'-',
          name:'-'
        },
        //加盟商
        franchiseeSelectedInformation:{
          realname:'-',
          phone:'-',
          name:'-'
        },
        selectedRowKeys: [],
        buyerInformationList:[]
      }
    },
    created(){
      const token = Vue.ls.get('Access-Token')
      this.headers = { 'X-Access-Token': token }
    },
    computed:{
      popName(){
        if(this.showType == 1){
          return '购买人信息'
        }else if(this.showType == 2){
          return '礼包'
        }else{
          return ''
        }
      },
      rowSelection() {
        const { selectedRowKeys } = this
        return {
          selectedRowKeys,
          onChange: this.onSelectChange,
          hideDefaultSelections: true,
          type: 'radio',
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
    methods:{
      onDateChange(value, dateString){
        let requestOptions = this.queryParam
        requestOptions.createTime_begin = dateString[0];
        requestOptions.createTime_end = dateString[1];
      },
      onDateChange1(value, dateString){
        let requestOptions = this.queryParam
        requestOptions.startTime_begin = dateString[0];
        requestOptions.startTime_end = dateString[1];
      },
      modalOk(){
        if(this.showType  == 1){
          if(!this.popUpbuyId){
            this.$message.warn('请先选择采购联系人！')
            return
          }
         this.allData.linkman  = this.popUpbuyId
          for(let item of this.buyerInformationList){
            if(item.id == this.popUpbuyId){
              this.allData = Object.assign({},this.allData,item)
              break;
            }
          }
        }else if(this.showType == 2){
          if(this.selectedRowKeys.length <= 0){
            this.$message.warn('请先选择采购礼包！')
            return
          }
          this.allData.marketingGiftBagBatchId = this.selectedRowKeys
          for(let item of this.popUpData){
            if(item.id == this.selectedRowKeys[0]){
              this.dataSource = [item]
              break;
            }
          }
        }
        this.ShowPopUp = false
        this.queryParam = {}
      },
      handleSelectTableChange(pagination) {
        this.selectPagination.current = pagination.current
        this.search()
      },
      submit(){
        let that = this
        this.form.validateFields((err, values)=>{
          if (!err){
            if(this.mainPictureFileList.length <= 0){
              this.$message.warn('请上传收款凭证！')
              return;
            }
            if(this.dataSource.length <= 0){
              this.$message.warn('请选择采购礼包！')
              return;
            }
            if(!this.allData.linkman){
              this.$message.warn('请选择联系人！')
              return;
            }
            let mainPictureFileList = {}
            for (let count = 0; count < this.mainPictureFileList.length; count++) {
              mainPictureFileList[count] = this.mainPictureFileList[count].response.message
            }
            values = Object.assign({},that.allData,values)
            values.payTime = values.payTime.format('YYYY-MM-DD HH:mm:ss')
            values.gatheringProof =  JSON.stringify(mainPictureFileList)
            values.marketingGiftBagBatchId = values.marketingGiftBagBatchId[0]
            let resultObj = {}
            for(let key  in values){
              if(values[key] === undefined){
                resultObj[key] = ''
              }
            }
            delete values.id
            values = Object.assign({},values,resultObj)
            setTimeout(()=>{
              postAction(that.url.add, values)
                .then(res => {
                  if (res.success) {
                    that.$message.success('成功！')
                    that.$router.push('/marketing/MarketingGiftBagRecordBatchList')
                  } else {
                    that.$message.warn('失败')
                  }
                })
                .catch(err => {
                  that.$message.warn('失败')
                })
            },100)

          }
        })
      },
      back(){
        this.$router.push('/marketing/MarketingGiftBagRecordBatchList')
      },
      search(){
        this.popUpLoading = true
        let that = this;
        let requestOptions = Object.assign({}, this.selectPagination, { pageNo: this.selectPagination.current }, { giftBagName: this.searchName },this.queryParam)
        if(requestOptions.createTime) delete requestOptions.createTime;
        if(requestOptions.giftPackIssueTime) delete requestOptions.giftPackIssueTime;
        getAction(that.url.findMarketingGiftBagBatch, requestOptions).then(res=>{
          if(res.success){
            let datas = res.result
            datas.records.map((item, index) => {
              item.key = item.id
              if (item.mainPicture) item.mainPicture = that.configure.imgErver + '/' +  Object.values(JSON.parse(item.mainPicture))[0]
              return item
            })
              this.popUpData = datas.records
              this.selectPagination.total = res.result.total
              this.selectPagination.pageSize = res.result.size
          }
          this.popUpLoading = false
        })
      },
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys;
      },
      fetchPhone(phone) {
       this.fetchMethods(phone)
      },
      fetchStore(phone){
        this.fetchMethods(phone,"findStoreByPhone","storeList")
      },
      fetchAgent(phone){
        this.fetchMethods(phone,"findAgencyManageByPhone","agentList")
      },
      fetchFranchisee(phone){
        this.fetchMethods(phone,"findAllianceManageByphone","franchiseeList")
      },
      handleChangeProvinceAgent(id){
        for(let item of this.agentList){
          if(item.id == id){
            this.provinceAgentSelectedInformation = item
            break;
          }
        }
      },
      handleChangeCityAgent(id){
        for(let item of this.agentList){
          if(item.id == id){
            this.cityAgentSelectedInformation = item
            break;
          }
        }
      },
      handleChangeCountyAgent(id){
        for(let item of this.agentList){
          if(item.id == id){
            this.countyAgentSelectedInformation = item
            break;
          }
        }
      },

      handleChangeAlliance(id){
        for(let item of this.franchiseeList){
          if(item.id == id){
            this.franchiseeSelectedInformation = item
            break;
          }
        }
      },




      handleChangeDistributionChannel(id){
        for(let item of this.storeList){
          if(item.sys_user_id == id){
            this.distributionChannelSelectedInformation = {
              phone:item.boss_phone,
              NAME:item.NAME
            }
            break;
          }
        }
      },
      handleChangeBelongStore(id){
        for(let item of this.storeList){
          if(item.sys_user_id == id){
            this.belongStoreSelectedInformation = {
              phone:item.boss_phone,
              NAME:item.NAME
            }
            break;
          }
        }
      },
      fetchMethods(phone,apiName = '',listsTo = ''){
        if(!apiName){
          apiName =  "findMemberListByPhone"
        }
        if(!listsTo){
          listsTo = "phoneList"
        }
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this[listsTo] = [];
        this.fetching = true;
        let formData = {
          phone,
          // userType:this.tarrace.userType
        }
        getAction(this.url[apiName], formData).then((res) => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          // this.phoneIsExistence = res
          if(res.success){
            this[listsTo] = res.result
          }
          this.fetching = false;
        })
      },
      PopUp(index = ''){
        //1 购买人信息 2 采购礼包
        if(index == 1 && this.form.getFieldsValue(['memberListId']).memberListId){
          this.getBuyInformation();
        }else if(index == 1 && !(this.form.getFieldsValue(['memberListId']).memberListId)){
          this.$message.warn('请先选择会员！');
          return;
        }else if(index == 2){
         this.search();
        }
        if(!index){
          this.ShowPopUp = false
          this.queryParam = {}
          if(this.showType == 2){
            this.selectedRowKeys = this.allData.marketingGiftBagBatchId
          }else if(this.showType == 1){
            this.popUpbuyId = this.allData.linkman
          }
        }else{
          this.ShowPopUp = true;
          this.showType = index
        }
      },
      //请求购买人信息
      getBuyInformation(){
        this.popUpLoading = true;
        getAction(this.url.findMemberShippingAddressByMemberId,{memberListId:this.form.getFieldsValue(['memberListId']).memberListId}).then(res=>{
          if(res.success){
            this.buyerInformationList = res.result
          }
          this.popUpLoading = false;
        })
      },
      onDelete(id) {
        const dataSource = [...this.dataSource]
        const selectedRowKeys = [...this.selectedRowKeys]
        this.selectedRowKeys = selectedRowKeys.filter(item => item !== id)
        this.dataSource = dataSource.filter(item =>  item.id !== id)
      },
      mainPictureUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 0.5
        if (!isLt2M) {
          this.$message.error('图片大小必须在500k以内!')
        }
        this.mainPicturePic = isLt2M
        return isLt2M
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
        if(this.mainPicturePic){
          this.mainPictureFileList = fileList
        }
      },
      handleChangeVipMember(id){
        if(!id){

          return;
        }
        for(let item of this.phoneList){
          if(item.id == id){
            this.vipMemberSelectedInformation = {
              phone:item.phone,
              headPortrait:item.head_portrait,
              nickName:item.nick_name
            }
            this.memberConcatSelectedInformation = {
              areaExplan:'-',
              areaAddress:'-',
              linkman:'-',
              phone:'-'
            }
            this.allData.linkman  = ''
            this.popUpbuyId = ''
            break;
          }
        }
        // this.form.setFieldsValue({memberListId:item.id})
      },
      handleChangePromoter(id){
        for(let item of this.phoneList){
          if(item.id == id){
            this.promoterSelectedInformation = {
              phone:item.phone,
              nickName:item.nick_name
            }
            break;
          }
        }
      },
      handleChangePromoterSecond(id){
        for(let item of this.phoneList){
          if(item.id == id){
            this.promoterSecondSelectedInformation = {
              phone:item.phone,
              nickName:item.nick_name
            }
            break;
          }
        }
      },
      handleChangecContacts(values){
        //value { key: "lucy", label: "Lucy (101)" }
      },
      // handleChangecPurchasingGiftBag(values){
      //
      // }
    }
  }
</script>

<style lang="less">
.AddMarketingGiftbagPurchaseRecord{
  background: white;
  .wrap{
    margin-top: 30px;
  }
  .title {
    font-size: 16px;
    font-weight: 700;
    padding: 25px;
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