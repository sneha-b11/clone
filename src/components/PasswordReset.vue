<template>
    <div class="password">
      <h3 style="color:navy">Reset Password</h3>
      <button class="btn" style="position: absolute ; padding: 10px; top:5px; right:550px"  @click="close" >x</button>
      <form @submit.prevent>
        <div v-if="!success">
          <p>Enter your email id to reset your password</p>
          <input type="text" v-model="email" placeholder="abc@gmail.com">
          <p class="text-danger" v-if="errorMsg!==''">{{errorMsg}}</p>
          <button class="btn" @click="resetPassword" type="submit">Reset</button>
        </div>
        <div v-else>
          <p>Success!! Password reset link has been sent to your mail</p>
        </div>
      </form>
    </div>
</template>

<script>
import {auth} from '@/firebase/firebaseInit.js'
export default {
    name: 'passwordReset',
    data() {
      return{
        email:'',
        success:false,
        errorMsg:''
      }
    },
    methods : {
        close(){
          this.$router.push({name:'Login'})
        },
        async resetPassword(){
          console.log(this.email)
          this.errorMsg = ''
          try{
            await auth.sendPasswordResetEmail(this.email)
            this.success = true
          }
          catch(err){
            this.errorMsg = err.message
          }
        }
    }
}
</script>

<style >
.password{
  background-color: lavenderblush;
  border: 2px black solid;
  border-radius: 10px;
  margin: auto;
  max-width: 500px;
  min-height: 300px;
  justify-content:center;
  padding: 60px;
}

.btn:hover{
  background-color: cyan;
}
</style>
