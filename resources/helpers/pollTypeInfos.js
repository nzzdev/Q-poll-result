module.exports = {
  preVoteNoToYes5: {
    answers: [
      {
        name: 'certain-yes',
        label: 'bestimmt dafür',
        cssClass: 's-viz-color-diverging-6-6'
      },
      {
        name: 'rather-yes',
        label: 'eher dafür',
        cssClass: 's-viz-color-diverging-6-4'
      },
      {
        name: 'undecided',
        label: 'weiss nicht',
        cssClass: 'q-poll-result-bar--undecided q-poll-result-legend-item--undecided'
      },
      {
        name: 'rather-no',
        label: 'eher dagegen',
        cssClass: 's-viz-color-diverging-6-3'
      },
      {
        name: 'certain-no',
        label: 'bestimmt dagegen',
        cssClass: 's-viz-color-diverging-6-1'
      }
    ]
  },
  preVoteNoToYes3: {
    answers: [
      {
        name: 'yes',
        label: 'bestimmt/eher dafür',
        cssClass: 's-viz-color-diverging-6-5'
      },
      {
        name: 'undecided',
        label: 'weiss nicht',
        cssClass: 'q-poll-result-bar--undecided q-poll-result-legend-item--undecided'
      },
      {
        name: 'no',
        label: 'bestimmt/eher dagegen',
        cssClass: 's-viz-color-diverging-6-2'
      }
    ]
  }
}
