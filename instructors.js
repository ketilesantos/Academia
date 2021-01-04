const fs = require('fs')
const data = require('./data.json')
const {age, date} = require('./utils')

// Visualizar
exports.show = function(req, res){

    const { id } = req.params

    const foundInstructor = data.instructors.find((instructor) => {
        return instructor.id == id
    })

    if(!foundInstructor) {
        return res.send('Instructor not found!')
    }

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(','),
        create_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.create_at)
    }

    return res.render('instructors/show', {instructor})

}

// Criar
exports.post = function (req, res){
    const keys = Object.keys(req.body)

    for (key of keys){
        if (req.body[key] == ""){
            return res.send('Por favor, todos os campos devem ser preenchidos!')
        }
    }

    let {avatar_url, name, birth, gender, services} = req.body
    
    birth = Date.parse(birth)
    const id = Number(data.instructors.length + 1)
    const create_at = Date.now()
    
    data.instructors.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        services,
        create_at
    })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send('Erro ao escrever o arquivo!')

        return res.redirect("/instructors");
    })
}

//Editar
exports.edit = function(req, res){
    const { id } = req.params

    const foundInstructor = data.instructors.find((instructors) => {
        return instructors.id == id
    })

    if(!foundInstructor) {
        return res.send('Instructor not found!')
    }

    const instructor = {
        ...foundInstructor,
        birth: date(foundInstructor.birth)

    }

    return res.render("instructors/edit", {instructor})
}