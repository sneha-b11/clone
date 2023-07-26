<template>
  <div>
    <div style="margin-left:515px; margin-top:10px">
      <button v-if="user_loggedin" class="btn" style="position:absolute; right:50px" @click="logout()">Logout</button>
      <VueSlickCarousel :arrows="true" :dots="true" style="width:500px; ">
      <div>
        <img style="width:10px !important" src="@/imgs/img1.jpg" alt="First slide">
      </div>
      <div>
        <img style="width:10px !important" src="@/imgs/img2.jpg" alt="First slide">
      </div>
      <div>
        <img style="width:10px !important" src="@/imgs/img3.jpg" alt="First slide">
      </div>
      </VueSlickCarousel>
    </div>
    <div class="outer_container">
      <div class="inner_container">
        <div>
          <h3>Selling Fee Calculator</h3>
          <p>Calculate the profit you can earn with your product</p>
          <model-select :options="options" v-model="item" placeholder="Select product"></model-select>
          <p>{{item.marketfee_percent}}%</p>
          <p>Enter the selling price of your product</p>
        </div>
        <form action="">
          <input v-model="selling_price" type="text" placeholder="Selling price (in rupees)" style="width: 220px; border:none; border-radius:5px; height: 30px;">
          <span class="first_button"> 
            <button type="button" class="btn btn-outline-primary btn-sm" style="border-radius: 20px;" @click="calculate_fee(selling_price)">Calculate Fees</button>
          <p v-if="this.errortext" class="text-danger">
            {{this.errortext}}
          </p>
          <p>Prices and rates shown below are indicative</p>
          </span>
          
        </form>
      </div>
      <div v-if="this.show_fee">
        <hr class="new1">
        <div style="display:flex">
            <p style="margin-left:20px">MarketPlace Fee ({{item.marketfee_percent}}%)</p>
            <p style="position: absolute; right: 60px;">Rs {{parseFloat(this.market_fee).toFixed(2)}}</p>
        </div>
        <div style="display: flex">
          <p style="margin-left:20px">Closing Fee</p>
          <p style="position: absolute; right: 60px;">Rs {{this.closing_fees.charges}}</p>
        </div>
            
        <div v-if="this.show_shipping">
          <div class="button">
            <button @click="with_shipping()" type="button" class="btn btn-outline-primary" id="second_button" style="border-radius: 20px;">With Shipping Fee</button>
              <button @click="without_shipping()" type="button" class="btn btn-outline-primary" id="third_button" style="border-radius: 20px;">Without Shipping Fee</button>
          </div>
          <div v-if="this.show_with_shipping">
            <p class="newP2">
              Shipping fees varies based on distance the product is shipped:
            </p>
            <div class="button">
              <button type="button" @click="selected_category('city')" class="btn btn-outline-primary" style="border-radius: 20px; margin:8px;">Within City</button>
              <button type="button" @click="selected_category('state')" class="btn btn-outline-primary" style="border-radius: 20px; margin:8px">Within State</button>
              <button type="button" @click="selected_category('rest_of_india')" class="btn btn-outline-primary" style="border-radius: 20px; margin:8px">Rest of India</button><br>
              <button type="button" @click="selected_category('metro')" class="btn btn-outline-primary" style="border-radius: 20px; margin:8px">Metro to Metro</button>
              <button type="button" @click="selected_category('special')" class="btn btn-outline-primary" style="border-radius: 20px; margin:8px">Special Regions</button>
            </div>
            <div>
              <p style="padding-top: 10px;">
                Enter the approximate weight of the product
              </p>
              <form action="">
                <input  type="text" v-model="weight" placeholder="Weight (in kgs)" style="width: 180px; border:none; border-radius:5px; height: 30px;">
                <button id="input_field" type="button" class="btn btn-outline-primary btn-sm" style="border-radius: 20px;" @click="submit()">Submit</button>
              </form>
            </div>
          </div>
        </div>
        <div v-if="show_total">
          <div style="display:flex">
            <p style="margin-left:20px">Shipping Fee</p>
            <p style="position:absolute; right:60px">Rs {{parseFloat(this.shipping_charges).toFixed(2)}}</p>
          </div>
          <div>
            <h6 class="shipping" v-if="show_with_shipping">({{this.weight}} kgs)</h6>
          </div>
          <hr>

          <div style="display:flex">
            <p style="margin-left:20px">Total Fee</p>
            <p style="position:absolute; right:60px">Rs {{total}}</p>
          </div>

          <div style="display:flex">
            <p style="margin-left:20px">GST on Total Fee (18%)</p>
            <p style="position:absolute; right:60px">Rs {{gst_total}}</p>
          </div>
          <hr>

          <div style="display:flex">
            <p style="margin-left:20px"><strong>Total Selling Fee </strong></p>
            <p style="position:absolute; right:60px"><strong>Rs {{grand_total}} </strong></p>
          </div>

          <div style="display:flex">
            <p style="margin-left:20px"><strong>Seller Profit</strong></p>
            <p style="position:absolute; right:60px"><strong>Rs {{profit}} </strong></p>
          </div>
          <button type="button" class="btn btn-outline-primary btn-sm" style="border-radius: 20px;" @click="back()">Back</button>
        </div>
      </div>
    </div> 
 
    <h3 style="margin-top:20px">Marketplace Fees</h3>
      <div class="button" style="text-align:center; margin-left:-50px">
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(1)">Clothing, Fashion, Fashion Accessories, Jewellery, Luggage, Shoes</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(4)">Health, Beauty, Personal Care and Personal Care Appliances</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(5)">Home, Decor, Home Improvement, Furniture, Outdoor, Lawn and Garden</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(2)">Electronics and Accessories</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(3)">Grocery, Food and Pet Supplies</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(6)">Kitchen, Large and Small Appliances</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(7)">Sports, Gym and Sporting Equipment</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(8)">Business, Industrial, Medical, Scientific Supplies and Office</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(9)">Books, Music, Movies, Video Games, Entertainment</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(10)">Baby Products, Toys and Education</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(11)">Automative, Car and Accessories</button>
        <button class="btn btn-outline-primary" style="border-radius:20px; margin:8px; width:400px" @click="expand(12)">Others</button>
      </div>
    <div class="category">
      <div v-if="this.show_product_category">
        <div class="grid-container">
          <div class="grid-item"><strong>Product category</strong></div>
          <div class="grid-item"><strong>MarketPlace Fees Percent</strong></div>
        </div>
        <div v-for="i in x" :key="i.value" class="grid-container">
          <div class="grid-item">{{i.text}}</div>
          <div class="grid-item">{{i.marketfee_percent}} %<svg v-if="user_loggedin" @click="edit_field(i)" class="edit" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="slategrey" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg></div>
          
          <div id="myModal" class="modal">
            <div class="modal-content" >
              <h3>Edit details</h3>    
              
              <p style="display:flex;">Text:
                <!-- <input type="textarea" v-model="modal.text"> -->
                {{modal.text}}
                <textarea class="form-control" v-model="modal.text"></textarea>
              </p>
              <p style="display:flex;">MarketPlace Fee Percent:
                <input type="text" v-model="modal.marketfee_percent">
              </p>
                <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="save_edit()">Save changes</button>
                <button type="button" class="btn btn-secondary" @click="close_modal()">Close</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>   
    <h3 style="margin-top:20px">Closing Fee Chart</h3>
    <p>Fixed Closing Fee as per Product Price Band</p>
    <div style="margin-left: 400px;">
      <div class="grid-container">
        <div class="grid-item"><strong>Product price brand</strong></div>
        <div class="grid-item" style="margin-left:-381px"><strong>Fixed closing fee(in INR)</strong></div>
      </div>
      <div v-for="i in this.closing_fees" :key="i.category" class="grid-container"> 
        <div class="grid-item">INR {{i.category}}</div>
        <div class="grid-item" style="margin-left:-381px">{{i.charges}}</div>
        <svg v-if="user_loggedin" @click="edit_closingfee(i)" class="edit" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="slategrey" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
      </div>
      <p style="margin-right:400px"><strong>NOTE: </strong>Closing Fee mentioned above is exclusive of GST</p>
      <div id="myModal" class="modal">
        <div class="modal-content" >
          <h3>Edit details</h3>    
          
          <p style="display:flex;">Category:
            <input type="text" class="updated_input" v-model="modal.category" disabled>
            <!-- {{modal.category}} -->
          </p>
          <p style="display:flex;">Charges:
            <input type="text" class="updated_input" v-model="modal.charges">
          </p>
          <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="save_closingfee_edit()">Save changes</button>
          <button type="button" class="btn btn-secondary" @click="close_modal()">Close</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="user_loggedin">
      <h3 style="margin-top:20px">Shipping Fee Chart</h3>
      <div class="grid-container-shipping">
        <div class="grid-item-shipping" style="margin-left:170px"><strong>Product weight(kg)</strong></div>
        <div class="grid-item-shipping" style=""><strong>Within city (INR)</strong></div>
        <div class="grid-item-shipping" style=""><strong>Within state (INR)</strong></div>
        <div class="grid-item-shipping" style=""><strong>Rest of India (INR)</strong></div>
        <div class="grid-item-shipping" style=""><strong>Metro to Metro (INR)</strong></div>
        <div class="grid-item-shipping" style=""><strong>Special Regions (INR)</strong></div>
      </div>
      <div v-for="i in this.arr" :key="i.weight" class="grid-container-shipping">
        <div class="grid-item-shipping" style="margin-left:170px">{{i.weight}}</div>
        <div class="grid-item-shipping" style="">{{i.city_price}}.00</div>
        <div class="grid-item-shipping" style="">{{i.state_price}}.00</div>
        <div class="grid-item-shipping" style="">{{i.rest_price}}.00</div>
        <div class="grid-item-shipping" style="">{{i.metro_price}}.00</div>
        <div class="grid-item-shipping" style="">{{i.special_price}}.00</div>
        <svg @click="edit_shippingfee(i)" style="position:absolute; right:100px" xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="slategrey" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon></svg>
      </div>
      <div id="Modal" class="modal">
        <div class="modal-content" >
          <h3>Edit Details</h3>    
          <p style="display:flex;">Weight:
            <input type="text" v-model="modal.data.weight">
          </p>
          <p style="display:flex;">Within city:
            <input type="text" v-model="modal.data.city_price">
          </p>
          <p style="display:flex;">Within state:
            <input type="text" v-model="modal.data.state_price">
          </p>
          <p style="display:flex;">Rest of India:
            <input type="text" v-model="modal.data.rest_price">
          </p>
          <p style="display:flex;">Metro to Metro:
            <input type="text" v-model="modal.data.metro_price">
          </p>
          <p style="display:flex;">Special regions:
            <input type="text" v-model="modal.data.special_price">
          </p>
          <div class="modal-footer">
          <button type="button" class="btn btn-primary" @click="save_shippingfee_edit()">Save changes</button>
          <button type="button" class="btn btn-secondary" @click="close_shipping_modal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import 'vue-search-select/dist/VueSearchSelect.css'
