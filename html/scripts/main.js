$(document).ready(function () {
    var table = $('#usersTable').DataTable({
        "ajax": '/data',
        "columns": [
            {"data": "tag"},
            {"data": "name"},
            {"data": "role"},
            {"data": "trophies"},
            {"data": "lastPlayedString"},
            {"data": "firstSeen"}
        ],
        "pageLength": 50,
        responsive: true
    });

    var $label = $("label");
    var $firstLabel = $label.first();

    var $select = $firstLabel.find("select").addClass("custom-select");
    $select.find("option").each(function() {
        $(this).text("Show " + $(this).text() + " entries");
    });
    $firstLabel.parent().append("<label><a class='btn btn-primary margin-left' href='#refresh' id='refresh'>Refresh Data</a></label>");

    var $lastLabel = $label.last();
    var $el = $lastLabel.find("input");
    $lastLabel.text('').append($el);
    $el.addClass("form-control").addClass("mr-sm-2").attr("placeholder", "Search").attr("id", "searchTable");

    $('#searchTable').keyup(function(){
        table.search($(this).val()).draw() ;
    });

    $("#refresh").click(function (e) {
        $(e.target).prop('disabled', true);
        $.ajax("/refresh").done(function (data) {
            if (data && data.reason) {
                alert(data);
            } else {
                table.ajax.reload();
            }
        }).fail(function (err) {
            alert(err.responseJSON);
        }).always(function() {
            $(e.target).prop('disabled', false);
        });
    })
});