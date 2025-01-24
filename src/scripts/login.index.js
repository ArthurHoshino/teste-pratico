import navigate from '../../global/index.js'

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://127.0.0.1:8080/usuario/')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if (data.status === 200) {
            navigate('../dashboard/main/main.html')
        }
    })
    .catch(error => {console.log('Error:', error)})
})
