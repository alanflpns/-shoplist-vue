<template>
  <main>
    <div class="topPage">
      <Header />

      <Form :productsList="productsList" @updateProductsList="updateProductsList" />
    </div>


    <div v-if="productsList.length > 0" class="productsList">
      <div v-for="(product, index) in (productsList as any)" :key="product.name">
        <div :class="['product', { 'checked': product.isChecked }]">
          <div class="box">
            <input type="checkbox" @change="handleCheckProduct(index)" :checked="product.isChecked" />

            <span>{{ product.name }}</span>
          </div>

          <div class="box2">
            <InputCount :quantity="product.quantity" :moreQuantity="() => handleMoreQuantity(index)"
              :lessQuantity="() => handleLessQuantity(index)" @input="(event) => handleChangeQuantity(event, index)"
              :isDisabled="product.isChecked" />

            <Input @input="(event: any) => handleChangePrice(event, index)" width="70px" :value="product.price"
              pattern="[0-9]*" inputMode="numeric" :disabled="product.isChecked" />

            <div role="button" @click="() => product.isChecked ? null : handleDeleteProduct(index)" :class="['deleteButton', {
              'checked': product.isChecked
            }]">
              <TrashIcon />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="emptyList">
      <p>Nenhum produto adicionado</p>
    </div>


    <div class="containerPrice">
      <strong>Total: </strong>
      <span>{{ totalPrice }}</span>
    </div>

    <div id="container-button" class="addButton">
      <div class="infoButton">
        <img src="../assets/logo.png" alt="logo-shop-list" />
        <span>Instalar ShopList - React</span>
        <div>
          <button id="add-button">Instalar</button>
          <button id="cancel-button" className="buttonVariant">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Header from './components/Header.vue';
import Form from './components/Form.vue';
import Input from '../components/Input.vue'
import InputCount from '../components/InputCount.vue'
import LocalStorageAdapter from '../infra/LocalStorageAdapter'
import { moneyInputFormat, moneyInputFormatToFloat } from '../utils/inputMoney'
import TrashIcon from '../assets/trashIcon.vue'

export default {
  name: 'App',
  data() {
    return {
      productsList: []
    }
  },
  created(this: any) {
    const storage = new LocalStorageAdapter();
    const products = storage.get("@ShopList/products");

    if (products) {
      this.productsList = products;
    }

  },
  mounted() {
    let deferredPrompt: any;
    const containerButton = document.getElementById("container-button");
    const addButton = document.getElementById("add-button");
    const cancelButton = document.getElementById("cancel-button");

    console.log(containerButton)

    if (containerButton && addButton && cancelButton) {
      console.log('ueee')
      containerButton.style.display = "none";

      window.addEventListener("beforeinstallprompt", (e) => {
        console.log("service work on beforeinstallprompt");
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        containerButton.style.display = "flex";

        addButton.addEventListener("click", (e) => {
          // hide our user interface that shows our A2HS button
          containerButton.style.display = "none";
          // Show the prompt
          deferredPrompt.prompt();
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult: any) => {
            if (choiceResult.outcome === "accepted") {
              console.log("User accepted the prompt");
            } else {
              console.log("User dismissed the prompt");
            }
            deferredPrompt = null;
          });
        });
      });

      cancelButton.addEventListener("click", (e) => {
        containerButton.style.display = "none";
      });
    }
  },
  methods: {
    updateProductsList(this: any, newProductsList: any) {
      this.productsList = newProductsList;
    },
    handleCheckProduct(this: any, index: number) {
      const newProductsList = [...this.productsList];
      newProductsList[index].isChecked =
        !newProductsList[index].isChecked;
      this.productsList = newProductsList;

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductsList);
    },
    handleMoreQuantity(this: any, index: number) {
      const newProductsList = [...this.productsList];
      newProductsList[index].quantity += 1;
      this.productsList = newProductsList;

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductsList);
    },
    handleLessQuantity(this: any, index: number) {
      const newProductsList = [...this.productsList];
      if (newProductsList[index].quantity > 1) {
        newProductsList[index].quantity -= 1;
      }
      this.productsList = newProductsList;

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductsList);
    },
    handleChangeQuantity(
      this: any,
      e: any,
      index: number
    ) {
      const newQuantity = Number(e.target.value);
      if (newQuantity >= 1) {
        const newProductsList = [...this.productsList];
        newProductsList[index].quantity = newQuantity;
        this.productsList = newProductsList;

        const storage = new LocalStorageAdapter();
        storage.set("@ShopList/products", newProductsList);
      }
    },
    handleChangePrice(
      this: any,
      e: any,
      index: number
    ) {
      const newPrice = e.target.value;

      if (newPrice) {
        const newProductsList = [...this.productsList];
        newProductsList[index].price = `R$ ${moneyInputFormat(newPrice)}`;
        this.productsList = newProductsList;

        const storage = new LocalStorageAdapter();
        storage.set("@ShopList/products", newProductsList);
      }
    },
    handleDeleteProduct(this: any, index: number) {
      const newProductsList = [...this.productsList];
      newProductsList.splice(index, 1);
      this.productsList = newProductsList;

      const storage = new LocalStorageAdapter();
      storage.set("@ShopList/products", newProductsList);
    }
  },
  computed: {
    totalPrice: function (this: any) {
      const price = this.productsList.length > 0
        ? this.productsList
          .map((product: any) =>
            product.isChecked
              ? (moneyInputFormatToFloat(product.price) || 0) * product.quantity
              : 0
          )
          .reduce((a: any, b: any) => a + b)
        : 0;

      return `R$ ${moneyInputFormat(String(price.toFixed(2)))}`
    }
  },
  components: {
    Header,
    Form,
    Input,
    InputCount,
    TrashIcon
  },
}
</script>

