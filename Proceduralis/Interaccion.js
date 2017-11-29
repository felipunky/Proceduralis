function main() {
    $('.animacionProcedural').hide();
    $('.animacionProcedural').show(1000);
    $('.tabla').hide();
    $('.arteGenerativo').hide();
    $('.animacionProcedural').on('click', function () {
        $('.tabla').toggle();
        $('.arteGenerativo').toggle();
    })
}
$(document).ready(main);

