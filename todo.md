Todos:

<!--TODO: Add gracefull error handling for validation fails -->



<!--TODO: Look at filtering once again -->

In Progress:

BackBurner:

<!--TODO: Maybe optimize search to not 
run filter on items on both display and tabs - but we are using .some() so we might be good 
-->
<!--TODO: Use Rem - gotta read more -->
<!--TODO: Rewrite stories -->
<!--TODO: Implement multiple TodoDisplays -->
<!--TODO: Work on scalability more -->
<!--TODO: Export styles in some way -->
<!--TODO: Fix bug when dragndropping singleline multiline 
    Prolly need to send to a parent whether it is collapsed or not
    And maybe will have to update prisma model
-->

Done:
<!--TODO: Add 3 dots menu for extra actions - take note, take out status showing out of the statusdropdown otherwise the position relative messes stuff -->
<!--TODO: TodoItem: Handle multiple lines -->
<!--TODO: Add to multiline TodoItem content a handle to add single line -->
<!--TODO: Make status change background on hover-->
<!--TODO: Add checks on the server for TodoConstr -->
<!--TODO: Add checking to api for TodoItemsData and TodoTabsData -->
<!--
    TODO: Fix dragging when using search 
    Problem: svelte-dnd-action uses rendered items
-->

Reconsidered:

<!--TODO: Make server treat newline as one char, bind to innerHTML some let and then use $: to update the title with parsing -->

Separation of concerns: My client should only be concerned about TodoData and TodoApiData - where as server with - Todo and TodoApiData
now finish it on client side in apiCaller
