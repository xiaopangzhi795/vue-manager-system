<template>
    <div>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="mgb20">
            <template #header>
              <div class="clearfix">
                <span>后端加密</span>
              </div>
            </template>

            <el-form ref="formRefRsaEn" :rules="rules" :model="formRsaEn" label-width="80px">
              <el-form-item label="KEY" prop="rsaKey">
                <el-input v-model="formRsaEn.rsaKey"></el-input>
              </el-form-item>
              <el-form-item label="加密文本" prop="rsaen">
                <el-input v-model="formRsaEn.rsaen"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmitRsaEn">RSA加密</el-button>
                <el-button type="primary" @click="onSubmitAesEn">AES加密</el-button>
                <el-button type="primary" @click="onSubmitMd5En">MD5加密</el-button>
                <el-button type="primary" @click="onSubmitHmacEn">Hmac加密</el-button>
                <el-button @click="onResetEn">清空</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
            <el-card shadow="hover">
              <template #header>
                <div class="clearfix">
                  <span>后端解密</span>
                  <el-button style="float: right; padding: 3px 0" type="text" @click="onReset">清空</el-button>
                </div>
              </template>

              <el-form ref="formRefRsaDe" :rules="rules" :model="formRsaDe" label-width="80px">
                <el-form-item label="KEY" prop="rsaKey">
                  <el-input v-model="formRsaDe.rsaKey"></el-input>
                </el-form-item>
                <el-form-item label="加密文本" prop="rsade">
                  <el-input v-model="formRsaDe.rsade"></el-input>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="onSubmitRsaDe">RSA解密</el-button>
                  <el-button type="primary" @click="onSubmitAesDe">AES解密</el-button>
                  <el-button @click="onResetDe">清空</el-button>
                </el-form-item>
              </el-form>
            </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover" class="mgb20">
            <template #header>
              <div class="clearfix">
                <span>前端加密</span>
              </div>
            </template>

            <el-form ref="formRefRsaEnSelf" :rules="rules" :model="formRsaEnSelf" label-width="80px">
              <el-form-item label="KEY" prop="rsaKey">
                <el-input v-model="formRsaEnSelf.rsaKey"></el-input>
              </el-form-item>
              <el-form-item label="加密文本" prop="rsaenSelf">
                <el-input v-model="formRsaEnSelf.rsaenSelf"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmitRsaEnSelf">RSA加密</el-button>
                <el-button type="primary" @click="onSubmitAesEnSelf">AES加密</el-button>
                <el-button type="primary" @click="onSubmitMd5EnSelf">MD5加密</el-button>
                <el-button type="primary" @click="onSubmitHmacEnSelf">Hmac加密</el-button>
                <el-button @click="onResetEnSelf">清空</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <template #header>
              <div class="clearfix">
                <span>前端解密</span>
              </div>
            </template>

            <el-form ref="formRefRsaDeSelf" :rules="rules" :model="formRsaDeSelf" label-width="80px">
              <el-form-item label="KEY" prop="rsaKey">
                <el-input v-model="formRsaDeSelf.rsaKey"></el-input>
              </el-form-item>
              <el-form-item label="加密文本" prop="rsadeSelf">
                <el-input v-model="formRsaDeSelf.rsadeSelf"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="onSubmitRsaDeSelf">RSA解密</el-button>
                <el-button type="primary" @click="onSubmitAesDeSelf">AES解密</el-button>
                <el-button @click="onResetDeSelf">清空</el-button>
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

const domain = "http://127.0.0.1:9090/coder/";

