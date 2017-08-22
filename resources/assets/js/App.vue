<template>
    <div class="app">
        <AppHeader></AppHeader>
        <div class="app-body">
            <Sidebar></Sidebar>
            <main class="main">
                <div class="container-fluid">
                    <router-view></router-view>
                </div>
            </main>
        </div>
        <alert></alert>
    </div>
</template>

<script>
    import AppHeader from './components/_commons/Header'
    import Sidebar from './components/_commons/Sidebar'
    import Alert from './components/_commons/Alert.vue';

    export default {
        name: 'app',
        components: {
            Alert,
            AppHeader,
            Sidebar
        }
    }
</script>
