<template>
    <form class="card" @submit.prevent="createAccount()">
        <h1 class="card__title" > Inscription </h1>
        <div class="form-row__name">
            <div class="name">
                <label class="name__label-name" for="firstName">Prénom :</label>
                <input @change="checkFirstName()" v-model="firstName" name="firstName" class="form-row__input-name" type="text" placeholder="Prénom" required/>
                <p class="msgError__name" v-if="showErrorFistname == true">Saisie incorrecte</p>
            </div>
            <div class="name">
                <label class="name__label-name" for="lastName">Nom :</label>
                <input @change="checkLastName()" v-model="lastName" name="lastName" class="form-row__input-name" type="text" placeholder="Nom" required/>
                <p class="msgError__name" v-if="showErrorLastName == true">Saisie incorrecte</p>
            </div>
        </div>
        <div class="form-row">
            <label class="name__label" for="email">Adresse email :</label>
            <input @change="checkEmail()" v-model="email" name="email" class="form-row__input" type="text" placeholder="Adresse Email" required/>
            <p class="msgError" v-if="showErrorEmail == true">Email incorrect</p>
        </div>
        <div class="form-row">
            <label class="name__label" for="password">Mot de passe :</label>
            <input @change="checkPassword()" v-model="password" name="password" class="form-row__input" type="password" placeholder="Mot de passe" required/>
            <p class="msgError" v-if="showErrorPassword == true">Mot de passe incorrect</p>
        </div>
        <div class="form-row__btn">
            <button class="button" :="{'disabled': !validatedFields}" :class="{'button--disabled' : !validatedFields}">Créer un compte</button>
            <p class="msgError__btn" v-if="showErrorCreateAccount == true">Utilisateur déja existant</p>
        </div>    
    </form>
</template>

<script>

export default {
    name : 'SignUpComponent',
    data () { 
        return {
                firstName :'',
                lastName : '',
                email : '',
                password : '',
                showErrorFistname: '',
                showErrorLastName:'',
                showErrorEmail: '',
                showErrorPassword : '',
                showErrorCreateAccount :'',

            }
    },
    computed : {
        /**
         * @function validatedFields to check if inputs are empty or not to disabled subscribe button
         */
        validatedFields(){
            if(this.firstName == "" && this.lastName == "" && this.email =="" & this.password ==""){
                return false
            }else{
                return true
            }
        },
     
    },
    methods : {
        /**
        * @function checkFirstName to check if first name's input is correctfully completed
        */
        checkFirstName(){
            const nameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]+$");
            let check = nameRegExp.test(this.firstName);
        if(!check){
            this.showErrorFistname = true
            return false
        }else {
            this.showErrorFistname = false
            return true
        }
        },
        /**
        * @function checkLastName to check if last name's input is correctfully completed
        */
        checkLastName(){
        const nameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]+$");
        let check = nameRegExp.test(this.lastName);
        if(!check){
            this.showErrorLastName = true
            return false
        }else {
            this.showErrorLastName = false
            return true
        }
        },
        /**
        * @function checkEmail to check if email's input is correctfully completed
        */       
        checkEmail(){
        const nameRegExp = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
        let check = nameRegExp.test(this.email);
        if(!check){
            this.showErrorEmail = true
            return false
        }else {
            this.showErrorEmail = false
            return true
        }
        },
        /**
        * @function checkPassword to check if password's input is correctfully completed
        */  
        checkPassword(){
        const nameRegExp = new RegExp("^[a-zA-ZÀ-ÿ ,.'-]+$");
        let check = nameRegExp.test(this.password);
        if(!check){
            this.showErrorPassword = true
            return false
        }else {
            this.showErrorPassword = false
            return true
        }
        },
        /**
         * @function createAccount to send a POST request to save user in database
         */
        createAccount(){
            //if all inputs are correct, send the request
            if(this.checkEmail || this.checkPassword || this.checkFirstName || this.checkLastName){
                this.axios.post('/auth/signup', {
                    firstName : this.firstName,
                    lastName : this.lastName,
                    email : this.email,
                    password : this.password,
                })
                    .then((res) => {
                        this.$emit('signup', this.email) // send this.email in listening function signup on authentification view
                        return res
                    })
                    .catch((error) => {
                        console.log(error);
                        this.firstName="";
                        this.lastName="";
                        this.email= "";
                        this.password="";
                        this.showErrorCreateAccount = true;
                    });
            }else{
                console.log("error form")
            }
        }
    }

}
</script>


<style lang="scss">
.card {
    display : flex;
    flex-direction: column;
    background-color:white;
    box-shadow: 0 0 5px rgb(180, 178, 178);
    width : 50%;
    max-height: 100%;
    border-radius: 20px;
    @media screen and (max-width: 500px){
       width :90%;
    }
    &__title{
       display: flex;
       justify-content: center;
       margin-bottom : 20px;
       @media screen and (max-width: 500px){
        font-size : 22px;
       }
    }
}
.form-row{
    display: flex;
    align-items: center;
    flex-direction: column;
    width:100%;
    &__name {
        display: flex;
        flex-direction: row;
    }
    &__btn {
        width:100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    &__input{
        background-color: rgb(199, 195, 195);
        width: 90%;
        height: 25px;
        border:none;
        border-radius: 8px;
        margin: 5px 15px;

        &::placeholder {
            padding-left: 5px;
        }    
    }
    &__input-name {
        background-color: rgb(199, 195, 195);
        height: 25px;
        border:none;
        border-radius: 8px;
        width: 80%;
    }
}
.name {
    width :60%;
    display: flex;
    flex-direction: column;
    align-items: center;

    &__label {
        margin-top:8px;
        font-size : 15px;
        display :flex;
        align-self: start;
        margin-left : 5%;
    }
    &__label-name {
        display :flex;
        align-self: start;
        margin-left: 10%;
        font-size:15px;
    }
}
input {
    outline: none;
}

.button {
    width: 80%;
    height: 40px;
    background-color:#FFD7D7;
    border :none;
    border-radius: 8px;
    margin: 15px 10px;
    font-weight: 700;
    font-size:medium;
    &:hover {
            cursor: pointer;
            background: darken(#FFD7D7, 8%);

    }
}
.button--disabled:hover{
    background-color: #FFD7D7;
}
.msgError {
    margin: 0;
    font-size : 12px;
    color:red;
    align-self: start;
    margin-left: 5%;
    &__name {
        margin: 0;
        font-size : 12px;
        color:red;
        align-self: start;
        margin-left:10%
    }
    &__btn{
        color:red;
        margin:0;
        align-self: center;
        margin-bottom : 8px;
        font-size : 12px;
    }
}

</style>