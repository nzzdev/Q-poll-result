<script>
  import Header from "./components/Header.svelte";
  import Legend from "./components/Legend.svelte";
  import PollResult from "./components/PollResult.svelte";
  import Footer from "./components/Footer.svelte";
  export let item;

  function polls(item) {
    return item.polls;
  }

  function topPollType(filteredAndSortedPollResults) {
    if (filteredAndSortedPollResults[0]) {
      return filteredAndSortedPollResults[0].type;
    }
    return "";
  }

  function topPollAnswers(filteredAndSortedPollResults) {
    if (filteredAndSortedPollResults[0]) {
      return filteredAndSortedPollResults[0].answers;
    }
    return [];
  }

  function pollResultsWithDisplayInfo(polls, pollTypeInfos) {
    polls.forEach((poll, index) => {
      // transform object of answers to an array of answer objects containing
      // the answer label, value and css class attribute
      // pollTypeInfos works as a helper object here to deliver these additional
      // information, mapping is done via poll type and answer name
      const pollAnswers = poll.answers;
      const transformedAnswers = Object.keys(pollAnswers).map((answerName) => {
        const answerInfos = pollTypeInfos[poll.type].answers.filter(
          (answerInfo) => {
            return answerInfo.name === answerName;
          }
        )[0];
        let answer = {};
        answer.label = answerInfos.label;
        answer.value = pollAnswers[answerName];
        if (!answer.value) {
          answer.value = 0;
        }
        answer.cssClass = answerInfos.cssClass;
        return answer;
      });
      transformedAnswers.forEach((answer, index) => {
        answer.isLabeled = true;
        answer.hasPercentageSign = true;
        // if this value and one of the adjacent values is smaller than 5 do not display a label
        if (answer.value < 5) {
          if (
            (transformedAnswers[index - 1] &&
              transformedAnswers[index - 1].value < 5) ||
            (transformedAnswers[index + 1] &&
              transformedAnswers[index + 1].value < 5)
          ) {
            answer.isLabeled = false;
          }
        }
        // if this value and one of the adjacent values is smaller than 8 do not display the percentage sign
        if (answer.value < 11) {
          if (
            (transformedAnswers[index - 1] &&
              transformedAnswers[index - 1].value < 11) ||
            (transformedAnswers[index + 1] &&
              transformedAnswers[index + 1].value < 11)
          ) {
            answer.hasPercentageSign = false;
          }
        }
      });
      poll.answers = transformedAnswers;
    });

    return polls;
  }

  function filteredAndSortedPollResults(pollResultsWithDisplayInfo) {
    let sortedResult = pollResultsWithDisplayInfo
      .filter((poll) => {
        const valueSum = poll.answers
          .map((pollAnswer) => pollAnswer.value)
          .reduce((acc, value) => {
            return acc + value;
          }, 0);
        return valueSum === 100;
      })
      .sort((pollA, pollB) => {
        if (pollA.date && pollB.date) {
          const dateA = new Date(pollA.date);
          const dateB = new Date(pollB.date);
          if (dateA < dateB) return 1;
          if (dateA > dateB) return -1;
        }
        return 0;
      });
    sortedResult[0].cssClass = "q-poll-result-poll--current";
    return sortedResult;
  }

  function hasCompletePolls(filteredAndSortedPollResults) {
    return (
      filteredAndSortedPollResults !== undefined &&
      filteredAndSortedPollResults.length > 0
    );
  }
</script>

<div class="q-item-container s-q-item">
  <Header title={item.title} />
  {#if item.subtitle && item.subtitle !== ""}
    <div class="s-q-item__subtitle s-font-note">{item.subtitle}</div>
  {/if}
  {#if hasCompletePolls}
    <Legend answers={topPollAnswers} />
    <div class="q-poll-result-polls">
      {#each filteredAndSortedPollResults as pollResult, index}
        <PollResult
          {pollResult}
          {index}
          numberPolls={filteredAndSortedPollResults.length}
          {topPollType}
        />
      {/each}
    </div>
  {/if}
  <Footer notes={item.notes} sources={item.sources} />
</div>

<style lang="scss">
  .q-poll-result-polls {
    height: auto;
    float: none;
    clear: both;
    color: currentColor;
    margin-top: 25px;
  }
</style>
