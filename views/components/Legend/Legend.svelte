<script>
  export let answers;
</script>

<ul class="q-poll-result-legend s-font-note-s">
  {#each answers as answer}
    <li class="q-poll-result-legend-item {answer.cssClass}">
      <span class="s-font-note-s s-font-note-s--light">
        {answer.label}
      </span>
    </li>
  {/each}
</ul>
