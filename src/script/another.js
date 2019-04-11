import axios from 'axios'
import logo from '../image/wp.png'

export default function () {
    let img = document.createElement('img')
    img.src = logo

    document.querySelector('.wrapper span').appendChild(img)

    axios.get('https://httpbin.org/json').then(console.log)
}
