<template>
  <div id="myModal" class="modal" v-if="modal.show">
            <div class="modal-content" >
              <h3>Edit details</h3>    
              
              <p style="display:flex;">Text:
                <input type="text" class="updated_input" v-model="modal.text">
              </p>
              <p style="display:flex;">MarketPlace Fee Percent:
                <input type="text" class="updated_input" v-model="modal.mamma">
              </p>
              <!-- <p style="display:flex;">Space Available:
                <input type="text" class="updated_input" v-model="options[0].space_available">
              </p>
              <p style="display:flex;">Code:
                <input type="text" class="updated_input" v-model="options[0].code">
              </p>
              <p style="display:flex;">Type:
                <input type="text" class="updated_input" v-model="options[0].type">
              </p>
              <p style="display:flex;">Registered:
                <input type="text" class="updated_input" v-model="options[0].is_registered">
              </p>
              <p style="display:flex;">Live:
                <input type="text" class="updated_input" v-model="options[0].is_live">
              </p> -->
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="save_changes">Save changes</button>
                <button type="button" class="btn btn-secondary" @click="close_modal()">Close</button>
              </div>
            </div>
          </div>
</template>

<script>
export default {
    data(){
        return{
            modal:{
                text = null,
                market = null,
                show = false,
                data = null,
            }
        }
    }
    methods:{
        edit_field(data){
            this.modal.data = data
            this.modal.text = data.Text
            this.modal.marketfee_percent = data.model_marketfee_percent
            this.modal.show = true
            var modal = document.getElementById("myModal");
          modal.style.display = "block"; 
        }
        save_edit(){
            let data = this.modal.data
            db.collection("options").doc(data.doc_id).set({
                value = data.value
                text = this.modal.text
                marketfee_percent = this.modal.marketfee_percent
                min_val = data.min_val
                max_val = data.max_val
            })
            this.close_modal()
        }
        close_modal(){
            this.modal.text =null
            this.modal.market = null
            this.modal.show = false
            this.modal.data = null
            var modal = document.getElementById("myModal");
      modal.style.display = "none";
        }
    }

}
</script>

<style>

</style>