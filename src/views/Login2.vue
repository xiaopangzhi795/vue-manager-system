<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="mgb20">
            <template #header>
              <div class="clearfix">
                <span>注册</span>
              </div>
            </template>

            <el-form ref="formRefRegister" :rules="rules" :model="formRegister" label-width="80px">
              <el-form-item label="账号" prop="username">
                <el-input v-model="formRegister.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="formRegister.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPwd">
                <el-input type="password" v-model="formRegister.confirmPwd"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onRegister">注册</el-button>
                <el-button @click="onResetRegister">清空</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="clearfix">
                  <span>登录</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="onReset">清空</el-button>
                </div>
              </template>

              <el-form ref="formRefLogin" :rules="rules" :model="formLogin" label-width="80px">
                <el-form-item label="用户名" prop="username">
                  <el-input v-model="formLogin.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input type="password" v-model="formLogin.password"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="onLogin">登录</el-button>
                  <el-button @click="onResetLogin">清空</el-button>
                </el-form-item>
              </el-form>
            </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="24">
          <el-card shadow="hover">
            <template #header>
              <div class="clearfix">
                <span>结果展示区</span>
              </div>
            </template>

            <span >{{data.poseData}}</span>
          </el-card>
        </el-col>
      </el-row>


    </div>
</template>

<script>
import Schart from "vue-schart";
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import request from '../utils/request';

import Rsa from '../utils/rsa'

import dateUtil from "../utils/dateUtil";

export default {
    name: "login",
    components: { Schart },
    setup() {
      const name = localStorage.getItem("ms_username");
      const role = name === "admin" ? "超级管理员" : "普通用户";
      const data = reactive({
        poseData: "登录/注册展示区"
      });

      //全局修改
      const rules = {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
        confirmPwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
        ],
      };

      //注册
      const formRefRegister = ref(null);
      const formRegister = reactive({
        username: "",
        password: "",
        confirmPwd: ""
      });
      // 提交 注册
      const onRegister = () => {
        // 表单校验
        formRefRegister.value.validate((valid) => {
          if (valid) {
            console.log(formRegister);
            if (!(formRegister.password === formRegister.confirmPwd)) {
              ElMessage.error("密码不一致！");
              return;
            }

            request.get("http://127.0.0.1:8080/login/check/" + formRegister.username).then(res => {
              let key = res;
              let md5Key = Rsa.enMd5_32(key);
              let enPwd = Rsa.hmac(formRegister.password, md5Key);
              // let dateStr = dateUtil.dateStr();
              // let enPwdFinal = Rsa.hmac(enPwd, dateStr);

              let dataJSON = {
                username: formRegister.username,
                password: enPwd
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
                url: "http://127.0.0.1:8080/login/doRegister",
                method: 'post',
                params: {
                  "data": enDataStr,
                  "key": rsaKeyStr
                },
                success: function (res) {
                  console.log(res)
                },
                res: {}
              }).then((res) => {
                console.log(res);
                data.poseData = res
                ElMessage.success("注册成功！");
              });

            });
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetRegister = () => {
        formRefRegister.value.resetFields();
        data.poseData = "展示登录/注册结果";
      };

      //登录
      const formRefLogin = ref(null);
      const formLogin = reactive({
        username: "",
        password: ""
      });
      // 提交 登录
      const onLogin = () => {
        // 表单校验
        formRefLogin.value.validate((valid) => {
          if (valid) {
            console.log(formLogin);

            request.get("http://127.0.0.1:8080/login/check/" + formLogin.username).then(res => {
              let key = res;
              let md5Key = Rsa.enMd5_32(key);
              let enPwd = Rsa.hmac(formLogin.password, md5Key);
              let dateStr = dateUtil.dateStr();
              let enPwdFinal = Rsa.hmac(enPwd, dateStr);

              let dataJSON = {
                username: formLogin.username,
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
                url: "http://127.0.0.1:8080/login/doLogin",
                method: 'post',
                params: {
                  "data": enDataStr,
                  "key": rsaKeyStr
                },
                success: function (res) {
                  console.log(res)
                },
                res: {}
              }).then((res) => {
                console.log(res);
                data.poseData = res
                ElMessage.success("登录成功！");
              });

            });
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetLogin = () => {
        formRefLogin.value.resetFields();
        data.poseData= "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      };

      return {
        data,

        formRefLogin,
        formLogin,
        onLogin,
        onResetLogin,

        formRefRegister,
        formRegister,
        onRegister,
        onResetRegister,

        rules,
      };

    },
};
</script>

<style scoped>

.user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
}


.user-info-list span {
    margin-left: 70px;
}

.mgb20 {
    margin-bottom: 20px;
}

</style>
