document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("resetPasswordFormConfirm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const password1 = document.getElementById("ConfirmPassword01").value;
        const password2 = document.getElementById("ConfirmPassword02").value;
        const uidb64 = getParameterByName('uidb64');
        const token = getParameterByName('token');

        if (password1 !== password2) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        const data = {
            new_password1: password1,
            new_password2: password2
        };

        try {
            const response = await fetch(`http://127.0.0.1:8000/password-reset-confirm/${uidb64}/${token}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                window.location.href = "https://www.cheetah-research.ai/login/";
            } else {
                const result = await response.json();
                alert(result.error);
            }
        } catch (error) {
            alert("Ocurrió un error al enviar la solicitud.");
        }
    });

    function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
});