import { ModelSelect } from 'vue-search-select'
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import {auth, db} from '@/firebase/firebaseInit.js';
// import firebase from "firebase/app";

  export default {
  name: 'Home',
  components: {
    ModelSelect,
    VueSlickCarousel
  },
  data() {
    return {
      
      options: [],
      arr:[],
      item: {
        text:'',
        marketfee_percent:'',
        min_val:'',
        max_val:'',
      },
      modal:{
        text : '',
        marketfee_percent : '',
        data : '',
        category:'',
        charges:''
      },
      selling_price: "",
      closing_fee: "",
      closing_fees:[],
      errortext: "",
      show_shipping: true,
      show_with_shipping: false,
      show_fee:false,
      show_total:false,
      user_loggedin:false,
      show_product_category:false,
      weight:"",
      shipping_category:"",
      shipping_charges: "",
      arr_length:''
    }
  },
  computed: {
    total(){
      return parseFloat(parseFloat(this.market_fee) + parseFloat(this.closing_fees.charges) + parseFloat(this.shipping_charges)).toFixed(2)
    },
    gst_total(){
      return parseFloat(this.total*0.18).toFixed(2)
    },
    grand_total(){
      return parseFloat(parseFloat(this.total) + parseFloat(this.gst_total)).toFixed(2) 
    },
    profit(){
      return parseFloat(parseFloat(this.selling_price) - parseFloat(this.grand_total)).toFixed(2)
    },
    market_fee(){
      console.log(this.item.marketfee_percent/100)
      console.log(this.selling_price)
      return (this.item.marketfee_percent/100) * this.selling_price
    },
  },
  async created(){
    db.collection("options").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let tempdata = {}
          tempdata.value = doc.data().value
          tempdata.text = doc.data().text
          tempdata.marketfee_percent = doc.data().marketfee_percent
          tempdata.min_val = doc.data().min_val
          tempdata.max_val = doc.data().max_val
          tempdata.doc_id = doc.id
          this.options.push(tempdata)
          let tempoptions = this.options;
          tempoptions = tempoptions.sort((a,b) => {
            return a.value - b.value
          })
          this.options = tempoptions
        });
      });
    db.collection("closing_fee").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let temp_closingfee = {}
          temp_closingfee = doc.data()
          temp_closingfee.category = doc.data().category
          temp_closingfee.charges = doc.data().charges
          temp_closingfee.doc_id = doc.id
          this.closing_fees.push(temp_closingfee)
          let tempclosingfee = this.closing_fees;
          tempclosingfee = tempclosingfee.sort((a,b) => {
            return a.charges - b.charges
          })
          this.closing_fees = tempclosingfee
        });
    });

    db.collection("shipping_fee").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          let temp_shippingfee = {}
          temp_shippingfee = doc.data()
          temp_shippingfee.weight = doc.data().weight
          temp_shippingfee.city_price = doc.data().city_price
          temp_shippingfee.rest_price = doc.data().rest_price
          temp_shippingfee.metro_price = doc.data().metro_price
          temp_shippingfee.state_price = doc.data().state_price
          temp_shippingfee.special_price = doc.data().special_price
          temp_shippingfee.doc_id = doc.id  
          this.arr.push(temp_shippingfee)
          let temparr = this.arr;
          temparr = temparr.sort((a,b) => {
            return a.weight - b.weight
          })
          this.arr = temparr
        });
    });
    

    // user_loggedin(){
    const user = auth.currentUser;
    if (user) {
      this.user_loggedin = true
      console.log(this.user_loggedin)
    } 
    else {
      this.user_loggedin = false
      console.log(this.user_loggedin)

      // No user is signed in.
      } 
    // }

  },
  methods: {  
    logout(){
      this.$store.dispatch('logout')
    },

    edit_closingfee(data){
      var modal = document.getElementById("myModal");
      modal.style.display = "block"; 
      this.modal.data = data
      this.modal.category = data.category
      this.modal.charges = data.charges
    },

    save_closingfee_edit(){
      let data = this.modal.data
      db.collection("closing_fee").doc(data.doc_id).set({
        category : this.modal.category,
        charges : this.modal.charges,
      })
      let temp = this.closing_fees.find( ({ category }) => category ===  data.category);
      temp.category = this.modal.category
      temp.charges = this.modal.charges
      this.close_modal()
    },

    edit_field(data){
      this.modal.data = data
      this.modal.text = data.text
      this.modal.marketfee_percent = data.marketfee_percent
      var modal = document.getElementById("myModal");
      modal.style.display = "block"; 
    },

    save_edit(){
      console.log(this.modal.data)
      let data = this.modal.data
      db.collection("options").doc(data.doc_id).set({
        value : data.value,
        text : this.modal.text,
        marketfee_percent : this.modal.marketfee_percent,
        min_val : data.min_val,
        max_val : data.max_val
      })
      let temp = this.options.find( ({ value }) => value ===  data.value);
      console.log(temp) 
      temp.text = this.modal.text
      temp.marketfee_percent = this.modal.marketfee_percent
      console.log(temp)
      this.close_modal()
    },

    close_modal(){
      this.modal.text =null
      this.modal.marketfee_percent = null
      this.modal.data = null
      this.modal.category =null
      this.modal.charges = null
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      // console.log(this.modal)
    },
    
    add(){
      // var optionsRef = db.collection("options");
      // optionsRef.orderBy("value");
      // console.log(optionsRef)
      for(let i = 0; i<this.arr.length; i++){
        console.log(this.arr[i])
        db.collection('shipping_fee').add({
          weight: this.arr[i].weight,
          city_price: this.arr[i].city_price,
          metro_price: this.arr[i].metro_price,
          rest_price: this.arr[i].rest_price,
          special_price: this.arr[i].special_price,
          state_price: this.arr[i].state_price 
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
      }

    },
    //   db.collection("options").orderBy("value", "asc")
    // },

    back(){
      this.show_shipping = true
      this.show_total = false
    },

    indexOfClosest(nums, target) {
      nums.sort(function(a, b){
        return a.weight - b.weight
      });
      let closest = Number.MAX_SAFE_INTEGER;
      let index = 0;
      nums.forEach((num, i) => {
        let dist = Math.abs(target - num.weight);
        if (dist < closest) {
          index = i;
          closest = dist;
        }
      });
      
      if(nums[index].weight-target<0){
        this.arr_length = nums.length - 1
        index = index+1
        if(index>this.arr_length){
          index = index -1
        }
      }
      return index;
    },
    
    calculate_fee(val){
      if((val > this.item.min_val || this.item.min_val =='false') && (val <= this.item.max_val || this.item.max_val =='false') && val!= ''){
        this.errortext = ''
        this.show_fee = true
        let temp_selling_price = this.selling_price
        this.selling_price = ''
        // this.item.market_fee = (this.item.marketfee_percent/100) * temp_selling_price
        let closing_fee_category = null
        if(temp_selling_price > 0 && temp_selling_price <= 250){
          closing_fee_category = "0-250"
        }
        else if(temp_selling_price > 250 && temp_selling_price <= 500){
          closing_fee_category = "251-500"

        }
        else if(temp_selling_price > 500 && temp_selling_price <= 1000){
          closing_fee_category = "501-1000"
        }
        else if(temp_selling_price > 1000 && temp_selling_price <= 5000){
          closing_fee_category = "1001-5000"
        }
        else{
          closing_fee_category = "5001 and Above"
        }
        let temp = this.closing_fees.find( ({ category }) => category ===  closing_fee_category);
        this.closing_fees.charges = temp.charges
        console.log(this.closing_fees.charges)
        this.selling_price = temp_selling_price
      }
      else if(val == ''){
        this.errortext = "Please enter the selling price first"
      }
      else{
        this.errortext = "Price is too high/low for chosen category. Please choose the correct category for this price."
      }
    },
    with_shipping(){
      this.show_with_shipping = true
    },

    without_shipping(){
      this.show_with_shipping = false
      this.shipping_charges = 0
      this.show_shipping = false
      this.show_total = true
    },

    selected_category(val){
      this.shipping_category = val
    },

    submit(){
      let a = this.indexOfClosest(this.arr, this.weight)
      console.log(this.arr[a])
      this.shipping_charges = this.arr[a].city_price
      if(this.shipping_category == 'city'){
        this.shipping_charges = this.arr[a].city_price
      }

      else if(this.shipping_category == 'state'){
        this.shipping_charges = this.arr[a].state_price
      }

      else if(this.shipping_category == 'rest_of_india'){
        this.shipping_charges = this.arr[a].rest_price
      }

      else if(this.shipping_category == 'metro'){
        this.shipping_charges = this.arr[a].metro_price
      }
      
      else if(this.shipping_category == 'special'){
        this.shipping_charges = this.arr[a].special_price
      }

      this.show_shipping = false
      this.show_total = true
    },

    expand(val){
      if(val == 1){
          this.x = this.options.slice(0,26)
          this.show_product_category = !this.show_product_category 
        
      }
      else if(val == 2){
          this.x = this.options.slice(26,60)
          this.show_product_category = !this.show_product_category
        
      }
      else if(val == 3){
          this.x = this.options.slice(60,63)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 4){
          this.x = this.options.slice(63,76)
          this.show_product_category = !this.show_product_category
      }
      
      else if(val == 5){
          this.x = this.options.slice(76,100)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 6){
          this.x = this.options.slice(100,110)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 7){
          this.x = this.options.slice(110,118)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 8){
          this.x = this.options.slice(118,128)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 9){
          this.x = this.options.slice(128,147)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 10){
          this.x = this.options.slice(147,157)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 11){
          this.x = this.options.slice(157,163)
          this.show_product_category = !this.show_product_category
      }

      else if(val == 12){
          this.x = this.options.slice(163,171)
          this.show_product_category = !this.show_product_category
      }
    },
    
  }
}
</script>

<style>
.outer_container{
  width: 720px;
  background-color: bisque;;
  margin:auto;
  margin-bottom: 80px;
  top: 30px;
  position: relative;
  padding: 20px 10px 50px 20px;
  border-radius: 17px;
  box-shadow: 0 4px 8px 0 rgb(0 0 0 / 20%), 20px 19px 20px 0 rgb(0 0 0 / 19%);
}
#autosuggest__input{
  width: 370px;
  border:none;
  border-radius:5px; 
  height: 30px;
}

