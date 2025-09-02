<template>
  <div class="login">
    <div class="login-box">
      <div class="logo">
        <img src="static/images/logo.png" />
      </div>
      <div class="body">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-form-item label="" prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              placeholder="密码"
            ></el-input>
          </el-form-item>
          <br />
          <el-form-item>
            <el-button
              type="primary"
              @click="startLogin"
              :loading="loading"
              style="width: 100%"
            >
              {{ loading ? '登录中...' : '登录' }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/config/api'

export default {
  data() {
    return {
      root: '',
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码不得低于6个字符', trigger: 'blur' },
        ],
      },
      loading: false,
    }
  },
  components: {},
  methods: {
    async startLogin() {
      let res = await this.axios.post('auth/login', {
        username: this.form.username,
        password: this.form.password,
      })
      let call = res.data
      this.loading = false
      if (res.data.errno === 0) {
        localStorage.setItem('token', res.data.data.token)
        localStorage.setItem('userInfo', JSON.stringify(res.data.data.userInfo))
        localStorage.setItem('adminType', res.data.data.userInfo.type)

        this.$router.push({ name: 'dashboard' })
      } else {
        this.$message({
          type: 'error',
          message: call.errmsg,
        })
        return false
      }
    },
  },
  mounted() {
    this.root = api.rootUrl
  },
}
</script>
<style>
.login {
  align-items: center;
  /* background: url("http://wfile.guyuyin.com/pexels-harrison-haines-2973098111.jpg"); //pexels-lukas-kloeppel-466685111 */
  /* 以上为登录背景,可以自己更换成自己喜欢的 */
  background: url('https://publicfile.m-glass.cn/90416605-6c5e-4986-b86b-62b7b93823a2');
  background-size: 100%;
  /* background-repeat: no-repeat; */
  display: flex;
  font-family: Lato, Helvetica, sans-serif;
  justify-content: center;
  text-align: center;
  height: 100%;
  width: 100%;
  color: #656565;
}

.login-box {
  width: 320px;
  background: #fff;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  box-shadow: 2px 2px 12px #ccc;
  margin-left: 800px;
  margin-top: 10%;
}

.login-box .logo {
  height: 100px;
  padding-top: 30px;
  /*background: #324157;*/
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box .logo img {
  width: 80px;
  height: auto;
}

.login-box .body {
  padding: 10px 30px 30px 30px;
}

.login-box .body .tips {
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-bottom: 30px;
}

.login-box .body .author {
  display: block;
  font-size: 14px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #656565;
  margin-bottom: 10px;
  text-decoration: none;
}

.login-box .body .author a {
  text-decoration: none;
}
</style>
