Todos:

<!--
#: Add modal for server desync
might use a store
-->

<!--#: Maybe add visibility for child items removed for tab and display in a history -->

<!--#: Look at filtering once again -->

Not considered anymore:

<!--#: Add animations for add and remove -->
<!--#: Rewrite animations in css -->

In Progress:

BackBurner:

<!--
#: Maybe optimize search to not
run filter on items on both display and tabs - but we are using .some() so we might be good
-->
<!--#: Use Rem - gotta read more -->
<!--#: Rewrite stories -->
<!--#: Work on scalability more -->
<!--#: Export styles in some way -->

Done:

<!-- #: Add TodoHistory -->
<!--
#: Add gracefull error handling for validation fails
- use .then and if fails simply don't assign it - for add
- for delete simply remove the item from list only
- for update leave item the same
-->
<!--
    #: Fix bug when dragndropping singleline multiline
    Prolly need to send to a parent whether it is collapsed or not
    And maybe will have to update prisma model
-->
<!--#: Implement multiple TodoDisplays -->
<!--#: Add MoreDropdown to TodoScreen -->
<!--#: Add 3 dots menu for extra actions - take note, take out status showing out of the statusdropdown otherwise the position relative messes stuff -->
<!--#: TodoItem: Handle multiple lines -->
<!--#: Add to multiline TodoItem content a handle to add single line -->
<!--#: Make status change background on hover-->
<!--#: Add checks on the server for TodoConstr -->
<!--#: Add checking to api for TodoItemsData and TodoTabsData -->
<!--
    #: Fix dragging when using search
    Problem: svelte-dnd-action uses rendered items
-->

Reconsidered:

<!--#: Make server treat newline as one char, bind to innerHTML some let and then use $: to update the title with parsing -->

Separation of concerns: My client should only be concerned about TodoData and TodoApiData - where as server with - Todo
and TodoApiData
now finish it on client side in apiCaller
