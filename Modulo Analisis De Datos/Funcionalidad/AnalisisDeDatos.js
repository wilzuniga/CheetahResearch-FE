// agregarCard.js


function content() {
    
    const url = "http://ec2-44-203-206-68.compute-1.amazonaws.com/getSummaries/669ee33ec2af27bcc4720342";

    axios.get(url)
        .then(function (response) {
            // handle success
            console.log(response.data);
            var data = response.data;
            stringresponse= data.general.narrative.General;
            const coso = marked(stringresponse);


            //jsonstring = JSON.stringify(data);
            const htmlString = coso;

            agregarCard("Analisis de Datos, Resumen General", htmlString);
        }
        )
        .catch(function (error) {
            // handle error
            console.log(error);
        }
        )
        .then(function () {
            // always executed
        }
        );

}







