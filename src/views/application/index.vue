<template>
    <div class="app-container">
        <el-button slot="trigger" size="small" type="primary" @click="handleCreate">新建</el-button>
        <div class="appsList">
            <el-table v-show="appsList.length > 0" :data="appsList" border fit highlight-current-row>
                <el-table-column label="ID" width="80">
                    <template slot-scope="{ row }">
                        <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="appid">
                    <template slot-scope="{ row }">
                        <span>{{ row.appid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="bundleid">
                    <template slot-scope="{ row }">
                        <span>{{ row.bundleid }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="{ row }">
                        <span>{{ row.remark }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作人" width="80">
                    <template slot-scope="{ row }">
                        <span>{{ row.nickname }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作时间" width="170">
                    <template slot-scope="{ row }">
                        <span>{{ row.updatedAt | dateFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="300" label="操作">
                    <template slot-scope="{ row }">
                        <el-button size="mini" type="primary" class="clip_btn" @click="handleEdit(row)"> 编辑 </el-button>
                        <el-button class="clip_btn" size="mini" type="success" @click="handleManage(row)"> 补丁管理</el-button>
                        <el-button size="mini" type="danger" class="clip_btn" @click="handleDelete(row)"> 删除 </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <Pagination
            v-show="total > 0"
            layout="total, prev, pager, next"
            class="textRight"
            :total="total"
            :page.sync="query.pageNumber"
            :limit="query.pageSize"
            @pagination="getAppList"
        />

        <el-dialog :title="visibleTitle" :visible.sync="visibleApp" width="50%" :before-close="handleCancel">
            <el-form ref="publishFrom" :model="appFrom" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="appFrom.title"></el-input>
                </el-form-item>
                <el-form-item label="bundleid">
                    <el-input v-model="appFrom.bundleid" placeholder="请输入bundleid"></el-input>
                </el-form-item>
                <el-form-item label="加密">
                    <el-input v-model="appFrom.key"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="appFrom.remark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleApp = false">取消</el-button>
                <el-button type="primary" @click="handleOK">保存</el-button>
            </span>
        </el-dialog>
        <!-- :before-close="handleCancel" -->
        <el-dialog title="温馨提示" :visible.sync="visibleDel" width="30%">
            <span>此操作不可恢复，确定删除【{{ appDel.title }}】？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visibleDel = false">取消</el-button>
                <el-button type="primary" @click="handleDeleteOK">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { apiAppList, apiAppAdd, apiAppDel, apiAppEdit } from '@/api/application';
import { apiConfigGet } from '@/api/config';
import { Message } from 'element-ui';
export default {
    name: 'Application',
    components: { Pagination },
    data: () => {
        return {
            query: { pageNumber: 0, pageSize: 20 },
            appsList: [], // 应用list
            total: 0,
            visibleApp: false, // 弹框
            visibleType: '', // 弹框类型 create|edit
            visibleTitle: '',
            appFrom: {
                title: '',
                appid: '',
                bundleid: '',
                remark: '',
                key: '',
            }, // 应用
            visibleDel: false, // 删除应用弹框
            appDel: {}, // 删除应用
        };
    },
    created() {
        this.getAppList();
        this.getConfigData();
    },
    methods: {
        // 获取list
        async getAppList() {
            const { pageNumber, pageSize } = this.query;
            try {
                const { rows, count } = (await apiAppList({ pageindex: pageNumber + 1, pagesize: pageSize })) || {};
                this.appsList = rows || [];
                this.total = count || 0;
            } catch (err) {
                console.log(err);
            }
        },
        // 默认获取全局加密key
        async getConfigData() {
            const config = await apiConfigGet();
            this.appFrom.key = config.aeskey;
        },
        // 新建
        handleCreate() {
            this.visibleApp = true;
            this.visibleType = 'create'; // create | edit
            this.visibleTitle = '新建应用';
        },
        // 校验  title, bundleid, remark, key
        verifyAdd(value) {
            if (!value.title || !value.title.trim()) {
                Message.error('请输入名称，名称不能为空！');
                return false;
            }
            if (!value.bundleid || !value.bundleid.trim()) {
                Message.error('请输入bundleid，bundleid不能为空！');
                return false;
            }
            if (!value.key || !value.key.trim()) {
                Message.error('请填写密钥，密钥不能为空！');
                return false;
            }
            return true;
        },
        async handleCreateOK(data) {
            // 创建应用的逻辑
            const { title, bundleid, remark, key } = data;
            if (!this.verifyAdd(data)) {
                return;
            }
            try {
                await apiAppAdd({
                    title,
                    bundleid, // bundleid
                    key, // 加密
                    remark, // 备注
                });
                await this.getAppList();
                // 改变data值
                this.visibleApp = false;
                this.visibleType = '';
                this.visibleTitle = '';
                this.appFrom = {};
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 编辑
        handleEdit(data) {
            this.visibleApp = true;
            this.visibleType = 'edit';
            this.visibleTitle = '编辑应用';
            this.appFrom = { ...data };
        },
        async handleEditOK(data) {
            const { id, title, bundleid, remark, key } = data;
            if (!this.verifyAdd(data)) {
                return;
            }
            try {
                await apiAppEdit({ id, title, bundleid, remark, key });
                await this.getAppList();
                // 编辑应用的逻辑
                this.visibleApp = false;
                this.visibleType = '';
                this.visibleTitle = '';
                this.appFrom = {};
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 取消
        handleCancel() {
            this.visibleApp = false;
            this.visibleType = '';
            this.appFrom = {};
        },
        // 确定
        handleOK() {
            const data = this.appFrom;
            // 判断是新建还是修改的确定
            if (this.visibleType === 'create') {
                this.handleCreateOK(data);
            } else {
                this.handleEditOK(data);
            }
        },
        // 删除
        handleDelete(data) {
            this.visibleDel = true;
            this.appDel = data;
        },
        // 确定删除应用
        async handleDeleteOK() {
            try {
                // 删除应用
                await apiAppDel(this.appDel.id);
                await this.getAppList();
                // 改变data
                this.visibleDel = false;
                this.appDel = {};
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 跳转补丁管理
        handleManage(data) {
            this.$router.push({ path: `/patch/list?appid=${data.appid}` });
        },
    },
};
</script>

<style lang="scss" scoped>
.appsList {
    margin-top: 30px;
    overflow: auto;
}

.textRight {
    text-align: right;
}
.clip_btn {
    margin: 0 5px;
}
</style>
