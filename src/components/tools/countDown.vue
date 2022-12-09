<template>
    <div class="countDown">
      <span>
        {{ d }}
      </span>
      <span>
        :
      </span>
      <span>
        {{ h }}
      </span>
      <span>
        :
      </span>
      <span>
        {{ i }}
      </span>
      <span>
        :
      </span>
      <span>
        {{ s }}.{{ms}}
      </span>
      <span>
        秒
      </span>
    </div>
</template>

<script>
  export default {
    name: 'countDown',
    props:{
      day: {
        type: [String,Number],
        default: 0
      },
      hour: {
        type: [String,Number],
        default: 0
      },
      minute: {
        type: [String,Number],
        default: 0
      },
      second: {
        type: [String,Number],
        default: 0
      }
    },
    data(){
      return{
        d: '00',
        h: '00',
        i: '00',
        s: '00',
        ms:'00',
        timer: null,
        syncFlag: false,
        leftTime: 0,
        seconds: 0
      }
    },
    watch: {
      day(val) {
        this.changeFlag()
      },
      hour(val) {
        this.changeFlag()
      },
      minute(val) {
        this.changeFlag()
      },
      second(val) {
        this.changeFlag()
      }
    },
    created: function(e) {
      this.startData();
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    methods: {
      toSeconds(day, hours, minutes, seconds) {
        return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds
      },
      timeUp() {
        clearInterval(this.timer)
        this.$emit('timeup')
      },
      countDown() {
        let seconds = this.seconds
        let [day, hour, minute, second,ms] = [0, 0, 0, 0,0]
        if (seconds > 0) {
          day = Math.floor(seconds / (60 * 60 * 24 ) /10)
          hour = Math.floor(seconds / (60 * 60 ) / 10) - (day * 24)
          minute = Math.floor(seconds / 60 / 10) - (day * 24 * 60) - (hour * 60)
          second = Math.floor(seconds / 10) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
          ms =  Math.floor(seconds) - (day * 24 * 60 * 60 * 10) - (hour * 60 * 60 * 10) - (minute * 60 * 10) - (second * 10)
        } else {
          this.timeUp()
        }
        if (day < 10) {
          day = '0' + day
        }
        if (hour < 10) {
          hour = '0' + hour
        }
        if (minute < 10) {
          minute = '0' + minute
        }
        if (second < 10) {
          second = '0' + second
        }
        if (ms < 10) {
          ms = '0' + ms
        }
        this.d = day
        this.h = hour
        this.i = minute
        this.s = second
        this.ms = ms
      },
      startData() {
        this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second) * 10
        if (this.seconds <= 0) {
          return
        }
        this.countDown()
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds < 0) {
            this.timeUp()
            return
          }
          this.countDown()
        }, 100)
      },
      changeFlag() {
        if (!this.syncFlag) {
          this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
          this.startData();
          this.syncFlag = true;
        }
      }
    }
  }
</script>

<style scoped>

</style>