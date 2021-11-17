<script>
  import Header from "./components/Header.svelte";
  import Legend from "./components/Legend/Legend.svelte";
  import PollResult from "./components/PollResult/PollResult.svelte";
  import Footer from "./components/Footer.svelte";
  export let item;
  export let pollTypeInfos;

  $: rawPollResults = addDisplayInfoToPollResults(item.polls, pollTypeInfos);
  $: pollResults = filterAndSortPollResults(rawPollResults);
  $: topPollType = getTopPollType(pollResults);
  $: topPollAnswers = getTopPollAnswers(pollResults);

  function getTopPollType(pollResults) {
    if (pollResults[0]) {
      return pollResults[0].type;
    }
    return "";
  }

  function getTopPollAnswers(pollResults) {
    if (pollResults[0]) {
      return pollResults[0].answers;
    }
    return [];
  }

  function addDisplayInfoToPollResults(polls, pollTypeInfos) {
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

  function filterAndSortPollResults(pollResultsWithDisplayInfo) {
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

    if (sortedResult.length > 0) {
      sortedResult[0].cssClass = "q-poll-result-poll--current";
    }

    return sortedResult;
  }
</script>

<div class="q-item-container s-q-item">
  <Header title={item.title} />
  {#if item.subtitle && item.subtitle !== ""}
    <div class="s-q-item__subtitle s-font-note">{item.subtitle}</div>
  {/if}
  {#if pollResults !== undefined && pollResults.length > 0}
    <Legend answers={topPollAnswers} />
    <div class="q-poll-result-polls">
      {#each pollResults as pollResult, index}
        <PollResult
          {pollResult}
          {index}
          numberPolls={pollResults.length}
          {topPollType}
        />
      {/each}
    </div>
  {/if}
  <Footer notes={item.notes} sources={item.sources} acronym={item.acronym} />
</div>
