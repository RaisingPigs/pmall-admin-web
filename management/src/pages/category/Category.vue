<template>
    <div>
        <el-row>
            <el-col>
                <Breadcrumb :breadcrumb-list="breadcrumbList"></Breadcrumb>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-card>
                    <div slot="header" class="clearfix">
                        <span>分类列表</span>
                    </div>
                    <el-row>
                        <el-col>
                            <el-button @click="openAddDialog" type="primary">增加分类</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <el-table
                                row-key='categoryId'
                                :tree-props="{children: 'children'}"
                                :data="categories"
                                tooltip-effect='dark'
                                style="width: 100%"
                                border
                                stripe>
                                <el-table-column
                                    type="index"
                                    label="#"
                                    width="55"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    prop="categoryName"
                                    label="分类名"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="分类等级"
                                    align="center">
                                    <template v-slot="scope">
                                        <el-tag v-if="scope.row.categoryLevel===1" type="primary">一级</el-tag>
                                        <el-tag v-if="scope.row.categoryLevel===2" type="success">二级</el-tag>
                                        <el-tag v-if="scope.row.categoryLevel===3" type="warning">三级</el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="categorySlogan"
                                    label="分类口号"
                                    align="center">
                                </el-table-column>
                                <el-table-column
                                    label="操作"
                                    align="center"
                                    width="200px">
                                    <template v-slot='scope'>
                                        <el-tooltip class='item' effect='dark' content='编辑分类' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='primary'
                                                icon='el-icon-edit'
                                                @click='openUpdateDialog(scope.row)'>
                                            </el-button>
                                        </el-tooltip>
                                        <el-tooltip class='item' effect='dark' content='删除分类' placement='top'>
                                            <el-button
                                                size='mini'
                                                type='danger'
                                                icon='el-icon-delete'
                                                @click='handleCategoryDelete(scope.row)'>
                                            </el-button>
                                        </el-tooltip>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-col>
                    </el-row>

                    <el-dialog
                        title="增加分类"
                        :visible.sync="addDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeAddDialog">
                        <el-form ref="addFormRef"
                                 :rules="addFormRules"
                                 :model="addForm"
                                 label-width="80px">
                            <el-form-item label="分类名称" prop="categoryName">
                                <el-input v-model="addForm.categoryName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="所属分类">
                                <el-cascader
                                    v-model="categorySelectedIds"
                                    :options="tempCategories"
                                    :props="categoryCascaderProps">
                                </el-cascader>
                            </el-form-item>
                            <el-form-item label="分类口号" prop="categorySlogan">
                                <el-input v-model="addForm.categorySlogan" clearable></el-input>
                            </el-form-item>
                        </el-form>

                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeAddDialog">取消</el-button>
                                <el-button type="primary" @click="handleCategoryAdd">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>

                    <el-dialog
                        title="修改分类"
                        :visible.sync="updateDialogVisible"
                        :close-on-click-modal='false'
                        width="50%"
                        @close="closeUpdateDialog">
                        <el-form ref="updateFormRef"
                                 :rules="addFormRules"
                                 :model="updateForm"
                                 label-width="80px">
                            <el-form-item label="分类名称" prop="categoryName">
                                <el-input v-model="updateForm.categoryName" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="分类口号" prop="categorySlogan">
                                <el-input v-model="updateForm.categorySlogan" clearable></el-input>
                            </el-form-item>
                        </el-form>

                        <el-row>
                            <el-col align="right">
                                <el-button @click="closeUpdateDialog">取消</el-button>
                                <el-button type="primary" @click="handleUpdateCategory">确定</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb";

