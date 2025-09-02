<template>
  <div class="content-page">
    <div class="content-nav">
      <el-breadcrumb class="breadcrumb" separator="/">
        <el-breadcrumb-item>系统参数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 操作工具栏 -->

    <div class="content-main">
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">新增参数</el-button>

        <el-button @click="testAI">模型测试</el-button>
      </div>
      <!-- 数据表格 -->
      <el-table :data="system" border stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="key" label="Key" width="120"></el-table-column>
        <el-table-column
          prop="value"
          label="Value"
          min-width="200"
        ></el-table-column>

        <el-table-column
          prop="desc"
          label="描述"
          min-width="200"
        ></el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button size="mini" @click="handleEdit(row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <el-pagination
        @size-change="getList"
        @current-change="getList"
        :current-page.sync="queryParams.page"
        :page-size="queryParams.size"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </div>
    <el-dialog title="测试模型" :visible.sync="aiTestDialogVisible" width="50%">
      <el-input v-model="testInfo.host" placeholder="请输入Url"> </el-input>

      <el-input v-model="testInfo.key" placeholder="请输入Key"> </el-input>

      <el-input v-model="testInfo.model" placeholder="请输入模型名称">
      </el-input>
      <el-input
        v-model="testInfo.prompt"
        type="textarea"
        :rows="5"
        placeholder="请输入测试内容"
      >
      </el-input>

      <el-input
        style="margin-top: 10px"
        disabled
        v-model="testInfo.reply"
        type="textarea"
        :rows="5"
        placeholder="等待AI回复"
      >
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button
          :loading="testInfo.loading"
          type="primary"
          @click="getAITestReply"
          >获取AI回复</el-button
        >
      </span>
    </el-dialog>

    <!-- 角色表单弹窗 -->
    <el-dialog
      :title="currentRow.id ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
    >
      <el-form :model="currentRow" label-width="100px">
        <el-form-item label="key" required>
          <el-input v-model="currentRow.key" placeholder="请输入key"></el-input>
        </el-form-item>
        <el-form-item label="Value" required>
          <el-input
            v-model="currentRow.value"
            type="textarea"
            :rows="4"
            placeholder="请输入Value"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="desc">
          <el-input
            v-model="currentRow.desc"
            type="textarea"
            :rows="4"
            placeholder="请输入描述"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      aiTestDialogVisible: false,
      testInfo: {
        prompt: '',
        reply: '',
        loading: false,
        host: '',
        key: '',
        model: '',
      },
      system: [],
      total: 0,
      dialogVisible: false,
      currentRow: {},
      queryParams: {
        page: 1,
        size: 10,
      },
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    testAI() {
      this.aiTestDialogVisible = true
      this.testInfo = {
        prompt: '',
        reply: '',
        loading: false,
        host: '',
        key: '',
        model: '',
      }
    },
    async getAITestReply() {
      this.testInfo.loading = true
      try {
        const { data } = await this.$http.post('/system/test', this.testInfo)
        this.testInfo.reply = data.data
      } catch (error) {
        this.$message.error('获取AI回复失败')
      } finally {
        this.testInfo.loading = false
      }
    },
    async getList() {
      try {
        const { data } = await this.$http.get('/system/index', {
          params: this.queryParams,
        })

        this.system = data.data.data
        this.page = data.data.currentPage
        this.total = data.data.count
      } catch (error) {
        this.$message.error('获取角色列表失败')
      }
    },
    handleAdd() {
      this.currentRow = { role: '', prompt: '' }
      this.dialogVisible = true
    },
    handleEdit(row) {
      this.currentRow = { ...row }
      this.dialogVisible = true
    },
    async handleDelete(row) {
      try {
        await this.$confirm('确定删除吗？这是高风险操作！', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        // 发送删除请求
        await this.$http.get('/system/delete', {
          params: { id: row.id },
        })

        this.$message.success('删除成功')
        this.getList() // 刷新列表
      } catch (error) {
        // 区分用户取消和真实错误
        if (error !== 'cancel') {
          this.$message.error('删除失败')
        }
      }
    },
    async submitForm() {
      const api = this.currentRow.id ? '/system/edit' : '/system/add'
      try {
        await this.$http.post(api, this.currentRow)
        this.$message.success('操作成功')
        this.dialogVisible = false
        this.getList()
      } catch (error) {
        this.$message.error('操作失败')
      }
    },
  },
}
</script>

<style scoped>
.operation-bar {
  margin-bottom: 20px;
}
.el-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
