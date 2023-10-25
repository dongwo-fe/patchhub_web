<template>
    <div class="app-container">
        <el-form ref="userFrom" :model="configFrom" label-width="80px">
            <!-- <el-form-item label="用户名">
                <el-input disabled v-model="username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="configFrom.password"></el-input>
            </el-form-item> -->
            <el-form-item label="AES密钥">
                <el-input v-model="configFrom.aeskey"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSave">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { apiConfigGet, apiConfigEdit } from '@/api/config';
import { Message } from 'element-ui';

export default {
    name: 'Global',
    data: () => {
        return {
            defaultKey: '',
            configFrom: {
                // name: '',
                // password: '',
                aeskey: '',
            },
        };
    },
    computed: {},
    created() {
        this.getConfigData();
    },
    methods: {
        // 获取数据
        async getConfigData() {
            try {
                const config = await apiConfigGet();
                this.configFrom.aeskey = config.aeskey;
                this.defaultKey = config.aeskey;
            } catch (err) {
                console.log(err);
            }
        },
        // 点击保存的逻辑
        async handleSave() {
            if (this.defaultKey === this.configFrom.aeskey) {
                Message.error('输入的key与上次一样，请修改之后保存！');
                return;
            }
            try {
                const config = await apiConfigEdit({ aeskey: this.configFrom.aeskey });
                this.configFrom = { ...config };
            } catch (err) {
                // console.error(err);
                Message.error(err.message);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.app-container {
    // background-color: rgba($color: #aaa, $alpha: 0.3);
    width: 300px;
    // height: 100%;
    // margin: 20px;
    // border-radius: 16px;
    // background: #fff;
}
</style>
