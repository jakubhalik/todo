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
