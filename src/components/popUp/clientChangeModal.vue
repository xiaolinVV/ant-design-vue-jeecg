<template>
  <a-modal
    :title="title"
    :width="800"
    :height="500"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <!-- <a-radio-group
      v-model="pointsDisplay"
      v-if="url != '/marketingPrefecture/marketingPrefecture/settingPointsDisplay'"
    >
      <a-radio :value="0">
        全部
      </a-radio>
      <a-radio :value="1">
        仅app
      </a-radio>
      <a-radio :value="2">
        仅小程序
      </a-radio>
    </a-radio-group> -->
    <a-radio-group v-model="pointsDisplay">
      <a-radio :value="0">
        全部
      </a-radio>
      <a-radio :value="2">
        仅app
      </a-radio>
      <a-radio :value="1">
        仅小程序
      </a-radio>
    </a-radio-group>
  </a-modal>
</template>
<script>
import { getAction, postAction } from '@/api/manage'
export default {
  name: 'clientChangeModal',
  props: {
    url: {
      type: String,
      default: '/goodList/goodList/updatePointsDisplayByIds'
    },
    httpMethods: {
      type: String,
      default: 'getAction'
    }
  },
  data() {
    return {
      title: '客户端显示',
      // 分端显示；0：全部；1：小程序；2：app
      pointsDisplay: 0,
      visible: false,
      confirmLoading: false,
      ids: ''
    }
  },
  methods: {
    handleOk() {
      const that = this
      that.confirmLoading = true
      let httpMethods = that.httpMethods == 'getAction' ? getAction : ''
      httpMethods(that.url, {
        ids: that.ids,
        pointsDisplay: that.pointsDisplay
      }).then(res => {
        if (res.success) {
          that.$message.success(res.message)
          that.$emit('ok')
        } else {
          that.$message.warning(res.message)
        }
        that.confirmLoading = false
        that.visible = false
      })
    },
    handleCancel() {
      this.close()
    },
    open(ids) {
      this.ids = ids
      this.pointsDisplay = 0
      this.visible = true
    },
    close() {
      this.$emit('close')
      this.visible = false
    }
  }
}
</script>
<style lang="sass" scoped></style>
