To-do list application where:
a. Users can add a new item to the existing list
b. Users can edit an item from the existing list
c. Users can mark the item as complete or mark the item as incomplete
c. Users can mark the item as not started/in progress/for testing/finished
d. Users can delete the item from the existing list
e. Users can manage multiple lists in the to-do application
f. Users can specify advanced properties for each todo item
    i. Priority
    ii. Due date
    iii. Tags
    iv. Complete/Incomplete
    v. progress/for testing/finished

https://v0.dev/t/fgGeHOxOSyv

let's have it have Ready For Testing instead of just for testing. Make the select options prettier with use of borders and different color for different option, also put back the progress bar that was there before, I liked it. Make it be in 0% when not started is selected, at 33% when in progress just got selected and at 66% when ready for testing just got selected and 100% when finished selected, but let the person also change change the progress bars place by just clicking at it at a position without that affecting the select options, but do not let the person change the progress bar if not started or finished is selected. Also let the user edit values only when clicking the edit icon.

case 'in progress':
    if (progressPercentage < 33) {
        progressPercentage = 33;
    }
    break;
case 'ready for testing':
    if (progressPercentage < 66) {
        progressPercentage = 66;
    }

I do not want just the leaving the textfield or clicking enter when in it to leave the edit state, I want that to happen ONLY when clicking on the edit icon again

I want the edit icon button to have gray bg when in edit state

the word high is shorter then for example words `in progress` , so when high or low is selected the `in progress` stops being in one horizontal line, but has now 2 horizontal lines where on one is in and on the other progress, I want it to keep being in one horizontal line always

let's in the case of sm: make the input become a popup when focused, so it is wide enough for the user to see all that he is texting there

Let's make the description and tags editable when in edit state

make the popup show up for inputs only when width is smaller than 400px

let's at first actually not display any lists, but lets give the user a button to generate template tasks, which will add the tasks that are right now in the setList

also make it so when the user generates lists the first list does get selected

build -> if type errs -> fix type errs -> back to BOL until type errs fixed

When writing tags u cannot use spaces and gotta use commas for making multiple tags

when adding a list let me give it a name and also let me change a name of any list, use the same edit icon mechanism as is in the cards for this, just add the edit icon button behaving the same way into the switchers for the lists for turning that list into an input, but in the case of creating a new one make it so that one is already defaultly at edit mode and already focused onto the input

when in the list edit mode I need the button with the edit icon to be more gray and I need the list name element to be just as wide when it turns into an input as it was before and I need to be capable to leave the edit list state when clicking the edit icon again or clicking enter within the input

use the component DatePicker for a datepicker for the due date to be also editable when in the edit state

build -> if type errs -> fix type errs -> back to BOL until type errs fixed

I need the generating of template lists to also post those to the mockapi

Even tho a put request is being sent on every little change on the title input do not let that affect the smoothness of the ux of writting in that input, what is now happening is that when I text in there quickly the letters are slow and sometimes the new ones I write do not appear because the old ones do

But now me texting in there does not send the put requests anymore and when I switch from the edit mode I am back to the text that was there before. I want the state of what title text I am changing there to be instantly affecting sending put requests but for the data from the endpoints to not be whatsoever effecting the states of my fields when in edit mode.

The title input behavior is good one, make the one for description and tags the same.

make the doing a change on the progress bar do a put request

let me also drag in the progress bar

implement for the progress bar state changing the same state handling where state effects the put requests but the endpoints do not whatsoever effect the state of the progress bar when in edit mode like it is in tags, description, title -> If the user does not behave like a retard it works very well, if brute testing dragging, redragging and immediately realoding after bunch of fast click and drags, it might not make the last put request in time

Deleting a task does not work right now, fix it

The date picker is right now choosing the previous day when clicking on a day, fix it

set the endpoint as env var

Leave the edit mode when clicking enter when in title input, description input or tag input

onKeyDown={(e) => {
    if (e.key === 'Enter') {
        setEditMode((prev) => ({ ...prev, [task.id]: false }));    
    }
}}

do not let the progress bar be dragged below 0% or above 100%

make the popup input span over more of a height when it has too much text so the user could always see all of it

do not write hardcoded 1 in rows={}, instead have it as rows={rows} , have no style.height anywhere, that is disgusting and shameful and stupid, not needed at all, have a state that is at initial load of popup and then onInput writing checking the amount of words in symbols (letter, number, special symbol, space, whatev) and for each 35 adds one row to the initial one row,
the amount of rows is always just one, at 0 symbols it is supposed to be 1 row, and for each 35 symbols +1 row, where it is supposed to check on me inputting more things and recalculate if it is not supposed to get more rows again

optimalize cards responsiveness for galaxy z fold 5 (344 px width)

Let me write spaces when in the input for tags

adding task does not work right now, fix adding task

when adding a task add it to the top, not to the bottom and have it right away in edit mode

add placeholder Description to description input and placeholder Tags to tags input

Add a bin icon button for deleting a list next to the edit list icon button on its right and add the functionality to delete a list through clicking on it

Add a delete all tasks button for deleting all tasks in the selected list

I want the button down there below, I just tho want it to have just as much width as the cards above it and I want it to have a bg-red-400 and for dark: no bg and red border, red icon, red text

add a popup of 'Are you sure you want to delete all tasks'?

make the AlertDialogActions be next to each other, not above/below each other

make them not in one corner, but for each to take most of one half

make the buttons of the dialog smaller and the yes button bg-red-300

build -> if type errs -> fix type errs -> back to BOL until type errs fixed

Add a delete all lists button for deleting all lists

Integrate all deletions in the ToDo for the use of the deleteConfirmationPopup

do not allow to give a list name that is longer than 15 characters

change the title of the list according to the new name of the list right after the new name is set

Allright, good, but editing the list name does right now not do a valid put request for it, make it do so

When I make changes in tasks in one list and then switch to a different one and back the changes will disappear unless I do a full page reload, fix that

all till here done

Great, but it right now still does not work for adding new tasks, change that up

make the Add Task button clickable only when there is some input in the New Task input

add a Button for hiding or displaying the To-Do Lists section

the Personal and Work lists both have highlighted backgrounds that is supposed to be had only by the selected list no matter what is selected and when I delete one, I delete both and when I edit name of one, I edit name of both, but it happens only on like every third or fith generating of template lists, fix that
