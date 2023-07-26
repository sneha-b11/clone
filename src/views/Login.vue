<template>
<div class="login" >
    <form v-if="showLogin" @submit.prevent>
        <h3 style="color:navy;">Login</h3>
        <br>
        <p style="text-align:center">Email
            <input type="text" placeholder="you@email.com" v-model="email" style="margin-left:30px">
        </p>
        <p style="text-align:center">Password
            <input type="password" placeholder="********" v-model="password">
        </p>
        <div>
            <button class="btn" @click="login" type="submit">Login</button>
            <p v-if="this.errorText" class="text-danger">{{errorText}}</p>
        </div>
        <div>
            <button class="btn" @click="forgotPassword" type="submit">Forgot Password</button>
        </div>
        <button class="btn" @click="newAccount">Create New Account</button>

    </form>
    <form v-else @submit.prevent>
        <h3 style="color:navy;">SignUp</h3>
        <br>
        <p style="text-align:center">Name
            <input type="text" placeholder="abc" v-model="name" style="margin-left:50px">
        </p>
        <p style="text-align:center">Date of Birth
            <input type="text" placeholder="dd/mm/yyyy" v-model="dob">
        </p>
        <p style="text-align:center">Email
            <input type="text" placeholder="you@email.com" v-model="email" style="margin-left:50px">
        </p>
        <p style="text-align:center">Password
            <input type="password" placeholder="******" v-model="password" style="margin-left:20px">
        </p>
        <div>
            <button class="btn" @click="signUp" type="submit">Sign In</button>
            <p v-if="this.errorText"  class="text-danger">{{errorText}}</p>
        </div>
        <p>
            <button class="btn" @click="backToLogin" type="submit">Back to Login</button>
        </p>
        <!-- <div>
            <button class="btn" @click="forgotPassword" type="submit">Forgot Password</button>
        </div> -->
    </form>
    <passwordReset v-if="showPasswordReset"/>
        

</div>
</template>

<script>

import passwordReset from '../components/PasswordReset.vue'
export default {
    name:'login',
    components: {
        passwordReset
    },
    data() {
        return{
            // loginForm:{
            //     email : '',
            //     password : ''
            // },
            // signUpForm:{
            //     email: '',
            //     password: '',
            //     name: '',
            //     title : ''
            // },
           
            email: '',
            password: '',
            name: '',
            dob : '',

            errorText : null,
            showLogin : true,
            showPasswordReset : false
        }
    },
    
    methods: {
        login(){
            if(this.email)
                this.$store.dispatch('login',{
                    email : this.email,
                    password : this.password,
                })
                // this.$router.push('Home')
            else
                this.errorText = "Please enter email first!!"
        },

        signUp(){
            if(this.email)
                this.$store.dispatch('signUp',{
                    email : this.email,
                    password : this.password,
                    name:this.name,
                    dob:this.dob,
                })
            else
                this.errorText = "Please fill all the details properly!!"
        },

        newAccount(){
            this.errorText = null
            this.showLogin = false
        },

        backToLogin(){
            this.showLogin = true
        },

        forgotPassword(){
            this.showPasswordReset = true
            this.$router.push({name:'passwordReset'})
        }

        // forgotPassword(){
        //     if(this.email)
        //         this.$router.push({name:'dashboard'})
        //     else
        //         this.errorText = "forgot password"
        // },
        // newAccount(){
        //     if(this.email)
        //         this.$router.push({name:'dashboard'})
        //     else
        //         this.errorText = "new account"
        // }
    }
}
</script>

<style >

.login{
    background-color: lavenderblush;
    padding: 25px;
    margin: auto;
    max-width: 500px;
    border: 2px solid black;
    border-radius: 10px;
    display: flex;
    justify-content: center;
}

</style>

