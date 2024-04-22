<script>
    /** @type {import('./$types').PageData} */
    export let data;

</script>

<main>
    <div class="w-full">
        <div class="flex justify-between items-center w-full">
            <h2 class="text-center text-3xl font-bold tracking-tight text-gray-900">Report Form</h2>
        </div>
        <form action="" class="w-full flex flex-col">
            <div class="form-control w-full max-w-xs">
                <span class="label-text">Category Report: </span>
                <select name="" id="" class="input input-primary input-bordered w-full max-w-xs">
                    <option value=""></option>
                </select>
            </div>
            <div class="form-control w-full max-w-xs">
                <span class="label-txt">Place: </span>
                <input type="place" name="place" class="input input-primary input-bordered w-full max-w-xs" />
            </div>
            <div class="form-control w-full max-w-xs">
                <span class="label-txt">what is broken? </span>
                <input type="broken" name="broken" class="input input-primary input-bordered w-full max-w-xs" />
            </div>
            <div class="form-control w-full max-w-xs">
                <span class="label-txt">Date Report </span>
                <input type="date" name="date" class="input input-primary input-bordered w-full max-w-xs" />
            </div>
            <div class="form-control w-full max-w-xs">
                <span class="label-txt">Upload a picture: </span>
                <input type="file" name="picture" class="input input-primary input-bordered w-full max-w-xs" accept="image/png, image/jpeg" />
            </div>
            <button class="btn btn-primary">Submit</button>
        </form>
    </div>
</main>