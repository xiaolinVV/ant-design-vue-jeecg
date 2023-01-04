<template>
  <a-modal
    title="查看成员"
    :width="1000"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="close"
    :footer="null"
  >
    <div>
      <a-table
        ref="table"
        size="middle"
        rowKey="onlyKey"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :expandedRowKeys="expandedRowKeys"
        @change="handleTableChange"
      >
        <template slot="headPortrait" slot-scope="text, record, index">
          <img class="clickShowImage" :preview="'headPortrait' + index" :src="record.headPortrait" alt="" height="25px" style="max-width:80px;font-size: 12px;font-style: italic;" />
        </template>
      </a-table>
    </div>
  </a-modal>
</template>
<script>
import { getAction } from '@/api/manage'
export default {
  name: 'MarketingViewMembersModal',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      record: {},
      dataSource: [],
      marketingBusinessGiftTeamRecordId: '',
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '会员编号',
          align: 'center',
          dataIndex: 'id'
        },
        {
          title: '头像',
          align: 'center',
          dataIndex: 'headPortrait',
          scopedSlots: { customRender: 'headPortrait' }
        },
        {
          title: '会员手机号',
          align: 'center',
          dataIndex: 'phone'
        },
        {
          title: '会员昵称',
          align: 'center',
          dataIndex: 'nickName'
        },
        {
          title: '身份',
          align: 'center',
          dataIndex: 'grade',
          customRender: function(grade) {
            if (grade == 0) {
              return '粉丝'
            } else if (grade == 1) {
              return '副团长'
            } else if (grade == 2) {
              return '团长'
            }
          }
        },
        {
          title: '推荐人',
          align: 'center',
          dataIndex: 'tPhone'
        },
        {
          title: '推广码',
          align: 'center',
          dataIndex: 'promotionCode'
        },
        {
          title: '推荐数',
          align: 'center',
          dataIndex: 'testimonial'
        }
      ],

      url: {
        list: 'marketing/marketingBusinessGiftTeamList/getByteamRecordId',

        imgerver: window._CONFIG['domianURL'] + '/sys/common/view'
      }
    }
  },
  created(record) {
    console.log(record, '1111111111111')
  },
  methods: {
    getAvatarView: function(mainPicture) {
      return this.url.imgerver + '/' + mainPicture
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    async show(record) {
      this.visible = true
      this.confirmLoading = true

      this.record = record

      console.log(record, '22222222')
      await this.$nextTick()
      this.getList()
      this.confirmLoading = false
    },

    getList() {
      getAction(this.url.list, { marketingBusinessGiftTeamRecordId: this.record.id }).then(res => {
        if (res.success) {
          this.dataSource = res.result
        } else {
          this.dataSource = []
          this.$message.warn(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.CouponTextA {
  display: flex;
  justify-content: space-between;

  justify-items: center;
}

.CouponText {
  float: left;
  padding-right: 30px;
  border: 1px solid #ccc;
  width: 35%;
  height: 40px;
  background-color: #f2f2f2;
  line-height: 40px;
  text-align: right;
}

.CouponText2 {
  float: left;
  padding-left: 30px;
  border: 1px solid #ccc;
  width: 65%;
  height: 40px;
  line-height: 40px;
  text-align: left;
}
.messageWrap {
  padding: 30px;
  border: 1px solid gainsboro;
  border-radius: 10px;
  height: 250px;
}
</style>
