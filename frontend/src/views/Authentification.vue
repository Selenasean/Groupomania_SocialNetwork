<template>

    <div class="authentification">
        <div class="authentification__msg-wlc">
            <p class="authentification__msg-wlc__text">
                Bienvenue sur notre Network d'entreprise <span>&#128075;</span>
            </p>
        </div>
        <div class="button-auth">
            <button class="button-auth__auth" @click="show('signup')" :class="{'focus': mode == 'signup'}">S'inscrire</button>           
            <button class="button-auth__auth" @click="show('login')" :class="{'focus': mode == 'login'}">Se connecter</button>
        </div>
        <div class="auth-card">
            <SignUp class="card-log" @signup="switchTab" v-if="mode == 'signup'"></SignUp>
            <LogIn class="card-log" :email="email" v-if="mode == 'login'"></LogIn>
        </div>
    </div>

</template>

<script>
import SignUp from '@/components/SignUpComponent.vue';
import LogIn from '@/components/LogInComponent.vue';

export default {
    name :'Authentification', 
    components : {SignUp, LogIn},
    data : function() {
        return { 
            mode : 'login',
            email :'',
        }
    },
    methods : {
        show(params){
            if(params == 'login'){
                this.mode = 'login'
            }else {
                this.mode = 'signup'
            }
        },
        switchTab(email){
            if(this.mode =='signup'){
                this.mode = 'login'
                this.email = email
            }
            
        }
    }
}
</script>

<style lang="scss">
.authentification {
    display:flex;
    flex-direction: column;
    &__msg-wlc {
        display : flex;
        justify-content: center;
        margin-bottom: 20px;
        font-size: 20px;
    }
}
.button-auth{
    display :flex;
    flex-direction: row;
    gap: 60px;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    &__auth {
        border:none;
        border-radius: 10px;
        background-color: #FFD7D7;
        width : 20%;
        height: 40px;
        font-weight : 700;
        font-size: 15px;
        &:hover {
            cursor: pointer;
            transform : scale(1.10);
            background: darken(#FFD7D7, 8%);
        }
    }
}
.focus {
     background: darken(#FFD7D7, 8%);
}
.auth-card {
    display:flex;
    justify-content: center;
    align-items: center;
    margin-bottom : 40px;
}

</style>