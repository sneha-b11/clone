<template>
  <div>
    
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
  </div>
</template>

<script>

import 'vue-search-select/dist/VueSearchSelect.css'
import { ModelSelect } from 'vue-search-select'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'
import {auth, db} from '@/firebase/firebaseInit.js';
// import firebase from "firebase/app";

  export default {
  name: 'Home',
  components: {
    ModelSelect,
   },
  data() {
    return {
      showshippingtable:false,
      options: [],
      arr: [],
      shipping_table1:[],
      shipping_table2:[],
      shipping_table3:[],
      shipping_table4:[],
      shipping_table5:[],
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
      // PartOne:[],
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
          // console.log(temp_shippingfee.weight)
          temp_shippingfee.doc_id = doc.id
          this.arr.push(temp_shippingfee)
          let temp = this.arr
          temp = temp.sort((a,b) => {
            return a.weight - b.weight
          })
          this.arr = temp
        });
    });

    db.collection("public_shippingfee").doc('JKFWUeAhMaMe7Sz29Jrq').get().then((doc) => {
      let temp_public_shippingfee = {}
      temp_public_shippingfee = doc.data()
      temp_public_shippingfee.doc_id = doc.id
      this.shipping_table1 = (temp_public_shippingfee)
      console.log(this.shipping_table1)
    });

    db.collection("public_shippingfee").doc('sPZctrs9YL1ayupWJiqM').get().then((doc) => {
      let temp_public_shippingfee = {}
      temp_public_shippingfee = doc.data()
      temp_public_shippingfee.doc_id = doc.id
      this.shipping_table2 = (temp_public_shippingfee)
      console.log(this.shipping_table2)
    });

    db.collection("public_shippingfee").doc('bAe1mjzLRR6eQMMfOXET').get().then((doc) => {
      let temp_public_shippingfee = {}
      temp_public_shippingfee = doc.data()
      temp_public_shippingfee.doc_id = doc.id
      this.shipping_table3 = (temp_public_shippingfee)
      console.log(this.shipping_table3)
    });
    
    db.collection("public_shippingfee").doc('NgzIQoUXhHMwxx5JeG1r').get().then((doc) => {
      let temp_public_shippingfee = {}
      temp_public_shippingfee = doc.data()
      temp_public_shippingfee.doc_id = doc.id
      this.shipping_table4 = (temp_public_shippingfee)
      console.log(this.shipping_table3)
    });

    db.collection("public_shippingfee").doc('M9R3ljeITyDzwnxGv6qe').get().then((doc) => {
      let temp_public_shippingfee = {}
      temp_public_shippingfee = doc.data()
      temp_public_shippingfee.doc_id = doc.id
      this.shipping_table5 = (temp_public_shippingfee)
      console.log(this.shipping_table3)
    });


    // user_status(){
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
    show(){
      this.showshippingtable = !this.showshippingtable
    },
    logout(){
      this.$store.dispatch('logout')
    },

    edit_shippingtable5_PartOne(data, doc_id, index){
      var modal = document.getElementById("shippingtable5_modal1");
      modal.style.display = "block"; 
      this.modal = data
      this.modal.doc_id = doc_id
      this.modal.index = index
      console.log(this.modal)
    },

    save_shippingtable5_PartOne(){
      let data = this.modal
      console.log(data)
      console.log(db.collection("public_shippingfee"))
      let temp_id = "PartOne." + data.index 
      db.collection("public_shippingfee").doc(data.doc_id).update({
        [`${temp_id}`] : {
          Region : this.modal.Region,
          north : this.modal.north,
          west : this.modal.west,
          south : this.modal.south,
          central : this.modal.central,
          east : this.modal.east,
          jandk : this.modal.jandk,
          kerala : this.modal.kerala,
          guwahati : this.modal.guwahati,
          rest : this.modal.rest,
        }
      })
      this.close_shippingtable5_PartOne()
    },

    close_shippingtable5_PartOne(){
      this.modal = null
      var modal = document.getElementById("shippingtable5_modal1");
      modal.style.display = "none";
    },

    edit_shippingtable3_PartOne(data, doc_id, index){
      var modal = document.getElementById("shippingtable3_modal1");
      modal.style.display = "block"; 
      this.modal = data
      this.modal.doc_id = doc_id
      this.modal.index = index
      console.log(this.modal)
    },

    save_shippingtable3_PartOne(){
      let data = this.modal
      console.log(data)
      console.log(db.collection("public_shippingfee"))
      let temp_id = "PartOne." + data.index 
      db.collection("public_shippingfee").doc(data.doc_id).update({
        [`${temp_id}`] : {
          Region : this.modal.Region,
          base_cost : this.modal.base_cost,
          excess_cost : this.modal.excess_cost,
          base_weight : this.modal.base_weight,
          excess_weight : this.modal.excess_weight,
        }
      })
      this.close_shippingtable3_PartOne()
    },

    close_shippingtable3_PartOne(){
      this.modal = null
      var modal = document.getElementById("shippingtable3_modal1");
      modal.style.display = "none";
    },

    edit_shippingtable2_PartOne(data, doc_id, index){
      var modal = document.getElementById("shippingtable2_modal1");
      modal.style.display = "block"; 
      this.modal = data
      this.modal.doc_id = doc_id
      this.modal.index = index
      console.log(this.modal)
    },

    save_shippingtable2_PartOne(){
      let data = this.modal
      console.log(data)
      console.log(db.collection("public_shippingfee"))
      let temp_id = "PartOne." + data.index 
      db.collection("public_shippingfee").doc(data.doc_id).update({
        [`${temp_id}`] : {
          Zone : this.modal.Zone,
          Region : this.modal.Region,
          first500 : this.modal.first500,
          excess500 : this.modal.excess500,
        }
      })
      this.close_shippingtable2_PartOne()
    },

    close_shippingtable2_PartOne(){
      this.modal = null
      var modal = document.getElementById("shippingtable2_modal1");
      modal.style.display = "none";
    },

    edit_shippingtable1_PartTwo(data, doc_id, index){
      var modal = document.getElementById("shippingtable1_modal2");
      modal.style.display = "block"; 
      this.modal = data
      this.modal.doc_id = doc_id
      this.modal.index = index
      console.log(this.modal)
    },

    save_shippingtable1_PartTwo(){
      let data = this.modal
      console.log(data)
      console.log(db.collection("public_shippingfee"))
      let temp_id = "PartTwo." + data.index 
      db.collection("public_shippingfee").doc(data.doc_id).update({
        [`${temp_id}`] : {
          head : this.modal.head,
          value : this.modal.value
        }
      })
      this.close_shippingtable1_PartTwo()
    },

    close_shippingtable1_PartTwo(){
      this.modal = null
      var modal = document.getElementById("shippingtable1_modal2");
      modal.style.display = "none";
    },


    edit_shippingtable1_PartOne(data, doc_id, index){
      var modal = document.getElementById("shippingtable1_modal1");
      modal.style.display = "block"; 
      this.modal = data
      this.modal.doc_id = doc_id
      this.modal.index = index
      console.log(this.modal)
    },

    save_shippingtable1_PartOne(){
      let data = this.modal
      console.log(data)
      console.log(db.collection("public_shippingfee"))
      let temp_id = "PartOne." + data.index 
      db.collection("public_shippingfee").doc(data.doc_id).update({
        [`${temp_id}`] : {
          Zone : this.modal.Zone,
          Region : this.modal.Region,
          air_first500 : this.modal.air_first500,
          air_excess500 : this.modal.air_excess500,
          ExpressTAT : this.modal.ExpressTAT,
          surface_first500 : this.modal.surface_first500,
          surface_excess500 : this.modal.surface_excess500,
          EconomyTAT : this.modal.EconomyTAT
        }
      })
      this.close_shippingtable1_PartOne()
    },

    close_shippingtable1_PartOne(){
      this.modal = null
      var modal = document.getElementById("shippingtable1_modal1");
      modal.style.display = "none";
    },

    edit_shippingfee(data){
      var modal = document.getElementById("shippingfee_modal");
      modal.style.display = "block"; 
      this.modal = data
      console.log(this.modal)
    },

    save_shippingfee(){
      let data = this.modal
      db.collection("shipping_fee").doc(data.doc_id).set({
        weight : this.modal.weight,
        city_price : this.modal.city_price,
        state_price : this.modal.state_price,
        rest_price : this.modal.rest_price,
        metro_price : this.modal.metro_price,
        special_price : this.modal.special_price
      })
      let temp = this.arr.find( ({ weight }) => weight ===  data.weight);
      console.log(temp)
      this.close_shippingfee_modal()
    },

    close_shippingfee_modal(){
      this.modal = null
      var modal = document.getElementById("shippingfee_modal");
      modal.style.display = "none";
    },

    edit_closingfee(data){
      var modal = document.getElementById("closingfee_modal");
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
      this.close_closingfee_modal()
    },

    close_closingfee_modal(){
      this.modal.category =null
      this.modal.charges = null
      var modal = document.getElementById("closingfee_modal");
      modal.style.display = "none";
    },

    edit_field(data){
      this.modal.data = data
      console.log(data)
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
      var modal = document.getElementById("myModal");
      modal.style.display = "none";
      // console.log(this.modal)
    },
    
    add(){
      var optionsRef = db.collection("options");
      optionsRef.orderBy("value");
      console.log(optionsRef)
    },

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
  background-color: bisque;
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

.grid-container-shipping{
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
}

.grid-item-shipping{
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.8);
  padding: 05px;
  font-size: 15px;
  text-align: center;
  width:200px;
  margin-left:-169px
}

.grid-container {
  display: grid;
  grid-template-columns: auto auto;
  /* margin-left: 400px; */
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
  display: flex;
  text-align: left;
  margin-left: 400px;
  width: 47.3%;
}

.expand{
  position:absolute; 
  right:410px; 
  padding-top:5px
}

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
    right:360px;
  }

.edit_shipping{
  position: absolute;
  right:120px
}
</style>
