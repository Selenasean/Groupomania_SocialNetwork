<template>
<div class="home">
    <div class="btn-choice">
        <div class="btn-choice__left">
            <button class="btn-choice__all btn-hover" title="Accueil" @click="switchMode('home')" :class="{'btn-focus' : mode == 'home'}">
                <i class="fa-solid fa-house"></i>
            </button>
            <button class="btn-choice__add btn-hover" title="Ajouter une publication" @click="switchMode('create')" :class="{'btn-focus' : mode == 'create'}" >
                <i class="fa-solid fa-circle-plus"></i>
            </button>
        </div>
        <div class="btn-choice__right">
            <button class="btn-choice__logout btn-hover" @click="logout" title="Déconnexion">Se déconnecter</button>
        </div>
    </div>
    <section class="create-card">
        <p class="card-add__msg" v-if="postCreated">
            <span>&#127881;</span>
            Publication créée !
        </p>
        <p class="card-add__msg" v-if="modifiedPost">
            <span>&#127912;</span>
            Publication modifiée !
        </p>
        <CreatePostComponent v-if="mode == 'create'" @postCreated="switchToHome"></CreatePostComponent>
    </section>
        
    <section class="card-display" v-if="mode == 'home'">
        <p class="empty-post" v-if="showEmptyPost == true"> 
            <span>&#128553;</span> Aucune publication pour le moment..
        </p>
        <div class="post-card" v-for="item in postContents" :key="item._id" >
            <div class="post-card__top-banner">
                <p class="post-card__userName">{{ item.firstName }} {{ item.lastName}}</p>
                <span class="post-card__edit-btn" v-if="isOwner(item.userId) || isAdmin" @click="swicthToEdit(item._id)" title="Modifier">
                    <i class="fa-solid fa-pencil"></i>
                </span>
                <span class="post-card__delete-btn" @click="deletePost(item._id)" v-if="isOwner(item.userId) || isAdmin" title="Supprimer">
                    <i class="fa-solid fa-trash-can"></i>
                </span>

            </div>
            <div class="post-card__img">
                <img class="post-card__img__photo" v-if="item.imageUrl" :src="item.imageUrl">
            </div>
            <div class="post-card__liked">
                <i id="heartFull" class="fa-solid fa-heart post-card__liked__full" v-if="isLiked(item)" @click="dislike(item._id)"></i>
                <i id="heartEmpty" class="fa-regular fa-heart post-card__liked__empty" v-else @click="like(item._id)"></i>
            </div>
            <span class="post-card__text">{{ item.legend }}</span>
        </div>
    </section>

</div>

</template>

<script>
import CreatePostComponent from '@/components/CreatePostComponent.vue'

