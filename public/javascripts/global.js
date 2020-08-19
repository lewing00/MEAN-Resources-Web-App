// Resourcelist data array for filling in info box
var resourceListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

  // Populate the resource table on initial page load
  populateTable();

});

// Resource name/title link click
$('#resourceList table tbody').on('click', 'td a.linkshowresource', showResourceInfo);

// Add Resource button click
$('#btnAddResource').on('click', addResource);

// Delete Resource link click
$('#resourceList table tbody').on('click', 'td a.linkdeleteresource', deleteResource);

// Functions =============================================================

// Fill table with data
function populateTable() {

  // Empty content string
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON( '/users/resourcecollection', function( data ) {
    resourceListData = data;
    // For each item in our JSON, add a table row and cells to the content string
    $.each(data, function(){
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowresource" rel="' + this.title + '">' + this.title + '</a></td>';
      tableContent += '<td><a href="'+ this.link +'" target="_blank">Link</a></td>';
      tableContent += '<td><a href="#" class="linkdeleteresource" rel="' + this._id + '">Delete</a></td>';
      tableContent += '</tr>';
    });

    // Inject the whole content string into our existing HTML table
    $('#resourceList table tbody').html(tableContent);
  });
};

// Show Resource Info
function showResourceInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();
  
    // Retrieve resource name from link rel attribute
    var thisResourceName = $(this).attr('rel');
  
    // Get Index of object based on id value
    var arrayPosition = resourceListData.map(function(arrayItem) { return arrayItem.title; }).indexOf(thisResourceName);
      
    // Get our Resource Object
    var thisResourceObject = resourceListData[arrayPosition];

    //Populate Info Box
    $('#resourceInfoTitle').text(thisResourceObject.title);
    $('#resourceInfoLink').text(thisResourceObject.link);
    $('#resourceInfoAuthor').text(thisResourceObject.author);
    $('#resourceInfoPublisher').text(thisResourceObject.publisher);

};

// Add Resource
function addResource(event) {
    event.preventDefault();
  
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addResource input').each(function(index, val) {
      if($(this).val() === '') { errorCount++; }
    });
  
    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {
  
      // If it is, compile all user info into one object
      var newResource = {
        'title': $('#addResource fieldset input#inputResourceTitle').val(),
        'link': $('#addResource fieldset input#inputResourceLink').val(),
        'author': $('#addResource fieldset input#inputResourceAuthor').val(),
        'publisher': $('#addResource fieldset input#inputResourcePublisher').val(),
      }
  
      // Use AJAX to post the object to our addresource service
      $.ajax({
        type: 'POST',
        data: newResource,
        url: '/users/addresource',
        dataType: 'JSON'
      }).done(function( response ) {
  
        // Check for successful (blank) response
        if (response.msg === '') {
  
          // Clear the form inputs
          $('#addResource fieldset input').val('');
  
          // Update the table
          populateTable();
  
        }
        else {
  
          // If something goes wrong, alert the error message that our service returned
          alert('Error: ' + response.msg);
  
        }
      });
    }
    else {
      // If errorCount is more than 0, error out
      alert('Please fill in all fields');
      return false;
    }
  };

// Delete Resource
function deleteResource(event) {

    event.preventDefault();
  
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this resource?');
  
    // Check and make sure the user confirmed
    if (confirmation === true) {
  
      // If they did, do our delete
      $.ajax({
        type: 'DELETE',
        url: '/users/deleteresource/' + $(this).attr('rel')
      }).done(function( response ) {
  
        // Check for a successful (blank) response
        if (response.msg === '') {
        }
        else {
          alert('Error: ' + response.msg);
        }
  
        // Update the table
        populateTable();
  
      });
  
    }
    else {
  
      // If they said no to the confirm, do nothing
      return false;
  
    }
  
  };