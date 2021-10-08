<script>
  import Legend from "./Legend.svelte";
  export let pollResult;
  export let index;
  export let numberPolls;
  export let topPollType;

  function pollType(pollResult) {
    return pollResult.type;
  }

  function pollAnswers(pollResult) {
    return pollResult.answers;
  }

  function pollDate(pollResult) {
    if (!pollResult.date) {
      return "";
    }
    const date = new Date(pollResult.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString();
    const day = date.getDate().toString();
    return `${day[1] ? day : "0" + day[0]}.${
      month[1] ? month : "0" + month[0]
    }.${year}`;
  }
</script>

<div class="q-poll-result-poll {pollResult.cssClass}">
  <h3 class="s-font-note s-font-note--strong">
    {#if index === 0} Aktuelle {:else} {numberPolls - index}. {/if} Umfrage vom {pollDate}
  </h3>
  <!-- if the poll type differs from the top most poll type, show legend of this poll type -->
  {#if topPollType !== pollType}
    <Legend answers={pollAnswers} />
  {/if}
  <div class="q-poll-result-arrow" />
  {#each pollResult.answers as answer}
    <div
      class="q-poll-result-bar {answer.cssClass}"
      style="width: {answer.value}%;"
    >
      {#if answer.isLabeled}
        <span class="s-font-note-s s-font-note--tabularnums"
          >{answer.value}{#if answer.hasPercentageSign}%{/if}</span
        >
      {/if}
    </div>
  {/each}
</div>

<style lang="scss">
  @import "./../../styles_src/variables";

  .q-poll-result-poll {
    position: relative;
    padding: 0px 0px $defaultBarHeight;
    margin-bottom: $labelLineHeight;

    h3 {
      margin: 0px;
      padding: 0px 0px 5px;
      display: block;
    }

    &--current {
      padding: 0px 0px $activeBarHeight;

      .q-poll-result-bar {
        height: $activeBarHeight;

        span {
          margin-top: $activeBarHeight + 5px;
        }
      }
    }
  }

  .q-poll-result-arrow {
    border: $arrowSize solid currentColor;
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: transparent;
    display: block;
    position: absolute;
    left: 50%;
    margin-left: -$arrowSize;
  }

  .q-poll-result-bar {
    float: left;
    height: $defaultBarHeight;
    text-align: center;
    background: currentColor;

    span {
      margin-top: $defaultBarHeight + 5px;
      display: block;
    }
  }
</style>
