<template>
  <div class="left-box">
    <div class="logo">
      <img src="static/images/logo.png" />
    </div>
    <el-menu
      class="sidebar"
      :unique-opened="true"
      :default-active="currentPagePath"
      @open="handleOpen"
      :router="true"
      @close="handleClose"
    >
      <el-menu-item index="/dashboard/welcome">
        <i class="el-icon-pie-chart"></i>
        <span>主页</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/wechat">
        <i class="el-icon-chat-dot-round"></i>
        <span>微信管理</span>
      </el-menu-item>
      <el-menu-item index="/dashboard/friend">
        <i class="el-icon-user"></i>
        <span>好友管理</span>
      </el-menu-item>
      <el-submenu index="user">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/dashboard/roles">
          <i class="el-icon-collection-tag"></i>
          <span>角色配置</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/logs">
          <i class="el-icon-set-up"></i>
          <span>AI日志</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/system">
          <i class="el-icon-setting"></i>
          <span>系统配置</span>
        </el-menu-item>
      </el-submenu>
      <el-menu-item index="/dashboard/admin">
        <i class="el-icon-setting"></i>
        <span>管理员</span>
      </el-menu-item>

      <el-menu-item @click="logout">
        <i class="el-icon-close"></i>
        <span>退出</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import api from '@/config/api'

export default {
  data() {
    return {
      currentPagePath: '/dashboard',
      loginInfo: null,
      type: 1,
      root: '',
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    logout() {
      this.$confirm('是否要退出?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        localStorage.clear()
        this.$router.replace({ name: 'login' })
      })
    },
  },
  mounted() {
    console.log(this.$route.path)
    this.root = api.rootUrl

    if (!this.loginInfo) {
      this.loginInfo = JSON.parse(
        window.localStorage.getItem('userInfo') || null
      )
    }
    if (this.loginInfo) {
      let loginStatus = false
      this.axios
        .post(this.root + '/auth/loginWithPw', {
          username: this.loginInfo.username,
          password: this.loginInfo.password,
        })
        .then((res) => {
          let call = res.data
          if (res.data.errno === 0) {
            localStorage.setItem('token', res.data.data.token)
            localStorage.setItem(
              'userInfo',
              JSON.stringify(res.data.data.userInfo)
            )
            // this.$router.push({ name: 'welcome' })
          } else {
            this.$message({
              type: 'error',
              message: call.errmsg,
            })
            localStorage.clear()
            this.$router.replace({ name: 'login' })
            return false
          }
        })
    }

    this.type = localStorage.getItem('adminType')
  },
}
</script>
<style>
.left-box {
  width: 200px;
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 5;
  height: 100%;
  float: left;
  flex-direction: column;
  background: #fff;
}

.left-box .sidebar {
  width: 200px;
  flex: 1;
  border-radius: 0;
  /*background: #233445;*/
}

.left-box .fa {
  margin-right: 10px;
  font-size: 18px;
  /*color: #ccc;*/
}

.left-box span {
  /*color: #ccc;*/
}

.left-box .el-submenu .el-menu-item .fa {
  margin-right: 10px;
  font-size: 10px;
}

/*渐变背景*/
.back {
  background: -webkit-linear-gradient(138deg, #8731e8 0%, #4528dc 100%);
  background: -o-linear-gradient(138deg, #8731e8 0%, #4528dc 100%);
  background: linear-gradient(-48deg, #8731e8 0%, #4528dc 100%);
  opacity: 0.7;
}

.left-box .logo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  width: 200px;
  border-right: solid 1px #e6e6e6;
  /*box-shadow: 0 1px 1px rgba(0, 0, 0, .5);*/
}

.left-box .logo img {
  width: 80px;
  height: auto;
}
</style>
