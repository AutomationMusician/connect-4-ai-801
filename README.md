# connect-4-ai-801
Connect 4 AI Agent for Penn State AI 801

## XO- format
Connect 4 state is represented in "XO-" format for this command line tool. To translate a connect 4 board to "XO-" format:

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
