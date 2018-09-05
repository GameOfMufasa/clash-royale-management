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
        "order": [[ 4, "desc" ], [5, "desc"]],
        "pageLength": 50,
        responsive: true
    });

    table.on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );

    $('#searchTable').keyup(function(){
        table.search($(this).val()).draw();
    });

    //region Style
    var $label = $("label");
    var $firstLabel = $label.first();

    var $select = $firstLabel.find("select").addClass("custom-select");
    $select.find("option").each(function() {
        $(this).text("Show " + $(this).text() + " members");
    });
    $firstLabel.parent().append("<label><div class='btn btn-primary margin-left refresh-data'>Refresh Data</div></label>");

    var $lastLabel = $label.last();
    var $el = $lastLabel.find("input");
    $lastLabel.text('').append($el);
    $el.addClass("form-control").addClass("mr-sm-2").attr("placeholder", "Search").attr("id", "searchTable");

    $(".refresh-data").click(function (e) {
        e.preventDefault();
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
    });
    //endregion
});