<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <template v-for="(item,index) in breadcrumbList">
            <!--带路径-->
            <el-breadcrumb-item
                v-if="item.path"
                :to="{ path: item.path}"
                :key="index">
                {{item.name}}
            </el-breadcrumb-item>

            <!--不带路径-->
            <el-breadcrumb-item
                v-else>
                {{item.name}}
            </el-breadcrumb-item>
        </template>
    </el-breadcrumb>
</template>

<script>
export default {
    name: "Breadcrumb",
    props: ['breadcrumbList']
}
</script>

<style scoped>
.el-breadcrumb {
    margin-bottom: 20px;
}
</style>