<script>
    import { result } from "./store";
  </script>
  
  {#if $result}
    <table>
      <thead>
        <tr>
          <th>Keyword</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        {#each $result as { keyword, count }}
        <tr>
          <td>{keyword}</td>
          <td>{typeof count === "string" ? count : count.toLocaleString()}</td>
        </tr>
        {/each}
      </tbody>
    </table>
  {/if}
  