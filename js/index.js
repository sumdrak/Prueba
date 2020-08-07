/*
  Creación de una función personalizada para jQuery que detecta cuando se detiene el scroll en la página
*/
$.fn.scrollEnd = function(callback, timeout) {
  $(this).scroll(function(){
    var $this = $(this);
    if ($this.data('scrollTimeout')) {
      clearTimeout($this.data('scrollTimeout'));
    }
    $this.data('scrollTimeout', setTimeout(callback,timeout));
  });
};
/*
  Función que inicializa el elemento Slider
*/

function inicializarSlider(){
  $("#rangoPrecio").ionRangeSlider({
    type: "double",
    grid: false,
    min: 0,
    max: 100000,
    from: 200,
    to: 80000,
    prefix: "$"
  });
}
/*
  Función que reproduce el video de fondo al hacer scroll, y deteiene la reproducción al detener el scroll
*/
function playVideoOnScroll(){
  var ultimoScroll = 0,
      intervalRewind;
  var video = document.getElementById('vidFondo');
  $(window)
    .scroll((event)=>{
      var scrollActual = $(window).scrollTop();
      if (scrollActual > ultimoScroll){
       
     } else {
        //this.rewind(1.0, video, intervalRewind);
        video.play();
     }
     ultimoScroll = scrollActual;
    })
    .scrollEnd(()=>{
      video.pause();
    }, 10)
}
//Función lo cual realizar la carga iniciar de los datos del json al html
function data_json(){
  let option_city= new Array();
  let option_type= [];
  let html_inmu = "";
  $("#result_search").html(html_inmu);

  $.getJSON('data-1.json',function(data){
    $.each(data,function(i,value){
      //asignación de array para las lista desplegables
      option_city.push(value.Ciudad);
      option_type.push(value.Tipo);
      html_inmu += `<div class="colContenido_venta" id="div_venta_${i}">
      <div class="card" style="justify-content: center;">
        <div class="row"><div class="col" style="left: 1.5%;top: 7px;"><img src="img/home.jpg" width="80%" height="80%">
          </div><div class="col" style="top: 7px;">
            <span><b>Dirección:</b> ${value.Direccion}</span><br>
            <span><b>Ciudad:</b> ${value.Ciudad}</span><br>
            <span><b>Teléfono:</b> ${value.Telefono}</span><br>
            <span><b>Codigo Postal:</b> ${value.Codigo_Postal}</span><br>
            <span><b>Tipo:</b> ${value.Tipo}</span><br>
            <span><b>Precio:</b> ${value.Precio}</span><br>            
            <div class="botonField">
            <input type="submit" class="btn green white-text" value="Guardar" id="saveButton" onclick="fn_save_inmb(${value.Id})">
            </div>
          </div></div></div></div>`;
    });
    html_inmu += div_inmubles(data);
    option_city = Array.from(new Set(option_city));
    option_type = Array.from(new Set(option_type));
        
    $("#selectCiudad").html(option_select(option_city, 'Elige una ciudad'));
    $("#selectTipo").html(option_select(option_type, 'Elige un tipo'));
    $("#result_search").html(html_inmu);
  }).error(function(){
    console.log('error');
  });
}

function option_select(data_value,txt_ini){
  let html  = `<option value="" selected>${txt_ini}</option>`;
  
  $.each(data_value,function(i,value){
    html  += `<option value="${value}">${value}</option>`;
  });
  return html;
}

function div_inmubles(data){
    let html_inmu = '';
  $.each(data,function(i,value){
  });
  return html_inmu;
}

function fn_search(){
  var city = $("#selectCiudad").val();
  var type = $("#selectTipo").val();
  var range = $("#rangoPrecio").val();
  let html_inmu = "";
  $("#result_search").html(html_inmu);

  $.getJSON('data-1.json',function(data){
    $.each(data,function(i,value){
      var div_inm = false;
      if(city != '' && type != ''){
        if(value.Ciudad == city && value.Tipo == type){
          div_inm = true;
        }
      }else if(city == '' && type != ''){
        if(value.Tipo == type){
          div_inm = true;
        }
      }else if(city != '' && type == ''){
        if(value.Ciudad == city){
          div_inm = true;
        }
      }else if(city == '' && type == ''){
        div_inm = true;
      }

      if(div_inm == true){
        html_inmu += `<div class="colContenido_venta" id="div_venta_${i}">
          <div class="card" style="justify-content: center;">
            <div class="row"><div class="col" style="left: 1.5%;top: 7px;"><img src="img/home.jpg" width="80%" height="80%">
              </div><div class="col" style="top: 7px;">
                <span><b>Dirección:</b> ${value.Direccion}</span><br>
                <span><b>Ciudad:</b> ${value.Ciudad}</span><br>
                <span><b>Teléfono:</b> ${value.Telefono}</span><br>
                <span><b>Codigo Postal:</b> ${value.Codigo_Postal}</span><br>
                <span><b>Tipo:</b> ${value.Tipo}</span><br>
                <span><b>Precio:</b> ${value.Precio}</span><br>         
                <div class="botonField">
                  <input type="submit" class="btn green white-text" value="Guardar" id="saveButton" onclick="fn_save_inmb(${value.Id})">
                </div>
              </div></div></div></div>`;
      }
    });
    $("#result_search").html(html_inmu);
  });
}

function fn_save_inmb(id){
  $.ajax({
    type: "POST",
    url: 'lib/instancia.php/store_inmuble',
    dataType: "JSON",
    data: {'id':id, 'accion': 'store_inmuble'},
    success: function (response) {
      if(response.resp == 1){
        alert(response.msg);
        fn_get_inmb();
      }else{
        alert(response.msg);
      }
    }
  });
}

function fn_get_inmb(){
  var data_search=[];
  var html_inmu="";
  $("#result_search_my").html(html_inmu);
  $.ajax({
    type: "POST",
    url: 'lib/instancia.php/get_inmuble',
    dataType: "JSON",
    data: {'accion': 'get_inmuble'},
    success: function (response) {
      if(response.resp == 1){
        var datas = response.data;
        $.each(datas,function(i,value_data){
          data_search.push(value_data['id_inmueble']);
        });
        
        $.getJSON('data-1.json',function(datajson){
          $.each(datajson,function(i,value){
            if(data_search.indexOf((value.Id).toString()) != -1){
              html_inmu += `<div class="colContenido_venta" id="div_venta_${i}">
              <div class="card" style="justify-content: center;">
                <div class="row"><div class="col" style="left: 1.5%;top: 7px;"><img src="img/home.jpg" width="80%" height="80%">
                  </div><div class="col" style="top: 7px;">
                    <span><b>Dirección:</b> ${value.Direccion}</span><br>
                    <span><b>Ciudad:</b> ${value.Ciudad}</span><br>
                    <span><b>Teléfono:</b> ${value.Telefono}</span><br>
                    <span><b>Codigo Postal:</b> ${value.Codigo_Postal}</span><br>
                    <span><b>Tipo:</b> ${value.Tipo}</span><br>
                    <span><b>Precio:</b> ${value.Precio}</span><br>
                  </div></div></div></div>`;
            }
          });
          $("#result_search_my").html(html_inmu);
        });
      }
    }
  });
}

inicializarSlider();
playVideoOnScroll();
data_json();
fn_get_inmb();
$("#submitButton").on('click', function (e) {
  e.preventDefault()
  fn_search();
});