export default {
    name: "Home",
    components : { CreatePostComponent },
    data: function () {
        return {
            showEmptyPost: '',
            mode: 'home',
            postContents : '',
            postCreated : false,
            modifiedPost : false,
            isAdmin : false,
        };
    },
    methods: {
        getAllPost() {
            this.axios.get("/post")
                .then((res) => {
                if (res.data == '') {
                    this.showEmptyPost = true;
                }else{
                    this.postContents = res.data
                }

            })
                .catch((error) => {
                console.log(error);
            });
        },
        switchMode(params){
            if(params == 'home'){
                this.mode = 'home'
            }
            if(params == 'create'){
                this.mode = 'create'
            }
        },
        switchToHome(){
            if(this.mode == 'create'){
                this.mode = 'home'
            }
            this.postCreated = true
            setTimeout(() => {
                this.postCreated = false
                this.$router.go()
            }, 1500)
        },
        isLiked(post){
            let arrayLiked = post.usersLiked // all user who liked
            // get userId who likes the post
            let user = JSON.parse(localStorage.getItem('user'))
            let userIdWhoLikes = user.userId
            return arrayLiked.includes(userIdWhoLikes)
        },
        like(idPost){// to do
            console.log('like cliqué')

            // get userId who likes the post
            let user = JSON.parse(localStorage.getItem('user'))
            let userIdWhoLikes = user.userId
            let firstNameWhiLikes = user.firstName
            let lastNameWhoLikes = user.lastName
            // POST LIKE request
            this.axios.post(`/post/${idPost}/like`, {
                userId: userIdWhoLikes,
                firstName : firstNameWhiLikes,
                lastName : lastNameWhoLikes,
                like : 1,
            })
                .then((res) => {
                    console.log(res) 
                    this.$router.go()
                })
                .catch((error)=>{
                    console.log(error)
                })   
        },
        dislike(idPost){
            console.log("coeur rouge cliqué")
           
            // get userId who likes the post
            let user = JSON.parse(localStorage.getItem('user'))
            let userIdWhoLikes = user.userId
            let firstNameWhiLikes = user.firstName
            let lastNameWhoLikes = user.lastName
            // POST DISLIKE request
            this.axios.post(`/post/${idPost}/like`, {
                userId: userIdWhoLikes,
                firstName : firstNameWhiLikes,
                lastName : lastNameWhoLikes,
                like : -1 ,
            })
                .then((res) => {
                    console.log(res) 
                    this.$router.go()
                })
                .catch((error)=>{
                    console.log(error)
                })   
        },
        swicthToEdit(id) {
            this.$router.push({ name: 'EditPost', params: { id: id } })
        },
        isOwner(postUserId){
            let user = JSON.parse(localStorage.getItem('user'))
            let userConnected = user.userId
            return userConnected == postUserId
        },
        getUser(){
            let user = JSON.parse(localStorage.getItem('user'))
            let userConnected = user.userId
            this.axios.get(`/auth/${userConnected}`)
            .then((res)=> {
                console.log(res)
                this.isAdmin = res.data.isAdmin
            })
            .catch((err)=> {
                console.log(err)
            })
        },
        deletePost(idPost){
            console.log(idPost)
            // DELETE request
            this.axios.delete(`/post/${idPost}`)
                .then((res) => {
                    console.log(res)
                    location.reload()                  
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        showMsgPostModified(){
            console.log('post modifié doit apparaitre')
            this.modifiedPost = true;
            setTimeout(()=> {
                this.modifiedPost = false
            },1500)
        },
        logout(){
            localStorage.clear()
            this.$router.push({name : 'Authentification'})
        }
        
    },
    mounted() {
        this.getAllPost();
        console.log(this.$route)
        if(this.$route.params.success){
            this.showMsgPostModified()
        }
        this.getUser()
    },
}
</script>

<style lang="scss">

.btn-choice{
    position :sticky;
    top:10px;
    display:flex;
    flex-direction: row;
    flex-wrap :wrap;
    justify-content: space-between;
    margin-top:15px;
    &__right {
        margin-right : 25px;
    }
    &__left{
        margin-left:25px;
        width:60% ;
    }
    &__all {
        margin-right :15px;
        font-weight:700;
        font-size: 15px;
        background-color: #FFD7D7;
        border :none;
        border-radius: 10px;
        width : 50px;
        height : 35px;
    }
    &__add {
        font-size: 15px;
        font-weight:700;
        background-color: #FFD7D7;
        border :none;
        border-radius: 10px;
        width : 50px;
        height : 35px;
    }
    &__logout {
        font-size: 15px;
        font-weight:700;
        background-color: #FFD7D7;
        border :none;
        border-radius: 10px;
        width : 150px;
        height : 35px;

    }
}
.btn-hover:hover {
    cursor: pointer;
    transform : scale(1.10);
    background: darken(#FFD7D7, 10%);
}
.btn-focus {
    background: darken(#FFD7D7, 10%)
}
.create-card{
    display:flex;
    justify-content: center;
}
.card-add__msg{
    margin-top : 40px;
    font-size: 20px;;
}
.card-display{
    margin-top : 50px;
    padding : 25px;
    display:flex;
    flex-direction: column;
    align-items: center;
}
.post-card{
    width : 350px;
    max-height: 500px;
    border-radius: 20px;
    box-shadow: 0 0 5px rgb(180 178 178);
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 25px;
    &__top-banner{
        margin-top :16px;
        margin-left : 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        max-width: 330px;
    }
    &__userName{
        margin :0;
        font-size:16px;
        font-weight:700;
        width :280px;
    }
    &__edit-btn{
        font-size:16px;
        margin-right: 8px;
        &:hover{
            color:grey;
            cursor :pointer;
        }
    }
    &__delete-btn{
        font-size:16px;
        margin-right:10px;
        &:hover{
            color:grey;
            cursor :pointer;
        }
    }
    &__img{
        margin-top: 10px;
        max-height: 300px;
        max-width:350px;
        &__photo{
            width :350px;
            height :300px;
            object-fit :cover;
        }
    }
    &__liked{
        margin-left:10px;
        margin-top:5px;
        position :relative;
        &__full{
            color: red;
            position : relative;
            &:hover{
                cursor :pointer;
            }

        }
        &__empty{
            position :absolute;
            right : 0;
            top: 2px;
            z-index:1;
            &:hover{
                color :grey;
                cursor :pointer;
            }
 
        }
    }
    &__text{
        word-wrap: break-word;
        white-space:pre-line;
        overflow:hidden;
        text-overflow: ellipsis;
        width: 320px;
        max-height: 200px;
        margin: 5px 10px 20px;
    }
}
</style>