<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>好友列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main">
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="微信号">
            <el-select
              prop="supplier_select"
              filterable
              v-model="filterForm.account_id"
              placeholder="选择微信"
              style="margin-left: 10px"
            >
              <el-option
                v-for="item in wechatAccountList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="好友ID">
            <el-input v-model="filterForm.id" placeholder="好友ID"></el-input>
          </el-form-item>
          <el-form-item label="微信ID">
            <el-input v-model="filterForm.wxid" placeholder="微信ID"></el-input>
          </el-form-item>
          <el-form-item label="微信昵称">
            <el-input
              v-model="filterForm.nickname"
              placeholder="微信昵称"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="filterForm.remark" placeholder="备注"></el-input>
          </el-form-item>

          <el-form-item label="是否会员">
            <el-input
              v-model="filterForm.is_active"
              placeholder="会员(1,0)"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmitFilter">查询</el-button>
            <el-button @click="resetFilter">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="id" label="ID" width="60"> </el-table-column>

          <el-table-column label="归属微信" width="80">
            <template scope="scope">
              <img
                :src="scope.row.ow_avatar"
                v-if="scope.row.ow_avatar"
                alt=""
                style="width: 50px; height: 50px"
              />
            </template>
          </el-table-column>
          <el-table-column label="头像" width="80">
            <template scope="scope">
              <img
                :src="scope.row.avatar"
                v-if="scope.row.avatar"
                alt=""
                style="width: 50px; height: 50px"
              />
            </template>
          </el-table-column>

          <el-table-column prop="wxid" label="微信ID" width="160">
          </el-table-column>

          <el-table-column prop="from" label="昵称" width="200">
            <template scope="scope">
              <el-tag type="danger" v-if="scope.row.nickname">{{
                scope.row.nickname
              }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="remark" label="备注" width="120">
          </el-table-column>

          <el-table-column prop="my_remark" label="我的称呼" width="120">
            <template scope="scope">
              <el-input
                v-model="scope.row.my_remark"
                placeholder="姓名"
                @blur="submitMyRemark(scope.$index, scope.row)"
              >
              </el-input>
            </template>
          </el-table-column>

          <el-table-column prop="mark" label="其他备注" width="180">
            <template scope="scope">
              <el-input
                v-model="scope.row.mark"
                placeholder="其他备注"
                @blur="submitMark(scope.$index, scope.row)"
              >
              </el-input>
              <el-button
                size="mini"
                style="margin-left: 5px; margin-top: 5px"
                @click="showMarkDetail(scope.row)"
                >详情</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="start_time" label="开通时间" width="120">
          </el-table-column>
          <el-table-column prop="end_time" label="结束时间" width="120">
          </el-table-column>

          <el-table-column prop="prompt" label="VIP设置" width="100">
            <template scope="scope">
              <el-button
                type="primary"
                icon="el-icon-edit"
                plain
                @click="editStory(scope.row)"
                size="small"
                >编辑</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="prompt" label="AI助手" width="100">
            <template scope="scope">
              <el-button
                plain
                icon="el-icon-check"
                type="success"
                @click="editPrompt(scope.row)"
                size="small"
                >使用</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="tasks" label="任务列表" width="100">
            <template scope="scope">
              <el-button
                plain
                icon="el-icon-finished"
                v-if="scope.row.tasks.length > 0"
                type="danger"
                size="small"
                @click="showTasks(scope.row)"
                >查看</el-button
              >
              <el-button
                plain
                icon="el-icon-plus"
                v-else
                type="warning"
                size="small"
                @click="showTasks(scope.row)"
                >新增</el-button
              >
            </template>
          </el-table-column>

          <el-table-column prop="delete" label="是否会员" width="80">
            <template scope="scope">
              <el-switch
                size="mini"
                v-model="scope.row.is_active"
                active-text=""
                inactive-text=""
                active-value="1"
                inactive-value="0"
                @change="updateMemberStatus($event, scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="ai_active" label="AI托管" width="80">
            <template scope="scope">
              <el-switch
                size="mini"
                v-model="scope.row.ai_active"
                active-text=""
                inactive-text=""
                active-value="1"
                inactive-value="0"
                @change="updateMemberAIStatus($event, scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="ai_reply" label="AI回复" width="80">
            <template scope="scope">
              <el-switch
                size="mini"
                v-model="scope.row.ai_reply"
                active-text=""
                inactive-text=""
                active-value="1"
                inactive-value="0"
                @change="updateMemberAIReplyStatus($event, scope.row.id)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <!-- <el-table-column label="操作">
            <template scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleRowEdit(scope.$index, scope.row)"
                >进入会话</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
      <div class="page-box">
        <el-pagination
          background
          @current-change="handlePageChange"
          :current-page.sync="page"
          :page-size="10"
          layout="total, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="编辑Mark" :visible.sync="markDialogVisible" width="30%">
      <el-input
        v-model="currentRow.mark"
        type="textarea"
        :rows="20"
        placeholder="请输入mark内容"
      >
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="markDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveMark">保存</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑Prompt" :visible.sync="dialogVisible" width="50%">
      <el-input
        v-model="currentPrompt"
        type="textarea"
        :rows="15"
        placeholder="请输入prompt内容"
      >
      </el-input>

      <el-input
        style="margin-top: 10px"
        disabled
        v-model="currentRow.ai_reply"
        type="textarea"
        :rows="15"
        placeholder="等待AI回复"
      >
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button
          :loading="getAIReplyLoading"
          type="primary"
          @click="savePrompt"
          >获取AI回复</el-button
        >
      </span>
    </el-dialog>

    <el-dialog title="VIP设置" :visible.sync="storyDialogVisible" width="30%">
      <div class="time-picker-group" style="margin-bottom: 10px">
        <el-date-picker
          v-model="currentRow.start_time"
          type="date"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd"
          style="width: 48%; margin-right: 4%"
        />
        <el-date-picker
          v-model="currentRow.end_time"
          type="date"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd"
          style="width: 48%"
        />
      </div>

      <el-input
        v-model="currentRow.user_story"
        type="textarea"
        :rows="4"
        placeholder="请输入用户需求"
      >
      </el-input>
      <div style="margin-top: 10px">
        <el-select v-model="currentRow.role_id" placeholder="机器人">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="storyDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="saveStory">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="任务详情" :visible.sync="taskDialogVisible" width="70%">
      <div class="task-container">
        <div class="task-list">
          <el-button type="primary" @click="refreshTaskList">刷新</el-button>
          <el-button type="success" @click="addTask">新增</el-button>
          <el-button type="danger" @click="closeAllTask">全部关闭</el-button>

          <el-table
            :data="currentTaskList"
            highlight-current-row
            @row-click="handleRowClick"
          >
            <el-table-column prop="task_name" label="任务名称" />
            <el-table-column prop="cron_expression" label="Cron" />
            <el-table-column prop="cron_expression_chinese" label="Cron中文" />

            <el-table-column prop="next_execution_time" label="下次执行时间" />
            <el-table-column prop="start_date" label="开始时间" />
            <el-table-column prop="end_date" label="结束时间" />
            <el-table-column prop="is_active" label="状态" width="80">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.is_active"
                  active-text=""
                  inactive-text=""
                  active-value="1"
                  inactive-value="0"
                  @change="updateTaskStatus($event, scope.row.id)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="task-detail" v-if="currentTask.friend_id">
          <el-form label-width="100px">
            <el-form-item label="任务名称">
              <el-input v-model="currentTask.task_name" />
            </el-form-item>
            <!-- <el-form-item label="AI提示语">
              <el-input v-model="currentTask.message_content" />
            </el-form-item> -->

            <!-- <el-form-item label="Cron表达式">
              <vueCron @change="changeCron" @close="cronPopover = false" />
            </el-form-item> -->

            <el-form-item label="Cron表达式">
              <el-input v-model="currentTask.cron_expression" />
            </el-form-item>

            <el-form-item label="开始时间">
              <el-input v-model="currentTask.start_date" />
            </el-form-item>
            <el-form-item label="结束时间">
              <el-input v-model="currentTask.end_date" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveTask">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import VueCron from 'vue-cron'
import Vue from 'vue'
Vue.use(VueCron)

export default {
  data() {
    return {
      markDialogVisible: false,
      storyDialogVisible: false,
      rolesList: [],
      page: 1,
      total: 0,
      filterForm: {},
      tableData: [],
      loginInfo: null,
      username: '',
      dialogVisible: false,
      currentPrompt: '',
      currentRowId: null,
      taskDialogVisible: false,
      currentTask: {}, //单个当前任务
      currentTaskList: [], //任务数组
      currentRow: {},
      getAIReplyLoading: false,
      wechatAccountList: [],
    }
  },
  methods: {
    showMarkDetail(row) {
      // this.$alert(row.mark, '备注内容', {
      //   confirmButtonText: '确定',
      //   callback: (action) => {},
      // })
      this.currentRow = row
      this.markDialogVisible = true
    },
    async getRolesList() {
      let res = await this.axios.post('roles/listAll', {})
      this.rolesList = res.data.data
    },
    async refreshTaskList() {
      let res = await this.axios.post('task/listWithFriendId', {
        friend_id: this.currentRow.id,
      })
      this.currentTaskList = res.data.data
    },
    async closeAllTask() {
      this.axios
        .post('task/closeAllTask', {
          friend_id: this.currentRow.id,
        })
        .then((response) => {
          this.$message.success('关闭成功')
          this.refreshTaskList()
        })
        .catch((error) => {
          this.$message.error('关闭失败')
        })
    },

    async submitMark(index, row) {
      this.axios
        .post('friends/updateMark', {
          id: row.id,
          mark: row.mark,
        })
        .then((response) => {
          this.$message.success('更新成功')
          this.getList()
        })
        .catch((error) => {
          this.$message.error('更新失败')
        })
    },
    async submitMyRemark(index, row) {
      this.axios
        .post('friends/updateMyRemark', {
          id: row.id,
          my_remark: row.my_remark,
        })
        .then((response) => {
          this.$message.success('更新成功')
          this.getList()
        })
        .catch((error) => {
          this.$message.error('更新失败')
        })
    },
    addTask() {
      this.currentTask = {
        friend_id: this.currentRow.id,
        is_active: '0',
      }
    },
    saveTask() {
      if (!this.currentTask.cron_expression) {
        this.$message.error('请填写时间表达式')
        return
      }
      if (!this.currentTask.task_name) {
        this.$message.error('请填写任务名称')
        return
      }

      this.axios
        .post('task/updateTask', this.currentTask)
        .then((response) => {
          this.$message.success('更新成功')
          this.getList()
          this.refreshTaskList()
        })
        .catch((error) => {
          this.$message.error('更新失败')
        })
    },
    changeCron(val) {
      this.currentTask.cron_expression = val
    },
    handleRowClick(row, column, event) {
      if (this.currentTask.cron_expression && !this.currentTask.id) {
        //弹窗提示数据未保存确认离开
        this.$confirm('确认离开后数据将不会保存，请确认已提交', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.currentTask = row
          })
          .catch(() => {})
      } else {
        this.currentTask = row
      }
    },
    updateTaskStatus($event, para) {
      this.axios
        .get('task/updateTaskStatus', {
          params: {
            is_active: $event,
            id: para,
          },
        })
        .then((response) => {
          if ($event == 0) {
            this.$message({
              type: 'success',
              message: '已开通',
            })
          }
        })
    },
    updateMemberStatus($event, para) {
      this.axios
        .get('friends/updateMemberStatus', {
          params: {
            is_active: $event,
            id: para,
          },
        })
        .then((response) => {
          if ($event == 0) {
            this.$message({
              type: 'success',
              message: '已开通',
            })
          }
        })
    },
    updateMemberAIReplyStatus($event, para) {
      this.axios
        .get('friends/updateMemberAIReplyStatus', {
          params: {
            ai_reply: $event,
            id: para,
          },
        })
        .then((response) => {
          if ($event == 0) {
            this.$message({
              type: 'success',
              message: '已开通',
            })
          }
        })
    },
    updateMemberAIStatus($event, para) {
      this.axios
        .get('friends/updateMemberAIStatus', {
          params: {
            ai_active: $event,
            id: para,
          },
        })
        .then((response) => {
          if ($event == 0) {
            this.$message({
              type: 'success',
              message: '已开通',
            })
          }
        })
    },
    resetFilter() {
      this.filterForm = {}
      this.getList()
    },

    handlePageChange(val) {
      this.page = val
      this.getList()
    },
    handleRowEdit(index, row) {
      this.$message.error('还没有开发！！！')
    },

    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios
        .get('friends/list', {
          params: {
            page: this.page,
            wxid: this.filterForm.wxid,
            remark: this.filterForm.remark,
            nickname: this.filterForm.nickname,
            is_active: this.filterForm.is_active,
            account_id: this.filterForm.account_id,
            id: this.filterForm.id,
          },
        })
        .then((response) => {
          this.tableData = response.data.data.data
          this.page = response.data.data.currentPage
          this.total = response.data.data.count
        })
    },
    editStory(row) {
      this.currentRowId = row.id
      this.currentRow = row
      this.storyDialogVisible = true
    },
    editPrompt(row) {
      this.currentPrompt = row.prompt
      this.currentRowId = row.id
      this.currentRow = row
      this.dialogVisible = true
    },
    showTasks(row) {
      this.currentTaskList = row.tasks
      this.currentRowId = row.id
      this.taskDialogVisible = true
      this.currentRow = row
    },
    async saveStory() {
      if (this.currentRow.end_time && this.currentRow.start_time) {
        const start = new Date(this.currentRow.start_time)
        const end = new Date(this.currentRow.end_time)

        if (end < start) {
          this.$message.error('结束时间不能早于开始时间')
          return
        }
      }
      try {
        let res = await this.axios.post('friends/updateStory', {
          id: this.currentRowId,
          user_story: this.currentRow.user_story,
          role_id: this.currentRow.role_id,
          start_time: this.formatDateForSave(this.currentRow.start_time),
          end_time: this.formatDateForSave(this.currentRow.end_time),
        })
        if (res.data.errno == 0) {
          this.$message.success('更新成功')
          this.storyDialogVisible = false
          this.getList()
        } else {
          this.$message.error('更新失败')
        }
      } catch (error) {
        this.$message.error('更新失败')
      }
    },
    formatDateForSave(dateValue) {
      if (!dateValue) return null

      // 情况1：完整时间格式（YYYY-MM-DD HH:mm:ss）
      if (
        typeof dateValue === 'string' &&
        /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateValue)
      ) {
        return dateValue
      }

      // 情况2：纯日期格式（YYYY-MM-DD）
      if (
        typeof dateValue === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(dateValue)
      ) {
        return dateValue === this.currentRow.end_time
          ? `${dateValue} 23:59:59`
          : `${dateValue} 00:00:00`
      }

      // 情况3：日期对象
      if (dateValue instanceof Date) {
        const yyyy = dateValue.getFullYear()
        const mm = String(dateValue.getMonth() + 1).padStart(2, '0')
        const dd = String(dateValue.getDate()).padStart(2, '0')

        if (dateValue === this.currentRow.end_time) {
          return `${yyyy}-${mm}-${dd} 23:59:59`
        }
        return `${yyyy}-${mm}-${dd} 00:00:00`
      }

      // 其他格式直接返回
      return dateValue
    },

    async getWechatList() {
      let res = await this.axios.post('account/allList', {})
      this.wechatAccountList = res.data.data
    },
    async saveMark() {
      try {
        let res = await this.axios.post('friends/updateMark', {
          id: this.currentRow.id,
          mark: this.currentRow.mark,
        })
        this.$message.success('更新成功')
        this.getList()
      } catch (error) {
        this.$message.error('更新失败')
      }
    },
    async savePrompt() {
      try {
        this.getAIReplyLoading = true
        let res = await this.axios.post('friends/updatePromptAndGetAIReply', {
          id: this.currentRowId,
          prompt: this.currentPrompt,
        })
        this.getAIReplyLoading = false
        let resStr = JSON.stringify(res.data)
        this.currentRow.ai_reply = resStr
        this.$message.success('更新成功')
        // this.dialogVisible = false
        this.getList()
      } catch (error) {
        this.getAIReplyLoading = false

        this.$message.error('更新失败')
      }
    },
  },
  components: {},
  mounted() {
    this.page = 1
    this.getRolesList()
    this.getList()
    this.getWechatList()
  },
}
</script>

<style scoped>
.time-picker-group {
  display: flex;
  justify-content: space-between;
}
#changeContab /deep/ #tab-0 {
  display: none;
}
#changeContab /deep/ #tab-5 {
  display: none;
}
.task-container {
  display: flex;
}
.task-list {
  width: 70%;
  padding: 10px;
  border: 1px #e8e8e8 solid;
}
.task-detail {
  width: 30%;
  border: 1px #e8e8e8 solid;
  padding: 10px;
}
</style>
