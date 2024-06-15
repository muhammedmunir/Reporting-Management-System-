<script>
	import Header from '../component/header.svelte';
	import Sectionwrapper from '../component/sectionwrapper.svelte';

    export let data;
    let { supabase, session } = data;
    $: ({ supabase, session } = data);

    let email = '';
    let fullname = '';
    let phone_number = '';
    let loading = false;

    let errors = {
        email: '',
        fullname: '',
        phone_number: ''
    };

    const validateForm = () => {
        let isValid = true;
        errors = {
            email: '',
            fullname: '',
            phone_number: ''
        };

        if (!email) {
            errors.email = 'Email is required';
            isValid = false;
        }
        if (!fullname) {
            errors.fullname = 'Full name is required';
            isValid = false;
        }
        if (!phone_number) {
            errors.phone_number = 'No. phone is required';
            isValid = false;
        }
        return isValid;
    };

    const handleapply = async () => {
        if (!validateForm()) {
            console.error('Form validation failed');
            return;
        }

        loading = true;

        // Insert apply into 'apply_contractor' table
        const { data: insertedapply, error } = await supabase.from('apply_contractor').insert([
            {
                email,
                fullname,
                phone_number
            }
        ]);

        if (error) {
            console.error('Error inserting apply:', error.message);
            loading = false;
            return;
        }

        console.log('apply send successfully:', insertedapply);
        alert('Apply send successfully');
        location.reload();
    };
</script>

<Sectionwrapper>
    <Header />
	<div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
        <h2 class="text-3xl sm:text-2xl md:text-3xl lg:text-4xl max-w-[1200px] mx-auto w-full text-center font-semibold">Apply Contractor</h2>
        <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" on:submit|preventDefault={handleapply}>
            <div class="mb-6">
                <div class="label">
                    <span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Email</span>
                </div>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    placeholder="Type your email here"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {#if errors.email}<p class="text-red-500 text-xs italic">{errors.email}</p>{/if}
            </div>

            <div class="mb-6">
                <div class="label">
                    <span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">Full Name</span>
                </div>
                <input
                    bind:value={fullname}
                    placeholder="Type your full name here"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {#if errors.fullname}<p class="text-red-500 text-xs italic">{errors.fullname}</p>{/if}
            </div>

            <div class="mb-6">
                <div class="label">
                    <span class="block text-gray-700 text-sm font-bold mb-2 max-w-[1000px]">No. Phone</span>
                </div>
                <input
                    bind:value={phone_number}
                    placeholder="Type your Full Name here"
                    class="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
                {#if errors.phone_number}<p class="text-red-500 text-xs italic">{errors.phone_number}</p>{/if}
            </div>

            <div class="flex items-center justify-center">
                <button
                    disabled={loading}
                    class="specialBtnDark hover:bg-red-900 py-2 px-4 rounded focus:outline-none sm:px-20"
                    type="submit"
                >Send</button>
            </div>

            <div class="flex items-center justify-center">
                <a class="duration-200 hover:text-red-400 cursor-pointer py-2 px-4" href="/">Back</a>
            </div>
        </form>
    </div>
</Sectionwrapper>