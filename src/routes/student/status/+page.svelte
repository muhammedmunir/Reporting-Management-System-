<script>
    /** @type {import('./$types').PageData} */
    export let data;

    //import Table from "./components/Table.svelte";
    //import { formatDate } from "./utilities/helpers.js";
    //import data from "./data.js";

    let search = "";
    const columns = ["ID", "Category Report", "Place", "what is broken?", "Date Report", "Status"];

    function searchFor(search) {
        return data.filter(item => {
        return Object.values(item).some(value => {
            if (typeof value === "number") {
            value = String(value);
            }
            if (typeof value === "object") {
            value = formatDate(value);
            }

            return value.toLowerCase().includes(search.toLowerCase());
        });
        });
    }

    $: filtered = search ? searchFor(search) : data;
</script>

<main>
    <header>
        <h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          Status Report <span class="count">{filtered.length}</span>
        </h1>
        <input type="text" bind:value={search} />
      </header>
      <Table {columns} data={filtered} />
</main>