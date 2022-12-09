<template>
  <a-modal
    title="统计信息"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-card :bordered="true" title="直播间数据" style="margin-bottom: 30px;">
      <detail-list>
        <detail-list-item term="实际开播时间">
          {{ model.startTime }}
        </detail-list-item>
        <detail-list-item term="实际结束时间">
          {{ model.endTime }}
        </detail-list-item>
        <detail-list-item term="播放时长"> </detail-list-item>
      </detail-list>
    </a-card>

    <a-card :bordered="true" title="点赞数据" style="margin-bottom: 30px;">
      <detail-list>
        <detail-list-item term="点赞人数">
          {{ model.thumb }}
        </detail-list-item>
        <detail-list-item term="点赞次数">
          {{ model.thumb }}
        </detail-list-item>
      </detail-list>
    </a-card>

    <!-- <a-card :bordered="true" title="评论数据" style="margin-bottom: 30px;">
      <detail-list>
        <detail-list-item term="评论人数"> </detail-list-item>
        <detail-list-item term="评论次数"> </detail-list-item>
      </detail-list>
    </a-card> -->
  </a-modal>
</template>
<script>
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  name: 'MarketingLiveStreamingAllInfoModal',
  components: {
    DetailListItem,
    DetailList
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      model: {}
    }
  },

  methods: {
    async open(record) {
      this.visible = true
      this.confirmLoading = true
      this.model = record
      await this.$nextTick()
      this.confirmLoading = false
    },
    handleCancel() {
      this.model = {}
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.MarketingLiveStreamingAllInfoModal {
}
</style>
