<template>   
    <div class="card-edit">
        <div>
            <i class="fa-solid fa-circle-left card-edit__backToHome" title="Accueil" @click="backToHome()"></i>
        </div>
        <form @submit.prevent="modifyPost" enctype="multipart/form-data">
            <div class="form-group-edit__first">
                <div id="img-edit" v-if="imageURLToPreviewEdit !=''">    
                    <img id="img-edit-display" :src="imageURLToPreviewEdit">
                </div>
                <div class="card-edit__choose-file">
                    <input ref="inputValue" @change="catchImg" type="file" accept="image/*" hidden="hidden" >
                    <button type="button" class="card-edit__custom-btn" @click="chooseFile()">
                        <i class="fa-solid fa-image"></i>
                        Choisir un fichier
                    </button>
                    <span class="card-edit__custom-text">{{ imageNameDisplay }}</span>
                    <div class="card-edit__noMoreImg" @click="cancelSelectedImg">
                        <i  class="fa-solid fa-ban"></i>
                    </div>
                </div>
            </div>
            <div class="form-group-edit">
                <label for="legend">Ajouter une légende :</label>
                <textarea v-model="legendEdit" class="form-group-edit__legend" rows="5" formControlName="legend"></textarea>
            </div>
            <button class="btn-editpost" >
                <i class="fa-solid fa-pencil"></i>
                Modifer
            </button>
        </form>
    </div>
</template>

<script>

export default{
    name :'EditPost',
    data () {
        return {
            imageNameDisplay: 'Aucun fichier choisi',
            legendEdit :'',
            imageURLToPreviewEdit:'',
            imageEdit:'',
        }
    },
    methods : {
        // get only one post to display content's post to modify
        getOnePost(){
            const idPost = this.$route.params.id // get post's id by the url of the route
            this.axios.get(`/post/${idPost}`)
                .then((res) => {
                    console.log(res)
                    this.legendEdit = res.data.legend
                    if(!res.data.imageUrl){
                    this.imageURLToPreviewEdit =''
                    console.log(this.imageURLToPreviewEdit)
                    } else {
                    this.imageURLToPreviewEdit = res.data.imageUrl
                    console.log(this.imageURLToPreviewEdit)
                    }
                })
                .catch((error)=>{
                    console.log(error)
                })
        },
        // when click on btn custom-btn it clicks on the choice's input
        chooseFile(){
            this.$refs.inputValue.click()
        },

        // get image to displayed on screen before publish
        catchImg(event){
            const file = event.target.files[0]
            this.imageEdit = file // stock in data image 
            this.imageNameDisplay = file.name
            this.imageURLToPreviewEdit = URL.createObjectURL(file) // in URL to diplay

        },
        // deselected img 
        cancelSelectedImg(){
            this.imageURLToPreviewEdit = ''
            this.imageNameDisplay = 'Aucun fichier choisi'
            this.imageEdit = 'deleteImg'
            console.log(this.imageEdit)
        },
        modifyPost(){
            console.log(this.imageEdit)
            if(this.imageEdit != ''){
                if(this.imageEdit == 'deleteImg'){
                    console.log("l'image est supp par l'utilisateur")
                    
                    const idPost = this.$route.params.id // get post's id by the url of the route

                    // get userId, user's first and last name from the localStorage
                    let getUserInfos = JSON.parse(localStorage.getItem("user"))
                    const userIdSend = getUserInfos.userId 
                    const userFirstName = getUserInfos.firstName
                    const userLastName = getUserInfos.lastName

                    // create a formData object to send 
                    let formData = new FormData();
                    formData.append('userId', userIdSend)
                    formData.append('firstName', userFirstName)
                    formData.append('lastName', userLastName)
                    formData.append('legend', this.legendEdit)
                    formData.append('image', this.imageEdit) // using 'image' instead of 'imageUrl' so multer can find the file
                    formData.append('likes', 0)
                    formData.append('usersLiked', [])
                    // PUT request
                    this.axios.put(`/post/${idPost}`, formData)
                    .then((res) => {
                        console.log(res)
                        this.$router.push({name: 'Home'})
                    })
                    .catch((error)=>{
                        console.log(error)
                    }) 
                }else{
                    //this.imageEdit = something
                    console.log(this.imageEdit)
                    console.log('user change qlqch sur image')
                    // if this.imageEdit = something
                    const idPost = this.$route.params.id // get post's id by the url of the route

                    // get userId, user's first and last name from the localStorage
                    let getUserInfos = JSON.parse(localStorage.getItem("user"))
                    const userIdSend = getUserInfos.userId 
                    const userFirstName = getUserInfos.firstName
                    const userLastName = getUserInfos.lastName

                    // create a formData object to send 
                    let formData = new FormData();
                    formData.append('userId', userIdSend)
                    formData.append('firstName', userFirstName)
                    formData.append('lastName', userLastName)
                    formData.append('legend', this.legendEdit)
                    formData.append('image', this.imageEdit) // using 'image' instead of 'imageUrl' so multer can find the file
                    formData.append('likes', 0)
                    formData.append('usersLiked', [])
                    // PUT request
                    this.axios.put(`/post/${idPost}`, formData)
                    .then((res) => {
                        console.log(res)
                        this.$router.push({name: 'Home'})
                    })
                    .catch((error)=>{
                        console.log(error)
                    }) 
                }     
            }else {
                // else user doesn't modify img so there is no image to send to the server, the user changes only text
                console.log('user modifie que le texte')
                const idPost = this.$route.params.id // get post's id by the url of the route

                // get userId, user's first and last name from the localStorage
                let getUserInfos = JSON.parse(localStorage.getItem("user"))
                const userIdSend = getUserInfos.userId 
                const userFirstName = getUserInfos.firstName
                const userLastName = getUserInfos.lastName

                // create a formData object to send 
                let formData = new FormData();
                formData.append('userId', userIdSend)
                formData.append('firstName', userFirstName)
                formData.append('lastName', userLastName)
                formData.append('legend', this.legendEdit)               
                formData.append('likes', 0)
                formData.append('usersLiked', [])
                // PUT request
                this.axios.put(`/post/${idPost}`, formData)
                .then((res) => {
                    console.log(res) 
                    console.log('retour home page -- msg modif doit apparaitre')                
                    this.$router.push( {name :'Home', params : {success: true }})
                    
                })
                .catch((error)=>{
                    console.log(error)
                })   
            }
        },
        backToHome(){
            this.$router.push({name: 'Home'})
        },
    },
    mounted () { 
            this.getOnePost()
    },
}
</script>

