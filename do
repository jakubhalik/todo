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
