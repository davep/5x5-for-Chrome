// State of the current game.
var gameState = {
    
    // How mnany moves have been made.
    moves: ko.observable( 0 ),
    
    // The rows on the grid.
    rows: ko.observableArray( [] ),
    
    // Count of how many cells are turned on.
    onCount: ko.computed( function () {
        
        var count = 0;

        eachCell( function ( cell ) {
            if ( cell.state() ) {
                count++;
            }
        } );

       return count;
       
    }, null, { deferEvaluation: true } ),
 
    // Count of how many cells are left to turn on.
    leftCount: ko.computed( function () {
        return 25 - gameState.onCount(); 
    }, null, { deferEvaluation: true } )
};

// Evalulate a function for each cell in the game.
function eachCell( f ) {
    gameState.rows().forEach(
        function ( row ) {
            row().forEach( 
                function( col ) {
                    f( col );
                } );
        } );
}

// Return the given cell.
function cell( row, col ) {
    return gameState.rows()[ row ]()[ col ];
}

// Toggle the value of the given cell.
function toggleCell( row, col ) {
    cell( row, col ).state( !cell( row, col ).state() );
}

// Performm a 5x5 toggle of a cell and those around it.
function toggleCells( cell ) {
    toggleCell( cell.row, cell.col );
    if ( cell.row > 0 ) {
        toggleCell( cell.row - 1, cell.col );
    }
    if ( cell.row < 4 ) {
        toggleCell( cell.row + 1, cell.col );
    }
    if ( cell.col > 0 ) {
        toggleCell( cell.row, cell.col - 1 );
    }
    if ( cell.col < 4 ) {
        toggleCell( cell.row, cell.col + 1 );
    }
}

// React to a click on a cell.
function clickCell( cell ) {
    toggleCells( cell );
    gameState.moves( gameState.moves() + 1 );
}

// Clear the grid.
function clearGrid() {
    eachCell( function ( cell ) {
        cell.state( false );
    } );
}

// Set up the initial state of the game.
function initialState() {
    
    // Blank the grid.
    clearGrid();
    
    // Set the initial pattern.
    toggleCells( cell( 2, 2 ) );
    
    // Reset the moves counter.
    gameState.moves( 0 );
 }

// Initialise the game.
function init5x5() {
    
    // Create the grid.
    for ( var row = 0; row < 5; row++ ) {
        gameState.rows.push( ko.observableArray( [] ) );
        for ( var col = 0; col < 5; col++ ) {
            gameState.rows()[ row ].push( { 
                row: row, 
                col: col, 
                state: ko.observable( false ) } ); 
        }
    }
    
    // Set the initial grid state.
    initialState();
    
    // Hook up Knockout.
    ko.applyBindings( gameState );
}