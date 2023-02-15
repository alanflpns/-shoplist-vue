<template>
    <header>
        <img alt="logo-shop-list" src="../../assets/logo.png">
    </header>
</template>

<script lang="ts">
export default {
    name: 'HeaderComponent',
}
</script>

<style scoped lang="scss">
header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: #008030;

    margin-bottom: 20px;

    img {
        width: 150px;
        height: 150px;
    }
}
</style>