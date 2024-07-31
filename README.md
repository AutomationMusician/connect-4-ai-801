# connect-4-ai-801
Connect 4 AI Agent for Penn State AI 801

## Quick start
1. Install NodeJS version 20+ on your computer.
1. In your preferred shell, `cd` to the `server` folder.
1. run `npm install` to install all necessary packages.
1. run `npm start` to start the application.
1. In your browser, navigate to `http://localhost:3000`

## Model Evaluation
To evaluate the model:
1. Run the [Quick Start](#quick-start) steps to start the node server
1. In a new instance of your preferred shell, `cd` to the `server` folder.
1. Run `npm run eval`, wait for the testing to complete, and view the resulting table. Example output:
    ```
    ┌─────────┬────────────┬────────────────┬───┬────┬───┐
    │ (index) │ difficulty │ startingPlayer │ X │ O  │ T │
    ├─────────┼────────────┼────────────────┼───┼────┼───┤
    │ 0       │ 'easy'     │ 'X'            │ 4 │ 16 │ 0 │
    │ 1       │ 'easy'     │ 'O'            │ 1 │ 19 │ 0 │
    │ 2       │ 'hard'     │ 'X'            │ 1 │ 19 │ 0 │
    │ 3       │ 'hard'     │ 'O'            │ 0 │ 20 │ 0 │
    └─────────┴────────────┴────────────────┴───┴────┴───┘
    ```


## Design Documentation

### XO- format
Connect 4 state is represented in "XO-" format between API interfaces. To translate a connect 4 board to "XO-" format:

- read the columns of the board left to right and for each column:
    - Add the pieces in the columns from bottom to top to your "XO-" format where 'X' is the AI player and 'O' is the opponent. Stop when you reach an empty space.
    - Append a '.' character to signify the end of the column

For example, the following board can be represented as `O.XO.OXXO.OXX.XO..O.` in the "XO-" format:

|        |        |        |        |        |        |        |
|:------:|:------:|:------:|:------:|:------:|:------:|:------:|
| &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; |   O    | &nbsp; | &nbsp; | &nbsp; | &nbsp; |
| &nbsp; | &nbsp; |   X    |   X    |   X    | &nbsp; | &nbsp; |
| &nbsp; |   O    |   X    |   X    |   O    | &nbsp; | &nbsp; |
|   O    |   X    |   O    |   O    |   X    | &nbsp; |   O    |


## Current Model Evaluation

```
┌─────────┬──────────────────────────┬────────────┬──────────────────┬─────┬──────┬─────┐
│ (index) │ model                    │ difficulty │ startingPlayer   │ win │ loss │ tie │
├─────────┼──────────────────────────┼────────────┼──────────────────┼─────┼──────┼─────┤
│ 0       │ 'random'                 │ 'easy'     │ 'this model'     │ 4   │ 6    │ 0   │
│ 1       │ 'random'                 │ 'easy'     │ 'opposing model' │ 0   │ 10   │ 0   │
│ 2       │ 'random'                 │ 'hard'     │ 'this model'     │ 0   │ 10   │ 0   │
│ 3       │ 'random'                 │ 'hard'     │ 'opposing model' │ 0   │ 10   │ 0   │
│ 4       │ 'random'                 │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 5       │ 'random'                 │ 'pro'      │ 'opposing model' │ 0   │ 10   │ 0   │
│ 6       │ 'minimax'                │ 'easy'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 7       │ 'minimax'                │ 'easy'     │ 'opposing model' │ 9   │ 1    │ 0   │
│ 8       │ 'minimax'                │ 'hard'     │ 'this model'     │ 5   │ 4    │ 1   │
│ 9       │ 'minimax'                │ 'hard'     │ 'opposing model' │ 8   │ 2    │ 0   │
│ 10      │ 'minimax'                │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 11      │ 'minimax'                │ 'pro'      │ 'opposing model' │ 1   │ 7    │ 2   │
│ 12      │ 'minimax-with-heuristic' │ 'easy'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 13      │ 'minimax-with-heuristic' │ 'easy'     │ 'opposing model' │ 10  │ 0    │ 0   │
│ 14      │ 'minimax-with-heuristic' │ 'hard'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 15      │ 'minimax-with-heuristic' │ 'hard'     │ 'opposing model' │ 10  │ 0    │ 0   │
│ 16      │ 'minimax-with-heuristic' │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 17      │ 'minimax-with-heuristic' │ 'pro'      │ 'opposing model' │ 9   │ 1    │ 0   │
└─────────┴──────────────────────────┴────────────┴──────────────────┴─────┴──────┴─────┘
```