<style lang="scss">

.card-edit{
    margin:10px 20px;
    &__backToHome{
        font-size :30px;
        &:hover {
            cursor:pointer;
            color :#FD2D01;
            transform: scale(1.10);
        }
    }
    & form{
        margin-top:30px;
        display: flex;
        flex-direction: column;
        align-items:center;
    }
    &__choose-file{
        display: flex;
        flex-direction: row;
        align-items: baseline;
    }
    &__custom-btn{
        background-color: #FFD7D7;
        border:none;
        border-radius: 10px;
        width : 155px;
        height: 30px;
        text-align:center;
        font-size: 15px;
        margin-bottom:10px;
        &:hover{
            cursor:pointer;
            background-color: darken(#FFD7D7, 8%);
        } 
    }
    &__noMoreImg{
        margin-left : 10px;
        color :#FD2D01;
        &:hover{
            cursor:pointer;
            transform: scale(1.10);
        } 
    }
    &__custom-text{
        margin-left:5px;
    }
}
.form-group-edit {
    margin-bottom: 40px;
    width:80%;
    display:flex;
    justify-content: center;
    &__first{
        display:flex;
        flex-direction: column;
        align-items: center;
    }
    &__legend{
        margin-left: 5px;
        width : 60%;
    }
}
#img-edit{
    max-width: 300px;
    height:300px;
    margin-bottom: 10px;
    text-align: center;
}
#img-edit-display{
    width: 300px;
    height:300px;
    object-fit: cover;
}
.btn-editpost{
    width :200px;
    height : 40px;
    border:none;
    background-color:#FFD7D7;
    border-radius :30px;
    font-size : 18px;
    font-weight: 700;
    &:hover{
        cursor:pointer;
        background-color: darken(#FFD7D7, 8%);
    }
}
</style>