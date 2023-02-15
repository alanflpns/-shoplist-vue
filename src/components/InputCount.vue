<template>
    <div class="countContainer">
        <!-- disabled={rest.disabled} -->
        <button type="button" @click="lessQuantity" :disabled="isDisabled" :class="{ disabled: isDisabled}">
            -
        </button>
        <input type="number" :value="quantity" pattern="[0-9]*" inputmode="numeric" :disabled="isDisabled"
            :class="{ disabled: isDisabled }" />
        <button type="button" @click="moreQuantity" :disabled="isDisabled" :class="{ disabled: isDisabled }">
            +
        </button>
    </div>
</template>

<script lang="ts">

export default {
    name: 'InputCountComponent',
    props: ['quantity', 'lessQuantity', 'moreQuantity', 'isDisabled']
}
</script>

<style scoped lang="scss">
.countContainer {
    display: flex;

    button {
        all: unset;
        cursor: pointer;

        border: 2px solid #008030;
        color: #008030;
        width: 20px;
        display: flex;
        text-align: center;
        justify-content: center;
        border-radius: 5px;
        align-items: center;
        text-decoration: none !important;
        font-style: normal !important;

        &:disabled {
            cursor: not-allowed;
        }
    }

    input {
        width: fit-content;
        padding: 5px 10px;
        margin: 0 5px;
        max-width: 30px;

        background: transparent;
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

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type="number"] {
        -moz-appearance: textfield;
    }

    .disabled {
        text-decoration: line-through;
        font-style: italic;
        background-color: #d4d4d4;
        cursor: not-allowed;
    }
}
</style>