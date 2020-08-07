<?php 
    require_once('Registre.php'); 

    $modulos=new Registre();
    $accion_model=$_POST['accion'];

    $modulos->$accion_model();
    $response=$modulos->getResponse();
    echo json_encode($response);
    exit();
