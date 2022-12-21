<template>
  <div id="userLayout" :class="['user-layout-wrapper', device]">
    <img class="right-bg" src='@/assets/login/login_bg1.png' />
    <div class="container clearfix">
      <div class="left-bg fl">
        <p class="title">全惠付商家赚钱系统</p>
        <img src='@/assets/login/login_bg2.png' />
      </div>

      <route-view class="fr"></route-view>
    </div>
  </div>
</template>

<script>
import RouteView from "@/components/layouts/RouteView"
import { mixinDevice } from '@/utils/mixin.js'

export default {
  name: "UserLayout",
  components: { RouteView },
  mixins: [mixinDevice],
  data() {
    return {}
  },
  mounted() {
    document.body.classList.add('userLayout')
  },
  beforeDestroy() {
    document.body.classList.remove('userLayout')
  },
}
</script>

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;
  background: #FFFFFF;
  position: relative;

  &.mobile {
    .container {
      .main {
        max-width: 368px;
        width: 98%;
      }
    }
  }

  .right-bg {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
  }

  .container {
    width: 1280px;
    position: fixed;
    left: 50%;
    top: 45%;
    transform: translate(-50%, -50%);

    .fl{
      float: left;
    }
    .fr{
      float: right;
    }

    a {
      text-decoration: none;
    }
    .left-bg{
      width: 520px;
      text-align: center;
      .title{
        height: 43px;
        font-size: 36px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #398CFF;
        line-height: 37px;
      }
      > img{
        width: 100%;
        margin-top: 80px;
      }
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
          margin-left: -12px;
          margin-top: -10px;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
          border-style: none;
        }

        .title {
          font-size: 33px;
          color: rgba(0, 0, 0, .85);
          font-family: "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }

      .desc {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }

    .main {
      min-width: 260px;
      width: 450px;
      margin: 0 auto;
      border-radius: 30px;
      background: #fff;
      padding: 20px 30px 60px;
      box-shadow: 0px 15px 39px 0px rgba(68,141,252,0.31);
    }

    .footer {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 0 16px;
      margin: 48px 0 24px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;

        a {
          color: rgba(0, 0, 0, 0.45);
          transition: all 0.3s;

          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }

      .copyright {
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
      }
    }
  }
}
</style>