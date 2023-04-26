var tblCategory;
function getData() {
    tblCategory =  $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: window.location.pathname,
            type: 'POST',
            data: {
                'action': 'searchdata'
            },
            dataSrc: ""
        },
        columns: [
            {"data": "position"},
            {"data": "name"},
            {"data": "desc"},
            {"data": "desc"},
        ],
        columnDefs: [
            {
                targets: [-1],
                class: 'text-center',
                orderable: false,
                // /erp/category/update/' + row.id + '/
                // /erp/category/delete/' + row.id + '/
                render: function (data, type, row) {
                    var buttons = '<a href="#" rel="edit" class="btn btn-warning btn-xs"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a href="#" rel="delete" class="btn btn-danger btn-xs"><i class="fas fa-trash-alt"></i></a>';
                    return buttons;
                }
            },
        ],
        initComplete: function (settings, json) {

        }
    });
}

$(function () {

    modal_title = $('.moda-title');

    getData();

    // Crear registro Category
    $('.btnAdd').on('click', function () {
        $('input[name="action"]').val('add');
        modal_title.find('span').html('Crear categoría');
        console.log(modal_title.find('i'));
        modal_title.find('i').removeClass().addClass('fas fa-plus');
        $('form')[0].reset();
        $('#myModalCategory').modal('show');
    });

    // Editar datos Categoría
    $('#data tbody')
        .on('click', 'a[rel="edit"]', function () {
            modal_title.find('span').html('Editar categoría');
            modal_title.find('i').removeClass().addClass('fas fa-edit');
            var tr = tblCategory.cell($(this).closest('td, li')).index();
            var data = tblCategory.row(tr.row).data();
            $('input[name="action"]').val('edit');
            $('input[name="id"]').val(data.id);
            $('input[name="name"]').val(data.name);
            $('input[name="desc"]').val(data.desc);
            $('#myModalCategory').modal('show');
        })
        // Eliminar datos categoría
        .on('click', 'a[rel="delete"]', function () {
            var tr = tblCategory.cell($(this).closest('td, li')).index();
            var data = tblCategory.row(tr.row).data();
            var parameters = new FormData();
            parameters.append('action', 'delete');
            parameters.append('id', data.id);
            submit_with_ajax(window.location.pathname, 'Notificación', '¿Estás seguro de eliminar el siguiente registro?', parameters, function () {
                tblCategory.ajax.reload();
                getData();
            });
        });

    $('#myModalCategory').on('shown.bs.modal', function () {
        //$('form')[0].reset();
    });

    $('form').on('submit', function (e) {
        e.preventDefault();
        var parameters = new FormData(this);
        submit_with_ajax(window.location.pathname, 'Notificación', '¿Estás seguro de realizar la siguiente acción?', parameters, function () {
            $('#myModalCategory').modal('hide');
            tblCategory.ajax.reload();
            getData();
        });
    });
});