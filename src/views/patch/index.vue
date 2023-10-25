<template>
    <div class="app-container">
        <el-button slot="trigger" size="small" type="primary" @click="publishVisible = true">发布补丁</el-button>
        <div class="patchs">
            <el-table :row-class-name="tableRowClassName" v-show="list.length > 0" :data="list" border fit highlight-current-row>
                <el-table-column label="ID" width="80">
                    <template slot-scope="{ row }">
                        <span>{{ row.id }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称">
                    <template slot-scope="{ row }">
                        <span>{{ row.title }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="版本" width="85">
                    <template slot-scope="{ row }">
                        <span>{{ row.version }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="激活数" width="120">
                    <template slot-scope="{ row }">
                        <span>{{ row.app_count }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="大小" width="80">
                    <template slot-scope="{ row }">
                        <span>{{ row.patch_size | filterSize }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规则" width="100">
                    <template slot-scope="{ row }">
                        <span>{{ ruleMap[row.rule] }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="加密" width="100">
                    <template>
                        <span>AES加密</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template slot-scope="{ row }">
                        <span>{{ stateMap[+row.state + 1] }}</span>
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
                <el-table-column label="发布时间" width="150">
                    <template slot-scope="{ row }">
                        <span>{{ formatTime(row.release_time) }}</span>
                    </template>
                </el-table-column>
                <el-table-column width="240" label="操作">
                    <template slot-scope="{ row }">
                        <el-button :disabled="row.state == -1" size="mini" type="primary" class="clip_btn" @click="handleEdit(row)"> 编辑 </el-button>
                        <el-button :disabled="row.state == -1" size="mini" type="danger" class="clip_btn" @click="handleRevert(row)"> 撤回 </el-button>
                        <el-button :disabled="row.state == -1" size="mini" type="success" class="clip_btn" @click="handleBrowse(row)"> 浏览 </el-button>
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
            @pagination="getPatchList"
        />
        <el-dialog title="发布补丁" :visible.sync="publishVisible" width="50%" :before-close="handlePublishClose">
            <el-form ref="publishFrom" :model="publishFrom" label-width="80px">
                <el-form-item v-if="!isSomeApp" label="选择应用">
                    <el-select v-model="publishFrom.appid" placeholder="下拉菜单">
                        <el-option v-for="item in appsList" :key="item.appid" :label="item.title" :value="item.appid"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="补丁">
                    <el-upload class="upload-demo" action="" :limit="1" :http-request="onUpload" :on-remove="handleRemove" :on-success="handleListSuccess" :file-list="fileList">
                        <el-button type="primary">上传文件</el-button>
                    </el-upload>
                </el-form-item>
                <el-form-item label="版本">
                    <el-input v-model="publishFrom.version" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="加密">
                    <el-radio label="1" v-model="publishFrom.encryption">AES加密</el-radio>
                </el-form-item>
                <el-form-item label="规则">
                    <el-radio :label="0" v-model="publishFrom.rule">开发设备</el-radio>
                    <el-radio :label="1" v-model="publishFrom.rule">全量设备</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="publishFrom.remark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="publishVisible = false">取消</el-button>
                <el-button type="primary" @click="handlePublish">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑补丁" :visible.sync="editVisible" width="50%" :before-close="handleEditClose">
            <el-form ref="publishFrom" :model="editFrom" label-width="80px">
                <el-form-item label="应用名">
                    <span>{{ editFrom.title }}</span>
                    <span>{{ editFrom.version }}</span>
                    <span>{{ editFrom.encryption }}</span>
                </el-form-item>
                <el-form-item label="规则">
                    <el-radio :label="0" v-model="editFrom.rule">开发设备</el-radio>
                    <el-radio :label="1" v-model="editFrom.rule">全量设备</el-radio>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="editFrom.remark" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取消</el-button>
                <el-button type="primary" @click="handleEditOK">保存</el-button>
            </span>
        </el-dialog>

        <el-dialog title="浏览" :visible.sync="seeVisible" width="50%" :before-close="handleSeeClose">
            <el-input :value="seeFrom.value" type="textarea" :rows="18" />
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="seeVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination';
import { readFileContent, formatTime } from '@/utils/index';
import { apiAppAll } from '@/api/application';
import { apiPatchAdd, apiPatchEdit, apiPatchList, apiRetract } from '@/api/patch';
import { Message } from 'element-ui';
export default {
    name: 'Patch',
    filters: {
        filterSize(val) {
            if (val < 1000) return val + 'b';
            if (val < 1000000) return (val / 1024).toFixed(2) + 'kb';
            if (val < 1000000000) return (val / 1024000).toFixed(2) + 'mb';
            return val + 'b';
        },
    },
    components: { Pagination },
    data: (context) => {
        const appid = context.$router?.history?.current?.query?.appid;
        return {
            queryApp: {}, // 应用请求参数
            appsList: [], // 应用列表
            query: { pageNumber: 0, pageSize: 20 }, // 补丁请求参数
            total: 0, // 补丁总数
            list: [], // 补丁列表
            applicationList: [], // 选择应用列表
            publishVisible: false, // 发布弹框
            publishFrom: {
                appid: appid || '',
                patchdata: '',
                size: 0,
                version: '',
                encryption: '1',
                rule: 0,
                remark: '',
                filename: '',
            }, // 发布编辑的from
            editVisible: false, // 编辑弹框
            editFrom: {}, // // 编辑的from
            fileList: [],
            ruleMap: ['开发设备', '全量设备'],
            stateMap: ['已撤回', '', '下发中'],

            seeVisible: false, // 浏览弹框
            seeFrom: { value: '' }, // 浏览key
            isSomeApp: !!appid, // 是否是某个固定的应用
        };
    },
    created: function () {
        this.getAppAll();
        this.getPatchList();
    },
    methods: {
        // 时间格式化
        formatTime: formatTime,
        // 状态表格
        tableRowClassName({ row, rowIndex }) {
            if (row.state === -1) {
                return 'disabled-row';
            }
            return '';
        },
        // 获取全部应用
        async getAppAll() {
            try {
                const { rows } = (await apiAppAll()) || {};
                this.appsList = rows || [];
            } catch (err) {
                // console.error(err);
                console.log(err);
            }
        },
        // 获取补丁list
        async getPatchList() {
            const { pageNumber, pageSize } = this.query;
            const { appid } = this.$router?.history?.current?.query || {};
            try {
                const { rows, count } = (await apiPatchList({ pageindex: pageNumber + 1, appid })) || {};
                this.list = rows || [];
                this.total = count || 0;
            } catch (err) {
                // console.error(err);
                console.log(err);
            }
        },
        // 校验
        verifyAdd(value) {
            if (!value.appid) {
                Message.error('请选择应用，应用不能为空！');
                return false;
            }
            if (!value.patchdata) {
                Message.error('请上传补丁，补丁不能为空！');
                return false;
            }
            if (!value.version || !value.version.trim()) {
                Message.error('请填写版本，版本不能为空！');
                return false;
            }
            return true;
        },
        // 发布补丁 必填项校验
        async handlePublish() {
            const { appid, version, rule, remark, encryption, patchdata, size } = this.publishFrom;
            // 校验函数
            if (!this.verifyAdd(this.publishFrom)) {
                return;
            }
            const appInfo = this.appsList.find(({ appid: id }) => appid === id);
            try {
                await apiPatchAdd({
                    appname: appInfo.title,
                    appid: appInfo.appid,
                    bundleid: appInfo.bundleid,
                    version,
                    rule,
                    encryption,
                    remark,
                    patchdata,
                    size,
                });
                await this.getPatchList();
                // 取消弹框
                this.publishVisible = false;
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 发布补丁取消
        handlePublishClose() {
            // 取消弹框
            this.publishVisible = false;
        },
        // 编辑补丁
        handleEdit(data) {
            this.editFrom = { ...data };
            this.editVisible = true;
        },
        handleEditClose() {
            // 取消弹框
            this.editVisible = false;
        },
        async handleEditOK() {
            // 编辑逻辑
            const { rule, remark, id } = this.editFrom;
            try {
                await apiPatchEdit({ rule, remark, id });
                await this.getPatchList();
                // 取消弹框
                this.editVisible = false;
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 撤回
        async handleRevert(data) {
            this.$confirm('是否撤回补丁：v' + data.version)
                .then(() => {
                    return this.onRevert(data);
                })
                .then(() => {
                    this.$message({
                        message: `已撤回`,
                        type: 'success',
                    });
                    this.getPatchList();
                })
                .catch((err) => {
                    this.$message({
                        message: err.message,
                        type: 'error',
                    });
                });
        },
        async onRevert(data) {
            try {
                await apiRetract(data);
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
        // 浏览
        handleBrowse(data) {
            this.seeFrom.value = data.content;
            this.seeVisible = true;
        },
        handleSeeClose() {
            this.seeVisible = false;
        },
        // -------------------------上传补丁文件
        async onUpload(data) {
            console.log(data);
            // 处理文件
            const { file } = data;
            const content = await readFileContent(file);
            console.log(content);
            // 改变data
            this.publishFrom.size = file.size;
            this.publishFrom.filename = file.name;
            this.publishFrom.patchdata = content;
        },
        handleRemove(file) {
            console.log('-----handleRemove-----------', file);
        },
        handleListSuccess(res) {
            console.log('-----handleListSuccess-----------', res);
        },
        // -------------------------上传补丁文件结束
    },
};
</script>

<style lang="scss" scoped>
.patchs {
    margin-top: 30px;
    overflow: auto;
}
.s-img {
    max-height: 100px;
}

.textRight {
    text-align: right;
}
.flex {
    display: flex;
}
.upload-demo {
    width: 260px;
}
.disabled-row {
    span {
        color: #aaa;
    }
    button {
        background-color: #aaa;
        border: #aaa;
    }
}
</style>
