<template>
<header>
    <div class="header">
        <img class="header__img" src="@/assets/icon-left-font.png" alt="Groupomania Logo"/>
    </div>
</header>
</template>

<script>
export default {
    name: 'HeaderComponent'
}
</script>

<style lang="scss">
.header {
    width : 100%;
    display: flex;
    justify-content: center;
    border-bottom : 0.5px solid #FD2D01;
    margin-bottom: 10px;
    &__img {
        max-height: 100px;
        width : 400px;
        object-fit: cover;
    }
}

</style>