<style lang="scss">
body {
  margin: 0;
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  background-color: #f5f5f5;
}

main {
  position: relative;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.topPage {
  position: fixed;
  top: 0;
  z-index: 2;
  background-color: #f5f5f5;
  padding-bottom: 10px;
  width: 100%;
}

.emptyList {
  max-width: fit-content;
  margin: 40px auto;
  position: relative;
  padding-bottom: 50px;
  padding-top: 250px;
}

.productsList {
  max-width: fit-content;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: relative;
  padding-bottom: 50px;
  padding-top: 250px;

  .product {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: space-between;
    margin: 0 20px;
    padding-bottom: 15px;

    border-bottom: 1px solid #a1a1aa;

    @media (max-width: 595px) {
      flex-direction: column;
    }
  }

  .box {
    border: 1px solid #008030;
    border-radius: 5px;
    display: flex;
    align-items: center;

    span {
      margin-left: 10px;
      width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .box2 {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #008030;
    cursor: pointer;
  }

  .deleteButton {
    display: flex;
    align-items: center;
    padding: 5px;
    cursor: pointer;
  }

  .checked {
    text-decoration: line-through;
    font-style: italic;
    background-color: #d4d4d4;
    cursor: not-allowed;
  }
}

.containerPrice {
  position: fixed;
  background-color: #008030;
  bottom: 0;
  width: 100%;
  padding: 10px 0;

  display: flex;
  flex-direction: column;
  align-items: flex-end;
  color: #ffffff;
  gap: 5px;

  strong,
  span {
    margin: 0 20px;
  }
}

.addButton {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  margin-bottom: 50px;

  z-index: 5;

  .infoButton {
    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    background-color: #ffffff;
    border-radius: 20px;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);

    margin: auto;

    padding: 20px 50px;

    img {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      border-radius: 10px;
    }

    span {
      margin-bottom: 20px;
    }

    div {
      display: flex;
      gap: 10px;

      button {
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

      .buttonVariant {
        background-color: #ffffff;
        color: #008030;
        border: 1px solid #008030;

        &:hover {
          background-color: #008030;
          color: #ffffff;
        }

        &:disabled {
          background-color: #a1a1aa;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>
