<?php
    include ('database.php'); 
    class Registre
    {
        public $bd;
        private $response=[];

        function __construct()
        {
            $this->bd = new database();
        }

        private function setResponse($response){
            $this->response=array_merge($response,$this->response);
            
        }

        public function getResponse(){
            return $this->response;
        }

        public function store_inmuble(){
            $id = $_POST['id'];
            $strSQL = "INSERT INTO `inmubles_selecionado` (`id_inmueble`,`ip_user`) VALUES (".$id.",'".($_SERVER['REMOTE_ADDR'])."');";
            $data = $this->bd->query($strSQL)->execute();
            if($data != false){
                $id = $this->bd->lastInsertId();
                $this->response['resp']=1;
                $this->response['msg']="Inmueble guardado Correctamente.";
            }else{
                $this->response['resp']=0;
                $this->response['msg']="Ha ocurrido un error con el Inmueble.";
            }
        }

        public function get_inmuble(){
            $strSQL = "SELECT * FROM inmubles_selecionado where ip_user='".($_SERVER['REMOTE_ADDR'])."'";
            $data = $this->bd->query($strSQL)->resultset();
            $this->response['resp']=1;
            $this->response['data']= $data;
        }

    }