.first_button{
  padding: 5px 6px;
}

#third_button{
  margin-left: 6px;
}

.inner_container{
  align-items: stretch;
  align-content: flex-start;
  padding:5px;
}

hr.new1 {
  border-top: 2px solid rgb(0, 0, 0);
  margin-top: 0px;
}

.newP{
  font-size: small;
}

.newP2{
  padding-top: 10px;
}

#input_field{
  margin-left: 8px;
}

.shipping{
  font-size: 12px;
  position: absolute;
  left:40px;
  font-weight: 600;
  color: grey;
}

/* .slick-next{

  background-color: aqua;
} */

button.slick-next {
      background-color: red !important;
      margin-right: -100px;
}

button.slick-arrow.slick-prev {
  margin-left: -100px;  
      background-color: red !important;
}

.slick-track{
  width: 3500px;
  height: 200px;
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  /* margin-left: 400px; */
}

.grid-container-shipping{
  display: grid;
  grid-template-columns: auto auto auto auto auto auto ;
}

.grid-item-shipping {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 05px;
  font-size: 15px;
  text-align: center;
  width:200px; 
  margin-left:-155px
}

.grid-item {
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 05px;
  font-size: 15px;
  text-align: center;
  width:359px;
}

.category{
  /* background-color: cornflowerblue; */
  display: flex;
  text-align: left;
  margin-left: 400px;
  width: 47.3%;
  font-size: 20px;
}

.expand{
  position:absolute; 
  right:410px; 
  padding-top:5px
}

/* .btn-primary{
  width:400px;
  height: 70px;
  margin-bottom:10px;
  margin-right: 20px;
} */

svg:hover {
  cursor: pointer;
  color: red;
}

.modal{
    position: fixed;
    z-index: 1; 
    width: 100%;
    height: 100%; 
    overflow-y:scroll; 
    background-color: rgb(0,0,0); 
    background-color: rgba(0, 0, 0, 0.2);
  }

  .modal-content {
    background-color: #fefefe;
    margin: 10% auto; 
    padding: 20px;
    overflow-y:auto; 
    max-width: 50%; 
  }

.edit{
    position: absolute;
    right:350px;
  }
</style>
