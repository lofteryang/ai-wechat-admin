<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>AI日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content-main">
      <div class="filter-box">
        <el-form :inline="true" :model="filterForm" class="demo-form-inline">
          <el-form-item label="用户消息">
            <el-input
              v-model="queryParams.text"
              placeholder="用户消息"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="AI回复">
            <el-input
              v-model="queryParams.reply"
              placeholder="AI回复"
              clearable
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
          <el-table-column prop="id" label="ID" width="60"></el-table-column>

          <el-table-column prop="create_time" label="时间" width="170">
          </el-table-column>

          <el-table-column prop="text" label="用户消息" min-width="220">
            <template slot-scope="scope">
              <div class="ellipsis-container">
                <el-tooltip
                  :content="scope.row.text"
                  placement="top"
                  :disabled="!isLongText(scope.row.text)"
                >
                  <div
                    class="truncated-text"
                    :class="{
                      'show-full': scope.row.expandText,
                      'show-lines-3': !scope.row.expandText,
                    }"
                    @click="toggleExpand(scope.row, 'text')"
                  >
                    {{ scope.row.text || '-' }}
                  </div>
                </el-tooltip>
                <span
                  v-if="isLongText(scope.row.text)"
                  class="toggle-btn"
                  @click="toggleExpand(scope.row, 'text')"
                >
                  {{ scope.row.expandText ? '收起' : '展开' }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="reply" label="AI回复" min-width="220">
            <template slot-scope="scope">
              <div class="ellipsis-container">
                <el-tooltip
                  :content="scope.row.reply"
                  placement="top"
                  :disabled="!isLongText(scope.row.reply)"
                >
                  <div
                    class="truncated-text"
                    :class="{
                      'show-full': scope.row.expandReply,
                      'show-lines-3': !scope.row.expandReply,
                    }"
                    @click="toggleExpand(scope.row, 'reply')"
                  >
                    {{ scope.row.reply || '-' }}
                  </div>
                </el-tooltip>
                <span
                  v-if="isLongText(scope.row.reply)"
                  class="toggle-btn"
                  @click="toggleExpand(scope.row, 'reply')"
                >
                  {{ scope.row.expandReply ? '收起' : '展开' }}
                </span>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="reson" label="推理过程" min-width="300">
            <template slot-scope="scope">
              <div class="ellipsis-container">
                <el-tooltip
                  :content="scope.row.reson"
                  placement="top"
                  :disabled="!isLongText(scope.row.reson)"
                >
                  <div
                    class="truncated-text"
                    :class="{
                      'show-lines-6': scope.row.expandReson,
                      'show-lines-3': !scope.row.expandReson,
                    }"
                    @click="toggleExpand(scope.row, 'reson')"
                  >
                    {{ scope.row.reson || '-' }}
                  </div>
                </el-tooltip>
                <div class="action-buttons">
                  <span
                    v-if="isLongText(scope.row.reson)"
                    class="toggle-btn"
                    @click="toggleExpand(scope.row, 'reson')"
                  >
                    {{ scope.row.expandReson ? '收起' : '展开' }}
                  </span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="showDetail(scope.row)"
                  >
                    详情
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        :current-page.sync="queryParams.page"
        :page-size="queryParams.size"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      :title="'日志详情 (ID: ' + currentRow.id + ')'"
      :visible.sync="dialogVisible"
      class="detail-dialog"
      width="60%"
    >
      <div class="content-card">
        <h4>用户消息:</h4>
        <p>{{ currentRow.text || '-' }}</p>
      </div>

      <div class="content-card">
        <h4>AI回复:</h4>
        <p>{{ currentRow.reply || '-' }}</p>
      </div>

      <div class="content-card">
        <h4>推理过程:</h4>
        <div class="json-content">
          {{ currentRow.reson || '-' }}
        </div>
      </div>

      <div class="content-card">
        <h4>详细信息:</h4>
        <div><strong>时间:</strong> {{ currentRow.create_time }}</div>
        <div><strong>会话ID:</strong> {{ currentRow.session_id || '-' }}</div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      filterForm: {
        username: '',
      },
      tableData: [],
      loginInfo: null,
      queryParams: {
        page: 1,
        size: 10,
        text: '',
        reply: '',
      },
      dialogVisible: false,
      currentRow: {
        id: '',
        text: '',
        reply: '',
        reson: '',
        create_time: 0,
        session_id: '',
      },
    }
  },
  methods: {
    resetFilter() {
      this.queryParams = {
        page: 1,
        size: 10,
        text: '',
        reply: '',
      }
      this.getList()
    },
    onSubmitFilter() {
      this.queryParams.page = 1
      this.getList()
    },
    handleSizeChange(size) {
      this.queryParams.size = size
      this.getList()
    },
    handlePageChange(page) {
      this.queryParams.page = page
      this.getList()
    },
    async getList() {
      try {
        // 这里应该是您原有的API调用
        const { data } = await this.$http.get('/logs/index', {
          params: this.queryParams,
        })

        // 添加展开状态属性
        this.tableData = data.data.data.map((item) => ({
          ...item,
          expandText: false,
          expandReply: false,
          expandReson: false,
        }))
        this.page = data.data.currentPage
        this.total = data.data.count
      } catch (error) {
        this.$message.error('获取列表失败')
      }
    },
    isLongText(text) {
      return text && text.length > 100
    },
    toggleExpand(row, field) {
      const expandField = `expand${
        field.charAt(0).toUpperCase() + field.slice(1)
      }`
      this.$set(row, expandField, !row[expandField])
    },
    showDetail(row) {
      this.currentRow = { ...row }
      this.dialogVisible = true
    },
    formatTime(timestamp) {
      if (!timestamp) return '-'
      const date = new Date(timestamp * 1000)
      return date
        .toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/\//g, '-')
    },
  },
  components: {},
  mounted() {
    this.getList()
  },
}
</script>

<style scoped>
/* 文本展开/折叠样式 */
.ellipsis-container {
  position: relative;
}
.truncated-text {
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  cursor: pointer;
}
.show-lines-3 {
  -webkit-line-clamp: 3;
}
.show-lines-6 {
  -webkit-line-clamp: 6;
}
.show-full {
  display: block;
}
.toggle-btn {
  position: absolute;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), #fff 20%);
  padding-left: 20px;
  color: #409eff;
  font-size: 12px;
  cursor: pointer;
  z-index: 2;
}

/* 详情弹窗样式 */
.detail-dialog .el-dialog__body {
  max-height: 60vh;
  overflow-y: auto;
}
.content-card {
  padding: 15px;
  border-radius: 4px;
  background: #f9f9f9;
  margin: 10px 0;
}
.json-content {
  white-space: pre-wrap;
  font-family: monospace;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
}
.action-buttons {
  display: flex;
  gap: 8px;
  margin-top: 5px;
}
</style>
