<script>
    import { goto } from '$app/navigation';
    
	export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let email = '';
    let errorMessage = '';
    let successMessage = '';

    const handlePasswordRecovery = async () => {
        if (email !== '') {
            const { error } = await supabase.auth.verifyOtp({ token_hash: email, type: 'email' });
            if (!error) {
                successMessage = 'Password reset email sent successfully.';
            } else {
                errorMessage = error.message;
            }
        } else {
            errorMessage = 'Please enter your email address.';
        }
    };
</script>

<main class="register flex flex-col justify-center items-center h-screen">
    <h1 class="text-3xl font-bold mb-2">Password Recovery</h1>
    <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-6">
            <div class="label">
                <span class="block text-gray-700 text-sm font-bold mb-2">Email</span>
            </div>
            <input
                type="email"
                id="email"
                bind:value={email}
                placeholder="Type your email here"
                class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>

        <div class="flex items-center justify-center">
            <button
                on:click={handlePasswordRecovery}
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none"
            >
                Request Password Reset
            </button>
        </div>

        {#if errorMessage}
            <p class="text-center mt-2 text-lg text-error text-red-600">{errorMessage}</p>
        {/if}

        {#if successMessage}
            <p class="text-center mt-2 text-lg text-success text-green-600">{successMessage}</p>
        {/if}
    </form>
</main>

