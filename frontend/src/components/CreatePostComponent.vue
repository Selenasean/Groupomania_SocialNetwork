<template>    
    <div class="card-add">
        <form @submit.prevent="createPost()" enctype="multipart/form-data">
            <div class="form-group form-group__img">
                <div id="choose-file">
                    <input ref="inputValue" @change="catchImg" type="file" accept="image/*" hidden="hidden" >
                    <button type="button" id="custom-btn" @click="chooseFile()">
                        <i class="fa-solid fa-image"></i>
                        Choisir un fichier
                    </button>
                    <span id="custom-text">{{ imageNameDisplay }}</span>
                </div>
                <div id="img">    
                    <img id="img-display" :src="imageURLToPreview" :alt="imageURLToPreview">
                </div>
            </div>
            <div class="form-group">
                <label for="legend">Ajouter une légende :</label>
                <textarea v-model="legend" class="form-control__textarea" id="legend" rows="5" formControlName="legend"></textarea>
            </div>
            <button class="btn-createpost" :="{'disabled' : !filledField}" :class="{'btn-createpost__disabled' : !filledField}">
                <i class="fa-solid fa-paper-plane"></i>
                Publier
            </button>
        </form>
    </div>
</template>

<script>

export default{
    name :'CreatePostComponent',
    data () {
        return {
            legend :'',
            imageURLToPreview:'',
            image: '',
            imageNameDisplay :'Aucun fichier choisi',
        }
    },
    computed : {
        /**
         * @function filledField check if input are empty or not to validate btn create-post
         */
        filledField(){
            if(this.legend == ''){
                return false
            }else{
                return true
            }
        }
    },
    methods : {
        /**
         * @function chooseFile make that the btn clicked = clicked on choose file's input, to select a file
         */
        chooseFile(){
            this.$refs.inputValue.click()
        },
        /**
         * @function catchImg get img to display on screen before publish
         * @param {*} event : the event listened after choosing the file
         */
        catchImg(event){
            const file = event.target.files[0] //the exact file containing the img
            this.image = file // stock in data image 
            this.imageNameDisplay = file.name
            this.imageURLToPreview = URL.createObjectURL(file) // in URL to diplay
        },
        /**
         * @function createPost create the post by sending en POST request
         */
        createPost(){       
            // if this.image is not empty- contains something        
            if(this.image != ''){
                // get userId, first and last name from the localStorage
                let getUserInfos = JSON.parse(localStorage.getItem("user"))
                const userIdSend = getUserInfos.userId 
                const userFirstName = getUserInfos.firstName
                const userLastName = getUserInfos.lastName

                // create a formData object with all the info inside, to send 
                let formData = new FormData();
                formData.append('userId', userIdSend)
                formData.append('firstName', userFirstName)
                formData.append('lastName', userLastName)
                formData.append('legend', this.legend)
                formData.append('image', this.image) // using 'image' instead of 'imageUrl' so multer can find the file
                formData.append('likes', 0)
                formData.append('usersLiked', [])

                // POST request
                this.axios.post('/post/',formData)
                    .then((res) => {
                        this.$emit('postCreated')// event postCreated to listened in home view
                        return res
                    })
                    .catch((err)=>{
                        console.log(err)
                    })                    
            }
            //if this.image is empty -- the user create a post with only text in it
            if(this.image == ''){
            
                this.image == null // make this.image = null

                // get userId, first and last name from the localStorage
                let getUserInfos = JSON.parse(localStorage.getItem("user"))
                const userIdSend = getUserInfos.userId 
                const userFirstName = getUserInfos.firstName
                const userLastName = getUserInfos.lastName

                // create a formData object which contains all the infos to send 
                let formData = new FormData();
                formData.append('userId', userIdSend)
                formData.append('firstName', userFirstName)
                formData.append('lastName', userLastName)
                formData.append('legend', this.legend)
                formData.append('image', this.image) // using 'image' instead of 'imageUrl' so multer can find the file
                formData.append('likes', 0)
                formData.append('usersLiked', [])

                // request POST
                this.axios.post('/post/',formData)
                    .then((res) => {                       
                        this.postCreated == true
                        this.$emit('postCreated') // event postCreated to listened in home view
                        return res
                    })
                    .catch((err)=>{
                        console.log(err)
                    })  
            }
        }
    }
}
</script>

<style lang="scss">
.card-add {
    margin-top: 60px;
    display:flex;
    flex-direction: column;
    width :60%;
    @media screen and (max-width :500px) {
        width : 90%
    }
    &__msgcreated {
        margin-top: 150px;
        margin-bottom:150px;
        text-align: center;
        font-size: 25px;
    }
}
.form-group {
    display:flex;
    flex-direction: row;
    align-items: baseline;
    margin-bottom: 40px;
    justify-content: flex-start;
    &__img{
        @media screen and (max-width:500px){
            flex-direction: column;
        }
    }
}
#choose-file{
    display:flex;
    flex-direction: column;
    margin-right :20px;
}
.form-control {
    border: none;
    border-bottom: solid 1px black;
    width: 70%;
    &__textarea {
        width :60%;
        margin-left :10px;
    }
    &__title {
        margin-left : 15px;
    }
}
input{
    outline: none;
}
.btn-createpost{
    align-self: center;
    width :200px;
    height : 40px;
    border:none;
    background-color:#FFD7D7;
    border-radius :30px;
    font-size : 18px;
    font-weight: 700;
    &:hover{
        cursor: pointer;
        background-color: darken(#FFD7D7,8%);
    }
    &__disabled:hover {
        background-color: #FFD7D7;
    }
}
#custom-btn{
    background-color: #FFD7D7;
    border:none;
    border-radius: 10px;
    width : 155px;
    height: 30px;
    text-align:center;
    font-size: 15px;
    margin-right :10px;
    & i{
        font-size:20px;
        margin-right:2px;

    }
    &:hover{
        cursor:pointer;
        background-color: darken(#FFD7D7, 8%);
    }
}
#custom-text{
    font-size:13px;
    margin-top : 8px;
    padding-left : 8px;
}
#img{
   display: block
}
#img-display{
    max-height: 150px; 
    margin-top:10px;
}

</style>