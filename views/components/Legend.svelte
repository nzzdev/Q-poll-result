<script>
  export let item;
</script>

<ul class="q-poll-result-legend s-font-note-s">
  {#each item.answers as answer}
    <li class="q-poll-result-legend-item {answer.cssClass}">
      <span class="s-font-note-s s-font-note-s--light">
        {answer.label}
      </span>
    </li>
  {/each}
</ul>

<style lang="scss">
  .q-poll-result-legend {
    display: block;
    margin: 0 0 5px 0;
    padding: 0;
  }

  .q-poll-result-legend-item {
    display: inline-block;
    margin: 0 12px 0 0;
    padding: 0px;

    &::before {
      content: "";
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 10px;
      background: currentColor;
      position: relative;
      top: 1px;
    }

    &:last-child {
      margin-right: 0px;
    }

    span {
      margin-left: 3px;
    }
  }
</style>
