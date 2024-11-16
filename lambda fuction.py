import json

def lambda_handler(event, context):
    try:
        # Parse the body (game state and current player)
        body = json.loads(event['body'])
        game_state = body['gameState']
        current_player = body['currentPlayer']
        
        # Check the game status (win or draw)
        result = check_game_status(game_state)
        
        if result.get('winner'):
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': f"{result['winner']} wins!",
                    'gameState': format_game_state(game_state),
                    'winner': result['winner']
                })
            }
        elif result.get('draw'):
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': "It's a draw!",
                    'gameState': format_game_state(game_state),
                    'winner': None
                })
            }
        else:
            # Continue the game (switch player or update board)
            return {
                'statusCode': 200,
                'body': json.dumps({
                    'message': f"It's {current_player}'s turn",
                    'gameState': format_game_state(game_state),
                    'winner': None
                })
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Internal Server Error',
                'error': str(e)
            })
        }

# Function to format the game state (reduce space between columns)
def format_game_state(game_state):
    return [list(filter(lambda x: x != '', row)) for row in game_state]

# Check if there is a winner or a draw
def check_game_status(game_state):
    # Check rows and columns
    for i in range(3):
        if game_state[i][0] and game_state[i][0] == game_state[i][1] and game_state[i][0] == game_state[i][2]:
            return {'winner': game_state[i][0]}
        if game_state[0][i] and game_state[0][i] == game_state[1][i] and game_state[0][i] == game_state[2][i]:
            return {'winner': game_state[0][i]}

    # Check diagonals
    if game_state[0][0] and game_state[0][0] == game_state[1][1] and game_state[0][0] == game_state[2][2]:
        return {'winner': game_state[0][0]}
    if game_state[0][2] and game_state[0][2] == game_state[1][1] and game_state[0][2] == game_state[2][0]:
        return {'winner': game_state[0][2]}

    # Check for draw
    draw = True
    for i in range(3):
        for j in range(3):
            if game_state[i][j] == '':
                draw = False
                break
    if draw:
        return {'draw': True}

    return {}  # No winner and not a draw
