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
┌─────────┬────────────┬──────────────────┬─────┬──────┬─────┐
│ (index) │ difficulty │ startingPlayer   │ win │ loss │ tie │
├─────────┼────────────┼──────────────────┼─────┼──────┼─────┤
│ 0       │ 'easy'     │ 'this model'     │ 5   │ 0    │ 0   │
│ 1       │ 'easy'     │ 'opposing model' │ 5   │ 0    │ 0   │
│ 2       │ 'hard'     │ 'this model'     │ 5   │ 0    │ 0   │
│ 3       │ 'hard'     │ 'opposing model' │ 5   │ 0    │ 0   │
│ 4       │ 'pro'      │ 'this model'     │ 1   │ 4    │ 0   │
│ 5       │ 'pro'      │ 'opposing model' │ 2   │ 0    │ 3   │
└─────────┴────────────┴──────────────────┴─────┴──────┴─────┘
```