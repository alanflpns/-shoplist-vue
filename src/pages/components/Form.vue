<template>
    <section>
        <form @submit="submitForm">
            <div class="field">
                <label for="nameProduct">Produto</label>
                <Input :value="nameProduct" @input="event => nameProduct = event.target.value" autoFocus />
            </div>
            <div className="field">
                <label for="quantity">Quantidade</label>
                <InputCount :quantity="quantity" :moreQuantity="handleMoreQuantity" :lessQuantity="handleLessQuantity"
                    @input="handleChangeQuantity" />
            </div>
            <button className="buttonForm" :disabled="isDisabled">
                Adicionar
            </button>
        </form>
    </section>
</template>

<script lang="ts">
import Input from '../../components/Input.vue';
import InputCount from '../../components/InputCount.vue'
import LocalStorageAdapter from '../../infra/LocalStorageAdapter'

export default {
    name: 'FormComponent',
    data() {
        return {
            nameProduct: '',
            quantity: 1,
            isFocus: false
        }
    },
    methods: {
        handleMoreQuantity: function (this: any) {
            this.quantity += 1;
        },
        handleLessQuantity: function (this: any) {
            if (this.quantity > 1) {
                this.quantity -= 1;
            }
        },
        handleChangeQuantity: function (this: any, event: any) {
            const value = Number(event.target?.value);

            if (value > 0) {
                this.quantity = value;
            }
        },
        submitForm(this: any, event: Event) {
            event.preventDefault();

            const product = {
                name: this.nameProduct,
                quantity: this.quantity,
                isChecked: false,
                price: "R$ 0,00",
            };

            if (this.productsList.some((product: any) => product.name === this.nameProduct)) {
                const productIndex = this.productsList.findIndex(
                    (product: any) => product.name === this.nameProduct
                );
                const newProductsList = [...this.productsList];
                newProductsList[productIndex].quantity += this.quantity;
                this.$emit('updateProductsList', newProductsList)
            } else {
                this.$emit('updateProductsList', [...this.productsList, product])
            }

            this.nameProduct = ''
            this.quantity = 1

            const storage = new LocalStorageAdapter();
            storage.set("@ShopList/products", [...this.productsList, product]);
        }
    },
    computed: {
        isDisabled: function (this: any) {
            return this.nameProduct.trim().length < 1;
        }
    },
    props: {
        productsList: Array,
    },
    components: {
        Input,
        InputCount
    }
}
</script>

<style scoped lang="scss">
form {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;

    label {
        font-size: 14px;
        font-weight: 500;
        color: #404040;
    }

    .field {
        display: flex;
        flex-direction: column;
    }

    .buttonForm {
        all: unset;
        cursor: pointer;

        background-color: #008030;
        color: #ffffff;
        display: flex;
        text-align: center;
        justify-content: center;
        border-radius: 5px;
        align-items: center;
        padding: 5px 10px;

        &:hover {
            background-color: #006020;
        }

        &:disabled {
            background-color: #a1a1aa;
            cursor: not-allowed;
        }
    }
}
</style>