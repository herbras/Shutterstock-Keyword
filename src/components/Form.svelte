<script>
  import { fetchKeywordCounts } from "./fetchKeywordCounts";
  import { keywordsInput, result, loading, errorMessage } from "./store";
  import KeywordInput from "./KeywordInput.svelte";
  import ResultTable from "./ResultTable.svelte";

  const handleSubmit = async () => {
    await fetchKeywordCounts();
  };
</script>

<section>
  <h1>Pencari Golden Keyword di Shutterstock</h1>
  <form on:submit|preventDefault={handleSubmit}>
    <label for="keywords">Masukkan Keyword (Pisahkan dengan Koma):</label>
    <KeywordInput />
    <button type="submit" disabled={$loading}>Cari Tahu 🤖</button>
  </form>

  {#if $errorMessage}
  <p class="error-message">{$errorMessage}</p>
  {:else if $loading}
  <p>Sedang Mengambil Data 🌟😄</p>
  {:else}
  <ResultTable />
  {/if}
</section>
