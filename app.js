
/*
    The method below expects a positive value to be passed in as a parameter
    which would be the amount of Reais to be invested daily for the advertisement.
    The function will return an array of the following:
        - number of clicks per day
        - number of total views per day
        - number of total shares per day
*/
function getReportData(dailyInvestment, startDate, endDate) {
    const clickPercentage = 12/100
    const sharingPercentage = 3/20
    const newViewsFromSharing = 40
    const viewsPerReal = 30
    const maxSharingCycles = 4

    const data = {
        totalViews: 0, 
        totalClicks: 0, 
        totalShares: 0, 
        totalInvestment: 0,
        startDate: startDate,
        endDate: endDate
    }

    // Make sure that the investment is positive and larger than 0
    if (dailyInvestment <= 0) {
        alert("Este campo só pertmite valor positivo.")
        return data
    }

    // Make sure that dates are valid (not equal and end date is later than start date)
    startDate = new Date(startDate)
    endDate = new Date(endDate)

    if (startDate == endDate) {
        alert("Desculpe, data inicial e final não podem ser a mesma.")
        return data
    } else if (endDate < startDate) {
        alert("Desculpe, a data final não pode ser menor que a data inicial.")
        return data
    }

    const countOfDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
    // A list of variables to be used in the loop below
    let newViews = 0
    let clickingPeople = 0
    let newShares = 0
    let newViewsFromShares = 0
    let cycle = 1

    while (cycle <= maxSharingCycles) {

        // For first cycle newViews is the original views from the investment
        if (cycle == 1) {
            newViews = dailyInvestment * viewsPerReal
            // Also let's add the original views to the totalViews
            data.totalViews += newViews
        } else {
            // Otherwise everything below should be recalculated based on the new views from social shares
            newViews = newViewsFromShares
        }

        // Use Math.floor() to make sure we get whole people
        clickingPeople = Math.floor(newViews * clickPercentage)
        data.totalClicks += clickingPeople

        // New shares based on the number of people that click the ad
        newShares = Math.floor(clickingPeople * sharingPercentage)
        data.totalShares += newShares

        // New views resulting from shares in social media
        newViewsFromShares = newShares * newViewsFromSharing

        // If there are no new views from share, we might as well stop the looping
        if (newViewsFromShares == 0) {
            break;
        }

        // Add the new views that resulted from shares
        data.totalViews += newViewsFromShares

        // Move on to the next sharing cycle
        cycle += 1
    }

    // Now that we are done with clicking everything per day, let's multiply them by the number of days
    data.totalViews = data.totalViews * countOfDays
    data.totalClicks = data.totalClicks * countOfDays
    data.totalShares = data.totalShares * countOfDays
    data.totalInvestment = dailyInvestment * countOfDays

    return data
}

/*
    This method is what is called on the form submit event (we prevent form from actually submitting).
    The data received from the user (form data) is fed into the getReportData()
    method to return the calculated results. 
    Then we use this data to append a new row to our "Reports" table and assign
    the values into the respective row cells.
*/
function addAdvertisement(e) {
    e.preventDefault()

    const clientName = document.getElementById('clientName').value
    const adName = document.getElementById('adName').value
    const startDate = document.getElementById('startDate').value
    const endDate = document.getElementById('endDate').value
    const investment = document.getElementById('investment').value

    reportData = getReportData(investment, startDate, endDate)

    const table = document.getElementById('reports')
    const row = table.insertRow(1)
    const cell1 = row.insertCell(0)
    const cell2 = row.insertCell(1)
    const cell3 = row.insertCell(2)
    const cell4 = row.insertCell(3)
    const cell5 = row.insertCell(4)
    const cell6 = row.insertCell(5)
    const cell7 = row.insertCell(6)
    const cell8 = row.insertCell(7)

    cell1.innerHTML = clientName
    cell2.innerHTML = adName
    cell3.innerHTML = reportData.startDate
    cell4.innerHTML = reportData.endDate
    cell5.innerHTML = reportData.totalInvestment
    cell6.innerHTML = reportData.totalViews
    cell7.innerHTML = reportData.totalClicks
    cell8.innerHTML = reportData.totalShares

    return false
}

/*
    This method filters the reports based on the client name.
*/
function filterClient() {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue
    input = document.getElementById('filterClient');
    filter = input.value.toUpperCase();
    table = document.getElementById('reports');
    tr = table.getElementsByTagName('tr');
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName('td')[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = '';
        } else {
          tr[i].style.display = 'none';
        }
      }
    }
}

/*
    This method filters the table based on the date entered.
    The parameter defines which date we should filter the results for,
    the start date or the end date of the advertisement period.
*/
function filterDate(searchBoxId) {
    // Declare variables
    let input, filter, table, tr, td, i, txtValue
    input = document.getElementById(searchBoxId);

    if (input.value != '') {
        // We add 'T00:00:00' to make sure JS Date() gives the right date
        filter = new Date(input.value + 'T00:00:00')
    } else {
        filter = null
    }
    table = document.getElementById('reports');
    tr = table.getElementsByTagName('tr');

    // Start date is the 3rd column on the table, while end date is the 4th
    if (searchBoxId == 'filterStartDate') {
        dateIndex = 2
    } else {
        dateIndex = 3
    }
  
    // Loop through all table rows, and hide those that have different date
    for (i = 0; i < tr.length; i++) {
        // If filter is null, simply display all rows and skip the rest
        if (!filter) {
            tr[i].style.display = ''
            continue
        }

        // Get the specific date cell to test date
        td = tr[i].getElementsByTagName('td')[dateIndex];
        if (td) {
            txtValue = td.textContent || td.innerText;
            recordDate = new Date(txtValue + 'T00:00:00')
            if (recordDate.getTime() == filter.getTime()) {
                tr[i].style.display = '';
            } else {
                tr[i].style.display = 'none';
            }
        }
    }
}