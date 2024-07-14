import requests

def sendmessage(prompt):
    url = 'http://127.0.0.1:8000/communicate/'
    headers = {
        'Content-Type': 'application/form-data',
        # Si necesitas el token CSRF, descomenta la siguiente línea y reemplaza 'your-csrf-token' con el token real
        # 'X-CSRFToken': 'your-csrf-token'
    }
    body = {
        'prompt': prompt
    }

    response = requests.post(url, 
                             data=body)
    print('Response:', response.text)
    

prompt = 'What is the capital of Spain?'
sendmessage(prompt)