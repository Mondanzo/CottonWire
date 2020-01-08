<template>
    <div class="navigation">
        <h1>CottonWire</h1>
        <div class="nav">
            <router-link to="/">Dashboard</router-link>
            <div class="spacer"></div>
            <router-link to="/">Mondanzo</router-link>
        </div>
    </div>
</template>

<style>
.navigation {
    background: #2c3e50;
    color: #486582;
    display: flex;
    align-items: baseline;
    padding: 0 24px;
}

.navigation h1 {
    margin: auto 0;
}

.nav {
    margin-left: 16px;
    display: flex;
    width: 100%;
}

.spacer {
    width: 100%;
}

a {
    color: #486582;
    padding: 24px;
    font-size: 1.2em;
    text-decoration: none;
    font-weight: bold;
}

a:hover {
    color: #2c3e50;
    background-color: #486582;
}
</style>