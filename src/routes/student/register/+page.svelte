<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

<main>
    <h1>Register</h1>
    <form action="?/register" method="POST" class="auth-form">
        <label for="">Email </label>
        <input type="text" name="email" id="">
        <label for="">Password </label>
        <input type="password" name="password" id="">
        <button class="btn btn-primary">Register</button>
    </form>
</main>