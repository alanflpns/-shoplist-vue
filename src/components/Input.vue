<template>
    <input placeholder="Insira o nome" :class="{
        noBorder: noBorder
    }" :style="{ width: width }" ref="input" />
</template>

<script lang="ts">

export default {
    name: 'InputComponent',
    props: ['noBorder', 'width'],
}
</script>

<style scoped lang="scss">
input {
    background: transparent;
    padding: 5px 10px;
    border: 1px solid #404040;
    border-radius: 5px;

    &:focus {
        outline: none;
        border-color: #008030;
    }

    &::placeholder {
        color: #a3a3a3;
    }

    &:disabled {
        cursor: not-allowed;
    }
}

.noBorder {
    border: none;
}

.width {
    width: 100%;
}
</style>