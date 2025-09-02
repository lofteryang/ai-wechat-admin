<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>微信列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main">
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="addNewAuthKey"
              >新增设备</el-button
            >
            <el-button @click="resetFilter">刷新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="form-table-box">
        <el-table :data="tableData" style="width: 100%" border stripe>
          <el-table-column prop="auth_key" label="设备码" width="160">
          </el-table-column>
          <el-table-column prop="wx_id" label="微信ID" width="100">
          </el-table-column>
          <el-table-column prop="alias" label="微信号" width="100">
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
          <el-table-column prop="nickname" label="昵称" width="100">
          </el-table-column>

          <el-table-column prop="friend_count" label="好友数量" width="200">
            <template scope="scope">
              <el-tag type="danger">{{ scope.row.friend_count }}</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="当前状态" width="160">
            <template scope="scope">
              <el-tag v-if="scope.row.online" type="success">在线</el-tag>
              <el-tag v-else type="danger">离线</el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="expiryTime" label="到期时间" width="160">
          </el-table-column>
          <el-table-column prop="loginTime" label="登录时间" width="300">
            <template slot-scope="scope">
              <div class="multi-line-cell">
                <div>登录时间：{{ scope.row.loginTime }}</div>
                <div>{{ scope.row.onlineTime }}</div>
                <div style="color: red">
                  {{ scope.row.totalOnline }}
                </div>
                <div>创建时间：{{ scope.row.create_time }}</div>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="ws_status" label="消息接收" width="80">
            <template scope="scope">
              <el-switch
                size="mini"
                v-model="scope.row.ws_status"
                active-text=""
                inactive-text=""
                active-value="1"
                inactive-value="3"
                @change="updateWSStatus($event, scope.row.auth_key)"
              >
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column label="微信操作" width="260">
            <template slot-scope="scope">
              <div class="auto-grid">
                <!-- 扫码登录按钮 -->
                <div v-if="!scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    type="success"
                    @click="handleRowScanQrCode(scope.$index, scope.row)"
                    >扫码登录</el-button
                  >
                </div>

                <!-- 同步信息按钮 -->
                <div v-if="scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    @click="handleRowGetInfo(scope.$index, scope.row)"
                    >同步信息</el-button
                  >
                </div>

                <!-- 同步好友按钮 -->
                <div v-if="scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    :disabled="is_onloading_friends"
                    @click="handleRowGetFriends(scope.$index, scope.row)"
                    >同步好友</el-button
                  >
                </div>

                <!-- 进入会话按钮 -->
                <div v-if="scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleRowGoChat(scope.$index, scope.row)"
                    >进入会话</el-button
                  >
                </div>

                <div v-if="scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleRowGoSummary(scope.$index, scope.row)"
                    >分析总结</el-button
                  >
                </div>

                <!-- 退出登录按钮 -->
                <div v-if="scope.row.online" class="grid-item">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleRowExitCode(scope.$index, scope.row)"
                    >退出登录</el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="设备操作" width="150">
            <template scope="scope">
              <div class="auto-grid">
                <div class="grid-item">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleRowDelayAuthKey(scope.$index, scope.row)"
                    >设备延期</el-button
                  >
                </div>
                <div class="grid-item">
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleRowDeleteAuthKey(scope.$index, scope.row)"
                    >删除设备</el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>
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

    <el-dialog title="总结分析" :visible.sync="dialogVisible" width="30%">
      <el-input
        v-model="currentPrompt"
        type="textarea"
        :rows="4"
        placeholder="请输入prompt内容"
      >
      </el-input>

      <el-input
        style="margin-top: 10px"
        disabled
        v-model="aiReplyContent"
        type="textarea"
        :rows="4"
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
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      currentPrompt: '',
      aiReplyContent: '',
      page: 1,
      total: 0,
      filterForm: {},
      tableData: [],
      dialogVisible: false,
      currentRowId: null,
      currentRow: {},
      is_onloading_friends: false,
      getAIReplyLoading: false,
    }
  },
  methods: {
    updateWSStatus($event, para) {
      if ($event == 1) {
        this.axios
          .get('websocket/connect', {
            params: {
              key: para,
            },
          })
          .then((response) => {
            this.$message({
              type: 'success',
              message: '已连接',
            })
          })
      } else {
        this.axios
          .get('websocket/close', {
            params: {
              key: para,
            },
          })
          .then((response) => {
            this.$message({
              type: 'success',
              message: '已关闭',
            })
          })
      }
      this.getList()
    },
    handleRowGetInfo(index, row) {
      //checkLoginStatus
      this.axios
        .get('wechat/getProfileInfo', {
          params: {
            key: row.auth_key,
          },
        })
        .then((response) => {
          console.log(response.data.data)
          this.$message({
            message: '同步信息成功',
            type: 'success',
          })
          this.getList()
        })
    },
    handleRowGoChat(index, row) {
      this.$message({
        message: '功能正在筹备中',
        type: 'warning',
      })
      return
    },
    handleRowGoSummary(index, row) {
      this.dialogVisible = true
      this.currentRowId = row.id
    },
    async savePrompt() {
      try {
        this.getAIReplyLoading = true
        let res = await this.axios.post('account/getAIReply', {
          id: this.currentRowId,
          prompt: this.currentPrompt,
        })
        this.getAIReplyLoading = false
        let resStr = JSON.stringify(res.data)
        this.aiReplyContent = resStr
        this.$message.success('成功')
        this.getList()
      } catch (error) {
        this.getAIReplyLoading = false

        this.$message.error('失败')
      }
    },

    handleRowGetFriends(index, row) {
      if (!row.online) {
        this.$message({
          message: '账号离线，无法同步好友',
          type: 'warning',
        })
        return
      }
      //getFriendList
      this.is_onloading_friends = true
      this.axios
        .get('wechat/getFriendList', {
          params: {
            key: row.auth_key,
          },
        })
        .then((response) => {
          this.is_onloading_friends = false
          console.log(response.data.data)
          this.$message({
            message: '同步好友成功',
            type: 'success',
          })
          this.getList()
        })
    },
    handleRowScanQrCode(index, row) {
      //扫码登录
      //getLoginCode
      this.axios
        .get('wechat/getLoginCode', {
          params: {
            key: row.auth_key,
          },
        })
        .then((response) => {
          console.log(response.data.data)
          let url = response.data.data
          window.open(url)
        })
    },
    handleRowDelayAuthKey(index, row) {
      //delayAuthKey
      this.axios
        .get('wechat/delayAuthKey', {
          params: {
            key: row.auth_key,
          },
        })
        .then((response) => {
          this.$message({
            message: '延期成功',
            type: 'success',
          })
          this.getList()
        })
    },
    handleRowDeleteAuthKey(index, row) {
      this.$confirm('确定要删除设备吗？最好不要', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.axios
            .get('wechat/deleteAuthKey', {
              params: {
                key: row.auth_key,
              },
            })
            .then((response) => {
              this.$message({
                message: '删除成功',
                type: 'success',
              })
              this.getList()
            })
        })
        .catch(() => {})
    },
    handleRowExitCode(index, row) {
      this.$confirm('确定要退出登陆吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //退出登录
          this.axios
            .get('wechat/logOut', {
              params: {
                key: row.auth_key,
              },
            })
            .then((response) => {
              this.$message({
                message: '退出成功',
                type: 'success',
              })
              this.getList()
            })
        })
        .catch(() => {})
    },
    addNewAuthKey() {
      this.axios.get('wechat/genAuthKey1', {}).then((response) => {
        this.$message({
          message: '新增成功',
          type: 'success',
        })
        this.getList()
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

    onSubmitFilter() {
      this.page = 1
      this.getList()
    },
    getList() {
      this.axios
        .get('account', {
          params: {
            page: this.page,
            wxid: this.filterForm.wxid,
            nickname: this.filterForm.nickname,
          },
        })
        .then((response) => {
          this.tableData = response.data.data.data
          this.page = response.data.data.currentPage
          this.total = response.data.data.count
        })
    },
  },
  components: {},
  mounted() {
    this.page = 1
    this.getList()
  },
}
</script>

<style scoped>
/* 在组件的 <style> 部分添加 */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(100px, 1fr)
  ); /* 自动填充网格 */
  gap: 8px;
}

.grid-item {
  min-height: 40px; /* 保持网格项高度一致 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid-item .el-button {
  width: 100%; /* 按钮填满网格单元格 */
  margin: 0; /* 移除默认外边距 */
  white-space: nowrap; /* 防止文本换行 */
  overflow: hidden; /* 隐藏溢出文本 */
  text-overflow: ellipsis; /* 添加省略号 */
  /* padding: 6px 8px;  */
}
</style>
