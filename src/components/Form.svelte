<script>
  let keywordsInput = "";
  let result = null;
  let loading = false;
  let textarea;

  const resizeTextarea = () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  const fetchKeywordCounts = async () => {
    loading = true;
    const keywords = keywordsInput.split(",").map((keyword) => keyword.trim());

    const response = await fetch("./api/scraper", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(keywords),
    });

    if (response.ok) {
      const data = await response.json();
      result = data.data;
    } else {
      console.error(`Error: ${response.statusText}`);
    }
    loading = false;
    console.log(keywordsInput);
  };
</script>

<section>
  <h1>Pencari Golden Keyword</h1>
  <form on:submit|preventDefault={fetchKeywordCounts}>
    <label for="keywords">Masukkan Keyword (Pisahkan dengan Koma):</label>

    <textarea
      bind:this={textarea}
      bind:value={keywordsInput}
      on:input={resizeTextarea}
      rows="1"
      placeholder="Masukkan teks di sini dan area teks akan tumbuh secara otomatis"
      class="form-textarea"
    />
    <button type="submit" disabled={loading}>Cari Tahu 🤖</button>
  </form>

  {#if loading}
  <p>Sedang Mengambil Data 🌟😄</p>
{:else if result}
  <table>
    <thead>
      <tr>
        <th>Keyword</th>
        <th>Jumlah</th>
      </tr>
    </thead>
    <tbody>
      {#each result as { keyword, count }}
      <tr>
        <td>{keyword}</td>
        <td>{typeof count === 'string' ? count : count.toLocaleString()}</td>
      </tr>
      {/each}
    </tbody>
  </table>
{/if}

</section>
