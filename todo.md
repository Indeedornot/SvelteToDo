Todos:

<!--TODO: Add gracefull error handling for validation fails -->
<!--TODO: Maybe optimize search to not run filter on items on both display and tabs - but we are using .some() so we might be good -->
<!--TODO: TodoItem: Handle multiple lines -->
<!--TODO: Make server treat newline as one char, bind to innerHTML some let and then use $: to update the title with parsing -->
<!--TODO: Add to multiline TodoItem content a handle to add single line -->

BackBurner:

<!--TODO: Use Rem --> - gotta read more
<!--TODO: Rewrite stories -->
<!--TODO: Implement multiple TodoDisplays -->
<!--TODO: Work on scalability more -->
<!--TODO: Export styles in some way -->

Done:

<!--TODO: Make status change background on hover-->
<!--TODO: Add checks on the server for TodoConstr -->
<!--TODO: Add checking to api for TodoItemsData and TodoTabsData -->

Separation of concerns: My client should only be concerned about TodoData and TodoApiData - where as server with - Todo and TodoApiData
now finish it on client side in apiCaller
