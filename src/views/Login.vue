<template>
    <div class="login-wrap" :style="backgroundImage">
        <div class="ms-login">
            <div class="ms-title">单点登录</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="username">
                        <template #prepend>
                            <el-button icon="el-icon-user"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="param.password"
                        @keyup.enter="submitForm()">
                        <template #prepend>
                            <el-button icon="el-icon-lock"></el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="redirect_url" v-show="false">
                  <span>{{ (param.redirect_url=$route.query) }}</span>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">登录</el-button>
                </div>
                <p class="login-tips">Tips : 没有账号密码可以联系<a href="mailto:rubixgeek795@gmail.com">客服</a>添加账号 </p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

import request from '../utils/request';

import Rsa from '../utils/rsa'

import dateUtil from "../utils/dateUtil";

export default {
  data() {
    return{
      url:"/src/assets/img/bg4.jpeg"
    }
  },
  computed: {
    backgroundImage: function () {
      let x = Math.ceil(Math.random() * 18);
      let url = "/src/assets/img/bg" + x + ".jpeg";
      let style = "background-image: url('" + url + "')";
      return style;
    }
  },
  setup() {
    const router = useRouter();
    const param = reactive({
        // username: "admin",
        // password: "123123",
      username: "",
      password: "",
      redirect_url: ""
    });

    // const url = "/src/assets/img/bg4.jpeg";

    const rules = {
        username: [
            {
                required: true,
                message: "请输入用户名",
                trigger: "blur",
            },
        ],
        password: [
            { required: true, message: "请输入密码", trigger: "blur" },
        ],
    };
    const login = ref(null);
    const submitForm = () => {
        login.value.validate((valid) => {
          console.log(valid)
          console.log(param);
          console.log(param.redirect_url.redirect_url)
            if (valid) {
              // ElMessage.success("登录成功");
              // localStorage.setItem("ms_username", param.username);
              // router.push("/");
              console.log(param);
              request.get("http://127.0.0.1:8080/xxl-sso-server/sso/check/" + param.username).then(res => {
                console.log(res)
                if (!(res.code === 200)) {
                  ElMessage.error(JSON.stringify(res.data));
                  return;
                }
                let key = res.data;
                let md5Pwd = Rsa.enMd5_32(param.password);
                console.log("MD5:" + md5Pwd);
                let enPwd = Rsa.hmac(md5Pwd, key);
                console.log("hmac:" + enPwd);
                let dateStr = dateUtil.dateStr();
                console.log("dateStr:" + dateStr);
                let enPwdFinal = Rsa.hmac(enPwd, dateStr);
                console.log("final:" + enPwdFinal);

                let dataJSON = {
                  username: param.username,
                  password: enPwdFinal
                };
                let dataStr = JSON.stringify(dataJSON);
                console.log(dataStr);
                let enKey = Rsa.enMd5_16(key);
                let enIv = Rsa.enMd5_16(enKey + key);
                let enDataStr = Rsa.aesEncrypt(dataStr, enKey, enIv);
                console.log(enDataStr);
                let enKeyData = {
                  "key": enKey,
                  "iv": enIv
                }
                let enKeyDataStr = JSON.stringify(enKeyData);
                console.log(enKeyDataStr);
                let rsaKeyStr = Rsa.rsaPublicData(enKeyDataStr);

                request({
                  url: "http://127.0.0.1:8080/xxl-sso-server/sso/doLogin?redirect_url=" + param.redirect_url.redirect_url,
                  method: 'post',
                  params: {
                    "data": enDataStr,
                    "key": rsaKeyStr,
                    "ifRemember": false
                  },
                  success: function (res) {
                    console.log(res);
                    ElMessage.success(res);
                  },
                  res: {}
                }).then((res) => {
                  console.log(res);
                  if (res.code === 200) {
                    localStorage.setItem("ms_username", param.username);
                    ElMessage.success("登录成功");
                    // window.location.href = res.data;
                    if (res.data.substr(0, 4) == "http") {
                      window.location.href = res.data;
                    } else {
                      router.push("/");
                    }
                  }else{
                    ElMessage.error(res.msg);
                  }
                });
              });
            } else {
                ElMessage.error("请检查账号密码");
                return false;
            }
        });
    };

    const store = useStore();
    store.commit("clearTags");

    return {
      param,
      rules,
      login,
      submitForm,
    };
  },
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../assets/img/bg1.jpeg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #fff;
    border-bottom: 1px solid #ddd;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #fff;
}
</style>