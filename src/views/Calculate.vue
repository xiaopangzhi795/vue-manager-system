<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 计算
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
              <el-col>
                <el-button @click="addLine">添加行数</el-button>
              </el-col>
              <el-table :data="query.data" v-model="query.data" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="amount" label="金额">
                  <template #default="scope">
                    <el-input v-model="scope.row.amount" placeholder="金额" clearable type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="count" label="剩余期数">
                  <template #default="scope">
                    <el-input v-model="scope.row.count" placeholder="剩余期数" clearable type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="note" label="备注">
                  <template #default="scope">
                    <el-input v-model="scope.row.note" placeholder="备注" clearable type="text"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作">
                  <template #default="scope">
                    <el-button type="danger" icon="el-icon-delete"
                               @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-select v-model="query.month" placeholder="月份" class="handle-select mr10">
                  <el-option key="1" label="12个月" value="12"></el-option>
                  <el-option key="1" label="24个月" value="24"></el-option>
                  <el-option key="1" label="36个月" value="36"></el-option>
                  <el-option key="2" label="48个月" value="48"></el-option>
              </el-select>
              <el-input v-model="query.money" placeholder="工资总数" class="handle-input mr10"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            empty-text="点击上方查询按钮进行计算"
            >
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column label="需要还款">
                    <template #default="scope">￥{{ scope.row.amount }}</template>
                </el-table-column>
                <el-table-column label="剩余工资">
                  <template #default="scope">￥{{ scope.row.money }}</template>
                </el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>

            </el-table>
            <div class="pagination">
                <el-pagination background layout="total" :current-page="query.pageIndex"
                    :page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

    </div>
</template>

<script>
import { ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { calculateData } from "../api/index";
import {Base64} from 'js-base64';

const domain = "http://127.0.0.1:9090/";

import request from '../utils/request';

export default {
  name: "calculate",
  setup() {
    const query = ref();
    const initQuery = () => {
      query.value = {
        data:[],
        month: "",
        pageIndex: 1,
        pageSize: 10,
      }
    }
    initQuery();
    const tableData = ref([]);
    const pageTotal = ref(0);
    // 获取表格数据
    const getData = () => {
      calculateData(query).then((res) => {
        tableData.value = res.list;
        pageTotal.value = res.pageTotal || 0;
      });
      request.get(domain + "search/data").then(res => {
        console.log(res);

        for (let i = 0; i < res.length; i++) {

          var newValue = {
            amount: res[i].amount,
            count: res[i].count,
            note: res[i].note
          }
          query.value.data.push(newValue);
        }
      })
    };
    getData();

    const addLine = () => {
      var newValue = {
        amount: "",
        count: "",
        note: ""
      }
      query.value.data.push(newValue);
    }

    // 查询操作
    const handleSearch = () => {
      console.log(query)
      console.log(query.value)
      console.log(query.value.data);
      console.log(query.value.month);
      let data = {
        data: query.value.data,
        month: query.value.month,
        money: query.value.money
      }
      console.log(data);
      let req =Base64.encode(JSON.stringify(data));
      console.log(req);
      request({
        url: domain + "calculate",
        method: 'post',
        params: {
          "req": req
        },
      }).then((res) => {
        console.log(res)
        tableData.value = res;
        pageTotal.value = res.length;
      });
      // query.pageIndex = 1;
      // getData();

    };
    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
      getData();
    };

    // 删除操作
    const handleDelete = (index) => {
      // // 二次确认删除
      // ElMessageBox.confirm("确定要删除吗？", "提示", {
      //     type: "warning",
      // })
      //     .then(() => {
      //         ElMessage.success("删除成功");
      //         tableData.value.splice(index, 1);
      //     })
      //     .catch(() => {});

      query.value.data.splice(index, 1);
    };

    // 表格编辑时弹窗和保存
    const editVisible = ref(false);
    let form = reactive({
      name: "",
      address: "",
    });
    let idx = -1;
    const handleEdit = (index, row) => {
      idx = index;
      Object.keys(form).forEach((item) => {
        form[item] = row[item];
      });
      editVisible.value = true;
    };
    const saveEdit = () => {
      editVisible.value = false;
      ElMessage.success(`修改第 ${idx + 1} 行成功`);
      Object.keys(form).forEach((item) => {
        tableData.value[idx][item] = form[item];
      });
    };

    return {
      query,
      tableData,
      pageTotal,
      editVisible,
      form,
      handleSearch,
      handlePageChange,
      addLine,
      handleDelete,
      handleEdit,
      saveEdit,
    };
  },
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
