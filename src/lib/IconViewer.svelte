`<script lang="ts">
  import { onMount } from 'svelte';
  import { initDb, getIconsets, getIconsBySet, blobToDataUrl } from './db';
  
  let iconsets: any[] = [];
  let icons: any[] = [];
  let selectedSet: number | null = null;
  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      await initDb();
      iconsets = getIconsets();
      loading = false;
    } catch (e) {
      error = 'Failed to load database';
      loading = false;
    }
  });

  function selectSet(setId: number) {
    selectedSet = setId;
    icons = getIconsBySet(setId);
  }
</script>

<div class="container">
  {#if loading}
    <p>Loading database...</p>
  {:else if error}
    <p class="error">{error}</p>
  {:else}
    <div class="iconsets">
      <h2>Icon Sets</h2>
      <ul>
        {#each iconsets as set}
          <li>
            <button 
              class:selected={selectedSet === set.uid}
              on:click={() => selectSet(set.uid)}
            >
              {set.name}
            </button>
          </li>
        {/each}
      </ul>
    </div>

    {#if selectedSet}
      <div class="icons">
        <h3>Icons</h3>
        <div class="icon-grid">
          {#each icons as icon}
            <div class="icon-item">
              <img 
                src={blobToDataUrl(icon.bitmap)} 
                alt={icon.filename}
                title={icon.filename}
              />
              <span class="filename">{icon.filename}</span>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container {
    padding: 1rem;
  }

  .iconsets ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    background: none;
    cursor: pointer;
  }

  button.selected {
    background: #646cff;
    color: white;
  }

  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .icon-item img {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }

  .filename {
    font-size: 0.8rem;
    margin-top: 0.25rem;
    word-break: break-all;
  }

  .error {
    color: red;
  }
</style>`