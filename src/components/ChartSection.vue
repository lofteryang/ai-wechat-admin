<template>
  <div class="chart-section">
    <div class="chart-card" v-for="(chart, index) in charts" :key="index">
      <div class="chart-title">{{ chart.title }}</div>
      <div class="chart-container" ref="chartContainer"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  props: {
    chartData: Object,
  },
  data() {
    return {
      charts: [
        { title: '每日消息趋势', type: 'dailyMessages' },
        { title: '每日新任务数量', type: 'dailyTasks' }, // 修改标题
      ],
      chartInstances: [],
    }
  },
  mounted() {
    this.initCharts()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    this.chartInstances.forEach((instance) => instance.dispose())
  },
  methods: {
    initCharts() {
      this.$nextTick(() => {
        this.$refs.chartContainer.forEach((el, index) => {
          const chart = echarts.init(el)
          this.chartInstances.push(chart)
          this.updateChart(index)
        })
      })
    },
    updateChart(index) {
      const option = this.getChartOption(this.charts[index].type)
      this.chartInstances[index].setOption(option)
    },
    getChartOption(type) {
      const isDaily = type === 'dailyMessages'

      if (isDaily) {
        // 消息图表配置
        return {
          color: ['#07C160', '#8C9EFF'],
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const date = params[0].name
              const aiMsg = params[0].value
              const totalMsg = params[1].value
              return `${date}<br/>AI消息: ${aiMsg}条<br/>总消息: ${totalMsg}条`
            },
          },
          legend: {
            data: ['AI消息', '总消息'],
            bottom: 0,
          },
          grid: {
            top: 40,
            right: 20,
            bottom: 40,
            left: 50,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: this.chartData.dailyMessages.labels,
            axisLabel: {
              rotate: 30, // 日期标签旋转30度防止重叠
              formatter: function (value) {
                return value.substring(5) // 只显示月-日格式
              },
            },
          },
          yAxis: {
            type: 'value',
            name: '消息数量',
          },
          series: [
            {
              name: 'AI消息',
              type: 'line',
              smooth: true,
              data: this.chartData.dailyMessages.aiData,
            },
            {
              name: '总消息',
              type: 'line',
              smooth: true,
              data: this.chartData.dailyMessages.totalData,
            },
          ],
        }
      } else {
        // 任务图表配置
        return {
          color: ['#FF9800'],
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              const date = params[0].name
              const count = params[0].value
              return `${date}<br/>新任务: ${count}个`
            },
          },
          legend: {
            data: ['新任务'],
            bottom: 0,
          },
          grid: {
            top: 40,
            right: 20,
            bottom: 40,
            left: 50,
            containLabel: true,
          },
          xAxis: {
            type: 'category',
            data: this.chartData.dailyTasks.labels,
            axisLabel: {
              rotate: 30,
              formatter: function (value) {
                return value.substring(5)
              },
            },
          },
          yAxis: {
            type: 'value',
            name: '任务数量',
          },
          series: [
            {
              name: '新任务',
              type: 'bar', // 使用柱状图展示任务数量
              barWidth: '60%',
              data: this.chartData.dailyTasks.counts,
            },
          ],
        }
      }
    },
    handleResize() {
      this.chartInstances.forEach((instance) => instance.resize())
    },
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.$refs.chartContainer.forEach((el, index) => {
            if (this.chartInstances[index]) {
              this.updateChart(index)
            }
          })
        })
      },
    },
  },
}
</script>

<style scoped>
.chart-section {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 两列布局 */
  gap: 25px;
  margin-top: 30px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(7, 193, 96, 0.1);
  transition: transform 0.3s ease;
}

.chart-card:hover {
  transform: translateY(-5px);
}

.chart-title {
  color: #07c160;
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.chart-title::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  background: #07c160;
  margin-right: 8px;
  border-radius: 2px;
}

.chart-container {
  height: 350px; /* 增加高度 */
}
</style>
