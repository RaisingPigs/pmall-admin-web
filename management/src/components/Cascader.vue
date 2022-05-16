<template>
    <el-cascader
        v-model="categorySelectedIds"
        :options="categories"
        :props="categoryCascaderProps"
        @change="handleCategoryChange">
    </el-cascader>
</template>

<script>
export default {
    name: "Cascader",
    data() {
        return {
            categories: [],
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
                // checkStrictly: true,
                /*只返回该节点的值*/
                // emitPath: false
            },
            categorySelectedIds: []
        }
    },
    methods: {
        async listCategories() {
            const {data: res} = await this.$http.get(`category/list`);

            if (res.code !== 200) {
                return this.$message.error({message: "获取分类列表失败", center: true});
            }

            this.categories = res.data.categories;
            this.setCategoriesUndef(this.categories);
        },
        setCategoriesUndef(categories) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].children.length < 1) {
                    categories[i].children = undefined;
                } else {
                    this.setCategoriesUndef(categories[i].children);
                }
            }
        },
        handleCategoryChange() {
            this.$bus.$emit('categoryChange', this.categorySelectedIds);
        }
    },
    mounted() {
        this.listCategories();
    }
}
</script>

<style scoped>
.el-cascader {
    width: 260px;
}
</style>