export default {
    name: "Category",
    components: {
        Breadcrumb,
    },
    data() {
        return {
            breadcrumbList: [
                {name: '首页', path: '/home'},
                {name: '商品管理', path: ''},
                {name: '商品列表', path: ''}
            ],
            queryInfo: {
                query: '',
                pagenum: 1,
                pagesize: 5
            },
            pageInfo: {
                total: 0,
                /*总页码*/
                pages: 0
            },
            categories: [],
            addDialogVisible: false,
            addForm: {
                categoryName: '',
                categoryLevel: 0,
                parentId: 0,
                categorySlogan: ''
            },
            addFormRules: {
                categoryName: [
                    {required: true, message: '请输入分类名称', trigger: 'blur'},
                ],
                categorySlogan: [
                    {required: true, message: '请输入分类口号', trigger: 'blur'},
                ]
            },
            tempCategories: [],
            categoryCascaderProps: {
                /*指定选项标签为选项对象的某个属性值*/
                label: 'categoryName',
                /*指定选项的值为选项对象的某个属性值*/
                value: 'categoryId',
                /*指定选项的子选项为选项对象的某个属性值*/
                children: 'children',
                /*次级菜单的展开方式*/
                expandTrigger: 'hover',
                /*是否严格的遵守父子节点不互相关联*/
                checkStrictly: true,
                /*只返回该节点的值*/
                // emitPath: false
            },
            categorySelectedIds: [],
            updateDialogVisible: false,
            updateForm: {
                categoryId: '',
                categoryName: '',
                categorySlogan: ''
            }
        }
    },
    methods: {
        async listCategories() {
            const {data: res} = await this.$http.get(`category/list`);

            if (res.code !== 200) {
                return this.$message.error({message: "获取分类列表失败", center: true});
            }

            this.categories = res.data.categories;
        },

        async handleCategoryDelete(category) {
            const confirmRes = await this.$confirm(`是否删除分类: ${category.categoryName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
            }).catch(error => error);

            if (confirmRes !== 'confirm') {
                return;
            }

            const {data: res} = await this.$http.delete(`category/${category.categoryId}`);

            if (res.code !== 204) {
                return this.$message.error({message: res.msg, center: true});
            }

            this.$message.success({message: "删除商品分类成功", center: true});
            await this.listCategories();
        },

        openAddDialog(parentCategory) {
            this.addDialogVisible = true;
            this.tempCategories = JSON.parse(JSON.stringify(this.categories));
            for (const tempCategory of this.tempCategories) {
                for (const child of tempCategory.children) {
                    child.children = undefined;
                }
            }
            this.tempCategories.unshift({categoryName: '无父分类', categoryId: 0});
        },

        closeAddDialog() {
            this.addDialogVisible = false;
            this.$refs.addFormRef.resetFields();
        },

        async handleCategoryAdd() {
            if (this.categorySelectedIds.length === 1) {
                if (this.categorySelectedIds[0] === 0) {
                    this.addForm.categoryLevel = 1;
                    this.addForm.parentId = 0;
                } else {
                    this.addForm.categoryLevel = 2;
                    this.addForm.parentId = this.categorySelectedIds[0];
                }
            } else if (this.categorySelectedIds.length === 2) {
                this.addForm.categoryLevel = 3;
                this.addForm.parentId = this.categorySelectedIds[1];
            }

            const {data: res} = await this.$http.post(`category/add`, this.addForm);

            if (res.code !== 201) {
                return this.$message.error({message: "添加商品分类失败", center: true});
            }

            this.$message.success({message: "添加商品分类成功", center: true});
            await this.listCategories();
            this.closeAddDialog();
        },

        openUpdateDialog(category) {
            this.updateDialogVisible = true;
            this.updateForm.categoryId = category.categoryId;
            this.updateForm.categoryName = category.categoryName;
            this.updateForm.categorySlogan = category.categorySlogan;
        },

        async handleUpdateCategory() {
            const {data: res} = await this.$http.put(`category/${this.updateForm.categoryId}`, this.updateForm);

            if (res.code !== 200) {
                return this.$message.error({message: "修改商品分类失败", center: true});
            }

            this.$message.success({message: "修改商品分类成功", center: true});
            await this.listCategories();

            this.closeUpdateDialog();
        },

        closeUpdateDialog() {
            this.updateDialogVisible = false;
            this.$refs.updateFormRef.resetFields();
        }
    },
    mounted() {
        this.listCategories();
    }
}
</script>

<style scoped>

</style>