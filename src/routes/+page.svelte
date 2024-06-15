<script>
    import Sectionwrapper from "./component/sectionwrapper.svelte";
    import Header from "./component/header.svelte";
    
    function reroute(href) {
		window.location.href = href;
    };
</script>

<Sectionwrapper>
    <Header />	
        <div class="flex flex-col gap-10 flex-1 items-center justify-center pb-10 md:pb-14">
            <h2 class="text-5xl sm:text-6xl md:text-7xl lg:text-8xl max-w-[1200px] mx-auto w-full text-center font-semibold">Welcome <span class="text-red-900">To</span> Campus <span class="text-red-800">Defect</span> Reporting <span class="text-red-700">Management</span> System</h2>
            <p class="text-xl sm:text-2xl md:text-3xl text-center max-w-[1000px] mx-auto w-full">Students can <span class="italic">easily</span> make reports in college.</p>
            <div class="flex items-center gap-4">
                <button on:click={ () => reroute("/login")} class="specialBtn">
                    <p class="text-base sm:text-lg md:text-xl">Login &rarr;</p>
                </button>
            </div>
        </div>   
</Sectionwrapper>