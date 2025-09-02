<template>
  <div class="dashboard-container">
    <h2 class="wx-title">微信数据看板</h2>
    <div class="card-grid">
      <DashboardCard
        v-for="(card, index) in cards"
        :key="index"
        :icon="card.icon"
        :color="card.color"
        :title="card.title"
        :value="card.value"
        @click="handleCardClick(card.type)"
      />
    </div>
    <ChartSection :chartData="chartData" />
  </div>
</template>

<script>
import DashboardCard from './DashboardCard'
import ChartSection from './ChartSection'

export default {
  components: { DashboardCard, ChartSection },
  data() {
    return {
      cards: [
        {
          type: 'friends',
          icon: 'user',
          title: '好友数量',
          value: 0,
          color: '#07C160',
        },
        {
          type: 'online',
          icon: 'chat-dot-round',
          title: '在线微信',
          value: 0,
          color: '#07C160',
        },

        {
          type: 'received',
          icon: 'message',
          title: '已收消息',
          value: 0,
          color: '#faad14',
        },
        {
          type: 'sent',
          icon: 'upload2',
          title: '已发消息',
          value: 0,
          color: '#1890ff',
        },
      ],
      chartData: {
        dailyMessages: [],
        dailyTasks: [],
      },
    }
  },
  mounted() {
    this.fetchData()
    setInterval(this.fetchData, 30000)
  },
  methods: {
    async fetchData() {
      try {
        const [basic, charts] = await Promise.all([
          this.axios.get('/dashboard/basic'),
          this.axios.get('/dashboard/chartsData'),
        ])
        let basicData = basic.data.data
        this.cards.forEach((card) => {
          card.value = basicData[card.type]
        })

        let chartData = charts.data.data
        const dailyMessages = chartData.dailyMessages
        const dailyTasks = chartData.dailyTasks
        const reversedMessages = [...dailyMessages].reverse()
        const reversedTasks = [...dailyTasks].reverse()

        this.chartData = {
          dailyMessages: {
            labels: reversedMessages.map((item) => item.stat_date),
            aiData: reversedMessages.map((item) => item.ai_msg_count),
            totalData: reversedMessages.map((item) => item.total_msg_count),
          },
          dailyTasks: {
            labels: reversedTasks.map((item) => item.stat_date),
            counts: reversedTasks.map((item) => item.new_task_count),
            // 执行次数数据可能不存在，这里用0填充示例
            executions: reversedTasks.map(() => 0),
          },
        }
      } catch (error) {
        console.error('数据获取失败:', error)
      }
    },
    handleCardClick(type) {
      this.$router.push({ name: 'ChartDetail', params: { type } })
    },
  },
}
</script>

<style scoped>
.content {
  background: #f0f9eb;
}
.dashboard-container {
  padding: 20px;
  background: #f0f9eb;
  min-height: 100vh;
}

.wx-title {
  color: #07c160;
  margin-bottom: 30px;
  font-weight: 500;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}
</style>
