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


### Models vs. [T. Leemann Model](https://tleemann.de/four.html)
```
┌──────────────────────────┬────────────┬──────────────────┬─────┬──────┬─────┐
│ model                    │ difficulty │ starting player  │ win │ loss │ tie │
├──────────────────────────┼────────────┼──────────────────┼─────┼──────┼─────┤
│ 'random'                 │ 'easy'     │ 'this model'     │ 4   │ 6    │ 0   │
│ 'random'                 │ 'easy'     │ 'opposing model' │ 0   │ 10   │ 0   │
│ 'random'                 │ 'hard'     │ 'this model'     │ 0   │ 10   │ 0   │
│ 'random'                 │ 'hard'     │ 'opposing model' │ 0   │ 10   │ 0   │
│ 'random'                 │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 'random'                 │ 'pro'      │ 'opposing model' │ 0   │ 10   │ 0   │
│ 'minimax'                │ 'easy'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 'minimax'                │ 'easy'     │ 'opposing model' │ 9   │ 1    │ 0   │
│ 'minimax'                │ 'hard'     │ 'this model'     │ 5   │ 4    │ 1   │
│ 'minimax'                │ 'hard'     │ 'opposing model' │ 8   │ 2    │ 0   │
│ 'minimax'                │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 'minimax'                │ 'pro'      │ 'opposing model' │ 1   │ 7    │ 2   │
│ 'minimax-with-heuristic' │ 'easy'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 'minimax-with-heuristic' │ 'easy'     │ 'opposing model' │ 10  │ 0    │ 0   │
│ 'minimax-with-heuristic' │ 'hard'     │ 'this model'     │ 10  │ 0    │ 0   │
│ 'minimax-with-heuristic' │ 'hard'     │ 'opposing model' │ 10  │ 0    │ 0   │
│ 'minimax-with-heuristic' │ 'pro'      │ 'this model'     │ 0   │ 10   │ 0   │
│ 'minimax-with-heuristic' │ 'pro'      │ 'opposing model' │ 9   │ 1    │ 0   │
└──────────────────────────┴────────────┴──────────────────┴─────┴──────┴─────┘
```

### Models vs. Each Other

#### 'minimax' vs. 'random'

```
┌─────────────────┬─────────────┬────────────┬─────┐
│ starting player │ minimax win │ random win │ tie │
├─────────────────┼─────────────┼────────────┼─────┤
│ 'minimax'       │ 10          │ 0          │ 0   │
│ 'random'        │ 10          │ 0          │ 0   │
└─────────────────┴─────────────┴────────────┴─────┘
```

#### 'minimax-with-heuristic' vs. 'minimax'

```
┌──────────────────────────┬────────────────────────────┬─────────────┬─────┐
│ starting player          │ minimax-with-heuristic win │ minimax win │ tie │
├──────────────────────────┼────────────────────────────┼─────────────┼─────┤
│ 'minimax-with-heuristic' │ 9                          │ 1           │ 0   │
│ 'minimax'                │ 10                         │ 0           │ 0   │
└──────────────────────────┴────────────────────────────┴─────────────┴─────┘
```


#### 'minimax-with-heuristic' vs. 'random'

```
┌──────────────────────────┬────────────────────────────┬────────────┬─────┐
│ starting player          │ minimax-with-heuristic win │ random win │ tie │
├──────────────────────────┼────────────────────────────┼────────────┼─────┤
│ 'minimax-with-heuristic' │ 10                         │ 0          │ 0   │
│ 'random'                 │ 10                         │ 0          │ 0   │
└──────────────────────────┴────────────────────────────┴────────────┴─────┘
```