function llenar(){
    study = localStorage.getItem('selectedStudyData');

    /*{
  "_id": {
    "$oid": "66abccd9a47c8cd2dc5d7a2f"
  },
  "title": "Supermercados Honduras",
  "marketTarget": "Personas de Tegucigalpa ",
  "studyObjectives": "Determinar las preferencias de compra de las personas en tegucigalpa",
  "studyDate": "2024-08-01T11:58:49.882749-06:00",
  "studyStatus": 0
}*/

    if(study){
        estudio = JSON.parse(study);
        if(estudio.studyStatus == 0){
            document.getElementById('EstadoActualLBL').innerText = "Sin iniciar";
        }
        else if(estudio.studyStatus == 1){
            document.getElementById('EstadoActualLBL').innerText = "En curso";
        }
        else{
            document.getElementById('EstadoActualLBL').innerText = "Finalizado";
        }

        document.getElementById('FechaCreaciontxt').innerText = new Date(estudio.studyDate).toLocaleDateString();

        //sacar duracion del estudio a partir de la fecha de creacion
        var fecha = new Date(estudio.studyDate);
        var fechaActual = new Date();
        var duracion = fechaActual - fecha;
        document.getElementById('DuracionEstudioTXT').innerText = duracion;
    }
}