export default {
    name: "index",
    components: { Schart },
    setup() {
      const name = localStorage.getItem("ms_username");
      const role = name === "admin" ? "超级管理员" : "普通用户";
      const data = reactive({
        poseData: "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      });

      const todoList = reactive([
          {
              title: "前端搞好",
              status: false,
          },
      ]);

      //全局修改
      const rules = {
        rsaen: [
          { required: true, message: "请输入要加密的字符串", trigger: "blur" },
        ],
        rsade: [
          { required: true, message: "请输入要解密的字符串", trigger: "blur" },
        ],
        rsaenSelf: [
          { required: true, message: "请输入要加密的字符串", trigger: "blur" },
        ],
        rsadeSelf: [
          { required: true, message: "请输入要解密的字符串", trigger: "blur" },
        ],
      };

      //加密
      const formRefRsaEn = ref(null);
      const formRsaEn = reactive({
        rsaen: "",
        rsaKey: ""
      });
      // 提交 RSA 加密
      const onSubmitRsaEn = () => {
        // 表单校验
        formRefRsaEn.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEn);
            request({
              url: domain + "encode",
              method: 'get',
              params: {
                "msg": formRsaEn.rsaen,
                "appKey": "1234",
                "appCode": "demo"
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 AES 加密
      const onSubmitAesEn = () => {
        // 表单校验
        formRefRsaEn.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEn);
            if (formRsaEn.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_16(formRsaEn.rsaKey);
            let iv = Rsa.enMd5_16(formRsaEn.rsaKey + key);
            console.log(formRsaEn);
            request({
              url: domain + "aes/encode",
              method: 'get',
              params: {
                "msg": formRsaEn.rsaen,
                "key": key,
                "iv": iv
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 MD5 加密
      const onSubmitMd5En = () => {
        // 表单校验
        formRefRsaEn.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEn);
            request({
              url: domain + "md5",
              method: 'get',
              params: {
                "msg": formRsaEn.rsaen
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 Hmac 加密
      const onSubmitHmacEn = () => {
        // 表单校验
        formRefRsaEn.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEn);
            if (formRsaEn.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_32(formRsaEn.rsaKey);
            request({
              url: domain + "hmac",
              method: 'get',
              params: {
                "msg": formRsaEn.rsaen,
                "key": key
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetEn = () => {
        formRefRsaEn.value.resetFields();
        data.poseData= "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      };

      //前端加密
      const formRefRsaEnSelf = ref(null);
      const formRsaEnSelf = reactive({
        rsaenSelf: "",
        rsaKey: ""
      });
      // 提交 RSA 加密
      const onSubmitRsaEnSelf = () => {
        // 表单校验
        formRefRsaEnSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEnSelf);
            var encode =Rsa.rsaPublicData(formRsaEnSelf.rsaenSelf)
            console.log(encode)
            data.poseData = encode
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 AES 加密
      const onSubmitAesEnSelf = () => {
        // 表单校验
        formRefRsaEnSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEnSelf);
            if (formRsaEnSelf.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_16(formRsaEnSelf.rsaKey);
            let iv = Rsa.enMd5_16(formRsaEnSelf.rsaKey + key);
            var encode = Rsa.aesEncrypt(formRsaEnSelf.rsaenSelf, key, iv);
            console.log(encode)
            data.poseData = encode
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 MD5 加密
      const onSubmitMd5EnSelf = () => {
        // 表单校验
        formRefRsaEnSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEnSelf);
            var encode = Rsa.enMd5_16(formRsaEnSelf.rsaenSelf);
            console.log(encode)
            data.poseData = encode
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 hmac 加密
      const onSubmitHmacEnSelf = () => {
        // 表单校验
        formRefRsaEnSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaEnSelf);
            if (formRsaEnSelf.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_32(formRsaEnSelf.rsaKey);
            var encode = Rsa.hmac(formRsaEnSelf.rsaenSelf, key);
            console.log(encode)
            data.poseData = encode
            ElMessage.success("加密成功！");
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetEnSelf = () => {
        formRefRsaEnSelf.value.resetFields();
        data.poseData= "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      };

      //解密
      const formRefRsaDe = ref(null);
      const formRsaDe = reactive({
        rsade: "",
        rsaKey: ""
      });
      // 提交 RSA 解密
      const onSubmitRsaDe = () => {
        // 表单校验
        formRefRsaDe.value.validate((valid) => {
          if (valid) {
            console.log(formRsaDe);
            request({
              url: domain + "decode",
              method: 'get',
              params: {
                "msg": formRsaDe.rsade,
                "appKey": "1234",
                "appCode": "demo"
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("解密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 AES 解密
      const onSubmitAesDe = () => {
        // 表单校验
        formRefRsaDe.value.validate((valid) => {
          if (valid) {
            console.log(formRsaDe);
            if (formRsaDe.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_16(formRsaDe.rsaKey);
            let iv = Rsa.enMd5_16(formRsaDe.rsaKey + key);
            request({
              url: domain + "aes/decode",
              method: 'get',
              params: {
                "msg": formRsaDe.rsade,
                "key": key,
                "iv": iv
              },
              success: function (res) {
                console.log(res)
              },
              res: {}
            }).then((res) => {
              data.poseData = res
            });
            ElMessage.success("解密成功！");
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetDe = () => {
        formRefRsaDe.value.resetFields();
        data.poseData= "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      };

      //前端解密
      const formRefRsaDeSelf = ref(null);
      const formRsaDeSelf = reactive({
        rsadeSelf: "",
        rsaKey: ""
      });
      // 提交 RSA 解密
      const onSubmitRsaDeSelf = () => {
        // 表单校验
        formRefRsaDeSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaDeSelf);
            var encode =Rsa.rsaPrivateData(formRsaDeSelf.rsadeSelf)
            console.log(encode)
            data.poseData = encode
            ElMessage.success("解密成功！");
          } else {
            return false;
          }
        });
      };
      // 提交 AES 解密
      const onSubmitAesDeSelf = () => {
        // 表单校验
        formRefRsaDeSelf.value.validate((valid) => {
          if (valid) {
            console.log(formRsaDeSelf);
            if (formRsaDeSelf.rsaKey === "") {
              ElMessage.error("请输入key值！");
              return;
            }
            let key = Rsa.enMd5_16(formRsaDeSelf.rsaKey);
            let iv = Rsa.enMd5_16(formRsaDeSelf.rsaKey + key);
            var encode = Rsa.aesDecrypt(formRsaDeSelf.rsadeSelf, key, iv);
            console.log(encode)
            data.poseData = encode
            ElMessage.success("解密成功！");
          } else {
            return false;
          }
        });
      };
      // 重置
      const onResetDeSelf = () => {
        formRefRsaDeSelf.value.resetFields();
        data.poseData= "请在上面输入要加密/解密的文本,并点解加密/解密按钮,在此处查看结果"
      };


      return {
        data,
        name,
        todoList,
        role,

        formRefRsaEn,
        formRsaEn,
        onSubmitRsaEn,
        onSubmitAesEn,
        onSubmitMd5En,
        onSubmitHmacEn,
        onResetEn,

        formRefRsaEnSelf,
        formRsaEnSelf,
        onSubmitRsaEnSelf,
        onSubmitAesEnSelf,
        onSubmitMd5EnSelf,
        onSubmitHmacEnSelf,
        onResetEnSelf,

        formRefRsaDe,
        formRsaDe,
        onSubmitRsaDe,
        onSubmitAesDe,
        onResetDe,

        formRefRsaDeSelf,
        formRsaDeSelf,
        onSubmitRsaDeSelf,
        onSubmitAesDeSelf,
        onResetDeSelf,

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
