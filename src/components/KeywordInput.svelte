<!-- KeywordInput.svelte -->
<script>
    import { keywordsInput } from "./store";
  
    let textarea;
  
    const resizeTextarea = () => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
  </script>
  
  <textarea
    bind:this={textarea}
    bind:value={$keywordsInput}
    on:input={resizeTextarea}
    rows="1"
    placeholder="keyword,keyword2,keyword3"
    class="form-textarea"
  />
  