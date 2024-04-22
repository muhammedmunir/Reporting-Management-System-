<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<main>
    <h1>Login</h1>
    <form action="?/login" method="POST" class="login-form">
        <label for="">Email </label>
        <input type="text" name="email" id="">
        <label for="">Password </label>
        <input type="password" name="password" id="">
        <button class="btn btn-primary">Login</button>
    </form>
</main>