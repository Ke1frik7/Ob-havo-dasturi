let parent = renderElement(".cards")
let form = renderElement("form")
form.addEventListener("submit", handleSub)
let template = renderElement("template").content
let input = renderElement("input")
let result = []
let errors = () => {
    parent.innerHTML = null
    let h1 = createTag("h1")
    h1.appendChild(textNode("Mavjud bulmagan shahar qidirildi"))
    h1.style.color = "crimson"
    h1.style.fontSize = "30px"
    parent.appendChild(h1)
}
function handleSub(event){
    event.preventDefault()
    let inputValue = input.value
    expert( inputValue)
    .catch((error) => {
        if(error.response.status === 404){
            errors()
        }
        
    })
}
;(async function(){
    let url = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Samarkand&appid=3d17197cb08ab8c23ac139348e444742", {
        method: "GET"
    })
    let json = await url.json()
    result = [json]
    renders(result)
}())
let renders = (arr) => {
    parent.innerHTML = null
   for(let i = 0; i<arr.length; i++){
        let clone = template.cloneNode(true)
        let name = clone.querySelector(".card-title")
        name.textContent = arr[i].name
        let cloud = clone.querySelector(".card-text")
        cloud.textContent = arr[i].clouds.all
        let gradus = clone.querySelector(".cradus")
        gradus.textContent =Math.round( arr[i].main.temp) + "°"
        let btn = clone.querySelector(".card-btn")
        btn.dataset.id = arr[i].id
        parent.appendChild(clone)
   }
}

async function expert (value ){
    let fetchs = await axios({
        url: `https://api.openweathermap.org/data/2.5/weather?q=${value}&appid=3d17197cb08ab8c23ac139348e444742`,
        method: "GET",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    let response = await fetchs.data
    result = [...result, response]
    if(result.length > 1){
        result.splice(0, 1)
    }
    renders(result)
}
let object = {
    name: null,
    temp: null,

}
let alls = []
let locals = renderElement(".div-locals")
window.addEventListener("click", (e) => {
    if(e.target.matches(".Locals-btn")){
        locals.classList.toggle("block")
    }
    if(e.target.matches(".card-btn")){
        let id = Number(e.target.dataset.id)
        for(let i = 0; i<result.length; i++){
            if(!alls.includes(result[i])){
                alls  = [result[i]]
                console.log(alls)
                for(let i  = 0; i<alls.length; i++){
                    console.log(alls[i])
                    window.localStorage.setItem("date", JSON.stringify(alls[i]))
                    let parses = JSON.parse(window.localStorage.getItem("date"))
                    let li = createTag("li")
                    let h2 = createTag("h2")
                    h2.textContent = parses.name + " "
                    let span = createTag("span")
                    span.appendChild(textNode(Math.round(parses.main.temp)))
                    h2.appendChild(span)
                    let btn = createTag("button")
                    btn.appendChild(textNode("Uchirish"))
                    btn.dataset.id = parses.id
                    btn.addEventListener("click" ,  handleClick)
                    li.appendChild(h2)
                    li.appendChild(btn)
                    locals.appendChild(li)
                }
            }
        }
    }
})
let parses = JSON.parse(window.localStorage.getItem("date"))
let li = createTag("li")
let h2 = createTag("h2")
h2.textContent = parses.name + " "
let span = createTag("span")
span.appendChild(textNode(Math.round(parses.main.temp)))
h2.appendChild(span)
let btn = createTag("button")
btn.appendChild(textNode("Uchirish"))
btn.dataset.id = parses.id
btn.addEventListener("click", handleClick)
li.appendChild(h2)
li.appendChild(btn)
locals.appendChild(li)
function handleClick(e){
    let parens = e.target.parentNode
    let id = e.target.dataset.id
    for(let i = 0; i<alls.length; i++){
        if(id == alls[i].id){
            alls.splice(i, 1)
        }
    }
    parens.remove()   
}