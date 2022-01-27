<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 监控
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
            empty-text="如果没有数据，请稍后再查询重试"
            >
              <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
              <el-table-column prop="date" label="应用名"></el-table-column>
              <el-table-column label="创建日期">
                  <template #default="scope">￥{{ scope.row.amount }}</template>
              </el-table-column>
              <el-table-column label="健康状态">
                <template #default="scope">￥{{ scope.row.money }}</template>
              </el-table-column>
              <el-table-column prop="note" label="备注"></el-table-column>
              <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                  <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                  </el-button>
                  <el-button type="text" icon="el-icon-delete" class="red"
                             @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
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
  name: "monitor",
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

    // 查询操作
    const handleSearch = () => {

    };

    // 分页导航
    const handlePageChange = (val) => {
      query.pageIndex = val;
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
